<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'ghost', 'danger'].includes(val)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const buttonClasses = computed(() => {
  return [
    'climbe-btn',
    `climbe-btn-${props.variant}`,
    { 'climbe-btn-loading': props.loading }
  ]
})
</script>

<template>
  <button 
    :type="type" 
    :class="buttonClasses" 
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="climbe-btn-spinner"></span>
    <span :class="{ 'climbe-btn-content-hidden': loading }">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.climbe-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-family-avenir);
  font-weight: var(--font-weight-heavy);
  font-size: 0.95rem;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  white-space: nowrap;
  outline: none;
}

.climbe-btn:focus-visible {
  box-shadow: 0 0 0 3px var(--climbe-primary-glow);
}

/* 1. Variantes de Cor */
/* Primary */
.climbe-btn-primary {
  background-color: var(--climbe-primary);
  color: var(--climbe-text-on-primary);
}
.climbe-btn-primary:hover:not(:disabled) {
  background-color: var(--climbe-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
}
.climbe-btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

/* Secondary */
.climbe-btn-secondary {
  background-color: var(--climbe-secondary);
  color: #ffffff;
}
.climbe-btn-secondary:hover:not(:disabled) {
  background-color: var(--climbe-secondary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.climbe-btn-secondary:active:not(:disabled) {
  transform: translateY(0);
}

/* Ghost */
.climbe-btn-ghost {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--climbe-text-main);
}
.climbe-btn-ghost:hover:not(:disabled) {
  background-color: var(--climbe-primary-light);
  border-color: var(--climbe-primary);
  color: var(--climbe-primary-hover);
}

/* Danger */
.climbe-btn-danger {
  background-color: var(--climbe-danger);
  color: #ffffff;
}
.climbe-btn-danger:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(226, 92, 92, 0.2);
}
.climbe-btn-danger:active:not(:disabled) {
  transform: translateY(0);
}

/* 2. Estados Especializados */
.climbe-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
  background-color: var(--climbe-neutral-mute);
  color: var(--climbe-text-muted);
  border-color: var(--color-border);
}

.climbe-btn-loading {
  cursor: wait;
}

.climbe-btn-content-hidden {
  opacity: 0;
}

/* Spinner de Carregamento */
.climbe-btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  position: absolute;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
