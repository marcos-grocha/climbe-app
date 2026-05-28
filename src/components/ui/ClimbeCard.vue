<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'solid',
    validator: (val) => ['solid', 'glass', 'borderless'].includes(val)
  },
  padding: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg', 'none'].includes(val)
  },
  hoverable: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  return [
    'climbe-card',
    `climbe-card-${props.variant}`,
    `climbe-card-p-${props.padding}`,
    { 'climbe-card-hoverable': props.hoverable }
  ]
})
</script>

<template>
  <div :class="cardClasses">
    <!-- Cabeçalho do Card (Opcional) -->
    <div v-if="$slots.header" class="climbe-card-header">
      <slot name="header"></slot>
    </div>
    
    <!-- Conteúdo do Card -->
    <div class="climbe-card-body">
      <slot></slot>
    </div>
    
    <!-- Rodapé do Card (Opcional) -->
    <div v-if="$slots.footer" class="climbe-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.climbe-card {
  font-family: var(--font-family-avenir);
  border-radius: var(--radius-md);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* 1. Variantes de Visual */
.climbe-card-solid {
  background-color: var(--climbe-neutral-card);
  border: 1px solid var(--climbe-neutral-border);
  box-shadow: var(--shadow-sm);
}

.climbe-card-glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: var(--shadow-lg);
}

/* No modo escuro o vidro fica mais escuro e elegante */
:global(.dark-theme) .climbe-card-glass {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.climbe-card-borderless {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

/* 2. Padrões de Padding */
.climbe-card-p-none {
  padding: 0;
}
.climbe-card-p-sm {
  padding: var(--space-3);
}
.climbe-card-p-md {
  padding: var(--space-5);
}
.climbe-card-p-lg {
  padding: var(--space-8);
}

/* 3. Efeito Interativo (Hoverable) */
.climbe-card-hoverable:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--climbe-primary);
}

/* Estruturas Internas */
.climbe-card-header {
  border-bottom: 1px solid var(--climbe-neutral-border);
  padding-bottom: var(--space-3);
  margin-bottom: var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.climbe-card-body {
  flex: 1;
}

.climbe-card-footer {
  border-top: 1px solid var(--climbe-neutral-border);
  padding-top: var(--space-3);
  margin-top: var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
