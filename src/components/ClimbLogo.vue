<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import logoLight from '@/assets/logo-light.png'
import logoDark from '@/assets/logo-dark.png'

const props = defineProps({
  theme: {
    type: String,
    default: 'auto', // 'light' | 'dark' | 'auto'
    validator: (value) => ['light', 'dark', 'auto'].includes(value)
  },
  width: {
    type: [String, Number],
    default: 'auto'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  alt: {
    type: String,
    default: 'Climb Investimentos'
  }
})

const systemIsDark = ref(false)
const htmlClassIsDark = ref(false)

// Verifica se há alguma classe dark no documentElement ou body
const checkHtmlClass = () => {
  const isDarkClass = document.documentElement.classList.contains('dark-theme') || 
                      document.documentElement.classList.contains('dark') ||
                      document.body.classList.contains('dark-theme') ||
                      document.body.classList.contains('dark')
  htmlClassIsDark.value = isDarkClass
}

let mediaQueryList = null
let observer = null

const handleMediaChange = (e) => {
  systemIsDark.value = e.matches
}

onMounted(() => {
  // 1. Detectar preferência do sistema
  mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  systemIsDark.value = mediaQueryList.matches
  mediaQueryList.addEventListener('change', handleMediaChange)

  // 2. Detectar classes no html/body
  checkHtmlClass()

  // 3. Monitorar alterações de classe para reagir ao tema manual
  observer = new MutationObserver(() => {
    checkHtmlClass()
  })

  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  if (mediaQueryList) {
    mediaQueryList.removeEventListener('change', handleMediaChange)
  }
  if (observer) {
    observer.disconnect()
  }
})

// Determina dinamicamente o logotipo a exibir
const resolvedLogo = computed(() => {
  if (props.theme === 'light') {
    return logoLight
  }
  if (props.theme === 'dark') {
    return logoDark
  }
  
  // Se for auto, combina a detecção da classe manual com a preferência do sistema
  const isLightForced = document.documentElement.classList.contains('light-theme') || document.body.classList.contains('light-theme')
  const isDarkActive = htmlClassIsDark.value || (systemIsDark.value && !isLightForced)
  
  return isDarkActive ? logoDark : logoLight
})

const resolvedStyle = computed(() => {
  return {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    display: 'block',
    maxWidth: '100%',
    objectFit: 'contain'
  }
})
</script>

<template>
  <img 
    :src="resolvedLogo" 
    :alt="alt" 
    :style="resolvedStyle" 
    class="climb-logo" 
  />
</template>

<style scoped>
.climb-logo {
  transition: transform 0.3s ease, filter 0.3s ease;
}
.climb-logo:hover {
  transform: scale(1.02);
}
</style>
