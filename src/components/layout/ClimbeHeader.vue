<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  title: {
    type: String,
    default: 'Painel Geral'
  },
  userEmail: {
    type: String,
    default: 'admin@climbe.com'
  }
})

const router = useRouter()
const isDark = ref(false)
const showNotifications = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark-theme')
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

const handleLogout = () => {
  localStorage.removeItem('climb-auth')
  localStorage.removeItem('climb-user-email')
  router.push('/login')
}
</script>

<template>
  <header class="h-[70px] bg-[var(--climbe-neutral-card)] border-b border-[var(--climbe-neutral-border)] flex justify-between items-center px-6 font-[var(--font-family-avenir)] box-border w-full sticky top-0 z-[90]">
    <!-- Título Dinâmico da Tela Ativa -->
    <div class="flex items-center">
      <h2 class="text-[1.3rem] font-black text-[var(--climbe-text-main)]">{{ title }}</h2>
    </div>

    <!-- Controles do Usuário & Sistema -->
    <div class="flex items-center gap-4">
      <!-- Seletor de Tema -->
      <button 
        class="bg-transparent border border-[var(--climbe-neutral-border)] text-[var(--climbe-text-main)] w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer relative transition-all duration-200 outline-none hover:border-[var(--climbe-primary)] hover:bg-[var(--climbe-primary-light)] hover:text-[var(--climbe-primary-hover)]" 
        @click="toggleTheme" 
        title="Alternar tema"
      >
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </button>

      <!-- Notificações -->
      <div class="relative">
        <button 
          class="bg-transparent border border-[var(--climbe-neutral-border)] text-[var(--climbe-text-main)] w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer relative transition-all duration-200 outline-none hover:border-[var(--climbe-primary)] hover:bg-[var(--climbe-primary-light)] hover:text-[var(--climbe-primary-hover)]" 
          @click="showNotifications = !showNotifications" 
          title="Notificações"
          :class="{ '!border-[var(--climbe-primary)] !bg-[var(--climbe-primary-light)] !text-[var(--climbe-primary-hover)]': showNotifications }"
        >
          <span class="text-[1.1rem]">🔔</span>
          <span class="absolute top-[2px] right-[2px] w-2 h-2 bg-[var(--climbe-danger)] border-[1.5px] border-[var(--climbe-neutral-card)] rounded-full"></span>
        </button>
        
        <!-- Menu Flutuante de Notificações -->
        <div v-if="showNotifications" class="absolute top-[46px] right-0 w-[320px] bg-[var(--climbe-neutral-card)] border border-[var(--climbe-neutral-border)] rounded-md shadow-lg overflow-hidden anim-drop-in">
          <div class="px-4 py-3 bg-[var(--climbe-neutral-mute)] font-extrabold text-[0.8rem] uppercase text-[var(--climbe-text-muted)] border-b border-[var(--climbe-neutral-border)]">
            Notificações Recentes
          </div>
          <div class="flex flex-col max-h-[280px] overflow-y-auto">
            <div class="p-3 px-4 border-b border-[var(--climbe-neutral-border)] flex gap-2 items-start text-[0.82rem] text-[var(--climbe-text-main)] transition-colors duration-200 hover:bg-[var(--climbe-primary-light)] bg-[rgba(95,194,186,0.04)]">
              <span class="w-[6px] h-[6px] bg-[var(--climbe-primary)] rounded-full mt-[6px] shrink-0"></span>
              <div class="flex flex-col gap-0.5">
                <p><strong>Contrato #1042</strong> aprovado por XP Investimentos.</p>
                <span class="text-[0.7rem] text-[var(--climbe-text-muted)]">Há 15 min</span>
              </div>
            </div>
            <div class="p-3 px-4 border-b border-[var(--climbe-neutral-border)] flex gap-2 items-start text-[0.82rem] text-[var(--climbe-text-main)] transition-colors duration-200 hover:bg-[var(--climbe-primary-light)]">
              <div class="flex flex-col gap-0.5">
                <p>Reunião com diretoria agendada para amanhã, 14:00.</p>
                <span class="text-[0.7rem] text-[var(--climbe-text-muted)]">Há 2 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Divisor -->
      <span class="w-[1px] h-6 bg-[var(--climbe-neutral-border)]"></span>

      <!-- Perfil do Usuário Fictício -->
      <div class="flex items-center gap-3">
        <div class="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[var(--climbe-primary)] to-[var(--climbe-primary-hover)] text-[var(--climbe-text-on-primary)] flex items-center justify-center font-black text-[0.95rem]">
          {{ userEmail.charAt(0).toUpperCase() }}
        </div>
        <div class="hidden md:flex flex-col">
          <span class="text-[0.85rem] font-extrabold text-[var(--climbe-text-main)] leading-[1.2]">Administrador Climbe</span>
          <span class="text-[0.7rem] text-[var(--climbe-text-muted)]">{{ userEmail }}</span>
        </div>
      </div>

      <!-- Botão Sair -->
      <button class="bg-transparent border border-[var(--climbe-neutral-border)] text-[var(--climbe-text-muted)] w-[34px] h-[34px] rounded-[var(--radius-sm)] flex items-center justify-center cursor-pointer transition-all duration-200 outline-none hover:border-[var(--climbe-danger)] hover:text-[var(--climbe-danger)] hover:bg-[var(--climbe-danger-light)]" @click="handleLogout" title="Sair do sistema">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.anim-drop-in {
  animation: dropIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
