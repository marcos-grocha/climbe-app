import { relatoriosMock } from '@/mocks/relatoriosMock'

const STORAGE_KEY = 'climbe_relatorios_historico'
const DELAY_MS = 300

function clonarObjeto(dados) {
  return JSON.parse(JSON.stringify(dados))
}

const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function obterHistoricoPersistido() {
  const dados = localStorage.getItem(STORAGE_KEY)
  if (!dados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(relatoriosMock.historicoRelatorios))
    return clonarObjeto(relatoriosMock.historicoRelatorios)
  }
  try {
    return JSON.parse(dados)
  } catch {
    return clonarObjeto(relatoriosMock.historicoRelatorios)
  }
}

function salvarHistoricoPersistido(historico) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historico))
}

export async function obterDadosRelatorios() {
  await aguardar(DELAY_MS)
  const metricas = clonarObjeto(relatoriosMock.metricasGerais)
  const evolucao = clonarObjeto(relatoriosMock.evolucaoMensal)
  const setores = clonarObjeto(relatoriosMock.distribuicaoSetor)
  const historico = obterHistoricoPersistido()
  
  return {
    metricasGerais: metricas,
    evolucaoMensal: evolucao,
    distribuicaoSetor: setores,
    historicoRelatorios: historico
  }
}

export async function exportarRelatorio(nome, formato, periodo, usuarioEmail) {
  await aguardar(1500) // Simula processamento pesado do PDF/XLSX
  const historico = obterHistoricoPersistido()
  
  const proximoNum = historico.length + 1
  const proximoId = `REP-2026-${String(proximoNum).padStart(3, '0')}`
  
  const tamanhoFicticio = `${(Math.random() * 8 + 1).toFixed(1)} MB`
  
  const novoRelatorio = {
    id: proximoId,
    nome: nome || 'Relatório de Auditoria Geral',
    tipo: formato || 'PDF',
    periodo: periodo || 'Customizado',
    tamanho: tamanhoFicticio,
    gerado_em: new Date().toISOString(),
    gerado_por: usuarioEmail || 'admin@climbe.com',
    status: 'disponivel'
  }
  
  historico.unshift(novoRelatorio) // Adiciona no início da lista
  salvarHistoricoPersistido(historico)
  
  return new Promise((resolve) => resolve(clonarObjeto(novoRelatorio)))
}
