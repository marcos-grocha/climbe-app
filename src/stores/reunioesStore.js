import { defineStore } from 'pinia'
import {
  listarReunioes,
  buscarReuniaoPorId as buscarReuniaoPorIdService,
  criarReuniao as criarReuniaoService,
  atualizarReuniao as atualizarReuniaoService,
  listarSalas as listarSalasService,
  listarParticipantes as listarParticipantesService,
  verificarDisponibilidadeSala as verificarDisponibilidadeService,
} from '@/services/reunioesService'

export const useReunioesStore = defineStore('reunioes', {
  state: () => ({
    reunioes: [],
    salas: [],
    participantes: [],
    carregando: false,
  }),
  actions: {
    async carregarReunioes() {
      this.carregando = true
      try {
        const dados = await listarReunioes()
        this.reunioes = dados
        return dados
      } finally {
        this.carregando = false
      }
    },
    async buscarReuniaoPorId(id) {
      return await buscarReuniaoPorIdService(id)
    },
    async criarReuniao(payload) {
      const novaReuniao = await criarReuniaoService(payload)
      this.reunioes.push(novaReuniao)
      return novaReuniao
    },
    async atualizarReuniao(id, payload) {
      const reuniaoAtualizada = await atualizarReuniaoService(id, payload)
      this.reunioes = this.reunioes.map((reuniao) =>
        reuniao.id === Number(id) ? reuniaoAtualizada : reuniao,
      )
      return reuniaoAtualizada
    },
    async carregarSalas() {
      const dados = await listarSalasService()
      this.salas = dados
      return dados
    },
    async carregarParticipantes() {
      const dados = await listarParticipantesService()
      this.participantes = dados
      return dados
    },
    async verificarDisponibilidade(salaId, dataHora, reuniaoIdAtual) {
      return await verificarDisponibilidadeService(salaId, dataHora, reuniaoIdAtual)
    },
  },
})
