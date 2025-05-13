// scheduleDetailStyles.ts
import { StyleSheet, Platform, Dimensions } from "react-native";

// Colores consistentes con tu tema
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
const cardRadius = 16;
const buttonRadius = 28;

// Definir los estilos correctamente
const scheduleDetailStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Espacio para el botón fijo
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  therapistCard: {
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  therapistInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: colors.primaryLight + "20",
    marginRight: 12,
  },
  therapistTextContainer: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  therapistSpecialty: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  scheduleContainer: {
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  dateInfo: {
    flex: 1,
  },
  dateMonth: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  dateWeekday: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: width / 2 - 40,
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
  selectedTimeSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  timeIcon: {
    marginRight: 8,
  },
  timeText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  selectedTimeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    maxWidth: "80%",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  reserveButton: {
    backgroundColor: colors.primary,
    borderRadius: buttonRadius,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  disabledButton: {
    backgroundColor: colors.primary + "80",
  },
  reserveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default scheduleDetailStyles;
