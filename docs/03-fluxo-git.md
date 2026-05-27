# 03 — Fluxo Git e Code Review

Regras simples para 4 pessoas em 3 semanas. **Sem Git Flow elaborado.**

## Branches

- **`main`** — sempre estável. Deploy/demo sai daqui.
- **`feature/<descricao-curta>`** — uma branch por tarefa. Ex: `feature/login-google`, `feature/crud-empresas`.
- **`fix/<descricao-curta>`** — correções pontuais. Ex: `fix/cnpj-validacao`.

Não usamos `develop`, `release`, `hotfix`. Não precisamos.

## Ciclo de trabalho

```
git checkout main
git pull
git checkout -b feature/minha-tarefa
# ... código, commits ...
git push -u origin feature/minha-tarefa
# Abrir PR no GitHub
```

## Commits

### Formato

```
<tipo>: <descrição curta no imperativo>

[corpo opcional explicando o porquê]
```

### Tipos permitidos

- `feat` — nova funcionalidade
- `fix` — correção de bug
- `refactor` — mudança de código sem alterar comportamento
- `style` — formatação, CSS, sem mudança de lógica
- `docs` — apenas documentação
- `chore` — config, dependências, build
- `test` — testes

### Exemplos bons

```
feat: adiciona validação de CPF no cadastro de usuário
fix: corrige redirect após logout
refactor: extrai lógica de toast para composable useToast
docs: atualiza roadmap da semana 2
```

### Exemplos ruins

```
update                  # vago
mudanças                # vago
WIP                     # commit de WIP só local, nunca no main
correção do bug         # qual bug?
```

## Pull Requests

### Antes de abrir

- [ ] Rodei `npm run lint` e `npm run format`
- [ ] Testei manualmente no navegador
- [ ] Não deixei `console.log` esquecido
- [ ] Não commitei `.env` ou credenciais

### Template

Já está pré-configurado. Quando você abrir uma PR no GitHub, o corpo vem preenchido com as seções:

- **O que muda** — descrição em 1-3 linhas
- **Tipo** — feat / fix / refactor / style / docs / chore / test
- **Como testar** — passo a passo pro revisor
- **Screenshots** — se mudou UI (lembrete: se for algo visual, anexe o print)
- **Checklist do autor** — lint, format, testes manuais, padrões
- **Issue relacionada** — `Closes #N` da issue/task no GitHub Projects (fecha automaticamente ao mergear)

Preencha o que se aplica e apague o resto.

### Code Review

- **Toda PR precisa de 1 review** antes de mergear.
- **Review em até 24h.** Se não der, avisa no grupo.
- **Aprovação por "LGTM" + comentário** ou via botão "Approve" do GitHub.
- **Apenas Marcão realiza o merge para a main** após aprovação.

## Conflitos

- **Sempre rebase com `main` antes do merge.**
- Conflitos resolvidos pelo autor da PR, não pelo revisor.

```bash
git checkout feature/minha-tarefa
git fetch origin
git rebase origin/main
# resolver conflitos
git push --force-with-lease
```

## O que NÃO fazer

- ❌ Commitar direto em `main`.
- ❌ `git push --force` (use `--force-with-lease` quando rebase).
- ❌ Mergear sem review.
- ❌ Reescrever histórico de `main`.
- ❌ Commitar `node_modules/`, `.env`, `dist/`.

## Mensagens em PT-BR ou EN?

Vamos de **português** no projeto inteiro: commits, PRs, comentários, descrições. Mantém consistência com o domínio (que já é em PT).
