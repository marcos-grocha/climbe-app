import { getInicioDaSemana } from '@/utils/dateUtils'

// FUTURO: import http from './http'

/**
 * Retorna os itens de agenda (reuniões e vencimentos) simulando uma API.
 * Os dados retornados são sempre baseados na semana atual.
 */
export async function buscarAgendaSemana() {
  // Simulando latência de rede
  await new Promise((resolve) => setTimeout(resolve, 600))

  /* 
    FUTURO: 
    Remover o setTimeout e o mock abaixo.
    Descomentar a linha de chamada real à API:
    
    const { data } = await http.get('/agenda/semana')
    return data
  */

  const inicio = getInicioDaSemana()

  // Gerar datas relativas à semana atual para o mock fazer sentido visualmente
  const criarData = (diasAdicionais, horas, minutos) => {
    const d = new Date(inicio)
    d.setDate(d.getDate() + diasAdicionais)
    d.setHours(horas, minutos, 0, 0)
    return d.toISOString()
  }

  // Retornando mock
  return [
    {
      id: 'a1',
      titulo: 'Reunião com Diretoria - XP Investimentos',
      tipo: 'reuniao',
      data: criarData(0, 14, 0), // Segunda, 14:00
      status: 'pendente',
    },
    {
      id: 'a2',
      titulo: 'Vencimento de Contrato #1038',
      tipo: 'vencimento',
      data: criarData(1, 18, 0), // Terça, 18:00
      status: 'alerta',
    },
    {
      id: 'a3',
      titulo: 'Alinhamento de Fusões & Aquisições (PwC)',
      tipo: 'reuniao',
      data: criarData(2, 10, 30), // Quarta, 10:30
      status: 'pendente',
    },
    {
      id: 'a4',
      titulo: 'Auditoria Externa de Riscos (Deloitte)',
      tipo: 'reuniao',
      data: criarData(3, 16, 0), // Quinta, 16:00
      status: 'pendente',
    },
    {
      id: 'a5',
      titulo: 'Vencimento de Contrato #2042',
      tipo: 'vencimento',
      data: criarData(4, 23, 59), // Sexta, 23:59
      status: 'alerta',
    },
  ]
}
