<script setup>
import { onMounted, computed } from 'vue'
import { useAgendaStore } from '@/stores/agendaStore'
import { formatarDataCurta } from '@/utils/dateUtils'
import ClimbeCard from '@/components/ui/ClimbeCard.vue'
import ClimbeBadge from '@/components/ui/ClimbeBadge.vue'

const agendaStore = useAgendaStore()

onMounted(() => {
  agendaStore.fetchAgendaSemana()
})

const reunioesEVencimentos = computed(() => agendaStore.itens)

const temItens = computed(() => reunioesEVencimentos.value.length > 0)
</script>

<template>
  <ClimbeCard variant="solid" padding="lg" class="h-full">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h3 class="text-[1.1rem] m-0 font-heavy">Agenda da Semana</h3>
      </div>
    </template>

    <div
      v-if="agendaStore.loading"
      class="flex flex-col items-center justify-center py-8 gap-3 text-climbe-text-muted"
    >
      <div
        class="w-6 h-6 border-2 border-climbe-primary border-t-transparent rounded-full animate-spin"
      ></div>
      <span class="text-[0.9rem]">Carregando agenda...</span>
    </div>

    <div v-else-if="agendaStore.error" class="py-6 text-center text-climbe-danger">
      {{ agendaStore.error }}
    </div>

    <div
      v-else-if="!temItens"
      class="py-10 text-center flex flex-col items-center justify-center gap-2 text-climbe-text-muted"
    >
      <span class="text-[2rem]">☕</span>
      <p class="text-[0.95rem] m-0">Nenhuma reunião ou vencimento nesta semana.</p>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="item in reunioesEVencimentos"
        :key="item.id"
        class="flex flex-col sm:flex-row justify-between sm:items-center p-3 rounded-md border border-climbe-neutral-border bg-climbe-neutral-mute gap-3 transition-colors hover:bg-climbe-primary-light"
        :class="{
          'border-l-4 !border-l-climbe-danger': item.tipo === 'vencimento',
          'border-l-4 !border-l-climbe-primary': item.tipo === 'reuniao',
        }"
      >
        <div class="flex flex-col gap-1">
          <span class="font-heavy text-[0.95rem] text-climbe-text-main leading-tight">{{
            item.titulo
          }}</span>
          <span class="text-[0.8rem] text-climbe-text-muted flex items-center gap-1">
            🕒 {{ formatarDataCurta(item.data) }}
          </span>
        </div>

        <div class="shrink-0">
          <ClimbeBadge v-if="item.tipo === 'vencimento'" variant="danger">Vencimento</ClimbeBadge>
          <ClimbeBadge v-else variant="primary">Reunião</ClimbeBadge>
        </div>
      </div>
    </div>
  </ClimbeCard>
</template>
