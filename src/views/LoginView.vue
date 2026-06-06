<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ClimbLogo from '@/components/ClimbLogo.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const errors = reactive({
  email: '',
  password: '',
})

const isSubmitting = ref(false)
const showPassword = ref(false)
const loginSuccess = ref(false)
const isDark = ref(false)
const authError = ref('')

onMounted(() => {
  const savedTheme = localStorage.getItem('climb-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark-theme')
    document.documentElement.classList.remove('light-theme')
  } else {
    isDark.value = false
    document.documentElement.classList.add('light-theme')
    document.documentElement.classList.remove('dark-theme')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark-theme')
    document.documentElement.classList.remove('light-theme')
    localStorage.setItem('climb-theme', 'dark')
  } else {
    document.documentElement.classList.add('light-theme')
    document.documentElement.classList.remove('dark-theme')
    localStorage.setItem('climb-theme', 'light')
  }
}

const validateEmail = () => {
  if (!form.email) {
    errors.email = 'E-mail é obrigatório.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Insira um e-mail válido.'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'A senha é obrigatória.'
  } else if (form.password.length < 6) {
    errors.password = 'A senha deve conter pelo menos 6 caracteres.'
  } else {
    errors.password = ''
  }
}

const handleLogin = async () => {
  validateEmail()
  validatePassword()

  if (errors.email || errors.password) return

  isSubmitting.value = true
  authError.value = ''

  try {
    await authStore.login(form.email, form.password)
    
    // Remove os mocks antigos caso existam
    localStorage.removeItem('climb-auth')
    localStorage.removeItem('climb-user-email')
    
    isSubmitting.value = false
    loginSuccess.value = true

    setTimeout(() => {
      router.push('/')
    }, 1200)
  } catch (error) {
    isSubmitting.value = false
    
    if (error.response?.status === 401) {
      authError.value = 'E-mail ou senha incorretos.'
    } else if (error.response?.status === 422) {
      authError.value = 'Dados inválidos. Verifique as informações fornecidas.'
    } else {
      authError.value = 'Não foi possível conectar ao servidor. Tente novamente.'
    }
  }
}
</script>

<template>
  <div
    class="fixed inset-0 min-h-screen w-screen flex justify-center items-center bg-climbe-neutral-bg text-climbe-text-main font-avenir overflow-hidden z-[9999]"
  >
    <button
      class="absolute top-8 right-8 lg:right-[calc(50%+2rem)] flex items-center gap-2 bg-climbe-neutral-card border border-climbe-neutral-border text-climbe-text-main px-5 py-2.5 rounded-full text-[0.85rem] font-medium cursor-pointer shadow-sm transition-all duration-300 z-[100] outline-none hover:-translate-y-0.5 hover:border-climbe-primary hover:shadow-[0_6px_16px_var(--climbe-primary-light)]"
      @click="toggleTheme"
      aria-label="Alternar tema"
    >
      <svg
        v-if="isDark"
        class="stroke-climbe-primary"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg
        v-else
        class="stroke-climbe-primary"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <span class="transition-colors">{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
    </button>

    <div class="w-full h-full grid grid-cols-1 lg:grid-cols-2">
      <div
        class="flex flex-col justify-center px-6 py-10 w-full max-w-[460px] lg:max-w-[520px] mx-auto lg:mr-20 overflow-y-auto box-border"
      >
        <div class="mb-8">
          <div class="mb-7">
            <ClimbLogo height="56" />
          </div>
          <h2 class="text-[1.8rem] font-heavy text-climbe-text-main mb-2 tracking-tight">
            Bem-vindo de volta!
          </h2>
          <p class="text-climbe-text-muted text-[0.95rem] leading-[1.4]">
            Acesse sua conta para gerenciar seus investimentos.
          </p>
        </div>

        <div
          v-if="loginSuccess"
          class="flex flex-col items-center justify-center py-8 text-center animate-[fadeIn_0.5s_ease-out]"
        >
          <div
            class="w-[80px] h-[80px] rounded-full bg-climbe-success/10 flex items-center justify-center mb-6"
          >
            <svg
              class="w-12 h-12 text-climbe-success drop-shadow-[0_4px_12px_rgba(76,175,80,0.3)] animate-[drawCheck_0.5s_ease-out_0.2s_both]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
          <h3 class="text-[1.4rem] text-climbe-text-main mb-2 font-heavy">Acesso Autorizado!</h3>
          <p class="text-climbe-text-muted text-[0.95rem]">Preparando seu painel financeiro...</p>
        </div>

        <form v-else @submit.prevent="handleLogin" class="flex flex-col gap-6" novalidate>
          <div v-if="authError" class="bg-[#e25c5c]/10 border border-[#e25c5c]/20 text-[#e25c5c] px-4 py-3 rounded-sm text-[0.9rem] flex items-center gap-2 animate-[fadeIn_0.3s_ease]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {{ authError }}
          </div>
          <div
            class="flex flex-col gap-1 relative group"
            :class="{ 'has-error': errors.email, 'has-value': form.email }"
          >
            <div class="relative flex items-center">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="username"
                @blur="validateEmail"
                @input="errors.email = ''"
                class="peer w-full pl-11 pr-4 py-[1.1rem] rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main text-[0.95rem] outline-none transition-all duration-300 box-border focus:pt-[1.5rem] focus:pb-[0.7rem] focus:border-climbe-primary focus:ring-[4px] focus:ring-climbe-primary-light group-[.has-value]:pt-[1.5rem] group-[.has-value]:pb-[0.7rem] group-[.has-error]:border-[#e25c5c] group-[.has-error]:focus:ring-[#e25c5c26]"
              />
              <label
                for="email"
                class="absolute left-11 top-1/2 -translate-y-1/2 text-climbe-text-muted text-[0.95rem] pointer-events-none transition-all duration-300 peer-focus:top-[30%] peer-focus:-translate-y-[80%] peer-focus:text-[0.75rem] peer-focus:text-climbe-primary peer-focus:font-heavy group-[.has-value]:top-[30%] group-[.has-value]:-translate-y-[80%] group-[.has-value]:text-[0.75rem] group-[.has-value]:text-climbe-primary group-[.has-value]:font-heavy group-[.has-error]:text-[#e25c5c]"
                >E-mail corporativo ou cadastrado</label
              >
              <span
                class="absolute left-4 text-climbe-text-muted flex items-center pointer-events-none transition-colors duration-300 peer-focus:text-climbe-primary group-[.has-value]:text-climbe-primary group-[.has-error]:text-[#e25c5c]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  ></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
            </div>
            <span
              v-if="errors.email"
              class="text-[#e25c5c] text-[0.8rem] flex items-center gap-1 pl-1 animate-[slideIn_0.3s_ease]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errors.email }}
            </span>
          </div>

          <div
            class="flex flex-col gap-1 relative group"
            :class="{ 'has-error': errors.password, 'has-value': form.password }"
          >
            <div class="relative flex items-center">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                @blur="validatePassword"
                @input="errors.password = ''"
                class="peer w-full pl-11 pr-11 py-[1.1rem] rounded-sm border border-climbe-neutral-border bg-climbe-neutral-card text-climbe-text-main text-[0.95rem] outline-none transition-all duration-300 box-border focus:pt-[1.5rem] focus:pb-[0.7rem] focus:border-climbe-primary focus:ring-[4px] focus:ring-climbe-primary-light group-[.has-value]:pt-[1.5rem] group-[.has-value]:pb-[0.7rem] group-[.has-error]:border-[#e25c5c] group-[.has-error]:focus:ring-[#e25c5c26]"
              />
              <label
                for="password"
                class="absolute left-11 top-1/2 -translate-y-1/2 text-climbe-text-muted text-[0.95rem] pointer-events-none transition-all duration-300 peer-focus:top-[30%] peer-focus:-translate-y-[80%] peer-focus:text-[0.75rem] peer-focus:text-climbe-primary peer-focus:font-heavy group-[.has-value]:top-[30%] group-[.has-value]:-translate-y-[80%] group-[.has-value]:text-[0.75rem] group-[.has-value]:text-climbe-primary group-[.has-value]:font-heavy group-[.has-error]:text-[#e25c5c]"
                >Senha de acesso</label
              >
              <span
                class="absolute left-4 text-climbe-text-muted flex items-center pointer-events-none transition-colors duration-300 peer-focus:text-climbe-primary group-[.has-value]:text-climbe-primary group-[.has-error]:text-[#e25c5c]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <button
                type="button"
                class="absolute right-4 bg-transparent border-none text-climbe-text-muted cursor-pointer flex items-center p-0 transition-colors duration-300 hover:text-climbe-primary outline-none"
                @click="showPassword = !showPassword"
                tabindex="-1"
                :aria-label="showPassword ? 'Esconder senha' : 'Exibir senha'"
              >
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <span
              v-if="errors.password"
              class="text-[#e25c5c] text-[0.8rem] flex items-center gap-1 pl-1 animate-[slideIn_0.3s_ease]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errors.password }}
            </span>
          </div>

          <div class="flex justify-between items-center text-[0.85rem] mt-1">
            <label
              class="flex items-center relative pl-7 cursor-pointer select-none text-climbe-text-muted group"
            >
              <input
                type="checkbox"
                v-model="form.rememberMe"
                class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
              />
              <span
                class="absolute left-0 h-[1.1rem] w-[1.1rem] bg-climbe-neutral-card border border-climbe-neutral-border rounded-[0.25rem] transition-all duration-200 group-hover:border-climbe-primary peer-checked:bg-climbe-primary peer-checked:border-climbe-primary after:content-[''] after:absolute after:hidden peer-checked:after:block after:left-[5px] after:top-[1px] after:w-[4px] after:h-[8px] after:border-solid after:border-white after:border-r-2 after:border-b-2 after:rotate-45"
              ></span>
              <span class="transition-colors duration-200 group-hover:text-climbe-text-main"
                >Lembrar-me</span
              >
            </label>
            <a
              href="#"
              class="text-climbe-primary font-heavy no-underline transition-colors duration-200 hover:text-climbe-primary-hover hover:underline"
              @click.prevent
              >Esqueceu a senha?</a
            >
          </div>

          <button
            type="submit"
            class="mt-2 bg-gradient-to-br from-climbe-primary to-climbe-primary-hover text-[#121312] border-none rounded-sm py-[1.1rem] text-[1rem] font-black cursor-pointer flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(95,194,186,0.35)] transition-all duration-300 outline-none hover:-translate-y-[2px] hover:shadow-[0_6px_20px_var(--climbe-primary-glow)] hover:brightness-105 active:translate-y-0 disabled:bg-climbe-neutral-border disabled:from-transparent disabled:to-transparent disabled:text-climbe-text-muted disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="w-5 h-5 border-[3px] border-[#121312]/20 border-t-[#121312] rounded-full animate-spin"
            ></span>
            <span v-else>Acessar Carteira</span>
          </button>

          <div
            class="flex items-center text-center text-climbe-text-muted text-[0.8rem] my-3 before:content-[''] before:flex-1 before:border-b before:border-climbe-neutral-border after:content-[''] after:flex-1 after:border-b after:border-climbe-neutral-border"
          >
            <span class="px-3 font-medium">ou entre com parceiros</span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              class="flex items-center justify-center gap-2.5 bg-climbe-neutral-card border border-climbe-neutral-border text-climbe-text-main p-3 rounded-sm text-[0.9rem] font-heavy cursor-pointer transition-all duration-250 outline-none hover:bg-climbe-neutral-mute hover:border-climbe-neutral-border-hover hover:-translate-y-[1px]"
              @click.prevent
              aria-label="Entrar com Google"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-2.5 bg-climbe-neutral-card border border-climbe-neutral-border text-climbe-text-main p-3 rounded-sm text-[0.9rem] font-heavy cursor-pointer transition-all duration-250 outline-none hover:bg-climbe-neutral-mute hover:border-climbe-neutral-border-hover hover:-translate-y-[1px]"
              @click.prevent
              aria-label="Entrar com Apple"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.1.09 2.23-.57 2.95-1.39z"
                />
              </svg>
              Apple
            </button>
          </div>
        </form>

        <div class="text-center mt-8 text-[0.9rem] text-climbe-text-muted">
          <p>
            Novo por aqui?
            <a
              href="#"
              class="text-climbe-primary font-heavy no-underline transition-colors hover:text-climbe-primary-hover hover:underline"
              @click.prevent
              >Abra sua conta Climb</a
            >
          </p>
        </div>
      </div>

      <div
        class="hidden lg:flex flex-col justify-center relative bg-climbe-secondary overflow-hidden box-border p-16 xl:p-20"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-[#161c1be6] to-[#0c100ffa] z-[1]"></div>

        <div
          class="absolute rounded-full blur-[100px] opacity-15 z-0 animate-[pulseOrb_8s_infinite_alternate_ease-in-out] w-[400px] h-[400px] bg-climbe-primary -top-[100px] -right-[100px]"
        ></div>
        <div
          class="absolute rounded-full blur-[100px] opacity-15 z-0 animate-[pulseOrb_8s_infinite_alternate_ease-in-out] w-[350px] h-[350px] bg-[#3e8882] -bottom-[50px] -left-[50px] animate-delay-[-3s]"
        ></div>

        <div class="relative z-[2] text-white max-w-[500px]">
          <div
            class="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-[0.75rem] font-heavy tracking-wider uppercase mb-6 backdrop-blur-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Plataforma 100% Independente e Segura
          </div>

          <h1
            class="text-[2.6rem] font-black leading-[1.1] mb-5 tracking-tight text-white drop-shadow-md"
          >
            Eleve seus investimentos com inteligência e autonomia.
          </h1>
          <p class="text-[1.1rem] text-white/70 leading-[1.6] mb-12">
            Tenha acesso a estratégias sofisticadas, portfólios diversificados e assessoria focada
            estritamente no seu sucesso financeiro. Suba novos degraus na sua jornada.
          </p>

          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-lg">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                <span
                  class="w-2.5 h-2.5 bg-climbe-primary rounded-full animate-pulse shadow-[0_0_8px_var(--climbe-primary)]"
                ></span>
                <span class="text-white/60 text-[0.8rem] uppercase font-heavy tracking-wider"
                  >Rendimento Estimado</span
                >
              </div>
              <div
                class="bg-climbe-success/20 text-climbe-success px-2 py-1 rounded-[4px] text-[0.8rem] font-heavy"
              >
                + 18.4% a.a.
              </div>
            </div>

            <div class="flex justify-between items-end mb-6">
              <div class="text-[2.2rem] font-black tracking-tight text-white flex items-baseline">
                <span class="text-[1.2rem] text-white/50 mr-1 font-heavy">R$</span> 342.850<span
                  class="text-[1.2rem] text-white/50 font-heavy"
                  >,00</span
                >
              </div>

              <div class="flex items-end gap-[3px]">
                <div class="w-2 bg-climbe-primary rounded-t-[2px] opacity-40 h-3"></div>
                <div class="w-2 bg-climbe-primary rounded-t-[2px] opacity-70 h-5"></div>
                <div class="w-2 bg-climbe-primary rounded-t-[2px] opacity-100 h-8"></div>
                <div class="text-climbe-primary ml-1 translate-y-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="5" y1="19" x2="19" y2="5"></line>
                    <polyline points="12 5 19 5 19 12"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="flex justify-between items-center border-t border-white/10 pt-4 mt-4 text-[0.8rem]"
            >
              <div class="text-white/80 font-medium">Carteira Climber Premium</div>
              <div class="text-white/40">Atualizado há 2 min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
