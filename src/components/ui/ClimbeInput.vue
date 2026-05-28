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
    class="climbe-input-group" 
    :class="{ 
      'has-error': error, 
      'has-value': hasValue, 
      'is-disabled': disabled 
    }"
  >
    <div class="climbe-input-container">
      <input 
        :id="id" 
        :type="type" 
        :value="modelValue" 
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="climbe-input-field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <label :for="id" class="climbe-input-label">
        {{ label }} <span v-if="required" class="required-star">*</span>
      </label>
      
      <!-- Slot para ícones ou ações adicionais à direita -->
      <div class="climbe-input-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
    
    <!-- Texto auxiliar / Ajuda -->
    <span v-if="helperText && !error" class="climbe-input-helper">
      {{ helperText }}
    </span>
    
    <!-- Mensagem de Erro com Animação -->
    <span v-if="error" class="climbe-input-error">
      <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.climbe-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
  font-family: var(--font-family-avenir);
}

.climbe-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.climbe-input-field {
  width: 100%;
  padding: 1.1rem 1rem 1.1rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--climbe-neutral-border);
  background: var(--climbe-neutral-card);
  color: var(--climbe-text-main);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

/* Espaço extra à direita para o slot suffix caso exista */
.climbe-input-container:has(.climbe-input-suffix:not(:empty)) .climbe-input-field {
  padding-right: 3rem;
}

.climbe-input-label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--climbe-text-muted);
  font-size: 0.95rem;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left top;
}

.required-star {
  color: var(--climbe-danger);
}

/* Slot de Suffix */
.climbe-input-suffix {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Rótulo Flutuante (Floating Label) no Foco e com Valor */
.climbe-input-field:focus,
.climbe-input-group.has-value .climbe-input-field {
  padding-top: 1.5rem;
  padding-bottom: 0.7rem;
  border-color: var(--climbe-primary);
  box-shadow: 0 0 0 3px var(--climbe-primary-light);
}

.climbe-input-field:focus ~ .climbe-input-label,
.climbe-input-group.has-value .climbe-input-label {
  top: 30%;
  transform: translateY(-80%) scale(0.8);
  color: var(--climbe-primary);
  font-weight: var(--font-weight-heavy);
}

/* Estado de Erro */
.climbe-input-group.has-error .climbe-input-field {
  border-color: var(--climbe-danger);
}

.climbe-input-group.has-error .climbe-input-field:focus {
  box-shadow: 0 0 0 3px var(--climbe-danger-light);
}

.climbe-input-group.has-error .climbe-input-label {
  color: var(--climbe-danger);
}

/* Estado de Desabilitado */
.is-disabled {
  opacity: 0.6;
}

.is-disabled .climbe-input-field {
  background-color: var(--climbe-neutral-mute);
  cursor: not-allowed;
}

/* Helper Text e Error Text */
.climbe-input-helper {
  color: var(--climbe-text-muted);
  font-size: 0.8rem;
  padding-left: var(--space-1);
}

.climbe-input-error {
  color: var(--climbe-danger);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding-left: var(--space-1);
  animation: slideIn 0.25s ease-out;
}

.error-icon {
  flex-shrink: 0;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
