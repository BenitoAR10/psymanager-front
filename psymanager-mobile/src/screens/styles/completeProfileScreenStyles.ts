import { StyleSheet, Platform, Dimensions } from "react-native";

// Exportamos los colores para que puedan ser utilizados tanto en los estilos como en el componente
export const colors = {
  primary: "#4DB6AC",
  primaryLight: "#80CBC4",
  primaryDark: "#00897B",
  secondary: "#64B5F6",
  textPrimary: "#2A3548",
  textSecondary: "#6B7A99",
  background: "#F5F7FA",
  surface: "#FFFFFF",
  border: "#E3E8EF",
  success: "#43A047",
  error: "#E53935",
  warning: "#FDD835",
};

const { width } = Dimensions.get("window");
export const isWeb = Platform.OS === "web";

// Estilos para elementos web específicos
export const webStyles = {
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "4px",
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    marginBottom: "8px",
    outline: "none",
  },
  datePicker: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "4px",
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    marginBottom: "8px",
    outline: "none",
  },
};

// Creamos y exportamos los estilos
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: 40,
  },
  content: {
    padding: 20,
    maxWidth: isWeb ? 600 : undefined,
    width: isWeb ? "100%" : undefined,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight + "30",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  // Estilos para DatePicker
  datePickerContainer: {
    marginBottom: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  datePickerTextContainer: {
    flex: 1,
  },
  datePickerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  datePickerValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  // Estilos para Selector
  selectorContainer: {
    marginBottom: 16,
    position: "relative",
  },
  selector: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  selectorTextContainer: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  selectorValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "400",
  },
  // Estilos para Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  modalDivider: {
    backgroundColor: colors.border,
    height: 1,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  modalOptionSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
  // Estilos para Web
  webSelectContainer: {
    marginBottom: 16,
  },
  webSelectLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
    fontWeight: "500",
  },
  webDatePickerContainer: {
    marginBottom: 16,
  },
  // Estilos para botones
  submitBtn: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
      },
    }),
  },
  submitBtnContent: {
    paddingVertical: 8,
    height: 56,
  },
  submitBtnLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  skipButton: {
    alignSelf: "center",
    marginTop: 16,
    padding: 12,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },

  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderContent: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
});

export default styles;
