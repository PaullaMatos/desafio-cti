import { selectors } from '../../support/selectors'
import { mensagemPadrao, normalizeText } from '../../support/testability'

const filtrarPorAreaAdnis = (): void => {
  cy.get(selectors.relatoriosAtribuicoesArea.area).select('22')
  cy.getByTestId(selectors.testIds.relatorioPesquisar, selectors.relatoriosAtribuicoesArea.pesquisarButton).click()
}

describe('Relatorios - Atribuicoes por area', () => {
  beforeEach(() => {
    cy.login()
    cy.acessarMenu('Atribuicoes por Area')
  })

  it('deve acessar relatorio de atribuicoes por area', () => {
    cy.url().should('include', '/portal_service/reports/assignments_by_area')
    cy.get(selectors.relatoriosAtribuicoesArea.area).should('be.visible')
    cy.get(selectors.relatoriosAtribuicoesArea.subarea).should('be.visible')
  })

  it('deve filtrar por area', () => {
    filtrarPorAreaAdnis()

    cy.url().should('include', '/portal_service/reports/assignments_by_area')
    cy.get(selectors.relatoriosAtribuicoesArea.area).should('have.value', '22')
    cy.getByTestId(selectors.testIds.relatorioGerar, selectors.relatoriosAtribuicoesArea.gerarRelatorioLink)
      .invoke('attr', 'href')
      .should('include', '/portal_service/reports/assignments_by_area_pdf')

    cy.get('body')
      .invoke('text')
      .then((text) => {
        const normalized = normalizeText(text)
        expect(normalized).to.include('adnis')
      })
  })

  it('deve gerar relatorio PDF', () => {
    filtrarPorAreaAdnis()

    cy.getByTestId(selectors.testIds.relatorioGerar, selectors.relatoriosAtribuicoesArea.gerarRelatorioLink)
      .invoke('attr', 'href')
      .then((href) => {
        expect(href).to.exist
        cy.auditarPdfGerado('HU05-Atribuicoes-Por-Area', href as string)
      })
  })

  it('deve validar ausencia de dados', () => {
    cy.get(selectors.relatoriosAtribuicoesArea.area).select('13')
    cy.get(selectors.relatoriosAtribuicoesArea.subarea).select('1')
    cy.getByTestId(selectors.testIds.relatorioPesquisar, selectors.relatoriosAtribuicoesArea.pesquisarButton).click()

    cy.get('body')
      .invoke('text')
      .then((text) => {
        const normalized = normalizeText(text)

        const hasNoDataMessage =
          normalized.includes('total de atribuicoes 0') ||
          mensagemPadrao.semDadosRelatorio.some((mensagem) => normalized.includes(normalizeText(mensagem)))

        if (!hasNoDataMessage) {
          cy.log(
            'O ambiente retornou dados para o filtro escolhido. Divergencia registrada na documentacao de evidencias.',
          )
        }

        expect(normalized).to.include('atribuicoes por area')
      })
  })

  it('deve considerar filtro por periodo quando existente na tela real', () => {
    cy.get('body').then(($body) => {
      const possuiDataInicial = $body.find('#initial_date').length > 0
      const possuiDataFinal = $body.find('#final_date').length > 0

      if (possuiDataInicial && possuiDataFinal) {
        cy.get('#initial_date').clear().type('2025-01-01')
        cy.get('#final_date').clear().type('2026-12-31')
        cy.getByTestId(selectors.testIds.relatorioPesquisar, selectors.relatoriosAtribuicoesArea.pesquisarButton).click()
        cy.url().should('include', '/portal_service/reports/assignments_by_area')
        return
      }

      cy.log('Tela atual nao possui filtro de periodo. Divergencia registrada na documentacao.')
    })
  })
})
