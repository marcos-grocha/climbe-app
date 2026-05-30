import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/services/http.js'
import router from '@/router/index.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('usuario')) || null)

  const estaAutenticado = computed(() => !!token.value)

  async function login(email, senha) {
    const { data } = await http.post('/auth/login', { email, senha })
    token.value = data.access_token
    usuario.value = data.usuario
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    router.push('/')
  }

  function logout() {
    token.value = null
    usuario.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    router.push('/login')
  }

  return { token, usuario, estaAutenticado, login, logout }
})
