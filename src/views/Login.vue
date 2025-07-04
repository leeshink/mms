<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>商户管理系统</h1>
        <p>Merchant Management System</p>
      </div>
      
      <!-- Keycloak SSO 登录 -->
      <div v-if="userStore.isKeycloakEnabled" class="sso-login">
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          class="login-button sso-button"
          @click="handleSSOLogin"
        >
          <el-icon class="mr-2"><Key /></el-icon>
          使用 SSO 登录
        </el-button>
        
        <el-divider>
          <span class="divider-text">或</span>
        </el-divider>
        
        <el-button
          type="text"
          size="small"
          @click="toggleLoginMode"
        >
          使用用户名密码登录
        </el-button>
      </div>
      
      <!-- 传统用户名密码登录 -->
      <el-form
        v-show="!userStore.isKeycloakEnabled || showTraditionalLogin"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div v-if="userStore.isKeycloakEnabled" class="back-to-sso">
          <el-button
            type="text"
            size="small"
            @click="toggleLoginMode"
          >
            返回 SSO 登录
          </el-button>
        </div>
      </el-form>
      
      <div v-if="!userStore.isKeycloakEnabled" class="login-tips">
        <p>测试账号：admin / admin123</p>
      </div>
      
      <!-- 登录状态提示 -->
      <div v-if="loginStatus" class="login-status">
        <el-alert
          :title="loginStatus.message"
          :type="loginStatus.type"
          :closable="false"
          show-icon
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import keycloakService from '@/services/keycloak'
import type { LoginForm } from '@/types/user'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const showTraditionalLogin = ref(false)
const loginStatus = ref<{ message: string; type: 'success' | 'warning' | 'info' | 'error' } | null>(null)

const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

/**
 * SSO 登录
 */
const handleSSOLogin = async () => {
  loading.value = true
  loginStatus.value = { message: '正在跳转到 SSO 登录页面...', type: 'info' }
  
  try {
    // 确保 Keycloak 已初始化
    if (!keycloakService.isInitialized()) {
      loginStatus.value = { message: '正在初始化 SSO 服务...', type: 'info' }
      await keycloakService.init()
    }
    
    // 执行登录
    userStore.loginWithKeycloak()
  } catch (error) {
    loading.value = false
    loginStatus.value = { message: 'SSO 登录失败，请重试', type: 'error' }
    console.error('SSO 登录错误:', error)
  }
}

/**
 * 传统用户名密码登录
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      loginStatus.value = null
      
      try {
        const result = await userStore.login(loginForm.username, loginForm.password)
        if (result.success) {
          ElMessage.success('登录成功')
          router.push('/dashboard')
        } else {
          ElMessage.error(result.message || '登录失败')
          loginStatus.value = { message: result.message || '登录失败', type: 'error' }
        }
      } catch (error) {
        ElMessage.error('登录失败，请重试')
        loginStatus.value = { message: '登录失败，请重试', type: 'error' }
      } finally {
        loading.value = false
      }
    }
  })
}

/**
 * 切换登录模式
 */
const toggleLoginMode = () => {
  showTraditionalLogin.value = !showTraditionalLogin.value
  loginStatus.value = null
}

/**
 * 初始化
 */
onMounted(async () => {
  // 检查是否已经通过 Keycloak 认证
  if (userStore.isKeycloakEnabled) {
    try {
      loginStatus.value = { message: '正在检查认证状态...', type: 'info' }
      
      if (!keycloakService.isInitialized()) {
        const authenticated = await keycloakService.init()
        
        if (authenticated) {
          // 已经认证，初始化用户信息并跳转
          userStore.initUser()
          ElMessage.success('登录成功')
          // 使用 replace 而不是 push，避免用户按返回键回到登录页
          router.replace('/dashboard')
          return
        }
      } else if (keycloakService.isAuthenticated()) {
        // 已经认证，直接跳转
        userStore.initUser()
        ElMessage.success('登录成功')
        router.replace('/dashboard')
        return
      }
      
      loginStatus.value = null
    } catch (error) {
      console.error('Keycloak 初始化失败:', error)
      loginStatus.value = { 
        message: 'SSO 服务暂时不可用，请使用用户名密码登录', 
        type: 'warning' 
      }
      // 如果 Keycloak 初始化失败，可以选择禁用 SSO 或显示错误信息
      userStore.setKeycloakEnabled(false)
    }
  }
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.sso-login {
  margin-bottom: 20px;
}

.login-form {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.sso-button {
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border: none;
  transition: all 0.3s ease;
}

.sso-button:hover {
  background: linear-gradient(135deg, #337ecc 0%, #529b2e 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.divider-text {
  color: #999;
  font-size: 12px;
}

.back-to-sso {
  text-align: center;
  margin-top: 10px;
}

.login-tips {
  text-align: center;
  color: #999;
  font-size: 12px;
}

.login-tips p {
  margin: 4px 0;
}

.login-status {
  margin-top: 20px;
}

.mr-2 {
  margin-right: 8px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 30px 20px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
}

/* 动画效果 */
.login-box {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* SSO 登录按钮图标动画 */
.sso-button .el-icon {
  transition: transform 0.3s ease;
}

.sso-button:hover .el-icon {
  transform: rotate(5deg);
}
</style>