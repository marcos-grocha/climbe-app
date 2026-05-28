<script setup>
import { ref, onMounted } from 'vue'
import ClimbeSidebar from './ClimbeSidebar.vue'
import ClimbeHeader from './ClimbeHeader.vue'

const props = defineProps({
  title: { type: String, default: 'Painel Geral' },
  activeTab: { type: String, default: 'dashboard' }
})

const emit = defineEmits(['navigate'])

const sidebarCollapsed = ref(false)
const userEmail = ref('admin@climbe.com')

onMounted(() => {
  const email = localStorage.getItem('climb-user-email')
  if (email) {
    userEmail.value = email
  }
  
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
  <div class="flex w-screen h-screen bg-climbe-neutral-bg overflow-hidden box-border">
    <ClimbeSidebar 
      :collapsed="sidebarCollapsed" 
      :active-item="activeTab"
      @toggle="toggleSidebar"
      @navigate="handleNavigate"
    />

    <div class="flex flex-col flex-1 h-full overflow-hidden relative">
      <ClimbeHeader 
        :title="title" 
        :user-email="userEmail"
      />

      <div class="flex-1 overflow-y-auto bg-climbe-neutral-bg box-border">
        <div class="max-w-[1280px] mx-auto p-6 md:p-8 box-border animate-[contentFadeIn_0.3s_ease-out]">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
