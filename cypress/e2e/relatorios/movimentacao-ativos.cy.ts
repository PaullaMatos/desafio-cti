import { selectors } from '../../support/selectors'
import { mensagemPadrao, normalizeText } from '../../support/testability'

const areaComDados = 'ADNIS'
const periodoComDados = {
  inicial: '2025-01-01',
  final: '2026-12-31',
}

const periodoSemDados = {
  inicial: '2100-01-01',
  final: '2100-12-31',
}

const pesquisarMovimentacoes = (area: string, dataInicial: string, dataFinal: string): void => {
  cy.get(selectors.relatoriosMovimentacao.area).select(area)
  cy.preencherPeriodo(dataInicial, dataFinal)
  cy.getByTestId(selectors.testIds.relatorioPesquisar, selectors.relatoriosMovimentacao.pesquisarButton).click()
}

describe('Relatorios - Movimentacao de ativos', () => {
  beforeEach(() => {
    cy.login()
    cy.acessarMenu('Movimentacao de Ativos')
  })

  it('deve filtrar movimentacoes por area e periodo', () => {
    cy.intercept('POST', '**/portal_service/reports/moves_today').as('pesquisarMovimentacoes')

    pesquisarMovimentacoes(areaComDados, periodoComDados.inicial, periodoComDados.final)

    cy.wait('@pesquisarMovimentacoes')
      .its('response.statusCode')
      .should((statusCode) => {
        expect([200, 302]).to.include(statusCode)
      })

    cy.url().should('include', '/portal_service/reports/moves_today')
    cy.get('body')
      .invoke('text')
      .then((text) => {
        const normalized = normalizeText(text)

        expect(normalized).to.include(normalizeText(areaComDados))
        expect(normalized).to.include(normalizeText('Tombo'))
        expect(normalized).to.include(normalizeText('Lotacao Anterior'))
        expect(normalized).to.include(normalizeText('Lotacao Atual'))
      })
  })

  it('deve validar agrupamento por area e data', () => {
    pesquisarMovimentacoes(areaComDados, periodoComDados.inicial, periodoComDados.final)

    cy.get('body')
      .invoke('text')
      .then((pageText) => {
        const normalized = pageText.replace(/\s+/g, ' ')

        expect(normalized).to.include(areaComDados)
        expect(normalized).to.match(/\d{1,2} de [A-Za-z\u00c0-\u00ff]+ de 20\d{2} - \d+ movimenta/i)
      })
  })

  it('deve gerar relatorio PDF', () => {
    pesquisarMovimentacoes(areaComDados, periodoComDados.inicial, periodoComDados.final)

    cy.getByTestId(selectors.testIds.relatorioGerar, selectors.relatoriosMovimentacao.gerarRelatorioLink)
      .invoke('attr', 'href')
      .then((href) => {
        expect(href).to.exist
        cy.auditarPdfGerado('HU04-Movimentacao-Ativos', href as string)
      })
  })

  it('deve validar ausencia de dados', () => {
    pesquisarMovimentacoes(areaComDados, periodoSemDados.inicial, periodoSemDados.final)

    cy.get('body')
      .invoke('text')
      .then((text) => {
        const normalized = normalizeText(text)

        const hasNoDataMessage = mensagemPadrao.semDadosRelatorio.some((mensagem) =>
          normalized.includes(normalizeText(mensagem)),
        )

        const hasMovementGrouping = /\d{1,2} de [a-z]+ de 20\d{2} - \d+ movimenta/.test(normalized)

        expect(hasNoDataMessage || !hasMovementGrouping).to.equal(true)
      })
  })

  it('deve validar periodo invalido', () => {
    pesquisarMovimentacoes(areaComDados, '2026-12-31', '2025-01-01')

    cy.url().should('include', '/portal_service/reports')
    cy.get('body')
      .invoke('text')
      .then((text) => {
        const normalized = normalizeText(text)
        expect(normalized).to.include('movimentacao de ativos')
      })
  })

  it('deve validar tentativa de gerar relatorio sem filtros obrigatorios, se aplicavel', () => {
    cy.visit('/portal_service/reports/index')

    cy.getByTestId(selectors.testIds.relatorioGerar, selectors.relatoriosMovimentacao.gerarRelatorioLink)
      .invoke('attr', 'href')
      .then((href) => {
        expect(href).to.exist

        cy.request({
          method: 'GET',
          url: href as string,
          failOnStatusCode: false,
        }).then((response) => {
          if (response.headers['content-type']?.includes('application/pdf')) {
            expect(response.status).to.eq(200)
            return
          }

          const normalizedBody = normalizeText(String(response.body))
          const hasExpectedMessage = mensagemPadrao.pdfSemFiltro.some((mensagem) =>
            normalizedBody.includes(normalizeText(mensagem)),
          )
          expect(hasExpectedMessage).to.equal(true)
        })
      })
  })
})
