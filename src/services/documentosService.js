import { documentosMock } from '@/mocks/documentosMock'

const DELAY_MS = 300

function clonarObjeto(dados) {
  return JSON.parse(JSON.stringify(dados))
}

let documentosEmMemoria = clonarObjeto(documentosMock)

const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listarDocumentos() {
  await aguardar(DELAY_MS)
  return clonarObjeto(documentosEmMemoria)
}

export async function enviarDocumento(payload) {
  await aguardar(DELAY_MS)
  const proximoId = documentosEmMemoria.reduce((maiorId, item) => Math.max(maiorId, item.id), 0) + 1
  const novoDocumento = {
    ...clonarObjeto(payload),
    id: proximoId,
    status: 'pendente',
    enviado_em: new Date().toISOString(),
  }
  documentosEmMemoria.push(novoDocumento)
  return clonarObjeto(novoDocumento)
}

export async function excluirDocumento(id) {
  await aguardar(DELAY_MS)
  const indice = documentosEmMemoria.findIndex((doc) => doc.id === id)
  if (indice === -1) {
    throw new Error('Documento não encontrado para exclusão.')
  }
  if (documentosEmMemoria[indice].status === 'aprovado') {
    throw new Error('Não é possível excluir um documento já aprovado.')
  }
  documentosEmMemoria.splice(indice, 1)
}

export async function aprovarDocumento(id, observacao = '') {
  await aguardar(DELAY_MS)
  const indice = documentosEmMemoria.findIndex((doc) => doc.id === id)
  if (indice === -1) {
    throw new Error('Documento não encontrado.')
  }
  documentosEmMemoria[indice].status = 'aprovado'
  if (observacao) {
    documentosEmMemoria[indice].observacao = observacao
  }
  documentosEmMemoria[indice].validado_em = new Date().toISOString()
  return clonarObjeto(documentosEmMemoria[indice])
}

export async function rejeitarDocumento(id, motivo) {
  await aguardar(DELAY_MS)
  if (!motivo) {
    throw new Error('Motivo da rejeição é obrigatório.')
  }
  const indice = documentosEmMemoria.findIndex((doc) => doc.id === id)
  if (indice === -1) {
    throw new Error('Documento não encontrado.')
  }
  documentosEmMemoria[indice].status = 'rejeitado'
  documentosEmMemoria[indice].motivo = motivo
  documentosEmMemoria[indice].validado_em = new Date().toISOString()
  return clonarObjeto(documentosEmMemoria[indice])
}
