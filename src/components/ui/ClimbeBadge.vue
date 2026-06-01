<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'success', 'warning', 'danger', 'info'].includes(val),
  },
  pill: {
    type: Boolean,
    default: false,
  },
})

const badgeClasses = computed(() => {
  const base =
    'inline-flex items-center gap-1 font-avenir font-heavy text-[0.75rem] py-1 px-2 leading-none uppercase tracking-wider w-fit whitespace-nowrap'
  const rounded = props.pill ? 'rounded-full px-3' : 'rounded-xs'

  const variants = {
    primary: 'bg-climbe-primary-light text-climbe-primary-hover border border-climbe-primary/25',
    success: 'bg-climbe-success-light text-climbe-success border border-climbe-success/20',
    warning: 'bg-climbe-warning-light text-climbe-warning border border-climbe-warning/20',
    danger: 'bg-climbe-danger-light text-climbe-danger border border-climbe-danger/20',
    info: 'bg-climbe-secondary-light text-climbe-text-muted border border-climbe-neutral-border',
  }

  return `${base} ${rounded} ${variants[props.variant]}`
})
</script>

<template>
  <span :class="badgeClasses">
    <slot></slot>
  </span>
</template>
