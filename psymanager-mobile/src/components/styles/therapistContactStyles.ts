// therapistContactStyles.ts
import { StyleSheet, Platform } from "react-native";

// Usando los mismos colores que definimos anteriormente para mantener consistencia
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
  // Colores específicos para los contactos
  phone: "#5C6BC0", // Un azul más oscuro para mejor contraste
  email: "#5C6BC0", // Mismo color que el teléfono para consistencia
  whatsapp: "#25D366", // Color oficial de WhatsApp
};

const therapistContactStyles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
  },
  contactButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    flex: 1,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  phoneButton: {
    borderColor: colors.phone + "40",
  },
  emailButton: {
    borderColor: colors.email + "40",
  },
  whatsappButton: {
    borderColor: colors.whatsapp + "40",
  },
  contactIcon: {
    marginBottom: 6,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  phoneLabel: {
    color: colors.phone,
  },
  emailLabel: {
    color: colors.email,
  },
  whatsappLabel: {
    color: colors.whatsapp,
  },
  // Estilos para el estado presionado
  pressedButton: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  // Estilos para el estado deshabilitado
  disabledButton: {
    opacity: 0.5,
  },
  // Estilos para la accesibilidad
  accessibilityHint: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
  },
});

export default therapistContactStyles;
