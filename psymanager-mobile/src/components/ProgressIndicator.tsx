import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../screens/styles/themeConstants";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

export const ProgressIndicator: React.FC = React.memo(() => {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressStep}>
        <View style={[styles.progressDot, styles.completedStep]}>
          <MaterialCommunityIcons
            name="check"
            size={16}
            color={theme.colors.background.paper}
          />
        </View>
        <Text style={[styles.stepText, styles.completedStepText]}>
          Datos básicos
        </Text>
      </View>
      <View style={styles.progressLine} />
      <View style={styles.progressStep}>
        <View style={[styles.progressDot, styles.activeStep]}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
        <Text style={[styles.stepText, styles.activeStepText]}>Perfil</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  progressStep: {
    alignItems: "center",
    width: 100,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.grey[200],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  activeStep: {
    backgroundColor: theme.colors.primary.main,
  },
  completedStep: {
    backgroundColor: theme.colors.success.main,
  },
  stepNumber: {
    color: theme.colors.background.paper,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  stepText: {
    fontSize: isSmallDevice
      ? theme.typography.sizes.xs
      : theme.typography.sizes.sm,
    color: theme.colors.grey[500],
  },
  activeStepText: {
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  completedStepText: {
    color: theme.colors.success.main,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.grey[200],
    marginHorizontal: theme.spacing.sm,
  },
});
