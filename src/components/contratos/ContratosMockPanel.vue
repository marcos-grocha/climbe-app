<script setup>
import { ref, reactive, computed } from 'vue'
import ClimbeCard from '@/components/ui/ClimbeCard.vue'
import ClimbeButton from '@/components/ui/ClimbeButton.vue'
import ClimbeInput from '@/components/ui/ClimbeInput.vue'
import ClimbeBadge from '@/components/ui/ClimbeBadge.vue'
import ClimbeTable from '@/components/ui/ClimbeTable.vue'
import Dialog from 'primevue/dialog'
import { useContratosPainelMockStore } from '@/stores/contratosPainelMockStore.js'

const store = useContratosPainelMockStore()

const filters = reactive({
  titulo: '',
  empresa: '',
  status: '',
})

const isTableLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 6

const tableHeaders = [
  { value: 'id', label: 'ID' },
  { value: 'titulo', label: 'Contrato / Objeto' },
  { value: 'empresa', label: 'Cliente/Empresa' },
  { value: 'valor', label: 'Valor' },
  { value: 'dataAtualizacao', label: 'Última Atualização' },
  { value: 'status', label: 'Status' },
  { value: 'actions', label: 'Ações' },
]

const contratosFiltrados = computed(() => {
  return store.contratos.filter((item) => {
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
  }, 400)
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
  setTimeout(() => {
    isTableLoading.value = false
  }, 300)
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

const formatDateBr = (dateStr) => {
  if (!dateStr) return '-'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

// Modais e fluxo
const modalAberto = ref(false)
const modalModo = ref('criar') // 'criar', 'editar', 'visualizar'
const contratoAtual = ref({})

const abrirModalCriar = () => {
  modalModo.value = 'criar'
  contratoAtual.value = {
    titulo: '',
    empresa: '',
    responsavel: '',
    valor: 0,
    status: 'Em Elaboração',
    dataInicial: '',
    dataFinal: '',
    observacao: '',
  }
  modalAberto.value = true
}

const abrirModalVisualizar = (contrato) => {
  modalModo.value = 'visualizar'
  contratoAtual.value = { ...contrato }
  modalAberto.value = true
}

const abrirModalEditar = (contrato) => {
  modalModo.value = 'editar'
  contratoAtual.value = { ...contrato }
  modalAberto.value = true
}

const salvarContrato = () => {
  if (
    !contratoAtual.value.titulo ||
    !contratoAtual.value.empresa ||
    !contratoAtual.value.dataInicial ||
    !contratoAtual.value.dataFinal
  ) {
    alert('Preencha os campos obrigatórios (Título, Empresa, Datas).')
    return
  }

  if (new Date(contratoAtual.value.dataFinal) < new Date(contratoAtual.value.dataInicial)) {
    alert('A data final não pode ser anterior à data inicial.')
    return
  }

  if (contratoAtual.value.valor < 0) {
    alert('O valor deve ser positivo.')
    return
  }

  if (modalModo.value === 'criar') {
    store.adicionarContrato(contratoAtual.value)
    alert('Contrato salvo localmente com sucesso!')
  } else if (modalModo.value === 'editar') {
    store.atualizarContrato(contratoAtual.value.id, contratoAtual.value)
    alert('Contrato atualizado com sucesso!')
  }

  modalAberto.value = false
}

const encerrarContratoBtn = (id) => {
  if (confirm(`Tem certeza que deseja encerrar o contrato #${id}?`)) {
    store.encerrarContrato(id)
    alert('Contrato encerrado.')
  }
}

const getBadgeVariant = (status) => {
  const map = {
    Vigente: 'primary',
    Aprovado: 'success',
    'Em Análise': 'warning',
    'Em Elaboração': 'secondary',
    Cancelado: 'danger',
    Encerrado: 'danger',
  }
  return map[status] || 'secondary'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="mb-2">
      <h1 class="text-[2rem] mb-1 font-black">Gestão de Contratos</h1>
      <p class="text-climbe-text-muted">
        Consulte, filtre, crie e encerre contratos na plataforma.
      </p>
    </div>

    <!-- Filtros -->
    <ClimbeCard padding="md" variant="solid" class="mb-2">
      <form @submit.prevent="handleSearch" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ClimbeInput
            id="filter-title"
            v-model="filters.titulo"
            label="Título ou Objeto"
            placeholder="Ex: Assessoria..."
          />
          <ClimbeInput
            id="filter-company"
            v-model="filters.empresa"
            label="Empresa / Cliente"
            placeholder="Ex: XP..."
          />

          <div class="flex flex-col relative font-avenir group">
            <div class="relative flex items-center">
              <select
                id="filter-status"
                v-model="filters.status"
                class="peer w-full px-4 pt-[1.5rem] pb-[0.7rem] rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main text-[0.95rem] outline-none transition-all duration-250 box-border appearance-none cursor-pointer focus:border-climbe-primary focus:ring-[3px] focus:ring-climbe-primary-light"
              >
                <option value="">Todos os Status</option>
                <option value="Em Elaboração">Em Elaboração</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Vigente">Vigente</option>
                <option value="Encerrado">Encerrado</option>
                <option value="Cancelado">Cancelado</option>
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

    <!-- Tabela -->
    <ClimbeCard padding="lg" variant="solid">
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h3 class="text-[1.1rem] m-0 font-heavy">Instrumentos Cadastrados</h3>
          <ClimbeButton variant="primary" @click="abrirModalCriar">
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

        <template #cell-dataAtualizacao="{ item }">
          <span class="text-climbe-text-muted text-sm">{{ formatDateBr(item.dataAtualizacao) }}</span>
        </template>

        <template #cell-status="{ item }">
          <ClimbeBadge :variant="getBadgeVariant(item.status)">{{ item.status }}</ClimbeBadge>
        </template>

        <template #cell-actions="{ item }">
          <div class="flex gap-2">
            <ClimbeButton
              variant="ghost"
              class="!px-3 !py-1 !text-[0.8rem]"
              @click="abrirModalVisualizar(item)"
              >Ver</ClimbeButton
            >
            <ClimbeButton
              v-if="item.status !== 'Encerrado'"
              variant="ghost"
              class="!px-3 !py-1 !text-[0.8rem] !text-climbe-primary"
              @click="abrirModalEditar(item)"
              >Editar</ClimbeButton
            >
            <ClimbeButton
              v-if="item.status !== 'Encerrado'"
              variant="danger"
              class="!px-3 !py-1 !text-[0.8rem]"
              @click="encerrarContratoBtn(item.id)"
              >Encerrar</ClimbeButton
            >
          </div>
        </template>
      </ClimbeTable>
    </ClimbeCard>

    <!-- Modal (Visualizar, Criar, Editar) -->
    <Dialog
      v-model:visible="modalAberto"
      modal
      :header="
        modalModo === 'visualizar'
          ? 'Detalhes do Contrato'
          : modalModo === 'criar'
          ? 'Novo Contrato'
          : 'Editar Contrato'
      "
      :style="{ width: '40rem', maxWidth: '95vw' }"
    >
      <div v-if="modalModo === 'visualizar'" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <strong class="block text-sm text-climbe-text-muted mb-1">ID do Contrato</strong>
            <span>#{{ contratoAtual.id }}</span>
          </div>
          <div>
            <strong class="block text-sm text-climbe-text-muted mb-1">Status</strong>
            <ClimbeBadge :variant="getBadgeVariant(contratoAtual.status)">{{
              contratoAtual.status
            }}</ClimbeBadge>
          </div>
          <div>
            <strong class="block text-sm text-climbe-text-muted mb-1">Empresa/Cliente</strong>
            <span>{{ contratoAtual.empresa }}</span>
          </div>
          <div>
            <strong class="block text-sm text-climbe-text-muted mb-1">Objeto/Título</strong>
            <span>{{ contratoAtual.titulo }}</span>
          </div>
          <div>
            <strong class="block text-sm text-climbe-text-muted mb-1">Data Inicial</strong>
            <span>{{ formatDateBr(contratoAtual.dataInicial) }}</span>
          </div>
          <div>
            <strong class="block text-sm text-climbe-text-muted mb-1">Data Final</strong>
            <span>{{ formatDateBr(contratoAtual.dataFinal) }}</span>
          </div>
          <div>
            <strong class="block text-sm text-climbe-text-muted mb-1">Valor do Contrato</strong>
            <span>{{ formatCurrency(contratoAtual.valor) }}</span>
          </div>
          <div>
            <strong class="block text-sm text-climbe-text-muted mb-1">Responsável</strong>
            <span>{{ contratoAtual.responsavel || '-' }}</span>
          </div>
          <div class="col-span-2">
            <strong class="block text-sm text-climbe-text-muted mb-1">Observações</strong>
            <p class="m-0 text-sm leading-relaxed">{{ contratoAtual.observacao || 'Nenhuma observação informada.' }}</p>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClimbeInput
            id="form-empresa"
            v-model="contratoAtual.empresa"
            label="Empresa / Cliente *"
          />
          <ClimbeInput
            id="form-titulo"
            v-model="contratoAtual.titulo"
            label="Título / Objeto *"
          />
          <ClimbeInput
            id="form-responsavel"
            v-model="contratoAtual.responsavel"
            label="Responsável"
          />
          
          <div class="flex flex-col relative font-avenir group">
            <div class="relative flex items-center">
              <select
                id="form-status"
                v-model="contratoAtual.status"
                class="peer w-full px-4 pt-[1.5rem] pb-[0.7rem] rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main text-[0.95rem] outline-none transition-all duration-250 box-border appearance-none cursor-pointer focus:border-climbe-primary focus:ring-[3px] focus:ring-climbe-primary-light"
              >
                <option value="Em Elaboração">Em Elaboração</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Vigente">Vigente</option>
                <option value="Cancelado">Cancelado</option>
                <!-- Removido 'Encerrado' porque há um botão de ação direto pra isso -->
              </select>
              <label
                for="form-status"
                class="absolute left-4 top-[30%] -translate-y-[80%] scale-80 text-climbe-primary font-heavy pointer-events-none text-[0.95rem] origin-top-left"
                >Status Inicial</label
              >
              <div
                class="after:content-['▼'] after:text-[0.7rem] after:text-climbe-text-muted after:absolute after:right-5 after:pointer-events-none flex items-center h-full absolute right-0"
              ></div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-heavy text-climbe-primary mb-1">Data Inicial *</label>
            <input type="date" v-model="contratoAtual.dataInicial" class="w-full px-4 py-2 rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main outline-none focus:border-climbe-primary" />
          </div>
          
          <div class="flex flex-col gap-1">
            <label class="text-xs font-heavy text-climbe-primary mb-1">Data Final *</label>
            <input type="date" v-model="contratoAtual.dataFinal" class="w-full px-4 py-2 rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main outline-none focus:border-climbe-primary" />
          </div>
          
          <div class="flex flex-col gap-1 md:col-span-2">
            <label class="text-xs font-heavy text-climbe-primary mb-1">Valor (R$)</label>
            <input type="number" v-model="contratoAtual.valor" min="0" step="0.01" class="w-full px-4 py-2 rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main outline-none focus:border-climbe-primary" />
          </div>

          <div class="flex flex-col gap-1 md:col-span-2">
            <label class="text-xs font-heavy text-climbe-primary mb-1">Observações</label>
            <textarea v-model="contratoAtual.observacao" rows="3" class="w-full px-4 py-2 rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main outline-none focus:border-climbe-primary resize-none"></textarea>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <ClimbeButton variant="ghost" @click="modalAberto = false">Cancelar</ClimbeButton>
          <ClimbeButton v-if="modalModo !== 'visualizar'" variant="primary" @click="salvarContrato">
            Salvar Contrato
          </ClimbeButton>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* Adicionando estilo básico caso haja overflow */
</style>
