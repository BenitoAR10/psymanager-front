import { useQuery } from "@tanstack/react-query";
import { getExercises } from "../services/exerciseService";
import type { ExerciseResponse } from "../types";

/**
 * Hook para obtener ejercicios de bienestar, con opción de filtrar por categoría.
 *
 * @param category Categoría opcional para filtrar (por ejemplo: "estrés", "ansiedad").
 * @returns Estado del query (datos, loading, error, etc.)
 */
export const useExercises = (category?: string) => {
  return useQuery<ExerciseResponse[], Error>({
    queryKey: ["exercises", category],
    queryFn: () => getExercises(category),
    staleTime: 1000 * 60 * 5, // cache por 5 minutos
    retry: 1,
  });
};
