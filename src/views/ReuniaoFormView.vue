<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import MultiSelect from 'primevue/multiselect'
import RadioButton from 'primevue/radiobutton'
import Tag from 'primevue/tag'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useEmpresasStore } from '@/stores/empresasStore'
import { useReunioesStore } from '@/stores/reunioesStore'

const route = useRoute()
const router = useRouter()
const empresasStore = useEmpresasStore()
const reunioesStore = useReunioesStore()

const activeTab = ref('meetings')
const carregandoFormulario = ref(false)
const salvando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')
const erros = reactive({})
const reuniaoOriginal = ref(null)

// Disponibilidade da sala
const verificandoDisponibilidade = ref(false)
const resultadoDisponibilidade = ref(null)

const formulario = reactive({
  pauta: '',
  empresaId: null,
  dataHora: '',
  modalidade: 'presencial',
  salaId: null,
  linkOnline: '',
  participantesIds: [],
  observacoes: '',
})

const modoEdicao = computed(() => Boolean(route.params.id))

const tituloPagina = computed(() =>
  modoEdicao.value ? 'Editar reunião' : 'Agendar reunião',
)

const subtituloPagina = computed(() =>
  modoEdicao.value
    ? 'Atualize os dados do agendamento selecionado.'
    : 'Preencha os dados para agendar uma nova reunião.',
)

const tituloCard = computed(() =>
  modoEdicao.value ? 'Dados da reunião' : 'Preencha os dados da reunião',
)

const textoBotaoSalvar = computed(() =>
  modoEdicao.value ? 'Salvar alterações' : 'Agendar reunião',
)

const ehPresencial = computed(() => formulario.modalidade === 'presencial')

const opcoesEmpresas = computed(() =>
  empresasStore.empresas.map((empresa) => ({
    label: empresa.nome_fantasia,
    value: empresa.id,
  })),
)

const opcoesSalas = computed(() =>
  reunioesStore.salas.map((sala) => ({
    label: `${sala.nome} (${sala.capacidade} pessoas) — ${sala.andar}`,
    value: sala.id,
  })),
)

const opcoesParticipantes = computed(() =>
  reunioesStore.participantes.map((p) => ({
    label: `${p.nome} — ${p.cargo}`,
    value: p.id,
  })),
)

const salaAtual = computed(() =>
  reunioesStore.salas.find((s) => s.id === formulario.salaId),
)

const dataHoraMinima = computed(() => {
  const agora = new Date()
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset())
  return agora.toISOString().slice(0, 16)
})

function navegarPeloMenu(itemId) {
  if (itemId === 'meetings') {
    router.push('/reunioes')
    return
  }
  if (itemId === 'propostas') {
    router.push('/propostas')
    return
  }
  if (itemId === 'empresas') {
    router.push('/empresas')
    return
  }
  if (itemId === 'dashboard' || itemId === 'contracts') {
    router.push('/')
    return
  }
  router.push('/')
}

function limparErros() {
  Object.keys(erros).forEach((chave) => {
    delete erros[chave]
  })
}

function obterNomeEmpresaPorId(empresaId) {
  const empresa = empresasStore.empresas.find((item) => item.id === empresaId)
  return empresa?.nome_fantasia || ''
}

function obterNomeSalaPorId(salaId) {
  const sala = reunioesStore.salas.find((item) => item.id === salaId)
  return sala?.nome || ''
}

function preencherFormulario(reuniao) {
  formulario.pauta = reuniao.pauta || ''
  formulario.empresaId = reuniao.empresaId
  formulario.dataHora = reuniao.dataHora || ''
  formulario.modalidade = reuniao.modalidade || 'presencial'
  formulario.salaId = reuniao.salaId || null
  formulario.linkOnline = reuniao.linkOnline || ''
  formulario.participantesIds = reuniao.participantesIds || []
  formulario.observacoes = reuniao.observacoes || ''
}

function validarFormulario() {
  limparErros()

  if (!formulario.pauta.trim()) erros.pauta = 'A pauta é obrigatória.'
  if (!formulario.empresaId) erros.empresaId = 'A empresa é obrigatória.'
  if (!formulario.dataHora) {
    erros.dataHora = 'A data e hora são obrigatórias.'
  }

  if (ehPresencial.value) {
    if (!formulario.salaId) erros.salaId = 'A sala é obrigatória para reuniões presenciais.'
    if (resultadoDisponibilidade.value && !resultadoDisponibilidade.value.disponivel) {
      erros.salaId = 'A sala selecionada não está disponível neste horário.'
    }
  } else {
    if (!formulario.linkOnline.trim()) {
      erros.linkOnline = 'O link da reunião online é obrigatório.'
    }
  }

  if (formulario.participantesIds.length === 0) {
    erros.participantesIds = 'Selecione pelo menos um participante.'
  }

  return Object.keys(erros).length === 0
}

async function verificarDisponibilidade() {
  if (!ehPresencial.value || !formulario.salaId || !formulario.dataHora) {
    resultadoDisponibilidade.value = null
    return
  }

  verificandoDisponibilidade.value = true
  try {
    const resultado = await reunioesStore.verificarDisponibilidade(
      formulario.salaId,
      formulario.dataHora,
      modoEdicao.value ? route.params.id : null,
    )
    resultadoDisponibilidade.value = resultado
  } catch {
    resultadoDisponibilidade.value = null
  } finally {
    verificandoDisponibilidade.value = false
  }
}

// Watch sala e data/hora para verificação automática de disponibilidade
watch(
  () => [formulario.salaId, formulario.dataHora],
  () => {
    verificarDisponibilidade()
  },
)

// Limpar sala se mudar para online
watch(
  () => formulario.modalidade,
  (novaModalidade) => {
    if (novaModalidade === 'online') {
      formulario.salaId = null
      resultadoDisponibilidade.value = null
    } else {
      formulario.linkOnline = ''
    }
  },
)

async function salvarReuniao() {
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  if (!validarFormulario()) return

  salvando.value = true

  try {
    const payload = {
      pauta: formulario.pauta.trim(),
      empresaId: formulario.empresaId,
      empresaNome: obterNomeEmpresaPorId(formulario.empresaId),
      dataHora: formulario.dataHora,
      modalidade: formulario.modalidade,
      salaId: ehPresencial.value ? formulario.salaId : null,
      salaNome: ehPresencial.value ? obterNomeSalaPorId(formulario.salaId) : null,
      linkOnline: !ehPresencial.value ? formulario.linkOnline.trim() : '',
      participantesIds: formulario.participantesIds,
      observacoes: formulario.observacoes.trim(),
    }

    if (modoEdicao.value) {
      await reunioesStore.atualizarReuniao(route.params.id, {
        ...reuniaoOriginal.value,
        ...payload,
      })
      mensagemSucesso.value = 'Reunião atualizada com sucesso.'
    } else {
      await reunioesStore.criarReuniao(payload)
      mensagemSucesso.value = 'Reunião agendada com sucesso.'
    }

    router.push('/reunioes')
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível salvar a reunião.'
  } finally {
    salvando.value = false
  }
}

function formatarDataConflito(dataHora) {
  if (!dataHora) return '-'
  const data = new Date(dataHora)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data)
}

onMounted(async () => {
  carregandoFormulario.value = true
  mensagemErro.value = ''

  try {
    await Promise.all([
      empresasStore.empresas.length === 0 ? empresasStore.carregarEmpresas() : Promise.resolve(),
      reunioesStore.salas.length === 0 ? reunioesStore.carregarSalas() : Promise.resolve(),
      reunioesStore.participantes.length === 0
        ? reunioesStore.carregarParticipantes()
        : Promise.resolve(),
    ])

    if (modoEdicao.value) {
      const reuniao = await reunioesStore.buscarReuniaoPorId(route.params.id)
      reuniaoOriginal.value = reuniao
      preencherFormulario(reuniao)
    }
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível carregar o formulário.'
  } finally {
    carregandoFormulario.value = false
  }
})
</script>

<template>
  <ClimbePageWrapper :title="tituloPagina" :active-tab="activeTab" @navigate="navegarPeloMenu">
    <div class="flex flex-col gap-6">
      <!-- Cabeçalho -->
      <div
        class="flex flex-col gap-3 border-b border-[#5fc2ba2e] pb-5 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="mb-1 text-[2rem] font-black text-white">{{ tituloPagina }}</h1>
          <p class="text-climbe-text-muted">{{ subtituloPagina }}</p>
        </div>
        <Button
          label="Voltar para reuniões"
          icon="pi pi-arrow-left"
          text
          class="!justify-start !px-0 !text-[#b7d4de]"
          @click="router.push('/reunioes')"
        />
      </div>

      <!-- Mensagens -->
      <div
        v-if="mensagemErro"
        class="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      >
        {{ mensagemErro }}
      </div>
      <div
        v-if="mensagemSucesso"
        class="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
      >
        {{ mensagemSucesso }}
      </div>

      <!-- Card do formulário -->
      <section
        class="rounded-xl border border-[#5fc2ba42] bg-[#101718] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:p-6"
      >
        <div class="mb-4 border-b border-[#5fc2ba24] pb-4">
          <h2 class="m-0 text-xl font-extrabold text-[#f0fbff]">{{ tituloCard }}</h2>
        </div>

        <div v-if="carregandoFormulario" class="py-10 text-center text-sm text-climbe-text-muted">
          Carregando formulário...
        </div>

        <form v-else class="grid grid-cols-1 gap-6" @submit.prevent="salvarReuniao">
          <!-- Seção: Informações gerais -->
          <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <h3
              class="m-0 text-lg font-semibold text-[#d7eef3] md:col-span-2"
            >
              Informações gerais
            </h3>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label for="pauta" class="text-sm font-semibold text-white">Pauta</label>
              <InputText
                id="pauta"
                v-model="formulario.pauta"
                placeholder="Ex: Revisão de contratos ativos do Q3"
              />
              <small v-if="erros.pauta" class="text-red-400">{{ erros.pauta }}</small>
            </div>

            <div class="flex flex-col gap-2">
              <label for="empresa_id" class="text-sm font-semibold text-white">Empresa</label>
              <Dropdown
                id="empresa_id"
                v-model="formulario.empresaId"
                :options="opcoesEmpresas"
                optionLabel="label"
                optionValue="value"
                placeholder="Selecione a empresa"
                filter
              />
              <small v-if="erros.empresaId" class="text-red-400">{{ erros.empresaId }}</small>
            </div>

            <div class="flex flex-col gap-2">
              <label for="data_hora" class="text-sm font-semibold text-white">Data e hora</label>
              <InputText
                id="data_hora"
                v-model="formulario.dataHora"
                type="datetime-local"
                :min="dataHoraMinima"
              />
              <small v-if="erros.dataHora" class="text-red-400">{{ erros.dataHora }}</small>
            </div>
          </section>

          <!-- Seção: Modalidade -->
          <section class="grid grid-cols-1 gap-4">
            <h3
              class="m-0 text-lg font-semibold text-[#d7eef3]"
            >
              Modalidade
            </h3>

            <div class="flex flex-wrap gap-6">
              <div class="flex items-center gap-3">
                <RadioButton
                  v-model="formulario.modalidade"
                  inputId="modalidade_presencial"
                  value="presencial"
                />
                <label for="modalidade_presencial" class="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <span class="text-base">🏢</span> Presencial
                </label>
              </div>
              <div class="flex items-center gap-3">
                <RadioButton
                  v-model="formulario.modalidade"
                  inputId="modalidade_online"
                  value="online"
                />
                <label for="modalidade_online" class="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <span class="text-base">💻</span> Online
                </label>
              </div>
            </div>
          </section>

          <!-- Seção: Local (presencial) -->
          <section v-if="ehPresencial" class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <h3
              class="m-0 text-lg font-semibold text-[#d7eef3] md:col-span-2"
            >
              Local da reunião
            </h3>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label for="sala_id" class="text-sm font-semibold text-white">Sala</label>
              <Dropdown
                id="sala_id"
                v-model="formulario.salaId"
                :options="opcoesSalas"
                optionLabel="label"
                optionValue="value"
                placeholder="Selecione a sala"
              />
              <small v-if="erros.salaId" class="text-red-400">{{ erros.salaId }}</small>
            </div>

            <!-- Info da sala selecionada -->
            <div
              v-if="salaAtual"
              class="rounded-lg border border-[#5fc2ba24] bg-[#141f21] p-4 md:col-span-2"
            >
              <div class="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <span>📍</span> {{ salaAtual.nome }}
              </div>
              <div class="flex flex-wrap gap-3 text-xs text-climbe-text-muted">
                <span>📐 Capacidade: {{ salaAtual.capacidade }} pessoas</span>
                <span>🏗️ {{ salaAtual.andar }}</span>
              </div>
              <div v-if="salaAtual.recursos?.length" class="mt-2 flex flex-wrap gap-1.5">
                <Tag
                  v-for="recurso in salaAtual.recursos"
                  :key="recurso"
                  :value="recurso"
                  severity="secondary"
                  class="recurso-tag"
                />
              </div>
            </div>

            <!-- Resultado da verificação de disponibilidade -->
            <div v-if="verificandoDisponibilidade" class="md:col-span-2">
              <div
                class="flex items-center gap-2 rounded-lg border border-[#5fc2ba24] bg-[#141f21] px-4 py-3 text-sm text-climbe-text-muted"
              >
                <i class="pi pi-spin pi-spinner"></i>
                Verificando disponibilidade...
              </div>
            </div>

            <div
              v-else-if="resultadoDisponibilidade && formulario.salaId && formulario.dataHora"
              class="md:col-span-2"
            >
              <!-- Sala disponível -->
              <div
                v-if="resultadoDisponibilidade.disponivel"
                class="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
              >
                <i class="pi pi-check-circle"></i>
                Sala disponível neste horário!
              </div>

              <!-- Sala com conflito -->
              <div
                v-else
                class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3"
              >
                <div class="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-200">
                  <i class="pi pi-exclamation-triangle"></i>
                  Sala indisponível — conflito de horário
                </div>
                <div
                  v-for="conflito in resultadoDisponibilidade.conflitos"
                  :key="conflito.id"
                  class="mt-1 rounded-md border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-xs text-amber-100"
                >
                  <strong>{{ conflito.pauta }}</strong>
                  <span class="mx-1 text-amber-300/60">—</span>
                  {{ formatarDataConflito(conflito.dataHora) }}
                  <span class="mx-1 text-amber-300/60">—</span>
                  <span class="text-amber-300/80">por {{ conflito.criadoPor }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Seção: Link online -->
          <section v-if="!ehPresencial" class="grid grid-cols-1 gap-4">
            <h3
              class="m-0 text-lg font-semibold text-[#d7eef3]"
            >
              Dados da reunião online
            </h3>

            <div class="flex flex-col gap-2">
              <label for="link_online" class="text-sm font-semibold text-white"
                >Link da reunião</label
              >
              <InputText
                id="link_online"
                v-model="formulario.linkOnline"
                placeholder="Ex: https://meet.google.com/abc-defg-hij"
              />
              <small v-if="erros.linkOnline" class="text-red-400">{{ erros.linkOnline }}</small>
            </div>
          </section>

          <!-- Seção: Participantes -->
          <section class="grid grid-cols-1 gap-4">
            <h3
              class="m-0 text-lg font-semibold text-[#d7eef3]"
            >
              Participantes
            </h3>

            <div class="flex flex-col gap-2">
              <label for="participantes" class="text-sm font-semibold text-white"
                >Selecione os participantes</label
              >
              <MultiSelect
                id="participantes"
                v-model="formulario.participantesIds"
                :options="opcoesParticipantes"
                optionLabel="label"
                optionValue="value"
                placeholder="Buscar participantes..."
                filter
                display="chip"
                :maxSelectedLabels="5"
                class="participantes-multiselect"
              />
              <small v-if="erros.participantesIds" class="text-red-400">{{
                erros.participantesIds
              }}</small>
            </div>
          </section>

          <!-- Seção: Observações -->
          <section class="grid grid-cols-1 gap-4">
            <h3
              class="m-0 text-lg font-semibold text-[#d7eef3]"
            >
              Observações
            </h3>

            <div class="flex flex-col gap-2">
              <label for="observacoes" class="text-sm font-semibold text-white"
                >Observações adicionais</label
              >
              <Textarea
                id="observacoes"
                v-model="formulario.observacoes"
                rows="4"
                placeholder="Informações extras sobre a reunião (opcional)"
              />
            </div>
          </section>

          <!-- Botões -->
          <div class="flex items-center justify-end gap-2 border-t border-[#5fc2ba24] pt-4">
            <Button label="Cancelar" text @click="router.push('/reunioes')" />
            <Button
              :label="textoBotaoSalvar"
              :loading="salvando"
              type="submit"
              class="!bg-[#67cec7] !font-bold !text-[#0f1618] hover:!bg-[#7ad8d2]"
            />
          </div>
        </form>
      </section>
    </div>
  </ClimbePageWrapper>
</template>

<style scoped>
:deep(.recurso-tag.p-tag) {
  border-radius: 9999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: rgba(95, 194, 186, 0.12);
  color: #9ed8d3;
  border: 1px solid rgba(95, 194, 186, 0.2);
}

:deep(.participantes-multiselect .p-multiselect-token) {
  background: rgba(95, 194, 186, 0.15);
  color: #c8eff0;
  border: 1px solid rgba(95, 194, 186, 0.25);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
