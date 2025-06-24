import React, { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { CalmNowScreen } from "./CalmNowScreen";
import { useExercises } from "../../hooks/useExercises";
import { useNavigation } from "@react-navigation/native";
import type { CalmNowNavigationProp } from "../../navigation/types";
import type { Exercise } from "../../types/exercise";

import {
  getDownloadedMap,
  downloadExercise,
  removeDownloadedExercise,
} from "../../utils/fileManager";
import { useConnectivity } from "../../hooks/useConnectivity";

export const CalmNowContainer: React.FC = () => {
  const navigation = useNavigation<CalmNowNavigationProp>();
  const { data: exercises, isLoading, error } = useExercises();
  const { isConnected } = useConnectivity();

  // Estado para el mapa de descargas: { [exerciseId]: localUri }
  const [downloadedMap, setDownloadedMap] = useState<Record<number, string>>(
    {}
  );
  const [downloadingIds, setDownloadingIds] = useState<number[]>([]);

  // Leer el mapa de descargas al montar el componente
  useEffect(() => {
    (async () => {
      const map = await getDownloadedMap();
      setDownloadedMap(map);
    })();
  }, []);

  // Función para descargar un ejercicio
  const handleDownload = async (exercise: Exercise) => {
    setDownloadingIds((prev) => [...prev, exercise.id]);
    try {
      const localUri = await downloadExercise(exercise);
      setDownloadedMap((prev) => ({ ...prev, [exercise.id]: localUri }));
    } catch (err) {
      console.error("Error descargando audio:", err);
      Alert.alert("Error", "No se pudo descargar el ejercicio.");
    } finally {
      // Cuando termine (ok o error), quitar del array de descarga
      setDownloadingIds((prev) => prev.filter((id) => id !== exercise.id));
    }
  };

  // Función para eliminar la descarga de un ejercicio
  const handleRemoveDownload = async (exerciseId: number) => {
    try {
      await removeDownloadedExercise(exerciseId);
      setDownloadedMap((prev) => {
        const copy = { ...prev };
        delete copy[exerciseId];
        return copy;
      });
    } catch (err) {
      console.error("Error eliminando descarga:", err);
      Alert.alert("Error", "No se pudo eliminar la descarga.");
    }
  };

  // Filtrado por categoría
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const filteredExercises = useMemo(() => {
    if (!exercises) return [];
    if (selectedCategory === "Todos") return exercises;
    if (selectedCategory === "Mis ejercicios") return exercises;
    return exercises.filter((ex) => ex.category === selectedCategory);
  }, [exercises, selectedCategory]);

  // Presionar ejercicio: si está descargado, usar URI local; si no, revisar conexión
  const handleExercisePress = (exercise: Exercise) => {
    if (downloadedMap[exercise.id]) {
      // Reproducir desde local
      navigation.navigate("ExercisePlayer", {
        exercise: { ...exercise, audioUrl: downloadedMap[exercise.id] },
      });
    } else {
      if (isConnected) {
        // Reproducir en streaming
        navigation.navigate("ExercisePlayer", { exercise });
      } else {
        Alert.alert(
          "Sin conexión",
          "Este ejercicio no está disponible sin conexión. Descárgalo primero."
        );
      }
    }
  };

  return (
    <CalmNowScreen
      isLoading={isLoading}
      error={error}
      exercises={filteredExercises}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      onExercisePress={handleExercisePress}
      downloadedMap={downloadedMap}
      onDownload={handleDownload}
      onRemoveDownload={handleRemoveDownload}
      isConnected={isConnected}
      downloadingIds={downloadingIds}
    />
  );
};

export default CalmNowContainer;
