import keycloak, { keycloakInitOptions } from '@/config/keycloak'
import type { User } from '@/types/user'

export class KeycloakService {
  private static instance: KeycloakService
  private initialized = false

  static getInstance(): KeycloakService {
    if (!KeycloakService.instance) {
      KeycloakService.instance = new KeycloakService()
    }
    return KeycloakService.instance
  }

  /**
   * 初始化 Keycloak
   */
  async init(): Promise<boolean> {
    try {
      console.log('正在初始化 Keycloak...')
      const authenticated = await keycloak.init(keycloakInitOptions)
      this.initialized = true
      
      console.log('Keycloak 初始化完成，认证状态:', authenticated)
      console.log('Token:', keycloak.token ? '已获取' : '未获取')
      
      // 设置 token 刷新
      this.setupTokenRefresh()
      
      return authenticated
    } catch (error) {
      console.error('Keycloak 初始化失败:', error)
      throw error
    }
  }

  /**
   * 登录
   */
  login(): void {
    keycloak.login({
      redirectUri: window.location.origin
    })
  }

  /**
   * 登出
   */
  logout(): void {
    keycloak.logout({
      redirectUri: window.location.origin
    })
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return keycloak.authenticated || false
  }

  /**
   * 获取访问令牌
   */
  getToken(): string | undefined {
    return keycloak.token
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | undefined {
    return keycloak.refreshToken
  }

  /**
   * 获取用户信息
   */
  getUserInfo(): User | null {
    if (!keycloak.tokenParsed) {
      return null
    }

    const tokenParsed = keycloak.tokenParsed as any
    
    return {
      id: tokenParsed.sub,
      username: tokenParsed.preferred_username || tokenParsed.sub,
      name: tokenParsed.name || tokenParsed.preferred_username,
      email: tokenParsed.email || '',
      role: this.getUserRole(tokenParsed),
      avatar: ''
    }
  }

  /**
   * 获取用户角色
   */
  private getUserRole(tokenParsed: any): string {
    // 从 realm_access.roles 中获取角色
    if (tokenParsed.realm_access?.roles) {
      const roles = tokenParsed.realm_access.roles
      if (roles.includes('admin')) return 'admin'
      if (roles.includes('manager')) return 'manager'
      if (roles.includes('user')) return 'user'
    }
    
    // 从 resource_access 中获取客户端角色
    const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'mms-frontend'
    if (tokenParsed.resource_access?.[clientId]?.roles) {
      const clientRoles = tokenParsed.resource_access[clientId].roles
      if (clientRoles.includes('admin')) return 'admin'
      if (clientRoles.includes('manager')) return 'manager'
      if (clientRoles.includes('user')) return 'user'
    }
    
    return 'user'
  }

  /**
   * 检查用户是否有指定角色
   */
  hasRole(role: string): boolean {
    if (!keycloak.tokenParsed) return false
    
    const tokenParsed = keycloak.tokenParsed as any
    
    // 检查 realm 角色
    if (tokenParsed.realm_access?.roles?.includes(role)) {
      return true
    }
    
    // 检查客户端角色
    const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'mms-frontend'
    if (tokenParsed.resource_access?.[clientId]?.roles?.includes(role)) {
      return true
    }
    
    return false
  }

  /**
   * 刷新令牌
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await keycloak.updateToken(30)
      return refreshed
    } catch (error) {
      console.error('Token 刷新失败:', error)
      return false
    }
  }

  /**
   * 设置自动刷新令牌
   */
  private setupTokenRefresh(): void {
    // 每 30 秒检查一次 token 是否需要刷新
    setInterval(async () => {
      try {
        await keycloak.updateToken(70) // 如果 token 在 70 秒内过期则刷新
      } catch (error) {
        console.error('自动刷新 token 失败:', error)
        // 如果刷新失败，可能需要重新登录
        if (this.isAuthenticated()) {
          this.logout()
        }
      }
    }, 30000)
  }

  /**
   * 获取 Keycloak 实例（用于高级用法）
   */
  getKeycloakInstance() {
    return keycloak
  }

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized
  }
}

export default KeycloakService.getInstance()