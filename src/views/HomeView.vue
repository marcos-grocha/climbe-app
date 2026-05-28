<script setup>
import { ref, reactive, computed } from 'vue'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import ClimbeCard from '@/components/ui/ClimbeCard.vue'
import ClimbeButton from '@/components/ui/ClimbeButton.vue'
import ClimbeInput from '@/components/ui/ClimbeInput.vue'
import ClimbeBadge from '@/components/ui/ClimbeBadge.vue'
import ClimbeTable from '@/components/ui/ClimbeTable.vue'

// 1. Estado de Navegação e Layout
const activeTab = ref('dashboard')
const pageTitle = computed(() => {
  if (activeTab.value === 'dashboard') return 'Painel Geral'
  if (activeTab.value === 'contracts') return 'Gestão de Contratos'
  return 'Climbe Investimentos'
})

const handleSidebarNavigate = (itemId) => {
  activeTab.value = itemId
}

// 2. Estado do Dashboard Fictício (Métricas)
const metrics = reactive({
  activeContracts: 48,
  managedCompanies: 24,
  pendingSignatures: 7
})

// 3. Estado da Gestão de Contratos (Pesquisa e Tabela)
const filters = reactive({
  title: '',
  company: '',
  status: ''
})

const isTableLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 4

// Base de Dados de Contratos Corporativos da Climbe
const allContracts = ref([
  { id: '1042', title: 'Prestação de Serviço de Assessoria', company: 'XP Investimentos', value: 35000, status: 'approved', date: '24/05/2026' },
  { id: '1041', title: 'Aporte de Capital em Seed Money', company: 'Norte Capital S/A', value: 1200000, status: 'active', date: '20/05/2026' },
  { id: '1040', title: 'Contrato de Parceria Estruturada', company: 'Itaú Unibanco', value: 85000, status: 'active', date: '18/05/2026' },
  { id: '1039', title: 'Locação de Sala Comercial Corp', company: 'Imobiliária Prime', value: 12500, status: 'pending', date: '12/05/2026' },
  { id: '1038', title: 'Aquisição de Ativos de Renda Fixa', company: 'BTG Pactual S/A', value: 450000, status: 'approved', date: '08/05/2026' },
  { id: '1037', title: 'Fornecimento de Licenças SaaS ERP', company: 'Oracle Corp', value: 24000, status: 'canceled', date: '05/05/2026' },
  { id: '1036', title: 'Auditoria Externa de Riscos', company: 'Deloitte Brasil', value: 95000, status: 'pending', date: '02/05/2026' },
  { id: '1035', title: 'Consultoria de Fusões & Aquisições', company: 'PwC Global', value: 300000, status: 'active', date: '28/04/2026' }
])

// Cabeçalhos para a ClimbeTable
const tableHeaders = [
  { value: 'id', label: 'ID' },
  { value: 'title', label: 'Contrato / Título' },
  { value: 'company', label: 'Empresa Parceira' },
  { value: 'value', label: 'Valor do Aporte' },
  { value: 'date', label: 'Data de Assinatura' },
  { value: 'status', label: 'Status' },
  { value: 'actions', label: 'Ações' }
]

// Filtragem Reativa de Contratos
const filteredContracts = computed(() => {
  return allContracts.value.filter(item => {
    const matchesTitle = !filters.title || item.title.toLowerCase().includes(filters.title.toLowerCase())
    const matchesCompany = !filters.company || item.company.toLowerCase().includes(filters.company.toLowerCase())
    const matchesStatus = !filters.status || item.status === filters.status
    return matchesTitle && matchesCompany && matchesStatus
  })
})

// Paginação Reativa
const paginatedContracts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredContracts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredContracts.value.length / itemsPerPage) || 1
})

// Lógica de Filtros e Pesquisa
const handleSearch = () => {
  isTableLoading.value = true
  currentPage.value = 1
  setTimeout(() => {
    isTableLoading.value = false
  }, 800)
}

const handleClearFilters = () => {
  filters.title = ''
  filters.company = ''
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

// Formatar moeda brasileira
const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

// Lógica de exclusão rápida
const deleteContract = (id) => {
  if (confirm(`Deseja realmente arquivar o contrato #${id}?`)) {
    allContracts.value = allContracts.value.filter(c => c.id !== id)
    alert(`Contrato #${id} arquivado com sucesso!`)
  }
}
</script>

<template>
  <ClimbePageWrapper 
    :title="pageTitle" 
    :active-tab="activeTab"
    @navigate="handleSidebarNavigate"
  >
    
    <!-- ---------------- TAB 1: PAINEL GERAL (DASHBOARD) ---------------- -->
    <div v-if="activeTab === 'dashboard'" class="flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-[2rem] mb-1">Painel de Acompanhamento</h1>
        <p>Visão estratégica consolidada da gestão de contratos e alocações de capital.</p>
      </div>

      <!-- Métricas Atômicas (ClimbeCard) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClimbeCard padding="md" variant="solid" hoverable>
          <div class="flex justify-between items-center text-[0.8rem] text-[var(--climbe-text-muted)] uppercase font-[var(--font-weight-heavy)] tracking-[0.05em] mb-3">
            <span>Contratos Vigentes</span>
            <ClimbeBadge variant="success">Fiduciário</ClimbeBadge>
          </div>
          <div class="text-[2.8rem] font-[var(--font-weight-black)] text-[var(--climbe-text-main)] leading-[1.1] mb-2">{{ metrics.activeContracts }}</div>
          <p class="text-[0.8rem] text-[var(--climbe-text-muted)]">Soma consolidada de aportes ativos</p>
        </ClimbeCard>

        <ClimbeCard padding="md" variant="solid" hoverable>
          <div class="flex justify-between items-center text-[0.8rem] text-[var(--climbe-text-muted)] uppercase font-[var(--font-weight-heavy)] tracking-[0.05em] mb-3">
            <span>Empresas Atendidas</span>
            <ClimbeBadge variant="primary">Parceiros</ClimbeBadge>
          </div>
          <div class="text-[2.8rem] font-[var(--font-weight-black)] text-[var(--climbe-text-main)] leading-[1.1] mb-2">{{ metrics.managedCompanies }}</div>
          <p class="text-[0.8rem] text-[var(--climbe-text-muted)]">Clientes corporativos ativos</p>
        </ClimbeCard>

        <ClimbeCard padding="md" variant="solid" hoverable>
          <div class="flex justify-between items-center text-[0.8rem] text-[var(--climbe-text-muted)] uppercase font-[var(--font-weight-heavy)] tracking-[0.05em] mb-3">
            <span>Assinaturas Pendentes</span>
            <ClimbeBadge variant="warning">Atenção</ClimbeBadge>
          </div>
          <div class="text-[2.8rem] font-[var(--font-weight-black)] text-[var(--climbe-text-main)] leading-[1.1] mb-2">{{ metrics.pendingSignatures }}</div>
          <p class="text-[0.8rem] text-[var(--climbe-text-muted)]">Aguardando aprovação jurídica</p>
        </ClimbeCard>
      </div>

      <!-- Visão Geral de Operações com ClimbeCard e ClimbeTable -->
      <div class="w-full">
        <ClimbeCard variant="solid" padding="lg">
          <template #header>
            <div class="flex justify-between items-center w-full">
              <h3 class="text-[1.1rem] m-0">Contratos Recentes</h3>
              <ClimbeButton variant="ghost" @click="activeTab = 'contracts'">
                Ver Todos &rarr;
              </ClimbeButton>
            </div>
          </template>

          <!-- Tabela Atômica Reutilizável -->
          <ClimbeTable
            :headers="tableHeaders"
            :items="allContracts.slice(0, 3)"
            :loading="false"
          >
            <!-- Customização de valor em BRL -->
            <template #cell-value="{ item }">
              <span class="font-[var(--font-weight-heavy)] text-[var(--climbe-text-main)]">{{ formatCurrency(item.value) }}</span>
            </template>
            
            <!-- Customização de Badges de Status -->
            <template #cell-status="{ item }">
              <ClimbeBadge v-if="item.status === 'active'" variant="primary">Vigente</ClimbeBadge>
              <ClimbeBadge v-else-if="item.status === 'approved'" variant="success">Aprovado</ClimbeBadge>
              <ClimbeBadge v-else-if="item.status === 'pending'" variant="warning">Em Análise</ClimbeBadge>
              <ClimbeBadge v-else variant="danger">Cancelado</ClimbeBadge>
            </template>

            <!-- Ações Rápidas -->
            <template #cell-actions="{ item }">
              <div class="flex gap-2 min-btn-wrapper">
                <ClimbeButton variant="ghost" @click="alert(`Detalhes do contrato #${item.id}`)">Ver</ClimbeButton>
              </div>
            </template>
          </ClimbeTable>
        </ClimbeCard>
      </div>
    </div>

    <!-- ---------------- TAB 2: GESTÃO DE CONTRATOS ---------------- -->
    <div v-else-if="activeTab === 'contracts'" class="flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-[2rem] mb-1">Gestão de Contratos</h1>
        <p>Consulte, filtre e analise os instrumentos fiduciários e parcerias da Climbe.</p>
      </div>

      <!-- Filtros da Tabela (ClimbeCard) -->
      <ClimbeCard padding="md" variant="solid" class="mb-2">
        <form @submit.prevent="handleSearch" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ClimbeInput 
              id="filter-title" 
              v-model="filters.title" 
              label="Título do Contrato" 
              placeholder="Ex: Assessoria..."
            />
            <ClimbeInput 
              id="filter-company" 
              v-model="filters.company" 
              label="Empresa Parceira" 
              placeholder="Ex: XP..."
            />
            
            <!-- Campo Select do Design System em CSS Vanilla -->
            <div class="climbe-select-group">
              <div class="select-container">
                <select id="filter-status" v-model="filters.status" class="climbe-select-field">
                  <option value="">Todos os Status</option>
                  <option value="active">Vigente</option>
                  <option value="approved">Aprovado</option>
                  <option value="pending">Em Análise</option>
                  <option value="canceled">Cancelado</option>
                </select>
                <label for="filter-status" class="climbe-select-label">Status do Contrato</label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <ClimbeButton variant="ghost" type="button" @click="handleClearFilters">
              Limpar Filtros
            </ClimbeButton>
            <ClimbeButton variant="secondary" type="submit">
              Filtrar Tabela
            </ClimbeButton>
          </div>
        </form>
      </ClimbeCard>

      <!-- Tabela Corporativa com Paginação Integrada -->
      <ClimbeCard padding="lg" variant="solid">
        <template #header>
          <div class="flex justify-between items-center w-full">
            <h3 class="text-[1.1rem] m-0">Instrumentos sob Gestão</h3>
            <ClimbeButton variant="primary" @click="alert('Criar novo contrato - Função Corporativa')">
              ➕ Novo Contrato
            </ClimbeButton>
          </div>
        </template>

        <ClimbeTable
          :headers="tableHeaders"
          :items="paginatedContracts"
          :loading="isTableLoading"
          :current-page="currentPage"
          :total-pages="totalPages"
          empty-text="Nenhum contrato corresponde aos filtros informados."
          @page-change="handlePageChange"
        >
          <!-- Customização do ID -->
          <template #cell-id="{ item }">
            <span class="font-[var(--font-weight-heavy)] font-mono text-[var(--climbe-primary-hover)]">#{{ item.id }}</span>
          </template>

          <!-- Customização de valor em BRL -->
          <template #cell-value="{ item }">
            <span class="font-[var(--font-weight-heavy)] text-[var(--climbe-text-main)]">{{ formatCurrency(item.value) }}</span>
          </template>
          
          <!-- Customização de Badges de Status -->
          <template #cell-status="{ item }">
            <ClimbeBadge v-if="item.status === 'active'" variant="primary">Vigente</ClimbeBadge>
            <ClimbeBadge v-else-if="item.status === 'approved'" variant="success">Aprovado</ClimbeBadge>
            <ClimbeBadge v-else-if="item.status === 'pending'" variant="warning">Em Análise</ClimbeBadge>
            <ClimbeBadge v-else variant="danger">Cancelado</ClimbeBadge>
          </template>

          <!-- Ações Rápidas -->
          <template #cell-actions="{ item }">
            <div class="flex gap-2 min-btn-wrapper">
              <ClimbeButton variant="ghost" @click="alert(`Detalhes do contrato #${item.id}`)">Ver</ClimbeButton>
              <ClimbeButton variant="danger" @click="deleteContract(item.id)">Arquivar</ClimbeButton>
            </div>
          </template>
        </ClimbeTable>
      </ClimbeCard>
    </div>

    <!-- ---------------- TABs PENDENTES / PLACEHOLDER ---------------- -->
    <div v-else class="flex flex-col gap-6">
      <ClimbeCard padding="lg" variant="solid" class="text-center py-16 px-8 flex flex-col items-center gap-4 max-w-[600px] mx-auto mt-12 mb-12">
        <span class="text-[3.5rem]">🚧</span>
        <h2 class="text-[1.6rem] m-0">Módulo em Construção</h2>
        <p class="text-[0.95rem] mb-2">A tela de <strong>{{ activeTab }}</strong> está sendo otimizada pelo Design System da Climbe.</p>
        <ClimbeButton variant="primary" @click="activeTab = 'dashboard'">
          Voltar ao Painel Geral
        </ClimbeButton>
      </ClimbeCard>
    </div>
  </ClimbePageWrapper>
</template>

<style scoped>
/* Pequeno ajuste nos botões da tabela */
.min-btn-wrapper :deep(.climbe-btn) {
  padding: var(--space-1) var(--space-3);
  font-size: 0.8rem;
}

/* Estilo do Select (Design System em CSS Vanilla mantido por complexidade) */
.climbe-select-group {
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: var(--font-family-avenir);
}

.select-container {
  position: relative;
  display: flex;
  align-items: center;
}

.climbe-select-field {
  width: 100%;
  padding: 1.5rem 1rem 0.7rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--climbe-neutral-border);
  background: var(--climbe-neutral-card);
  color: var(--climbe-text-main);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  appearance: none;
  cursor: pointer;
}

.climbe-select-field:focus {
  border-color: var(--climbe-primary);
  box-shadow: 0 0 0 3px var(--climbe-primary-light);
}

.climbe-select-label {
  position: absolute;
  left: 1rem;
  top: 30%;
  transform: translateY(-80%) scale(0.8);
  color: var(--climbe-primary);
  font-weight: var(--font-weight-heavy);
  pointer-events: none;
  font-size: 0.95rem;
}

.select-container::after {
  content: '▼';
  font-size: 0.7rem;
  color: var(--climbe-text-muted);
  position: absolute;
  right: 1.2rem;
  pointer-events: none;
}
</style>
