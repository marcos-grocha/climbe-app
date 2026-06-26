<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import ClimbeCard from '@/components/ui/ClimbeCard.vue'
import ClimbeButton from '@/components/ui/ClimbeButton.vue'
import ClimbeInput from '@/components/ui/ClimbeInput.vue'
import ClimbeBadge from '@/components/ui/ClimbeBadge.vue'
import { useAuthStore } from '@/stores/auth'
import { obterConfiguracoes, salvarConfiguracoes, alterarSenha } from '@/services/configuracoesService'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('settings') // Menu item active sidebar state
const configTab = ref('perfil') // Settings page subtab: 'perfil', 'preferencias', 'empresa'

const carregando = ref(true)
const salvando = ref(false)
const alterandoSenha = ref(false)

const feedbackMsg = ref('')
const feedbackTipo = ref('success') // 'success' | 'error'

const passFeedbackMsg = ref('')
const passFeedbackTipo = ref('success')

// Formulários
const formPerfil = reactive({
  nome_completo: '',
  email: '',
  cargo: '',
  telefone: '',
  avatar: 'AC',
  avatar_color: '#5fc2ba'
})

const formPreferencias = reactive({
  notificacoes_email: true,
  alertas_seguranca: true,
  relatorio_semanal: false,
  novas_propostas: true,
  auditoria_avisos: true,
  '2fa_ativo': false,
  idioma: 'pt-BR',
  tema: 'dark'
})

const formEmpresa = reactive({
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  telefone: '',
  endereco: '',
  webhook_url: '',
  webhook_ativo: true
})

const formSenha = reactive({
  senha_atual: '',
  nova_senha: '',
  confirmar_senha: ''
})

onMounted(async () => {
  try {
    const config = await obterConfiguracoes()
    
    // Preenche os formulários
    Object.assign(formPerfil, config.perfil)
    Object.assign(formPreferencias, config.preferencias)
    Object.assign(formEmpresa, config.empresa)
    
    // Atualiza tema do sistema com base na preferência salva
    atualizarTemaSistema(formPreferencias.tema)
  } catch (err) {
    mostrarFeedback('Erro ao carregar configurações: ' + err.message, 'error')
  } finally {
    carregando.value = false
  }
})

function navegarPeloMenu(itemId) {
  const rotas = {
    empresas: '/empresas',
    propostas: '/propostas',
    documentos: '/documentos',
    users: '/usuarios',
    relatorios: '/relatorios',
    settings: '/configuracoes'
  }
  if (rotas[itemId]) {
    router.push(rotas[itemId])
  } else if (itemId === 'dashboard' || itemId === 'contracts') {
    router.push('/')
  }
}

function mostrarFeedback(msg, tipo = 'success') {
  feedbackMsg.value = msg
  feedbackTipo.value = tipo
  setTimeout(() => {
    feedbackMsg.value = ''
  }, 4000)
}

function mostrarFeedbackSenha(msg, tipo = 'success') {
  passFeedbackMsg.value = msg
  passFeedbackTipo.value = tipo
  setTimeout(() => {
    passFeedbackMsg.value = ''
  }, 4000)
}

// Aplica a classe de tema no elemento raiz
function atualizarTemaSistema(tema) {
  const root = document.documentElement
  if (tema === 'light') {
    root.classList.remove('dark-theme')
    root.classList.add('light-theme')
  } else {
    root.classList.remove('light-theme')
    root.classList.add('dark-theme')
  }
}

// Ações
async function salvarPerfil() {
  if (!formPerfil.nome_completo.trim() || !formPerfil.email.trim()) {
    mostrarFeedback('Nome completo e E-mail são obrigatórios.', 'error')
    return
  }
  
  salvando.value = true
  try {
    await salvarConfiguracoes('perfil', formPerfil)
    
    // Atualiza a Pinia store se o usuário logado for alterado
    if (authStore.user) {
      authStore.user.nome_completo = formPerfil.nome_completo
      authStore.user.email = formPerfil.email
    }
    
    // Atualiza o email no localStorage
    localStorage.setItem('climb-user-email', formPerfil.email)
    
    mostrarFeedback('Perfil atualizado com sucesso!')
  } catch (err) {
    mostrarFeedback('Erro ao salvar perfil: ' + err.message, 'error')
  } finally {
    salvando.value = false
  }
}

async function salvarPreferencias() {
  salvando.value = true
  try {
    await salvarConfiguracoes('preferencias', formPreferencias)
    
    // Aplica o tema
    atualizarTemaSistema(formPreferencias.tema)
    
    mostrarFeedback('Preferências do sistema atualizadas!')
  } catch (err) {
    mostrarFeedback('Erro ao salvar preferências: ' + err.message, 'error')
  } finally {
    salvando.value = false
  }
}

async function salvarEmpresa() {
  if (!formEmpresa.razao_social.trim() || !formEmpresa.cnpj.trim()) {
    mostrarFeedback('Razão Social e CNPJ são obrigatórios.', 'error')
    return
  }
  
  salvando.value = true
  try {
    await salvarConfiguracoes('empresa', formEmpresa)
    mostrarFeedback('Dados da empresa atualizados com sucesso!')
  } catch (err) {
    mostrarFeedback('Erro ao salvar dados da empresa: ' + err.message, 'error')
  } finally {
    salvando.value = false
  }
}

async function atualizarSenha() {
  if (!formSenha.senha_atual || !formSenha.nova_senha || !formSenha.confirmar_senha) {
    mostrarFeedbackSenha('Preencha todos os campos de senha.', 'error')
    return
  }
  
  if (formSenha.nova_senha !== formSenha.confirmar_senha) {
    mostrarFeedbackSenha('A nova senha e a confirmação não coincidem.', 'error')
    return
  }
  
  alterandoSenha.value = true
  try {
    await alterarSenha(formSenha.senha_atual, formSenha.nova_senha)
    mostrarFeedbackSenha('Senha atualizada com sucesso!')
    formSenha.senha_atual = ''
    formSenha.nova_senha = ''
    formSenha.confirmar_senha = ''
  } catch (err) {
    mostrarFeedbackSenha(err.message, 'error')
  } finally {
    alterandoSenha.value = false
  }
}
</script>

<template>
  <ClimbePageWrapper title="Configurações" :active-tab="activeTab" @navigate="navegarPeloMenu">
    <div class="flex flex-col gap-6">
      
      <!-- Cabeçalho -->
      <div class="flex flex-col gap-3 border-b border-[#5fc2ba2e] pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="mb-1 text-[2rem] font-black text-white">Configurações do Sistema</h1>
          <p class="text-climbe-text-muted">Gerencie suas preferências pessoais, segurança e dados corporativos da Climbe.</p>
        </div>
      </div>

      <!-- Feedbacks Globais -->
      <transition name="fade">
        <div v-if="feedbackMsg" 
             :class="feedbackTipo === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'"
             class="rounded-md border p-4 text-sm flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all">
          <span>{{ feedbackTipo === 'success' ? '✅' : '⚠️' }}</span>
          <span>{{ feedbackMsg }}</span>
        </div>
      </transition>

      <div v-if="carregando" class="text-center py-20 text-climbe-text-muted font-medium">
        <div class="spinner mb-3"></div>
        Carregando configurações...
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Navegação de Abas Internas -->
        <div class="lg:col-span-1 flex flex-col gap-2">
          <button 
            @click="configTab = 'perfil'" 
            :class="configTab === 'perfil' ? 'bg-[#5fc2ba1c] border-climbe-primary text-climbe-primary font-heavy' : 'border-transparent text-climbe-text-muted hover:bg-white/5 hover:text-white'"
            class="flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 text-left text-[0.95rem] transition-all outline-none"
          >
            <span>👤</span>
            <span>Meu Perfil</span>
          </button>
          
          <button 
            @click="configTab = 'preferencias'" 
            :class="configTab === 'preferencias' ? 'bg-[#5fc2ba1c] border-climbe-primary text-climbe-primary font-heavy' : 'border-transparent text-climbe-text-muted hover:bg-white/5 hover:text-white'"
            class="flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 text-left text-[0.95rem] transition-all outline-none"
          >
            <span>⚙️</span>
            <span>Segurança & Preferências</span>
          </button>
          
          <button 
            @click="configTab = 'empresa'" 
            :class="configTab === 'empresa' ? 'bg-[#5fc2ba1c] border-climbe-primary text-climbe-primary font-heavy' : 'border-transparent text-climbe-text-muted hover:bg-white/5 hover:text-white'"
            class="flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 text-left text-[0.95rem] transition-all outline-none"
          >
            <span>🏢</span>
            <span>Dados da Empresa</span>
          </button>
        </div>

        <!-- Painel de Conteúdo da Aba -->
        <div class="lg:col-span-3 flex flex-col gap-6">
          
          <!-- ABA 1: MEU PERFIL -->
          <div v-if="configTab === 'perfil'" class="flex flex-col gap-6">
            <ClimbeCard padding="lg" variant="solid" class="glass-card">
              <template #header>
                <div class="border-b border-[#5fc2ba1e] pb-3 mb-4 w-full">
                  <h3 class="text-xl font-bold text-white m-0">Informações Pessoais</h3>
                  <p class="text-xs text-climbe-text-muted mt-1">Atualize seus dados de cadastro e identificação na plataforma.</p>
                </div>
              </template>

              <form @submit.prevent="salvarPerfil" class="flex flex-col gap-5">
                <div class="flex flex-col md:flex-row gap-6 items-center border-b border-white/5 pb-5">
                  <div class="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl text-[#121312] transition-transform hover:scale-105"
                       :style="{ backgroundColor: formPerfil.avatar_color || '#5fc2ba' }">
                    {{ formPerfil.avatar }}
                  </div>
                  
                  <div class="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                    <span class="text-sm font-heavy text-white">Avatar Corporativo</span>
                    <p class="text-xs text-climbe-text-muted">Iniciais geradas com base no seu cargo e perfil.</p>
                    <div class="flex gap-2 mt-2">
                      <span v-for="color in ['#5fc2ba', '#38bdf8', '#a78bfa', '#fca84b']" 
                            :key="color"
                            @click="formPerfil.avatar_color = color"
                            :style="{ backgroundColor: color }"
                            class="w-6 h-6 rounded-full cursor-pointer border-2 transition-transform hover:scale-110"
                            :class="formPerfil.avatar_color === color ? 'border-white' : 'border-transparent'">
                      </span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ClimbeInput 
                    id="perf-nome"
                    v-model="formPerfil.nome_completo"
                    label="Nome Completo"
                    placeholder="Seu nome"
                  />
                  <ClimbeInput 
                    id="perf-email"
                    v-model="formPerfil.email"
                    label="E-mail Corporativo"
                    placeholder="exemplo@climbe.com"
                  />
                  <ClimbeInput 
                    id="perf-cargo"
                    v-model="formPerfil.cargo"
                    label="Cargo / Função"
                    placeholder="Ex: Diretor"
                  />
                  <ClimbeInput 
                    id="perf-tel"
                    v-model="formPerfil.telefone"
                    label="Telefone de Contato"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div class="flex justify-end mt-4">
                  <ClimbeButton variant="primary" type="submit" :loading="salvando" class="!px-6">
                    {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
                  </ClimbeButton>
                </div>
              </form>
            </ClimbeCard>

            <!-- Alterar Senha -->
            <ClimbeCard padding="lg" variant="solid" class="glass-card">
              <template #header>
                <div class="border-b border-[#5fc2ba1e] pb-3 mb-4 w-full">
                  <h3 class="text-xl font-bold text-white m-0">Alterar Senha</h3>
                  <p class="text-xs text-climbe-text-muted mt-1">Mantenha sua conta protegida alterando sua credencial periodicamente.</p>
                </div>
              </template>

              <!-- Feedback Senha -->
              <transition name="fade">
                <div v-if="passFeedbackMsg" 
                     :class="passFeedbackTipo === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'"
                     class="rounded-md border p-3 text-xs mb-4 flex items-center gap-2">
                  <span>{{ passFeedbackTipo === 'success' ? '✅' : '⚠️' }}</span>
                  <span>{{ passFeedbackMsg }}</span>
                </div>
              </transition>

              <form @submit.prevent="atualizarSenha" class="flex flex-col gap-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ClimbeInput 
                    id="pass-atual"
                    v-model="formSenha.senha_atual"
                    type="password"
                    label="Senha Atual"
                    placeholder="••••••••"
                  />
                  <ClimbeInput 
                    id="pass-nova"
                    v-model="formSenha.nova_senha"
                    type="password"
                    label="Nova Senha"
                    placeholder="••••••••"
                  />
                  <ClimbeInput 
                    id="pass-conf"
                    v-model="formSenha.confirmar_senha"
                    type="password"
                    label="Confirmar Nova Senha"
                    placeholder="••••••••"
                  />
                </div>

                <div class="flex justify-end mt-2">
                  <ClimbeButton variant="secondary" type="submit" :loading="alterandoSenha" class="!px-6">
                    {{ alterandoSenha ? 'Alterando...' : 'Atualizar Senha' }}
                  </ClimbeButton>
                </div>
              </form>
            </ClimbeCard>
          </div>

          <!-- ABA 2: PREFERÊNCIAS & SEGURANÇA -->
          <div v-if="configTab === 'preferencias'" class="flex flex-col gap-6">
            <ClimbeCard padding="lg" variant="solid" class="glass-card">
              <template #header>
                <div class="border-b border-[#5fc2ba1e] pb-3 mb-4 w-full">
                  <h3 class="text-xl font-bold text-white m-0">Preferências & Notificações</h3>
                  <p class="text-xs text-climbe-text-muted mt-1">Configure o comportamento do sistema e alertas recebidos.</p>
                </div>
              </template>

              <form @submit.prevent="salvarPreferencias" class="flex flex-col gap-5">
                
                <!-- Aparência do Tema -->
                <div class="flex flex-col gap-2 pb-4 border-b border-white/5">
                  <span class="text-sm font-heavy text-[#b7d4de]">Aparência / Tema</span>
                  <div class="flex gap-4 mt-2">
                    <label class="theme-option" :class="{ 'theme-option--selected': formPreferencias.tema === 'dark' }">
                      <input type="radio" v-model="formPreferencias.tema" value="dark" class="sr-only" />
                      <span class="text-xl">🌙</span>
                      <span class="text-sm font-bold">Modo Escuro</span>
                    </label>
                    <label class="theme-option" :class="{ 'theme-option--selected': formPreferencias.tema === 'light' }">
                      <input type="radio" v-model="formPreferencias.tema" value="light" class="sr-only" />
                      <span class="text-xl">☀️</span>
                      <span class="text-sm font-bold">Modo Claro</span>
                    </label>
                  </div>
                </div>

                <!-- Notificações (Switches Customizados) -->
                <div class="flex flex-col gap-4">
                  <span class="text-sm font-heavy text-[#b7d4de] mb-1">Avisos e E-mails</span>
                  
                  <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <h4 class="text-[0.9rem] font-bold text-white m-0">Alertas de Segurança</h4>
                      <p class="text-xs text-climbe-text-muted mt-0.5">Notificar tentativas de login e alteração de senhas.</p>
                    </div>
                    <label class="switch-container">
                      <input type="checkbox" v-model="formPreferencias.alertas_seguranca" />
                      <span class="switch-slider"></span>
                    </label>
                  </div>

                  <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <h4 class="text-[0.9rem] font-bold text-white m-0">Novas Propostas Comercias</h4>
                      <p class="text-xs text-climbe-text-muted mt-0.5">Avisar quando novas propostas forem criadas por clientes.</p>
                    </div>
                    <label class="switch-container">
                      <input type="checkbox" v-model="formPreferencias.novas_propostas" />
                      <span class="switch-slider"></span>
                    </label>
                  </div>

                  <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <h4 class="text-[0.9rem] font-bold text-white m-0">Auditoria Jurídica</h4>
                      <p class="text-xs text-climbe-text-muted mt-0.5">Notificar quando contratos expirarem ou precisarem de revisão.</p>
                    </div>
                    <label class="switch-container">
                      <input type="checkbox" v-model="formPreferencias.auditoria_avisos" />
                      <span class="switch-slider"></span>
                    </label>
                  </div>

                  <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <h4 class="text-[0.9rem] font-bold text-white m-0">Relatórios Semanais Consolidados</h4>
                      <p class="text-xs text-climbe-text-muted mt-0.5">Receber por e-mail o resumo financeiro das empresas.</p>
                    </div>
                    <label class="switch-container">
                      <input type="checkbox" v-model="formPreferencias.relatorio_semanal" />
                      <span class="switch-slider"></span>
                    </label>
                  </div>

                  <div class="flex justify-between items-center py-2">
                    <div>
                      <h4 class="text-[0.9rem] font-bold text-white m-0">Autenticação de Dois Fatores (2FA)</h4>
                      <p class="text-xs text-climbe-text-muted mt-0.5">Adicionar camada extra de proteção no acesso ao painel Climbe.</p>
                    </div>
                    <label class="switch-container">
                      <input type="checkbox" v-model="formPreferencias['2fa_ativo']" />
                      <span class="switch-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="flex justify-end mt-4">
                  <ClimbeButton variant="primary" type="submit" :loading="salvando" class="!px-6">
                    Salvar Preferências
                  </ClimbeButton>
                </div>
              </form>
            </ClimbeCard>
          </div>

          <!-- ABA 3: DADOS DA EMPRESA -->
          <div v-if="configTab === 'empresa'" class="flex flex-col gap-6">
            <ClimbeCard padding="lg" variant="solid" class="glass-card">
              <template #header>
                <div class="border-b border-[#5fc2ba1e] pb-3 mb-4 w-full">
                  <h3 class="text-xl font-bold text-white m-0">Dados Fiduciários da Corporação</h3>
                  <p class="text-xs text-climbe-text-muted mt-1">Configurações cadastrais para emissão de relatórios e faturamento.</p>
                </div>
              </template>

              <form @submit.prevent="salvarEmpresa" class="flex flex-col gap-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ClimbeInput 
                    id="emp-razao"
                    v-model="formEmpresa.razao_social"
                    label="Razão Social"
                    placeholder="Razão Social da Empresa"
                  />
                  <ClimbeInput 
                    id="emp-fantasia"
                    v-model="formEmpresa.nome_fantasia"
                    label="Nome Fantasia"
                    placeholder="Nome Fantasia"
                  />
                  <ClimbeInput 
                    id="emp-cnpj"
                    v-model="formEmpresa.cnpj"
                    label="CNPJ"
                    placeholder="00.000.000/0000-00"
                  />
                  <ClimbeInput 
                    id="emp-tel"
                    v-model="formEmpresa.telefone"
                    label="Telefone Comercial"
                    placeholder="(11) 3000-0000"
                  />
                  <div class="md:col-span-2">
                    <ClimbeInput 
                      id="emp-end"
                      v-model="formEmpresa.endereco"
                      label="Endereço da Sede"
                      placeholder="Av. Paulista, 1000 - São Paulo - SP"
                    />
                  </div>
                </div>

                <div class="border-t border-white/5 pt-5 mt-2 flex flex-col gap-3">
                  <span class="text-sm font-heavy text-[#b7d4de]">Integrações API (Webhooks)</span>
                  <div class="flex flex-col gap-4">
                    <ClimbeInput 
                      id="emp-webhook"
                      v-model="formEmpresa.webhook_url"
                      label="URL de Destino para Eventos de Contratos"
                      placeholder="https://api.suaempresa.com/hooks"
                    />
                    <div class="flex justify-between items-center py-2">
                      <div>
                        <h4 class="text-[0.85rem] font-bold text-white m-0">Webhook Habilitado</h4>
                        <p class="text-xs text-climbe-text-muted mt-0.5">Enviar notificações em tempo real de assinaturas de contratos.</p>
                      </div>
                      <label class="switch-container">
                        <input type="checkbox" v-model="formEmpresa.webhook_ativo" />
                        <span class="switch-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end mt-4">
                  <ClimbeButton variant="primary" type="submit" :loading="salvando" class="!px-6">
                    Salvar Dados Corporativos
                  </ClimbeButton>
                </div>
              </form>
            </ClimbeCard>
          </div>

        </div>

      </div>
    </div>
  </ClimbePageWrapper>
</template>

<style scoped>
.glass-card {
  border: 1px solid rgba(95, 194, 186, 0.22) !important;
  background: #101718 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25) !important;
  backdrop-filter: blur(8px);
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 3px solid rgba(95, 194, 186, 0.1);
  border-top-color: #5fc2ba;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transições */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Opções de Tema */
.theme-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.2rem 1rem;
  border-radius: 12px;
  border: 2px solid rgba(95, 194, 186, 0.15);
  background: #182225;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: #eef8fb;
  text-align: center;
}
.theme-option:hover {
  border-color: rgba(95, 194, 186, 0.4);
  transform: translateY(-2px);
}
.theme-option--selected {
  border-color: #5fc2ba;
  background: rgba(95, 194, 186, 0.08);
  box-shadow: 0 0 14px rgba(95, 194, 186, 0.15);
}

/* Switches Customizados */
.switch-container {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
  flex-shrink: 0;
}
.switch-container input {
  opacity: 0;
  width: 0;
  height: 0;
}
.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #212d30;
  transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 34px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.switch-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: #a2b4b2;
  transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
}
.switch-container input:checked + .switch-slider {
  background-color: #5fc2ba;
  border-color: #5fc2ba;
}
.switch-container input:checked + .switch-slider:before {
  transform: translateX(22px);
  background-color: #121312;
}

/* Estilos de luz/tema se a classe light-theme for aplicada */
:global(.light-theme) .glass-card {
  background: #ffffff !important;
  border: 1px solid rgba(95, 194, 186, 0.25) !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05) !important;
}
:global(.light-theme) .theme-option {
  background: #f0f4f4;
  color: #1a2322;
  border-color: rgba(95, 194, 186, 0.15);
}
:global(.light-theme) .theme-option--selected {
  border-color: #5fc2ba;
  background: rgba(95, 194, 186, 0.08);
}
:global(.light-theme) .switch-slider {
  background-color: #d1dddd;
}
:global(.light-theme) .switch-container input:checked + .switch-slider {
  background-color: #5fc2ba;
}
</style>
