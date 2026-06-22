<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClimbePageWrapper from '@/components/layout/ClimbePageWrapper.vue'
import { listarContratos } from '@/services/contratosService.js'

const router = useRouter()
const contratos = ref([])
const carregando = ref(false)
const erro = ref(null)

const statusClass = (status) => {
  if (status === 'ativo')
    return 'text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
  if (status === 'pendente')
    return 'text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
  return 'text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full text-xs font-semibold'
}

const verDetalhe = (id) => {
  router.push(`/contratos/${id}`)
}

const carregarContratos = async () => {
  carregando.value = true
  erro.value = null
  try {
    contratos.value = await listarContratos()
  } catch {
    erro.value = 'Erro ao carregar contratos.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregarContratos)
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
      <div v-if="carregando" class="text-center text-climbe-text-muted py-12">Carregando...</div>
      <div v-else-if="erro" class="text-center text-red-400 py-12">{{ erro }}</div>
      <div v-else-if="contratos.length === 0" class="text-center text-climbe-text-muted py-12">
        Nenhum contrato encontrado.
      </div>
      <table v-else class="w-full text-sm">
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
            <td class="px-4 py-3 text-climbe-text-main font-heavy">
              {{ contrato.empresa?.nome || '—' }}
            </td>
            <td class="px-4 py-3 text-climbe-text-muted">{{ contrato.proposta?.titulo || '—' }}</td>
            <td class="px-4 py-3 text-climbe-text-muted">{{ contrato.prazo_vigencia || '—' }}</td>
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
