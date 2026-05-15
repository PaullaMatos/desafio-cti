/// <reference types="cypress" />

import type { ChaveMensagemPadrao } from './testability'

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
      logout(): Chainable<void>
      acessarMenu(nomeMenu: string): Chainable<void>
      selecionarOpcaoDropdown(labelOuSeletor: string, valor: string): Chainable<void>
      validarMensagemObrigatoria(campo: string): Chainable<void>
      interceptarGeracaoPdf(alias: string): Chainable<void>
      validarToastSucesso(textoEsperado: string): Chainable<void>
      fecharModal(): Chainable<void>
      preencherPeriodo(dataInicial: string, dataFinal: string): Chainable<void>
      gerarRelatorio(): Chainable<void>
      getByTestId(testId: string, fallbackSelector?: string): Chainable<JQuery<HTMLElement>>
      validarMensagemPadronizada(chave: ChaveMensagemPadrao): Chainable<void>
      auditarPdfGerado(contexto: string, urlRelativa: string): Chainable<void>
    }
  }
}

export {}
