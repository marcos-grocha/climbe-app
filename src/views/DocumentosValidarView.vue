<script setup>
import { ref, computed, onMounted } from 'vue'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { listarDocumentos } from '@/services/documentosService'

const documentos = ref([])
const carregando = ref(false)
const modalAberto = ref(false)
const documentoSelecionado = ref(null)
const acao = ref('')
const motivo = ref('')

const documentosPendentes = computed(() =>
  documentos.value.filter((doc) => doc.status === 'pendente'),
)

const carregarDocumentos = async () => {
  carregando.value = true
  documentos.value = await listarDocumentos()
  carregando.value = false
}

const abrirModal = (doc, acaoTipo) => {
  documentoSelecionado.value = doc
  acao.value = acaoTipo
  motivo.value = ''
  modalAberto.value = true
}

const confirmarAcao = () => {
  const indice = documentos.value.findIndex((d) => d.id === documentoSelecionado.value.id)
  if (indice !== -1) {
    documentos.value[indice].status = acao.value === 'aprovar' ? 'aprovado' : 'rejeitado'
    documentos.value[indice].motivo = motivo.value
  }
  modalAberto.value = false
  documentoSelecionado.value = null
  motivo.value = ''
}

onMounted(carregarDocumentos)
</script>

<template>
  <ClimbePageWrapper title="Validação de Documentos" active-tab="documents">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h3 class="text-climbe-text-main font-black text-xl m-0">Validação de Documentos</h3>
        <p class="text-climbe-text-muted text-sm mt-1 m-0">
          Somente analistas responsáveis podem aprovar ou reprovar documentos.
        </p>
      </div>
      <span class="bg-yellow-400/10 text-yellow-400 text-xs font-heavy px-3 py-1 rounded-full">
        {{ documentosPendentes.length }} pendente(s)
      </span>
    </div>

    <!-- Lista de pendentes -->
    <div v-if="carregando" class="text-center text-climbe-text-muted py-12">Carregando...</div>

    <div
      v-else-if="documentosPendentes.length === 0"
      class="text-center text-climbe-text-muted py-12"
    >
      Nenhum documento pendente de validação.
    </div>

    <div v-else class="flex flex-col gap-4">
      <div
        v-for="doc in documentosPendentes"
        :key="doc.id"
        class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md p-5"
      >
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <span
                class="text-climbe-primary text-xs font-heavy bg-climbe-primary/10 px-2 py-0.5 rounded"
                >{{ doc.tipo }}</span
              >
              <span class="text-climbe-text-main font-heavy text-sm">{{ doc.nome }}</span>
            </div>
            <p class="text-climbe-text-muted text-xs m-0">{{ doc.empresa }} · {{ doc.contrato }}</p>
            <p class="text-climbe-text-muted text-xs m-0">Enviado por: {{ doc.enviado_por }}</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="text-xs px-3 py-1.5 rounded-sm border border-climbe-neutral-border text-climbe-text-muted hover:border-climbe-primary hover:text-climbe-primary transition-colors"
              @click="() => {}"
            >
              Download
            </button>
            <button
              class="text-xs px-3 py-1.5 rounded-sm bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 transition-colors font-heavy"
              @click="abrirModal(doc, 'aprovar')"
            >
              Aprovar
            </button>
            <button
              class="text-xs px-3 py-1.5 rounded-sm bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400/20 transition-colors font-heavy"
              @click="abrirModal(doc, 'reprovar')"
            >
              Reprovar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal aprovar/reprovar -->
    <div
      v-if="modalAberto"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="modalAberto = false"
    >
      <div
        class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md p-6 w-full max-w-md"
      >
        <h4 class="text-climbe-text-main font-black text-lg mb-1">
          {{ acao === 'aprovar' ? 'Aprovar Documento' : 'Reprovar Documento' }}
        </h4>
        <p class="text-climbe-text-muted text-sm mb-4">{{ documentoSelecionado?.nome }}</p>

        <div>
          <label class="text-climbe-text-muted text-xs mb-1 block">
            {{
              acao === 'aprovar' ? 'Observação (opcional)' : 'Motivo da reprovação (obrigatório)'
            }}
          </label>
          <textarea
            v-model="motivo"
            rows="3"
            class="w-full bg-climbe-neutral-bg border border-climbe-neutral-border text-climbe-text-main rounded-sm px-3 py-2 text-sm outline-none focus:border-climbe-primary resize-none"
            :placeholder="
              acao === 'aprovar'
                ? 'Observações sobre o documento...'
                : 'Informe o motivo da reprovação...'
            "
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button
            class="border border-climbe-neutral-border text-climbe-text-muted px-4 py-2 rounded-sm text-sm hover:border-climbe-primary hover:text-climbe-primary transition-colors"
            @click="modalAberto = false"
          >
            Cancelar
          </button>
          <button
            class="font-heavy px-4 py-2 rounded-sm text-sm transition-colors"
            :class="
              acao === 'aprovar'
                ? 'bg-green-400/20 border border-green-400/30 text-green-400 hover:bg-green-400/30'
                : 'bg-red-400/20 border border-red-400/30 text-red-400 hover:bg-red-400/30'
            "
            @click="confirmarAcao"
          >
            {{ acao === 'aprovar' ? 'Confirmar Aprovação' : 'Confirmar Reprovação' }}
          </button>
        </div>
      </div>
    </div>
  </ClimbePageWrapper>
</template>
