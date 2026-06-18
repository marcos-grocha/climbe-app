import { defineStore } from 'pinia'
import { ref } from 'vue'
import { buscarAgendaSemana } from '@/services/agendaService'

export const useAgendaStore = defineStore('agenda', () => {
  const itens = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAgendaSemana() {
    loading.value = true
    error.value = null
    try {
      const data = await buscarAgendaSemana()
      // Ordenar por data/hora crescente
      itens.value = data.sort((a, b) => new Date(a.data) - new Date(b.data))
    } catch (err) {
      error.value = 'Falha ao carregar a agenda da semana.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return { itens, loading, error, fetchAgendaSemana }
})
