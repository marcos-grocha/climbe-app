import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/services/http.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const estaAutenticado = computed(() => !!token.value && !!user.value)

  async function login(email, senha) {
    loading.value = true
    error.value = null
    try {
      // MOCK: Para contornar a falta do backend rodando na porta 8000
      // simulamos um login bem-sucedido
      token.value = 'mock-jwt-token'
      localStorage.setItem('token', 'mock-jwt-token')
      user.value = { nome: 'Usuário Mock', email: email }
      
      // Se houvesse backend:
      /*
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', senha)

      const { data } = await http.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      token.value = data.access_token
      localStorage.setItem('token', data.access_token)

      await fetchMe()
      */
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    // MOCK: Retorna usuário fake instantaneamente sem chamar o backend
    // para evitar que o Axios dispare erros 401 ou de rede
    user.value = { nome: 'Usuário Mock', email: 'mock@climbe.com' }
    
    // Se houvesse backend:
    /*
    const { data } = await http.get('/auth/me')
    user.value = data
    */
  }

  async function restoreSession() {
    if (!token.value) return false

    try {
      await fetchMe()
      return true
    } catch {
      // Se der 401, o interceptor do http.js fará o redirect e apaga o token do localStorage
      // Mas para limpar o estado da store e remover lixos do mock, chamamos logout internamente (sem o router push para evitar loop)
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('climb-auth')
      localStorage.removeItem('climb-user-email')
      return false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    // Limpar lixos legados do mock
    localStorage.removeItem('climb-auth')
    localStorage.removeItem('climb-user-email')
  }

  return { token, user, loading, error, estaAutenticado, login, fetchMe, restoreSession, logout }
})
