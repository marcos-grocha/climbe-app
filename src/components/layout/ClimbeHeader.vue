<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
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
  <header class="climbe-header">
    <!-- Título Dinâmico da Tela Ativa -->
    <div class="header-left">
      <h2 class="header-page-title">{{ title }}</h2>
    </div>

    <!-- Controles do Usuário & Sistema -->
    <div class="header-right">
      <!-- Seletor de Tema -->
      <button class="header-action-btn theme-btn" @click="toggleTheme" title="Alternar tema">
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </button>

      <!-- Notificações -->
      <div class="notifications-wrapper">
        <button 
          class="header-action-btn" 
          @click="showNotifications = !showNotifications" 
          title="Notificações"
          :class="{ 'active': showNotifications }"
        >
          <span class="bell-icon">🔔</span>
          <span class="notification-badge"></span>
        </button>
        
        <!-- Menu Flutuante de Notificações -->
        <div v-if="showNotifications" class="notifications-dropdown">
          <div class="dropdown-header">Notificações Recentes</div>
          <div class="dropdown-body">
            <div class="notification-item unread">
              <span class="noti-dot"></span>
              <div class="noti-text">
                <p><strong>Contrato #1042</strong> aprovado por XP Investimentos.</p>
                <span>Há 15 min</span>
              </div>
            </div>
            <div class="notification-item">
              <div class="noti-text">
                <p>Reunião com diretoria agendada para amanhã, 14:00.</p>
                <span>Há 2 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Divisor -->
      <span class="header-divider"></span>

      <!-- Perfil do Usuário Fictício -->
      <div class="header-user">
        <div class="user-avatar">
          {{ userEmail.charAt(0).toUpperCase() }}
        </div>
        <div class="user-details">
          <span class="user-name">Administrador Climbe</span>
          <span class="user-email">{{ userEmail }}</span>
        </div>
      </div>

      <!-- Botão Sair -->
      <button class="logout-btn" @click="handleLogout" title="Sair do sistema">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.climbe-header {
  height: 70px;
  background-color: var(--climbe-neutral-card);
  border-bottom: 1px solid var(--climbe-neutral-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--space-6);
  font-family: var(--font-family-avenir);
  box-sizing: border-box;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 90;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-page-title {
  font-size: 1.3rem;
  font-weight: var(--font-weight-black);
  color: var(--climbe-text-main);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Botões de Ação */
.header-action-btn {
  background: none;
  border: 1px solid var(--climbe-neutral-border);
  color: var(--climbe-text-main);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  outline: none;
}

.header-action-btn:hover,
.header-action-btn.active {
  border-color: var(--climbe-primary);
  background-color: var(--climbe-primary-light);
  color: var(--climbe-primary-hover);
}

.bell-icon {
  font-size: 1.1rem;
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background-color: var(--climbe-danger);
  border: 1.5px solid var(--climbe-neutral-card);
  border-radius: 50%;
}

/* Divisor */
.header-divider {
  width: 1px;
  height: 24px;
  background-color: var(--climbe-neutral-border);
}

/* Perfil Usuário */
.header-user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--climbe-primary) 0%, var(--climbe-primary-hover) 100%);
  color: var(--climbe-text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-black);
  font-size: 0.95rem;
}

.user-details {
  display: none;
  flex-direction: column;
}

@media (min-width: 768px) {
  .user-details {
    display: flex;
  }
}

.user-name {
  font-size: 0.85rem;
  font-weight: var(--font-weight-heavy);
  color: var(--climbe-text-main);
  line-height: 1.2;
}

.user-email {
  font-size: 0.7rem;
  color: var(--climbe-text-muted);
}

/* Botão Sair */
.logout-btn {
  background: none;
  border: 1px solid var(--climbe-neutral-border);
  color: var(--climbe-text-muted);
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.logout-btn:hover {
  border-color: var(--climbe-danger);
  color: var(--climbe-danger);
  background-color: var(--climbe-danger-light);
}

/* Dropdown de Notificações */
.notifications-wrapper {
  position: relative;
}

.notifications-dropdown {
  position: absolute;
  top: 46px;
  right: 0;
  width: 320px;
  background-color: var(--climbe-neutral-card);
  border: 1px solid var(--climbe-neutral-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: dropIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-header {
  padding: var(--space-3) var(--space-4);
  background-color: var(--climbe-neutral-mute);
  font-weight: var(--font-weight-heavy);
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--climbe-text-muted);
  border-bottom: 1px solid var(--climbe-neutral-border);
}

.dropdown-body {
  display: flex;
  flex-direction: column;
  max-height: 280px;
  overflow-y: auto;
}

.notification-item {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--climbe-neutral-border);
  display: flex;
  gap: var(--space-2);
  align-items: flex-start;
  font-size: 0.82rem;
  color: var(--climbe-text-main);
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background-color: var(--climbe-primary-light);
}

.notification-item.unread {
  background-color: rgba(95, 194, 186, 0.04);
}

.noti-dot {
  width: 6px;
  height: 6px;
  background-color: var(--climbe-primary);
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.noti-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-05);
}

.noti-text span {
  font-size: 0.7rem;
  color: var(--climbe-text-muted);
}
</style>
