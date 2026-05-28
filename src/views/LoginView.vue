<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClimbLogo from '@/components/ClimbLogo.vue'

const router = useRouter()

// Estados do Form
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const isSubmitting = ref(false)
const showPassword = ref(false)
const loginSuccess = ref(false)

// Estado do Tema
const isDark = ref(false)

onMounted(() => {
  // Inicialização do tema
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

// Função para alternar o tema
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

// Validações em tempo real
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

// Submissão do Login
const handleLogin = () => {
  validateEmail()
  validatePassword()

  if (errors.email || errors.password) return

  isSubmitting.value = true
  
  // Simulação de autenticação com delay premium
  setTimeout(() => {
    isSubmitting.value = false
    loginSuccess.value = true
    
    // Gravar estado de autenticação fictício no localStorage
    localStorage.setItem('climb-auth', 'true')
    localStorage.setItem('climb-user-email', form.email)
    
    setTimeout(() => {
      // Redireciona para o Dashboard (Home)
      router.push('/')
    }, 1200)
  }, 2000)
}
</script>

<template>
  <div class="login-page">
    <!-- Seletor de Tema Flutuante no Canto Superior -->
    <button class="theme-toggle" @click="toggleTheme" aria-label="Alternar tema">
      <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      <span class="theme-text">{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
    </button>

    <div class="login-container">
      <!-- Coluna Esquerda: Formulário de Login -->
      <div class="login-form-side">
        <div class="login-header">
          <!-- Componente de Logotipo Dinâmico da Climb -->
          <div class="logo-wrapper">
            <ClimbLogo height="56" />
          </div>
          <h2>Bem-vindo de volta!</h2>
          <p class="subtitle">Acesse sua conta para gerenciar seus investimentos.</p>
        </div>

        <!-- Tela de Sucesso Animada -->
        <div v-if="loginSuccess" class="success-screen">
          <div class="success-icon-wrapper">
            <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path class="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h3>Acesso Autorizado!</h3>
          <p>Preparando seu painel financeiro...</p>
        </div>

        <!-- Formulário de Login -->
        <form v-else @submit.prevent="handleLogin" class="form" novalidate>
          
          <!-- Campo E-mail -->
          <div class="input-group" :class="{ 'has-error': errors.email, 'has-value': form.email }">
            <div class="input-container">
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                required 
                autocomplete="username"
                @blur="validateEmail"
                @input="errors.email = ''"
              />
              <label for="email">E-mail corporativo ou cadastrado</label>
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
            </div>
            <span v-if="errors.email" class="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {{ errors.email }}
            </span>
          </div>

          <!-- Campo Senha -->
          <div class="input-group" :class="{ 'has-error': errors.password, 'has-value': form.password }">
            <div class="input-container">
              <input 
                id="password" 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                autocomplete="current-password"
                @blur="validatePassword"
                @input="errors.password = ''"
              />
              <label for="password">Senha de acesso</label>
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <!-- Toggle Senha -->
              <button 
                type="button" 
                class="password-toggle" 
                @click="showPassword = !showPassword"
                tabindex="-1"
                :aria-label="showPassword ? 'Esconder senha' : 'Exibir senha'"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {{ errors.password }}
            </span>
          </div>

          <!-- Lembrar / Esqueci Senha -->
          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" v-model="form.rememberMe" />
              <span class="checkmark"></span>
              <span class="checkbox-text">Lembrar-me</span>
            </label>
            <a href="#" class="forgot-password" @click.prevent>Esqueceu a senha?</a>
          </div>

          <!-- Botão Acessar Conta -->
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner"></span>
            <span v-else>Acessar Carteira</span>
          </button>

          <!-- Divisor -->
          <div class="divider">
            <span>ou entre com parceiros</span>
          </div>

          <!-- Provedores Sociais -->
          <div class="social-login">
            <button type="button" class="social-btn" @click.prevent aria-label="Entrar com Google">
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button type="button" class="social-btn" @click.prevent aria-label="Entrar com Apple">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.1.09 2.23-.57 2.95-1.39z"/></svg>
              Apple
            </button>
          </div>
        </form>

        <!-- Footer do formulário -->
        <div class="login-footer">
          <p>Novo por aqui? <a href="#" @click.prevent>Abra sua conta Climb</a></p>
        </div>
      </div>

      <!-- Coluna Direita: Painel Corporativo e Grafismos Climb (Oculto em Mobile) -->
      <div class="login-visual-side">
        <!-- Overlay sofisticado para o gradiente de cores corporativas -->
        <div class="visual-gradient-overlay"></div>
        
        <!-- Elementos flutuantes de fundo (Orbs luminosos) -->
        <div class="glowing-orb orb-1"></div>
        <div class="glowing-orb orb-2"></div>
        
        <div class="visual-content">
          <!-- Selo Corporativo -->
          <div class="brand-tag">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Plataforma 100% Independente e Segura
          </div>
          
          <!-- Frase de Impacto da Climb -->
          <h1>Eleve seus investimentos com inteligência e autonomia.</h1>
          <p class="visual-p">
            Tenha acesso a estratégias sofisticadas, portfólios diversificados e assessoria focada estritamente no seu sucesso financeiro. Suba novos degraus na sua jornada.
          </p>

          <!-- Card Dinâmico de Performance de Investimentos (Wow Factor!) -->
          <div class="preview-card glass-card">
            <div class="card-header">
              <div class="card-title">
                <span class="pulse-indicator"></span>
                <span class="meta-label">Rendimento Estimado</span>
              </div>
              <div class="badge-growth">+ 18.4% a.a.</div>
            </div>
            
            <div class="card-body">
              <div class="performance-number">
                <span class="currency">R$</span> 342.850<span class="decimal">,00</span>
              </div>
              
              <!-- Degraus em Grafismo Ciano Climb (Inspirado no Logotipo!) -->
              <div class="visual-steps-graphic">
                <div class="step-bar step-1"></div>
                <div class="step-bar step-2"></div>
                <div class="step-bar step-3"></div>
                <div class="step-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"></line><polyline points="12 5 19 5 19 12"></polyline></svg>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <div class="card-desc">Carteira Climber Premium</div>
              <div class="card-updated">Atualizado há 2 min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Reset Local e Paleta para a Tela */
.login-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
  z-index: 9999;
}

/* Seletor de Tema */
.theme-toggle {
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.6rem 1.2rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.theme-toggle:hover {
  transform: translateY(-2px);
  border-color: var(--climb-cyan);
  box-shadow: 0 6px 16px var(--climb-cyan-light);
}

.theme-toggle svg {
  stroke: var(--climb-cyan);
}

/* Container Principal */
.login-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr 1fr;
  }
  .theme-toggle {
    right: calc(50% + 2rem);
  }
}

/* Lado Esquerdo: Formulário */
.login-form-side {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  overflow-y: auto;
  box-sizing: border-box;
}

@media (min-width: 1024px) {
  .login-form-side {
    padding: 4rem 3rem;
    max-width: 520px;
    margin-right: 80px;
  }
}

.login-header {
  margin-bottom: 2rem;
}

.logo-wrapper {
  margin-bottom: 1.8rem;
}

.login-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Formulário e Inputs */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-container input {
  width: 100%;
  padding: 1.1rem 1rem 1.1rem 2.8rem;
  border-radius: 0.8rem;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.input-container label {
  position: absolute;
  left: 2.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: 0.95rem;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.3s ease;
}

/* Efeitos de Foco e Rótulo Flutuante (Floating Label) */
.input-container input:focus,
.input-group.has-value .input-container input {
  padding-top: 1.5rem;
  padding-bottom: 0.7rem;
  border-color: var(--climb-cyan);
  box-shadow: 0 0 0 4px var(--climb-cyan-light);
}

.input-container input:focus ~ label,
.input-group.has-value .input-container label {
  top: 30%;
  transform: translateY(-80%);
  font-size: 0.75rem;
  color: var(--climb-cyan);
  font-weight: 600;
}

.input-container input:focus ~ .input-icon,
.input-group.has-value .input-icon {
  color: var(--climb-cyan);
}

/* Campo Senha com Olho */
.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: var(--climb-cyan);
}

/* Erros */
.input-group.has-error .input-container input {
  border-color: #e25c5c;
}
.input-group.has-error .input-container input:focus {
  box-shadow: 0 0 0 4px rgba(226, 92, 92, 0.15);
}
.input-group.has-error .input-container label {
  color: #e25c5c;
}
.input-group.has-error .input-icon {
  color: #e25c5c;
}

.error-message {
  color: #e25c5c;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding-left: 0.2rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Opções de Login: Lembrar / Esqueci Senha */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-top: 0.2rem;
}

.forgot-password {
  color: var(--climb-cyan);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: var(--climb-cyan-hover);
  text-decoration: underline;
}

/* Checkbox Personalizado */
.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 1.7rem;
  cursor: pointer;
  user-select: none;
  color: var(--color-text-muted);
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 1.1rem;
  width: 1.1rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--climb-cyan);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--climb-cyan);
  border-color: var(--climb-cyan);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 5px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  transition: color 0.2s ease;
}

.checkbox-container:hover .checkbox-text {
  color: var(--color-text);
}

/* Botão Submissão */
.submit-btn {
  background: linear-gradient(135deg, var(--climb-cyan) 0%, var(--climb-cyan-hover) 100%);
  color: #121312;
  border: none;
  border-radius: 0.8rem;
  padding: 1.1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px var(--climb-cyan-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--climb-cyan-glow);
  filter: brightness(1.05);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: var(--color-border);
  color: var(--color-text-muted);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Spinner Animado */
.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(18, 19, 18, 0.2);
  border-top-color: #121312;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divisor */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  margin: 0.8rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-border);
}

.divider span {
  padding: 0 0.8rem;
  font-weight: 500;
}

/* Social Login */
.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.8rem;
  border-radius: 0.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-btn:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}

/* Footer Formulário */
.login-footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.login-footer a {
  color: var(--climb-cyan);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-footer a:hover {
  color: var(--climb-cyan-hover);
  text-decoration: underline;
}

/* Lado Direito: Visual Premium (Oculto em Mobile) */
.login-visual-side {
  display: none;
  position: relative;
  background-color: var(--climb-dark-blue);
  overflow: hidden;
  box-sizing: border-box;
}

@media (min-width: 1024px) {
  .login-visual-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4rem 5rem;
  }
}

/* Gradiente e Glows */
.visual-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(22, 28, 27, 0.9) 0%, rgba(12, 16, 15, 0.98) 100%);
  z-index: 1;
}

.glowing-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  z-index: 0;
  animation: pulseOrb 8s infinite alternate ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: var(--climb-cyan);
  top: -100px;
  right: -100px;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: #3e8882;
  bottom: -50px;
  left: -50px;
  animation-delay: -3s;
}

@keyframes pulseOrb {
  0% { transform: scale(1) translate(0, 0); opacity: 0.15; }
  100% { transform: scale(1.2) translate(20px, 20px); opacity: 0.25; }
}

.visual-content {
  position: relative;
  z-index: 2;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 560px;
}

.brand-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(95, 194, 186, 0.12);
  border: 1px solid rgba(95, 194, 186, 0.25);
  color: var(--climb-cyan);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 700;
  width: fit-content;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.visual-content h1 {
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
  background: linear-gradient(to right, #ffffff 30%, #aeeae3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.visual-p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.05rem;
  line-height: 1.6;
}

/* Glassmorphism Card (Wow Factor!) */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  padding: 1.8rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  margin-top: 1.5rem;
  transition: transform 0.4s ease, border-color 0.4s ease;
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent);
  transform: skewX(-25deg);
  transition: 0.75s;
}

.glass-card:hover {
  transform: translateY(-5px) scale(1.01);
  border-color: rgba(95, 194, 186, 0.3);
}

.glass-card:hover::before {
  left: 125%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pulse-indicator {
  width: 8px;
  height: 8px;
  background-color: var(--climb-cyan);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--climb-cyan);
  animation: pulseIndicator 1.5s infinite;
}

@keyframes pulseIndicator {
  0% { transform: scale(0.9); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.6; }
}

.meta-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge-growth {
  background: rgba(76, 175, 80, 0.15);
  color: #81c784;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
}

.performance-number {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}

.performance-number .currency {
  font-size: 1.2rem;
  color: var(--climb-cyan);
  font-weight: 600;
  margin-right: 0.3rem;
}

.performance-number .decimal {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Grafismo Degraus Ciano Climb (Alinhado à Logo) */
.visual-steps-graphic {
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
  height: 60px;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.step-bar {
  flex: 1;
  background: rgba(95, 194, 186, 0.15);
  border-radius: 0.25rem 0.25rem 0 0;
  transition: all 0.6s ease;
}

.step-1 { height: 30%; animation: growStep 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards; }
.step-2 { height: 55%; animation: growStep 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.2s forwards; }
.step-3 { 
  height: 80%; 
  background: linear-gradient(to top, rgba(95, 194, 186, 0.3), var(--climb-cyan));
  animation: growStep 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.4s forwards; 
}

@keyframes growStep {
  from { height: 0; }
}

.step-arrow {
  color: var(--climb-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 0.5rem;
  animation: bounceArrow 2s infinite alternate;
}

@keyframes bounceArrow {
  0% { transform: translate(0, 0); }
  100% { transform: translate(4px, -4px); }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-top: 1rem;
}

.card-desc {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.card-updated {
  color: rgba(255, 255, 255, 0.35);
}

/* Tela de Sucesso Animada */
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  animation: scaleUp 0.4s ease;
}

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.success-icon-wrapper {
  margin-bottom: 1.5rem;
}

.success-checkmark {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: block;
  stroke-width: 2.5;
  stroke: #ffffff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px var(--climb-cyan);
  animation: fillSuccess .4s ease-in-out .4s forwards, scaleSuccess .3s ease-in-out .9s both;
}

.success-checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2.5;
  stroke-miterlimit: 10;
  stroke: var(--climb-cyan);
  fill: none;
  animation: strokeSuccess .6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.success-checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: #121312;
  animation: strokeSuccess .3s cubic-bezier(0.65, 0, 0.45, 1) .8s forwards;
}

@keyframes strokeSuccess {
  100% { stroke-dashoffset: 0; }
}

@keyframes fillSuccess {
  100% { box-shadow: inset 0px 0px 0px 40px var(--climb-cyan); }
}

@keyframes scaleSuccess {
  0%, 100% { transform: none; }
  50% { transform: scale3d(1.1, 1.1, 1); }
}

.success-screen h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.success-screen p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
</style>
