<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useUsuariosStore } from '@/stores/usuariosStore'

const router = useRouter()
const usuariosStore = useUsuariosStore()

const activeTab = ref('users')
const dialogVisivel = ref(false)
const modoEdicaoId = ref(null)
const salvando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')
const filtroNome = ref('')
const filtroPerfil = ref('')
const filtroStatus = ref('')

const formulario = reactive({
  nome_completo: '',
  email: '',
  cargo: '',
  perfil: 'usuario',
})

const erros = reactive({})

const tituloDialog = computed(() => (modoEdicaoId.value ? 'Editar usuário' : 'Novo usuário'))

const usuariosFiltrados = computed(() => {
  return usuariosStore.usuarios.filter((u) => {
    const matchNome = !filtroNome.value || u.nome_completo.toLowerCase().includes(filtroNome.value.toLowerCase())
    const matchPerfil = !filtroPerfil.value || u.perfil === filtroPerfil.value
    const matchStatus = !filtroStatus.value || u.status === filtroStatus.value
    return matchNome && matchPerfil && matchStatus
  })
})

function limparErros() {
  Object.keys(erros).forEach((k) => delete erros[k])
}

function validarFormulario() {
  limparErros()
  if (!formulario.nome_completo.trim()) erros.nome_completo = 'Nome é obrigatório.'
  if (!formulario.email.trim()) {
    erros.email = 'E-mail é obrigatório.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
    erros.email = 'E-mail inválido.'
  }
  if (!formulario.cargo.trim()) erros.cargo = 'Cargo é obrigatório.'
  return Object.keys(erros).length === 0
}

function abrirCriacao() {
  modoEdicaoId.value = null
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  limparErros()
  formulario.nome_completo = ''
  formulario.email = ''
  formulario.cargo = ''
  formulario.perfil = 'usuario'
  dialogVisivel.value = true
}

function abrirEdicao(usuario) {
  modoEdicaoId.value = usuario.id
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  limparErros()
  formulario.nome_completo = usuario.nome_completo
  formulario.email = usuario.email
  formulario.cargo = usuario.cargo
  formulario.perfil = usuario.perfil
  dialogVisivel.value = true
}

async function salvarUsuario() {
  if (!validarFormulario()) return
  salvando.value = true
  try {
    if (modoEdicaoId.value) {
      await usuariosStore.atualizarUsuario(modoEdicaoId.value, { ...formulario })
      mensagemSucesso.value = 'Usuário atualizado com sucesso.'
    } else {
      await usuariosStore.criarUsuario({ ...formulario })
      mensagemSucesso.value = 'Usuário criado com sucesso.'
    }
    dialogVisivel.value = false
  } catch {
    mensagemErro.value = 'Não foi possível salvar o usuário.'
  } finally {
    salvando.value = false
  }
}

async function alternarStatus(usuario) {
  try {
    await usuariosStore.toggleStatus(usuario.id)
    mensagemSucesso.value = `Usuário ${usuario.status === 'ativo' ? 'desativado' : 'ativado'} com sucesso.`
    setTimeout(() => { mensagemSucesso.value = '' }, 3000)
  } catch {
    mensagemErro.value = 'Erro ao alterar o status do usuário.'
  }
}

async function confirmarExclusao(usuario) {
  const confirmou = window.confirm(`Deseja realmente excluir "${usuario.nome_completo}"?`)
  if (!confirmou) return
  try {
    await usuariosStore.excluirUsuario(usuario.id)
    mensagemSucesso.value = 'Usuário excluído com sucesso.'
    setTimeout(() => { mensagemSucesso.value = '' }, 3000)
  } catch {
    mensagemErro.value = 'Erro ao excluir o usuário.'
  }
}

function limparFiltros() {
  filtroNome.value = ''
  filtroPerfil.value = ''
  filtroStatus.value = ''
}

function navegarPeloMenu(itemId) {
  const rotas = {
    empresas: '/empresas',
    propostas: '/propostas',
    documentos: '/documentos',
    users: '/usuarios',
  }
  if (rotas[itemId]) {
    router.push(rotas[itemId])
  } else if (itemId === 'dashboard' || itemId === 'contracts') {
    router.push('/')
  }
}

onMounted(async () => {
  try {
    await usuariosStore.carregarUsuarios()
  } catch {
    mensagemErro.value = 'Não foi possível carregar os usuários.'
  }
})
</script>

<template>
  <ClimbePageWrapper title="Gestão de Usuários" :active-tab="activeTab" @navigate="navegarPeloMenu">
    <div class="flex flex-col gap-6">

      <!-- Cabeçalho -->
      <div class="flex flex-col gap-3 border-b border-[#5fc2ba2e] pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="mb-1 text-[2rem] font-black text-white">Usuários & Admins</h1>
          <p class="text-climbe-text-muted">Gerencie os acessos, perfis e permissões da plataforma.</p>
        </div>
        <Button
          label="Novo usuário"
          icon="pi pi-user-plus"
          class="!h-12 !rounded-md !border-0 !bg-[#67cec7] !px-6 !font-bold !text-[#0f1618] hover:!bg-[#7ad8d2]"
          @click="abrirCriacao"
        />
      </div>

      <!-- Cards de métricas -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="metric-card">
          <div class="metric-icon">👑</div>
          <div>
            <p class="metric-label">Administradores</p>
            <p class="metric-value">{{ usuariosStore.totalAdmins }}</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">👤</div>
          <div>
            <p class="metric-label">Usuários Comuns</p>
            <p class="metric-value">{{ usuariosStore.totalUsuarios }}</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">✅</div>
          <div>
            <p class="metric-label">Ativos no Sistema</p>
            <p class="metric-value">{{ usuariosStore.totalAtivos }}</p>
          </div>
        </div>
      </div>

      <!-- Alertas -->
      <div v-if="mensagemErro" class="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {{ mensagemErro }}
      </div>
      <div v-if="mensagemSucesso" class="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        {{ mensagemSucesso }}
      </div>

      <!-- Filtros -->
      <section class="rounded-xl border border-[#5fc2ba42] bg-[#101718] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-[#b7d4de]">Nome</label>
            <InputText v-model="filtroNome" placeholder="Buscar por nome..." class="filter-input" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-[#b7d4de]">Perfil</label>
            <select v-model="filtroPerfil" class="filter-select">
              <option value="">Todos os perfis</option>
              <option value="admin">Administrador</option>
              <option value="usuario">Usuário</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-[#b7d4de]">Status</label>
            <select v-model="filtroStatus" class="filter-select">
              <option value="">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end">
          <Button label="Limpar filtros" text size="small" class="!text-[#b7d4de]" @click="limparFiltros" />
        </div>
      </section>

      <!-- Tabela -->
      <section class="rounded-xl border border-[#5fc2ba42] bg-[#101718] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:p-6">
        <div class="mb-4 border-b border-[#5fc2ba24] pb-4">
          <h2 class="m-0 text-xl font-extrabold text-[#f0fbff]">
            Usuários cadastrados
            <span class="ml-2 rounded-full bg-[#5fc2ba22] px-2 py-0.5 text-sm text-climbe-primary">
              {{ usuariosFiltrados.length }}
            </span>
          </h2>
        </div>

        <DataTable
          :value="usuariosFiltrados"
          dataKey="id"
          :loading="usuariosStore.carregando"
          stripedRows
          paginator
          :rows="8"
          tableStyle="min-width: 60rem"
          class="usuarios-table"
        >
          <template #empty>Nenhum usuário encontrado.</template>

          <!-- Avatar + Nome -->
          <Column header="Usuário" style="min-width: 220px">
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <div class="avatar-circle">{{ data.avatar }}</div>
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-white">{{ data.nome_completo }}</span>
                  <span class="text-xs text-[#7ba8b4]">{{ data.email }}</span>
                </div>
              </div>
            </template>
          </Column>

          <Column field="cargo" header="Cargo" />

          <!-- Perfil -->
          <Column header="Perfil">
            <template #body="{ data }">
              <span :class="data.perfil === 'admin' ? 'badge-admin' : 'badge-user'">
                {{ data.perfil === 'admin' ? '👑 Admin' : '👤 Usuário' }}
              </span>
            </template>
          </Column>

          <!-- Status -->
          <Column header="Status">
            <template #body="{ data }">
              <Tag
                :value="data.status === 'ativo' ? 'Ativo' : 'Inativo'"
                :severity="data.status === 'ativo' ? 'success' : 'secondary'"
                class="status-pill"
              />
            </template>
          </Column>

          <Column field="ultimo_acesso" header="Último acesso" />

          <!-- Ações -->
          <Column header="Ações" style="min-width: 180px">
            <template #body="{ data }">
              <div class="flex items-center gap-1">
                <Button
                  icon="pi pi-pencil"
                  size="small"
                  text
                  title="Editar"
                  class="acao-editar"
                  @click="abrirEdicao(data)"
                />
                <Button
                  :icon="data.status === 'ativo' ? 'pi pi-ban' : 'pi pi-check-circle'"
                  size="small"
                  text
                  :title="data.status === 'ativo' ? 'Desativar' : 'Ativar'"
                  :class="data.status === 'ativo' ? 'acao-toggle-off' : 'acao-toggle-on'"
                  @click="alternarStatus(data)"
                />
                <Button
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  text
                  title="Excluir"
                  class="acao-excluir"
                  @click="confirmarExclusao(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </section>
    </div>

    <!-- Dialog: Criar / Editar -->
    <Dialog
      v-model:visible="dialogVisivel"
      modal
      :header="tituloDialog"
      :style="{ width: '36rem', maxWidth: '95vw' }"
    >
      <div class="flex flex-col gap-5 pt-2">
        <div class="flex flex-col gap-1">
          <label class="field-label">Nome completo</label>
          <InputText id="nome_completo" v-model="formulario.nome_completo" placeholder="Ex: João da Silva" />
          <small v-if="erros.nome_completo" class="text-red-400">{{ erros.nome_completo }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label class="field-label">E-mail</label>
          <InputText id="email_usuario" v-model="formulario.email" type="email" placeholder="Ex: joao@climbe.com" />
          <small v-if="erros.email" class="text-red-400">{{ erros.email }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label class="field-label">Cargo</label>
          <InputText id="cargo_usuario" v-model="formulario.cargo" placeholder="Ex: Analista Financeiro" />
          <small v-if="erros.cargo" class="text-red-400">{{ erros.cargo }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label class="field-label">Perfil de acesso</label>
          <div class="flex gap-3">
            <label class="perfil-option" :class="{ 'perfil-option--selected': formulario.perfil === 'usuario' }">
              <input type="radio" v-model="formulario.perfil" value="usuario" class="sr-only" />
              <span class="text-lg">👤</span>
              <div>
                <p class="text-sm font-bold">Usuário</p>
                <p class="text-xs text-[#7ba8b4]">Acesso padrão à plataforma</p>
              </div>
            </label>
            <label class="perfil-option" :class="{ 'perfil-option--selected': formulario.perfil === 'admin' }">
              <input type="radio" v-model="formulario.perfil" value="admin" class="sr-only" />
              <span class="text-lg">👑</span>
              <div>
                <p class="text-sm font-bold">Administrador</p>
                <p class="text-xs text-[#7ba8b4]">Acesso total ao sistema</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2 pt-2">
          <Button label="Cancelar" text @click="dialogVisivel = false" />
          <Button
            :label="modoEdicaoId ? 'Salvar alterações' : 'Criar usuário'"
            :loading="salvando"
            class="!bg-[#67cec7] !text-[#0f1618] !font-bold !border-0 hover:!bg-[#7ad8d2]"
            @click="salvarUsuario"
          />
        </div>
      </template>
    </Dialog>
  </ClimbePageWrapper>
</template>

<style scoped>
.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(95, 194, 186, 0.26);
  background: #101718;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.metric-icon {
  font-size: 1.8rem;
  line-height: 1;
}
.metric-label {
  margin: 0 0 2px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7ba8b4;
  font-weight: 700;
}
.metric-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 900;
  color: #f0fbff;
  line-height: 1;
}

.avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #5fc2ba, #3e8882);
  color: #0f1618;
  font-size: 0.7rem;
  font-weight: 900;
  flex-shrink: 0;
}

.badge-admin {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 800;
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}
.badge-user {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 800;
  background: rgba(95, 194, 186, 0.12);
  color: #67cec7;
  border: 1px solid rgba(95, 194, 186, 0.25);
}

.filter-select {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(95, 194, 186, 0.25);
  background: #182225;
  color: #eef8fb;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.filter-select:focus {
  border-color: #5fc2ba;
}

:deep(.filter-input .p-inputtext) {
  background: #182225 !important;
  border-color: rgba(95, 194, 186, 0.25) !important;
  color: #eef8fb !important;
}

.field-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #b7d4de;
}

.perfil-option {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  border: 1.5px solid rgba(95, 194, 186, 0.2);
  background: #182225;
  cursor: pointer;
  transition: all 0.2s;
  color: #eef8fb;
}
.perfil-option:hover {
  border-color: rgba(95, 194, 186, 0.5);
}
.perfil-option--selected {
  border-color: #5fc2ba;
  background: rgba(95, 194, 186, 0.1);
}

/* DataTable overrides */
:deep(.usuarios-table.p-datatable) {
  border: 1px solid rgba(95, 194, 186, 0.28);
  border-radius: 10px;
  overflow: hidden;
  background: #121a1b;
}
:deep(.usuarios-table .p-datatable-thead > tr > th) {
  background: #182225;
  color: #b7d4de;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.95rem 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.2);
}
:deep(.usuarios-table .p-datatable-tbody > tr) {
  background: #101718;
  color: #eef8fb;
}
:deep(.usuarios-table .p-datatable-tbody > tr:nth-child(even)) {
  background: #131d1f;
}
:deep(.usuarios-table .p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.12);
}
:deep(.usuarios-table .p-paginator) {
  background: transparent;
  border-top: 1px solid rgba(95, 194, 186, 0.18);
  padding: 0.8rem 0.6rem 0.4rem;
}
:deep(.usuarios-table .p-paginator .p-paginator-page),
:deep(.usuarios-table .p-paginator .p-paginator-prev),
:deep(.usuarios-table .p-paginator .p-paginator-next) {
  min-width: 2rem;
  height: 2rem;
  border-radius: 8px;
  color: #a9c8d1;
}
:deep(.usuarios-table .p-paginator .p-paginator-page.p-paginator-page-selected) {
  background: #67cec7;
  color: #0f1618;
  font-weight: 800;
}
:deep(.status-pill.p-tag) {
  border-radius: 9999px;
  padding: 0.18rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
:deep(.acao-editar.p-button) { color: #daf6ff; }
:deep(.acao-editar.p-button:hover) { background: rgba(95, 194, 186, 0.14); }
:deep(.acao-toggle-off.p-button) { color: #f6a0a0; }
:deep(.acao-toggle-off.p-button:hover) { background: rgba(243, 114, 114, 0.14); }
:deep(.acao-toggle-on.p-button) { color: #86efac; }
:deep(.acao-toggle-on.p-button:hover) { background: rgba(134, 239, 172, 0.14); }
:deep(.acao-excluir.p-button) { color: #f6a0a0; }
:deep(.acao-excluir.p-button:hover) { background: rgba(243, 114, 114, 0.16); }
</style>
