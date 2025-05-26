import { fetcher } from "../utils/fetcher";
import type { Exercise } from "../types/exercise";

/**
 * Obtiene la lista de ejercicios de bienestar disponibles.
 * Puede filtrarse opcionalmente por categoría (ej: "Ansiedad", "Estrés").
 *
 * @param category Categoría del ejercicio (opcional)
 * @returns Lista de ejercicios disponibles con sus datos y enlaces de audio
 */
export async function getExercises(category?: string): Promise<Exercise[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return await fetcher(`/api/wellness-exercises${query}`);
}
