import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContratosPainelMockStore = defineStore('contratosPainelMock', () => {
  const contratos = ref([
    {
      id: '1042',
      titulo: 'Prestação de Serviço de Assessoria',
      empresa: 'XP Investimentos',
      responsavel: 'João Silva',
      valor: 35000,
      status: 'Aprovado',
      dataInicial: '2024-05-24',
      dataFinal: '2026-05-24',
      dataAtualizacao: '2024-05-24',
      observacao: 'Assessoria contínua.',
    },
    {
      id: '1041',
      titulo: 'Aporte de Capital em Seed Money',
      empresa: 'Norte Capital S/A',
      responsavel: 'Maria Souza',
      valor: 1200000,
      status: 'Vigente',
      dataInicial: '2024-05-20',
      dataFinal: '2027-05-20',
      dataAtualizacao: '2024-05-20',
      observacao: 'Aporte de seed money fase 1.',
    },
    {
      id: '1040',
      titulo: 'Contrato de Parceria Estruturada',
      empresa: 'Itaú Unibanco',
      responsavel: 'Carlos Almeida',
      valor: 85000,
      status: 'Vigente',
      dataInicial: '2024-05-18',
      dataFinal: '2025-05-18',
      dataAtualizacao: '2024-05-18',
      observacao: '',
    },
    {
      id: '1039',
      titulo: 'Locação de Sala Comercial Corp',
      empresa: 'Imobiliária Prime',
      responsavel: 'Fernanda Lima',
      valor: 12500,
      status: 'Em Análise',
      dataInicial: '2024-05-12',
      dataFinal: '2025-05-12',
      dataAtualizacao: '2024-05-12',
      observacao: 'Aguardando assinatura da diretoria.',
    },
    {
      id: '1038',
      titulo: 'Aquisição de Ativos de Renda Fixa',
      empresa: 'BTG Pactual S/A',
      responsavel: 'João Silva',
      valor: 450000,
      status: 'Aprovado',
      dataInicial: '2024-05-08',
      dataFinal: '2028-05-08',
      dataAtualizacao: '2024-05-08',
      observacao: '',
    },
    {
      id: '1037',
      titulo: 'Fornecimento de Licenças SaaS ERP',
      empresa: 'Oracle Corp',
      responsavel: 'Ricardo Costa',
      valor: 24000,
      status: 'Cancelado',
      dataInicial: '2024-05-05',
      dataFinal: '2025-05-05',
      dataAtualizacao: '2024-05-05',
      observacao: 'Cancelado pelo cliente.',
    },
  ])

  function formatarData(date) {
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  function adicionarContrato(contrato) {
    const novoId = (Math.max(...contratos.value.map((c) => parseInt(c.id) || 0)) + 1).toString()
    contratos.value.unshift({
      ...contrato,
      id: novoId,
      dataAtualizacao: formatarData(new Date()),
    })
  }

  function atualizarContrato(id, payload) {
    const index = contratos.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      contratos.value[index] = {
        ...contratos.value[index],
        ...payload,
        dataAtualizacao: formatarData(new Date()),
      }
    }
  }

  function encerrarContrato(id) {
    const index = contratos.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      contratos.value[index].status = 'Encerrado'
      contratos.value[index].dataAtualizacao = formatarData(new Date())
    }
  }

  return {
    contratos,
    adicionarContrato,
    atualizarContrato,
    encerrarContrato,
  }
})
