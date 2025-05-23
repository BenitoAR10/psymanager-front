import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { ExerciseCard } from "../../components/calm/ExerciseCard";
import { useExercises } from "../../hooks/useExercises";

const CalmNowScreen: React.FC = () => {
  const { data: exercises, isLoading, error } = useExercises(); // sin categoría por ahora

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

  return (
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ExerciseCard
          title={item.title}
          category={item.category}
          pointsReward={item.pointsReward}
          audioUrl={item.audioUrl}
        />
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

export default CalmNowScreen;

const styles = StyleSheet.create({
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
  listContent: {
    paddingVertical: 16,
  },
});
