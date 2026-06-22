import { defineStore } from 'pinia'
import {
  listarNotificacoes,
  marcarComoLida,
  gerarNovaNotificacao,
} from '@/services/notificationsService'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    carregando: false,
  }),
  getters: {
    unreadCount(state) {
      return state.notifications.filter((n) => !n.read).length
    },
  },
  actions: {
    async fetchNotifications() {
      this.carregando = true
      try {
        const dados = await listarNotificacoes()
        this.notifications = dados
        return dados
      } finally {
        this.carregando = false
      }
    },
    async markAsRead(id) {
      try {
        await marcarComoLida(id)
        const notificacao = this.notifications.find((n) => n.id === id)
        if (notificacao) {
          notificacao.read = true
        }
      } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error)
      }
    },
    async pollNewNotifications() {
      try {
        const nova = await gerarNovaNotificacao()
        // Adiciona a nova notificação no início da lista
        this.notifications.unshift(nova)
        return nova
      } catch (error) {
        console.error('Erro ao fazer polling de notificações:', error)
      }
    },
  },
})
