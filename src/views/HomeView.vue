<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import ClimbeCard from '@/components/ui/ClimbeCard.vue'
import ClimbeButton from '@/components/ui/ClimbeButton.vue'
import ClimbeBadge from '@/components/ui/ClimbeBadge.vue'
import ClimbeTable from '@/components/ui/ClimbeTable.vue'
import WidgetAgendaSemana from '@/components/widgets/WidgetAgendaSemana.vue'
import ContratosMockPanel from '@/components/contratos/ContratosMockPanel.vue'

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

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 flex flex-col gap-4">
          <ClimbeCard variant="solid" padding="lg" class="h-full">
            <template #header>
              <div class="flex justify-between items-center w-full">
                <h3 class="text-[1.1rem] m-0 font-heavy">Contratos Recentes</h3>
                <ClimbeButton variant="ghost" @click="activeTab = 'contracts'">
                  Ver Todos &rarr;
                </ClimbeButton>
              </div>
            </template>

            <ClimbeTable
              :headers="tableHeaders"
              :items="todosContratos.slice(0, 3)"
              :loading="false"
            >
              <template #cell-valor="{ item }">
                <span class="font-heavy text-climbe-text-main">{{
                  formatCurrency(item.valor)
                }}</span>
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
        <div class="lg:col-span-1 flex flex-col gap-4">
          <WidgetAgendaSemana />
        </div>
      </div>
    </div>

    <!-- TAB 2: GESTÃO DE CONTRATOS -->
    <div v-else-if="activeTab === 'contracts'">
      <ContratosMockPanel />
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
