# Melhorias Sugeridas para Testabilidade

## 1) Inclusao de data-testid
Adicionar `data-testid` nos elementos principais de fluxo:
- login
- filtros de relatorios
- botoes de salvar/cancelar/gerar
- controles de modal de termos
- controles de adicao/remocao de ativos

## 2) Padronizacao de mensagens de erro
Padronizar estrutura e textos de validacao para facilitar asserts automatizados:
- campos obrigatorios
- periodo invalido
- tentativa de geracao de PDF sem filtros
- tentativa de termo sem selecoes obrigatorias

## 3) Melhor rastreabilidade em geracao de PDF
- Expor id de requisicao no front-end
- Registrar logs de auditoria por documento gerado
- Padronizar endpoint e parametros para todos os relatorios

## 4) Endpoints auxiliares para massa de teste (quando permitido)
Criar endpoints de apoio QA para:
- criar atribuicao de teste
- criar ativo disponivel
- limpar dados de teste nao criticos

## 5) Padronizacao de labels e obrigatoriedade
- Uniformizar labels (`Area`, `Subarea`, `Colaborador`, etc.)
- Manter regra de obrigatoriedade documentada e previsivel
- Exibir indicacao visual clara para campos condicionais (ex.: Pacote Office)

## 6) Feedback visual mais claro
- Toasts consistentes para salvar/cancelar/editar/gerar
- Mensagens claras para ausencia de dados nos relatorios
- Estados de carregamento padronizados

## 7) Ajustes de acessibilidade que ajudam QA
- Associacao robusta `label` x `for`
- `aria-label` para botoes iconicos (ex.: fechar modal)
- Navegacao por teclado em campos e modais

## 8) Documentacao funcional alinhada com comportamento real
- Corrigir incoerencia textual entre HU04 e HU05 no documento do desafio
- Especificar oficialmente formato esperado de data na interface real
- Definir regra esperada para geracao de PDF sem filtro
