import { configuracoesMock } from '@/mocks/configuracoesMock'

const STORAGE_KEY = 'climbe_configuracoes'
const DELAY_MS = 250

function clonarObjeto(dados) {
  return JSON.parse(JSON.stringify(dados))
}

const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Inicializa no LocalStorage se não existir
function obterDadosPersistidos() {
  const dados = localStorage.getItem(STORAGE_KEY)
  if (!dados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configuracoesMock))
    return clonarObjeto(configuracoesMock)
  }
  try {
    return JSON.parse(dados)
  } catch {
    return clonarObjeto(configuracoesMock)
  }
}

function salvarDadosPersistidos(dados) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados))
}

export async function obterConfiguracoes() {
  await aguardar(DELAY_MS)
  return obterDadosPersistidos()
}

export async function salvarConfiguracoes(secao, novosDados) {
  await aguardar(DELAY_MS)
  const dadosAtuais = obterDadosPersistidos()
  
  if (!dadosAtuais[secao]) {
    dadosAtuais[secao] = {}
  }
  
  dadosAtuais[secao] = {
    ...dadosAtuais[secao],
    ...clonarObjeto(novosDados)
  }
  
  salvarDadosPersistidos(dadosAtuais)
  return dadosAtuais[secao]
}

export async function alterarSenha(senhaAtual, novaSenha) {
  await aguardar(DELAY_MS * 1.5)
  if (!senhaAtual || !novaSenha) {
    throw new Error('Todos os campos de senha são obrigatórios.')
  }
  if (senhaAtual === novaSenha) {
    throw new Error('A nova senha não pode ser igual à senha atual.')
  }
  // Sucesso fictício
  return { sucesso: true, mensagem: 'Senha alterada com sucesso.' }
}
