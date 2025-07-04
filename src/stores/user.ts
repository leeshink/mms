import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User } from '@/types/user'
import keycloakService from '@/services/keycloak'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')

  const isLoggedIn = computed(() => {
    return keycloakService.isAuthenticated()
  })

  /**
   * Keycloak SSO 登录
   */
  const loginWithKeycloak = () => {
    keycloakService.login()
  }

  /**
   * 登出
   */
  const logout = () => {
    if (keycloakService.isAuthenticated()) {
      keycloakService.logout()
    }
    // 清理本地状态
    user.value = null
    token.value = ''
  }

  /**
   * 初始化用户信息
   */
  const initUser = () => {
    if (keycloakService.isAuthenticated()) {
      // 从 Keycloak 获取用户信息
      const keycloakUser = keycloakService.getUserInfo()
      if (keycloakUser) {
        user.value = keycloakUser
        token.value = keycloakService.getToken() || ''
      }
    }
  }

  /**
   * 检查用户是否有指定角色
   */
  const hasRole = (role: string): boolean => {
    return keycloakService.hasRole(role)
  }

  /**
   * 获取当前 token
   */
  const getToken = (): string => {
    return keycloakService.getToken() || ''
  }

  /**
   * 刷新 token
   */
  const refreshToken = async (): Promise<boolean> => {
    const refreshed = await keycloakService.refreshToken()
    if (refreshed) {
      token.value = keycloakService.getToken() || ''
    }
    return refreshed
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isLoggedIn,
    loginWithKeycloak,
    logout,
    initUser,
    hasRole,
    getToken,
    refreshToken
  }
})