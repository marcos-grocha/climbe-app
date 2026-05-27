# 02 — Padrões de código

Regras práticas para mantermos o código consistente entre 4 pessoas em 3 semanas. **Não inventar antes de discutir com o time.**

## Padrões gerais

- **Português nos nomes do domínio**, inglês no resto. Ex: variável `empresa`, função `validarCnpj`, mas hook genérico `useFetch`.
- **Identificadores descritivos**. Nada de `data`, `info`, `obj`, `x`. Prefira `propostaSelecionada` a `proposta`.
- **Sem comentários óbvios**. Comentário só quando o "porquê" não está claro no código.
- **Sem TODO órfão**. Se vai fazer depois, vira ticket no Trello.

## Vue — estrutura de arquivos

```
src/
├── assets/              # Imagens, fontes, ícones estáticos
├── components/          # Componentes reutilizáveis (genéricos)
│   ├── base/            # Wrappers de PrimeVue (BaseButton, BaseInput...)
│   └── layout/          # Header, Sidebar, Footer...
├── views/               # Páginas roteáveis (uma por rota)
├── stores/              # Pinia stores (auth, empresas, propostas...)
├── services/            # Camada HTTP — chamadas ao backend
├── router/              # Definição de rotas e guards
├── composables/         # Lógica reutilizável (useAuth, useToast...)
├── utils/               # Funções puras (formatadores, validadores)
└── App.vue
```

## Vue — convenções

### Nomenclatura

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componente | PascalCase | `EmpresaForm.vue`, `PropostaCard.vue` |
| Composable | camelCase com prefixo `use` | `useAuth.js`, `useNotificacoes.js` |
| Store Pinia | camelCase com sufixo `Store` | `useAuthStore`, `useEmpresasStore` |
| View / Página | PascalCase com sufixo `View` | `LoginView.vue`, `EmpresasListView.vue` |
| Service | camelCase com sufixo `Service` | `empresasService.js` |
| Constantes | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` |

### Componentes Vue

- **Sempre use `<script setup>`** (Composition API).
- **Ordem dentro do `.vue`**: `<script setup>` → `<template>` → `<style scoped>`.
- **Props com defaults explícitos** quando não obrigatórias.
- **Emits declarados** com `defineEmits`.

Exemplo mínimo:

```vue
<script setup>
import { ref } from 'vue'

const props = defineProps({
  empresa: { type: Object, required: true },
  editavel: { type: Boolean, default: false },
})

const emit = defineEmits(['salvar', 'cancelar'])

const carregando = ref(false)

function salvar() {
  emit('salvar', props.empresa)
}
</script>

<template>
  <div class="empresa-card">
    <h2>{{ empresa.nomeFantasia }}</h2>
    <button :disabled="carregando" @click="salvar">Salvar</button>
  </div>
</template>

<style scoped>
.empresa-card { padding: 1rem; }
</style>
```

## Comunicação com o backend

- **Toda chamada HTTP passa pela camada `services/`.** Componentes e views NÃO chamam `axios` direto.
- **Use snake_case nas chaves do JSON** (alinhado com o backend Python). Converta para camelCase apenas na UI se precisar.
- **Padrão de erro do backend**:
  ```json
  { "detail": "Mensagem amigável", "code": "ERRO_VALIDACAO" }
  ```
- **Token JWT** sempre via interceptor do Axios (configurar uma vez em `services/http.js`).

## Pinia stores

- **Uma store por agregado de domínio** (`auth`, `empresas`, `propostas`, `contratos`).
- **Action assíncrona retorna o resultado** (ou lança erro). Não engolir exceções.
- **State não é mutável fora da store.** Use actions.

## Estilização

- **Tailwind primeiro.** CSS escopo do Vue só quando Tailwind não cobre (animação complexa, seletores específicos).
- **Sem CSS global** fora de `assets/main.css`.
- **Tema escuro/claro** pelo theming do PrimeVue (não inventar variáveis CSS próprias).

## Lint e formatação

- Rodar `npm run lint` e `npm run format` antes de abrir PR.
- Configuração no repo é fonte de verdade. Não desabilite regras localmente sem combinar.

## Validação de formulários

- Use `vee-validate` + `yup` (quando precisar).  
- Para validações simples (CPF, CNPJ, e-mail), funções em `utils/validadores.js`.
- **CPF e CNPJ devem ser validados de verdade** (dígito verificador), não só pelo regex.

## Erros comuns a evitar

- `v-for` sem `:key`.
- Modificar `props` diretamente (sempre use `emit`).
- Usar `axios` direto em componentes.
- Repetir lógica em 3 componentes em vez de criar um composable.
- Commitar `.env` com credenciais.
