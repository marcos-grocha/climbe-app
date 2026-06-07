<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import ClimbeCard from '@/components/ui/ClimbeCard.vue'
import ClimbeButton from '@/components/ui/ClimbeButton.vue'
import ClimbeInput from '@/components/ui/ClimbeInput.vue'
import ClimbeBadge from '@/components/ui/ClimbeBadge.vue'
import ClimbeTable from '@/components/ui/ClimbeTable.vue'

const router = useRouter()
const activeTab = ref('dashboard')
const pageTitle = computed(() => {
  if (activeTab.value === 'dashboard') return 'Painel Geral'
  if (activeTab.value === 'contracts') return 'Gestão de Contratos'
  return 'Climbe Investimentos'
})

const handleSidebarNavigate = (itemId) => {
  if (itemId === 'empresas') {
    router.push('/empresas')
    return
  }
  activeTab.value = itemId
}

const metricas = reactive({
  contratosAtivos: 48,
  empresasAtendidas: 24,
  assinaturasPendentes: 7,
})

const filters = reactive({
  titulo: '',
  empresa: '',
  status: '',
})

const isTableLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 4

const todosContratos = ref([
  {
    id: '1042',
    titulo: 'Prestação de Serviço de Assessoria',
    empresa: 'XP Investimentos',
    valor: 35000,
    status: 'approved',
    data: '24/05/2026',
  },
  {
    id: '1041',
    titulo: 'Aporte de Capital em Seed Money',
    empresa: 'Norte Capital S/A',
    valor: 1200000,
    status: 'active',
    data: '20/05/2026',
  },
  {
    id: '1040',
    titulo: 'Contrato de Parceria Estruturada',
    empresa: 'Itaú Unibanco',
    valor: 85000,
    status: 'active',
    data: '18/05/2026',
  },
  {
    id: '1039',
    titulo: 'Locação de Sala Comercial Corp',
    empresa: 'Imobiliária Prime',
    valor: 12500,
    status: 'pending',
    data: '12/05/2026',
  },
  {
    id: '1038',
    titulo: 'Aquisição de Ativos de Renda Fixa',
    empresa: 'BTG Pactual S/A',
    valor: 450000,
    status: 'approved',
    data: '08/05/2026',
  },
  {
    id: '1037',
    titulo: 'Fornecimento de Licenças SaaS ERP',
    empresa: 'Oracle Corp',
    valor: 24000,
    status: 'canceled',
    data: '05/05/2026',
  },
  {
    id: '1036',
    titulo: 'Auditoria Externa de Riscos',
    empresa: 'Deloitte Brasil',
    valor: 95000,
    status: 'pending',
    data: '02/05/2026',
  },
  {
    id: '1035',
    titulo: 'Consultoria de Fusões & Aquisições',
    empresa: 'PwC Global',
    valor: 300000,
    status: 'active',
    data: '28/04/2026',
  },
])

const tableHeaders = [
  { value: 'id', label: 'ID' },
  { value: 'titulo', label: 'Contrato / Título' },
  { value: 'empresa', label: 'Empresa Parceira' },
  { value: 'valor', label: 'Valor do Aporte' },
  { value: 'data', label: 'Data de Assinatura' },
  { value: 'status', label: 'Status' },
  { value: 'actions', label: 'Ações' },
]

const contratosFiltrados = computed(() => {
  return todosContratos.value.filter((item) => {
    const matchesTitle =
      !filters.titulo || item.titulo.toLowerCase().includes(filters.titulo.toLowerCase())
    const matchesCompany =
      !filters.empresa || item.empresa.toLowerCase().includes(filters.empresa.toLowerCase())
    const matchesStatus = !filters.status || item.status === filters.status
    return matchesTitle && matchesCompany && matchesStatus
  })
})

const contratosPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return contratosFiltrados.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(contratosFiltrados.value.length / itemsPerPage) || 1
})

const handleSearch = () => {
  isTableLoading.value = true
  currentPage.value = 1
  setTimeout(() => {
    isTableLoading.value = false
  }, 800)
}

const handleClearFilters = () => {
  filters.titulo = ''
  filters.empresa = ''
  filters.status = ''
  handleSearch()
}

const handlePageChange = (page) => {
  isTableLoading.value = true
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(() => {
    isTableLoading.value = false
  }, 500)
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

const deletarContrato = (id) => {
  if (confirm(`Deseja realmente arquivar o contrato #${id}?`)) {
    todosContratos.value = todosContratos.value.filter((c) => c.id !== id)
    alert(`Contrato #${id} arquivado com sucesso!`)
  }
}
</script>

<template>
  <ClimbePageWrapper :title="pageTitle" :active-tab="activeTab" @navigate="handleSidebarNavigate">
    <!-- TAB 1: PAINEL GERAL (DASHBOARD) -->
    <div v-if="activeTab === 'dashboard'" class="flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-[2rem] mb-1 font-black">Painel de Acompanhamento</h1>
        <p class="text-climbe-text-muted">
          Visão estratégica consolidada da gestão de contratos e alocações de capital.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClimbeCard padding="md" variant="solid" hoverable>
          <div
            class="flex justify-between items-center text-[0.8rem] text-climbe-text-muted uppercase font-heavy tracking-wider mb-3"
          >
            <span>Contratos Vigentes</span>
            <ClimbeBadge variant="success">Fiduciário</ClimbeBadge>
          </div>
          <div class="text-[2.8rem] font-black text-climbe-text-main leading-[1.1] mb-2">
            {{ metricas.contratosAtivos }}
          </div>
          <p class="text-[0.8rem] text-climbe-text-muted">Soma consolidada de aportes ativos</p>
        </ClimbeCard>

        <ClimbeCard padding="md" variant="solid" hoverable>
          <div
            class="flex justify-between items-center text-[0.8rem] text-climbe-text-muted uppercase font-heavy tracking-wider mb-3"
          >
            <span>Empresas Atendidas</span>
            <ClimbeBadge variant="primary">Parceiros</ClimbeBadge>
          </div>
          <div class="text-[2.8rem] font-black text-climbe-text-main leading-[1.1] mb-2">
            {{ metricas.empresasAtendidas }}
          </div>
          <p class="text-[0.8rem] text-climbe-text-muted">Clientes corporativos ativos</p>
        </ClimbeCard>

        <ClimbeCard padding="md" variant="solid" hoverable>
          <div
            class="flex justify-between items-center text-[0.8rem] text-climbe-text-muted uppercase font-heavy tracking-wider mb-3"
          >
            <span>Assinaturas Pendentes</span>
            <ClimbeBadge variant="warning">Atenção</ClimbeBadge>
          </div>
          <div class="text-[2.8rem] font-black text-climbe-text-main leading-[1.1] mb-2">
            {{ metricas.assinaturasPendentes }}
          </div>
          <p class="text-[0.8rem] text-climbe-text-muted">Aguardando aprovação jurídica</p>
        </ClimbeCard>
      </div>

      <div class="flex flex-col gap-4">
        <ClimbeCard variant="solid" padding="lg">
          <template #header>
            <div class="flex justify-between items-center w-full">
              <h3 class="text-[1.1rem] m-0 font-heavy">Contratos Recentes</h3>
              <ClimbeButton variant="ghost" @click="activeTab = 'contracts'">
                Ver Todos &rarr;
              </ClimbeButton>
            </div>
          </template>

          <ClimbeTable :headers="tableHeaders" :items="todosContratos.slice(0, 3)" :loading="false">
            <template #cell-valor="{ item }">
              <span class="font-heavy text-climbe-text-main">{{ formatCurrency(item.valor) }}</span>
            </template>

            <template #cell-status="{ item }">
              <ClimbeBadge v-if="item.status === 'active'" variant="primary">Vigente</ClimbeBadge>
              <ClimbeBadge v-else-if="item.status === 'approved'" variant="success"
                >Aprovado</ClimbeBadge
              >
              <ClimbeBadge v-else-if="item.status === 'pending'" variant="warning"
                >Em Análise</ClimbeBadge
              >
              <ClimbeBadge v-else variant="danger">Cancelado</ClimbeBadge>
            </template>

            <template #cell-actions="{ item }">
              <div class="flex gap-2">
                <ClimbeButton
                  variant="ghost"
                  class="!px-3 !py-1 !text-[0.8rem]"
                  @click="alert(`Detalhes do contrato #${item.id}`)"
                  >Ver</ClimbeButton
                >
              </div>
            </template>
          </ClimbeTable>
        </ClimbeCard>
      </div>
    </div>

    <!-- TAB 2: GESTÃO DE CONTRATOS -->
    <div v-else-if="activeTab === 'contracts'" class="flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-[2rem] mb-1 font-black">Gestão de Contratos</h1>
        <p class="text-climbe-text-muted">
          Consulte, filtre e analise os instrumentos fiduciários e parcerias da Climbe.
        </p>
      </div>

      <ClimbeCard padding="md" variant="solid" class="mb-2">
        <form @submit.prevent="handleSearch" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ClimbeInput
              id="filter-title"
              v-model="filters.titulo"
              label="Título do Contrato"
              placeholder="Ex: Assessoria..."
            />
            <ClimbeInput
              id="filter-company"
              v-model="filters.empresa"
              label="Empresa Parceira"
              placeholder="Ex: XP..."
            />

            <div
              class="flex flex-col relative font-avenir group"
              :class="{ 'has-value': filters.status }"
            >
              <div class="relative flex items-center">
                <select
                  id="filter-status"
                  v-model="filters.status"
                  class="peer w-full px-4 pt-[1.5rem] pb-[0.7rem] rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main text-[0.95rem] outline-none transition-all duration-250 box-border appearance-none cursor-pointer focus:border-climbe-primary focus:ring-[3px] focus:ring-climbe-primary-light"
                >
                  <option value="">Todos os Status</option>
                  <option value="active">Vigente</option>
                  <option value="approved">Aprovado</option>
                  <option value="pending">Em Análise</option>
                  <option value="canceled">Cancelado</option>
                </select>
                <label
                  for="filter-status"
                  class="absolute left-4 top-[30%] -translate-y-[80%] scale-80 text-climbe-primary font-heavy pointer-events-none text-[0.95rem] origin-top-left"
                  >Status do Contrato</label
                >
                <div
                  class="after:content-['▼'] after:text-[0.7rem] after:text-climbe-text-muted after:absolute after:right-5 after:pointer-events-none flex items-center h-full absolute right-0"
                ></div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <ClimbeButton variant="ghost" type="button" @click="handleClearFilters">
              Limpar Filtros
            </ClimbeButton>
            <ClimbeButton variant="secondary" type="submit"> Filtrar Tabela </ClimbeButton>
          </div>
        </form>
      </ClimbeCard>

      <ClimbeCard padding="lg" variant="solid">
        <template #header>
          <div class="flex justify-between items-center w-full">
            <h3 class="text-[1.1rem] m-0 font-heavy">Instrumentos sob Gestão</h3>
            <ClimbeButton
              variant="primary"
              @click="alert('Criar novo contrato - Função Corporativa')"
            >
              ➕ Novo Contrato
            </ClimbeButton>
          </div>
        </template>

        <ClimbeTable
          :headers="tableHeaders"
          :items="contratosPaginados"
          :loading="isTableLoading"
          :current-page="currentPage"
          :total-pages="totalPages"
          empty-text="Nenhum contrato corresponde aos filtros informados."
          @page-change="handlePageChange"
        >
          <template #cell-id="{ item }">
            <span class="font-heavy font-mono text-climbe-primary-hover">#{{ item.id }}</span>
          </template>

          <template #cell-valor="{ item }">
            <span class="font-heavy text-climbe-text-main">{{ formatCurrency(item.valor) }}</span>
          </template>

          <template #cell-status="{ item }">
            <ClimbeBadge v-if="item.status === 'active'" variant="primary">Vigente</ClimbeBadge>
            <ClimbeBadge v-else-if="item.status === 'approved'" variant="success"
              >Aprovado</ClimbeBadge
            >
            <ClimbeBadge v-else-if="item.status === 'pending'" variant="warning"
              >Em Análise</ClimbeBadge
            >
            <ClimbeBadge v-else variant="danger">Cancelado</ClimbeBadge>
          </template>

          <template #cell-actions="{ item }">
            <div class="flex gap-2">
              <ClimbeButton
                variant="ghost"
                class="!px-3 !py-1 !text-[0.8rem]"
                @click="alert(`Detalhes do contrato #${item.id}`)"
                >Ver</ClimbeButton
              >
              <ClimbeButton
                variant="danger"
                class="!px-3 !py-1 !text-[0.8rem]"
                @click="deletarContrato(item.id)"
                >Arquivar</ClimbeButton
              >
            </div>
          </template>
        </ClimbeTable>
      </ClimbeCard>
    </div>

    <!-- TABs PENDENTES / PLACEHOLDER -->
    <div v-else class="flex flex-col gap-6">
      <ClimbeCard
        padding="lg"
        variant="solid"
        class="text-center flex flex-col items-center gap-4 max-w-[600px] mx-auto mt-12 py-16"
      >
        <span class="text-[3.5rem]">🚧</span>
        <h2 class="text-[1.6rem] m-0 font-heavy">Módulo em Construção</h2>
        <p class="text-[0.95rem] mb-2 text-climbe-text-muted">
          A tela de <strong class="font-heavy">{{ activeTab }}</strong> está sendo otimizada pelo
          Design System da Climbe.
        </p>
        <ClimbeButton variant="primary" @click="activeTab = 'dashboard'">
          Voltar ao Painel Geral
        </ClimbeButton>
      </ClimbeCard>
    </div>
  </ClimbePageWrapper>
</template>
