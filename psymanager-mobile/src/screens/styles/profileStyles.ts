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
    paddingTop: spacing.xl,
    paddingBottom: spacing["2xl"],
  },
  profileSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.main,
    ...shadows.md,
  },
  avatarContainer: {
    marginBottom: spacing.md,
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    backgroundColor: `${colors.primary.light}30`,
    borderWidth: 3,
    borderColor: colors.background.paper,
  },
  avatarText: {
    fontSize: typography.sizes["3xl"],
    fontWeight: "bold",
    color: colors.primary.dark,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.background.paper,
    ...shadows.sm,
  },
  userName: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "bold",
    color: colors.text.primary,
    textAlign: "center",
    marginTop: spacing.md,
    letterSpacing: -0.3,
  },
  userRole: {
    fontSize: typography.sizes.md,
    fontWeight: "medium",
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: `${colors.primary.light}15`,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: `${colors.primary.main}30`,
  },
  editProfileText: {
    fontSize: typography.sizes.sm,
    fontWeight: "semibold",
    color: colors.primary.main,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  menuList: {
    marginBottom: spacing.sm,
  },
  menuItem: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.main,
    ...shadows.sm,
  },
  menuItemDanger: {
    backgroundColor: `${colors.error.lightBg}20`,
    borderColor: colors.error.lightBg,
  },
  menuIcon: {
    marginRight: spacing.md,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerIcon: {
    backgroundColor: `${colors.error.lightBg}50`,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: "semibold",
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  menuLabelDanger: {
    color: colors.error.main,
    fontWeight: "600",
  },
  menuDescriptionDanger: {
    fontSize: typography.sizes.xs,
    color: `${colors.error.main}99`,
  },
  chevron: {
    marginLeft: spacing.sm,
    opacity: 0.6,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: `${colors.border.main}50`,
  },
  versionText: {
    textAlign: "center",
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: "medium",
    marginBottom: spacing.xs,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success.main,
    borderWidth: 2,
    borderColor: colors.background.paper,
  },
});

export default profileStyles;
