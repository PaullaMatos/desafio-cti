export const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

export const mensagemPadrao = {
  loginInvalido: ['email ou senha invalidos', 'email ou senha invalido'],
  termoSemSelecao: ['selecione um tipo de termo e uma ou mais atribuicoes'],
  pdfSemFiltro: ['informe uma area e/ou periodo para gerar o pdf'],
  semDadosRelatorio: ['nao ha dados disponiveis', 'nenhum dado', 'sem dados', 'sem movimentacoes'],
} as const

export type ChaveMensagemPadrao = keyof typeof mensagemPadrao
