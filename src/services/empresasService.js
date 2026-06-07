import { empresasMock } from '@/mocks/empresasMock'

const DELAY_MS = 300
function clonarObjeto(dados) {
  return JSON.parse(JSON.stringify(dados))
}

let empresasEmMemoria = clonarObjeto(empresasMock)

const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listarEmpresas() {
  await aguardar(DELAY_MS)
  return clonarObjeto(empresasEmMemoria)
}

export async function criarEmpresa(payload) {
  await aguardar(DELAY_MS)
  const proximoId = empresasEmMemoria.reduce((maiorId, item) => Math.max(maiorId, item.id), 0) + 1
  const novaEmpresa = {
    ...clonarObjeto(payload),
    id: proximoId,
    status: payload.status || 'ativa',
    criado_em: new Date().toISOString(),
  }
  empresasEmMemoria.push(novaEmpresa)
  return clonarObjeto(novaEmpresa)
}

export async function atualizarEmpresa(id, payload) {
  await aguardar(DELAY_MS)
  const indice = empresasEmMemoria.findIndex((empresa) => empresa.id === id)
  if (indice === -1) {
    throw new Error('Empresa não encontrada para atualização.')
  }
  empresasEmMemoria[indice] = {
    ...empresasEmMemoria[indice],
    ...clonarObjeto(payload),
    id,
  }
  return clonarObjeto(empresasEmMemoria[indice])
}

export async function excluirEmpresa(id) {
  await aguardar(DELAY_MS)
  const indice = empresasEmMemoria.findIndex((empresa) => empresa.id === id)
  if (indice === -1) {
    throw new Error('Empresa não encontrada para exclusão.')
  }
  empresasEmMemoria.splice(indice, 1)
}
