<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  helperText: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'input'])

const hasValue = computed(() => {
  return props.modelValue !== undefined && props.modelValue !== null && props.modelValue.toString().length > 0
})

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
  emit('input', e)
}

const handleBlur = (e) => { emit('blur', e) }
const handleFocus = (e) => { emit('focus', e) }
</script>

<template>
  <div class="flex flex-col gap-1 w-full font-avenir" :class="{ 'opacity-60': disabled }">
    <div class="relative flex items-center group" :class="{ 'has-value': hasValue }">
      <input 
        :id="id" 
        :type="type" 
        :value="modelValue" 
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="peer w-full px-4 py-[1.1rem] rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main text-[0.95rem] outline-none transition-all duration-250 box-border focus:pt-[1.5rem] focus:pb-[0.7rem] focus:border-climbe-primary focus:ring-[3px] focus:ring-climbe-primary-light disabled:bg-climbe-neutral-mute disabled:cursor-not-allowed group-[.has-value]:pt-[1.5rem] group-[.has-value]:pb-[0.7rem]"
        :class="[
          error ? 'border-climbe-danger focus:border-climbe-danger focus:ring-climbe-danger-light group-[.has-value]:border-climbe-danger' : '',
          $slots.suffix ? 'pr-12' : ''
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <label 
        :for="id" 
        class="absolute left-4 top-1/2 -translate-y-1/2 text-climbe-text-muted text-[0.95rem] pointer-events-none transition-all duration-250 origin-top-left peer-focus:top-[30%] peer-focus:-translate-y-[80%] peer-focus:scale-80 peer-focus:text-climbe-primary peer-focus:font-heavy group-[.has-value]:top-[30%] group-[.has-value]:-translate-y-[80%] group-[.has-value]:scale-80 group-[.has-value]:text-climbe-primary group-[.has-value]:font-heavy"
        :class="[error ? 'text-climbe-danger peer-focus:text-climbe-danger group-[.has-value]:text-climbe-danger' : '']"
      >
        {{ label }} <span v-if="required" class="text-climbe-danger">*</span>
      </label>
      
      <div v-if="$slots.suffix" class="absolute right-4 flex items-center justify-center">
        <slot name="suffix"></slot>
      </div>
    </div>
    
    <span v-if="helperText && !error" class="text-climbe-text-muted text-[0.8rem] pl-1">
      {{ helperText }}
    </span>
    
    <span v-if="error" class="text-climbe-danger text-[0.8rem] flex items-center gap-1 pl-1 animate-[slideIn_0.25s_ease-out]">
      <svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {{ error }}
    </span>
  </div>
</template>
