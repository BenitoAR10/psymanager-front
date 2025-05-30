import { StyleSheet } from "react-native";
import { theme } from "../styles/themeConstants";

const { colors, typography, spacing, borderRadius, shadows } = theme;

const scheduleDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginBottom: spacing.lg, // Aumentado para mejor separación
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "bold",
    color: colors.text.primary,
    flex: 1,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: spacing.lg, // Espaciado uniforme
    paddingVertical: spacing.md, // Padding interno para mejor separación
  },
  avatar: {
    backgroundColor: colors.primary.light, // Color más amigable
    marginBottom: spacing.md, // Espaciado consistente después del avatar
    ...shadows.sm,
  },
  therapistName: {
    fontSize: typography.sizes.lg,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.sm, // Espaciado consistente antes de las especialidades
    textAlign: "center",
    paddingHorizontal: spacing.md, // Padding lateral para mejor lectura
  },
  therapistSpecialty: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.md, // Espaciado consistente
  },
  section: {
    marginBottom: spacing.lg, // Espaciado uniforme entre secciones
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm, // Padding interno consistente
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.sm, // Espaciado consistente
  },
  sectionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md, // Espaciado consistente
    lineHeight: 20,
  },
  sectionText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    paddingHorizontal: spacing.xs, // Padding lateral sutil
  },
  hoursContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md, // Espaciado consistente
    paddingHorizontal: spacing.xs,
  },
  hourItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.default,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  selectedHourItem: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  hourText: {
    fontSize: typography.sizes.sm,
    color: colors.grey[600],
    fontWeight: "medium",
  },
  selectedHourText: {
    color: colors.primary.contrastText,
  },
  reserveButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg, // Espaciado consistente
    marginBottom: spacing.xl,
    marginHorizontal: spacing.sm, // Margen lateral para mejor apariencia
    ...shadows.md,
  },
  reserveButtonText: {
    color: colors.primary.contrastText,
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
  },
  // Estilos mejorados para la sección de motivo
  reasonContainer: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg, // Espaciado consistente
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.sm,
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md, // Espaciado consistente
  },
  reasonIcon: {
    marginRight: spacing.sm,
  },
  reasonTitle: {
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
    color: colors.text.primary,
    flex: 1,
  },
  reasonSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md, // Espaciado consistente
    lineHeight: 20,
  },
  reasonInput: {
    backgroundColor: colors.grey[50],
    marginBottom: spacing.sm,
  },
  reasonInputContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    color: colors.text.primary,
  },
  reasonInputOutline: {
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  characterCount: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  // Estilos para el estado vacío
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.md,
  },
  // Estilos para el contenedor del botón fijo
  buttonContainer: {
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.md,
  },
  // Estilos para el botón deshabilitado
  disabledButton: {
    backgroundColor: colors.grey[300],
    opacity: 0.7,
  },
  // Estilos para el icono del botón
  buttonIcon: {
    marginRight: spacing.sm,
  },
  // Estilos para el SafeArea
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  // Estilos para el contenedor de contenido
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  // Estilos para la tarjeta del terapeuta
  therapistCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.sm,
  },
  // Estilos para la información del terapeuta
  therapistInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  therapistTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  // Estilos para el contenedor de horarios
  scheduleContainer: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.sm,
  },
  // Estilos para el título principal
  mainTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  // Estilos para la sección de fecha
  dateSection: {
    marginBottom: spacing.md,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  dateDay: {
    fontSize: typography.sizes.md,
    fontWeight: "bold",
    color: colors.primary.contrastText,
  },
  dateInfo: {
    flex: 1,
  },
  dateMonth: {
    fontSize: typography.sizes.sm,
    fontWeight: "medium",
    color: colors.text.primary,
  },
  dateWeekday: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },

  disabledReserveButton: {
    backgroundColor: "#CBD5E0",
    opacity: 0.6,
  },

  // Estilos mejorados para las especialidades
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.xs, // Espaciado consistente entre chips
    marginTop: spacing.sm, // Espaciado consistente desde el nombre
    marginBottom: spacing.md, // Espaciado consistente hacia el siguiente elemento
    paddingHorizontal: spacing.md, // Padding lateral
  },

  specialtyChip: {
    backgroundColor: colors.primary.light, // Color más amigable
    marginRight: 0, // Removido para usar gap
    marginBottom: 0, // Removido para usar gap
  },

  specialtyChipText: {
    fontSize: typography.sizes.xs,
    color: colors.text.primary,
    fontWeight: "medium",
  },

  // Estilos para los slots de tiempo
  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.xs,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.default,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  timeIcon: {
    marginRight: spacing.xs,
  },
  timeText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  selectedTimeText: {
    color: colors.primary.contrastText,
  },
});

export default scheduleDetailStyles;
