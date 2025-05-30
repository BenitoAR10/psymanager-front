import type React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { ExerciseCard } from "../../components/calm/ExerciseCard";
import { FeaturedExerciseCard } from "../../components/calm/FeaturedExerciseCard";
import { CategoryChips } from "../../components/calm/CategoryChips";
import type { Exercise } from "../../types/exercise";
import { theme } from "../../screens/styles/themeConstants";

const { colors, typography, spacing, borderRadius } = theme;

interface CalmNowScreenProps {
  isLoading: boolean;
  error: Error | null;
  exercises: Exercise[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onExercisePress: (exercise: Exercise) => void;
}

export const CalmNowScreen: React.FC<CalmNowScreenProps> = ({
  isLoading,
  error,
  exercises,
  selectedCategory,
  onCategoryChange,
  onExercisePress,
}) => {
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Cargando ejercicios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar los ejercicios 😢</Text>
        <Text style={styles.errorTextSmall}>{error.message}</Text>
      </View>
    );
  }

  const [first, ...rest] = exercises;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Calma Ahora</Text>
      <Text style={styles.description}>
        Aquí encontrarás ejercicios y técnicas para calmarte durante momentos de
        ansiedad y estrés, y mantener tu bienestar emocional.
      </Text>

      <CategoryChips
        selected={selectedCategory}
        onSelectCategory={onCategoryChange}
      />

      {first && (
        <FeaturedExerciseCard
          exercise={first}
          onPress={() => onExercisePress(first)}
        />
      )}

      <View style={styles.gridContainer}>
        {rest.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            title={exercise.title}
            category={exercise.category}
            pointsReward={exercise.pointsReward}
            audioUrl={exercise.audioUrl}
            onPress={() => onExercisePress(exercise)}
            index={index}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: typography.sizes.sm,
    textAlign: "center",
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background.paper,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium as any,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.error.main,
    textAlign: "center",
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeights.semibold as any,
  },
  errorTextSmall: {
    fontSize: typography.sizes.sm,
    color: colors.grey[400],
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
});
