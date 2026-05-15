export const selectors = {
  // Preferir data-testid quando o sistema disponibilizar; fallback atual continua funcional.
  testIds: {
    loginEmail: 'login-email-input',
    loginPassword: 'login-password-input',
    loginSubmit: 'login-submit-button',
    atribuicoesNovo: 'atribuicoes-novo-button',
    gerarTermos: 'atribuir-gerar-termos-button',
    relatorioGerar: 'relatorio-gerar-button',
    relatorioPesquisar: 'relatorio-pesquisar-button',
  },

  login: {
    email: '#admin_email',
    password: '#admin_password',
    submit: 'input[type="submit"][value="Entrar"]',
    invalidCredentialsToast:
      '.bootstrap-growl:contains("Email ou senha invalidos"), .bootstrap-growl:contains("Email ou senha inválidos")',
  },

  layout: {
    sidebar: '#accordionSidebar',
    logoutLink: 'a[href="/admins/sign_out"]',
    logoutToggle:
      '.topbar .dropdown-toggle, .navbar .dropdown-toggle, button.dropdown-toggle, a.dropdown-toggle, [data-toggle="dropdown"]',
  },

  menus: {
    atribuicoes: 'a[href="/portal_service/bonds"]',
    relatoriosToggle: 'a[data-target="#collapseTwo"]',
    movimentacaoAtivos: 'a[href="/portal_service/reports/index"]',
    atribuicoesPorArea: 'a[href="/portal_service/reports/assignments_by_area"]',
  },

  atribuicoes: {
    pageTitle: 'h1, h2, h3, h4, h5, h6',
    novoLink: 'a[href="/portal_service/bonds/new"]',
    gerarTermosButton: 'button[data-target="#generate_term"]',
    allBondsCheckbox: '#all_bonds',
    bondRowCheckbox: 'input.marcar[name="bonds_ids[]"]',
    modalGerarTermos: '#generate_term',
    modalCloseButton: '#generate_term button[data-dismiss="modal"]',
    termoResponsabilidadeRadio: '#term_type_liability',
    termoEmprestimoRadio: '#term_type_loan',
    gerarTermoButton: '#btn-termo',
    cancelarLink: 'a[href="/portal_service/bonds"]',
  },

  formAtribuicao: {
    area: '#set_area',
    subarea: '#resp_subarea',
    colaboradorRadio: '#bond_employee_type_colaborador',
    semColaboradorRadio: '#bond_employee_type_sem_usuario',
    subareaSemColaboradorRadio: '#bond_employee_type_subarea',
    colaboradorSelect: '#collaborators',
    atendidoPor: '#attended',
    modalidadePresencial: '#bond_modality_presencial',
    modalidadeHomeOffice: '#bond_modality_home_office',
    sistemaOperacional: '#so',
    officeCheckbox: '#check_office',
    officeSelect: '#key',
    observacao: '#bond_observation',
    atribuirAtivoButton: 'a:contains("Atribuir Ativo"), a.btn:contains("Atribuir Ativo")',
    ativoTomboSelect: '.add_ativo #set_tombo, #set_tombo',
    ativoDescricaoSelect: '.add_ativo #set_description, #set_description',
    ativoStatusSelect: '.add_ativo #set_status, #set_status',
    ativoDefeitoInput: 'input[name*="bond_asset_attributes"][name*="observation"]',
    salvarButton: 'input[type="submit"][value="Salvar"]',
    cancelarLink: 'a[href="/portal_service/bonds"]',
    removerAtivoButton: 'a.remove_fields, a:contains("Remover")',
  },

  relatoriosMovimentacao: {
    area: '#area_name',
    dataInicial: '#initial_date',
    dataFinal: '#final_date',
    pesquisarButton: 'input[type="submit"][value="Pesquisar"]',
    gerarRelatorioLink: 'a[href*="/portal_service/reports/pdf_create"]',
  },

  relatoriosAtribuicoesArea: {
    area: '#search_area',
    subarea: '#search_subarea',
    pesquisarButton: 'input[type="submit"][value="Pesquisar"]',
    gerarRelatorioLink: 'a[href*="/portal_service/reports/assignments_by_area_pdf"]',
  },
} as const
