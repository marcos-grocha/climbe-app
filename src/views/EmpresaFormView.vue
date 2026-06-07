<script setup>
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useEmpresasStore } from '@/stores/empresasStore'
import { apenasNumeros, validarCnpj, validarEmail } from '@/utils/validadores'

const router = useRouter()
const route = useRoute()
const empresasStore = useEmpresasStore()

const empresaSelecionada = ref(criarEmpresaVazia())
const erros = reactive({})
const salvando = ref(false)
const mensagemErro = ref('')
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

const modoEdicao = computed(() => Boolean(route.params.id))
const tituloPagina = computed(() => (modoEdicao.value ? 'Editar empresa' : 'Nova empresa'))
const textoBotaoSalvar = computed(() => (modoEdicao.value ? 'Salvar alterações' : 'Cadastrar'))

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
      bairro: '',
      cidade: '',
      estado: '',
    },
    representante_legal: {
      nome: '',
      cpf: '',
      telefone: '',
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

function navegarParaEmpresas() {
  router.push('/empresas')
}

function navegarPeloMenu(itemId) {
  if (itemId === 'empresas') {
    navegarParaEmpresas()
    return
  }
  if (itemId === 'dashboard' || itemId === 'contracts') {
    router.push('/')
    return
  }
  router.push('/')
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
  if (!empresa.representante_legal.telefone.trim())
    erros.representante_telefone = 'Telefone do representante é obrigatório.'

  return Object.keys(erros).length === 0
}

async function salvarEmpresa() {
  mensagemErro.value = ''
  if (!validarFormulario()) return

  salvando.value = true
  try {
    const payload = clonarObjeto(empresaSelecionada.value)
    payload.cnpj = apenasNumeros(payload.cnpj)

    if (modoEdicao.value) {
      await empresasStore.atualizarEmpresa(route.params.id, payload)
      router.push('/empresas?sucesso=atualizado')
    } else {
      await empresasStore.criarEmpresa(payload)
      router.push('/empresas?sucesso=criado')
    }
  } catch (error) {
    mensagemErro.value = error?.message || 'Não foi possível salvar a empresa.'
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  if (modoEdicao.value) {
    try {
      const empresa = await empresasStore.buscarEmpresaPorId(route.params.id)
      empresaSelecionada.value = clonarObjeto(empresa)
    } catch (error) {
      mensagemErro.value = error?.message || 'Não foi possível carregar a empresa.'
    }
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
          <h1 class="mb-1 text-[2rem] font-black text-white">{{ tituloPagina }}</h1>
          <p class="text-climbe-text-muted">Preencha os dados abaixo para salvar a empresa.</p>
        </div>
        <Button
          label="Voltar"
          icon="pi pi-arrow-left"
          class="!h-12 !rounded-md !border-0 !bg-[#1c282b] !px-6 !font-bold !text-[#a9c8d1] hover:!bg-[#2a3c40]"
          @click="navegarParaEmpresas"
        />
      </div>

      <div
        v-if="mensagemErro"
        class="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      >
        {{ mensagemErro }}
      </div>
      
      <div v-if="empresasStore.carregando && modoEdicao" class="text-center py-10 text-climbe-text-muted">
        Carregando dados da empresa...
      </div>

      <section
        v-else
        class="rounded-xl border border-[#5fc2ba42] bg-[#101718] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:p-6"
      >
        <div class="grid grid-cols-1 gap-8">
          <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <h3 class="m-0 md:col-span-2 text-lg font-semibold border-b border-[#5fc2ba24] pb-2 mb-2">Dados da empresa</h3>

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
            <h3 class="m-0 md:col-span-2 text-lg font-semibold border-b border-[#5fc2ba24] pb-2 mb-2 mt-4">Endereço</h3>

            <div class="flex flex-col gap-2">
              <label for="cep">CEP</label>
              <InputText id="cep" v-model="empresaSelecionada.endereco.cep" />
              <small v-if="erros.endereco_cep" class="text-red-400">{{ erros.endereco_cep }}</small>
            </div>

            <div class="flex flex-col gap-2">
              <label for="logradouro">Logradouro</label>
              <InputText id="logradouro" v-model="empresaSelecionada.endereco.logradouro" />
              <small v-if="erros.endereco_logradouro" class="text-red-400">{{ erros.endereco_logradouro }}</small>
            </div>

            <div class="flex flex-col gap-2">
              <label for="numero">Número</label>
              <InputText id="numero" v-model="empresaSelecionada.endereco.numero" />
              <small v-if="erros.endereco_numero" class="text-red-400">{{ erros.endereco_numero }}</small>
            </div>

            <div class="flex flex-col gap-2">
              <label for="bairro">Bairro</label>
              <InputText id="bairro" v-model="empresaSelecionada.endereco.bairro" />
              <small v-if="erros.endereco_bairro" class="text-red-400">{{ erros.endereco_bairro }}</small>
            </div>

            <div class="flex flex-col gap-2">
              <label for="cidade">Cidade</label>
              <InputText id="cidade" v-model="empresaSelecionada.endereco.cidade" />
              <small v-if="erros.endereco_cidade" class="text-red-400">{{ erros.endereco_cidade }}</small>
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
              <small v-if="erros.endereco_estado" class="text-red-400">{{ erros.endereco_estado }}</small>
            </div>
          </section>

          <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <h3 class="m-0 md:col-span-2 text-lg font-semibold border-b border-[#5fc2ba24] pb-2 mb-2 mt-4">Representante legal</h3>

            <div class="flex flex-col gap-2">
              <label for="representante_nome">Nome</label>
              <InputText
                id="representante_nome"
                v-model="empresaSelecionada.representante_legal.nome"
              />
              <small v-if="erros.representante_nome" class="text-red-400">{{ erros.representante_nome }}</small>
            </div>

            <div class="flex flex-col gap-2">
              <label for="representante_cpf">CPF</label>
              <InputText
                id="representante_cpf"
                v-model="empresaSelecionada.representante_legal.cpf"
              />
              <small v-if="erros.representante_cpf" class="text-red-400">{{ erros.representante_cpf }}</small>
            </div>

            <div class="flex flex-col gap-2">
              <label for="representante_telefone">Telefone</label>
              <InputText
                id="representante_telefone"
                v-model="empresaSelecionada.representante_legal.telefone"
              />
              <small v-if="erros.representante_telefone" class="text-red-400">{{ erros.representante_telefone }}</small>
            </div>
          </section>
        </div>

        <div class="mt-8 flex items-center justify-end gap-3 border-t border-[#5fc2ba24] pt-5">
          <Button label="Cancelar" text @click="navegarParaEmpresas" class="!font-bold" />
          <Button :label="textoBotaoSalvar" :loading="salvando" @click="salvarEmpresa" class="!bg-[#67cec7] !text-[#0f1618] hover:!bg-[#7ad8d2] !border-0 !font-bold !px-6" />
        </div>
      </section>
    </div>
  </ClimbePageWrapper>
</template>
