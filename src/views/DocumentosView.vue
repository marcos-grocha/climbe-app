<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { useDocumentosStore } from '@/stores/documentosStore'

const documentosStore = useDocumentosStore()
const router = useRouter()

const carregando = ref(false)
const mostrarModal = ref(false)
const mensagemSucesso = ref('')
const mensagemErro = ref('')

const novoDocumento = ref({
  nome: '',
  tipo: 'PDF',
  tamanho: '',
  contrato: '',
  empresa: '',
  enviado_por: 'admin@climbe.com',
})

const statusClass = (status) => {
  if (status === 'aprovado')
    return 'text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
  if (status === 'pendente')
    return 'text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
  return 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const pendentesCount = computed(() => {
  return documentosStore.documentos.filter(d => d.status === 'pendente').length
})

const irParaValidacao = () => {
  router.push('/documentos/validar')
}

const carregarDocumentos = async () => {
  carregando.value = true
  mensagemErro.value = ''
  try {
    await documentosStore.carregarDocumentos()
  } catch (err) {
    mensagemErro.value = err.message || 'Erro ao carregar documentos'
  } finally {
    carregando.value = false
  }
}

const salvarDocumento = async () => {
  mensagemSucesso.value = ''
  mensagemErro.value = ''
  try {
    await documentosStore.enviarDocumento(novoDocumento.value)
    mensagemSucesso.value = 'Documento enviado com sucesso.'
    mostrarModal.value = false
    novoDocumento.value = {
      nome: '',
      tipo: 'PDF',
      tamanho: '',
      contrato: '',
      empresa: '',
      enviado_por: 'admin@climbe.com',
    }
  } catch (err) {
    mensagemErro.value = err.message || 'Erro ao enviar documento'
  }
}

const removerDocumento = async (doc) => {
  const confirm = window.confirm(`Tem certeza que deseja excluir o documento ${doc.nome}?`)
  if (!confirm) return
  
  mensagemSucesso.value = ''
  mensagemErro.value = ''
  try {
    await documentosStore.excluirDocumento(doc.id)
    mensagemSucesso.value = 'Documento excluído com sucesso.'
  } catch (err) {
    mensagemErro.value = err.message || 'Erro ao excluir documento'
  }
}

onMounted(carregarDocumentos)
</script>

<template>
  <ClimbePageWrapper title="Documentos" active-tab="documents">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-climbe-text-main font-black text-xl m-0">Documentos</h3>
      <div class="flex gap-3">
        <button
          v-if="pendentesCount > 0"
          class="border border-yellow-400 text-yellow-400 font-heavy px-4 py-2 rounded-sm text-sm hover:bg-yellow-400/10 transition-colors"
          @click="irParaValidacao"
        >
          Validar pendentes ({{ pendentesCount }})
        </button>
        <button
          class="bg-climbe-primary text-[#121312] font-heavy px-4 py-2 rounded-sm text-sm hover:bg-climbe-primary-hover transition-colors"
          @click="mostrarModal = true"
        >
          + Enviar Documento
        </button>
      </div>
    </div>

    <!-- Mensagens de Feedback -->
    <div
      v-if="mensagemErro"
      class="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 mb-6"
    >
      {{ mensagemErro }}
    </div>
    <div
      v-if="mensagemSucesso"
      class="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 mb-6"
    >
      {{ mensagemSucesso }}
    </div>

    <!-- Tabela -->
    <div
      class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md overflow-hidden"
    >
      <div v-if="carregando" class="text-center text-climbe-text-muted py-12">Carregando...</div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-climbe-neutral-border bg-climbe-neutral-mute">
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Nome
            </th>
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Tipo
            </th>
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Empresa
            </th>
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Contrato
            </th>
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Enviado em
            </th>
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Status
            </th>
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="documentosStore.documentos.length === 0">
            <td colspan="7" class="text-center text-climbe-text-muted py-6">
              Nenhum documento encontrado.
            </td>
          </tr>
          <tr
            v-else
            v-for="doc in documentosStore.documentos"
            :key="doc.id"
            class="border-b border-climbe-neutral-border hover:bg-climbe-primary-light transition-colors"
          >
            <td class="px-4 py-3 text-climbe-text-main font-heavy">{{ doc.nome }}</td>
            <td class="px-4 py-3">
              <span
                class="text-climbe-primary text-xs font-heavy bg-climbe-primary/10 px-2 py-0.5 rounded"
                >{{ doc.tipo }}</span
              >
            </td>
            <td class="px-4 py-3 text-climbe-text-muted">{{ doc.empresa }}</td>
            <td class="px-4 py-3 text-climbe-text-muted">{{ doc.contrato }}</td>
            <td class="px-4 py-3 text-climbe-text-muted">{{ formatarData(doc.enviado_em) }}</td>
            <td class="px-4 py-3">
              <span :class="statusClass(doc.status)">{{ doc.status }}</span>
            </td>
            <td class="px-4 py-3 flex gap-3">
              <button
                v-if="doc.status === 'pendente'"
                class="text-yellow-400 text-xs hover:underline font-heavy"
                @click="irParaValidacao"
              >
                Validar
              </button>
              <button
                v-if="doc.status !== 'aprovado'"
                class="text-red-400 text-xs hover:underline font-heavy"
                @click="removerDocumento(doc)"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Upload -->
    <div
      v-if="mostrarModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="mostrarModal = false"
    >
      <div
        class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md p-6 w-full max-w-md"
      >
        <h4 class="text-climbe-text-main font-black text-lg mb-4">Enviar Documento</h4>

        <div class="flex flex-col gap-3">
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Nome do arquivo</label>
            <input
              v-model="novoDocumento.nome"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-sm px-3 py-2 text-sm outline-none focus:border-climbe-primary"
              placeholder="ex: Contrato Assinado.pdf"
            />
          </div>
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Tipo</label>
            <select
              v-model="novoDocumento.tipo"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-sm px-3 py-2 text-sm outline-none focus:border-climbe-primary"
            >
              <option>PDF</option>
              <option>XLSX</option>
              <option>DOCX</option>
              <option>IMG</option>
            </select>
          </div>
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Empresa</label>
            <input
              v-model="novoDocumento.empresa"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-sm px-3 py-2 text-sm outline-none focus:border-climbe-primary"
              placeholder="ex: XP Investimentos"
            />
          </div>
          <div>
            <label class="text-climbe-text-muted text-xs mb-1 block">Contrato</label>
            <input
              v-model="novoDocumento.contrato"
              class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-sm px-3 py-2 text-sm outline-none focus:border-climbe-primary"
              placeholder="ex: Contrato #1042"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            class="border border-climbe-neutral-border text-climbe-text-muted px-4 py-2 rounded-sm text-sm hover:border-climbe-primary hover:text-climbe-primary transition-colors"
            @click="mostrarModal = false"
          >
            Cancelar
          </button>
          <button
            class="bg-climbe-primary text-[#121312] font-heavy px-4 py-2 rounded-sm text-sm hover:bg-climbe-primary-hover transition-colors"
            @click="salvarDocumento"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  </ClimbePageWrapper>
</template>
