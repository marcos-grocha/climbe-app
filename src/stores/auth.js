import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/services/http.js'
import router from '@/router/index.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)

  const estaAutenticado = computed(() => !!token.value)

  async function login(email, senha) {
    const params = new URLSearchParams()
    params.append('username', email)
    params.append('password', senha)

    const { data } = await http.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    
    token.value = data.access_token
    localStorage.setItem('token', data.access_token)
    // Removed router.push from here so the view can handle success/error state
  }

  function logout() {
    token.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { token, estaAutenticado, login, logout }
})
