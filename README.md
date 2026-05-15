# Inventario CTI - Cypress E2E

## 1. Nome do projeto
Suite de automacao E2E Cypress para o sistema Inventario CTI.

## 2. Objetivo
Validar fluxos criticos de atribuicoes, edicao, geracao de termos e relatorios, cobrindo cenarios positivos e negativos com evidencias tecnicas.

## 3. Escopo automatizado
- HU01: Cadastro de atribuicoes
- HU02: Edicao de atribuicoes
- HU03: Geracao de termos (Responsabilidade e Emprestimo)
- HU04: Relatorio de Movimentacao de Ativos
- HU05: Relatorio de Atribuicoes por Area
- Autenticacao: login valido e login invalido

## 4. Pre-requisitos
- Node.js 20+ (recomendado)
- npm 10+
- Acesso ao ambiente alvo
- Credenciais validas configuradas por variavel de ambiente

## 5. Instalacao
```bash
npm install
```

## 6. Configuracao de variaveis de ambiente
Crie um arquivo `.env` na raiz com base em `.env.example`:

```env
CYPRESS_BASE_URL=http://testeqa.pge.ce.gov.br
CYPRESS_USER_EMAIL=seu_email
CYPRESS_USER_PASSWORD="sua_senha"
```

## 7. Como executar em modo interativo
```bash
npm run cy:open
```

## 8. Como executar em modo headless
```bash
npm run cy:run
```

Alias:
```bash
npm run test:e2e
```

## 9. Como gerar relatorio
1. Execute os testes:
```bash
npm run cy:run
```
2. Consolide o relatorio:
```bash
npm run report
```
3. Limpe relatorios anteriores quando necessario:
```bash
npm run clean:reports
```

## 10. Como acessar screenshots e videos
- Screenshots de falha: `cypress/screenshots`
- Videos de execucao: `cypress/videos`
- Relatorios Mochawesome (JSON bruto): `cypress/reports/mochawesome`
- Relatorio consolidado HTML: `cypress/reports/html/index.html`
- Auditoria tecnica de PDF: `cypress/reports/audit/pdf-audit.jsonl`

## 11. Estrutura de pastas
```text
cypress/
  e2e/
    auth/
      login.cy.ts
    atribuicoes/
      cadastrar-atribuicao.cy.ts
      editar-atribuicao.cy.ts
      gerar-termos.cy.ts
    relatorios/
      movimentacao-ativos.cy.ts
      atribuicoes-por-area.cy.ts
  fixtures/
    dados-teste.json
  support/
    commands.ts
    e2e.d.ts
    e2e.ts
    selectors.ts
    testability.ts
  downloads/
  screenshots/
  videos/
  reports/
docs/
  plano-de-testes.md
  cenarios-de-teste.md
  evidencias.md
  melhorias-sugeridas.md
cypress.config.ts
package.json
.env.example
.gitignore
```

## 12. Observacoes sobre limitacoes do ambiente
- Sem `data-testid` nativo, os seletores priorizam `id`, `name`, `href` e texto controlado.
- Alguns comportamentos sao dinamicos por massa de dados do ambiente (ex.: ausencia de dados em relatorios).
- A leitura textual profunda de PDF nao foi usada como criterio obrigatorio para evitar fragilidade; a validacao foca em status, tipo de conteudo e assinatura `%PDF-`.
- O repositorio inicial estava vazio (sem `.codex`, `AGENTS.md`, `README.md`, `package.json` e configs).

## 13. Divergencias encontradas no desafio
- HU05 no PDF repete texto da HU04, mas o fluxo real e diferente:
  - HU04: `Relatorios -> Movimentacao de Ativos`
  - HU05: `Relatorios -> Atribuicoes por Area`
- HU04 cita periodo em formato `dd/mm/aaaa`, mas a tela real utiliza `input type="date"` (valor `yyyy-mm-dd`).
- Em `Movimentacao de Ativos`, o endpoint PDF sem filtros retorna mensagem de validacao em HTML; com query string correta retorna `application/pdf`.

## 14. Melhorias sugeridas para testabilidade
Resumo das melhorias esta em `docs/melhorias-sugeridas.md`, incluindo:
- Inclusao de `data-testid`
- Padronizacao de mensagens de erro
- Rastreabilidade da geracao de PDF
- Endpoints seguros para preparo de massa
- Melhor feedback visual para salvar/cancelar/gerar

---

## Scripts disponiveis
- `npm run cy:open`
- `npm run cy:open:chrome`
- `npm run cy:open:electron`
- `npm run cy:run`
- `npm run test:e2e`
- `npm run report`
- `npm run clean:reports`

## Problemas comuns
- Erro `bad IPC message, reason 114` ao abrir Cypress:
  - Use `npm run cy:open` (agora abre no Chrome por padrao) ou `npm run cy:open:chrome`.
  - Evite Electron nesse caso especifico.
- Aviso `Missing baseUrl in compilerOptions. tsconfig-paths will be skipped`:
  - Ajustado com `baseUrl` no `tsconfig.json`; caso persista, feche e abra o terminal novamente.
- Node muito antigo:
  - Use Node.js 20+ para maior estabilidade da interface do Cypress.

## Comandos customizados implementados
- `cy.login()`
- `cy.logout()`
- `cy.acessarMenu(nomeMenu)`
- `cy.selecionarOpcaoDropdown(labelOuSeletor, valor)`
- `cy.validarMensagemObrigatoria(campo)`
- `cy.interceptarGeracaoPdf(alias)`
- `cy.validarToastSucesso(textoEsperado)`
- `cy.fecharModal()`
- `cy.preencherPeriodo(dataInicial, dataFinal)`
- `cy.gerarRelatorio()`
- `cy.getByTestId(testId, fallbackSelector?)`
- `cy.validarMensagemPadronizada(chave)`
- `cy.auditarPdfGerado(contexto, urlRelativa)`
