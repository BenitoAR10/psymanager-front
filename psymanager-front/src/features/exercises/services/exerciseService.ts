import axiosInstance from "../../../services/axiosInstance";
import { CreateExercisePayload, ExerciseResponse } from "../types";

/**
 * Sube un nuevo ejercicio de bienestar al backend.
 * Requiere permiso `ADD_EXERCISE_RESOURCE` en el backend.
 */
export const uploadExercise = async (
  payload: CreateExercisePayload
): Promise<ExerciseResponse> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("category", payload.category);
  formData.append("pointsReward", payload.pointsReward.toString());
  formData.append("showPoints", payload.showPoints.toString());
  formData.append("audioFile", payload.audioFile);

  const response = await axiosInstance.post<ExerciseResponse>(
    "/api/wellness-exercises",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/**
 * Obtiene la lista de ejercicios de bienestar.
 * Puede filtrarse por categoría si se proporciona.
 */
export const getExercises = async (
  category?: string
): Promise<ExerciseResponse[]> => {
  const params = category ? { category } : {};
  const response = await axiosInstance.get<ExerciseResponse[]>(
    "/api/wellness-exercises",
    { params }
  );
  return response.data;
};
