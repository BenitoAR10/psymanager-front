// src/screens/calm/CalmNowScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { ExerciseCard } from "../../components/calm/ExerciseCard";
import { FeaturedExerciseCard } from "../../components/calm/FeaturedExerciseCard";
import { CategoryChips } from "../../components/calm/CategoryChips";
import type { Exercise } from "../../types/exercise";

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
        <ActivityIndicator size="large" color="#007aff" />
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
    <ScrollView contentContainerStyle={styles.container}>
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
        {rest.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            title={exercise.title}
            category={exercise.category}
            pointsReward={exercise.pointsReward}
            audioUrl={exercise.audioUrl}
            onPress={() => onExercisePress(exercise)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 18,
    color: "#c00",
    textAlign: "center",
    marginBottom: 8,
  },
  errorTextSmall: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
});
