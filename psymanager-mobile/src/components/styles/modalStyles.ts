import { StyleSheet, Platform, Dimensions } from "react-native";

// Colores consistentes con tu tema web
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
const buttonRadius = 28;

export const modalStyles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 28,
    width: "85%",
    maxWidth: 340,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: 28,
    paddingHorizontal: 8,
    fontWeight: "400",
  },
  highlightText: {
    fontWeight: "700",
    color: colors.primary,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 14,
    borderRadius: buttonRadius,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  confirmButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 14,
    borderRadius: buttonRadius,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cancelText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
  confirmText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
