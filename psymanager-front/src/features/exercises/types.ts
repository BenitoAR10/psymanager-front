/**
 * Datos requeridos para registrar un nuevo ejercicio de bienestar.
 */
export interface CreateExercisePayload {
  title: string;
  category: string;
  pointsReward: number;
  audioFile: File;
  showPoints: boolean;
}

/**
 * Datos devueltos al crear o consultar un ejercicio de bienestar.
 */
export interface ExerciseResponse {
  id: number;
  title: string;
  category: string;
  pointsReward: number;
  showPoints: boolean;
  audioUrl: string;
}
