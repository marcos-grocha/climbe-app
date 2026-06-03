<script setup>
import { useRouter } from 'vue-router'

defineProps({
  collapsed: { type: Boolean, default: false },
  activeItem: { type: String, default: 'dashboard' },
})

const emit = defineEmits(['toggle', 'navigate'])
const router = useRouter()

const menuItems = [
  { id: 'dashboard', label: 'Painel Geral', icon: '📊' },
  { id: 'contracts', label: 'Gestao de Contratos', icon: '📄' },
  { id: 'propostas', label: 'Propostas', icon: '🧾', path: '/propostas' },
  { id: 'empresas', label: 'Empresas & Clientes', icon: '🏢', path: '/empresas' },
  { id: 'users', label: 'Gestao de Usuarios', icon: '👥' },
  { id: 'meetings', label: 'Reunioes & Atas', icon: '🗓' },
  { id: 'documents', label: 'Documentos', icon: '📁' },
  { id: 'reports', label: 'Relatorios', icon: '📈' },
  { id: 'settings', label: 'Configuracoes', icon: '⚙️' },
]

const handleNavigate = (item) => {
  if (item.path) {
    router.push(item.path)
  }

  emit('navigate', item.id)
}
</script>

<template>
  <aside
    class="relative z-50 box-border flex h-screen shrink-0 flex-col border-r border-white/5 bg-climbe-secondary font-avenir text-white/85 transition-[width] duration-300"
    :class="collapsed ? 'w-[72px]' : 'w-[260px]'"
  >
    <div class="box-border flex h-[70px] items-center justify-between border-b border-white/5 px-4">
      <div
        v-if="!collapsed"
        class="flex items-center gap-1 text-[1.2rem] font-black tracking-wider text-white"
      >
        <span>CLIMB</span>
        <span
          class="rounded-xs bg-climbe-primary px-1 py-0.5 text-[0.7rem] font-heavy text-[#121312]"
        >
          CORP
        </span>
      </div>
      <div v-else class="ml-2 text-[1.3rem] font-black text-climbe-primary">C</div>

      <button
        class="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[0.85rem] text-white transition-colors outline-none hover:border-climbe-primary hover:bg-climbe-primary hover:text-[#121312]"
        @click="$emit('toggle')"
      >
        {{ collapsed ? '→' : '←' }}
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="m-0 flex list-none flex-col gap-1 px-2">
        <li v-for="item in menuItems" :key="item.id">
          <button
            class="relative box-border flex w-full items-center gap-3 rounded-sm border-none bg-transparent px-4 py-3 text-left text-[0.9rem] font-medium text-white/65 transition-colors outline-none hover:bg-white/5 hover:text-white"
            :class="activeItem === item.id ? 'bg-[#5fc2ba14] font-heavy text-climbe-primary' : ''"
            :title="item.label"
            @click="handleNavigate(item)"
          >
            <span class="flex w-6 items-center justify-center text-[1.15rem]">{{ item.icon }}</span>
            <span v-if="!collapsed" class="whitespace-nowrap animate-[fadeIn_0.2s_ease]">
              {{ item.label }}
            </span>
            <span
              v-if="activeItem === item.id"
              class="absolute left-0 top-1/4 h-1/2 w-[3px] rounded-r-[4px] bg-climbe-primary"
            ></span>
          </button>
        </li>
      </ul>
    </nav>

    <div class="box-border border-t border-white/5 p-4">
      <div class="flex items-center gap-3">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[1.4rem]"
        >
          👨‍💼
        </span>
        <div v-if="!collapsed" class="flex flex-col">
          <span class="text-[0.85rem] font-heavy text-white">Admin Climbe</span>
          <span
            class="flex items-center gap-1 text-[0.7rem] text-climbe-primary before:inline-block before:h-[6px] before:w-[6px] before:rounded-full before:bg-climbe-primary before:content-['']"
          >
            Online
          </span>
        </div>
      </div>
    </div>
  </aside>
</template>
