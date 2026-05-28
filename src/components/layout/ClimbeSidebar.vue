<script setup>
defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  activeItem: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['toggle', 'navigate'])

const menuItems = [
  { id: 'dashboard', label: 'Painel Geral', icon: '📊' },
  { id: 'contracts', label: 'Gestão de Contratos', icon: '📄' },
  { id: 'companies', label: 'Empresas & Clientes', icon: '🏢' },
  { id: 'users', label: 'Gestão de Usuários', icon: '👥' },
  { id: 'meetings', label: 'Reuniões & Atas', icon: '📅' },
  { id: 'documents', label: 'Documentos', icon: '📁' },
  { id: 'reports', label: 'Relatórios', icon: '📈' },
  { id: 'settings', label: 'Configurações', icon: '⚙️' }
]

const handleNavigate = (itemId) => {
  emit('navigate', itemId)
}
</script>

<template>
  <aside 
    class="h-screen bg-[var(--climbe-secondary)] text-[rgba(255,255,255,0.85)] flex flex-col border-r border-[rgba(255,255,255,0.05)] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] font-[var(--font-family-avenir)] relative shrink-0 box-border z-[100]"
    :class="collapsed ? 'w-[72px]' : 'w-[260px]'"
  >
    <!-- Header da Sidebar -->
    <div class="h-[70px] flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.05)] box-border">
      <div v-if="!collapsed" class="font-black text-[1.2rem] tracking-wider text-white flex items-center gap-1">
        <span>CLIMB</span><span class="text-[0.7rem] bg-[var(--climbe-primary)] text-[var(--climbe-text-on-primary)] py-0.5 px-1 rounded-[var(--radius-xs)] font-extrabold">CORP</span>
      </div>
      <div v-else class="font-black text-[1.3rem] text-[var(--climbe-primary)] ml-2">C</div>
      
      <!-- Botão para Recolher/Expandir -->
      <button class="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white w-[28px] h-[28px] rounded-full cursor-pointer flex items-center justify-center text-[0.85rem] transition-all duration-200 outline-none hover:bg-[var(--climbe-primary)] hover:border-[var(--climbe-primary)] hover:text-[var(--climbe-text-on-primary)]" @click="$emit('toggle')">
        {{ collapsed ? '→' : '←' }}
      </button>
    </div>

    <!-- Links de Navegação -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <ul class="list-none flex flex-col gap-1 px-2 m-0 p-0">
        <li v-for="item in menuItems" :key="item.id">
          <button 
            class="w-full bg-transparent border-none text-[rgba(255,255,255,0.65)] py-3 px-4 rounded-sm cursor-pointer flex items-center gap-3 text-[0.9rem] font-medium text-left transition-all duration-200 relative outline-none box-border hover:bg-[rgba(255,255,255,0.04)] hover:text-white" 
            :class="{ '!bg-[rgba(95,194,186,0.08)] !text-[var(--climbe-primary)] !font-extrabold': activeItem === item.id }"
            @click="handleNavigate(item.id)"
            :title="item.label"
          >
            <span class="text-[1.15rem] flex items-center justify-center w-6">{{ item.icon }}</span>
            <span v-if="!collapsed" class="whitespace-nowrap anim-fade-in">{{ item.label }}</span>
            <span v-if="activeItem === item.id" class="absolute left-0 top-1/4 h-1/2 w-[3px] bg-[var(--climbe-primary)] rounded-r-[4px]"></span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Footer da Sidebar (Perfil Fictício Abreviado) -->
    <div class="p-4 border-t border-[rgba(255,255,255,0.05)] box-border">
      <div class="flex items-center gap-3">
        <span class="text-[1.4rem] w-9 h-9 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">👨‍💼</span>
        <div v-if="!collapsed" class="flex flex-col">
          <span class="text-[0.85rem] font-extrabold text-white">Admin Climbe</span>
          <span class="text-[0.7rem] text-[var(--climbe-primary)] flex items-center gap-1 before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--climbe-primary)]">Online</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.anim-fade-in {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
