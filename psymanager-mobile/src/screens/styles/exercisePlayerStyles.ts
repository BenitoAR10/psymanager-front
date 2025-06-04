import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../styles/themeConstants";

const { colors, typography, spacing, borderRadius } = theme;
const { width, height } = Dimensions.get("window");

export const exercisePlayerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F7FA",
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: spacing.sm,
    lineHeight: 38,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    fontWeight: "400" as any,
    marginBottom: spacing.lg,
    lineHeight: 22,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  categoryText: {
    fontSize: typography.sizes.md,
    color: "#FFFFFF",
    fontWeight: "500" as any,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  pointsText: {
    fontSize: typography.sizes.md,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600" as any,
    marginLeft: spacing.xs,
  },
  // Controles integrados sin fondo blanco
  playerSection: {
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
    alignItems: "center",
    paddingHorizontal: spacing.md,
    // Sin backgroundColor, sin borderRadius, sin shadow
  },
  controlsContainer: {
    alignItems: "center",
    marginBottom: spacing.xl * 1.5,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(45, 55, 72, 0.9)", // Más transparente para integración
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)", // Borde sutil
  },
  progressContainer: {
    width: "100%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Transparente para integración
    borderRadius: 3,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Blanco para contraste
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    marginTop: spacing.xs,
  },
  timeText: {
    fontSize: typography.sizes.sm,
    color: "rgba(255, 255, 255, 0.9)", // Blanco para legibilidad
    fontWeight: "500" as any,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
