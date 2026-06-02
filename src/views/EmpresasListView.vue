<script setup>
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useEmpresasStore } from '@/stores/empresasStore'
import { apenasNumeros, validarCnpj, validarEmail } from '@/utils/validadores'

const router = useRouter()
const empresasStore = useEmpresasStore()

const dialogVisivel = ref(false)
const empresaSelecionada = ref(criarEmpresaVazia())
const erros = reactive({})
const salvando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')
const activeTab = ref('empresas')

const estados = [
  { label: 'AC', value: 'AC' },
  { label: 'AL', value: 'AL' },
  { label: 'AP', value: 'AP' },
  { label: 'AM', value: 'AM' },
  { label: 'BA', value: 'BA' },
  { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' },
  { label: 'ES', value: 'ES' },
  { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' },
  { label: 'MT', value: 'MT' },
  { label: 'MS', value: 'MS' },
  { label: 'MG', value: 'MG' },
  { label: 'PA', value: 'PA' },
  { label: 'PB', value: 'PB' },
  { label: 'PR', value: 'PR' },
  { label: 'PE', value: 'PE' },
  { label: 'PI', value: 'PI' },
  { label: 'RJ', value: 'RJ' },
  { label: 'RN', value: 'RN' },
  { label: 'RS', value: 'RS' },
  { label: 'RO', value: 'RO' },
  { label: 'RR', value: 'RR' },
  { label: 'SC', value: 'SC' },
  { label: 'SP', value: 'SP' },
  { label: 'SE', value: 'SE' },
  { label: 'TO', value: 'TO' },
]

const modoEdicao = computed(() => Boolean(empresaSelecionada.value.id))
const tituloDialog = computed(() => (modoEdicao.value ? 'Editar empresa' : 'Nova empresa'))
const textoBotaoSalvar = computed(() => (modoEdicao.value ? 'Salvar alterações' : 'Cadastrar'))
const tituloPagina = computed(() => 'Empresas')

function criarEmpresaVazia() {
  return {
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    },
    representante_legal: {
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      cargo: '',
    },
  }
}

function clonarObjeto(valor) {
  return JSON.parse(JSON.stringify(toRaw(valor)))
}

function limparErros() {
  Object.keys(erros).forEach((chave) => {
    delete erros[chave]
  })
}

function abrirCriacao() {
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  limparErros()
  empresaSelecionada.value = criarEmpresaVazia()
  dialogVisivel.value = true
}

function abrirEdicao(empresa) {
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  limparErros()
  empresaSelecionada.value = clonarObjeto(empresa)
  dialogVisivel.value = true
}

function fecharDialog() {
  dialogVisivel.value = false
  limparErros()
}

function validarFormulario() {
  limparErros()
  const empresa = empresaSelecionada.value

  if (!empresa.razao_social.trim()) erros.razao_social = 'Razão social é obrigatória.'
  if (!empresa.nome_fantasia.trim()) erros.nome_fantasia = 'Nome fantasia é obrigatório.'
  if (!empresa.cnpj.trim()) {
    erros.cnpj = 'CNPJ é obrigatório.'
  } else if (!validarCnpj(empresa.cnpj)) {
    erros.cnpj = 'CNPJ inválido.'
  }
  if (!empresa.email.trim()) {
    erros.email = 'E-mail é obrigatório.'
  } else if (!validarEmail(empresa.email)) {
    erros.email = 'E-mail inválido.'
  }
  if (!empresa.telefone.trim()) erros.telefone = 'Telefone é obrigatório.'
  if (!empresa.endereco.cep.trim()) erros.endereco_cep = 'CEP é obrigatório.'
  if (!empresa.endereco.logradouro.trim()) erros.endereco_logradouro = 'Logradouro é obrigatório.'
  if (!empresa.endereco.numero.trim()) erros.endereco_numero = 'Número é obrigatório.'
  if (!empresa.endereco.bairro.trim()) erros.endereco_bairro = 'Bairro é obrigatório.'
  if (!empresa.endereco.cidade.trim()) erros.endereco_cidade = 'Cidade é obrigatória.'
  if (!empresa.endereco.estado.trim()) erros.endereco_estado = 'Estado é obrigatório.'
  if (!empresa.representante_legal.nome.trim())
    erros.representante_nome = 'Nome do representante é obrigatório.'
  if (!empresa.representante_legal.cpf.trim())
    erros.representante_cpf = 'CPF do representante é obrigatório.'
  if (!empresa.representante_legal.email.trim()) {
    erros.representante_email = 'E-mail do representante é obrigatório.'
  } else if (!validarEmail(empresa.representante_legal.email)) {
    erros.representante_email = 'E-mail do representante é inválido.'
  }
  if (!empresa.representante_legal.telefone.trim())
    erros.representante_telefone = 'Telefone do representante é obrigatório.'
  if (!empresa.representante_legal.cargo.trim())
    erros.representante_cargo = 'Cargo do representante é obrigatório.'

  return Object.keys(erros).length === 0
}

async function salvarEmpresa() {
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  if (!validarFormulario()) return

  salvando.value = true
  try {
    const payload = clonarObjeto(empresaSelecionada.value)
    payload.cnpj = apenasNumeros(payload.cnpj)

    if (modoEdicao.value) {
      await empresasStore.atualizarEmpresa(empresaSelecionada.value.id, payload)
      mensagemSucesso.value = 'Empresa atualizada com sucesso.'
    } else {
      await empresasStore.criarEmpresa(payload)
      mensagemSucesso.value = 'Empresa cadastrada com sucesso.'
    }
    fecharDialog()
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível salvar a empresa.'
  } finally {
    salvando.value = false
  }
}

function confirmarExclusao(empresa) {
  const confirmou = window.confirm(`Deseja realmente excluir a empresa "${empresa.nome_fantasia}"?`)
  if (!confirmou) return
  excluirEmpresaSelecionada(empresa)
}

async function excluirEmpresaSelecionada(empresa) {
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  try {
    await empresasStore.excluirEmpresa(empresa.id)
    mensagemSucesso.value = 'Empresa excluída com sucesso.'
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível excluir a empresa.'
  }
}

function formatarCnpj(cnpj) {
  const valor = apenasNumeros(cnpj)
  if (valor.length !== 14) return cnpj
  return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

function formatarCidadeUf(empresa) {
  if (!empresa.endereco?.cidade || !empresa.endereco?.estado) return '-'
  return `${empresa.endereco.cidade}/${empresa.endereco.estado}`
}

function navegarPeloMenu(itemId) {
  if (itemId === 'empresas') {
    router.push('/empresas')
    return
  }
  if (itemId === 'dashboard' || itemId === 'contracts') {
    router.push('/')
    return
  }
  router.push('/')
}

onMounted(async () => {
  try {
    await empresasStore.carregarEmpresas()
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível carregar as empresas.'
  }
})
</script>

<template>
  <ClimbePageWrapper :title="tituloPagina" :active-tab="activeTab" @navigate="navegarPeloMenu">
    <div class="flex flex-col gap-6">
      <div
        class="flex flex-col gap-3 border-b border-[#5fc2ba2e] pb-5 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="mb-1 text-[2rem] font-black text-white">Empresas</h1>
          <p class="text-climbe-text-muted">Gerencie as empresas cadastradas na plataforma.</p>
        </div>
        <Button
          label="Nova empresa"
          icon="pi pi-plus"
          class="!h-12 !rounded-md !border-0 !bg-[#67cec7] !px-6 !font-bold !text-[#0f1618] hover:!bg-[#7ad8d2]"
          @click="abrirCriacao"
        />
      </div>

      <div
        v-if="mensagemErro"
        class="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      >
        {{ mensagemErro }}
      </div>
      <div
        v-if="mensagemSucesso"
        class="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
      >
        {{ mensagemSucesso }}
      </div>

      <section
        class="rounded-xl border border-[#5fc2ba42] bg-[#101718] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:p-6"
      >
        <div class="mb-4 border-b border-[#5fc2ba24] pb-4">
          <h2 class="m-0 text-xl font-extrabold text-[#f0fbff]">Empresas cadastradas</h2>
        </div>

        <DataTable
          :value="empresasStore.empresas"
          dataKey="id"
          :loading="empresasStore.carregando"
          stripedRows
          paginator
          :rows="8"
          tableStyle="min-width: 70rem"
          class="empresas-table"
        >
          <template #empty> Nenhuma empresa cadastrada. </template>
          <Column field="nome_fantasia" header="Nome fantasia" />
          <Column field="razao_social" header="Razão social" />
          <Column header="CNPJ">
            <template #body="{ data }">
              {{ formatarCnpj(data.cnpj) }}
            </template>
          </Column>
          <Column field="email" header="E-mail" />
          <Column header="Cidade/UF">
            <template #body="{ data }">
              {{ formatarCidadeUf(data) }}
            </template>
          </Column>
          <Column header="Status">
            <template #body="{ data }">
              <Tag
                :value="data.status"
                :severity="data.status === 'ativa' ? 'success' : 'secondary'"
                class="status-pill"
              />
            </template>
          </Column>
          <Column header="Ações">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  label="Editar"
                  size="small"
                  text
                  class="acao-editar"
                  @click="abrirEdicao(data)"
                />
                <Button
                  label="Excluir"
                  size="small"
                  severity="danger"
                  text
                  class="acao-excluir"
                  @click="confirmarExclusao(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </section>
    </div>

    <Dialog
      v-model:visible="dialogVisivel"
      modal
      :header="tituloDialog"
      :style="{ width: '64rem', maxWidth: '95vw' }"
    >
      <div class="grid grid-cols-1 gap-6">
        <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <h3 class="m-0 md:col-span-2 text-lg font-semibold">Dados da empresa</h3>

          <div class="flex flex-col gap-2">
            <label for="razao_social">Razão social</label>
            <InputText id="razao_social" v-model="empresaSelecionada.razao_social" />
            <small v-if="erros.razao_social" class="text-red-400">{{ erros.razao_social }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="nome_fantasia">Nome fantasia</label>
            <InputText id="nome_fantasia" v-model="empresaSelecionada.nome_fantasia" />
            <small v-if="erros.nome_fantasia" class="text-red-400">{{ erros.nome_fantasia }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="cnpj">CNPJ</label>
            <InputText id="cnpj" v-model="empresaSelecionada.cnpj" />
            <small v-if="erros.cnpj" class="text-red-400">{{ erros.cnpj }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="email_empresa">E-mail</label>
            <InputText id="email_empresa" v-model="empresaSelecionada.email" />
            <small v-if="erros.email" class="text-red-400">{{ erros.email }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="telefone_empresa">Telefone</label>
            <InputText id="telefone_empresa" v-model="empresaSelecionada.telefone" />
            <small v-if="erros.telefone" class="text-red-400">{{ erros.telefone }}</small>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <h3 class="m-0 md:col-span-2 text-lg font-semibold">Endereço</h3>

          <div class="flex flex-col gap-2">
            <label for="cep">CEP</label>
            <InputText id="cep" v-model="empresaSelecionada.endereco.cep" />
            <small v-if="erros.endereco_cep" class="text-red-400">{{ erros.endereco_cep }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="logradouro">Logradouro</label>
            <InputText id="logradouro" v-model="empresaSelecionada.endereco.logradouro" />
            <small v-if="erros.endereco_logradouro" class="text-red-400">{{
              erros.endereco_logradouro
            }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="numero">Número</label>
            <InputText id="numero" v-model="empresaSelecionada.endereco.numero" />
            <small v-if="erros.endereco_numero" class="text-red-400">{{
              erros.endereco_numero
            }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="complemento">Complemento</label>
            <InputText id="complemento" v-model="empresaSelecionada.endereco.complemento" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="bairro">Bairro</label>
            <InputText id="bairro" v-model="empresaSelecionada.endereco.bairro" />
            <small v-if="erros.endereco_bairro" class="text-red-400">{{
              erros.endereco_bairro
            }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="cidade">Cidade</label>
            <InputText id="cidade" v-model="empresaSelecionada.endereco.cidade" />
            <small v-if="erros.endereco_cidade" class="text-red-400">{{
              erros.endereco_cidade
            }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="estado">Estado</label>
            <Dropdown
              id="estado"
              v-model="empresaSelecionada.endereco.estado"
              :options="estados"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecione"
            />
            <small v-if="erros.endereco_estado" class="text-red-400">{{
              erros.endereco_estado
            }}</small>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <h3 class="m-0 md:col-span-2 text-lg font-semibold">Representante legal</h3>

          <div class="flex flex-col gap-2">
            <label for="representante_nome">Nome</label>
            <InputText
              id="representante_nome"
              v-model="empresaSelecionada.representante_legal.nome"
            />
            <small v-if="erros.representante_nome" class="text-red-400">{{
              erros.representante_nome
            }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="representante_cpf">CPF</label>
            <InputText
              id="representante_cpf"
              v-model="empresaSelecionada.representante_legal.cpf"
            />
            <small v-if="erros.representante_cpf" class="text-red-400">{{
              erros.representante_cpf
            }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="representante_email">E-mail</label>
            <InputText
              id="representante_email"
              v-model="empresaSelecionada.representante_legal.email"
            />
            <small v-if="erros.representante_email" class="text-red-400">{{
              erros.representante_email
            }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="representante_telefone">Telefone</label>
            <InputText
              id="representante_telefone"
              v-model="empresaSelecionada.representante_legal.telefone"
            />
            <small v-if="erros.representante_telefone" class="text-red-400">{{
              erros.representante_telefone
            }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="representante_cargo">Cargo</label>
            <InputText
              id="representante_cargo"
              v-model="empresaSelecionada.representante_legal.cargo"
            />
            <small v-if="erros.representante_cargo" class="text-red-400">{{
              erros.representante_cargo
            }}</small>
          </div>
        </section>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <Button label="Cancelar" text @click="fecharDialog" />
          <Button :label="textoBotaoSalvar" :loading="salvando" @click="salvarEmpresa" />
        </div>
      </template>
    </Dialog>
  </ClimbePageWrapper>
</template>

<style scoped>
:deep(.empresas-table.p-datatable) {
  border: 1px solid rgba(95, 194, 186, 0.28);
  border-radius: 10px;
  overflow: hidden;
  background: #121a1b;
}

:deep(.empresas-table .p-datatable-thead > tr > th) {
  background: #182225;
  color: #b7d4de;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.95rem 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.2);
}

:deep(.empresas-table .p-datatable-tbody > tr) {
  background: #101718;
  color: #eef8fb;
}

:deep(.empresas-table .p-datatable-tbody > tr:nth-child(even)) {
  background: #131d1f;
}

:deep(.empresas-table .p-datatable-tbody > tr > td) {
  padding: 1.05rem 1rem;
  border-bottom: 1px solid rgba(95, 194, 186, 0.12);
}

:deep(.empresas-table .p-paginator) {
  background: transparent;
  border-top: 1px solid rgba(95, 194, 186, 0.18);
  padding: 0.8rem 0.6rem 0.4rem;
}

:deep(.empresas-table .p-paginator .p-paginator-page),
:deep(.empresas-table .p-paginator .p-paginator-prev),
:deep(.empresas-table .p-paginator .p-paginator-next) {
  min-width: 2rem;
  height: 2rem;
  border-radius: 8px;
  color: #a9c8d1;
}

:deep(.empresas-table .p-paginator .p-paginator-page.p-paginator-page-selected) {
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

:deep(.acao-editar.p-button) {
  color: #daf6ff;
  font-weight: 700;
}

:deep(.acao-editar.p-button:hover) {
  background: rgba(95, 194, 186, 0.14);
}

:deep(.acao-excluir.p-button) {
  color: #f6a0a0;
  font-weight: 700;
}

:deep(.acao-excluir.p-button:hover) {
  background: rgba(243, 114, 114, 0.16);
}
</style>
