import http from '@/services/http.js'

export async function listarContratos() {
  const { data } = await http.get('/contratos')
  return data
}

export async function obterContrato(id) {
  const { data } = await http.get(`/contratos/${id}`)
  return data
}

export async function atualizarContrato(id, payload) {
  const { data } = await http.patch(`/contratos/${id}`, payload)
  return data
}

export async function encerrarContrato(id) {
  const { data } = await http.post(`/contratos/${id}/encerrar`)
  return data
}
