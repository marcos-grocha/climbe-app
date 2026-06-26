<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

  // feature/formulario-de-agendamento
  // feature/menu
import { useNotificationsStore } from '@/stores/notifications'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'



defineProps({
  title: { type: String, default: 'Painel Geral' },
  userEmail: { type: String, default: 'admin@climbe.com' },
})

const router = useRouter()
const authStore = useAuthStore()
const isDark = ref(false)
const showNotifications = ref(false)

const notificationsStore = useNotificationsStore()
const { notifications, unreadCount } = storeToRefs(notificationsStore)

let pollingInterval = null

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark-theme')
  notificationsStore.fetchNotifications()

  // Polling a cada 30 segundos
  pollingInterval = setInterval(() => {
    notificationsStore.pollNewNotifications()
  }, 30000)
})

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
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

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header
    class="h-[70px] bg-climbe-neutral-card border-b border-climbe-neutral-border flex justify-between items-center px-6 font-avenir box-border w-full sticky top-0 z-50"
  >
    <div class="flex items-center">
      <h2 class="text-[1.3rem] font-black text-climbe-text-main m-0">{{ title }}</h2>
    </div>

    <div class="flex items-center gap-4">
      <button
        class="bg-transparent border border-climbe-neutral-border text-climbe-text-main w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer relative transition-all outline-none hover:border-climbe-primary hover:bg-climbe-primary-light hover:text-climbe-primary-hover"
        @click="toggleTheme"
        title="Alternar tema"
      >
        <svg
          v-if="isDark"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
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
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>

      <div class="relative">
        <button
          class="bg-transparent border border-climbe-neutral-border text-climbe-text-main w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer relative transition-all outline-none hover:border-climbe-primary hover:bg-climbe-primary-light hover:text-climbe-primary-hover"
          :class="{
            '!border-climbe-primary !bg-climbe-primary-light !text-climbe-primary-hover':
              showNotifications,
          }"
          @click="showNotifications = !showNotifications"
          title="Notificações"
        >
          <span class="text-[1.1rem]">🔔</span>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-[3px] -right-[3px] bg-climbe-danger text-white text-[9px] font-bold h-4 min-w-[16px] rounded-full px-1 flex items-center justify-center border border-climbe-neutral-card leading-none"
          >
            {{ unreadCount }}
          </span>
        </button>

        <div
          v-if="showNotifications"
          class="absolute top-[46px] right-0 w-[320px] bg-climbe-neutral-card border border-climbe-neutral-border rounded-md shadow-lg overflow-hidden animate-[dropIn_0.25s_cubic-bezier(0.4,0,0.2,1)]"
        >
          <div class="flex flex-col max-h-[300px] overflow-y-auto">
            <template v-if="notifications.length > 0">
              <div
                v-for="item in notifications"
                :key="item.id"
                class="p-3 px-4 border-b border-climbe-neutral-border flex gap-2 items-start text-[0.82rem] text-climbe-text-main transition-colors cursor-pointer"
                :class="{
                  'bg-[#5fc2ba0a] hover:bg-[#5fc2ba15]': !item.read,
                  'hover:bg-climbe-primary-light': item.read,
                }"
                @click="notificationsStore.markAsRead(item.id)"
              >
                <span
                  v-if="!item.read"
                  class="w-[6px] h-[6px] bg-climbe-primary rounded-full mt-[6px] shrink-0"
                ></span>
                <span v-else class="w-[6px] h-[6px] shrink-0 opacity-0 mt-[6px]"></span>
                <div class="flex flex-col gap-0.5 w-full">
                  <p class="m-0 text-climbe-text-main leading-snug" v-html="item.text"></p>
                  <span class="text-[0.7rem] text-climbe-text-muted mt-0.5">{{ item.time }}</span>
                </div>
              </div>
            </template>
            <div v-else class="p-6 text-center text-climbe-text-muted text-[0.85rem]">
              Nenhuma notificação por enquanto.
            </div>
          </div>
        </div>
      </div>

      <span class="w-[1px] h-6 bg-climbe-neutral-border"></span>

      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-full bg-gradient-to-br from-climbe-primary to-climbe-primary-hover text-[#121312] flex items-center justify-center font-black text-[0.95rem]"
        >
          {{ (authStore.user?.nome_completo || userEmail).charAt(0).toUpperCase() }}
        </div>
        <div class="hidden md:flex flex-col">
          <span class="text-[0.85rem] font-heavy text-climbe-text-main leading-[1.2]">{{
            authStore.user?.nome_completo || 'Administrador Climbe'
          }}</span>
          <span class="text-[0.7rem] text-climbe-text-muted">{{
            authStore.user?.email || userEmail
          }}</span>
        </div>
      </div>

      <button
        class="bg-transparent border border-climbe-neutral-border text-climbe-text-muted w-[34px] h-[34px] rounded-sm flex items-center justify-center cursor-pointer transition-all outline-none hover:border-climbe-danger hover:text-climbe-danger hover:bg-climbe-danger-light"
        @click="handleLogout"
        title="Sair do sistema"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  </header>
</template>
