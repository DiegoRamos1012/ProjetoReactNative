import { StyleSheet } from "react-native";

// ==========================================
// CORES GLOBAIS
// ==========================================
export const colors = {
  primary: "#FFFFFF",
  secondary: "#0C2340", // Azul marinho como na logo
  background: "#000000",
  input: "#333333",
  inputFocused: "#444444",
  white: "#FFFFFF",
  text: "#FFFFFF",
  textDark: "#333333",
  textLight: "#666666",
  textLighter: "#dddddd",
  error: "#FF375B",
  disabled: "#cccccc",
  adminRole: "#c2410c",
  clientRole: "#0891b2",
  funcionarioCargo: "#047857",
  clienteCargo: "#4b5563",
  barbeiroCargo: "#0891b2",
  gerenteCargo: "#9333ea",
  gradient: {
    start: "#0C2340", // Azul marinho escuro (como no poste da logo)
    middle: "#0F172A", // Tom intermediário
    end: "#000000", // Preto para o fundo
  },
  button: {
    primary: "#3A5199", // Mantendo a cor azul do botão das telas de cadastro
    secondary: "#4a9eff", // Azul mais claro para links e botões secundários
  },
  barber: {
    gold: "#D4AF37", // Dourado da coroa
    red: "#B22222", // Vermelho do poste
    navy: "#0C2340", // Azul marinho do personagem
    lightGold: "rgba(212, 175, 55, 0.15)", // Dourado com baixa opacidade para detalhes
  },
  link: "#4a9eff", // Cor dos links na aplicação - mesmo das telas de cadastro
};

export const globalStyles = StyleSheet.create({
  // ==========================================
  // ESTILOS COMUNS/COMPARTILHADOS
  // ==========================================
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  textInput: {
    width: "100%",
    height: 40,
    backgroundColor: colors.input,
    borderRadius: 20,
    paddingLeft: 20,
    color: colors.text,
    marginBottom: 20,
  },
  singleButton: {
    width: "60%",
    height: 40,
    backgroundColor: colors.input,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  singleButtonText: {
    color: colors.text,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordGroup: {
    width: "100%",
    marginBottom: 20,
  },
  passwordInput: {
    paddingRight: 50,
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  iconWrapper: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -22 }],
  },
  image: {
    width: 400,
    height: 450,
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: "black",
    margin: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: colors.textLight,
    marginTop: 20,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: colors.textLight,
  },

  // ==========================================
  // ESTILOS DA TELA DE HOME
  // ==========================================
  homeContainer: {
    flex: 1,
    backgroundColor: colors.gradient.middle,
  },
  header: {
    backgroundColor: colors.gradient.start,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  userEmail: {
    fontSize: 14,
    color: colors.white,
  },
  logoutButton: {
    padding: 10,
  },
  banner: {
    backgroundColor: colors.secondary,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: colors.textLighter,
  },
  section: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: colors.gradient.end,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.primary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 15,
  },
  servicosList: {
    marginTop: 10,
  },
  servicoCard: {
    backgroundColor: colors.gradient.end,
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: 150,
    alignItems: "center",
  },
  servicoIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  servicoNome: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  servicoPreco: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: "600",
  },
  servicoTempo: {
    fontSize: 13,
    color: colors.textLight,
  },

  // ==========================================
  // ESTILOS DE AGENDAMENTOS
  // ==========================================
  agendamentoItem: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  agendamentoInfo: {
    flex: 1,
  },
  agendamentoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  agendamentoServico: {
    fontSize: 16,
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: 5,
  },
  agendamentoData: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 3,
  },
  agendamentoBarbeiro: {
    fontSize: 14,
    color: colors.secondary,
  },

  // ==========================================
  // ESTILOS DE MODAIS DE AGENDAMENTO
  // ==========================================
  modalView: {
    width: "85%",
    backgroundColor: colors.gradient.end,
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.textDark,
  },
  modalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    alignSelf: "center",
  },
  modalServico: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  modalPreco: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 20,
  },
  modalDescricao: {
    fontWeight: "bold",
    fontSize: 16,
  },
  horarioContainer: {
    marginVertical: 15,
  },
  horarioTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  horarioOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  horarioOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  horarioSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  horarioText: {
    color: colors.textDark,
  },
  horarioTextSelected: {
    color: colors.white,
  },
  agendarButton: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  agendarButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  agendarButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  // ==========================================
  // ESTILOS DA TELA DE PERFIL (PROFILE)
  // ==========================================
  backButton: {
    padding: 5,
  },
  profileContent: {
    flex: 1,
    padding: 20,
  },
  profileLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
  },
  profileAvatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.white,
  },
  formInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    color: colors.textDark,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#FFF",
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  radioSelected: {
    backgroundColor: colors.button.primary,
    borderColor: colors.button.primary,
  },
  radioText: {
    fontSize: 16,
    color: colors.textDark,
  },
  radioTextSelected: {
    color: "#FFF",
  },
  backButtonContainer: {
    marginTop: 15,
    backgroundColor: "#555",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
    width: "60%",
  },
  backButtonText: {
    color: colors.white,
    marginLeft: 8,
  },

  // ==========================================
  // ESTILOS DE BOTÕES COMUNS
  // ==========================================
  button: {
    backgroundColor: colors.button.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // ==========================================
  // ESTILOS DA TELA ADMIN TOOLS
  // ==========================================
  adminContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  adminHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
  },
  adminTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
  },
  adminRefreshButton: {
    backgroundColor: colors.button.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  adminRefreshButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  userList: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    minWidth: 150,
  },
  adminUserName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: colors.textDark,
  },
  adminUserEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userCargo: {
    fontSize: 14,
    fontWeight: "bold",
  },
  adminRoleText: {
    color: colors.adminRole,
  },
  clientRoleText: {
    color: colors.clientRole,
  },
  funcionarioCargo: {
    color: colors.funcionarioCargo,
  },
  clienteCargo: {
    color: colors.clienteCargo,
  },
  roleActionButton: {
    backgroundColor: colors.button.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  roleActionButtonText: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  cargoActionButton: {
    backgroundColor: colors.funcionarioCargo,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  cargoActionButtonText: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  horizontalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    width: "100%",
  },
  cargoSelectionContainer: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cargoSelectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.textDark,
  },
  cargoOptionsList: {
    flexDirection: "column",
  },
  cargoOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cargoOptionSelected: {
    backgroundColor: "#f5f5f5",
  },
  cargoRadioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.button.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cargoRadioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.button.primary,
  },
  cargoText: {
    fontSize: 14,
    flexShrink: 1,
  },
  cargoModal: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignSelf: "center",
  },
  cargoModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  cargoModalClose: {
    marginTop: 15,
    alignSelf: "center",
  },
  userCardLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  userCardLoadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.secondary,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: "#aaaaaa",
  },

  // ==========================================
  // ESTILOS DO COMPONENTE SERVIÇOS E HORÁRIOS
  // ==========================================
  servicosHorariosContainer: {
    flex: 1,
  },
  servicosContainer: {
    marginTop: 15,
    flex: 1,
  },
  addServicoButton: {
    backgroundColor: colors.button.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  addServicoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  servicosListContainer: {
    paddingBottom: 20,
  },
  servicoListItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  servicoInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  servicoIconContainerSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  servicoTextContainer: {
    flex: 1,
  },
  servicoNomeItem: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  servicoPrecoItem: {
    fontSize: 15,
    color: colors.button.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  servicoTempoItem: {
    fontSize: 14,
    color: colors.textLight,
  },
  servicoActions: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: colors.button.primary,
    borderRadius: 4,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 4,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  servicoModalView: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  servicoModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.button.primary,
    marginTop: 10,
  },
  formRow: {
    flexDirection: "row",
  },
  priceInputContainer: {
    position: "relative",
  },
  priceClearButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -12,
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  priceHint: {
    marginTop: 5,
    fontSize: 12,
    color: colors.textLight,
    fontStyle: "italic",
  },
  iconSelector: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    maxHeight: 120,
  },
  iconOption: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  iconSelected: {
    backgroundColor: colors.button.primary,
    borderColor: colors.button.primary,
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
  iconTextSelected: {
    color: "#fff",
  },
  horariosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
  },
  servicoHorarioOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 5,
    backgroundColor: "#fff",
  },
  horarioPersonalizadoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addHorarioButton: {
    backgroundColor: colors.button.primary,
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  switchHelp: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.button.primary,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginTop: 20,
  },

  // ==========================================
  // ESTILOS DO FORMULÁRIO DE SERVIÇOS
  // ==========================================
  serviceFormTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.button.primary,
    textAlign: "center",
  },
  serviceFormGroup: {
    marginBottom: 15,
  },
  serviceFormLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.textDark,
  },
  serviceFormInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    color: colors.textDark,
  },
  serviceFormTextArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  iconButtonServices: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedIconButtonServices: {
    backgroundColor: colors.button.primary,
    borderColor: colors.button.primary,
  },
  serviceFormButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  serviceFormCancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    marginRight: 10,
  },
  serviceFormCancelButtonText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: "bold",
  },
  serviceFormSaveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.button.primary,
    alignItems: "center",
  },
  serviceFormSaveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ==========================================
  // ESTILOS DE LOGIN/REGISTER/WELCOME MELHORADOS
  // ==========================================
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  logoImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
    resizeMode: "contain",
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  authInput: {
    width: "100%",
    height: 50,
    backgroundColor: colors.input,
    borderRadius: 25,
    paddingLeft: 20,
    paddingRight: 20,
    color: colors.text,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  authInputFocused: {
    borderColor: colors.button.primary,
    backgroundColor: colors.inputFocused,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 20,
  },
  passwordIconContainer: {
    position: "absolute",
    right: 15,
    top: 14,
    zIndex: 1,
  },
  authButton: {
    width: "100%",
    height: 50,
    backgroundColor: colors.button.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  authButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  backToHomeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: 25,
    backgroundColor: "rgba(85, 85, 85, 0.5)",
    width: "80%",
  },
  backToHomeText: {
    color: colors.white,
    marginLeft: 8,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default globalStyles;
