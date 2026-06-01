<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'solid',
    validator: (val) => ['solid', 'glass', 'borderless'].includes(val),
  },
  padding: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg', 'none'].includes(val),
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
})

const cardClasses = computed(() => {
  const base =
    'font-avenir rounded-md box-border flex flex-col relative transition-all duration-300 overflow-hidden'

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  }

  const hoverEffect = props.hoverable
    ? 'hover:-translate-y-[3px] hover:shadow-lg hover:border-climbe-primary'
    : ''

  const variants = {
    solid: 'bg-climbe-neutral-card border border-climbe-neutral-border shadow-sm',
    glass:
      'bg-white/5 backdrop-blur-md border border-white/10 shadow-lg dark:bg-black/20 dark:border-white/5',
    borderless: 'bg-transparent border-none shadow-none',
  }

  return `${base} ${paddings[props.padding]} ${variants[props.variant]} ${hoverEffect}`
})
</script>

<template>
  <div :class="cardClasses">
    <!-- Cabeçalho do Card (Opcional) -->
    <div
      v-if="$slots.header"
      class="border-b border-climbe-neutral-border pb-3 mb-4 flex justify-between items-center"
    >
      <slot name="header"></slot>
    </div>

    <!-- Conteúdo do Card -->
    <div class="flex-1">
      <slot></slot>
    </div>

    <!-- Rodapé do Card (Opcional) -->
    <div
      v-if="$slots.footer"
      class="border-t border-climbe-neutral-border pt-3 mt-4 flex justify-between items-center"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>
