import type React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Exercise } from "../../types/exercise";
import { theme } from "../../screens/styles/themeConstants";

const { typography, borderRadius, spacing } = theme;

interface FeaturedExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
}

export const FeaturedExerciseCard: React.FC<FeaturedExerciseCardProps> = ({
  exercise,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={["#FFCBA4", "#FFB347"]} // Gradiente melocotón/naranja como en el mockup
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.background}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Calma Diaria</Text>
          <Text style={styles.subtitle}>
            HOY • Ejercicio de relajación para hoy
          </Text>
        </View>
        <View style={styles.playButtonContainer}>
          <View style={styles.playButton}>
            <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  background: {
    height: 80,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.bold as any,
    color: "#4A5568",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: "#718096",
    fontWeight: typography.fontWeights.medium as any,
  },
  playButtonContainer: {
    marginLeft: spacing.md,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4A5568",
    justifyContent: "center",
    alignItems: "center",
  },
});
