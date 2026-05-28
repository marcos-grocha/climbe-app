<script setup>
import { ref, onMounted } from 'vue'
import ClimbeSidebar from './ClimbeSidebar.vue'
import ClimbeHeader from './ClimbeHeader.vue'

defineProps({
  title: {
    type: String,
    default: 'Painel Geral'
  },
  activeTab: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['navigate'])

const sidebarCollapsed = ref(false)
const userEmail = ref('admin@climbe.com')

onMounted(() => {
  const email = localStorage.getItem('climb-user-email')
  if (email) {
    userEmail.value = email
  }
  
  // Lembrar estado recolhido da sidebar
  const savedSidebarState = localStorage.getItem('climbe-sidebar-collapsed')
  if (savedSidebarState !== null) {
    sidebarCollapsed.value = savedSidebarState === 'true'
  }
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('climbe-sidebar-collapsed', sidebarCollapsed.value.toString())
}

const handleNavigate = (tabId) => {
  emit('navigate', tabId)
}
</script>

<template>
  <div class="flex w-screen h-screen bg-[var(--climbe-neutral-bg)] overflow-hidden box-border">
    <!-- Menu Lateral Principal -->
    <ClimbeSidebar 
      :collapsed="sidebarCollapsed" 
      :active-item="activeTab"
      @toggle="toggleSidebar"
      @navigate="handleNavigate"
    />

    <!-- Área de Conteúdo à Direita -->
    <div class="flex flex-col flex-1 h-full overflow-hidden relative">
      <!-- Cabeçalho Superior -->
      <ClimbeHeader 
        :title="title" 
        :user-email="userEmail"
      />

      <!-- Área Interna de Conteúdo da Página -->
      <div class="flex-1 overflow-y-auto bg-[var(--climbe-neutral-bg)] box-border">
        <div class="max-w-[1280px] mx-auto py-6 px-8 box-border anim-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.anim-content {
  animation: contentFadeIn 0.3s ease-out;
}

@keyframes contentFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
