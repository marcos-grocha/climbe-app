<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useUsuariosStore } from '@/stores/usuariosStore'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const usuariosStore = useUsuariosStore()
const authStore = useAuthStore()

const activeTab = ref('users')
const mensagemErro = ref('')
const mensagemSucesso = ref('')
const filtroPapel = ref('')
const filtroSituacao = ref('')

const usuariosFiltrados = computed(() => {
  return usuariosStore.usuarios.filter((u) => {
    const matchPapel = !filtroPapel.value || u.papel === filtroPapel.value
    const matchSituacao = !filtroSituacao.value || u.situacao === filtroSituacao.value
    return matchPapel && matchSituacao
  })
})

// Funções de form migradas para UsuarioFormView

function abrirCriacao() {
  router.push('/usuarios/novo')
}

function abrirEdicao(usuario) {
  router.push(`/usuarios/${usuario.id}/editar`)
}

async function alternarStatus(usuario) {
  if (usuario.id === authStore.user?.id_usuario) {
    mensagemErro.value = 'Você não pode inativar a própria conta.'
    return
  }
  try {
    const isAtivando = usuario.situacao === 'inativo'
    await usuariosStore.toggleStatus(usuario.id)
    mensagemSucesso.value = `Usuário ${isAtivando ? 'reativado' : 'inativado'} com sucesso.`
    setTimeout(() => { mensagemSucesso.value = '' }, 3000)
  } catch (err) {
    mensagemErro.value = err.message || 'Erro ao alterar o status do usuário.'
  }
}

// Exclusão removida, status agora faz inativação

function limparFiltros() {
  filtroPapel.value = ''
  filtroSituacao.value = ''
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
    await usuariosStore.carregarDados()
  } catch (err) {
    mensagemErro.value = err.message || 'Não foi possível carregar os usuários.'
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
            <p class="metric-label">Analistas</p>
            <p class="metric-value">{{ usuariosStore.totalAnalistas }}</p>
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
        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-[#b7d4de]">Perfil</label>
            <select v-model="filtroPapel" class="filter-select">
              <option value="">Todos os papéis</option>
              <option value="admin">Administrador</option>
              <option value="analista">Analista</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-[#b7d4de]">Status</label>
            <select v-model="filtroSituacao" class="filter-select">
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

          <Column header="Cargo">
            <template #body="{ data }">
              {{ usuariosStore.getNomeCargo(data.cargo_id) }}
            </template>
          </Column>

          <!-- Perfil -->
          <Column header="Perfil">
            <template #body="{ data }">
              <span v-if="data.papel === 'admin'" class="badge-admin">
                ADMINISTRADOR
              </span>
              <span v-else-if="data.papel === 'analista'" class="badge-user">
                ANALISTA
              </span>
              <span v-else class="rounded-full bg-gray-500/20 px-2 py-1 text-[0.7rem] uppercase font-bold text-gray-400 border border-gray-500/30">
                Papel não suportado
              </span>
            </template>
          </Column>

          <!-- Status -->
          <Column header="Status">
            <template #body="{ data }">
              <Tag
                :value="data.situacao === 'ativo' ? 'Ativo' : 'Inativo'"
                :severity="data.situacao === 'ativo' ? 'success' : 'secondary'"
                class="status-pill"
              />
            </template>
          </Column>

          <Column field="contato" header="Contato" />

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
                  :icon="data.situacao === 'ativo' ? 'pi pi-ban' : 'pi pi-check-circle'"
                  size="small"
                  text
                  :title="data.situacao === 'ativo' ? 'Inativar usuário' : 'Reativar usuário'"
                  :class="data.situacao === 'ativo' ? 'acao-toggle-off' : 'acao-toggle-on'"
                  :disabled="data.id === authStore.user?.id_usuario"
                  @click="alternarStatus(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </section>
    </div>

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
