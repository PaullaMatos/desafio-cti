# Cenarios de Teste Automatizados

Status padrao: `Automatizado`

## HU00 - Autenticacao

| ID | Tipo | Pre-condicao | Dado | Quando | Entao | Prioridade | Status automatizado |
|---|---|---|---|---|---|---|---|
| AUTH-01 | Positivo | Ambiente acessivel | Usuario e senha validos via env vars | Realizar login | Usuario acessa area autenticada | Alta | Automatizado |
| AUTH-02 | Negativo | Tela de login aberta | Senha invalida | Submeter formulario | Sistema permanece em login e exibe erro | Alta | Automatizado |

## HU01 - Cadastro de Atribuicoes

| ID | Tipo | Pre-condicao | Dado | Quando | Entao | Prioridade | Status automatizado |
|---|---|---|---|---|---|---|---|
| HU01-01 | Positivo | Usuario logado | Campos obrigatorios + ativo | Salvar nova atribuicao | Registro criado e visivel na listagem | Alta | Automatizado |
| HU01-02 | Negativo | Usuario logado na tela de cadastro | Campos obrigatorios vazios | Clicar em salvar | Campos obrigatorios permanecem invalidos | Alta | Automatizado |
| HU01-03 | Positivo | Usuario logado | Formulario preenchido parcialmente | Clicar em cancelar | Nenhum dado temporario persiste | Alta | Automatizado |
| HU01-04 | Positivo | Tela de cadastro aberta | Checkbox de Office desmarcada | Avaliar campo de Office | Campo Office permanece desabilitado | Media | Automatizado |
| HU01-05 | Positivo | Tela de cadastro aberta | Checkbox de Office marcada | Avaliar campo de Office | Campo Office habilita para selecao | Media | Automatizado |
| HU01-06 | Negativo | Formulario completo | Office marcado sem pacote (quando obrigatorio) | Salvar | Sistema bloqueia ou valida conforme regra real | Media | Automatizado |

## HU02 - Editar Atribuicoes

| ID | Tipo | Pre-condicao | Dado | Quando | Entao | Prioridade | Status automatizado |
|---|---|---|---|---|---|---|---|
| HU02-01 | Positivo | Usuario logado e lista de atribuicoes com dados | Atribuicao existente | Abrir edicao | Campos previamente salvos sao carregados | Alta | Automatizado |
| HU02-02 | Positivo | Atribuicao aberta em edicao | Alteracoes em modalidade/observacao | Salvar | Dados alterados sao persistidos | Alta | Automatizado |
| HU02-03 | Positivo | Atribuicao aberta com ativo | Status COM DEFEITO + observacao defeito | Remover ativo e adicionar novo | Alteracao salva com substituicao | Alta | Automatizado |
| HU02-04 | Positivo | Atribuicao aberta com ativo | Status DISPONIVEL | Remover ativo e adicionar novo | Alteracao salva com substituicao | Alta | Automatizado |
| HU02-05 | Positivo | Atribuicao aberta | Alteracoes nao salvas | Cancelar | Alteracoes descartadas | Alta | Automatizado |
| HU02-06 | Negativo | Atribuicao em edicao | Campo obrigatorio vazio | Salvar | Campo invalido impede conclusao | Alta | Automatizado |
| HU02-07 | Negativo | Atribuicao em edicao | Status vazio no ativo (quando obrigatorio) | Salvar | Sistema valida obrigatoriedade conforme regra real | Media | Automatizado |

## HU03 - Geracao de Termos

| ID | Tipo | Pre-condicao | Dado | Quando | Entao | Prioridade | Status automatizado |
|---|---|---|---|---|---|---|---|
| HU03-01 | Positivo | Usuario logado em Atribuicoes | Lista com atribuicoes | Abrir modal de termos | Modal exibido | Alta | Automatizado |
| HU03-02 | Positivo | Modal aberto | Tipos de termo disponiveis | Alternar radios | Selecao permanece mutuamente exclusiva | Alta | Automatizado |
| HU03-03 | Positivo | Modal aberto | Acao de fechar | Clicar no X | Modal e fechado | Media | Automatizado |
| HU03-04 | Positivo | Atribuicao selecionada | Tipo Responsabilidade | Gerar termo | URL de geracao chamada e PDF valido retornado | Alta | Automatizado |
| HU03-05 | Positivo | Atribuicao selecionada | Tipo Emprestimo | Gerar termo | URL de geracao chamada e PDF valido retornado | Alta | Automatizado |
| HU03-06 | Negativo | Modal aberto | Sem tipo selecionado | Gerar termo | Sistema alerta selecao obrigatoria | Alta | Automatizado |
| HU03-07 | Negativo | Modal aberto | Sem atribuicao selecionada | Gerar termo | Sistema alerta selecao obrigatoria | Alta | Automatizado |
| HU03-08 | Positivo | Lista com multiplas atribuicoes | Mais de uma atribuicao marcada | Gerar termo | URL contem multiplos ids na query string | Media | Automatizado |

## HU04 - Relatorio de Movimentacao de Ativos

| ID | Tipo | Pre-condicao | Dado | Quando | Entao | Prioridade | Status automatizado |
|---|---|---|---|---|---|---|---|
| HU04-01 | Positivo | Usuario logado na tela de relatorio | Area + periodo com dados | Pesquisar | Listagem atualizada com resultados | Alta | Automatizado |
| HU04-02 | Positivo | Pesquisa com dados realizada | Resultados retornados | Validar tela | Agrupamento por area/data exibido | Alta | Automatizado |
| HU04-03 | Positivo | Pesquisa com dados realizada | Link de relatorio disponivel | Gerar relatorio | PDF retornado com `application/pdf` | Alta | Automatizado |
| HU04-04 | Negativo | Tela de relatorio | Periodo futuro | Pesquisar | Sistema trata ausencia de dados sem quebrar fluxo | Media | Automatizado |
| HU04-05 | Negativo | Tela de relatorio | Data inicial maior que final | Pesquisar | Sistema trata periodo invalido sem falha tecnica | Media | Automatizado |
| HU04-06 | Negativo | Tela sem filtros | Tentativa de gerar PDF sem query | Gerar relatorio | Sistema retorna validacao ou PDF conforme regra real | Media | Automatizado |

## HU05 - Relatorio de Atribuicoes por Area

| ID | Tipo | Pre-condicao | Dado | Quando | Entao | Prioridade | Status automatizado |
|---|---|---|---|---|---|---|---|
| HU05-01 | Positivo | Usuario logado | Menu Relatorios | Acessar Atribuicoes por Area | Tela carregada com filtros | Alta | Automatizado |
| HU05-02 | Positivo | Tela carregada | Area valida | Pesquisar | Resultado por area exibido | Alta | Automatizado |
| HU05-03 | Positivo | Resultado com link PDF | Parametros de area/subarea | Gerar relatorio | PDF retornado com `application/pdf` | Alta | Automatizado |
| HU05-04 | Negativo | Tela carregada | Combinacao de filtros com baixa probabilidade de dados | Pesquisar | Sistema trata retorno sem quebrar fluxo | Media | Automatizado |
| HU05-05 | Informativo | Tela real sem periodo | Requisito do documento menciona periodo | Revisar filtro | Divergencia registrada em documentacao | Media | Automatizado |
