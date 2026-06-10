<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useEmpresasStore } from '@/stores/empresasStore'
import { apenasNumeros } from '@/utils/validadores'

const router = useRouter()
const route = useRoute()
const empresasStore = useEmpresasStore()

const activeTab = ref('empresas')
const mensagemErro = ref('')
const mensagemSucesso = ref('')

const tituloPagina = computed(() => 'Empresas')

function abrirCriacao() {
  router.push('/empresas/nova')
}

function abrirEdicao(empresa) {
  router.push(`/empresas/${empresa.id}/editar`)
}

function confirmarExclusao(empresa) {
  const confirmou = window.confirm(`Deseja realmente excluir a empresa "${empresa.nome_fantasia}"?`)
  if (!confirmou) return
  excluirEmpresaSelecionada(empresa)
}

async function excluirEmpresaSelecionada(empresa) {
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  try {
    await empresasStore.excluirEmpresa(empresa.id)
    mensagemSucesso.value = 'Empresa excluída com sucesso.'
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível excluir a empresa.'
  }
}

function formatarCnpj(cnpj) {
  const valor = apenasNumeros(cnpj)
  if (valor.length !== 14) return cnpj
  return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

function formatarCidadeUf(empresa) {
  if (!empresa.endereco?.cidade || !empresa.endereco?.estado) return '-'
  return `${empresa.endereco.cidade}/${empresa.endereco.estado}`
}

function navegarPeloMenu(itemId) {
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

onMounted(async () => {
  if (route.query.sucesso === 'criado') {
    mensagemSucesso.value = 'Empresa criada com sucesso.'
    router.replace('/empresas')
  } else if (route.query.sucesso === 'atualizado') {
    mensagemSucesso.value = 'Empresa atualizada com sucesso.'
    router.replace('/empresas')
  }

  try {
    await empresasStore.carregarEmpresas()
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível carregar as empresas.'
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
          <h1 class="mb-1 text-[2rem] font-black text-white">Empresas</h1>
          <p class="text-climbe-text-muted">Gerencie as empresas cadastradas na plataforma.</p>
        </div>
        <Button
          label="Nova empresa"
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
          <h2 class="m-0 text-xl font-extrabold text-[#f0fbff]">Empresas cadastradas</h2>
        </div>

        <DataTable
          :value="empresasStore.empresas"
          dataKey="id"
          :loading="empresasStore.carregando"
          stripedRows
          paginator
          :rows="8"
          tableStyle="min-width: 70rem"
          class="empresas-table"
        >
          <template #empty> Nenhuma empresa cadastrada. </template>
          <Column field="nome_fantasia" header="Nome fantasia" />
          <Column field="razao_social" header="Razão social" />
          <Column header="CNPJ">
            <template #body="{ data }">
              {{ formatarCnpj(data.cnpj) }}
            </template>
          </Column>
          <Column field="email" header="E-mail" />
          <Column header="Cidade/UF">
            <template #body="{ data }">
              {{ formatarCidadeUf(data) }}
            </template>
          </Column>
          <Column header="Status">
            <template #body="{ data }">
              <Tag
                :value="data.status"
                :severity="data.status === 'ativa' ? 'success' : 'secondary'"
                class="status-pill"
              />
            </template>
          </Column>
          <Column header="Ações">
            <template #body="{ data }">
              <div class="flex gap-2">
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
:deep(.empresas-table.p-datatable) {
  border: 1px solid rgba(95, 194, 186, 0.28);
  border-radius: 10px;
  overflow: hidden;
  background: #121a1b;
}

:deep(.empresas-table .p-datatable-thead > tr > th) {
  background: #182225;
  color: #b7d4de;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.95rem 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.2);
}

:deep(.empresas-table .p-datatable-tbody > tr) {
  background: #101718;
  color: #eef8fb;
}

:deep(.empresas-table .p-datatable-tbody > tr:nth-child(even)) {
  background: #131d1f;
}

:deep(.empresas-table .p-datatable-tbody > tr > td) {
  padding: 1.05rem 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.12);
}

:deep(.empresas-table .p-paginator) {
  background: transparent;
  border-top: 1px solid rgba(95, 194, 186, 0.18);
  padding: 0.8rem 0.6rem 0.4rem;
}

:deep(.empresas-table .p-paginator .p-paginator-page),
:deep(.empresas-table .p-paginator .p-paginator-prev),
:deep(.empresas-table .p-paginator .p-paginator-next) {
  min-width: 2rem;
  height: 2rem;
  border-radius: 8px;
  color: #a9c8d1;
}

:deep(.empresas-table .p-paginator .p-paginator-page.p-paginator-page-selected) {
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
