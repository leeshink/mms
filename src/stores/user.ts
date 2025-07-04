import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')

  const isLoggedIn = computed(() => !!token.value)

  const login = async (username: string, password: string) => {
    try {
      // 这里应该调用实际的登录API
      // const response = await api.login({ username, password })
      
      // 模拟登录
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

  const logout = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const initFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isLoggedIn,
    login,
    logout,
    initFromStorage
  }
})