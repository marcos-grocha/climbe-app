# 01 — Stack e decisões técnicas

## Frontend

Versões reais instaladas pelo `create-vue@3.22.3` em 2026-05-27:

| Item | Escolha | Versão instalada |
|---|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) | ^3.5.32 |
| Build | Vite | ^8.0.8 |
| Linguagem | JavaScript (sem TypeScript) | ES2022 |
| Roteamento | Vue Router | ^5.0.4 |
| Estado global | Pinia | ^3.0.4 |
| Lint | oxlint + ESLint + Prettier | ^10 / ^3 |
| HTTP | Axios *(a instalar)* | ^1 |
| UI components | PrimeVue *(a instalar)* | ^4 |
| CSS utilitário | Tailwind CSS *(a instalar)* | ^3 |
| Ícones | PrimeIcons *(vem com PrimeVue)* | — |
| Calendário | FullCalendar (`@fullcalendar/vue3`) *(a instalar)* | ^6 |
| Validação | vee-validate + yup *(a instalar quando precisar)* | — |

> O scaffold já trouxe `oxlint` como linter rápido em paralelo ao ESLint. `npm run lint` roda os dois em sequência.

### Por que essas escolhas

- **Vue 3 + JavaScript**: equipe em aprendizado. TypeScript adiciona fricção que não compensa em 3 semanas. Pode ser introduzido em versões futuras.
- **Composition API + `<script setup>`**: padrão moderno do Vue, menos verboso que Options API.
- **PrimeVue**: tem `DataTable`, `Calendar`, `FileUpload`, `Toast`, `Dialog` prontos — componentes que esse projeto precisa de qualquer jeito.
- **Tailwind**: estilização rápida sem brigar com CSS escopo do Vue.
- **FullCalendar**: o calendário interativo do projeto pede um componente robusto; reinventar é desperdício de tempo.

## Backend (referência)

> O backend ficará em pasta/repositório separado.

| Item | Escolha |
|---|---|
| Linguagem | Python 3.12 |
| Framework | FastAPI |
| ORM | SQLAlchemy 2.x |
| Migrations | Alembic |
| Validação | Pydantic v2 |
| Auth | python-jose (JWT) + passlib (bcrypt) |
| Google APIs | google-api-python-client + google-auth |
| Servidor | uvicorn |

## Banco de dados

- **PostgreSQL 16** (preferencial). MySQL 8 como fallback se o mentor exigir compliance com o documento original.
- Roda em Docker. A aplicação roda nativa no Windows.

## O que NÃO usamos (e por quê)

- **TypeScript no front**: curva de aprendizado vs. prazo. Reavaliar para uma v2.
- **Nuxt**: SSR não é requisito; complexidade desnecessária.
- **Vuex**: substituído por Pinia (oficial).
- **CSS Modules / styled-components**: Tailwind cobre 95% dos casos.
- **GraphQL**: REST é suficiente; FastAPI já gera OpenAPI.

## Versões mínimas de ferramentas

- Node.js: **20.x ou superior** (testado em 24.13)
- npm: **10.x ou superior**
- Python (backend): **3.11 ou superior**
- Docker: **24+** (apenas para o banco)
- Git: **2.40+**
