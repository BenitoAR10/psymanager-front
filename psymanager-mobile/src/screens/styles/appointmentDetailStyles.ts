// appointmentDetailStyles.ts
import { StyleSheet, Platform } from "react-native";
import { theme } from "../styles/themeConstants";

const { colors, typography, spacing, borderRadius, shadows } = theme;

const appointmentDetailStyles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background.default,
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
    padding: spacing.xl,
  },
  errorIcon: {
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error.main,
    fontSize: typography.sizes.md,
    fontWeight: "medium",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  errorDescription: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  retryButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
  },
  retryText: {
    color: colors.primary.contrastText,
    fontWeight: "semibold",
    marginLeft: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.light + "30",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.sizes.md,
    fontWeight: "600",
    color: colors.text.primary,
  },
  therapistCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  therapistHeader: {
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  therapistAvatar: {
    backgroundColor: colors.primary.light + "30",
    marginRight: spacing.md,
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: typography.sizes.md,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 2,
  },
  therapistRole: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  therapistActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.border.main,
    padding: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  actionButtonText: {
    color: colors.secondary.main,
    fontSize: typography.sizes.sm,
    fontWeight: "medium",
    marginLeft: spacing.sm,
  },
  statusContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success.main + "20",
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: "semibold",
    color: colors.success.main,
  },
  pendingStatus: {
    backgroundColor: colors.warning.main + "20",
  },
  pendingStatusText: {
    color: colors.warning.main,
  },
  infoBlock: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.light + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  infoText: {
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
    color: colors.text.primary,
  },
  sessionInfoBlock: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.xl,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  sessionHeader: {
    backgroundColor: colors.primary.light + "20",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
  },
  sessionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
    color: colors.text.primary,
  },
  sessionContent: {
    padding: spacing.md,
  },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  timeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.light + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  timeText: {
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
    color: colors.text.primary,
  },
  notesInput: {
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.border.main,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  reprogramButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    flex: 1,
    paddingVertical: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  reprogramButtonLabel: {
    color: colors.primary.contrastText,
    fontWeight: "semibold",
    fontSize: typography.sizes.md,
  },
  cancelButton: {
    borderColor: colors.error.main,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    flex: 1,
    paddingVertical: spacing.md,
  },
  cancelButtonLabel: {
    color: colors.error.main,
    fontWeight: "semibold",
    fontSize: typography.sizes.md,
  },
});

export default appointmentDetailStyles;
