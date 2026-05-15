# Plano de Testes - Inventario CTI (Cypress E2E)

## Objetivo do plano
Definir estrategia, criterios e cobertura para validar as funcionalidades criticas do Inventario CTI por meio de testes E2E automatizados com Cypress.

## Escopo
- Autenticacao (login valido e invalido)
- Cadastro de atribuicoes (HU01)
- Edicao de atribuicoes (HU02)
- Geracao de termos em PDF (HU03)
- Relatorio de movimentacao de ativos (HU04)
- Relatorio de atribuicoes por area (HU05)

## Fora de escopo
- Testes de performance/carga
- Testes de seguranca ofensiva
- Testes mobile nativos
- Validacao visual pixel-perfect

## Estrategia de teste
- Abordagem E2E guiada por fluxo de negocio.
- Dados criados preferencialmente pela interface.
- Selectors estaveis por `id`, `name`, `href` e labels.
- Sincronizacao por `cy.intercept` (evitando `cy.wait` fixo).
- Validacao de PDF por evidencias tecnicas: status, content-type e assinatura `%PDF-`.

## Tipos de teste
- Funcional positivo
- Funcional negativo
- Regressao dos fluxos principais
- Validacao tecnica de integracao HTTP (requests e responses criticas)

## Criterios de entrada
- Ambiente disponivel
- Credenciais validas via env vars
- Dependencias instaladas (`npm install`)
- Cypress configurado

## Criterios de saida
- Execucao de todos os specs planejados
- Evidencias geradas (videos/screenshots/relatorio)
- Falhas triadas e registradas
- Documentacao atualizada

## Ferramentas utilizadas
- Cypress 13.17.0
- TypeScript
- Mochawesome + merge + report generator
- dotenv

## Riscos
- Falta de `data-testid` (fragilidade moderada de seletores)
- Dependencia de massa existente no ambiente
- Variacao de comportamento do ambiente entre execucoes
- Regras de negocio dinamicas em campos condicionais (Pacote Office, status de ativo)

## Massa de dados
- Dados unicos por timestamp em observacoes
- Busca de atribuicao existente para edicao/termos
- Filtros com area conhecida (`ADNIS`) para cenarios positivos de relatorio
- Filtros de periodo futuro para tentativa de cenarios sem dados

## Ambientes
- QA: `http://testeqa.pge.ce.gov.br`

## Evidencias
- `cypress/screenshots` (falhas)
- `cypress/videos` (execucoes)
- `cypress/reports/mochawesome` (JSON)
- `cypress/reports/html/index.html` (consolidado)

## Criterios de aceite por historia de usuario
### HU01 - Cadastro de Atribuicoes
- Fluxo de cadastro com campos obrigatorios validado
- Modalidade, SO e regra condicional de Pacote Office cobertas
- Vinculacao de ativo e salvar/cancelar cobertos
- Cenarios negativos de obrigatoriedade cobertos

### HU02 - Editar Atribuicoes
- Carregamento de dados existentes validado
- Edicao e persistencia de alteracoes validada
- Fluxos de remocao/substituicao de ativo (COM DEFEITO e DISPONIVEL) cobertos
- Cancelamento sem persistencia coberto

### HU03 - Geracao de Termos
- Modal e tipos de termo validados
- Exclusividade de selecao validada
- Geracao de PDF por responsabilidade e emprestimo validada tecnicamente
- Cenarios negativos sem selecao cobertos

### HU04 - Relatorio Movimentacao de Ativos
- Pesquisa por area/periodo validada
- Agrupamento por area/data validado
- Geracao de PDF validada tecnicamente
- Tentativa de cenarios sem dados e periodo invalido coberta

### HU05 - Relatorio Atribuicoes por Area
- Acesso e filtros da tela validos
- Pesquisa e agrupamento por area validados
- Geracao de PDF validada tecnicamente
- Tratamento de ausencia de dados coberto com comportamento real do ambiente
