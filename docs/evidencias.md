# Evidencias de Execucao

## Objetivo
Padronizar onde localizar evidencias da suite E2E e como interpretar os artefatos.

## Artefatos gerados
- Videos: `cypress/videos`
- JSON Mochawesome por execucao: `cypress/reports/mochawesome`
- Relatorio consolidado HTML: `cypress/reports/html/index.html`

## Passo a passo para gerar evidencias
1. Executar os testes:
```bash
npm run cy:run
```
2. Consolidar relatorio HTML:
```bash
npm run report
```

## Checklist de evidencias esperadas por historia
- HU01: cadastro, validacao de obrigatorios, cancelamento, regra Office
- HU02: carregamento de dados, edicao, remocao/substituicao, cancelamento
- HU03: modal, exclusividade, geracao dos dois tipos de termo, alertas negativos
- HU04: pesquisa por filtros, agrupamento em tela, PDF, tratamento de ausencia
- HU05: pesquisa por area, PDF, tratamento de ausencia conforme ambiente
- AUTH: login valido e invalido

## Notas tecnicas sobre PDF
- Validacao tecnica aplicada:
  - status HTTP `200`
  - `content-type` contendo `application/pdf`
  - assinatura binaria `%PDF-`
- A leitura textual interna do PDF nao e obrigatoria para aprovacao da suite.

## Divergencias importantes registradas
- HU05 no documento repete narrativa da HU04, mas fluxo real e distinto.
- HU04 descreve periodo `dd/mm/aaaa`, enquanto a tela usa campo `type=date` (`yyyy-mm-dd`).
- Endpoint de PDF da HU04 exige query de filtros para retornar PDF; sem query pode retornar HTML com validacao.
