<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'

const route = useRoute()
const router = useRouter()

const contratos = ref([
  {
    id: 1,
    empresa: 'XP Investimentos',
    proposta: 'Proposta #2024-001',
    prazo: '31/12/2025',
    status: 'Ativo',
    descricao: 'Contrato de gestão de carteira premium para clientes institucionais.',
    documentos: [
      { id: 1, nome: 'Contrato Assinado.pdf', tipo: 'PDF' },
      { id: 2, nome: 'Anexo Técnico.pdf', tipo: 'PDF' },
    ],
  },
  {
    id: 2,
    empresa: 'BTG Pactual',
    proposta: 'Proposta #2024-002',
    prazo: '30/06/2025',
    status: 'Pendente',
    descricao: 'Contrato de assessoria financeira para fundos de renda fixa.',
    documentos: [{ id: 1, nome: 'Minuta do Contrato.pdf', tipo: 'PDF' }],
  },
  {
    id: 3,
    empresa: 'Itaú BBA',
    proposta: 'Proposta #2024-003',
    prazo: '15/03/2025',
    status: 'Encerrado',
    descricao: 'Contrato encerrado de consultoria em investimentos alternativos.',
    documentos: [],
  },
])

const contrato = computed(() => contratos.value.find((c) => c.id === Number(route.params.id)))

const statusClass = (status) => {
  if (status === 'Ativo')
    return 'text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
  if (status === 'Pendente')
    return 'text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
  return 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
}

const voltar = () => router.push('/contratos')
</script>

<template>
  <ClimbePageWrapper title="Detalhe do Contrato" active-tab="contracts">
    <div v-if="contrato">
      <!-- Botão voltar -->
      <button
        class="text-climbe-text-muted text-sm hover:text-climbe-primary transition-colors mb-6 flex items-center gap-1"
        @click="voltar"
      >
        ← Voltar para contratos
      </button>

      <!-- Cabeçalho -->
      <div class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md p-6 mb-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-climbe-text-main font-black text-xl m-0 mb-1">
              {{ contrato.empresa }}
            </h3>
            <p class="text-climbe-text-muted text-sm m-0">{{ contrato.proposta }}</p>
          </div>
          <span :class="statusClass(contrato.status)">{{ contrato.status }}</span>
        </div>
      </div>

      <!-- Detalhes -->
      <div class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md p-6 mb-4">
        <h4 class="text-climbe-text-main font-heavy text-sm uppercase text-climbe-text-muted mb-4">
          Informações
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-climbe-text-muted text-xs mb-1">Prazo</p>
            <p class="text-climbe-text-main font-heavy text-sm">{{ contrato.prazo }}</p>
          </div>
          <div>
            <p class="text-climbe-text-muted text-xs mb-1">Descrição</p>
            <p class="text-climbe-text-main text-sm">{{ contrato.descricao }}</p>
          </div>
        </div>
      </div>

      <!-- Documentos -->
      <div class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md p-6">
        <h4 class="text-climbe-text-main font-heavy text-sm uppercase text-climbe-text-muted mb-4">
          Documentos
        </h4>
        <div v-if="contrato.documentos.length > 0" class="flex flex-col gap-2">
          <div
            v-for="doc in contrato.documentos"
            :key="doc.id"
            class="flex items-center justify-between p-3 border border-climbe-neutral-border rounded-sm hover:bg-climbe-primary-light transition-colors"
          >
            <div class="flex items-center gap-2">
              <span
                class="text-climbe-primary text-xs font-heavy bg-climbe-primary/10 px-2 py-0.5 rounded"
                >{{ doc.tipo }}</span
              >
              <span class="text-climbe-text-main text-sm">{{ doc.nome }}</span>
            </div>
            <button class="text-climbe-primary text-xs hover:underline">Download</button>
          </div>
        </div>
        <p v-else class="text-climbe-text-muted text-sm">Nenhum documento anexado.</p>
      </div>
    </div>

    <div v-else class="text-climbe-text-muted text-center py-12">Contrato não encontrado.</div>
  </ClimbePageWrapper>
</template>
