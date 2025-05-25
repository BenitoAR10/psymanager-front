import { useQuery } from "@tanstack/react-query";
import { getExercises, ExerciseDto } from "../services/wellnessService";

/**
 * Hook para obtener ejercicios de bienestar desde el backend.
 *
 * @param category Categoría para filtrar los ejercicios (opcional)
 * @returns Objeto con loading, data y error
 */
export function useExercises(category?: string) {
  return useQuery<ExerciseDto[], Error>({
    queryKey: ["exercises", category],
    queryFn: () => getExercises(category),
    staleTime: 1000 * 60 * 5,
  });
}
