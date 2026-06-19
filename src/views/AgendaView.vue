<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import MiniCalendario from '@/components/MiniCalendario.vue'

const modalAberto = ref(false)
const eventoSelecionado = ref(null)
const novoEvento = ref({ titulo: '', data: '', tipo: 'reuniao' })
const mostrarFormulario = ref(false)
const calendarRef = ref(null)

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
    left: 'title',
    center: '',
    right: 'prev,next today',
  },
  events: eventos.value,
  dayMaxEvents: 3,
  fixedWeekCount: false,
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
  dayHeaderFormat: { weekday: 'short' },
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

    <!-- Layout com sidebar + calendário -->
    <div class="flex gap-6">
      <!-- Sidebar -->
      <div class="w-64 shrink-0">
        <MiniCalendario />
      </div>

      <!-- Calendário principal -->
      <div
        class="flex-1 bg-climbe-neutral-card border border-climbe-neutral-border rounded-2xl p-6 google-calendar"
      >
        <FullCalendar ref="calendarRef" :options="calendarOptions" />
      </div>
    </div>

    <!-- Modal detalhe do evento -->
    <div
      v-if="modalAberto"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="modalAberto = false"
    >
      <div
        class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-xl p-6 w-full max-w-md shadow-2xl"
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
            class="border border-climbe-neutral-border text-climbe-text-muted px-4 py-2 rounded-full text-sm hover:border-climbe-primary hover:text-climbe-primary transition-colors"
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
        class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-xl p-6 w-full max-w-md shadow-2xl"
      >
        <h4 class="text-climbe-text-main font-black text-lg mb-4">Agendar Evento</h4>

        <div class="flex flex-col gap-3">
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Título</label>
            <input
              v-model="novoEvento.titulo"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-lg px-3 py-2 text-sm outline-none focus:border-climbe-primary"
              placeholder="ex: Reunião com cliente"
            />
          </div>
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Data</label>
            <input
              v-model="novoEvento.data"
              type="date"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-lg px-3 py-2 text-sm outline-none focus:border-climbe-primary"
            />
          </div>
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Tipo</label>
            <select
              v-model="novoEvento.tipo"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-lg px-3 py-2 text-sm outline-none focus:border-climbe-primary"
            >
              <option value="reuniao">Reunião</option>
              <option value="vencimento">Vencimento</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            class="border border-climbe-neutral-border text-climbe-text-muted px-4 py-2 rounded-full text-sm hover:border-climbe-primary hover:text-climbe-primary transition-colors"
            @click="mostrarFormulario = false"
          >
            Cancelar
          </button>
          <button
            class="bg-climbe-primary text-[#121312] font-heavy px-4 py-2 rounded-full text-sm hover:bg-climbe-primary-hover transition-colors"
            @click="adicionarEvento"
          >
            Agendar
          </button>
        </div>
      </div>
    </div>
  </ClimbePageWrapper>
</template>

<style scoped>
.google-calendar :deep(.fc) {
  font-family: 'Google Sans', 'Avenir Next', sans-serif;
}

.google-calendar :deep(.fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-climbe-text-main, #fff);
  text-transform: capitalize;
}

.google-calendar :deep(.fc-button) {
  background: transparent !important;
  border: none !important;
  color: var(--color-climbe-text-muted, #9ca3af) !important;
  border-radius: 9999px !important;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none !important;
  transition: background 0.15s;
}

.google-calendar :deep(.fc-button:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
}

.google-calendar :deep(.fc-today-button) {
  width: auto;
  padding: 0 16px !important;
  border: 1px solid var(--color-climbe-neutral-border, #2a2a2a) !important;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.google-calendar :deep(.fc-col-header-cell) {
  background: transparent;
  padding: 12px 0;
  border: none !important;
}

.google-calendar :deep(.fc-col-header-cell-cushion) {
  color: var(--color-climbe-text-muted, #9ca3af);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.google-calendar :deep(.fc-daygrid-day) {
  border-color: var(--color-climbe-neutral-border, #2a2a2a) !important;
}

.google-calendar :deep(.fc-daygrid-day-frame) {
  padding: 4px;
}

.google-calendar :deep(.fc-daygrid-day-top) {
  flex-direction: row;
  justify-content: flex-start;
  padding: 8px;
}

.google-calendar :deep(.fc-daygrid-day-number) {
  color: var(--color-climbe-text-main, #fff);
  font-size: 0.8rem;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.google-calendar :deep(.fc-day-today) {
  background: rgba(95, 194, 186, 0.06) !important;
}

.google-calendar :deep(.fc-day-today .fc-daygrid-day-number) {
  background: #8ab4f8;
  color: #1a1a1a;
  font-weight: 700;
}

.google-calendar :deep(.fc-daygrid-day.fc-day-other .fc-daygrid-day-number) {
  opacity: 0.3;
}

.google-calendar :deep(.fc-event) {
  border-radius: 6px !important;
  border: none !important;
  padding: 2px 6px !important;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 2px !important;
  cursor: pointer;
}

.google-calendar :deep(.fc-daygrid-more-link) {
  color: var(--color-climbe-primary, #5fc2ba);
  font-size: 0.7rem;
  font-weight: 600;
}

.google-calendar :deep(.fc-scrollgrid) {
  border: none !important;
}

.google-calendar :deep(.fc-scrollgrid-section > *) {
  border: none;
}

.google-calendar :deep(table) {
  border-color: var(--color-climbe-neutral-border, #2a2a2a) !important;
}
</style>
