/**
 * Helpers para manipulação de datas com JS Nativo.
 * A semana começa na Segunda-feira (1) e termina no Domingo (0).
 */

export function getInicioDaSemana(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  // Ajuste: se for domingo (0), volta 6 dias, senão volta (day - 1) dias.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

export function getFimDaSemana(date = new Date()) {
  const inicio = getInicioDaSemana(date)
  const fim = new Date(inicio)
  fim.setDate(inicio.getDate() + 6)
  fim.setHours(23, 59, 59, 999)
  return fim
}

export function formatarDataHora(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatarDataCurta(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
