import { fetcher } from "../utils/fetcher";

/**
 * Tipo de dato que representa un ejercicio de bienestar.
 */
export interface ExerciseDto {
  id: number;
  title: string;
  category: string;
  pointsReward: number;
  audioUrl: string;
}

/**
 * Obtiene la lista de ejercicios de bienestar disponibles.
 * Puede filtrarse opcionalmente por categoría (ej: "Ansiedad", "Estrés").
 *
 * @param category Categoría del ejercicio (opcional)
 * @returns Lista de ejercicios disponibles con sus datos y enlaces de audio
 */
export async function getExercises(category?: string): Promise<ExerciseDto[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return await fetcher(`/api/wellness-exercises${query}`);
}
