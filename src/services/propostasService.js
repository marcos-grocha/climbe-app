import { propostasMock } from '@/mocks/propostasMock'

const DELAY_MS = 300

function clonarObjeto(dados) {
  return JSON.parse(JSON.stringify(dados))
}

function normalizarPropostaParaUi(proposta) {
  return clonarObjeto(proposta)
}

function normalizarPayloadParaPersistencia(payload) {
  return clonarObjeto(payload)
}

function gerarCodigoProposta(id) {
  return `PROP-${String(id).padStart(3, '0')}`
}

function obterResponsavelAtual() {
  try {
    const usuarioStorage = localStorage.getItem('usuario')
    if (usuarioStorage) {
      const usuario = JSON.parse(usuarioStorage)
      return usuario?.nome || usuario?.name || usuario?.email || 'Administrador Climbe'
    }
  } catch {
    // Ignora erro de parse e usa fallback seguro
  }

  return localStorage.getItem('climb-user-email') || 'Administrador Climbe'
}

let propostasEmMemoria = clonarObjeto(propostasMock)

const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listarPropostas() {
  await aguardar(DELAY_MS)
  return propostasEmMemoria.map(normalizarPropostaParaUi)
}

export async function buscarPropostaPorId(id) {
  await aguardar(DELAY_MS)
  const proposta = propostasEmMemoria.find((item) => item.id === Number(id))

  if (!proposta) {
    throw new Error('Proposta nao encontrada.')
  }

  return normalizarPropostaParaUi(proposta)
}

export async function criarProposta(dadosProposta) {
  await aguardar(DELAY_MS)

  const payload = normalizarPayloadParaPersistencia(dadosProposta)
  const proximoId = propostasEmMemoria.reduce((maiorId, item) => Math.max(maiorId, item.id), 0) + 1
  const agora = new Date().toISOString()
  const novaProposta = {
    id: proximoId,
    codigo: gerarCodigoProposta(proximoId),
    empresaId: payload.empresaId,
    empresaNome: payload.empresaNome,
    titulo: payload.titulo,
    descricao: payload.descricao || '',
    valorTotal: payload.valorTotal,
    validade: payload.validade,
    status: payload.status === 'rascunho' ? 'rascunho' : 'pendente',
    criadoPor: obterResponsavelAtual(),
    criadoEm: agora,
    aprovadoPor: null,
    aprovadoEm: null,
    recusadoPor: null,
    recusadoEm: null,
    motivoRecusa: null,
  }

  propostasEmMemoria.push(novaProposta)
  return normalizarPropostaParaUi(novaProposta)
}

export async function atualizarProposta(id, dadosProposta) {
  await aguardar(DELAY_MS)

  const indice = propostasEmMemoria.findIndex((item) => item.id === Number(id))
  if (indice === -1) {
    throw new Error('Proposta nao encontrada para atualizacao.')
  }

  const propostaAtual = propostasEmMemoria[indice]
  const payload = normalizarPayloadParaPersistencia(dadosProposta)
  const statusSeguro =
    payload.status === 'rascunho' || payload.status === 'pendente'
      ? payload.status
      : propostaAtual.status

  propostasEmMemoria[indice] = {
    ...propostaAtual,
    empresaId: payload.empresaId,
    empresaNome: payload.empresaNome,
    titulo: payload.titulo,
    descricao: payload.descricao || '',
    valorTotal: payload.valorTotal,
    validade: payload.validade,
    status:
      propostaAtual.status === 'aprovada' || propostaAtual.status === 'recusada'
        ? propostaAtual.status
        : statusSeguro,
  }

  return normalizarPropostaParaUi(propostasEmMemoria[indice])
}

export async function aprovarProposta(id) {
  await aguardar(DELAY_MS)

  const indice = propostasEmMemoria.findIndex((item) => item.id === Number(id))
  if (indice === -1) {
    throw new Error('Proposta nao encontrada para aprovacao.')
  }

  const propostaAtual = propostasEmMemoria[indice]
  if (propostaAtual.status !== 'pendente') {
    throw new Error('Apenas propostas pendentes podem ser aprovadas.')
  }

  propostasEmMemoria[indice] = {
    ...propostaAtual,
    status: 'aprovada',
    aprovadoPor: obterResponsavelAtual(),
    aprovadoEm: new Date().toISOString(),
    recusadoPor: null,
    recusadoEm: null,
    motivoRecusa: null,
  }

  return normalizarPropostaParaUi(propostasEmMemoria[indice])
}

export async function recusarProposta(id, motivoRecusa) {
  await aguardar(DELAY_MS)

  const indice = propostasEmMemoria.findIndex((item) => item.id === Number(id))
  if (indice === -1) {
    throw new Error('Proposta nao encontrada para recusa.')
  }

  const propostaAtual = propostasEmMemoria[indice]
  if (propostaAtual.status !== 'pendente') {
    throw new Error('Apenas propostas pendentes podem ser recusadas.')
  }

  propostasEmMemoria[indice] = {
    ...propostaAtual,
    status: 'recusada',
    aprovadoPor: null,
    aprovadoEm: null,
    recusadoPor: obterResponsavelAtual(),
    recusadoEm: new Date().toISOString(),
    motivoRecusa: motivoRecusa?.trim() || null,
  }

  return normalizarPropostaParaUi(propostasEmMemoria[indice])
}
