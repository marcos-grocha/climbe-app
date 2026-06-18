import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usuariosMock } from '@/mocks/usuariosMock'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([...usuariosMock])
  const carregando = ref(false)
  const erro = ref(null)

  const totalAdmins = computed(() => usuarios.value.filter((u) => u.perfil === 'admin').length)
  const totalUsuarios = computed(() => usuarios.value.filter((u) => u.perfil === 'usuario').length)
  const totalAtivos = computed(() => usuarios.value.filter((u) => u.status === 'ativo').length)

  async function carregarUsuarios() {
    carregando.value = true
    erro.value = null
    try {
      // Mock: simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 400))
      usuarios.value = [...usuariosMock]
    } catch (err) {
      erro.value = err?.message || 'Erro ao carregar usuários.'
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function criarUsuario(payload) {
    carregando.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const novoId = Math.max(...usuarios.value.map((u) => u.id)) + 1
      const avatar = payload.nome_completo
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
      usuarios.value.push({
        id: novoId,
        ...payload,
        avatar,
        ultimo_acesso: '—',
        status: 'ativo',
      })
    } finally {
      carregando.value = false
    }
  }

  async function atualizarUsuario(id, payload) {
    carregando.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const idx = usuarios.value.findIndex((u) => u.id === id)
      if (idx !== -1) {
        usuarios.value[idx] = { ...usuarios.value[idx], ...payload }
      }
    } finally {
      carregando.value = false
    }
  }

  async function toggleStatus(id) {
    const usuario = usuarios.value.find((u) => u.id === id)
    if (!usuario) return
    await atualizarUsuario(id, {
      status: usuario.status === 'ativo' ? 'inativo' : 'ativo',
    })
  }

  async function excluirUsuario(id) {
    carregando.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      usuarios.value = usuarios.value.filter((u) => u.id !== id)
    } finally {
      carregando.value = false
    }
  }

  return {
    usuarios,
    carregando,
    erro,
    totalAdmins,
    totalUsuarios,
    totalAtivos,
    carregarUsuarios,
    criarUsuario,
    atualizarUsuario,
    toggleStatus,
    excluirUsuario,
  }
})
