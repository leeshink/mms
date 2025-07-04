<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>商户管理系统</h1>
        <p>Merchant Management System</p>
      </div>
      
      <!-- SSO 登录 -->
      <div class="sso-login">
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
        <p class="sso-description">通过企业单点登录系统安全登录</p>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import keycloakService from '@/services/keycloak'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const loginStatus = ref<{ message: string; type: 'success' | 'warning' | 'info' | 'error' } | null>(null)

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
 * 初始化
 */
onMounted(async () => {
  // 检查是否已经通过 Keycloak 认证
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
      message: 'SSO 服务暂时不可用，请联系系统管理员', 
      type: 'error' 
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
  margin-bottom: 40px;
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
  text-align: center;
  margin-bottom: 20px;
}

.sso-description {
  color: #666;
  font-size: 14px;
  margin-top: 12px;
  margin-bottom: 0;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  margin-bottom: 16px;
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

.sso-description {
  color: #666;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
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