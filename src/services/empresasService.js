import http from '@/services/http'

// --- Tratamento de Erros ---
export function extrairMensagemErro(error) {
  if (error.response?.data) {
    const data = error.response.data
    // FastAPI / Pydantic validation error array
    if (Array.isArray(data.detail)) {
      const msgs = data.detail.map((err) => {
        const field = err.loc ? err.loc[err.loc.length - 1] : 'Campo'
        return `${field}: ${err.msg}`
      })
      return msgs.join(' | ')
    }
    // String detail
    if (typeof data.detail === 'string') {
      return data.detail
    }
    // generic message
    if (data.message) {
      return data.message
    }
  }
  return error.message || 'Ocorreu um erro desconhecido.'
}

// --- Mappers ---
function mapApiToFront(empresaApi) {
  return {
    id: empresaApi.id_empresa,
    razao_social: empresaApi.razao_social || '',
    nome_fantasia: empresaApi.nome_fantasia || '',
    cnpj: empresaApi.cnpj || '',
    email: empresaApi.email || '',
    telefone: empresaApi.telefone || '',
    status: empresaApi.status || 'ativa', // Se o backend não mandar, assumimos 'ativa'
    endereco: {
      cep: empresaApi.cep || '',
      logradouro: empresaApi.logradouro || '',
      numero: empresaApi.numero || '',
      bairro: empresaApi.bairro || '',
      cidade: empresaApi.cidade || '',
      estado: empresaApi.uf || '',
    },
    representante_legal: {
      nome: empresaApi.representante_nome || '',
      cpf: empresaApi.representante_cpf || '',
      telefone: empresaApi.representante_contato || '',
    },
    servicos: empresaApi.servicos || [], // Pode ser util depois
  }
}

function mapFrontToApi(empresaFront, isCreate = false) {
  const payload = {
    razao_social: empresaFront.razao_social,
    nome_fantasia: empresaFront.nome_fantasia,
    cnpj: empresaFront.cnpj, // O front já envia os números apenas
    logradouro: empresaFront.endereco?.logradouro,
    numero: empresaFront.endereco?.numero,
    bairro: empresaFront.endereco?.bairro,
    cidade: empresaFront.endereco?.cidade,
    uf: empresaFront.endereco?.estado,
    cep: empresaFront.endereco?.cep,
    telefone: empresaFront.telefone,
    email: empresaFront.email,
    representante_nome: empresaFront.representante_legal?.nome,
    representante_cpf: empresaFront.representante_legal?.cpf,
    representante_contato: empresaFront.representante_legal?.telefone,
  }

  // Apenas no create envia servico_ids, para não sobrescrever vínculos no patch
  if (isCreate) {
    payload.servico_ids = []
  }

  return payload
}

// --- Services CRUD ---
export async function listarEmpresas() {
  try {
    const { data } = await http.get('/empresas')
    return data.map(mapApiToFront)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function obterEmpresa(id) {
  try {
    const { data } = await http.get(`/empresas/${id}`)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function criarEmpresa(payload) {
  try {
    const backendPayload = mapFrontToApi(payload, true)
    const { data } = await http.post('/empresas', backendPayload)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function atualizarEmpresa(id, payload) {
  try {
    const backendPayload = mapFrontToApi(payload, false)
    const { data } = await http.patch(`/empresas/${id}`, backendPayload)
    return mapApiToFront(data)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}

export async function excluirEmpresa(id) {
  try {
    await http.delete(`/empresas/${id}`)
  } catch (error) {
    throw new Error(extrairMensagemErro(error), { cause: error })
  }
}
