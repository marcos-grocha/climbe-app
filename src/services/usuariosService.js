import http from '@/services/http'
import { extrairMensagemErro } from '@/services/empresasService'

// --- Mappers ---
function mapApiToFront(usuarioApi) {
  return {
    id: usuarioApi.id_usuario,
    nome_completo: usuarioApi.nome_completo || '',
    cargo_id: usuarioApi.cargo_id || null,
    cpf: usuarioApi.cpf || '',
    email: usuarioApi.email || '',
    contato: usuarioApi.contato || '',
    papel: usuarioApi.papel, // keep original value
    situacao: usuarioApi.situacao || 'inativo',
    // Avatar calculation if needed can be done in the frontend UI or here
    avatar: (usuarioApi.nome_completo || '')
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join(''),
  }
}

function mapFrontToApiCreate(usuarioFront) {
  return {
    nome_completo: usuarioFront.nome_completo,
    cargo_id: usuarioFront.cargo_id,
    cpf: usuarioFront.cpf.replace(/\D/g, ''), // remove mask
    email: usuarioFront.email,
    contato: usuarioFront.contato,
    papel: usuarioFront.papel,
    senha: usuarioFront.senha,
  }
}

function mapFrontToApiUpdate(usuarioFront) {
  const payload = {
    nome_completo: usuarioFront.nome_completo,
    cargo_id: usuarioFront.cargo_id,
    papel: usuarioFront.papel,
    situacao: usuarioFront.situacao,
    contato: usuarioFront.contato,
  }
  
  return payload
}

// --- Services CRUD ---
export async function listarUsuarios() {
  try {
    const { data } = await http.get('/usuarios')
    return data.map(mapApiToFront)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function obterUsuario(id) {
  try {
    const { data } = await http.get(`/usuarios/${id}`)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function criarUsuario(payload) {
  try {
    const backendPayload = mapFrontToApiCreate(payload)
    const { data } = await http.post('/usuarios', backendPayload)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function atualizarUsuario(id, payload) {
  try {
    const backendPayload = mapFrontToApiUpdate(payload)
    const { data } = await http.patch(`/usuarios/${id}`, backendPayload)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function inativarUsuario(id) {
  try {
    await http.delete(`/usuarios/${id}`)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function reativarUsuario(id) {
  try {
    const { data } = await http.patch(`/usuarios/${id}`, { situacao: 'ativo' })
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function listarCargos() {
  try {
    const { data } = await http.get('/cargos')
    return data
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}
