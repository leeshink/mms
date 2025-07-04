import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      
      // 如果启用了 Keycloak，尝试刷新 token
      if (userStore.isKeycloakEnabled) {
        try {
          const refreshed = await userStore.refreshToken()
          if (refreshed) {
            // Token 刷新成功，重试原请求
            const token = userStore.getToken()
            error.config.headers.Authorization = `Bearer ${token}`
            return request(error.config)
          }
        } catch (refreshError) {
          console.error('Token 刷新失败:', refreshError)
        }
      }
      
      // Token 刷新失败或未启用 Keycloak，执行登出
      userStore.logout()
      window.location.href = '/login'
    } else {
      ElMessage.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request