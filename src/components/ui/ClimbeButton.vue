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
  const base = 'inline-flex items-center justify-center gap-2 font-[var(--font-family-avenir)] font-bold text-[0.95rem] py-3 px-6 rounded-[var(--radius-sm)] border border-transparent cursor-pointer relative transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] select-none whitespace-nowrap outline-none focus-visible:shadow-[0_0_0_3px_var(--climbe-primary-glow)] disabled:opacity-60 disabled:cursor-not-allowed disabled:!transform-none disabled:!shadow-none disabled:bg-[var(--climbe-neutral-mute)] disabled:text-[var(--climbe-text-muted)] disabled:border-[var(--color-border)]'
  
  const variants = {
    primary: 'bg-[var(--climbe-primary)] text-[var(--climbe-text-on-primary)] hover:bg-[var(--climbe-primary-hover)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-glow)] active:translate-y-0',
    secondary: 'bg-[var(--climbe-secondary)] text-white hover:bg-[var(--climbe-secondary-hover)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] active:translate-y-0',
    ghost: 'bg-transparent border-[var(--color-border)] text-[var(--climbe-text-main)] hover:bg-[var(--climbe-primary-light)] hover:border-[var(--climbe-primary)] hover:text-[var(--climbe-primary-hover)]',
    danger: 'bg-[var(--climbe-danger)] text-white hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(226,92,92,0.2)] active:translate-y-0'
  }

  const loadingClass = props.loading ? 'cursor-wait' : ''

  return [base, variants[props.variant], loadingClass]
})
</script>

<template>
  <button 
    :type="type" 
    :class="buttonClasses" 
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-current rounded-full absolute animate-spin"></span>
    <span :class="{ 'opacity-0': loading }">
      <slot></slot>
    </span>
  </button>
</template>
