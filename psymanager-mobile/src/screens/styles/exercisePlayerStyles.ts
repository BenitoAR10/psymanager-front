import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../styles/themeConstants";

const { colors, typography, spacing, borderRadius } = theme;
const { width, height } = Dimensions.get("window");

export const exercisePlayerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F7FA", // Fondo base más cálido
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 1.5,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl * 2,
    paddingHorizontal: spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Sin fondo para los botones del header
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  illustrationContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl * 1.5,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as any,
    color: "#2D3748",
    textAlign: "center",
    marginBottom: spacing.sm,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: "#718096",
    textAlign: "center",
    fontWeight: "400" as any,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  playerSection: {
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
    alignItems: "center",
    paddingHorizontal: spacing.md, // Más padding horizontal
  },
  controlsContainer: {
    alignItems: "center",
    marginBottom: spacing.xl * 1.5, // Más espacio después del botón
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2D3748",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2D3748",
    shadowOffset: {
      width: 0,
      height: 2, // Sombra más sutil
    },
    shadowOpacity: 0.15, // Menos opacidad
    shadowRadius: 6, // Radio más suave
    elevation: 4, // Elevación reducida
  },
  progressContainer: {
    width: "100%",
    paddingHorizontal: spacing.lg, // Más padding horizontal
    paddingVertical: spacing.md, // Padding vertical agregado
  },
  progressBar: {
    height: 6, // Más gruesa
    backgroundColor: "#CBD5E0", // Fondo más oscuro para mejor contraste
    borderRadius: 3,
    marginBottom: spacing.lg, // Más espacio antes de los tiempos
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4FD1C5",
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm, // Más padding horizontal
    marginTop: spacing.xs, // Pequeño margen superior adicional
  },
  timeText: {
    fontSize: typography.sizes.sm,
    color: "#718096",
    fontWeight: "500" as any,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: "#F0F7FA",
  },
  errorText: {
    fontSize: typography.sizes.md,
    color: colors.error.main,
    textAlign: "center",
    marginTop: spacing.md,
    lineHeight: 22,
  },
});
