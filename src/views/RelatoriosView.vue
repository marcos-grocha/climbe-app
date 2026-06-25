<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import ClimbeCard from '@/components/ui/ClimbeCard.vue'
import ClimbeButton from '@/components/ui/ClimbeButton.vue'
import ClimbeBadge from '@/components/ui/ClimbeBadge.vue'
import { useAuthStore } from '@/stores/auth'
import { obterDadosRelatorios, exportarRelatorio } from '@/services/relatoriosService'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('reports')
const carregando = ref(true)

// Dados da API mockada
const metricasGerais = ref({
  capitalSobGestao: 0,
  ticketMedio: 0,
  taxaCrescimento: 0,
  auditoriasConcluidas: 0,
  auditoriasPendentes: 0,
  contratosAssinadosEsteMes: 0
})

const evolucaoMensal = ref([])
const distribuicaoSetor = ref([])
const historicoRelatorios = ref([])

// Filtros
const filtroPeriodo = ref('semestre')
const filtroSetor = ref('todos')

// Modal de Exportação
const mostrarModalExportar = ref(false)
const exportando = ref(false)
const exportEtapa = ref(0)
const exportProgresso = ref(0)
const exportEtapasText = [
  'Conectando ao banco de contratos...',
  'Compilando dados de aportes...',
  'Formatando tabelas e balanços...',
  'Renderizando arquivo consolidado...',
  'Download iniciado!'
]

const formExport = reactive({
  nome: '',
  formato: 'PDF',
  periodo: 'Últimos 6 meses'
})

const feedbackMsg = ref('')
const feedbackTipo = ref('success')

// Gráfico de linha SVG (Evolução)
const svgWidth = 600
const svgHeight = 220
const paddingX = 50
const paddingY = 30

const hoveredIndex = ref(null)

// Carrega os dados na montagem
onMounted(async () => {
  await carregarDados()
})

async function carregarDados() {
  carregando.value = true
  try {
    const dados = await obterDadosRelatorios()
    metricasGerais.value = dados.metricasGerais
    evolucaoMensal.value = dados.evolucaoMensal
    distribuicaoSetor.value = dados.distribuicaoSetor
    historicoRelatorios.value = dados.historicoRelatorios
  } catch (err) {
    mostrarFeedback('Erro ao carregar dados: ' + err.message, 'error')
  } finally {
    carregando.value = false
  }
}

function navegarPeloMenu(itemId) {
  const rotas = {
    empresas: '/empresas',
    propostas: '/propostas',
    documentos: '/documentos',
    users: '/usuarios',
    relatorios: '/relatorios',
    settings: '/configuracoes'
  }
  if (rotas[itemId]) {
    router.push(rotas[itemId])
  } else if (itemId === 'dashboard' || itemId === 'contracts') {
    router.push('/')
  }
}

function mostrarFeedback(msg, tipo = 'success') {
  feedbackMsg.value = msg
  feedbackTipo.value = tipo
  setTimeout(() => {
    feedbackMsg.value = ''
  }, 4000)
}

const formatarDinheiro = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

const formatarData = (isoString) => {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Filtro dos dados do Gráfico de Evolução com base no Período
const dadosEvolucaoFiltrados = computed(() => {
  if (filtroPeriodo.value === 'trimestre') {
    return evolucaoMensal.value.slice(-3)
  }
  if (filtroPeriodo.value === 'ano') {
    // Retorna todos os mocks que simulam crescimento contínuo
    return evolucaoMensal.value
  }
  return evolucaoMensal.value // Semestre é o padrão
})

// Cálculos dinâmicos de coordenadas para o Gráfico SVG de Linha
const pontosGrafico = computed(() => {
  const dados = dadosEvolucaoFiltrados.value
  if (!dados || dados.length === 0) return []
  
  const totalPontos = dados.length
  const valores = dados.map(d => d.valor)
  const maxVal = Math.max(...valores) * 1.05
  const minVal = Math.min(...valores) * 0.95
  const rangeVal = maxVal - minVal
  
  const larguraDisponivel = svgWidth - paddingX * 2
  const alturaDisponivel = svgHeight - paddingY * 2
  
  return dados.map((d, index) => {
    const x = paddingX + (index * (larguraDisponivel / (totalPontos - 1 || 1)))
    // Inverte a coordenada Y para o SVG (0 é no topo, altura total é na base)
    const y = svgHeight - paddingY - ((d.valor - minVal) / rangeVal * alturaDisponivel)
    return { x, y, mes: d.mes, valor: d.valor, contratos: d.contratos }
  })
})

const pathD = computed(() => {
  const pontos = pontosGrafico.value
  if (pontos.length === 0) return ''
  return pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const areaPathD = computed(() => {
  const pontos = pontosGrafico.value
  if (pontos.length === 0) return ''
  const linePath = pathD.value
  const primeiro = pontos[0]
  const ultimo = pontos[pontos.length - 1]
  const baseLineY = svgHeight - paddingY
  
  return `${linePath} L ${ultimo.x} ${baseLineY} L ${primeiro.x} ${baseLineY} Z`
})

// Cálculos dinâmicos para o Donut Chart
const donutCircumference = 2 * Math.PI * 45 // R = 45 -> 282.74

const setoresFiltrados = computed(() => {
  if (filtroSetor.value === 'todos') {
    return distribuicaoSetor.value
  }
  return distribuicaoSetor.value.filter(s => s.nome.toLowerCase().includes(filtroSetor.value.toLowerCase()))
})

const donutSlices = computed(() => {
  const setores = setoresFiltrados.value
  if (!setores || setores.length === 0) return []
  
  const somaPorcentagens = setores.reduce((soma, s) => soma + s.porcentagem, 0)
  
  let acumulado = 0
  return setores.map(s => {
    const porcentagemAjustada = (s.porcentagem / somaPorcentagens) * 100
    const strokeLength = (porcentagemAjustada / 100) * donutCircumference
    const offset = donutCircumference - (acumulado / 100) * donutCircumference
    
    const slice = {
      ...s,
      dashArray: `${strokeLength} ${donutCircumference}`,
      offset: -acumulado, // Usando offset acumulado negativo no stroke-dashoffset
      porcentagemReal: porcentagemAjustada.toFixed(0)
    }
    acumulado += porcentagemAjustada
    return slice
  })
})

// Métricas Dinâmicas Calculadas com base no Gráfico Filtrado
const totalAportesFiltrado = computed(() => {
  const dados = dadosEvolucaoFiltrados.value
  if (dados.length === 0) return 0
  return dados[dados.length - 1].valor
})

const totalContratosFiltrado = computed(() => {
  return dadosEvolucaoFiltrados.value.reduce((total, d) => Math.max(total, d.contratos), 0)
})

// Abrir e iniciar exportação
function abrirExportador() {
  formExport.nome = `Relatório Corporativo - ${new Date().toLocaleDateString('pt-BR')}`
  exportEtapa.value = 0
  exportProgresso.value = 0
  exportando.value = false
  mostrarModalExportar.value = true
}

async function dispararExportacao() {
  exportando.value = true
  
  // Executa passos animados
  for (let i = 0; i < exportEtapasText.length; i++) {
    exportEtapa.value = i
    exportProgresso.value = Math.min((i + 1) * 22, 100)
    await new Promise(r => setTimeout(r, 650))
  }
  
  try {
    const emailSolicitante = authStore.user?.email || 'admin@climbe.com'
    await exportarRelatorio(formExport.nome, formExport.formato, formExport.periodo, emailSolicitante)
    
    mostrarModalExportar.value = false
    mostrarFeedback(`Relatório "${formExport.nome}" gerado e salvo no histórico!`)
    
    // Recarrega dados atualizados
    await carregarDados()
  } catch (err) {
    mostrarFeedback('Erro na exportação: ' + err.message, 'error')
  } finally {
    exportando.value = false
  }
}

// Simulador de download de arquivo histórico
const baixandoId = ref(null)

async function fazerDownload(rep) {
  baixandoId.value = rep.id
  await new Promise(r => setTimeout(r, 1200)) // Simulação de download
  baixandoId.value = null
  alert(`Download concluído: ${rep.nome}.${rep.tipo.toLowerCase()} (${rep.tamanho})`)
}
</script>

<template>
  <ClimbePageWrapper title="Relatórios" :active-tab="activeTab" @navigate="navegarPeloMenu">
    <div class="flex flex-col gap-6">
      
      <!-- Cabeçalho -->
      <div class="flex flex-col gap-3 border-b border-[#5fc2ba2e] pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="mb-1 text-[2rem] font-black text-white">Relatórios & Analytics</h1>
          <p class="text-climbe-text-muted">Acompanhe a evolução de capital fiduciário alocado e exporte demonstrativos detalhados.</p>
        </div>
        <ClimbeButton
          variant="primary"
          class="!h-12 !rounded-md !px-6 !font-bold"
          @click="abrirExportador"
        >
          📈 Exportar Novo Relatório
        </ClimbeButton>
      </div>

      <!-- Feedbacks Globais -->
      <transition name="fade">
        <div v-if="feedbackMsg" 
             :class="feedbackTipo === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'"
             class="rounded-md border p-4 text-sm flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all">
          <span>{{ feedbackTipo === 'success' ? '✅' : '⚠️' }}</span>
          <span>{{ feedbackMsg }}</span>
        </div>
      </transition>

      <div v-if="carregando" class="text-center py-20 text-climbe-text-muted font-medium">
        <div class="spinner mb-3"></div>
        Gerando métricas e carregando gráficos...
      </div>

      <div v-else class="flex flex-col gap-6">
        
        <!-- Cards de Métricas Consolidadas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ClimbeCard padding="md" variant="solid" hoverable class="metric-glass">
            <div class="flex justify-between items-center text-[0.72rem] text-climbe-text-muted uppercase font-heavy tracking-wider mb-2">
              <span>Capital sob Gestão</span>
              <ClimbeBadge variant="primary">Total</ClimbeBadge>
            </div>
            <div class="text-[2.2rem] font-black text-white leading-none mb-1">
              {{ formatarDinheiro(totalAportesFiltrado) }}
            </div>
            <p class="text-[0.75rem] text-[#5fc2ba]">Ativos corporativos vigentes</p>
          </ClimbeCard>

          <ClimbeCard padding="md" variant="solid" hoverable class="metric-glass">
            <div class="flex justify-between items-center text-[0.72rem] text-climbe-text-muted uppercase font-heavy tracking-wider mb-2">
              <span>Ticket Médio</span>
              <ClimbeBadge variant="success">Unitário</ClimbeBadge>
            </div>
            <div class="text-[2.2rem] font-black text-white leading-none mb-1">
              {{ formatarDinheiro(metricasGerais.ticketMedio) }}
            </div>
            <p class="text-[0.75rem] text-climbe-text-muted">Valor médio por contrato</p>
          </ClimbeCard>

          <ClimbeCard padding="md" variant="solid" hoverable class="metric-glass">
            <div class="flex justify-between items-center text-[0.72rem] text-climbe-text-muted uppercase font-heavy tracking-wider mb-2">
              <span>Taxa de Crescimento</span>
              <ClimbeBadge variant="warning">Performance</ClimbeBadge>
            </div>
            <div class="text-[2.2rem] font-black text-[#5fc2ba] leading-none mb-1">
              +{{ metricasGerais.taxaCrescimento }}%
            </div>
            <p class="text-[0.75rem] text-climbe-text-muted">Comparativo vs trimestre anterior</p>
          </ClimbeCard>

          <ClimbeCard padding="md" variant="solid" hoverable class="metric-glass">
            <div class="flex justify-between items-center text-[0.72rem] text-climbe-text-muted uppercase font-heavy tracking-wider mb-2">
              <span>Auditorias Compliance</span>
              <ClimbeBadge variant="success">Jurídico</ClimbeBadge>
            </div>
            <div class="text-[2.2rem] font-black text-white leading-none mb-1">
              {{ metricasGerais.auditoriasConcluidas }} / {{ metricasGerais.auditoriasConcluidas + metricasGerais.auditoriasPendentes }}
            </div>
            <p class="text-[0.75rem] text-climbe-text-muted">Processos fiduciários revisados</p>
          </ClimbeCard>
        </div>

        <!-- Seção de Gráficos e Filtros Rápidos -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Grafico 1: Evolucao de Aportes -->
          <div class="lg:col-span-2">
            <ClimbeCard padding="lg" variant="solid" class="chart-card">
              <template #header>
                <div class="flex justify-between items-center border-b border-[#5fc2ba1c] pb-3 mb-4 w-full">
                  <div>
                    <h3 class="text-[1.1rem] m-0 font-heavy text-white">Evolução do Capital Alocado</h3>
                    <p class="text-xs text-climbe-text-muted mt-0.5">Histórico consolidado em reais de aportes contratuais.</p>
                  </div>
                  
                  <select v-model="filtroPeriodo" class="chart-filter">
                    <option value="trimestre">Último Trimestre</option>
                    <option value="semestre">Último Semestre</option>
                    <option value="ano">Ano Completo</option>
                  </select>
                </div>
              </template>

              <!-- SVG Line Chart -->
              <div class="relative w-full overflow-hidden flex flex-col items-center">
                <!-- Tooltip flutuante interativo -->
                <div class="chart-tooltip" v-if="hoveredIndex !== null" 
                     :style="{ left: `${pontosGrafico[hoveredIndex].x - 60}px`, top: `${pontosGrafico[hoveredIndex].y - 45}px` }">
                  <div class="text-[0.7rem] font-bold text-climbe-primary">{{ pontosGrafico[hoveredIndex].mes }}</div>
                  <div class="text-[0.8rem] font-black text-white">{{ formatarDinheiro(pontosGrafico[hoveredIndex].valor) }}</div>
                  <div class="text-[0.65rem] text-climbe-text-muted">{{ pontosGrafico[hoveredIndex].contratos }} contratos</div>
                </div>

                <svg :width="svgWidth" :height="svgHeight" viewBox="0 0 600 220" class="w-full h-auto">
                  <defs>
                    <!-- Gradiente sob a linha -->
                    <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#5fc2ba" stop-opacity="0.3" />
                      <stop offset="100%" stop-color="#5fc2ba" stop-opacity="0.0" />
                    </linearGradient>
                    <!-- Gradiente da própria linha -->
                    <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stop-color="#38bdf8" />
                      <stop offset="50%" stop-color="#5fc2ba" />
                      <stop offset="100%" stop-color="#67cec7" />
                    </linearGradient>
                  </defs>

                  <!-- Grid Lines -->
                  <line x1="50" y1="30" x2="550" y2="30" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
                  <line x1="50" y1="85" x2="550" y2="85" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
                  <line x1="50" y1="140" x2="550" y2="140" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
                  <line x1="50" y1="190" x2="550" y2="190" stroke="rgba(255,255,255,0.07)" stroke-width="1.5" />

                  <!-- Area Path -->
                  <path :d="areaPathD" fill="url(#chart-area-grad)" />

                  <!-- Line Path -->
                  <path :d="pathD" fill="none" stroke="url(#chart-line-grad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

                  <!-- Eixo X Labels -->
                  <text v-for="p in pontosGrafico" :key="p.mes"
                        :x="p.x" :y="208" 
                        class="svg-axis-text" text-anchor="middle">
                    {{ p.mes.split('/')[0] }}
                  </text>

                  <!-- Eixo Y Labels -->
                  <text x="42" y="34" class="svg-axis-text" text-anchor="end">30M</text>
                  <text x="42" y="89" class="svg-axis-text" text-anchor="end">20M</text>
                  <text x="42" y="144" class="svg-axis-text" text-anchor="end">10M</text>

                  <!-- Interatividade / Hover Dots -->
                  <g>
                    <!-- Círculos invisíveis maiores para facilitar o hover -->
                    <circle v-for="(p, idx) in pontosGrafico" :key="'touch-'+idx"
                            :cx="p.x" :cy="p.y" r="14"
                            fill="transparent" class="cursor-pointer"
                            @mouseenter="hoveredIndex = idx"
                            @mouseleave="hoveredIndex = null" />

                    <!-- Círculos visíveis menores -->
                    <circle v-for="(p, idx) in pontosGrafico" :key="'dot-'+idx"
                            :cx="p.x" :cy="p.y" 
                            :r="hoveredIndex === idx ? 7 : 4.5"
                            :fill="hoveredIndex === idx ? '#ffffff' : '#5fc2ba'"
                            :stroke="hoveredIndex === idx ? '#3e8882' : '#121312'"
                            stroke-width="2"
                            class="transition-all duration-200 pointer-events-none" />
                  </g>
                </svg>
              </div>
            </ClimbeCard>
          </div>

          <!-- Grafico 2: Distribuicao por Setor -->
          <div class="lg:col-span-1">
            <ClimbeCard padding="lg" variant="solid" class="chart-card h-full">
              <template #header>
                <div class="flex justify-between items-center border-b border-[#5fc2ba1c] pb-3 mb-4 w-full">
                  <div>
                    <h3 class="text-[1.1rem] m-0 font-heavy text-white">Carteira por Setor</h3>
                    <p class="text-xs text-climbe-text-muted mt-0.5">Divisão setorial de aportes ativos.</p>
                  </div>
                  
                  <select v-model="filtroSetor" class="chart-filter">
                    <option value="todos">Todos</option>
                    <option value="Finanças">Finanças</option>
                    <option value="Tecnologia">Tech</option>
                    <option value="Imobiliário">Real Estate</option>
                  </select>
                </div>
              </template>

              <!-- SVG Donut Chart -->
              <div class="flex flex-col items-center gap-4">
                <div class="relative w-36 h-36">
                  <svg width="144" height="144" viewBox="0 0 100 100" class="transform -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.03)" stroke-width="10" />
                    
                    <!-- Slices -->
                    <circle v-for="(slice, idx) in donutSlices" :key="'slice-'+idx"
                            cx="50" cy="50" r="45"
                            fill="transparent"
                            :stroke="slice.cor"
                            stroke-width="10"
                            :stroke-dasharray="slice.dashArray"
                            :stroke-dashoffset="slice.offset"
                            class="donut-segment transition-all duration-500"
                            v-tooltip="slice.nome" />
                  </svg>
                  
                  <!-- Centro do Donut -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-[0.7rem] uppercase text-climbe-text-muted font-heavy">Ativos</span>
                    <span class="text-lg font-black text-white">{{ totalContratosFiltrado }}</span>
                  </div>
                </div>

                <!-- Legenda do Donut -->
                <div class="w-full flex flex-col gap-2 text-xs">
                  <div v-for="slice in donutSlices" :key="slice.nome" class="flex justify-between items-center border-b border-white/5 pb-1">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: slice.cor }"></span>
                      <span class="text-climbe-text-muted truncate max-w-[130px]">{{ slice.nome }}</span>
                    </div>
                    <span class="font-bold text-white">{{ slice.porcentagemReal }}% ({{ slice.quantidade }})</span>
                  </div>
                </div>
              </div>
            </ClimbeCard>
          </div>

        </div>

        <!-- Tabela Histórica de Relatórios Gerados -->
        <ClimbeCard padding="lg" variant="solid" class="chart-card">
          <template #header>
            <div class="flex justify-between items-center border-b border-[#5fc2ba1c] pb-4 mb-4 w-full">
              <div>
                <h3 class="text-lg font-heavy text-white m-0">Histórico de Relatórios Gerados</h3>
                <p class="text-xs text-climbe-text-muted mt-0.5">Acesse ou faça download dos demonstrativos exportados pela equipe Climbe.</p>
              </div>
            </div>
          </template>

          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse text-left">
              <thead>
                <tr class="border-b border-[#5fc2ba1e] bg-white/5 text-[#b7d4de] font-heavy text-xs uppercase">
                  <th class="px-4 py-3">ID</th>
                  <th class="px-4 py-3">Nome do Relatório</th>
                  <th class="px-4 py-3">Período</th>
                  <th class="px-4 py-3">Formato / Tamanho</th>
                  <th class="px-4 py-3">Gerado em</th>
                  <th class="px-4 py-3">Autor</th>
                  <th class="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#5fc2ba0f]">
                <tr v-for="rep in historicoRelatorios" :key="rep.id" class="hover:bg-white/[0.02] transition-colors">
                  <td class="px-4 py-3 font-mono text-[#5fc2ba] font-bold text-xs">{{ rep.id }}</td>
                  <td class="px-4 py-3 text-white font-heavy text-xs md:text-sm">{{ rep.nome }}</td>
                  <td class="px-4 py-3 text-climbe-text-muted text-xs">{{ rep.periodo }}</td>
                  <td class="px-4 py-3 text-xs">
                    <span :class="rep.tipo === 'PDF' ? 'bg-red-500/10 text-red-300 border-red-500/25' : 'bg-green-500/10 text-green-300 border-green-500/25'"
                          class="border rounded px-1.5 py-0.5 font-bold text-[0.65rem]">
                      {{ rep.tipo }}
                    </span>
                    <span class="text-climbe-text-muted ml-2 text-[0.72rem]">{{ rep.tamanho }}</span>
                  </td>
                  <td class="px-4 py-3 text-climbe-text-muted text-xs">{{ formatarData(rep.gerado_em) }}</td>
                  <td class="px-4 py-3 text-climbe-text-muted text-xs">{{ rep.gerado_por }}</td>
                  <td class="px-4 py-3 text-right">
                    <ClimbeButton 
                      variant="ghost" 
                      class="!py-1 !px-3 !text-xs !h-auto"
                      :loading="baixandoId === rep.id"
                      @click="fazerDownload(rep)"
                    >
                      {{ baixandoId === rep.id ? 'Baixando...' : '📥 Baixar' }}
                    </ClimbeButton>
                  </td>
                </tr>
                <tr v-if="historicoRelatorios.length === 0">
                  <td colspan="7" class="text-center py-10 text-climbe-text-muted">Nenhum relatório encontrado no histórico.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ClimbeCard>
      </div>

      <!-- MODAL DE EXPORTAÇÃO (WIZARD) -->
      <transition name="fade">
        <div v-if="mostrarModalExportar" class="modal-backdrop flex items-center justify-center" @click.self="!exportando && (mostrarModalExportar = false)">
          <div class="modal-content w-full max-w-md p-6 border border-[#5fc2ba32] bg-[#101718] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            <div class="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 class="text-lg font-black text-white m-0">Exportar Novo Relatório</h3>
              <button class="text-climbe-text-muted hover:text-white bg-transparent border-none text-xl cursor-pointer" 
                      v-if="!exportando" @click="mostrarModalExportar = false">&times;</button>
            </div>

            <!-- Formulário de Entrada -->
            <form v-if="!exportando" @submit.prevent="dispararExportacao" class="flex flex-col gap-4">
              <ClimbeInput 
                id="exp-name"
                v-model="formExport.nome"
                label="Título do Documento"
                placeholder="Ex: Demonstrativo Contábil"
              />

              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-[0.72rem] font-bold text-[#b7d4de] uppercase">Formato</label>
                  <select v-model="formExport.formato" class="modal-select">
                    <option value="PDF">Documento (PDF)</option>
                    <option value="XLSX">Planilha (XLSX)</option>
                  </select>
                </div>
                
                <div class="flex flex-col gap-1">
                  <label class="text-[0.72rem] font-bold text-[#b7d4de] uppercase">Período de Dados</label>
                  <select v-model="formExport.periodo" class="modal-select">
                    <option value="Último trimestre">Último Trimestre</option>
                    <option value="Últimos 6 meses">Últimos 6 meses</option>
                    <option value="Anual 2026">Anual 2026</option>
                    <option value="Histórico Completo">Histórico Completo</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-4 pt-3 border-t border-white/5">
                <ClimbeButton variant="ghost" type="button" @click="mostrarModalExportar = false">Cancelar</ClimbeButton>
                <ClimbeButton variant="primary" type="submit">Gerar Relatório</ClimbeButton>
              </div>
            </form>

            <!-- Loading animado de progresso -->
            <div v-else class="flex flex-col items-center py-6 text-center">
              <div class="spinner-large mb-6"></div>
              
              <div class="w-full bg-white/5 h-2.5 rounded-full overflow-hidden mb-4 border border-white/5 relative">
                <div class="bg-climbe-primary h-full transition-all duration-500 rounded-full" 
                     :style="{ width: `${exportProgresso}%` }"></div>
              </div>
              
              <h4 class="text-sm font-heavy text-white mb-1 transition-all duration-300">
                {{ exportEtapasText[exportEtapa] }}
              </h4>
              <p class="text-xs text-climbe-text-muted">Por favor, não feche o painel durante a consolidação.</p>
            </div>

          </div>
        </div>
      </transition>

    </div>
  </ClimbePageWrapper>
</template>

<style scoped>
.chart-card {
  border: 1px solid rgba(95, 194, 186, 0.22) !important;
  background: #101718 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25) !important;
}

.metric-glass {
  border: 1px solid rgba(95, 194, 186, 0.18) !important;
  background: linear-gradient(135deg, #101718, #131c1d) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 3px solid rgba(95, 194, 186, 0.1);
  border-top-color: #5fc2ba;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

.spinner-large {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: 4px solid rgba(95, 194, 186, 0.1);
  border-top-color: #5fc2ba;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Filtros e seleções dos gráficos */
.chart-filter {
  padding: 0.4rem 1.8rem 0.4rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(95, 194, 186, 0.25);
  background: #182225;
  color: #eef8fb;
  font-size: 0.82rem;
  outline: none;
  cursor: pointer;
  appearance: none;
  font-weight: 700;
  transition: border-color 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a2b4b2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
}
.chart-filter:focus {
  border-color: #5fc2ba;
}

/* Eixos do Gráfico SVG */
.svg-axis-text {
  fill: #7ba8b4;
  font-family: var(--font-family-avenir);
  font-size: 10px;
  font-weight: var(--font-weight-heavy);
}

/* Tooltip flutuante */
.chart-tooltip {
  position: absolute;
  background: #182225;
  border: 1px solid #5fc2ba;
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  z-index: 10;
  min-width: 110px;
  text-align: left;
  transition: opacity 0.15s ease, left 0.15s ease, top 0.15s ease;
}

/* Animações e Efeitos do Donut */
.donut-segment {
  cursor: pointer;
  transition: stroke-width 0.2s ease, stroke-dashoffset 0.5s ease-out;
}
.donut-segment:hover {
  stroke-width: 13;
}

/* Modal Estilos */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 999;
}
.modal-select {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(95, 194, 186, 0.25);
  background: #182225;
  color: #eef8fb;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.modal-select:focus {
  border-color: #5fc2ba;
}

/* Suporte a Tema Claro */
:global(.light-theme) .chart-card,
:global(.light-theme) .metric-glass {
  background: #ffffff !important;
  border: 1px solid rgba(95, 194, 186, 0.22) !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05) !important;
}
:global(.light-theme) .metric-glass {
  background: linear-gradient(135deg, #ffffff, #f7f9f9) !important;
}
:global(.light-theme) .chart-filter,
:global(.light-theme) .modal-select {
  background-color: #f0f4f4;
  color: #1a2322;
  border-color: rgba(95, 194, 186, 0.2);
}
:global(.light-theme) .chart-tooltip {
  background: #ffffff;
  border-color: #5fc2ba;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}
:global(.light-theme) .svg-axis-text {
  fill: #546866;
}
:global(.light-theme) .chart-card text {
  fill: #1a2322;
}
:global(.light-theme) .chart-card table th {
  background-color: #f0f4f4;
  color: #546866;
}
:global(.light-theme) .chart-card table td {
  color: #1a2322;
}
:global(.light-theme) .chart-card table tr:hover {
  background-color: rgba(95, 194, 186, 0.04);
}
:global(.light-theme) .modal-content {
  background-color: #ffffff !important;
  border-color: rgba(95, 194, 186, 0.25) !important;
}
:global(.light-theme) .modal-content h3,
:global(.light-theme) .modal-content h4 {
  color: #1a2322 !important;
}
</style>
