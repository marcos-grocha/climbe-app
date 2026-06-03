<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useAuthStore } from '@/stores/auth'
import { usePropostasStore } from '@/stores/propostasStore'

const router = useRouter()
const authStore = useAuthStore()
const propostasStore = usePropostasStore()

const activeTab = ref('propostas')
const mensagemErro = ref('')
const mensagemSucesso = ref('')
const modalAprovacaoVisivel = ref(false)
const modalRecusaVisivel = ref(false)
const propostaSelecionada = ref(null)
const motivoRecusa = ref('')
const processandoAcao = ref(false)

const tituloPagina = computed(() => 'Propostas')

const cargoUsuarioAtual = computed(() => {
  return authStore.usuario?.cargo || authStore.usuario?.role || 'admin'
})

const podeAprovarRecusar = computed(() => cargoUsuarioAtual.value === 'admin')

function navegarPeloMenu(itemId) {
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

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0)
}

function formatarData(data) {
  if (!data) return '-'

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${data}T00:00:00`))
}

function obterLabelStatus(status) {
  const labels = {
    rascunho: 'Rascunho',
    pendente: 'Pendente',
    aprovada: 'Aprovada',
    recusada: 'Recusada',
  }

  return labels[status] || status
}

function obterSeverityStatus(status) {
  const severities = {
    rascunho: 'secondary',
    pendente: 'warning',
    aprovada: 'success',
    recusada: 'danger',
  }

  return severities[status] || 'secondary'
}

function podeEditarProposta(proposta) {
  return proposta.status !== 'aprovada' && proposta.status !== 'recusada'
}

function podeGerenciarAprovacao(proposta) {
  return podeAprovarRecusar.value && proposta.status === 'pendente'
}

function abrirCriacao() {
  router.push('/propostas/nova')
}

function abrirEdicao(proposta) {
  router.push(`/propostas/${proposta.id}/editar`)
}

function abrirModalAprovacao(proposta) {
  mensagemErro.value = ''
  propostaSelecionada.value = proposta
  modalAprovacaoVisivel.value = true
}

function fecharModalAprovacao() {
  modalAprovacaoVisivel.value = false
  propostaSelecionada.value = null
}

function abrirModalRecusa(proposta) {
  mensagemErro.value = ''
  motivoRecusa.value = ''
  propostaSelecionada.value = proposta
  modalRecusaVisivel.value = true
}

function fecharModalRecusa() {
  modalRecusaVisivel.value = false
  propostaSelecionada.value = null
  motivoRecusa.value = ''
}

async function confirmarAprovacao() {
  if (!propostaSelecionada.value) return

  processandoAcao.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  try {
    await propostasStore.aprovarProposta(propostaSelecionada.value.id)
    mensagemSucesso.value = 'Proposta aprovada com sucesso.'
    fecharModalAprovacao()
  } catch (error) {
    mensagemErro.value = error?.message || 'Nao foi possivel aprovar a proposta.'
  } finally {
    processandoAcao.value = false
  }
}

async function confirmarRecusa() {
  if (!propostaSelecionada.value) return

  processandoAcao.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  try {
    await propostasStore.recusarProposta(propostaSelecionada.value.id, motivoRecusa.value)
    mensagemSucesso.value = 'Proposta recusada com sucesso.'
    fecharModalRecusa()
  } catch (error) {
    mensagemErro.value = error?.message || 'Nao foi possivel recusar a proposta.'
  } finally {
    processandoAcao.value = false
  }
}

onMounted(async () => {
  try {
    await propostasStore.listarPropostas()
  } catch (error) {
    mensagemErro.value = error?.message || 'Nao foi possivel carregar as propostas.'
  }
})
</script>

<template>
  <ClimbePageWrapper :title="tituloPagina" :active-tab="activeTab" @navigate="navegarPeloMenu">
    <div class="flex flex-col gap-6">
      <div
        class="flex flex-col gap-3 border-b border-[#5fc2ba2e] pb-5 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="mb-1 text-[2rem] font-black text-white">Propostas</h1>
          <p class="text-climbe-text-muted">
            Gerencie as propostas comerciais cadastradas na plataforma.
          </p>
        </div>
        <Button
          label="Nova proposta"
          icon="pi pi-plus"
          class="!h-12 !rounded-md !border-0 !bg-[#67cec7] !px-6 !font-bold !text-[#0f1618] hover:!bg-[#7ad8d2]"
          @click="abrirCriacao"
        />
      </div>

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

      <section
        class="rounded-xl border border-[#5fc2ba42] bg-[#101718] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:p-6"
      >
        <div class="mb-4 border-b border-[#5fc2ba24] pb-4">
          <h2 class="m-0 text-xl font-extrabold text-[#f0fbff]">Propostas cadastradas</h2>
        </div>

        <DataTable
          :value="propostasStore.propostas"
          dataKey="id"
          :loading="propostasStore.carregando"
          stripedRows
          paginator
          :rows="8"
          tableStyle="min-width: 74rem"
          class="propostas-table"
        >
          <template #empty> Nenhuma proposta cadastrada. </template>
          <Column field="codigo" header="Codigo" />
          <Column field="empresaNome" header="Empresa" />
          <Column field="titulo" header="Titulo" />
          <Column header="Valor">
            <template #body="{ data }">
              {{ formatarMoeda(data.valorTotal) }}
            </template>
          </Column>
          <Column header="Validade">
            <template #body="{ data }">
              {{ formatarData(data.validade) }}
            </template>
          </Column>
          <Column field="criadoPor" header="Responsavel" />
          <Column header="Status">
            <template #body="{ data }">
              <Tag
                :value="obterLabelStatus(data.status)"
                :severity="obterSeverityStatus(data.status)"
                class="status-pill"
              />
            </template>
          </Column>
          <Column header="Acoes">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-2">
                <Button
                  v-if="podeEditarProposta(data)"
                  label="Editar"
                  size="small"
                  text
                  class="acao-editar"
                  @click="abrirEdicao(data)"
                />
                <Button
                  v-if="podeGerenciarAprovacao(data)"
                  label="Aprovar"
                  size="small"
                  text
                  class="acao-aprovar"
                  @click="abrirModalAprovacao(data)"
                />
                <Button
                  v-if="podeGerenciarAprovacao(data)"
                  label="Recusar"
                  size="small"
                  severity="danger"
                  text
                  class="acao-excluir"
                  @click="abrirModalRecusa(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </section>
    </div>

    <Dialog
      v-model:visible="modalAprovacaoVisivel"
      modal
      header="Aprovar proposta"
      :style="{ width: '32rem', maxWidth: '95vw' }"
    >
      <div class="flex flex-col gap-4">
        <p class="m-0 text-sm leading-6 text-[#d7eef3]">
          Tem certeza que deseja aprovar esta proposta? Apos aprovada, ela ficara pronta para seguir
          para o fluxo de contrato.
        </p>
        <div class="rounded-sm border border-[#5fc2ba24] bg-[#141f21] px-4 py-3 text-sm text-white">
          <strong>{{ propostaSelecionada?.codigo }}</strong>
          <span class="mx-2 text-climbe-text-muted">-</span>
          <span>{{ propostaSelecionada?.titulo }}</span>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <Button label="Cancelar" text @click="fecharModalAprovacao" />
          <Button
            label="Confirmar aprovacao"
            :loading="processandoAcao"
            @click="confirmarAprovacao"
          />
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="modalRecusaVisivel"
      modal
      header="Recusar proposta"
      :style="{ width: '36rem', maxWidth: '95vw' }"
    >
      <div class="flex flex-col gap-4">
        <p class="m-0 text-sm leading-6 text-[#d7eef3]">
          Tem certeza que deseja recusar esta proposta? Essa acao alterara o status da proposta para
          recusada.
        </p>
        <div class="flex flex-col gap-2">
          <label for="motivo_recusa" class="text-sm font-semibold text-white"
            >Motivo da recusa</label
          >
          <Textarea
            id="motivo_recusa"
            v-model="motivoRecusa"
            rows="4"
            placeholder="Informe um motivo, se necessario."
          />
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <Button label="Cancelar" text @click="fecharModalRecusa" />
          <Button
            label="Confirmar recusa"
            severity="danger"
            :loading="processandoAcao"
            @click="confirmarRecusa"
          />
        </div>
      </template>
    </Dialog>
  </ClimbePageWrapper>
</template>

<style scoped>
:deep(.propostas-table.p-datatable) {
  border: 1px solid rgba(95, 194, 186, 0.28);
  border-radius: 10px;
  overflow: hidden;
  background: #121a1b;
}

:deep(.propostas-table .p-datatable-thead > tr > th) {
  background: #182225;
  color: #b7d4de;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.95rem 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.2);
}

:deep(.propostas-table .p-datatable-tbody > tr) {
  background: #101718;
  color: #eef8fb;
}

:deep(.propostas-table .p-datatable-tbody > tr:nth-child(even)) {
  background: #131d1f;
}

:deep(.propostas-table .p-datatable-tbody > tr > td) {
  padding: 1.05rem 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.12);
}

:deep(.propostas-table .p-paginator) {
  background: transparent;
  border-top: 1px solid rgba(95, 194, 186, 0.18);
  padding: 0.8rem 0.6rem 0.4rem;
}

:deep(.propostas-table .p-paginator .p-paginator-page),
:deep(.propostas-table .p-paginator .p-paginator-prev),
:deep(.propostas-table .p-paginator .p-paginator-next) {
  min-width: 2rem;
  height: 2rem;
  border-radius: 8px;
  color: #a9c8d1;
}

:deep(.propostas-table .p-paginator .p-paginator-page.p-paginator-page-selected) {
  background: #67cec7;
  color: #0f1618;
  font-weight: 800;
}

:deep(.status-pill.p-tag) {
  border-radius: 9999px;
  padding: 0.18rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

:deep(.acao-editar.p-button) {
  color: #daf6ff;
  font-weight: 700;
}

:deep(.acao-editar.p-button:hover) {
  background: rgba(95, 194, 186, 0.14);
}

:deep(.acao-aprovar.p-button) {
  color: #9de0b5;
  font-weight: 700;
}

:deep(.acao-aprovar.p-button:hover) {
  background: rgba(74, 222, 128, 0.16);
}

:deep(.acao-excluir.p-button) {
  color: #f6a0a0;
  font-weight: 700;
}

:deep(.acao-excluir.p-button:hover) {
  background: rgba(243, 114, 114, 0.16);
}
</style>
