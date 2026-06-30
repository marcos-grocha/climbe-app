<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useReunioesStore } from '@/stores/reunioesStore'

const router = useRouter()
const reunioesStore = useReunioesStore()

const activeTab = ref('meetings')
const mensagemErro = ref('')
const mensagemSucesso = ref('')

const tituloPagina = computed(() => 'Reuniões')

function navegarPeloMenu(itemId) {
  if (itemId === 'meetings') {
    router.push('/reunioes')
    return
  }
  router.push('/')
}

function formatarData(dataHora) {
  if (!dataHora) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dataHora))
}

function formatarHora(dataHora) {
  if (!dataHora) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dataHora))
}

function obterLabelStatus(status) {
  const labels = {
    agendada: 'Agendada',
    concluida: 'Concluída',
    cancelada: 'Cancelada',
  }
  return labels[status] || status
}

function obterSeverityStatus(status) {
  const severities = {
    agendada: 'info',
    concluida: 'success',
    cancelada: 'danger',
  }
  return severities[status] || 'secondary'
}

function abrirCriacao() {
  router.push('/reunioes/nova')
}

function abrirEdicao(reuniao) {
  router.push(`/reunioes/${reuniao.id}/editar`)
}

async function confirmarExclusao(reuniao) {
  const confirmou = window.confirm(`Deseja realmente excluir a reunião "${reuniao.pauta}"?`)
  if (!confirmou) return

  mensagemErro.value = ''
  mensagemSucesso.value = ''
  try {
    await reunioesStore.excluirReuniao(reuniao.id)
    mensagemSucesso.value = 'Reunião excluída com sucesso.'
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível excluir a reunião.'
  }
}

onMounted(async () => {
  mensagemErro.value = ''
  try {
    await reunioesStore.carregarReunioes()
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível carregar as reuniões.'
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
          <h1 class="mb-1 text-[2rem] font-black text-white">Reuniões</h1>
          <p class="text-climbe-text-muted">
            Gerencie as reuniões e atas cadastradas na plataforma.
          </p>
        </div>
        <Button
          label="Nova reunião"
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
          <h2 class="m-0 text-xl font-extrabold text-[#f0fbff]">Reuniões agendadas</h2>
        </div>

        <DataTable
          :value="reunioesStore.reunioes"
          dataKey="id"
          :loading="reunioesStore.carregando"
          stripedRows
          paginator
          :rows="8"
          tableStyle="min-width: 74rem"
          class="reunioes-table"
        >
          <template #empty> Nenhuma reunião cadastrada. </template>
          
          <Column field="pauta" header="Pauta">
            <template #body="{ data }">
              <span class="font-bold">{{ data.pauta }}</span>
            </template>
          </Column>
          
          <Column header="Empresa/Cliente">
            <template #body="{ data }">
              {{ data.empresaNome || '-' }}
            </template>
          </Column>
          
          <Column header="Data">
            <template #body="{ data }">
              {{ formatarData(data.dataHora) }}
            </template>
          </Column>
          
          <Column header="Horário">
            <template #body="{ data }">
              {{ formatarHora(data.dataHora) }}
            </template>
          </Column>
          
          <Column header="Sala/Modalidade">
            <template #body="{ data }">
              <span v-if="data.modalidade === 'presencial'">{{ data.salaNome }}</span>
              <span v-else class="text-[#67cec7]">Online</span>
            </template>
          </Column>

          <Column header="Status">
            <template #body="{ data }">
              <Tag
                :value="obterLabelStatus(data.status)"
                :severity="obterSeverityStatus(data.status)"
                class="status-pill"
              />
            </template>
          </Column>
          
          <Column header="Ações">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-2">
                <Button
                  label="Editar"
                  size="small"
                  text
                  class="acao-editar"
                  @click="abrirEdicao(data)"
                />
                <Button
                  label="Excluir"
                  size="small"
                  severity="danger"
                  text
                  class="acao-excluir"
                  @click="confirmarExclusao(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </section>
    </div>
  </ClimbePageWrapper>
</template>

<style scoped>
:deep(.reunioes-table.p-datatable) {
  border: 1px solid rgba(95, 194, 186, 0.28);
  border-radius: 10px;
  overflow: hidden;
  background: #121a1b;
}

:deep(.reunioes-table .p-datatable-thead > tr > th) {
  background: #182225;
  color: #b7d4de;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.95rem 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.2);
}

:deep(.reunioes-table .p-datatable-tbody > tr) {
  background: #101718;
  color: #eef8fb;
}

:deep(.reunioes-table .p-datatable-tbody > tr:nth-child(even)) {
  background: #131d1f;
}

:deep(.reunioes-table .p-datatable-tbody > tr > td) {
  padding: 1.05rem 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.12);
}

:deep(.reunioes-table .p-paginator) {
  background: transparent;
  border-top: 1px solid rgba(95, 194, 186, 0.18);
  padding: 0.8rem 0.6rem 0.4rem;
}

:deep(.reunioes-table .p-paginator .p-paginator-page),
:deep(.reunioes-table .p-paginator .p-paginator-prev),
:deep(.reunioes-table .p-paginator .p-paginator-next) {
  min-width: 2rem;
  height: 2rem;
  border-radius: 8px;
  color: #a9c8d1;
}

:deep(.reunioes-table .p-paginator .p-paginator-page.p-paginator-page-selected) {
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

:deep(.acao-excluir.p-button) {
  color: #f6a0a0;
  font-weight: 700;
}

:deep(.acao-excluir.p-button:hover) {
  background: rgba(243, 114, 114, 0.16);
}
</style>
