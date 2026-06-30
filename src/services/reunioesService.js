import { reunioesMock, salasMock, participantesMock } from '@/mocks/reunioesMock'

const DELAY_MS = 300
function clonarObjeto(dados) {
  return JSON.parse(JSON.stringify(dados))
}

let reunioesEmMemoria = clonarObjeto(reunioesMock)

const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listarReunioes() {
  await aguardar(DELAY_MS)
  return clonarObjeto(reunioesEmMemoria)
}

export async function buscarReuniaoPorId(id) {
  await aguardar(DELAY_MS)
  const reuniao = reunioesEmMemoria.find((item) => item.id === Number(id))
  if (!reuniao) {
    throw new Error('Reunião não encontrada.')
  }
  return clonarObjeto(reuniao)
}

export async function criarReuniao(payload) {
  await aguardar(DELAY_MS)
  const proximoId = reunioesEmMemoria.reduce((maiorId, item) => Math.max(maiorId, item.id), 0) + 1
  const novaReuniao = {
    ...clonarObjeto(payload),
    id: proximoId,
    status: 'agendada',
    criadoEm: new Date().toISOString(),
    criadoPor: obterNomeUsuarioLogado(),
  }
  reunioesEmMemoria.push(novaReuniao)
  return clonarObjeto(novaReuniao)
}

export async function atualizarReuniao(id, payload) {
  await aguardar(DELAY_MS)
  const indice = reunioesEmMemoria.findIndex((item) => item.id === Number(id))
  if (indice === -1) {
    throw new Error('Reunião não encontrada para atualização.')
  }
  reunioesEmMemoria[indice] = {
    ...reunioesEmMemoria[indice],
    ...clonarObjeto(payload),
    id: Number(id),
  }
  return clonarObjeto(reunioesEmMemoria[indice])
}

export async function excluirReuniao(id) {
  await aguardar(DELAY_MS)
  const indice = reunioesEmMemoria.findIndex((item) => item.id === Number(id))
  if (indice === -1) {
    throw new Error('Reunião não encontrada para exclusão.')
  }
  reunioesEmMemoria.splice(indice, 1)
}

export async function listarSalas() {
  await aguardar(DELAY_MS)
  return clonarObjeto(salasMock)
}

export async function listarParticipantes() {
  await aguardar(DELAY_MS)
  return clonarObjeto(participantesMock)
}

/**
 * Verifica se uma sala está disponível em determinada data/hora.
 * Retorna { disponivel: boolean, conflitos: [] }
 */
export async function verificarDisponibilidadeSala(salaId, dataHora, reuniaoIdAtual) {
  await aguardar(DELAY_MS)

  if (!salaId || !dataHora) {
    return { disponivel: true, conflitos: [] }
  }

  const dataInicio = new Date(dataHora)
  const dataFim = new Date(dataInicio.getTime() + 60 * 60 * 1000) // 1h de duração padrão

  const conflitos = reunioesEmMemoria.filter((reuniao) => {
    if (reuniao.salaId !== Number(salaId)) return false
    if (reuniaoIdAtual && reuniao.id === Number(reuniaoIdAtual)) return false
    if (reuniao.status === 'cancelada') return false

    const reuniaoInicio = new Date(reuniao.dataHora)
    const reuniaoFim = new Date(reuniaoInicio.getTime() + 60 * 60 * 1000)

    return dataInicio < reuniaoFim && dataFim > reuniaoInicio
  })

  return {
    disponivel: conflitos.length === 0,
    conflitos: conflitos.map((c) => ({
      id: c.id,
      pauta: c.pauta,
      dataHora: c.dataHora,
      criadoPor: c.criadoPor,
    })),
  }
}

function obterNomeUsuarioLogado() {
  try {
    const dados = localStorage.getItem('climb-user')
    if (dados) {
      const usuario = JSON.parse(dados)
      return usuario?.nome || usuario?.name || usuario?.email || 'Administrador Climbe'
    }
  } catch {
    // silencioso
  }
  return localStorage.getItem('climb-user-email') || 'Administrador Climbe'
}
