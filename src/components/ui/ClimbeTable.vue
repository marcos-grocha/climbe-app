<script setup>
const props = defineProps({
  headers: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: 'Nenhum registro encontrado.'
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['page-change'])

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<template>
  <div class="climbe-table-wrapper">
    <div class="table-responsive">
      <table class="climbe-table">
        <thead>
          <tr>
            <!-- Cabeçalhos customizados ou simples -->
            <th v-for="(header, index) in headers" :key="index">
              <slot :name="`header-${header.value || header}`" :header="header">
                {{ header.label || header }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Estado de Carregamento (Loading Skeleton) -->
          <template v-if="loading">
            <tr v-for="i in 3" :key="`loading-${i}`" class="loading-row">
              <td v-for="j in headers.length" :key="`col-${j}`">
                <div class="skeleton-bar"></div>
              </td>
            </tr>
          </template>
          
          <!-- Estado Vazio (Nenhum Item) -->
          <tr v-else-if="items.length === 0" class="empty-row">
            <td :colspan="headers.length" class="empty-cell">
              <div class="empty-state-content">
                <span class="empty-icon">📂</span>
                <p>{{ emptyText }}</p>
              </div>
            </td>
          </tr>
          
          <!-- Renderização Normal de Itens -->
          <template v-else>
            <tr v-for="(item, index) in items" :key="index">
              <td v-for="(header, hIndex) in headers" :key="hIndex">
                <slot :name="`cell-${header.value || header}`" :item="item" :index="index">
                  {{ item[header.value || header] }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Paginação do Design System -->
    <div v-if="totalPages > 1 && !loading" class="climbe-table-pagination">
      <span class="pagination-info">
        Página <strong>{{ currentPage }}</strong> de <strong>{{ totalPages }}</strong>
      </span>
      <div class="pagination-actions">
        <button 
          class="pag-btn" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          aria-label="Página anterior"
        >
          &larr;
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="pag-btn page-num"
          :class="{ 'active': page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button 
          class="pag-btn" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          aria-label="Próxima página"
        >
          &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.climbe-table-wrapper {
  width: 100%;
  font-family: var(--font-family-avenir);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--climbe-neutral-border);
  border-radius: var(--radius-sm);
  background-color: var(--climbe-neutral-card);
}

.climbe-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

th {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--climbe-neutral-border);
  color: var(--climbe-text-muted);
  font-weight: var(--font-weight-heavy);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: var(--climbe-neutral-mute);
  user-select: none;
}

td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--climbe-neutral-border);
  color: var(--climbe-text-main);
  transition: background-color 0.2s ease;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover:not(.empty-row):not(.loading-row) td {
  background-color: var(--climbe-primary-light);
}

/* Skeletons para Loading */
.loading-row td {
  padding: var(--space-5) var(--space-4);
}

.skeleton-bar {
  height: 14px;
  background: linear-gradient(90deg, var(--climbe-neutral-mute) 25%, var(--climbe-neutral-border) 50%, var(--climbe-neutral-mute) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeletonLoad 1.5s infinite linear;
}

@keyframes skeletonLoad {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Estado Vazio */
.empty-cell {
  padding: var(--space-12) var(--space-4) !important;
  text-align: center;
  border-bottom: none;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.empty-icon {
  font-size: 2.2rem;
  filter: grayscale(0.5);
}

.empty-state-content p {
  font-size: 0.95rem;
  font-weight: var(--font-weight-medium);
  color: var(--climbe-text-muted);
}

/* Paginação */
.climbe-table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  padding: 0 var(--space-1);
}

.pagination-info {
  color: var(--climbe-text-muted);
}

.pagination-info strong {
  color: var(--climbe-text-main);
  font-weight: var(--font-weight-heavy);
}

.pagination-actions {
  display: flex;
  gap: var(--space-1);
}

.pag-btn {
  background: var(--climbe-neutral-card);
  border: 1px solid var(--climbe-neutral-border);
  color: var(--climbe-text-main);
  min-width: 32px;
  height: 32px;
  padding: 0 var(--space-2);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: var(--font-weight-heavy);
  transition: all 0.2s ease;
  outline: none;
}

.pag-btn:hover:not(:disabled) {
  border-color: var(--climbe-primary);
  background-color: var(--climbe-primary-light);
  color: var(--climbe-primary-hover);
}

.pag-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--climbe-neutral-mute);
}

.page-num {
  font-size: 0.8rem;
}

.page-num.active {
  background-color: var(--climbe-primary);
  border-color: var(--climbe-primary);
  color: var(--climbe-text-on-primary);
}
</style>
