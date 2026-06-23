<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useUsuariosStore } from '@/stores/usuariosStore'
import * as usuariosService from '@/services/usuariosService'

const route = useRoute()
const router = useRouter()
const usuariosStore = useUsuariosStore()

const isEditMode = computed(() => !!route.params.id)
const salvando = ref(false)
const carregando = ref(false)
const mensagemErro = ref('')

const formulario = reactive({
  nome_completo: '',
  email: '',
  cpf: '',
  senha: '',
  contato: '',
  cargo_id: '',
  papel: 'analista',
  situacao: 'ativo'
})

const erros = reactive({})

function limparErros() {
  Object.keys(erros).forEach(k => delete erros[k])
}

function aplicarMascaraCpf(event) {
  let valor = event.target.value.replace(/\D/g, '')
  if (valor.length > 11) valor = valor.slice(0, 11)
  
  if (valor.length > 9) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (valor.length > 6) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
  } else if (valor.length > 3) {
    valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2')
  }
  
  formulario.cpf = valor
}

function validarFormulario() {
  limparErros()
  if (!formulario.nome_completo.trim()) erros.nome_completo = 'Nome é obrigatório.'
  if (!formulario.contato.trim()) erros.contato = 'Contato é obrigatório.'
  
  if (!isEditMode.value) {
    if (!formulario.email.trim()) {
      erros.email = 'E-mail é obrigatório.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
      erros.email = 'E-mail inválido.'
    }
    if (!formulario.cpf) {
      erros.cpf = 'CPF é obrigatório.'
    } else if (formulario.cpf.replace(/\D/g, '').length !== 11) {
      erros.cpf = 'CPF incompleto.'
    }
    if (!formulario.senha || formulario.senha.length < 6) {
      erros.senha = 'Senha de no mínimo 6 caracteres.'
    }
  }
  
  if (!formulario.cargo_id) erros.cargo_id = 'Cargo é obrigatório.'
  if (!formulario.papel || !['admin', 'analista'].includes(formulario.papel)) {
    erros.papel = 'Selecione um papel válido.'
  }
  
  return Object.keys(erros).length === 0
}

async function salvar() {
  if (!validarFormulario()) return
  salvando.value = true
  mensagemErro.value = ''
  
  try {
    if (isEditMode.value) {
      await usuariosStore.atualizarUsuario(route.params.id, { ...formulario })
    } else {
      await usuariosStore.criarUsuario({ ...formulario })
    }
    
    router.push('/usuarios')
  } catch (error) {
    mensagemErro.value = error.message || 'Erro ao salvar o usuário.'
  } finally {
    salvando.value = false
  }
}

function cancelar() {
  router.push('/usuarios')
}

onMounted(async () => {
  carregando.value = true
  try {
    const promises = []
    if (usuariosStore.cargos.length === 0) {
      promises.push(usuariosStore.carregarDados())
    }
    
    if (isEditMode.value) {
      promises.push(usuariosService.obterUsuario(route.params.id))
    }
    
    const results = await Promise.all(promises)
    
    if (isEditMode.value) {
      const usuarioData = results[results.length - 1]
      formulario.nome_completo = usuarioData.nome_completo
      formulario.email = usuarioData.email
      formulario.cpf = usuarioData.cpf || ''
      formulario.senha = ''
      formulario.contato = usuarioData.contato || ''
      formulario.cargo_id = usuarioData.cargo_id
      formulario.papel = ['admin', 'analista'].includes(usuarioData.papel) ? usuarioData.papel : ''
      formulario.situacao = usuarioData.situacao
      
      if (!['admin', 'analista'].includes(usuarioData.papel)) {
        mensagemErro.value = 'Atenção: O usuário possui um papel não suportado. Selecione Administrador ou Analista antes de salvar.'
      }
    }
  } catch (error) {
    mensagemErro.value = error.message || 'Erro ao carregar dados do usuário.'
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <ClimbePageWrapper :title="isEditMode ? 'Editar Usuário' : 'Novo Usuário'" active-tab="users" @navigate="id => router.push(`/${id === 'users' ? 'usuarios' : id}`)">
    <div class="flex flex-col gap-6 max-w-4xl mx-auto">
      
      <div class="flex flex-col gap-2 border-b border-[#5fc2ba2e] pb-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Button icon="pi pi-arrow-left" text rounded class="!text-white hover:!bg-white/10" @click="cancelar" />
            <h1 class="m-0 text-[2rem] font-black text-white">{{ isEditMode ? 'Editar Usuário' : 'Novo Usuário' }}</h1>
          </div>
        </div>
        <p class="text-climbe-text-muted ml-12">{{ isEditMode ? 'Altere as informações deste usuário.' : 'Preencha as informações para criar um novo acesso.' }}</p>
      </div>

      <div v-if="mensagemErro" class="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {{ mensagemErro }}
      </div>
      
      <div v-if="carregando" class="flex items-center justify-center p-12">
        <i class="pi pi-spinner pi-spin text-3xl text-climbe-primary"></i>
      </div>

      <section v-else class="rounded-xl border border-[#5fc2ba42] bg-[#101718] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-1">
            <label class="field-label">Nome completo</label>
            <InputText id="nome_completo" v-model="formulario.nome_completo" placeholder="Ex: João da Silva" />
            <small v-if="erros.nome_completo" class="text-red-400">{{ erros.nome_completo }}</small>
          </div>

          <div class="flex flex-col gap-1" v-if="!isEditMode">
            <label class="field-label">E-mail</label>
            <InputText id="email_usuario" v-model="formulario.email" type="email" placeholder="Ex: joao@climbe.com" />
            <small v-if="erros.email" class="text-red-400">{{ erros.email }}</small>
          </div>

          <div class="flex flex-col gap-1" v-if="!isEditMode">
            <label class="field-label">CPF</label>
            <InputText id="cpf_usuario" v-model="formulario.cpf" placeholder="000.000.000-00" @input="aplicarMascaraCpf" />
            <small v-if="erros.cpf" class="text-red-400">{{ erros.cpf }}</small>
          </div>
          
          <div class="flex flex-col gap-1" v-if="!isEditMode">
            <label class="field-label">Senha</label>
            <InputText id="senha_usuario" v-model="formulario.senha" type="password" placeholder="Min. 6 caracteres" />
            <small v-if="erros.senha" class="text-red-400">{{ erros.senha }}</small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="field-label">Contato *</label>
            <InputText id="contato_usuario" v-model="formulario.contato" placeholder="Ex: (11) 99999-9999" />
            <small v-if="erros.contato" class="text-red-400">{{ erros.contato }}</small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="field-label">Cargo</label>
            <select v-model="formulario.cargo_id" class="filter-select !bg-[#182225] !border-[#5fc2ba40]">
              <option value="" disabled>Selecione um cargo</option>
              <option v-for="cargo in usuariosStore.cargos" :key="cargo.id_cargo" :value="cargo.id_cargo">
                {{ cargo.nome_cargo }}
              </option>
            </select>
            <small v-if="erros.cargo_id" class="text-red-400">{{ erros.cargo_id }}</small>
          </div>

          <div class="flex flex-col gap-1 md:col-span-2">
            <label class="field-label">Perfil de acesso</label>
            <div class="flex gap-3 max-w-lg">
              <label class="perfil-option" :class="{ 'perfil-option--selected': formulario.papel === 'analista' }">
                <input type="radio" v-model="formulario.papel" value="analista" class="sr-only" />
                <span class="text-lg">📈</span>
                <div>
                  <p class="text-sm font-bold">Analista</p>
                </div>
              </label>
              <label class="perfil-option" :class="{ 'perfil-option--selected': formulario.papel === 'admin' }">
                <input type="radio" v-model="formulario.papel" value="admin" class="sr-only" />
                <span class="text-lg">👑</span>
                <div>
                  <p class="text-sm font-bold">Administrador</p>
                </div>
              </label>
            </div>
            <small v-if="erros.papel" class="text-red-400 mt-1">{{ erros.papel }}</small>
          </div>

        </div>

        <div class="mt-8 flex items-center justify-end gap-3 border-t border-[#5fc2ba2e] pt-6">
          <Button label="Cancelar" text class="!text-white" @click="cancelar" />
          <Button
            :label="isEditMode ? 'Atualizar usuário' : 'Salvar usuário'"
            :loading="salvando"
            class="!bg-[#67cec7] !text-[#0f1618] !font-bold !border-0 hover:!bg-[#7ad8d2]"
            @click="salvar"
          />
        </div>
      </section>

    </div>
  </ClimbePageWrapper>
</template>

<style scoped>
.field-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #b7d4de;
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

:deep(.p-inputtext) {
  background: #182225 !important;
  border-color: rgba(95, 194, 186, 0.25) !important;
  color: #eef8fb !important;
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
</style>
