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
  ],
})

// Controle de Acesso (Navigation Guard)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('climb-auth') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redireciona para login se tentar acessar rota protegida sem estar autenticado
    next({ name: 'login' })
  } else if (to.meta.guestOnly && isAuthenticated) {
    // Redireciona para home se já estiver logado e tentar ir para o login
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
