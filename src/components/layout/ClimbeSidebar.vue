<script setup>
const props = defineProps({
  collapsed: { type: Boolean, default: false },
  activeItem: { type: String, default: 'dashboard' }
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

const handleNavigate = (itemId) => emit('navigate', itemId)
</script>

<template>
  <aside 
    class="bg-climbe-secondary text-white/85 flex flex-col border-r border-white/5 font-avenir relative shrink-0 box-border z-50 h-screen transition-[width] duration-300"
    :class="collapsed ? 'w-[72px]' : 'w-[260px]'"
  >
    <div class="h-[70px] flex items-center justify-between px-4 border-b border-white/5 box-border">
      <div v-if="!collapsed" class="font-black text-[1.2rem] tracking-wider text-white flex items-center gap-1">
        <span>CLIMB</span><span class="text-[0.7rem] bg-climbe-primary text-[#121312] px-1 py-0.5 rounded-xs font-heavy">CORP</span>
      </div>
      <div v-else class="font-black text-[1.3rem] text-climbe-primary ml-2">C</div>
      
      <button 
        class="bg-white/5 border border-white/10 text-white w-7 h-7 rounded-full cursor-pointer flex items-center justify-center text-[0.85rem] transition-colors outline-none hover:bg-climbe-primary hover:border-climbe-primary hover:text-[#121312]" 
        @click="$emit('toggle')"
      >
        {{ collapsed ? '→' : '←' }}
      </button>
    </div>

    <nav class="flex-1 py-4 overflow-y-auto">
      <ul class="list-none flex flex-col gap-1 px-2 m-0">
        <li v-for="item in menuItems" :key="item.id">
          <button 
            class="w-full bg-transparent border-none text-white/65 px-4 py-3 rounded-sm cursor-pointer flex items-center gap-3 text-[0.9rem] font-medium text-left transition-colors relative outline-none box-border hover:bg-white/5 hover:text-white"
            :class="activeItem === item.id ? 'bg-[#5fc2ba14] text-climbe-primary font-heavy' : ''"
            @click="handleNavigate(item.id)"
            :title="item.label"
          >
            <span class="text-[1.15rem] flex items-center justify-center w-6">{{ item.icon }}</span>
            <span v-if="!collapsed" class="whitespace-nowrap animate-[fadeIn_0.2s_ease]">{{ item.label }}</span>
            <span v-if="activeItem === item.id" class="absolute left-0 top-1/4 h-1/2 w-[3px] bg-climbe-primary rounded-r-[4px]"></span>
          </button>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-white/5 box-border">
      <div class="flex items-center gap-3">
        <span class="text-[1.4rem] w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">👨‍💼</span>
        <div v-if="!collapsed" class="flex flex-col">
          <span class="text-[0.85rem] font-heavy text-white">Admin Climbe</span>
          <span class="text-[0.7rem] text-climbe-primary flex items-center gap-1 before:content-[''] before:inline-block before:w-[6px] before:h-[6px] before:rounded-full before:bg-climbe-primary">Online</span>
        </div>
      </div>
    </div>
  </aside>
</template>
