<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'input'])

const hasValue = computed(() => {
  return props.modelValue !== undefined && props.modelValue !== null && props.modelValue.toString().length > 0
})

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
  emit('input', e)
}

const handleBlur = (e) => {
  emit('blur', e)
}

const handleFocus = (e) => {
  emit('focus', e)
}
</script>

<template>
  <div 
    class="flex flex-col gap-1 w-full font-[var(--font-family-avenir)]" 
    :class="{ 
      'has-error': error, 
      'has-value': hasValue, 
      'opacity-60': disabled 
    }"
  >
    <div class="climbe-input-container relative flex items-center">
      <input 
        :id="id" 
        :type="type" 
        :value="modelValue" 
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="climbe-input-field peer w-full py-[1.1rem] px-4 rounded-[var(--radius-sm)] border border-[var(--climbe-neutral-border)] bg-[var(--climbe-neutral-card)] text-[var(--climbe-text-main)] text-[0.95rem] outline-none transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] box-border disabled:bg-[var(--climbe-neutral-mute)] disabled:cursor-not-allowed [.has-value_&]:pt-[1.5rem] [.has-value_&]:pb-[0.7rem] [.has-value_&]:border-[var(--climbe-primary)] [.has-value_&]:shadow-[0_0_0_3px_var(--climbe-primary-light)] focus:pt-[1.5rem] focus:pb-[0.7rem] focus:border-[var(--climbe-primary)] focus:shadow-[0_0_0_3px_var(--climbe-primary-light)] [.has-error_&]:!border-[var(--climbe-danger)] focus:[.has-error_&]:!shadow-[0_0_0_3px_var(--climbe-danger-light)]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <label 
        :for="id" 
        class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--climbe-text-muted)] text-[0.95rem] pointer-events-none transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-left [.has-value_&]:top-[30%] [.has-value_&]:-translate-y-[80%] [.has-value_&]:scale-[0.8] [.has-value_&]:text-[var(--climbe-primary)] [.has-value_&]:font-[var(--font-weight-heavy)] peer-focus:top-[30%] peer-focus:-translate-y-[80%] peer-focus:scale-[0.8] peer-focus:text-[var(--climbe-primary)] peer-focus:font-[var(--font-weight-heavy)] [.has-error_&]:!text-[var(--climbe-danger)]"
      >
        {{ label }} <span v-if="required" class="text-[var(--climbe-danger)]">*</span>
      </label>
      
      <!-- Slot para ícones ou ações adicionais à direita -->
      <div class="climbe-input-suffix absolute right-4 flex items-center justify-center">
        <slot name="suffix"></slot>
      </div>
    </div>
    
    <!-- Texto auxiliar / Ajuda -->
    <span v-if="helperText && !error" class="text-[var(--climbe-text-muted)] text-[0.8rem] pl-1">
      {{ helperText }}
    </span>
    
    <!-- Mensagem de Erro com Animação -->
    <span v-if="error" class="text-[var(--climbe-danger)] text-[0.8rem] flex items-center gap-1 pl-1 anim-slide-in">
      <svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
/* Espaço extra à direita para o slot suffix caso exista (Avançado CSS :has) */
.climbe-input-container:has(.climbe-input-suffix:not(:empty)) .climbe-input-field {
  padding-right: 3rem;
}

.anim-slide-in {
  animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
