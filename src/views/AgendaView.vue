<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'

const modalAberto = ref(false)
const eventoSelecionado = ref(null)
const novoEvento = ref({ titulo: '', data: '', tipo: 'reuniao' })
const mostrarFormulario = ref(false)

const eventos = ref([
  {
    id: '1',
    title: 'Reunião XP Investimentos',
    date: '2026-06-10',
    backgroundColor: '#5fc2ba',
    borderColor: '#5fc2ba',
    extendedProps: { tipo: 'reuniao', descricao: 'Reunião de alinhamento trimestral.' },
  },
  {
    id: '2',
    title: 'Vencimento Contrato BTG',
    date: '2026-06-15',
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
    extendedProps: { tipo: 'vencimento', descricao: 'Contrato #2031 vence hoje.' },
  },
  {
    id: '3',
    title: 'Reunião Itaú BBA',
    date: '2026-06-20',
    backgroundColor: '#5fc2ba',
    borderColor: '#5fc2ba',
    extendedProps: { tipo: 'reuniao', descricao: 'Apresentação de relatório semestral.' },
  },
  {
    id: '4',
    title: 'Vencimento Contrato XP',
    date: '2026-06-28',
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
    extendedProps: { tipo: 'vencimento', descricao: 'Contrato #1042 vence hoje.' },
  },
])

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: 'pt-br',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: '',
  },
  events: eventos.value,
  dateClick: (info) => {
    novoEvento.value = { titulo: '', data: info.dateStr, tipo: 'reuniao' }
    mostrarFormulario.value = true
  },
  eventClick: (info) => {
    eventoSelecionado.value = {
      titulo: info.event.title,
      data: info.event.startStr,
      tipo: info.event.extendedProps.tipo,
      descricao: info.event.extendedProps.descricao,
    }
    modalAberto.value = true
  },
  height: 'auto',
  buttonText: {
    today: 'Hoje',
  },
})

const adicionarEvento = () => {
  if (!novoEvento.value.titulo || !novoEvento.value.data) return
  const cor = novoEvento.value.tipo === 'reuniao' ? '#5fc2ba' : '#f59e0b'
  eventos.value.push({
    id: String(Date.now()),
    title: novoEvento.value.titulo,
    date: novoEvento.value.data,
    backgroundColor: cor,
    borderColor: cor,
    extendedProps: { tipo: novoEvento.value.tipo, descricao: '' },
  })
  calendarOptions.value.events = [...eventos.value]
  mostrarFormulario.value = false
  novoEvento.value = { titulo: '', data: '', tipo: 'reuniao' }
}
</script>

<template>
  <ClimbePageWrapper title="Agenda" active-tab="meetings">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-climbe-text-main font-black text-xl m-0">Agenda</h3>
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1 text-xs text-climbe-text-muted">
          <span class="w-3 h-3 rounded-full bg-[#5fc2ba] inline-block"></span> Reunião
        </span>
        <span class="flex items-center gap-1 text-xs text-climbe-text-muted">
          <span class="w-3 h-3 rounded-full bg-[#f59e0b] inline-block"></span> Vencimento
        </span>
        <button
          class="bg-climbe-primary text-[#121312] font-heavy px-4 py-2 rounded-sm text-sm hover:bg-climbe-primary-hover transition-colors"
          @click="mostrarFormulario = true"
        >
          + Agendar
        </button>
      </div>
    </div>

    <!-- Calendário -->
    <div class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md p-4">
      <FullCalendar :options="calendarOptions" />
    </div>

    <!-- Modal detalhe do evento -->
    <div
      v-if="modalAberto"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="modalAberto = false"
    >
      <div
        class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md p-6 w-full max-w-md"
      >
        <h4 class="text-climbe-text-main font-black text-lg mb-1">
          {{ eventoSelecionado?.titulo }}
        </h4>
        <p class="text-climbe-text-muted text-xs mb-4">{{ eventoSelecionado?.data }}</p>
        <span
          class="text-xs font-heavy px-2 py-0.5 rounded-full mb-4 inline-block"
          :class="
            eventoSelecionado?.tipo === 'reuniao'
              ? 'bg-[#5fc2ba]/10 text-[#5fc2ba]'
              : 'bg-yellow-400/10 text-yellow-400'
          "
        >
          {{ eventoSelecionado?.tipo === 'reuniao' ? 'Reunião' : 'Vencimento' }}
        </span>
        <p class="text-climbe-text-muted text-sm mt-2">{{ eventoSelecionado?.descricao }}</p>
        <div class="flex justify-end mt-6">
          <button
            class="border border-climbe-neutral-border text-climbe-text-muted px-4 py-2 rounded-sm text-sm hover:border-climbe-primary hover:text-climbe-primary transition-colors"
            @click="modalAberto = false"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal formulário de agendamento -->
    <div
      v-if="mostrarFormulario"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="mostrarFormulario = false"
    >
      <div
        class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md p-6 w-full max-w-md"
      >
        <h4 class="text-climbe-text-main font-black text-lg mb-4">Agendar Evento</h4>

        <div class="flex flex-col gap-3">
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Título</label>
            <input
              v-model="novoEvento.titulo"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-sm px-3 py-2 text-sm outline-none focus:border-climbe-primary"
              placeholder="ex: Reunião com cliente"
            />
          </div>
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Data</label>
            <input
              v-model="novoEvento.data"
              type="date"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-sm px-3 py-2 text-sm outline-none focus:border-climbe-primary"
            />
          </div>
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Tipo</label>
            <select
              v-model="novoEvento.tipo"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-sm px-3 py-2 text-sm outline-none focus:border-climbe-primary"
            >
              <option value="reuniao">Reunião</option>
              <option value="vencimento">Vencimento</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            class="border border-climbe-neutral-border text-climbe-text-muted px-4 py-2 rounded-sm text-sm hover:border-climbe-primary hover:text-climbe-primary transition-colors"
            @click="mostrarFormulario = false"
          >
            Cancelar
          </button>
          <button
            class="bg-climbe-primary text-[#121312] font-heavy px-4 py-2 rounded-sm text-sm hover:bg-climbe-primary-hover transition-colors"
            @click="adicionarEvento"
          >
            Agendar
          </button>
        </div>
      </div>
    </div>
  </ClimbePageWrapper>
</template>
