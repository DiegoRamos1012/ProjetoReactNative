import { StyleSheet } from "react-native";

// ==========================================
// COLORS THEME
// ==========================================
export const colors = {
  primary: "#FFFFFF", // Branco puro - Cor primária para textos e elementos importantes
  secondary: "#0C2340", // Azul marinho escuro - Cor secundária, como na logo
  background: "#000000", // Preto - Cor de fundo principal

  // Text Colors
  text: "#FFFFFF", // Branco puro - Cor padrão para textos
  textDark: "#333333", // Cinza escuro - Textos sobre fundos claros
  textLight: "#666666", // Cinza médio - Textos secundários/menos importantes
  textLighter: "#dddddd", // Cinza muito claro - Textos terciários/subtítulos
  white: "#FFFFFF", // Branco puro - Usado para textos sobre fundos escuros

  // UI Elements
  input: "#333333", // Cinza escuro - Campos de entrada
  inputFocused: "#444444", // Cinza mais claro - Campos de entrada quando focados
  error: "#FF375B", // Vermelho vibrante - Mensagens de erro
  disabled: "#cccccc", // Cinza claro - Elementos desabilitados
  danger: "#dc2626", // Vermelho para botões de ação perigosa
  link: "#4a9eff", // Azul claro - Links clicáveis

  // Gray Scale
  gray: "#888888", // Cinza médio para textos secundários
  lightGray: "#cccccc", // Cinza claro para detalhes e borda
  darkGray: "#555555", // Cinza escuro para textos importantes

  // Roles & Cargo Colors
  adminRole: "#c2410c", // Laranja queimado - Indicador de função de administrador
  clientRole: "#0891b2", // Azul turquesa - Indicador de função de cliente
  funcionarioCargo: "#047857", // Verde escuro - Indicador de cargo de funcionário
  clienteCargo: "#4b5563", // Cinza azulado - Indicador de cargo de cliente
  barbeiroCargo: "#0891b2", // Azul turquesa - Indicador de cargo de barbeiro
  gerenteCargo: "#9333ea", // Roxo - Indicador de cargo de gerente

  // Gradient
  gradient: {
    start: "#0C2340", // Azul marinho escuro - Início do gradiente (como no poste da logo)
    middle: "#0F172A", // Azul escuro médio - Tom intermediário do gradiente
    end: "#000000", // Preto - Final do gradiente para o fundo
  },

  // Buttons
  button: {
    primary: "#3A5199", // Azul escuro - Botões primários
    secondary: "#4a9eff", // Azul claro - Botões secundários e links
  },

  // Barber Theme
  barber: {
    gold: "#D4AF37", // Dourado - Cor da coroa e detalhes premium
    red: "#B22222", // Vermelho escuro - Cor do poste de barbeiro
    navy: "#0C2340", // Azul marinho - Cor do personagem da logo
    lightGold: "rgba(212, 175, 55, 0.15)", // Dourado transparente - Para detalhes sutis
  },
};

export const globalStyles = StyleSheet.create({
  // ==========================================
  // 1. LAYOUT & CONTAINERS
  // ==========================================
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  section: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: colors.gradient.middle,
    borderRadius: 8,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: "black",
    margin: 10,
  },

  // ==========================================
  // 2. TEXT STYLES
  // ==========================================
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.primary,
    marginTop: -10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLighter,
    marginBottom: 15,
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
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: colors.textLighter,
    fontStyle: "italic",
  },

  // ==========================================
  // 3. BUTTONS & INTERACTIVE ELEMENTS
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
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
  backButton: {
    padding: 5,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: "#aaaaaa",
  },

  // ==========================================
  // 4. FORM ELEMENTS
  // ==========================================
  textInput: {
    width: "100%",
    height: 40,
    backgroundColor: colors.input,
    borderRadius: 20,
    paddingLeft: 20,
    color: colors.text,
    marginBottom: 20,
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
  iconWrapper: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -22 }],
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.textLighter,
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

  // ==========================================
  // 5. LOADING & FEEDBACK STATES
  // ==========================================
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gradient.middle,
  },
  loadingAnimation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingSubText: {
    color: colors.textLighter,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 250,
  },
  loadingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(12, 35, 64, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.button.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loadingIndicator: {
    marginTop: 20,
  },

  // ==========================================
  // 6. HEADER & BANNER STYLES
  // ==========================================
  header: {
    backgroundColor: colors.gradient.start,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  banner: {
    backgroundColor: colors.secondary,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  bannerEnhanced: {
    backgroundColor: "rgba(12, 35, 64, 0.8)", // Cor secundária com transparência
    margin: 16,
    padding: 24,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bannerTitleEnhanced: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerSubtitleEnhanced: {
    fontSize: 16,
    color: colors.barber.lightGold,
    textAlign: "center",
    fontStyle: "italic",
  },
  bannerItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
  },
  bannerIcon: {
    marginRight: 12,
    marginLeft: 5,
    color: colors.barber.gold,
  },

  // ==========================================
  // 7. HOME SCREEN STYLES
  // ==========================================
  homeContainer: {
    flex: 1,
    backgroundColor: colors.gradient.middle,
  },
  homeContainerEnhanced: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerEnhanced: {
    backgroundColor: colors.gradient.start,
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gradient.middle,
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
    marginTop: 5,
  },
  logoutButton: {
    padding: 10,
  },
  sectionEnhanced: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 15,
    backgroundColor: "rgba(15, 23, 42, 0.9)", // Cor do meio do gradiente com transparência
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    padding: 20,
  },
  sectionTitleEnhanced: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.barber.gold,
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionSubtitleEnhanced: {
    fontSize: 14,
    color: colors.textLighter,
    marginBottom: 15,
  },

  // ==========================================
  // 8. SERVICES LIST STYLES
  // ==========================================
  servicosList: {
    marginTop: 10,
  },
  servicoCard: {
    backgroundColor: colors.gradient.start,
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    color: colors.white,
  },
  servicoNome: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: colors.textLighter,
  },
  servicoPreco: {
    fontSize: 15,
    color: colors.textLighter,
    fontWeight: "600",
  },
  servicoTempo: {
    fontSize: 13,
    color: colors.textLighter,
  },
  servicoCardEnhanced: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(12, 35, 64, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: 160,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "space-between",
  },
  servicoIconContainerEnhanced: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(58, 81, 153, 0.2)",
    borderWidth: 1,
    borderColor: colors.barber.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: colors.barber.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  servicoNomeEnhanced: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: colors.white,
  },
  servicoPrecoEnhanced: {
    fontSize: 16,
    color: colors.barber.gold,
    fontWeight: "bold",
  },
  servicoTempoEnhanced: {
    fontSize: 13,
    color: colors.textLighter,
    marginTop: 4,
  },

  // ==========================================
  // 9. APPOINTMENTS (AGENDAMENTOS) STYLES
  // ==========================================
  agendamentoItem: {
    backgroundColor: colors.gradient.start,
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
    color: colors.textLighter,
  },
  agendamentoServico: {
    fontSize: 16,
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.textLighter,
  },
  agendamentoData: {
    fontSize: 14,
    color: colors.textLighter,
    marginBottom: 3,
  },
  agendamentoBarbeiro: {
    fontSize: 14,
    color: colors.secondary,
  },
  agendamentoItemEnhanced: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(58, 81, 153, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  agendamentoInfoEnhanced: {
    flex: 1,
  },
  agendamentoServicoEnhanced: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.white,
  },
  agendamentoDataEnhanced: {
    fontSize: 14,
    color: colors.barber.lightGold,
    marginBottom: 6,
  },
  agendamentoBarbeiroEnhanced: {
    fontSize: 14,
    color: colors.textLighter,
  },
  agendamentoActionButtonsEnhanced: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  agendamentoDeleteButtonEnhanced: {
    backgroundColor: "rgba(255, 55, 91, 0.8)",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
  // 10. MODALS STYLES
  // ==========================================
  // 10.1. Basic Modal Styles
  modalView: {
    width: "85%",
    backgroundColor: colors.gradient.middle,
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

  // 10.2. Appointment Modal Styles
  modalServico: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: colors.textLighter,
  },
  modalPreco: {
    fontSize: 16,
    color: colors.textLighter,
    marginBottom: 20,
  },
  modalDescricao: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.textLighter,
  },
  horarioContainer: {
    marginVertical: 15,
  },
  horarioTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.textLighter,
  },
  horarioOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    color: colors.textLighter,
  },
  horarioOption: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    color: colors.textLighter,
    backgroundColor: colors.white,
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

  // 10.3. Delete Time Modal
  horarioDeleteModal: {
    width: "80%",
    backgroundColor: colors.gradient.middle,
    borderRadius: 10,
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
  horarioDeleteModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.white,
    textAlign: "center",
  },
  horarioDeleteModalText: {
    fontSize: 16,
    color: colors.textLighter,
    marginBottom: 20,
    textAlign: "center",
  },
  horarioDeleteModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  horarioDeleteCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.gradient.start,
    alignItems: "center",
    marginRight: 10,
  },
  horarioDeleteConfirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.error,
    alignItems: "center",
  },
  horarioDeleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  // 10.4. Service time options
  servicoHorarioOptionContainer: {
    position: "relative",
  },
  servicoHorarioOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 5,
    backgroundColor: "#fff",
  },
  servicoHorarioOptionSelected: {
    borderColor: colors.button.primary,
    backgroundColor: "rgba(58, 81, 153, 0.1)",
  },
  servicoHorarioOptionPressed: {
    backgroundColor: "rgba(58, 81, 153, 0.2)",
  },

  // ==========================================
  // 11. PROFILE SCREEN STYLES
  // ==========================================
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
  // 12. IMAGES & MEDIA STYLES
  // ==========================================
  image: {
    width: 400,
    height: 450,
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  logoImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
    resizeMode: "contain",
  },

  // ==========================================
  // 13. AUTHENTICATION SCREENS
  // ==========================================
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
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

  // ==========================================
  // 14. ADMIN TOOLS STYLES
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

  // ==========================================
  // 15. SERVICES & TIME MANAGEMENT
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

  // ==========================================
  // 16. SERVICE FORM STYLES
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
  // 17. SERVICE MODALS
  // ==========================================
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

  // ==========================================
  // 18. TRASH BIN (LIXEIRA) STYLES
  // ==========================================
  lixeiraModalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  lixeiraModalView: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  lixeiraModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  lixeiraModalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  lixeiraCloseButton: {
    padding: 5,
  },
  lixeiraModalContent: {
    padding: 15,
    maxHeight: 500,
  },
  lixeiraScrollView: {
    maxHeight: 450,
  },
  lixeiraLoadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  lixeiraLoadingText: {
    marginTop: 10,
    color: colors.textLight,
  },
  lixeiraEmptyText: {
    textAlign: "center",
    padding: 20,
    color: colors.textLight,
  },
  lixeiraItemLixeira: {
    backgroundColor: "rgba(25, 33, 52, 0.7)",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    position: "relative",
  },
  lixeiraItemOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  lixeiraItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  lixeiraItemNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  lixeiraItemData: {
    fontSize: 14,
    color: colors.textLighter,
  },
  lixeiraItemServico: {
    fontSize: 15,
    color: colors.barber.gold,
    marginBottom: 5,
  },
  lixeiraItemObservacao: {
    fontSize: 14,
    color: colors.textLighter,
    fontStyle: "italic",
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 8,
    borderRadius: 5,
  },
  lixeiraItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  lixeiraDataExclusao: {
    fontSize: 12,
    color: colors.textLight,
  },
  lixeiraItemButtons: {
    flexDirection: "row",
  },
  lixeiraItemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 8,
  },
  lixeiraRestaurarButton: {
    backgroundColor: "#4CAF50", // Verde
  },
  lixeiraExcluirButton: {
    backgroundColor: "#F44336", // Vermelho
  },
  lixeiraItemButtonText: {
    color: "#FFF",
    fontSize: 10,
    marginLeft: 5,
  },
  lixeiraModalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  lixeiraFecharButton: {
    backgroundColor: colors.button.primary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  lixeiraFecharButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  // ==========================================
  // 19. STATUS MODAL STYLES
  // ==========================================
  statusModalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  statusModalView: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    width: "85%",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  statusModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(10, 17, 35, 0.8)",
  },
  statusModalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusCloseButton: {
    padding: 5,
  },
  statusModalContent: {
    padding: 15,
  },
  statusAgendamentoInfoContainer: {
    marginBottom: 15,
  },
  statusAgendamentoInfo: {
    fontSize: 16,
    color: colors.barber.gold,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusClienteInfo: {
    fontSize: 14,
    color: colors.textLighter,
  },
  statusOptionsContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  statusObservacoesContainer: {
    marginTop: 15,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: colors.barber.gold,
  },
  statusObservacoesLabel: {
    color: colors.barber.gold,
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 14,
  },
  statusObservacoesText: {
    color: colors.textLighter,
    fontStyle: "italic",
    fontSize: 14,
    lineHeight: 20,
  },
  statusModalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(10, 17, 35, 0.8)",
  },
  statusCancelButton: {
    backgroundColor: "#555",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  statusConfirmButton: {
    backgroundColor: colors.button.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  statusButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // ==========================================
  // 20. APPOINTMENT CARD STYLES
  // ==========================================
  agendamentoCardContainer: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 15,
    padding: 15,
    position: "relative",
    borderLeftWidth: 3,
    borderLeftColor: colors.button.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  agendamentoCardContainerDisabled: {
    opacity: 0.7,
  },
  agendamentoCardLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    zIndex: 10,
  },
  agendamentoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  agendamentoCardClienteInfo: {
    flex: 1,
  },
  agendamentoCardUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 3,
  },
  agendamentoCardDateTime: {
    fontSize: 14,
    color: colors.textLighter,
  },
  agendamentoCardStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 10,
  },
  agendamentoCardStatusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  agendamentoCardContent: {
    marginVertical: 10,
  },
  agendamentoCardServiceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.barber.gold,
    marginBottom: 5,
  },
  agendamentoCardBarberName: {
    fontSize: 14,
    color: colors.textLighter,
    marginBottom: 10,
  },
  agendamentoCardObsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  agendamentoCardObsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.barber.gold,
    marginBottom: 3,
  },
  agendamentoCardObsText: {
    fontSize: 14,
    color: colors.textLighter,
    fontStyle: "italic",
  },
  agendamentoCardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 10,
  },
  agendamentoCardActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.button.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  agendamentoCardDeleteButton: {
    backgroundColor: "#F44336",
  },
  agendamentoCardActionText: {
    color: colors.white,
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 5,
  },

  // ==========================================
  // 21. APPOINTMENTS LIST STYLES
  // ==========================================
  agendamentosListContainer: {
    flex: 1,
  },
  agendamentosListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  agendamentosListActionsButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  agendamentosListRefreshButton: {
    backgroundColor: colors.button.primary,
  },
  agendamentosListLixeiraButton: {
    backgroundColor: "rgba(97, 97, 97, 0.8)",
  },
  agendamentosListButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  agendamentosListButtonIcon: {
    marginRight: 5,
  },
  agendamentosListBadge: {
    backgroundColor: "rgba(244, 67, 54, 0.9)",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  agendamentosListBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  agendamentosListLoadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  agendamentosListLoadingText: {
    marginTop: 10,
    color: colors.textLight,
  },
  agendamentosListEmptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  agendamentosListEmptyText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    color: colors.textLight,
  },
  agendamentosListTryAgainButton: {
    backgroundColor: colors.button.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 20,
  },
  agendamentosListContent: {
    maxHeight: 600,
    paddingBottom: 20,
  },
});

export default globalStyles;
