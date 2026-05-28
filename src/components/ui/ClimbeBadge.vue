<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'success', 'warning', 'danger', 'info'].includes(val)
  },
  pill: {
    type: Boolean,
    default: false
  }
})

const badgeClasses = computed(() => {
  // 1. Classes base (Design System alinhado ao Tailwind)
  const base = 'inline-flex items-center gap-1 font-[var(--font-family-avenir)] font-bold text-xs py-1 px-2 leading-none uppercase tracking-wider w-fit whitespace-nowrap border'
  
  // 2. Modificador de formato (Pill)
  const pill = props.pill ? 'rounded-full px-3' : 'rounded'
  
  // 3. Modificadores de Status (Injetando as variáveis globais do base.css)
  const variants = {
    primary: 'bg-[var(--climbe-primary-light)] text-[var(--climbe-primary-hover)] border-[rgba(95,194,186,0.25)]',
    success: 'bg-[var(--climbe-success-light)] text-[var(--climbe-success)] border-[rgba(76,175,80,0.2)]',
    warning: 'bg-[var(--climbe-warning-light)] text-[var(--climbe-warning)] border-[rgba(252,168,75,0.2)]',
    danger:  'bg-[var(--climbe-danger-light)] text-[var(--climbe-danger)] border-[rgba(226,92,92,0.2)]',
    info:    'bg-[var(--climbe-secondary-light)] text-[var(--climbe-text-muted)] border-[var(--climbe-neutral-border)]'
  }

  return [base, pill, variants[props.variant]]
})
</script>

<template>
  <span :class="badgeClasses">
    <slot></slot>
  </span>
</template>
