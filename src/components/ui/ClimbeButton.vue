<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'ghost', 'danger'].includes(val),
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center gap-2 font-avenir font-heavy text-[0.95rem] px-6 py-3 rounded-sm border border-transparent cursor-pointer relative transition-all duration-300 select-none whitespace-nowrap outline-none focus-visible:ring-4 focus-visible:ring-climbe-primary-glow'

  if (props.disabled || props.loading) {
    return `${base} opacity-60 cursor-not-allowed bg-climbe-neutral-mute text-climbe-text-muted border-climbe-neutral-border`
  }

  const variants = {
    primary:
      'bg-climbe-primary text-[#121312] hover:bg-climbe-primary-hover hover:-translate-y-[1px] hover:shadow-glow active:translate-y-0',
    secondary:
      'bg-climbe-secondary text-white hover:bg-climbe-secondary-hover hover:-translate-y-[1px] hover:shadow-md active:translate-y-0',
    ghost:
      'bg-transparent border-climbe-neutral-border text-climbe-text-main hover:bg-climbe-primary-light hover:border-climbe-primary hover:text-climbe-primary-hover',
    danger:
      'bg-climbe-danger text-white hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(226,92,92,0.2)] active:translate-y-0',
  }

  return `${base} ${variants[props.variant] || variants.primary}`
})
</script>

<template>
  <button :type="type" :class="buttonClasses" :disabled="disabled || loading">
    <span
      v-if="loading"
      class="w-[18px] h-[18px] border-2 border-white/30 border-t-current rounded-full absolute animate-spin"
    ></span>
    <span :class="{ 'opacity-0': loading }">
      <slot></slot>
    </span>
  </button>
</template>
