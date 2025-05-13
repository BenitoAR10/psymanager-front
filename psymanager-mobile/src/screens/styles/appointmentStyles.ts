import { StyleSheet } from "react-native";
import { theme } from "./themeConstants";

const { colors, typography, spacing, borderRadius, shadows } = theme;

const appointmentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
    ...shadows.sm,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: spacing.md,
    backgroundColor: `${colors.primary.light}20`,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  filterButton: {
    padding: spacing.sm,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  errorIcon: {
    marginBottom: spacing.md,
    opacity: 0.7,
  },
  errorText: {
    color: colors.error.main,
    textAlign: "center",
    fontSize: typography.sizes.md,
    fontWeight: "medium",
    marginBottom: spacing.sm,
  },
  errorDescription: {
    color: colors.text.secondary,
    textAlign: "center",
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xl,
  },
  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.sm,
  },
  retryButtonText: {
    color: colors.primary.contrastText,
    fontWeight: "semibold",
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
    opacity: 0.7,
  },
  emptyText: {
    color: colors.text.primary,
    textAlign: "center",
    fontSize: typography.sizes.lg,
    fontWeight: "semibold",
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    color: colors.text.secondary,
    textAlign: "center",
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xl,
    maxWidth: "80%",
  },
  scheduleButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.md,
  },
  scheduleButtonText: {
    color: colors.primary.contrastText,
    fontWeight: "semibold",
    marginLeft: spacing.sm,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing["3xl"],
    paddingTop: spacing.sm,
  },
  sectionHeader: {
    fontSize: typography.sizes.lg,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingLeft: spacing.xs,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingLeft: spacing.xs,
  },
  dateIcon: {
    marginRight: spacing.sm,
    backgroundColor: `${colors.primary.light}20`,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
    color: colors.text.primary,
    textTransform: "capitalize",
  },
  card: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.paper,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  pastCard: {
    opacity: 0.8,
    borderStyle: "dashed",
  },
  cardContent: {
    padding: spacing.md,
  },
  therapistInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: `${colors.primary.light}30`,
    marginRight: spacing.md,
  },
  therapistTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  cardSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  statusContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary.main}20`,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: "semibold",
    color: colors.primary.main,
  },
  divider: {
    backgroundColor: colors.border.main,
    height: 1,
    marginVertical: spacing.md,
  },
  appointmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    marginRight: spacing.xs,
  },
  detailText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: "medium",
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  sessionButton: {
    borderColor: colors.secondary.main,
    borderRadius: borderRadius.md,
    height: 36,
    paddingHorizontal: spacing.md,
  },
  sessionButtonLabel: {
    fontSize: typography.sizes.xs,
    color: colors.secondary.main,
    fontWeight: "semibold",
  },
  contactButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
    backgroundColor: `${colors.secondary.main}15`,
    borderRadius: borderRadius.full,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTime: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontWeight: "medium",
  },
  refreshContainer: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  refreshText: {
    color: colors.primary.main,
    fontSize: typography.sizes.sm,
    fontWeight: "medium",
  },
});

export default appointmentStyles;
