import React, { useState, useMemo } from "react";
import { CalmNowScreen } from "./CalmNowScreen";
import { useExercises } from "../../hooks/useExercises";
import { useNavigation } from "@react-navigation/native";
import type { CalmNowNavigationProp } from "../../navigation/types";
import type { Exercise } from "../../types/exercise";

export const CalmNowContainer: React.FC = () => {
  const navigation = useNavigation<CalmNowNavigationProp>();
  const { data: exercises, isLoading, error } = useExercises();

  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];

    if (selectedCategory === "Todos") return exercises;
    if (selectedCategory === "Mis ejercicios") {
      // Si en el futuro agregas favoritos, aquí iría la lógica.
      return exercises; // Por ahora se muestra todo
    }

    return exercises.filter((ex) => ex.category === selectedCategory);
  }, [exercises, selectedCategory]);

  const handleExercisePress = (exercise: Exercise) => {
    navigation.navigate("ExercisePlayer", { exercise });
  };

  return (
    <CalmNowScreen
      isLoading={isLoading}
      error={error}
      exercises={filteredExercises}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      onExercisePress={handleExercisePress}
    />
  );
};

export default CalmNowContainer;
