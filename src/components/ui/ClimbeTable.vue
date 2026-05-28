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
  <div class="w-full font-[var(--font-family-avenir)] flex flex-col gap-4">
    <div class="w-full overflow-x-auto border border-[var(--climbe-neutral-border)] rounded-[var(--radius-sm)] bg-[var(--climbe-neutral-card)]">
      <table class="w-full border-collapse text-left text-[0.9rem]">
        <thead>
          <tr>
            <!-- Cabeçalhos customizados ou simples -->
            <th 
              v-for="(header, index) in headers" 
              :key="index"
              class="px-4 py-3 border-b border-[var(--climbe-neutral-border)] text-[var(--climbe-text-muted)] font-extrabold text-[0.8rem] uppercase tracking-wider bg-[var(--climbe-neutral-mute)] select-none"
            >
              <slot :name="`header-${header.value || header}`" :header="header">
                {{ header.label || header }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Estado de Carregamento (Loading Skeleton) -->
          <template v-if="loading">
            <tr v-for="i in 3" :key="`loading-${i}`" class="border-b border-[var(--climbe-neutral-border)] last:border-none">
              <td v-for="j in headers.length" :key="`col-${j}`" class="py-5 px-4">
                <div class="skeleton-bar"></div>
              </td>
            </tr>
          </template>
          
          <!-- Estado Vazio (Nenhum Item) -->
          <tr v-else-if="items.length === 0" class="border-b border-[var(--climbe-neutral-border)] last:border-none">
            <td :colspan="headers.length" class="!py-12 px-4 text-center border-none">
              <div class="flex flex-col items-center gap-2">
                <span class="text-[2.2rem] grayscale-[0.5]">📂</span>
                <p class="text-[0.95rem] font-medium text-[var(--climbe-text-muted)]">{{ emptyText }}</p>
              </div>
            </td>
          </tr>
          
          <!-- Renderização Normal de Itens -->
          <template v-else>
            <tr 
              v-for="(item, index) in items" 
              :key="index"
              class="border-b border-[var(--climbe-neutral-border)] last:border-none transition-colors duration-200 hover:bg-[var(--climbe-primary-light)]"
            >
              <td v-for="(header, hIndex) in headers" :key="hIndex" class="px-4 py-4 text-[var(--climbe-text-main)]">
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
    <div v-if="totalPages > 1 && !loading" class="flex justify-between items-center text-[0.85rem] px-1">
      <span class="text-[var(--climbe-text-muted)]">
        Página <strong class="text-[var(--climbe-text-main)] font-extrabold">{{ currentPage }}</strong> de <strong class="text-[var(--climbe-text-main)] font-extrabold">{{ totalPages }}</strong>
      </span>
      <div class="flex gap-1">
        <button 
          class="bg-[var(--climbe-neutral-card)] border border-[var(--climbe-neutral-border)] text-[var(--climbe-text-main)] min-w-[32px] h-[32px] px-2 rounded-[var(--radius-xs)] flex items-center justify-center cursor-pointer font-extrabold transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--climbe-neutral-mute)] enabled:hover:border-[var(--climbe-primary)] enabled:hover:bg-[var(--climbe-primary-light)] enabled:hover:text-[var(--climbe-primary-hover)]" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          aria-label="Página anterior"
        >
          &larr;
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="text-[0.8rem] bg-[var(--climbe-neutral-card)] border border-[var(--climbe-neutral-border)] text-[var(--climbe-text-main)] min-w-[32px] h-[32px] px-2 rounded-[var(--radius-xs)] flex items-center justify-center cursor-pointer font-extrabold transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--climbe-neutral-mute)] enabled:hover:border-[var(--climbe-primary)] enabled:hover:bg-[var(--climbe-primary-light)] enabled:hover:text-[var(--climbe-primary-hover)]"
          :class="{ '!bg-[var(--climbe-primary)] !border-[var(--climbe-primary)] !text-[var(--climbe-text-on-primary)]': page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button 
          class="bg-[var(--climbe-neutral-card)] border border-[var(--climbe-neutral-border)] text-[var(--climbe-text-main)] min-w-[32px] h-[32px] px-2 rounded-[var(--radius-xs)] flex items-center justify-center cursor-pointer font-extrabold transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--climbe-neutral-mute)] enabled:hover:border-[var(--climbe-primary)] enabled:hover:bg-[var(--climbe-primary-light)] enabled:hover:text-[var(--climbe-primary-hover)]" 
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
/* Skeletons para Loading da Tabela (Animado) */
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
</style>
