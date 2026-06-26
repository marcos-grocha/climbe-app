export const configuracoesMock = {
  perfil: {
    nome_completo: 'Admin Climbe',
    email: 'admin@climbe.com',
    cargo: 'Diretor Operacional',
    perfil_acesso: 'admin',
    telefone: '(11) 98765-4321',
    avatar: 'AC',
    avatar_color: '#5fc2ba'
  },
  preferencias: {
    notificacoes_email: true,
    alertas_seguranca: true,
    relatorio_semanal: false,
    novas_propostas: true,
    auditoria_avisos: true,
    '2fa_ativo': false,
    idioma: 'pt-BR',
    tema: 'dark'
  },
  empresa: {
    razao_social: 'Climbe Investimentos & Gestão de Ativos Ltda',
    nome_fantasia: 'Climbe Corp',
    cnpj: '12.345.678/0001-99',
    telefone: '(11) 3003-4500',
    endereco: 'Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP',
    webhook_url: 'https://api.climbe.com/v1/webhooks/contracts',
    webhook_ativo: true
  }
}
