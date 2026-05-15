import { selectors } from './selectors'
import { mensagemPadrao, normalizeText, type ChaveMensagemPadrao } from './testability'

type MenuAlvo =
  | 'atribuicoes'
  | 'relatorios'
  | 'movimentacao de ativos'
  | 'atribuicoes por area'

const getRequiredEnv = (key: 'USER_EMAIL' | 'USER_PASSWORD'): string => {
  const value = Cypress.env(key)
  if (!value || typeof value !== 'string') {
    throw new Error(
      `Variavel de ambiente ausente: CYPRESS_${key}. Defina no .env antes de executar os testes.`,
    )
  }

  return value
}

const assertBaseUrl = (): void => {
  const baseUrl = Cypress.config('baseUrl')

  if (!baseUrl) {
    throw new Error(
      'CYPRESS_BASE_URL nao foi definida. Configure no .env para executar os testes E2E.',
    )
  }
}

Cypress.Commands.add('login', () => {
  assertBaseUrl()

  const email = getRequiredEnv('USER_EMAIL')
  const password = getRequiredEnv('USER_PASSWORD')

  cy.intercept('POST', '**/admins/sign_in').as('loginRequest')
  cy.visit('/admins/sign_in')

  cy.getByTestId(selectors.testIds.loginEmail, selectors.login.email).clear().type(email, { log: false })
  cy.getByTestId(selectors.testIds.loginPassword, selectors.login.password)
    .clear()
    .type(password, { log: false })
  cy.getByTestId(selectors.testIds.loginSubmit, selectors.login.submit).click()

  cy.wait('@loginRequest')
    .its('response.statusCode')
    .should((statusCode) => {
      expect([200, 302]).to.include(statusCode)
    })
  cy.url().should('not.include', '/admins/sign_in')
})

Cypress.Commands.add('logout', () => {
  cy.get('body').then(($body) => {
    const hasLogoutLink = $body.find(selectors.layout.logoutLink).length > 0
    if (!hasLogoutLink) {
      return
    }

    const hasOpenModal = $body.find('.modal.show').length > 0
    if (hasOpenModal) {
      const $visibleDismiss = $body.find('.modal.show [data-dismiss="modal"]:visible').first()

      if ($visibleDismiss.length > 0) {
        cy.wrap($visibleDismiss).click({ force: true })
      } else {
        cy.get('body').type('{esc}', { force: true })
      }
    }

    cy.get('body').then(($currentBody) => {
      const modalStillOpen = $currentBody.find('.modal.show').length > 0
      if (modalStillOpen) {
        // Fallback de teardown: modal ficou sobreposto e bloqueia o toggle do usuario.
        cy.get(selectors.layout.logoutLink).first().click({ force: true })
        cy.url().should('include', '/admins/sign_in')
        return
      }

      const hasVisibleLogout = $currentBody.find(`${selectors.layout.logoutLink}:visible`).length > 0
      if (hasVisibleLogout) {
        cy.get(selectors.layout.logoutLink).filter(':visible').first().click()
        cy.url().should('include', '/admins/sign_in')
        return
      }

      const hasVisibleLogoutToggle = $currentBody.find(`${selectors.layout.logoutToggle}:visible`).length > 0
      if (hasVisibleLogoutToggle) {
        cy.get(selectors.layout.logoutToggle).filter(':visible').first().click({ force: true })
      }

      cy.get('body').then(($bodyAfterToggle) => {
        const hasVisibleLogoutAfterToggle =
          $bodyAfterToggle.find(`${selectors.layout.logoutLink}:visible`).length > 0

        if (hasVisibleLogoutAfterToggle) {
          cy.get(selectors.layout.logoutLink).filter(':visible').first().click()
          cy.url().should('include', '/admins/sign_in')
          return
        }

        // Fallback final de teardown.
        cy.get(selectors.layout.logoutLink).first().click({ force: true })
        cy.url().should('include', '/admins/sign_in')
      })
    })
  })
})

Cypress.Commands.add('acessarMenu', (nomeMenu: string) => {
  const menu: MenuAlvo = normalizeText(nomeMenu) as MenuAlvo

  if (menu === 'atribuicoes') {
    cy.get(selectors.menus.atribuicoes).first().click()
    cy.url().should('include', '/portal_service/bonds')
    return
  }

  if (menu === 'relatorios') {
    cy.get(selectors.menus.relatoriosToggle).first().click()
    return
  }

  if (menu === 'movimentacao de ativos') {
    cy.get(selectors.menus.relatoriosToggle).first().click()
    cy.get(selectors.menus.movimentacaoAtivos).first().click()
    cy.url().should('include', '/portal_service/reports/index')
    return
  }

  if (menu === 'atribuicoes por area') {
    cy.get(selectors.menus.relatoriosToggle).first().click()
    cy.get(selectors.menus.atribuicoesPorArea).first().click()
    cy.url().should('include', '/portal_service/reports/assignments_by_area')
    return
  }

  throw new Error(`Menu nao mapeado: ${nomeMenu}`)
})

Cypress.Commands.add('selecionarOpcaoDropdown', (labelOuSeletor: string, valor: string) => {
  const looksLikeSelector = /[#.\[\]>]/.test(labelOuSeletor)

  if (looksLikeSelector) {
    cy.get(labelOuSeletor).select(valor)
    return
  }

  cy.contains('label', labelOuSeletor)
    .invoke('attr', 'for')
    .then((forId) => {
      if (!forId) {
        throw new Error(`Label sem atributo for: ${labelOuSeletor}`)
      }

      cy.get(`#${forId}`).select(valor)
    })
})

Cypress.Commands.add('validarMensagemObrigatoria', (campo: string) => {
  cy.get(campo).should('have.attr', 'required')

  cy.get(campo).then(($field) => {
    const element = $field[0] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    expect(
      element.checkValidity(),
      `Campo ${campo} deve estar invalido quando obrigatorio nao preenchido`,
    ).to.equal(false)
  })
})

Cypress.Commands.add('interceptarGeracaoPdf', (alias: string) => {
  const sanitizedAlias = alias.replace(/^@/, '')

  cy.intercept(
    'GET',
    /\/portal_service\/(bonds\/term_responsibility_asset|reports\/pdf_create|reports\/assignments_by_area_pdf).*/,
  ).as(sanitizedAlias)
})

Cypress.Commands.add('validarToastSucesso', (textoEsperado: string) => {
  cy.get('body').then(($body) => {
    const hasGrowl = $body.find('.bootstrap-growl').length > 0

    if (hasGrowl) {
      cy.contains('.bootstrap-growl', textoEsperado, { matchCase: false }).should('be.visible')
      return
    }

    cy.contains(textoEsperado, { matchCase: false }).should('exist')
  })
})

Cypress.Commands.add('fecharModal', () => {
  cy.get('button[data-dismiss="modal"], .modal button[aria-hidden="true"]').first().click()
})

Cypress.Commands.add('preencherPeriodo', (dataInicial: string, dataFinal: string) => {
  cy.get(selectors.relatoriosMovimentacao.dataInicial).clear().type(dataInicial)
  cy.get(selectors.relatoriosMovimentacao.dataFinal).clear().type(dataFinal)
})

Cypress.Commands.add('gerarRelatorio', () => {
  cy.get('a[href*="pdf_create"], a[href*="assignments_by_area_pdf"]').first().click()
})

Cypress.Commands.add(
  'getByTestId',
  (testId: string, fallbackSelector?: string): Cypress.Chainable<JQuery<HTMLElement>> => {
    const selector = `[data-testid="${testId}"]`

    return cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        return cy.get(selector)
      }

      if (fallbackSelector) {
        return cy.get(fallbackSelector)
      }

      throw new Error(`Elemento com data-testid="${testId}" nao encontrado e nenhum fallback foi informado.`)
    })
  },
)

Cypress.Commands.add('validarMensagemPadronizada', (chave: ChaveMensagemPadrao) => {
  const candidatos = mensagemPadrao[chave]

  cy.get('body')
    .invoke('text')
    .then((text) => {
      const normalizedBody = normalizeText(text)
      const match = candidatos.some((mensagem) => normalizedBody.includes(normalizeText(mensagem)))

      expect(
        match,
        `Mensagem padronizada nao encontrada para chave ${chave}. Esperado um dos textos: ${candidatos.join(' | ')}`,
      ).to.equal(true)
    })
})

Cypress.Commands.add('auditarPdfGerado', (contexto: string, urlRelativa: string) => {
  cy.request({
    method: 'GET',
    url: urlRelativa,
    encoding: 'binary',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status, `Status PDF ${contexto}`).to.eq(200)
    expect(response.headers['content-type'], `content-type PDF ${contexto}`).to.include('application/pdf')
    expect(response.body.slice(0, 5), `assinatura PDF ${contexto}`).to.eq('%PDF-')

    const disposition = String(response.headers['content-disposition'] ?? '')
    const matchFilename = disposition.match(/filename="?([^"]+)"?/) // inline; filename="x.pdf"
    const fileName = matchFilename?.[1] ?? 'arquivo-sem-nome.pdf'
    const requestId = String(response.headers['x-request-id'] ?? '')

    cy.task('appendPdfAudit', {
      context: contexto,
      url: urlRelativa,
      statusCode: response.status,
      contentType: String(response.headers['content-type'] ?? ''),
      fileName,
      requestId,
      timestamp: new Date().toISOString(),
    })
  })
})
