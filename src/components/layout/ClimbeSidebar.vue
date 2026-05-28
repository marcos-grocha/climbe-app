<script setup>
import { computed } from 'vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  activeItem: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['toggle', 'navigate'])

const menuItems = [
  { id: 'dashboard', label: 'Painel Geral', icon: '📊' },
  { id: 'contracts', label: 'Gestão de Contratos', icon: '📄' },
  { id: 'companies', label: 'Empresas & Clientes', icon: '🏢' },
  { id: 'users', label: 'Gestão de Usuários', icon: '👥' },
  { id: 'meetings', label: 'Reuniões & Atas', icon: '📅' },
  { id: 'documents', label: 'Documentos', icon: '📁' },
  { id: 'reports', label: 'Relatórios', icon: '📈' },
  { id: 'settings', label: 'Configurações', icon: '⚙️' }
]

const handleNavigate = (itemId) => {
  emit('navigate', itemId)
}
</script>

<template>
  <aside class="climbe-sidebar" :class="{ 'collapsed': collapsed }">
    <!-- Header da Sidebar -->
    <div class="sidebar-header">
      <div v-if="!collapsed" class="sidebar-brand-text">
        <span>CLIMB</span><span class="meta-label">CORP</span>
      </div>
      <div v-else class="sidebar-brand-text-collapsed">C</div>
      
      <!-- Botão para Recolher/Expandir -->
      <button class="collapse-toggle" @click="$emit('toggle')">
        {{ collapsed ? '→' : '←' }}
      </button>
    </div>

    <!-- Links de Navegação -->
    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in menuItems" :key="item.id">
          <button 
            class="nav-link-btn" 
            :class="{ 'active': activeItem === item.id }"
            @click="handleNavigate(item.id)"
            :title="item.label"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
            <span v-if="activeItem === item.id" class="active-indicator"></span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Footer da Sidebar (Perfil Fictício Abreviado) -->
    <div class="sidebar-footer">
      <div class="footer-profile">
        <span class="profile-avatar">👨‍💼</span>
        <div v-if="!collapsed" class="profile-info">
          <span class="profile-name">Admin Climbe</span>
          <span class="profile-status">Online</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.climbe-sidebar {
  width: 260px;
  height: 100vh;
  background-color: var(--climbe-secondary);
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-family-avenir);
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  z-index: 100;
}

.climbe-sidebar.collapsed {
  width: 72px;
}

/* Header */
.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
}

.sidebar-brand-text {
  font-weight: var(--font-weight-black);
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.sidebar-brand-text .meta-label {
  font-size: 0.7rem;
  background: var(--climbe-primary);
  color: var(--climbe-text-on-primary);
  padding: var(--space-05) var(--space-1);
  border-radius: var(--radius-xs);
  font-weight: var(--font-weight-heavy);
}

.sidebar-brand-text-collapsed {
  font-weight: var(--font-weight-black);
  font-size: 1.3rem;
  color: var(--climbe-primary);
  margin-left: var(--space-2);
}

.collapse-toggle {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  outline: none;
}

.collapse-toggle:hover {
  background: var(--climbe-primary);
  border-color: var(--climbe-primary);
  color: var(--climbe-text-on-primary);
}

/* Links */
.sidebar-nav {
  flex: 1;
  padding: var(--space-4) 0;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: 0 var(--space-2);
}

.nav-link-btn {
  width: 100%;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.9rem;
  font-weight: var(--font-weight-medium);
  text-align: left;
  transition: all 0.2s ease;
  position: relative;
  outline: none;
  box-sizing: border-box;
}

.nav-link-btn:hover {
  background-color: rgba(255, 255, 255, 0.04);
  color: #ffffff;
}

.nav-link-btn.active {
  background-color: rgba(95, 194, 186, 0.08);
  color: var(--climbe-primary);
  font-weight: var(--font-weight-heavy);
}

.nav-icon {
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.nav-label {
  white-space: nowrap;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 25%;
  height: 50%;
  width: 3px;
  background-color: var(--climbe-primary);
  border-radius: 0 4px 4px 0;
}

/* Footer */
.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
}

.footer-profile {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.profile-avatar {
  font-size: 1.4rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 0.85rem;
  font-weight: var(--font-weight-heavy);
  color: #ffffff;
}

.profile-status {
  font-size: 0.7rem;
  color: var(--climbe-primary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.profile-status::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--climbe-primary);
}
</style>
