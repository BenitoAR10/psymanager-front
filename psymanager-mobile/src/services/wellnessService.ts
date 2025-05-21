import { API_URL } from "../utils/urlConstant";
import { storage } from "../utils/storage";

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
  const token = await storage.getItem("accessToken");
  if (!token) {
    throw new Error("No se encontró el token de autenticación");
  }

  const params = new URLSearchParams();
  if (category) {
    params.append("category", category);
  }

  const response = await fetch(
    `${API_URL}/api/wellness-exercises?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Error al obtener ejercicios de bienestar");
  }

  return await response.json();
}
