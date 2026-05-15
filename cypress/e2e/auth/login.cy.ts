import { selectors } from '../../support/selectors'

describe('Autenticacao - Login', () => {
  it('deve validar login com sucesso', () => {
    cy.login()
    cy.url().should('not.include', '/admins/sign_in')
    cy.get('body').should('contain.text', 'Dashboard')
  })

  it('deve validar login invalido', () => {
    const email = Cypress.env('USER_EMAIL') as string | undefined

    if (!email) {
      throw new Error('CYPRESS_USER_EMAIL nao configurado para o teste de login invalido.')
    }

    cy.intercept('POST', '**/admins/sign_in').as('invalidLogin')
    cy.visit('/admins/sign_in')

    cy.getByTestId(selectors.testIds.loginEmail, selectors.login.email).clear().type(email)
    cy.getByTestId(selectors.testIds.loginPassword, selectors.login.password)
      .clear()
      .type('senha-invalida-qa', { log: false })
    cy.getByTestId(selectors.testIds.loginSubmit, selectors.login.submit).click()

    cy.wait('@invalidLogin')
      .its('response.statusCode')
      .should((statusCode) => {
        expect([200, 401, 422]).to.include(statusCode)
      })

    cy.url().should('include', '/admins/sign_in')
    cy.validarMensagemPadronizada('loginInvalido')
  })
})
