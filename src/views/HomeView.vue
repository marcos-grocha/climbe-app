<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
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
    <div v-if="activeTab === 'dashboard'" class="tab-view-container">
      <div class="db-welcome">
        <h1>Painel de Acompanhamento</h1>
        <p>Visão estratégica consolidada da gestão de contratos e alocações de capital.</p>
      </div>

      <!-- Métricas Atômicas (ClimbeCard) -->
      <div class="metrics-grid">
        <ClimbeCard padding="md" variant="solid" hoverable>
          <div class="metric-header">
            <span>Contratos Vigentes</span>
            <ClimbeBadge variant="success">Fiduciário</ClimbeBadge>
          </div>
          <div class="metric-value">{{ metrics.activeContracts }}</div>
          <p class="metric-footer">Soma consolidada de aportes ativos</p>
        </ClimbeCard>

        <ClimbeCard padding="md" variant="solid" hoverable>
          <div class="metric-header">
            <span>Empresas Atendidas</span>
            <ClimbeBadge variant="primary">Parceiros</ClimbeBadge>
          </div>
          <div class="metric-value">{{ metrics.managedCompanies }}</div>
          <p class="metric-footer">Clientes corporativos ativos</p>
        </ClimbeCard>

        <ClimbeCard padding="md" variant="solid" hoverable>
          <div class="metric-header">
            <span>Assinaturas Pendentes</span>
            <ClimbeBadge variant="warning">Atenção</ClimbeBadge>
          </div>
          <div class="metric-value">{{ metrics.pendingSignatures }}</div>
          <p class="metric-footer">Aguardando aprovação jurídica</p>
        </ClimbeCard>
      </div>

      <!-- Visão Geral de Operações com ClimbeCard e ClimbeTable -->
      <div class="db-section-row">
        <ClimbeCard variant="solid" padding="lg">
          <template #header>
            <div class="card-header-flex">
              <h3>Contratos Recentes</h3>
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
              <span class="font-bold">{{ formatCurrency(item.value) }}</span>
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
              <div class="actions-flex">
                <ClimbeButton variant="ghost" @click="alert(`Detalhes do contrato #${item.id}`)">Ver</ClimbeButton>
              </div>
            </template>
          </ClimbeTable>
        </ClimbeCard>
      </div>
    </div>

    <!-- ---------------- TAB 2: GESTÃO DE CONTRATOS ---------------- -->
    <div v-else-if="activeTab === 'contracts'" class="tab-view-container">
      <div class="db-welcome">
        <h1>Gestão de Contratos</h1>
        <p>Consulte, filtre e analise os instrumentos fiduciários e parcerias da Climbe.</p>
      </div>

      <!-- Filtros da Tabela (ClimbeCard) -->
      <ClimbeCard padding="md" variant="solid" class="filters-card">
        <form @submit.prevent="handleSearch" class="filters-form">
          <div class="filters-grid">
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

          <div class="filters-actions">
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
          <div class="card-header-flex">
            <h3>Instrumentos sob Gestão</h3>
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
            <span class="text-heavy font-mono text-cyan">#{{ item.id }}</span>
          </template>

          <!-- Customização de valor em BRL -->
          <template #cell-value="{ item }">
            <span class="font-bold">{{ formatCurrency(item.value) }}</span>
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
            <div class="actions-flex">
              <ClimbeButton variant="ghost" @click="alert(`Detalhes do contrato #${item.id}`)">Ver</ClimbeButton>
              <ClimbeButton variant="danger" @click="deleteContract(item.id)">Arquivar</ClimbeButton>
            </div>
          </template>
        </ClimbeTable>
      </ClimbeCard>
    </div>

    <!-- ---------------- TABs PENDENTES / PLACEHOLDER ---------------- -->
    <div v-else class="tab-view-container">
      <ClimbeCard padding="lg" variant="solid" class="placeholder-card">
        <span class="placeholder-icon">🚧</span>
        <h2>Módulo em Construção</h2>
        <p>A tela de <strong>{{ activeTab }}</strong> está sendo otimizada pelo Design System da Climbe.</p>
        <ClimbeButton variant="primary" @click="activeTab = 'dashboard'">
          Voltar ao Painel Geral
        </ClimbeButton>
      </ClimbeCard>
    </div>
  </ClimbePageWrapper>
</template>

<style scoped>
.tab-view-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.db-welcome {
  margin-bottom: var(--space-2);
}

.db-welcome h1 {
  font-size: 2rem;
  margin-bottom: var(--space-1);
}

/* Grid de Métricas */
.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--climbe-text-muted);
  text-transform: uppercase;
  font-weight: var(--font-weight-heavy);
  letter-spacing: 0.05em;
  margin-bottom: var(--space-3);
}

.metric-value {
  font-size: 2.8rem;
  font-weight: var(--font-weight-black);
  color: var(--climbe-text-main);
  line-height: 1.1;
  margin-bottom: var(--space-2);
}

.metric-footer {
  font-size: 0.8rem;
  color: var(--climbe-text-muted);
}

/* Card Header Flex */
.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-header-flex h3 {
  font-size: 1.1rem;
  margin: 0;
}

/* Ações Flex */
.actions-flex {
  display: flex;
  gap: var(--space-2);
}

.actions-flex .climbe-btn {
  padding: var(--space-1) var(--space-3);
  font-size: 0.8rem;
}

.font-bold {
  font-weight: var(--font-weight-heavy);
  color: var(--climbe-text-main);
}

.font-mono {
  font-family: monospace;
}

.text-cyan {
  color: var(--climbe-primary-hover);
}

/* Filtros */
.filters-card {
  margin-bottom: var(--space-2);
}

.filters-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .filters-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

/* Estilo do Select (Design System em CSS Vanilla) */
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

/* Placeholder módulo */
.placeholder-card {
  text-align: center;
  padding: var(--space-16) var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  max-width: 600px;
  margin: var(--space-12) auto;
}

.placeholder-icon {
  font-size: 3.5rem;
}

.placeholder-card h2 {
  font-size: 1.6rem;
  margin: 0;
}

.placeholder-card p {
  font-size: 0.95rem;
  margin-bottom: var(--space-2);
}
</style>
