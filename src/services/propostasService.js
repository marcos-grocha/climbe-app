import http from '@/services/http'
import { extrairMensagemErro } from '@/services/empresasService'

// --- Mappers ---
function mapApiToFront(propostaApi) {
  return {
    id: propostaApi.id_proposta,
    empresaId: propostaApi.empresa_id,
    usuarioId: propostaApi.usuario_id,
    status: propostaApi.status,
    dataCriacao: propostaApi.data_criacao,
  }
}

function mapFrontToApi(propostaFront) {
  return {
    empresa_id: propostaFront.empresaId,
  }
}

// --- Services CRUD ---
export async function listarPropostas() {
  try {
    const { data } = await http.get('/propostas')
    return data.map(mapApiToFront)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function buscarPropostaPorId(id) {
  try {
    const { data } = await http.get(`/propostas/${id}`)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function criarProposta(payload) {
  try {
    const backendPayload = mapFrontToApi(payload)
    const { data } = await http.post('/propostas', backendPayload)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function atualizarProposta(id, payload) {
  try {
    const backendPayload = mapFrontToApi(payload)
    const { data } = await http.patch(`/propostas/${id}`, backendPayload)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function excluirProposta(id) {
  try {
    await http.delete(`/propostas/${id}`)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

// --- Services Transição ---
export async function enviarProposta(id) {
  try {
    const { data } = await http.post(`/propostas/${id}/enviar`)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function aprovarProposta(id) {
  try {
    const { data } = await http.post(`/propostas/${id}/aprovar`)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function recusarProposta(id) {
  try {
    const { data } = await http.post(`/propostas/${id}/recusar`)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}
