import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('@/views/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表板', icon: 'DataBoard' }
      },
      {
        path: '/merchants',
        name: 'Merchants',
        component: () => import('@/views/Merchants.vue'),
        meta: { title: '商户管理', icon: 'Shop' }
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        meta: { title: '订单管理', icon: 'Document' }
      },
      {
        path: '/finance',
        name: 'Finance',
        component: () => import('@/views/Finance.vue'),
        meta: { title: '财务管理', icon: 'Money' }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: { title: '系统设置', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 如果启用了 Keycloak，需要等待初始化完成
  if (userStore.isKeycloakEnabled) {
    try {
      const keycloakService = (await import('@/services/keycloak')).default
      
      // 如果 Keycloak 还未初始化
      if (!keycloakService.isInitialized()) {
        // 如果不是登录页面，则跳转到登录页面让其初始化
        if (to.path !== '/login') {
          next('/login')
          return
        }
        // 如果是登录页面，让其继续，在登录页面中会进行初始化
      } else {
        // Keycloak 已初始化，检查认证状态
        if (keycloakService.isAuthenticated()) {
          userStore.initUser()
          // 如果已认证且访问登录页，重定向到仪表板
          if (to.path === '/login') {
            next('/dashboard')
            return
          }
        }
      }
    } catch (error) {
      console.error('路由守卫中 Keycloak 检查失败:', error)
      // 如果 Keycloak 服务出错，回退到传统认证
      userStore.setKeycloakEnabled(false)
    }
  }
  
  // 检查路由权限
  if (to.meta.requiresAuth !== false && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router