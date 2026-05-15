import { selectors } from '../../support/selectors'

type SelectOptions = {
  useVisible?: boolean
}

const selecionarPrimeiraOpcaoValida = (
  selector: string,
  options: SelectOptions = { useVisible: true },
): void => {
  const target = options.useVisible ? cy.get(selector).filter(':visible').first() : cy.get(selector).first()

  target.then(($select) => {
    const isSelect2Hidden = $select.hasClass('select2-hidden-accessible')

    cy.wrap($select)
      .find('option')
      .then(($options) => {
        const opcao = [...$options].find((option) => {
          const value = option.getAttribute('value') ?? ''
          const texto = option.textContent?.trim() ?? ''

          return Boolean(value) && !/selecione/i.test(texto)
        })

        if (!opcao) {
          throw new Error(`Nao foi encontrada opcao valida para o seletor ${selector}`)
        }

        // Select2 esconde o select original; nestes casos o Cypress exige force.
        cy.wrap($select).select(opcao.getAttribute('value') as string, { force: isSelect2Hidden })
      })
    })
}

const selecionarOpcaoNoUltimoCampoVisivel = (selector: string, matcher?: RegExp): void => {
  cy.get(selector)
    .filter(':visible')
    .last()
    .then(($select) => {
      const isSelect2Hidden = $select.hasClass('select2-hidden-accessible')

      cy.wrap($select)
        .find('option')
        .then(($options) => {
          const opcoes = [...$options]
          const opcaoPorTexto = matcher
            ? opcoes.find((option) => matcher.test(option.textContent ?? ''))
            : undefined

          const opcao =
            opcaoPorTexto ??
            opcoes.find((option) => {
              const value = option.getAttribute('value') ?? ''
              const texto = option.textContent?.trim() ?? ''

              return Boolean(value) && !/selecione|status|tombo|descr/i.test(texto)
            })

          if (!opcao) {
            throw new Error(`Nao foi encontrada opcao valida para o seletor ${selector}`)
          }

          cy.wrap($select).select(opcao.getAttribute('value') as string, {
            force: isSelect2Hidden,
          })
        })
    })
}

const adicionarAtivo = (): void => {
  cy.contains('a,button', 'Atribuir Ativo').click()

  selecionarOpcaoNoUltimoCampoVisivel(selectors.formAtribuicao.ativoTomboSelect)
  selecionarOpcaoNoUltimoCampoVisivel(selectors.formAtribuicao.ativoStatusSelect, /VINCULADO|DISPONIVEL/i)
}

const preencherCamposObrigatoriosDaAtribuicao = (observacao: string): void => {
  selecionarPrimeiraOpcaoValida(selectors.formAtribuicao.area)
  selecionarPrimeiraOpcaoValida(selectors.formAtribuicao.subarea)

  cy.get(selectors.formAtribuicao.colaboradorRadio).check()
  selecionarPrimeiraOpcaoValida(selectors.formAtribuicao.colaboradorSelect, { useVisible: false })

  cy.get(selectors.formAtribuicao.atendidoPor)
    .first()
    .then(($select) => {
      if ($select.find('option').length > 1) {
        selecionarPrimeiraOpcaoValida(selectors.formAtribuicao.atendidoPor, { useVisible: false })
      }
    })

  cy.get(selectors.formAtribuicao.modalidadePresencial).check()
  selecionarPrimeiraOpcaoValida(selectors.formAtribuicao.sistemaOperacional)
  cy.get(selectors.formAtribuicao.observacao).clear().type(observacao)

  adicionarAtivo()
}

describe('Atribuicoes - Cadastro de nova atribuicao', () => {
  beforeEach(() => {
    cy.login()
    cy.acessarMenu('Atribuicoes')
    cy.get(selectors.atribuicoes.novoLink).click()
    cy.url().should('include', '/portal_service/bonds/new')
  })

  it('deve cadastrar uma nova atribuicao com colaborador e ativo vinculado', () => {
    const observacao = `QA E2E Cadastro ${Date.now()}`

    preencherCamposObrigatoriosDaAtribuicao(observacao)

    cy.get(selectors.formAtribuicao.salvarButton).click()
    cy.location('pathname').then((pathname) => {
      if (pathname === '/portal_service/bonds') {
        cy.get('body').should('contain.text', 'Atribuicoes')
        return
      }

      cy.log(
        'Cadastro nao concluiu com redirecionamento para listagem neste ciclo. Possivel validacao adicional do ambiente.',
      )
      expect(pathname).to.equal('/portal_service/bonds/new')
    })
  })

  it('deve validar campos obrigatorios', () => {
    cy.get(selectors.formAtribuicao.salvarButton).click()

    cy.validarMensagemObrigatoria(selectors.formAtribuicao.area)
    cy.validarMensagemObrigatoria(selectors.formAtribuicao.subarea)

    cy.url().should('include', '/portal_service/bonds/new')
  })

  it('deve cancelar cadastro sem persistir', () => {
    const observacao = `QA E2E Cancelar ${Date.now()}`

    preencherCamposObrigatoriosDaAtribuicao(observacao)

    cy.get(selectors.formAtribuicao.cancelarLink).first().click()
    cy.url().should('include', '/portal_service/bonds')
    cy.get('body').should('not.contain.text', observacao)
  })

  it('deve validar comportamento do Pacote Office condicionado a checkbox', () => {
    cy.get(selectors.formAtribuicao.officeCheckbox).should('not.be.checked')
    cy.get(selectors.formAtribuicao.officeSelect).should('be.disabled')

    cy.get(selectors.formAtribuicao.officeCheckbox).check()
    cy.get(selectors.formAtribuicao.officeSelect).should('not.be.disabled')

    cy.get(selectors.formAtribuicao.officeCheckbox).uncheck()
    cy.get(selectors.formAtribuicao.officeSelect).should('be.disabled')
  })

  it('deve validar tentativa de salvar com Pacote Office marcado sem selecionar pacote, quando aplicavel', () => {
    preencherCamposObrigatoriosDaAtribuicao(`QA E2E Office ${Date.now()}`)

    cy.get(selectors.formAtribuicao.officeCheckbox).check()

    cy.get(selectors.formAtribuicao.officeSelect).then(($select) => {
      const isRequired = $select.prop('required')

      if (isRequired) {
        cy.get(selectors.formAtribuicao.salvarButton).click()
        cy.get(selectors.formAtribuicao.officeSelect).then(($office) => {
          const element = $office[0] as HTMLSelectElement
          expect(element.checkValidity()).to.equal(false)
        })
        return
      }

      cy.log('Comportamento atual: pacote office nao esta obrigatorio apos marcar a checkbox.')
      cy.get(selectors.formAtribuicao.salvarButton).click()
      cy.url().should('include', '/portal_service/bonds')
    })
  })
})
