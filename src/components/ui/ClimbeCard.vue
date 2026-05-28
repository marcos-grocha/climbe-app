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
  const base = 'font-[var(--font-family-avenir)] rounded-[var(--radius-md)] flex flex-col relative transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden box-border'
  
  const variants = {
    solid: 'bg-[var(--climbe-neutral-card)] border border-[var(--climbe-neutral-border)] shadow-[var(--shadow-sm)]',
    glass: 'bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.08)] shadow-[var(--shadow-lg)] [.dark-theme_&]:bg-[rgba(0,0,0,0.2)] [.dark-theme_&]:border-[rgba(255,255,255,0.05)]',
    borderless: 'bg-transparent border-transparent shadow-none'
  }

  const paddings = {
    none: 'p-0',
    sm: 'p-[var(--space-3)]',
    md: 'p-[var(--space-5)]',
    lg: 'p-[var(--space-8)]'
  }

  const hoverEffect = props.hoverable 
    ? 'hover:-translate-y-[3px] hover:shadow-[var(--shadow-lg)] hover:border-[var(--climbe-primary)]' 
    : ''

  return [base, variants[props.variant], paddings[props.padding], hoverEffect]
})
</script>

<template>
  <div :class="cardClasses">
    <!-- Cabeçalho do Card (Opcional) -->
    <div v-if="$slots.header" class="border-b border-[var(--climbe-neutral-border)] pb-[var(--space-3)] mb-[var(--space-4)] flex justify-between items-center">
      <slot name="header"></slot>
    </div>
    
    <!-- Conteúdo do Card -->
    <div class="flex-1">
      <slot></slot>
    </div>
    
    <!-- Rodapé do Card (Opcional) -->
    <div v-if="$slots.footer" class="border-t border-[var(--climbe-neutral-border)] pt-[var(--space-3)] mt-[var(--space-4)] flex justify-between items-center">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
