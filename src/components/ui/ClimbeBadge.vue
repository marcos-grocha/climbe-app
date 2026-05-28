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
  return [
    'climbe-badge',
    `climbe-badge-${props.variant}`,
    { 'climbe-badge-pill': props.pill }
  ]
})
</script>

<template>
  <span :class="badgeClasses">
    <slot></slot>
  </span>
</template>

<style scoped>
.climbe-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-family-avenir);
  font-weight: var(--font-weight-heavy);
  font-size: 0.75rem;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-xs);
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
  white-space: nowrap;
}

.climbe-badge-pill {
  border-radius: var(--radius-full);
  padding-left: var(--space-3);
  padding-right: var(--space-3);
}

/* 1. Variantes de Status */
/* Primary */
.climbe-badge-primary {
  background-color: var(--climbe-primary-light);
  color: var(--climbe-primary-hover);
  border: 1px solid rgba(95, 194, 186, 0.25);
}

/* Success */
.climbe-badge-success {
  background-color: var(--climbe-success-light);
  color: var(--climbe-success);
  border: 1px solid rgba(76, 175, 80, 0.2);
}

/* Warning */
.climbe-badge-warning {
  background-color: var(--climbe-warning-light);
  color: var(--climbe-warning);
  border: 1px solid rgba(252, 168, 75, 0.2);
}

/* Danger */
.climbe-badge-danger {
  background-color: var(--climbe-danger-light);
  color: var(--climbe-danger);
  border: 1px solid rgba(226, 92, 92, 0.2);
}

/* Info / Neutro */
.climbe-badge-info {
  background-color: var(--climbe-secondary-light);
  color: var(--climbe-text-muted);
  border: 1px solid var(--climbe-neutral-border);
}
</style>
