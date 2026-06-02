# 04 — Roadmap das 3 semanas

> Prioridade: entregar **bem** o essencial > entregar **mal** tudo. Cortar escopo sem dó se atrasar.

## Visão geral (MoSCoW)

### MUST — Tem que ter
- Auth (login senha + JWT)
- Cadastro de empresa (CRUD)
- Cadastro de usuário (CRUD + cargos)
- Propostas comerciais (criar, listar, aprovar/recusar)
- Contratos (gerados a partir de propostas)
- Upload e listagem de documentos

### SHOULD — Importante mas pode ficar pra última semana
- OAuth 2.0 Google
- Calendário e agenda
- Notificações por e-mail
- Relatórios em PDF

### COULD — Se sobrar tempo
- Integração Google Calendar (criar evento real)
- Integração Google Drive (pastas com permissão)
- Integração Gmail (envio via API, não SMTP)

### WON'T — Não vamos entregar
- Google Sheets (não está no caminho crítico)
- Notificações tempo real (websockets)
- Modo escuro completo
- Permissões 100% granulares por cargo (vai ter só 3 papéis: admin, analista, contratante)

---

> **Sobre as tarefas abaixo:** são metas semanais, não cronograma diário. Cada um se organiza no seu ritmo — o que importa é fechar a semana com o critério de pronto atingido.

## Semana 1 — Fundação

**Meta:** login funcionando + CRUDs básicos de empresa e usuário, integrados ponta a ponta.

**Backend:**
- Setup do `climbe-api` (FastAPI + Alembic + Docker Compose só pro banco)
- Modelagem das tabelas a partir do diagrama ER (ajustado pro fluxo do "Novo Fluxograma Climbe")
- Autenticação por email/senha com JWT
- CRUD de usuário, empresa e cargo
- RBAC básico (decorator de permissão por papel)

**Frontend:**
- Instalar e configurar PrimeVue + Tailwind + Axios
- Layout base (sidebar + header + topbar com usuário logado)
- Tela de login
- Tela de cadastro/listagem de usuário (admin)
- Tela de cadastro/listagem de empresa
- Camada `services/` com interceptor de JWT no Axios

**Critério de "semana pronta":** admin consegue logar, cadastrar empresa e cadastrar usuário, com o front consumindo a API de verdade (sem mock).

---

## Semana 2 — Núcleo do negócio

**Meta:** fluxo completo proposta → contrato → upload de documentos rodando.

**Backend:**
- Endpoints de proposta (criar, listar, aprovar, recusar)
- Endpoints de contrato (gerados a partir de proposta aprovada)
- Upload e armazenamento local de documentos
- Validação de documentos pelo analista
- OAuth 2.0 Google (login social)

**Frontend:**
- Tela de criar/listar propostas + fluxo de aprovação
- Tela de contratos (lista + detalhe)
- Tela de upload e listagem de documentos
- Tela de validação de documentos pelo analista
- Botão "Login com Google"

**Critério de "semana pronta":** alguém autorizado cria proposta → contratante aprova → vira contrato → documentos são solicitados, enviados e validados.

---

## Semana 3 — Integrações Google e polimento

**Meta:** integrar Google Workspace, gerar PDFs e estar pronto pra apresentação.

**Backend:**
- Integração com Google Calendar (criar evento real)
- Envio de notificações por email (SMTP ou Gmail API)
- Integração com Google Drive (pasta por contrato + permissão)
- Endpoints de notificações in-app

**Frontend:**
- Calendário mensal interativo com FullCalendar
- Formulário de agendamento de reunião
- Agenda semanal do usuário logado
- Dropdown de notificações
- Geração/visualização de PDFs (relatórios)

**Polimento (encaixa onde der ao longo da semana):**
- Bug fixes e ajustes de UX
- Teste manual do fluxo end-to-end completo
- README de execução atualizado
- Deploy mínimo (Railway/Render pro back, Vercel/Netlify pro front)
- Vídeo demo de backup pra apresentação

**Critério de "semana pronta":** apresentação ao vivo é possível do início ao fim — cadastrar empresa → criar proposta → aprovar → upload de docs → agendar reunião → gerar relatório.

---

## Critérios para cortar escopo

No fim de cada semana, avalie se o critério de "semana pronta" foi atingido. Se não, **corte na seguinte ordem**:

1. **Primeiro**: Google Sheets e Drive (deixa pra v2 do projeto).
2. **Depois**: Gmail API (substitui por SMTP simples).
3. **Depois**: OAuth Google (mantém só login senha; avisa o mentor da mudança).
4. **Em caso crítico** (Semana 1 não fechou): foco total em auth + CRUDs + propostas + documentos. Calendário e relatórios viram bônus pra apresentação.

Não pague o custo de tentar entregar tudo mal. Melhor entregar 60% do escopo bem feito do que 100% quebrado.

## Definição de "Pronto"

Uma tarefa só está pronta quando:

1. Código no `main`
2. Sem warning no console
3. Testada manualmente no fluxo completo
4. Documentada (mesmo que linha no PR)
5. Funcionando com o backend integrado (não só mock)
