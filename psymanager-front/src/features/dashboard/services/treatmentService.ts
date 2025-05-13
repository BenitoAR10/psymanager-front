import {
  CreateTreatmentPlanRequestDto,
  TreatmentPlanDto,
  ActiveTreatmentStudentDto,
} from "../types";
import axios from "../../../services/axiosInstance";

/**
 * Envía una solicitud POST para crear un nuevo plan de tratamiento.
 */
export async function createTreatment(
  dto: CreateTreatmentPlanRequestDto
): Promise<TreatmentPlanDto> {
  const response = await axios.post<TreatmentPlanDto>("/api/treatments", dto);
  return response.data;
}

/**
 * Obtiene la lista de estudiantes con tratamiento activo para un terapeuta.
 */
export async function getActiveTreatmentPatientsByTherapist(
  therapistId: number
): Promise<ActiveTreatmentStudentDto[]> {
  const response = await axios.get<ActiveTreatmentStudentDto[]>(
    `/api/treatments/therapist/${therapistId}/active`
  );
  return response.data;
}

export async function addSessionsToPlan(planId: number, slotIds: number[]) {
  const response = await axios.post(`/api/treatments/${planId}/sessions`, {
    slotIds,
  });
  return response.data;
}
