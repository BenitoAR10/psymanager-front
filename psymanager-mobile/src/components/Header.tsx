import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MotiText } from "moti";
import theme from "../screens/styles/themeConstants";

export const Header: React.FC = React.memo(() => {
  return (
    <View style={styles.headerContainer}>
      <MotiText
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: theme.animations.durations.fast,
        }}
      >
        <Text style={styles.title}>Completa tu perfil</Text>
      </MotiText>

      <MotiText
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: theme.animations.durations.fast,
          delay: 200,
        }}
      >
        <Text style={styles.subtitle}>Solo unos datos más para finalizar</Text>
      </MotiText>
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});
