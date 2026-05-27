# Climbe Frontend

Aplicação web em **Vue 3 + Vite** para o sistema de gestão de contratos da **Climbe Investimentos**. Projeto da disciplina **Residência de Software III** (UNIT + Porto Digital).

> 📚 Antes de começar a codar, leia [`docs/`](docs/) — principalmente [stack](docs/01-stack.md), [padrões de código](docs/02-padroes-codigo.md) e [fluxo git](docs/03-fluxo-git.md).

## Sobre o projeto

Sistema para gerenciar o ciclo de vida de contratos: propostas comerciais, documentação obrigatória, reuniões, relatórios e integrações com o Google Workspace (Drive, Calendar, Gmail).

| Camada | Tecnologia | Repositório |
|---|---|---|
| **Frontend** | Vue 3 + Vite + Pinia + Vue Router + PrimeVue + Tailwind | **este repositório** |
| Backend | Python 3.12 + FastAPI + SQLAlchemy + Alembic | `climbe-backend` |
| Banco | PostgreSQL (Docker) | — |
| Integrações | google-api-python-client | — |

## Equipe e responsabilidades

| Papel | Responsabilidade |
|---|---|
| Tech Lead / Backend | Marcão: API REST, banco, autenticação, integrações Google (em `climbe-backend`) |
| Frontend Dev 1 | Hunald: a definir |
| Frontend Dev 2 | Valtson: a definir |
| Frontend Dev 3 | Gabriel: a definir |

Roadmap detalhado em [docs/04-roadmap.md](docs/04-roadmap.md).

## Pré-requisitos

- **Node.js** 20.19+ ou 22.12+ (testado em 24.13)
- **npm** 10+
- **IDE recomendada:** VS Code com extensão **Vue (Official)** (Volar). Desabilite Vetur se tiver.

## Setup

```bash
git clone <url-do-repo>
cd climbe-frontend
npm install
npm run dev
```

App em `http://localhost:5173`. O backend (separado) deve estar rodando em `http://localhost:8000`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Servidor estático servindo o build |
| `npm run lint` | Roda oxlint + eslint com auto-fix |
| `npm run format` | Formata `src/` com Prettier |

**Antes de cada PR**: `npm run lint && npm run format`.

## O que ainda precisa ser instalado

O scaffold base do `create-vue` traz Vue Router, Pinia, ESLint e Prettier. Bibliotecas adicionais a instalar conforme a feature precisar:

```bash
# UI components
npm install primevue primeicons
npm install -D @primevue/themes

# Tailwind (CSS utilitário)
npm install -D tailwindcss@^3 postcss autoprefixer
npx tailwindcss init -p

# HTTP
npm install axios

# Calendário interativo
npm install @fullcalendar/core @fullcalendar/vue3 @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# Validação de formulários (quando precisar)
npm install vee-validate yup
```

> **Não rode tudo de uma vez sem necessidade.** Vá instalando conforme a feature exigir. Cada dependência adicionada deve ser comentada na PR.

## Estrutura de pastas

```
climbe-frontend/
├── docs/                    # Documentação do squad (leia antes de codar)
│   ├── 01-stack.md
│   ├── 02-padroes-codigo.md
│   ├── 03-fluxo-git.md
│   └── 04-roadmap.md
├── public/                  # Assets estáticos servidos direto
└── src/
    ├── assets/              # Imagens, fontes
    ├── components/          # Componentes reutilizáveis
    │   ├── base/            # Wrappers de PrimeVue (criar conforme precisar)
    │   └── layout/          # Header, Sidebar, etc. (criar)
    ├── views/               # Páginas (uma por rota)
    ├── stores/              # Pinia stores
    ├── services/            # Camada HTTP (criar)
    ├── router/              # Vue Router
    ├── composables/         # Lógica reutilizável (criar)
    ├── utils/               # Funções puras / validadores (criar)
    ├── App.vue
    └── main.js
```

Pastas marcadas **(criar)** ainda não existem — vão sendo criadas conforme a primeira feature exigir.

## Variáveis de ambiente

Crie um `.env.local` (NÃO commitar — já está no `.gitignore`):

```
VITE_API_BASE_URL=http://localhost:8000
```

Em produção, define no provedor de deploy (Vercel/Netlify).

## Padrões importantes

- **Sempre** use `<script setup>` (Composition API).
- **Nunca** chame `axios` direto de componente — passe por `services/`.
- **Sempre** declare `defineProps` e `defineEmits` explicitamente.
- **Sempre** use `:key` em `v-for`.
- **Português nos nomes do domínio**, inglês no genérico.

Detalhes em [docs/02-padroes-codigo.md](docs/02-padroes-codigo.md).

## Documentação completa

| Documento | Para quem | Quando ler |
|---|---|---|
| [Stack e decisões](docs/01-stack.md) | Todos | Antes de começar |
| [Padrões de código](docs/02-padroes-codigo.md) | Todos | Antes de começar |
| [Fluxo Git](docs/03-fluxo-git.md) | Todos | Antes do 1º commit |
| [Roadmap das 3 semanas](docs/04-roadmap.md) | Todos | Início de cada semana |
