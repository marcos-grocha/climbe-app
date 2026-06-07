import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/empresas',
      name: 'empresas',
      component: () => import('@/views/EmpresasListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/empresas/nova',
      name: 'empresa-nova',
      component: () => import('@/views/EmpresaFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/empresas/:id/editar',
      name: 'empresa-editar',
      component: () => import('@/views/EmpresaFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/contratos',
      name: 'contratos',
      component: () => import('../views/contratos/ContratosListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/contratos/:id',
      name: 'contrato-detalhe',
      component: () => import('../views/contratos/ContratoDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/propostas',
      name: 'propostas',
      component: () => import('@/views/PropostasListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/propostas/nova',
      name: 'proposta-nova',
      component: () => import('@/views/PropostaFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/propostas/:id/editar',
      name: 'proposta-editar',
      component: () => import('@/views/PropostaFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/contratos',
      name: 'contratos',
      component: () => import('../views/contratos/ContratosListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/contratos/:id',
      name: 'contrato-detalhe',
      component: () => import('../views/contratos/ContratoDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/documentos',
      name: 'documentos',
      component: () => import('../views/DocumentosView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

import { useAuthStore } from '@/stores/auth'

// Controle de Acesso (Navigation Guard)
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const hasToken = !!localStorage.getItem('token')
  const requiresAuth = to.meta.requiresAuth
  const guestOnly = to.meta.guestOnly

  if (requiresAuth) {
    if (!hasToken) {
      next({ name: 'login' })
    } else {
      if (!authStore.user) {
        const restored = await authStore.restoreSession()
        if (!restored) {
          next({ name: 'login' })
          return
        }
      }
      next()
    }
  } else if (guestOnly) {
    if (hasToken) {
      if (!authStore.user) {
        const restored = await authStore.restoreSession()
        if (restored) {
          next({ name: 'home' })
          return
        }
      } else {
        next({ name: 'home' })
        return
      }
    }
    next()
  } else {
    next()
  }
})

export default router
