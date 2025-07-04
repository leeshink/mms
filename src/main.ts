import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import './assets/styles/main.css'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})

// 初始化用户状态
const userStore = useUserStore()

// 根据环境变量决定是否启用 Keycloak
const keycloakEnabled = import.meta.env.VITE_KEYCLOAK_URL && 
                       import.meta.env.VITE_KEYCLOAK_REALM && 
                       import.meta.env.VITE_KEYCLOAK_CLIENT_ID

userStore.setKeycloakEnabled(!!keycloakEnabled)

// 如果不使用 Keycloak，从 localStorage 恢复用户状态
if (!keycloakEnabled) {
  userStore.initFromStorage()
}

app.mount('#app')