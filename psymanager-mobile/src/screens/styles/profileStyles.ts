import { StyleSheet } from "react-native";
import { theme } from "./themeConstants";

const { colors, typography, spacing, borderRadius, shadows } = theme;

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  profileSection: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl * 1.5,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.lg,
  },
  avatar: {
    backgroundColor: colors.primary.light,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.primary.main,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary.main,
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.background.paper,
    ...shadows.sm,
  },
  userName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  userRole: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: "center",
    fontWeight: typography.fontWeights.medium as any,
  },
  // Nuevos estilos para los puntos integrados
  pointsContainer: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.primary.main}10`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: `${colors.primary.main}20`,
  },
  pointsIcon: {
    marginRight: spacing.xs,
  },
  pointsText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.primary.main,
  },
  // Resto de estilos existentes...
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.primary,
  },
  menuList: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.light,
  },
  menuItemDanger: {
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    borderBottomWidth: 0,
    ...shadows.sm,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    position: "relative",
  },
  dangerIcon: {
    backgroundColor: `${colors.error.main}15`,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.background.paper,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  menuLabelDanger: {
    color: colors.error.main,
  },
  menuDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  menuDescriptionDanger: {
    fontSize: typography.sizes.sm,
    color: `${colors.error.main}99`,
    lineHeight: 18,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: spacing.xl * 2,
    paddingTop: spacing.lg,
  },
  versionText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default profileStyles;
