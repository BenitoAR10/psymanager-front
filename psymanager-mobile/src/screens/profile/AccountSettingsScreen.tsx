import React from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MotiView } from "moti";
import { useUserProfile } from "../../hooks/useUserProfile";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../styles/themeConstants";
import ProfileEditForm from "../../components/profile/ProfileEditForm";

const { colors, spacing, typography } = theme;

const AccountSettingsScreen: React.FC = () => {
  const { data: userProfile, isLoading, isError, refetch } = useUserProfile();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !userProfile) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
          color={colors.error.main}
        />
        <Text style={styles.errorText}>No se pudo cargar tu información.</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>
          Toca para reintentar
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header compacto */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 400 }}
          style={styles.headerContainer}
        >
          <MaterialCommunityIcons
            name="account-circle"
            size={20}
            color={colors.primary.main}
          />
          <Text style={styles.headerTitle}>Mi Información Personal</Text>
        </MotiView>
        <ProfileEditForm profile={userProfile} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  headerContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.default,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
  },
  errorText: {
    marginTop: spacing.md,
    color: colors.error.main,
    fontSize: typography.sizes.md,
    fontWeight: "600",
  },
  retryText: {
    marginTop: spacing.sm,
    color: colors.primary.main,
    fontSize: typography.sizes.sm,
    textDecorationLine: "underline",
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
});

export default AccountSettingsScreen;
