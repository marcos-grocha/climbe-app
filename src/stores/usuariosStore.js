import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as usuariosService from '@/services/usuariosService'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const cargos = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  const totalAdmins = computed(() => usuarios.value.filter((u) => u.papel === 'admin').length)
  const totalAnalistas = computed(() => usuarios.value.filter((u) => u.papel === 'analista').length)
  const totalAtivos = computed(() => usuarios.value.filter((u) => u.situacao === 'ativo').length)

  // Retorna o nome do cargo por ID, útil para a DataTable
  function getNomeCargo(idCargo) {
    const cargo = cargos.value.find((c) => c.id_cargo === idCargo)
    return cargo ? cargo.nome_cargo : 'Desconhecido'
  }

  async function carregarDados() {
    carregando.value = true
    erro.value = null
    try {
      const [usuariosData, cargosData] = await Promise.all([
        usuariosService.listarUsuarios(),
        usuariosService.listarCargos(),
      ])
      usuarios.value = usuariosData
      cargos.value = cargosData
    } catch (err) {
      erro.value = err?.message || 'Erro ao carregar os dados.'
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function criarUsuario(payload) {
    carregando.value = true
    erro.value = null
    try {
      const novoUsuario = await usuariosService.criarUsuario(payload)
      usuarios.value.push(novoUsuario)
    } catch (err) {
      erro.value = err?.message || 'Erro ao criar usuário.'
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function atualizarUsuario(id, payload) {
    carregando.value = true
    erro.value = null
    try {
      const usuarioAtualizado = await usuariosService.atualizarUsuario(id, payload)
      const idx = usuarios.value.findIndex((u) => u.id === id)
      if (idx !== -1) {
        usuarios.value[idx] = { ...usuarios.value[idx], ...usuarioAtualizado }
      }
    } catch (err) {
      erro.value = err?.message || 'Erro ao atualizar usuário.'
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function inativarUsuario(id) {
    carregando.value = true
    erro.value = null
    try {
      await usuariosService.inativarUsuario(id)
      const idx = usuarios.value.findIndex((u) => u.id === id)
      if (idx !== -1) {
        usuarios.value[idx].situacao = 'inativo'
      }
    } catch (err) {
      erro.value = err?.message || 'Erro ao inativar usuário.'
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function reativarUsuario(id) {
    carregando.value = true
    erro.value = null
    try {
      const usuarioReativado = await usuariosService.reativarUsuario(id)
      const idx = usuarios.value.findIndex((u) => u.id === id)
      if (idx !== -1) {
        usuarios.value[idx] = { ...usuarios.value[idx], ...usuarioReativado }
      }
    } catch (err) {
      erro.value = err?.message || 'Erro ao reativar usuário.'
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function toggleStatus(id) {
    const usuario = usuarios.value.find((u) => u.id === id)
    if (!usuario) return

    if (usuario.situacao === 'ativo') {
      await inativarUsuario(id)
    } else {
      await reativarUsuario(id)
    }
  }

  return {
    usuarios,
    cargos,
    carregando,
    erro,
    totalAdmins,
    totalAnalistas,
    totalAtivos,
    getNomeCargo,
    carregarDados,
    criarUsuario,
    atualizarUsuario,
    inativarUsuario,
    reativarUsuario,
    toggleStatus,
  }
})
