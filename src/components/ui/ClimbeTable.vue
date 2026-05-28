<script setup>
const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: 'Nenhum registro encontrado.' },
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 }
})

const emit = defineEmits(['page-change'])

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<template>
  <div class="w-full font-avenir flex flex-col gap-4">
    <div class="w-full overflow-x-auto border border-climbe-neutral-border rounded-sm bg-climbe-neutral-card">
      <table class="w-full border-collapse text-left text-[0.9rem]">
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index" class="px-4 py-3 border-b border-climbe-neutral-border text-climbe-text-muted font-heavy text-[0.8rem] uppercase tracking-wider bg-climbe-neutral-mute select-none">
              <slot :name="`header-${header.value || header}`" :header="header">
                {{ header.label || header }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="i in 3" :key="`loading-${i}`">
              <td v-for="j in headers.length" :key="`col-${j}`" class="px-4 py-5 border-b border-climbe-neutral-border">
                <div class="h-[14px] bg-[length:200%_100%] rounded-[4px] animate-[skeletonLoad_1.5s_infinite_linear]" style="background-image: linear-gradient(90deg, var(--climbe-neutral-mute) 25%, var(--climbe-neutral-border) 50%, var(--climbe-neutral-mute) 75%)"></div>
              </td>
            </tr>
          </template>
          
          <tr v-else-if="items.length === 0">
            <td :colspan="headers.length" class="px-4 py-12 text-center">
              <div class="flex flex-col items-center gap-2">
                <span class="text-4xl grayscale opacity-50">📂</span>
                <p class="text-[0.95rem] font-medium text-climbe-text-muted">{{ emptyText }}</p>
              </div>
            </td>
          </tr>
          
          <template v-else>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-climbe-primary-light transition-colors duration-200 group">
              <td v-for="(header, hIndex) in headers" :key="hIndex" class="px-4 py-4 border-b border-climbe-neutral-border text-climbe-text-main group-last:border-b-0">
                <slot :name="`cell-${header.value || header}`" :item="item" :index="index">
                  {{ item[header.value || header] }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1 && !loading" class="flex justify-between items-center text-[0.85rem] px-1">
      <span class="text-climbe-text-muted">
        Página <strong class="text-climbe-text-main font-heavy">{{ currentPage }}</strong> de <strong class="text-climbe-text-main font-heavy">{{ totalPages }}</strong>
      </span>
      <div class="flex gap-1">
        <button 
          class="bg-climbe-neutral-card border border-climbe-neutral-border text-climbe-text-main min-w-[32px] h-[32px] px-2 rounded-xs flex items-center justify-center cursor-pointer font-heavy transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-climbe-neutral-mute hover:not-disabled:border-climbe-primary hover:not-disabled:bg-climbe-primary-light hover:not-disabled:text-climbe-primary-hover"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          aria-label="Página anterior"
        >
          &larr;
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="bg-climbe-neutral-card border border-climbe-neutral-border text-climbe-text-main min-w-[32px] h-[32px] px-2 rounded-xs flex items-center justify-center cursor-pointer font-heavy transition-all outline-none text-[0.8rem] hover:not-disabled:border-climbe-primary hover:not-disabled:bg-climbe-primary-light hover:not-disabled:text-climbe-primary-hover"
          :class="page === currentPage ? '!bg-climbe-primary !border-climbe-primary !text-[#121312]' : ''"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button 
          class="bg-climbe-neutral-card border border-climbe-neutral-border text-climbe-text-main min-w-[32px] h-[32px] px-2 rounded-xs flex items-center justify-center cursor-pointer font-heavy transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-climbe-neutral-mute hover:not-disabled:border-climbe-primary hover:not-disabled:bg-climbe-primary-light hover:not-disabled:text-climbe-primary-hover"
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
