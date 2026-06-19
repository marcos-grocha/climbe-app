<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  dataAtual: { type: Date, default: () => new Date() },
})

const emit = defineEmits(['mudarMes', 'selecionarDia'])

const mesExibido = ref(new Date(props.dataAtual))

const nomesMeses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const nomesDiasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const tituloMes = computed(() => {
  return `${nomesMeses[mesExibido.value.getMonth()]} de ${mesExibido.value.getFullYear()}`
})

const diasDoMes = computed(() => {
  const ano = mesExibido.value.getFullYear()
  const mes = mesExibido.value.getMonth()

  const primeiroDia = new Date(ano, mes, 1)
  const ultimoDia = new Date(ano, mes + 1, 0)
  const diasNoMes = ultimoDia.getDate()
  const diaSemanaInicio = primeiroDia.getDay()

  const dias = []

  // Dias vazios antes do início do mês
  for (let i = 0; i < diaSemanaInicio; i++) {
    dias.push({ numero: null, vazio: true })
  }

  // Dias do mês
  const hoje = new Date()
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataCompleta = new Date(ano, mes, dia)
    const ehHoje = dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
    dias.push({ numero: dia, vazio: false, ehHoje, data: dataCompleta })
  }

  return dias
})

const mesAnterior = () => {
  mesExibido.value = new Date(mesExibido.value.getFullYear(), mesExibido.value.getMonth() - 1, 1)
  emit('mudarMes', mesExibido.value)
}

const proximoMes = () => {
  mesExibido.value = new Date(mesExibido.value.getFullYear(), mesExibido.value.getMonth() + 1, 1)
  emit('mudarMes', mesExibido.value)
}

const clicarDia = (dia) => {
  if (dia.vazio) return
  emit('selecionarDia', dia.data)
}
</script>

<template>
  <div class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-xl p-4 w-full">
    <div class="flex items-center justify-between mb-3">
      <span class="text-climbe-text-main text-sm font-heavy capitalize">{{ tituloMes }}</span>
      <div class="flex items-center gap-1">
        <button
          class="w-6 h-6 rounded-full flex items-center justify-center text-climbe-text-muted hover:bg-white/10 transition-colors"
          @click="mesAnterior"
        >
          ‹
        </button>
        <button
          class="w-6 h-6 rounded-full flex items-center justify-center text-climbe-text-muted hover:bg-white/10 transition-colors"
          @click="proximoMes"
        >
          ›
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-y-1 text-center">
      <span
        v-for="(dia, idx) in nomesDiasSemana"
        :key="idx"
        class="text-[0.65rem] text-climbe-text-muted font-heavy"
      >
        {{ dia }}
      </span>

      <button
        v-for="(dia, idx) in diasDoMes"
        :key="idx"
        class="text-xs w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-colors"
        :class="[
          dia.vazio ? 'invisible' : 'text-climbe-text-main hover:bg-white/10 cursor-pointer',
          dia.ehHoje ? '!bg-[#5fc2ba] !text-[#121312] font-heavy' : '',
        ]"
        @click="clicarDia(dia)"
      >
        {{ dia.numero }}
      </button>
    </div>
  </div>
</template>
