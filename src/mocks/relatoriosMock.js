export const relatoriosMock = {
  metricasGerais: {
    capitalSobGestao: 28540000,
    ticketMedio: 594583,
    taxaCrescimento: 14.8,
    auditoriasConcluidas: 12,
    auditoriasPendentes: 2,
    contratosAssinadosEsteMes: 5
  },
  evolucaoMensal: [
    { mes: 'Jan/2026', valor: 12000000, contratos: 24 },
    { mes: 'Fev/2026', valor: 15400000, contratos: 29 },
    { mes: 'Mar/2026', valor: 18200000, contratos: 32 },
    { mes: 'Abr/2026', valor: 22000000, contratos: 38 },
    { mes: 'Mai/2026', valor: 25800000, contratos: 43 },
    { mes: 'Jun/2026', valor: 28540000, contratos: 48 }
  ],
  distribuicaoSetor: [
    { nome: 'Finanças & Bancário', porcentagem: 38, cor: '#5fc2ba', quantidade: 18 },
    { nome: 'Tecnologia & SaaS', porcentagem: 27, cor: '#38bdf8', quantidade: 13 },
    { nome: 'Imobiliário & Infra', porcentagem: 20, cor: '#a78bfa', quantidade: 10 },
    { nome: 'Energia & Utilities', porcentagem: 15, cor: '#f59e0b', quantidade: 7 }
  ],
  historicoRelatorios: [
    {
      id: 'REP-2026-001',
      nome: 'Demonstrativo Financeiro Q1 - Consolidação de Aportes',
      tipo: 'PDF',
      periodo: 'Jan/2026 - Mar/2026',
      tamanho: '4.8 MB',
      gerado_em: '2026-04-02T10:15:00.000Z',
      gerado_por: 'mariana.lopes@climbe.com',
      status: 'disponivel'
    },
    {
      id: 'REP-2026-002',
      nome: 'Análise de Performance de Portfólio de Contratos',
      tipo: 'XLSX',
      periodo: 'Anual 2025',
      tamanho: '12.4 MB',
      gerado_em: '2026-05-10T14:30:00.000Z',
      gerado_por: 'admin@climbe.com',
      status: 'disponivel'
    },
    {
      id: 'REP-2026-003',
      nome: 'Relatório Trimestral de Auditoria de Riscos e Compliance',
      tipo: 'PDF',
      periodo: 'Jan/2026 - Mar/2026',
      tamanho: '3.1 MB',
      gerado_em: '2026-05-18T09:00:00.000Z',
      gerado_por: 'ricardo.mendes@climbe.com',
      status: 'disponivel'
    },
    {
      id: 'REP-2026-004',
      nome: 'Auditoria de Assinatura de Instrumentos e Procurações',
      tipo: 'PDF',
      periodo: 'Maio 2026',
      tamanho: '2.2 MB',
      gerado_em: '2026-06-01T16:00:00.000Z',
      gerado_por: 'pedro.costa@climbe.com',
      status: 'disponivel'
    },
    {
      id: 'REP-2026-005',
      nome: 'Consolidado Geral de Clientes e Empresas Parceiras',
      tipo: 'XLSX',
      periodo: 'Histórico Completo',
      tamanho: '8.7 MB',
      gerado_em: '2026-06-20T11:45:00.000Z',
      gerado_por: 'admin@climbe.com',
      status: 'disponivel'
    }
  ]
}
