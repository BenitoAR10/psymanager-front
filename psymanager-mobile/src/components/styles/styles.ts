import { StyleSheet, Dimensions } from "react-native";
import theme from "../../screens/styles/themeConstants";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  formContainer: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  inputsContainer: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
  registerButton: {
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
    height: 52,
  },
  buttonLabel: {
    fontWeight: theme.typography.fontWeights.semibold as any,
    fontSize: theme.typography.sizes.md,
    letterSpacing: 0.5,
  },
});

// Exportamos estilos compartidos que se usarán en múltiples componentes
export const sharedStyles = StyleSheet.create({
  sectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.fontWeights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  divider: {
    marginVertical: theme.spacing.lg,
    backgroundColor: theme.colors.grey[200],
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    height: 56,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.error.main,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  dropdownIcon: {
    marginLeft: "auto",
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: theme.typography.sizes.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});
