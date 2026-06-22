const messagePool = [
  'Nova proposta <strong>PROP-008</strong> aguardando sua revisão.',
  'O contrato da empresa <strong>Google Inc</strong> foi assinado eletronicamente.',
  '<strong>Marcos Rocha</strong> alterou o status da proposta PROP-004 para pendente.',
  'Backup do banco de dados concluído com sucesso.',
  'Novo acesso detectado de um novo dispositivo.',
  '<strong>Climbe API</strong> foi atualizada para a versão v1.2.4.',
]

let notifications = [
  {
    id: 1,
    text: '<strong>Contrato #1042</strong> aprovado por XP Investimentos.',
    time: 'Há 15 min',
    read: false,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    text: 'Reunião com diretoria agendada para amanhã, 14:00.',
    time: 'Há 2 horas',
    read: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    text: 'Nova proposta criada para a empresa <strong>ACME Corp</strong>.',
    time: 'Há 4 horas',
    read: false,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
]

const DELAY_MS = 200
const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listarNotificacoes() {
  await aguardar(DELAY_MS)
  // Retorna ordenado por timestamp decrescente (mais recente primeiro)
  return [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export async function marcarComoLida(id) {
  await aguardar(DELAY_MS)
  const notificacao = notifications.find((n) => n.id === id)
  if (notificacao) {
    notificacao.read = true
    return notificacao
  }
  throw new Error('Notificação não encontrada')
}

export async function gerarNovaNotificacao() {
  await aguardar(DELAY_MS)
  const randomMsg = messagePool[Math.floor(Math.random() * messagePool.length)]
  const novoId = notifications.reduce((max, n) => Math.max(max, n.id), 0) + 1
  const novaNotificacao = {
    id: novoId,
    text: randomMsg,
    time: 'Agora',
    read: false,
    timestamp: new Date().toISOString(),
  }
  notifications.unshift(novaNotificacao)
  return novaNotificacao
}
