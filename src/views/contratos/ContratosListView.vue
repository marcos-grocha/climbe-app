<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'

const router = useRouter()

const contratos = ref([
  {
    id: 1,
    empresa: 'XP Investimentos',
    proposta: 'Proposta #2024-001',
    prazo: '31/12/2025',
    status: 'Ativo',
  },
  {
    id: 2,
    empresa: 'BTG Pactual',
    proposta: 'Proposta #2024-002',
    prazo: '30/06/2025',
    status: 'Pendente',
  },
  {
    id: 3,
    empresa: 'Itaú BBA',
    proposta: 'Proposta #2024-003',
    prazo: '15/03/2025',
    status: 'Encerrado',
  },
])

const statusClass = (status) => {
  if (status === 'Ativo')
    return 'text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
  if (status === 'Pendente')
    return 'text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
  return 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
}

const verDetalhe = (id) => {
  router.push(`/contratos/${id}`)
}
</script>

<template>
  <ClimbePageWrapper title="Gestão de Contratos" active-tab="contracts">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-climbe-text-main font-black text-xl m-0">Contratos</h3>
      <button
        class="bg-climbe-primary text-[#121312] font-heavy px-4 py-2 rounded-sm text-sm hover:bg-climbe-primary-hover transition-colors"
      >
        + Novo Contrato
      </button>
    </div>

    <div
      class="bg-climbe-neutral-card border border-climbe-neutral-border rounded-md overflow-hidden"
    >
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-climbe-neutral-border bg-climbe-neutral-mute">
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Empresa
            </th>
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Proposta
            </th>
            <th class="text-left px-4 py-3 text-climbe-text-muted font-heavy uppercase text-xs">
              Prazo
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
          <tr
            v-for="contrato in contratos"
            :key="contrato.id"
            class="border-b border-climbe-neutral-border hover:bg-climbe-primary-light transition-colors cursor-pointer"
            @click="verDetalhe(contrato.id)"
          >
            <td class="px-4 py-3 text-climbe-text-main font-heavy">{{ contrato.empresa }}</td>
            <td class="px-4 py-3 text-climbe-text-muted">{{ contrato.proposta }}</td>
            <td class="px-4 py-3 text-climbe-text-muted">{{ contrato.prazo }}</td>
            <td class="px-4 py-3">
              <span :class="statusClass(contrato.status)">{{ contrato.status }}</span>
            </td>
            <td class="px-4 py-3">
              <button
                class="text-climbe-primary text-xs hover:underline"
                @click.stop="verDetalhe(contrato.id)"
              >
                Ver detalhes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </ClimbePageWrapper>
</template>
