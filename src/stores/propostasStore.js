import { defineStore } from 'pinia'
import {
  listarPropostas as listarPropostasService,
  buscarPropostaPorId as buscarPropostaPorIdService,
  criarProposta as criarPropostaService,
  atualizarProposta as atualizarPropostaService,
  aprovarProposta as aprovarPropostaService,
  recusarProposta as recusarPropostaService,
} from '@/services/propostasService'

export const usePropostasStore = defineStore('propostas', {
  state: () => ({
    propostas: [],
    carregando: false,
  }),
  actions: {
    async listarPropostas() {
      this.carregando = true
      try {
        const dados = await listarPropostasService()
        this.propostas = dados
        return dados
      } finally {
        this.carregando = false
      }
    },
    async buscarPropostaPorId(id) {
      return buscarPropostaPorIdService(id)
    },
    async criarProposta(dadosProposta) {
      const novaProposta = await criarPropostaService(dadosProposta)
      this.propostas.push(novaProposta)
      return novaProposta
    },
    async atualizarProposta(id, dadosProposta) {
      const propostaAtualizada = await atualizarPropostaService(id, dadosProposta)
      this.propostas = this.propostas.map((proposta) =>
        proposta.id === Number(id) ? propostaAtualizada : proposta,
      )
      return propostaAtualizada
    },
    async aprovarProposta(id) {
      const propostaAtualizada = await aprovarPropostaService(id)
      this.propostas = this.propostas.map((proposta) =>
        proposta.id === Number(id) ? propostaAtualizada : proposta,
      )
      return propostaAtualizada
    },
    async recusarProposta(id, motivoRecusa) {
      const propostaAtualizada = await recusarPropostaService(id, motivoRecusa)
      this.propostas = this.propostas.map((proposta) =>
        proposta.id === Number(id) ? propostaAtualizada : proposta,
      )
      return propostaAtualizada
    },
  },
})
