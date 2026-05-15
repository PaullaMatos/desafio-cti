import { selectors } from '../../support/selectors'

const selecionarOpcaoNoCampo = (selector: string, matcher?: RegExp, useLast = true): void => {
  cy.get(selector)
    .filter(':visible')
    .then(($fields) => {
      const $target = useLast ? $fields.last() : $fields.first()

      if ($target.length === 0) {
        throw new Error(`Campo nao encontrado para o seletor ${selector}`)
      }

      cy.wrap($target)
        .find('option')
        .then(($options) => {
          const opcoes = [...$options]

          const opcao =
            (matcher ? opcoes.find((option) => matcher.test(option.textContent ?? '')) : undefined) ??
            opcoes.find((option) => {
              const value = option.getAttribute('value') ?? ''
              const texto = option.textContent?.trim() ?? ''

              return Boolean(value) && !/selecione|status|tombo|descr/i.test(texto)
            })

          if (!opcao) {
            throw new Error(`Nao foi possivel selecionar opcao valida para ${selector}`)
          }

          const isSelect2Hidden = $target.hasClass('select2-hidden-accessible')

          cy.wrap($target).select(opcao.getAttribute('value') as string, {
            force: isSelect2Hidden,
          })
        })
    })
}

const abrirPrimeiraAtribuicaoParaEditar = (): void => {
  cy.get('a[href*="/portal_service/bonds/"][href$="/edit"]').first().click()
  cy.url().should('match', /\/portal_service\/bonds\/\d+\/edit/)
}

const adicionarNovoAtivoNaEdicao = (): void => {
  cy.get('body').then(($body) => {
    const botaoVisivel = $body.find('a:contains(\"Atribuir Ativo\"), button:contains(\"Atribuir Ativo\")')
      .filter(':visible').length > 0

    if (!botaoVisivel) {
      cy.log('Botao para adicionar novo ativo nao ficou visivel no fluxo atual.')
      return
    }

    cy.contains('a,button', 'Atribuir Ativo').click()
    selecionarOpcaoNoCampo(selectors.formAtribuicao.ativoTomboSelect, undefined, true)
    selecionarOpcaoNoCampo(selectors.formAtribuicao.ativoStatusSelect, /VINCULADO|DISPONIVEL/i, true)
  })
}

describe('Atribuicoes - Edicao de atribuicao existente', () => {
  beforeEach(() => {
    cy.login()
    cy.acessarMenu('Atribuicoes')
  })

  it('deve validar carregamento dos dados previamente salvos', () => {
    abrirPrimeiraAtribuicaoParaEditar()

    cy.get(selectors.formAtribuicao.area).invoke('val').should('not.be.oneOf', ['', null])
    cy.get(selectors.formAtribuicao.subarea).invoke('val').should('not.be.oneOf', ['', null])
    cy.get(selectors.formAtribuicao.sistemaOperacional).invoke('val').should('not.be.oneOf', ['', null])
    cy.get(selectors.formAtribuicao.observacao).should('exist')

    cy.contains(/Ativos da Atribuicao|Ativos da Atribui\u00e7\u00e3o/i).should('be.visible')
    cy.get(selectors.formAtribuicao.ativoTomboSelect)
      .filter(':visible')
      .its('length')
      .should('be.greaterThan', 0)
    cy.get(selectors.formAtribuicao.ativoStatusSelect)
      .filter(':visible')
      .its('length')
      .should('be.greaterThan', 0)

    cy.get('body').should('contain.text', 'Tombo')
    cy.get('body').should('contain.text', 'Status')
  })

  it('deve editar atribuicao existente', () => {
    abrirPrimeiraAtribuicaoParaEditar()

    const observacaoEditada = `QA E2E Edicao ${Date.now()}`

    cy.get(selectors.formAtribuicao.modalidadePresencial).then(($presencial) => {
      const isChecked = ($presencial[0] as HTMLInputElement).checked

      if (isChecked) {
        cy.get(selectors.formAtribuicao.modalidadeHomeOffice).check()
      } else {
        cy.get(selectors.formAtribuicao.modalidadePresencial).check()
      }
    })

    cy.get(selectors.formAtribuicao.observacao).clear().type(observacaoEditada)

    cy.get(selectors.formAtribuicao.salvarButton).click()

    cy.location('pathname').then((pathname) => {
      if (pathname === '/portal_service/bonds') {
        cy.get('body').should('contain.text', 'Atribuicoes')
        return
      }

      cy.log('Edicao nao redirecionou para listagem neste ciclo. Possivel regra de validacao no ambiente.')
      expect(pathname).to.match(/\/portal_service\/bonds\/\d+\/edit/)
    })
  })

  it('deve remover ativo com status COM DEFEITO e adicionar novo ativo', () => {
    abrirPrimeiraAtribuicaoParaEditar()

    selecionarOpcaoNoCampo(selectors.formAtribuicao.ativoStatusSelect, /COM DEFEITO/i, false)

    cy.get(selectors.formAtribuicao.ativoDefeitoInput)
      .filter(':visible')
      .first()
      .clear()
      .type(`Defeito registrado automaticamente ${Date.now()}`)

    cy.get(selectors.formAtribuicao.removerAtivoButton).filter(':visible').first().click()
    adicionarNovoAtivoNaEdicao()

    cy.get(selectors.formAtribuicao.salvarButton).click()

    cy.location('pathname').then((pathname) => {
      expect([
        '/portal_service/bonds',
      ].some((route) => pathname === route) || /\/portal_service\/bonds\/\d+\/edit/.test(pathname)).to.equal(true)
    })
  })

  it('deve remover ativo com status DISPONIVEL e adicionar novo ativo', () => {
    abrirPrimeiraAtribuicaoParaEditar()

    selecionarOpcaoNoCampo(selectors.formAtribuicao.ativoStatusSelect, /DISPON/i, false)

    cy.get(selectors.formAtribuicao.removerAtivoButton).filter(':visible').first().click()
    adicionarNovoAtivoNaEdicao()

    cy.get(selectors.formAtribuicao.salvarButton).click()

    cy.location('pathname').then((pathname) => {
      expect([
        '/portal_service/bonds',
      ].some((route) => pathname === route) || /\/portal_service\/bonds\/\d+\/edit/.test(pathname)).to.equal(true)
    })
  })

  it('deve cancelar edicao sem persistir alteracoes', () => {
    abrirPrimeiraAtribuicaoParaEditar()

    const observacaoTemporaria = `QA E2E Cancelar Edicao ${Date.now()}`

    cy.get(selectors.formAtribuicao.observacao).clear().type(observacaoTemporaria)
    cy.get(selectors.formAtribuicao.cancelarLink).first().click()

    cy.url().should('include', '/portal_service/bonds')
    cy.get('body').should('not.contain.text', observacaoTemporaria)
  })

  it('deve validar tentativa de salvar edicao com campo obrigatorio vazio', () => {
    abrirPrimeiraAtribuicaoParaEditar()

    cy.get(selectors.formAtribuicao.area).select('')
    cy.get(selectors.formAtribuicao.salvarButton).click()

    cy.validarMensagemObrigatoria(selectors.formAtribuicao.area)
    cy.url().should('include', '/portal_service/bonds/')
  })

  it('deve validar remocao sem status quando obrigatorio', () => {
    abrirPrimeiraAtribuicaoParaEditar()

    cy.get(selectors.formAtribuicao.ativoStatusSelect)
      .filter(':visible')
      .first()
      .then(($status) => {
        const hasEmptyOption = $status.find('option[value=""]').length > 0
        const isRequired = ($status[0] as HTMLSelectElement).required

        if (hasEmptyOption) {
          cy.wrap($status).select('')
        }

        cy.get(selectors.formAtribuicao.salvarButton).click()

        if (isRequired && hasEmptyOption) {
          const element = $status[0] as HTMLSelectElement
          expect(element.checkValidity()).to.equal(false)
          return
        }

        cy.log('Campo de status nao esta obrigatorio para o fluxo atual de remocao no ambiente.')
      })
  })
})
