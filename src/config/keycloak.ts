import Keycloak from 'keycloak-js'

// Keycloak 配置
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'mms',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'mms-frontend'
}

// 创建 Keycloak 实例
const keycloak = new Keycloak(keycloakConfig)

// Keycloak 初始化选项
export const keycloakInitOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false,
  pkceMethod: 'S256' as const
}

export default keycloak