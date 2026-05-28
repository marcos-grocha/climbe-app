<script setup>
import { ref, onMounted } from 'vue'
import ClimbeSidebar from './ClimbeSidebar.vue'
import ClimbeHeader from './ClimbeHeader.vue'

const props = defineProps({
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
  <div class="climbe-page-wrapper">
    <!-- Menu Lateral Principal -->
    <ClimbeSidebar 
      :collapsed="sidebarCollapsed" 
      :active-item="activeTab"
      @toggle="toggleSidebar"
      @navigate="handleNavigate"
    />

    <!-- Área de Conteúdo à Direita -->
    <div class="climbe-content-container">
      <!-- Cabeçalho Superior -->
      <ClimbeHeader 
        :title="title" 
        :user-email="userEmail"
      />

      <!-- Área Interna de Conteúdo da Página -->
      <div class="climbe-page-content-scroll">
        <div class="climbe-page-content-inner">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.climbe-page-wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: var(--climbe-neutral-bg);
  overflow: hidden;
  box-sizing: border-box;
}

.climbe-content-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* Área rolável para evitar barra de rolagem geral na janela */
.climbe-page-content-scroll {
  flex: 1;
  overflow-y: auto;
  background-color: var(--climbe-neutral-bg);
  box-sizing: border-box;
}

.climbe-page-content-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-8);
  box-sizing: border-box;
  animation: contentFadeIn 0.3s ease-out;
}

@keyframes contentFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
