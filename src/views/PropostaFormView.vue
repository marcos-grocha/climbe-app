<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useEmpresasStore } from '@/stores/empresasStore'
import { usePropostasStore } from '@/stores/propostasStore'

const route = useRoute()
const router = useRouter()
const empresasStore = useEmpresasStore()
const propostasStore = usePropostasStore()

const activeTab = ref('propostas')
const carregandoFormulario = ref(false)
const salvando = ref(false)
const mensagemErro = ref('')
const erros = reactive({})
const propostaOriginal = ref(null)

const formulario = reactive({
  empresaId: null,
})

const modoEdicao = computed(() => Boolean(route.params.id))
const tituloPagina = computed(() => (modoEdicao.value ? 'Editar proposta' : 'Nova proposta'))
const subtituloPagina = computed(() =>
  modoEdicao.value
    ? 'Atualize a empresa vinculada a esta proposta comercial.'
    : 'Cadastre uma nova proposta comercial para uma empresa contratante.',
)
const tituloCard = computed(() =>
  modoEdicao.value ? 'Dados da proposta' : 'Preencha os dados da nova proposta',
)
const textoBotaoSalvar = computed(() => (modoEdicao.value ? 'Salvar alteracoes' : 'Cadastrar'))
const opcoesEmpresas = computed(() =>
  empresasStore.empresas.map((empresa) => ({
    label: empresa.nome_fantasia,
    value: empresa.id,
  })),
)

function navegarPeloMenu(itemId) {
  if (itemId === 'propostas') {
    router.push('/propostas')
    return
  }

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

function limparErros() {
  Object.keys(erros).forEach((chave) => {
    delete erros[chave]
  })
}

function preencherFormulario(proposta) {
  formulario.empresaId = proposta.empresaId
}

function validarFormulario() {
  limparErros()

  if (!formulario.empresaId) erros.empresaId = 'Empresa e obrigatoria.'

  return Object.keys(erros).length === 0
}

async function carregarEmpresasSeNecessario() {
  if (empresasStore.empresas.length > 0) return
  await empresasStore.carregarEmpresas()
}

async function carregarPropostaSeNecessario() {
  if (!modoEdicao.value) return

  const proposta = await propostasStore.buscarPropostaPorId(route.params.id)
  propostaOriginal.value = proposta
  preencherFormulario(proposta)
}

async function salvarProposta() {
  mensagemErro.value = ''
  if (!validarFormulario()) return

  salvando.value = true

  try {
    const payload = {
      empresaId: formulario.empresaId,
    }

    if (modoEdicao.value) {
      await propostasStore.atualizarProposta(route.params.id, payload)
    } else {
      await propostasStore.criarProposta(payload)
    }

    router.push('/propostas')
  } catch (error) {
    mensagemErro.value = error?.message || 'Nao foi possivel salvar a proposta.'
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  carregandoFormulario.value = true
  mensagemErro.value = ''

  try {
    await carregarEmpresasSeNecessario()
    await carregarPropostaSeNecessario()
  } catch (error) {
    mensagemErro.value = error?.message || 'Nao foi possivel carregar o formulario.'
  } finally {
    carregandoFormulario.value = false
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
          <p class="text-climbe-text-muted">{{ subtituloPagina }}</p>
        </div>
        <Button
          label="Voltar para propostas"
          icon="pi pi-arrow-left"
          text
          class="!justify-start !px-0 !text-[#b7d4de]"
          @click="router.push('/propostas')"
        />
      </div>

      <div
        v-if="mensagemErro"
        class="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      >
        {{ mensagemErro }}
      </div>

      <section
        class="rounded-xl border border-[#5fc2ba42] bg-[#101718] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:p-6"
      >
        <div class="mb-4 border-b border-[#5fc2ba24] pb-4">
          <h2 class="m-0 text-xl font-extrabold text-[#f0fbff]">{{ tituloCard }}</h2>
        </div>

        <div v-if="carregandoFormulario" class="py-10 text-center text-sm text-climbe-text-muted">
          Carregando formulario...
        </div>

        <form v-else class="grid grid-cols-1 gap-6" @submit.prevent="salvarProposta">
          <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-2">
              <label for="empresa_id">Empresa</label>
              <Dropdown
                id="empresa_id"
                v-model="formulario.empresaId"
                :options="opcoesEmpresas"
                optionLabel="label"
                optionValue="value"
                placeholder="Selecione a empresa"
              />
              <small v-if="erros.empresaId" class="text-red-400">{{ erros.empresaId }}</small>
            </div>
          </section>

          <div class="flex items-center justify-end gap-2">
            <Button label="Cancelar" text @click="router.push('/propostas')" />
            <Button :label="textoBotaoSalvar" :loading="salvando" type="submit" />
          </div>
        </form>
      </section>
    </div>
  </ClimbePageWrapper>
</template>
