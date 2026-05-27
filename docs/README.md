# Documentação interna do squad

Esta pasta concentra a documentação que orienta o desenvolvimento do projeto. **Antes de abrir qualquer ticket ou começar uma feature, leia os três primeiros.**

## Índice

| # | Documento | Para quem | Quando ler |
|---|---|---|---|
| 01 | [Stack e decisões técnicas](01-stack.md) | Todos | Antes de começar |
| 02 | [Padrões de código](02-padroes-codigo.md) | Todos | Antes de começar |
| 03 | [Fluxo Git e Code Review](03-fluxo-git.md) | Todos | Antes do primeiro commit |
| 04 | [Roadmap das 3 semanas](04-roadmap.md) | Todos | Início de cada semana |

## Como manter esta pasta

- **Adicione um arquivo novo** sempre que tomar uma decisão que afeta o time inteiro (ex: "decidimos usar lib X", "convenção Y para nome de endpoint").
- Numere os arquivos em ordem (`05-...`, `06-...`) para manter histórico.
- **Não edite decisões antigas** — adicione um novo arquivo de "ADR" (Architecture Decision Record) explicando o que mudou e por quê.
- Markdown puro. Sem ferramentas extras.

## Convenção de nomes

- `NN-assunto.md` — documento principal numerado
- `adr-NNN-decisao.md` — registro de decisão arquitetural pontual
- `meeting-YYYY-MM-DD.md` — ata de reunião relevante

## O que NÃO vai aqui

- Documentação de API (essa é gerada automaticamente pelo FastAPI em `/docs` do backend)
- Comentários de código (escreva no próprio código)
- Tarefas individuais (use Trello/Jira ou possivelmente o proprio github)
