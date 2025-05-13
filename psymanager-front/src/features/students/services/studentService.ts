import axios from "../../../services/axiosInstance";
import type { AssignedPatientDto } from "../types";

/**
 * Obtiene todos los estudiantes asignados a un terapeuta,
 * incluyendo los que están en tratamiento activo o que ya concluyeron.
 */
export async function getPatientsByTherapist(
  therapistId: number
): Promise<AssignedPatientDto[]> {
  const response = await axios.get<AssignedPatientDto[]>(
    `/api/treatments/therapist/${therapistId}/patients`
  );
  return response.data;
}
