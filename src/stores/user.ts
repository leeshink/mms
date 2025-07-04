import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User } from '@/types/user'
import keycloakService from '@/services/keycloak'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const isKeycloakEnabled = ref(true) // 可以通过环境变量控制

  const isLoggedIn = computed(() => {
    if (isKeycloakEnabled.value) {
      return keycloakService.isAuthenticated()
    }
    return !!token.value
  })

  /**
   * Keycloak 登录
   */
  const loginWithKeycloak = () => {
    keycloakService.login()
  }

  /**
   * 传统用户名密码登录（备用方案）
   */
  const login = async (username: string, password: string) => {
    try {
      // 如果启用了 Keycloak，则不使用传统登录
      if (isKeycloakEnabled.value) {
        throw new Error('请使用 SSO 登录')
      }
      
      // 这里应该调用实际的登录API
      // const response = await api.login({ username, password })
      
      // 模拟登录（仅用于开发测试）
      if (username === 'admin' && password === 'admin123') {
        const mockUser: User = {
          id: 1,
          username: 'admin',
          name: '管理员',
          email: 'admin@example.com',
          role: 'admin',
          avatar: ''
        }
        
        user.value = mockUser
        token.value = 'mock-token-' + Date.now()
        
        // 保存到localStorage
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return { success: true }
      } else {
        throw new Error('用户名或密码错误')
      }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '登录失败' }
    }
  }

  /**
   * 登出
   */
  const logout = () => {
    if (isKeycloakEnabled.value && keycloakService.isAuthenticated()) {
      keycloakService.logout()
    } else {
      user.value = null
      token.value = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  /**
   * 初始化用户信息
   */
  const initUser = () => {
    if (isKeycloakEnabled.value && keycloakService.isAuthenticated()) {
      // 从 Keycloak 获取用户信息
      const keycloakUser = keycloakService.getUserInfo()
      if (keycloakUser) {
        user.value = keycloakUser
        token.value = keycloakService.getToken() || ''
      }
    } else {
      // 从 localStorage 恢复用户信息（传统方式）
      initFromStorage()
    }
  }

  /**
   * 从 localStorage 恢复用户信息
   */
  const initFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  /**
   * 检查用户是否有指定角色
   */
  const hasRole = (role: string): boolean => {
    if (isKeycloakEnabled.value) {
      return keycloakService.hasRole(role)
    }
    return user.value?.role === role
  }

  /**
   * 获取当前 token
   */
  const getToken = (): string => {
    if (isKeycloakEnabled.value) {
      return keycloakService.getToken() || ''
    }
    return token.value
  }

  /**
   * 刷新 token
   */
  const refreshToken = async (): Promise<boolean> => {
    if (isKeycloakEnabled.value) {
      const refreshed = await keycloakService.refreshToken()
      if (refreshed) {
        token.value = keycloakService.getToken() || ''
      }
      return refreshed
    }
    return false
  }

  /**
   * 设置 Keycloak 启用状态
   */
  const setKeycloakEnabled = (enabled: boolean) => {
    isKeycloakEnabled.value = enabled
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isLoggedIn,
    isKeycloakEnabled: readonly(isKeycloakEnabled),
    login,
    loginWithKeycloak,
    logout,
    initUser,
    initFromStorage,
    hasRole,
    getToken,
    refreshToken,
    setKeycloakEnabled
  }
})