import { defineStore } from 'pinia'
import {
  listarEmpresas,
  criarEmpresa as criarEmpresaService,
  atualizarEmpresa as atualizarEmpresaService,
  excluirEmpresa as excluirEmpresaService,
  obterEmpresa as obterEmpresaService,
} from '@/services/empresasService'

export const useEmpresasStore = defineStore('empresas', {
  state: () => ({
    empresas: [],
    carregando: false,
  }),
  actions: {
    async carregarEmpresas() {
      this.carregando = true
      try {
        const dados = await listarEmpresas()
        this.empresas = dados
        return dados
      } finally {
        this.carregando = false
      }
    },
    async buscarEmpresaPorId(id) {
      this.carregando = true
      try {
        const empresa = await obterEmpresaService(id)
        return empresa
      } finally {
        this.carregando = false
      }
    },
    async criarEmpresa(payload) {
      const novaEmpresa = await criarEmpresaService(payload)
      this.empresas.push(novaEmpresa)
      return novaEmpresa
    },
    async atualizarEmpresa(id, payload) {
      const empresaAtualizada = await atualizarEmpresaService(id, payload)
      this.empresas = this.empresas.map((empresa) =>
        empresa.id === id ? empresaAtualizada : empresa,
      )
      return empresaAtualizada
    },
    async excluirEmpresa(id) {
      await excluirEmpresaService(id)
      this.empresas = this.empresas.filter((empresa) => empresa.id !== id)
    },
  },
})
