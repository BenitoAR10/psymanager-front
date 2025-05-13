import { useQuery } from "@tanstack/react-query";
import { getActiveTreatmentPatientsByTherapist } from "../services/treatmentService";
import { ActiveTreatmentStudentDto } from "../types";

/**
 * Hook para obtener estudiantes con tratamiento activo por terapeuta.
 * @param therapistId ID del terapeuta
 */
export function useActiveTreatmentPatientsQuery(therapistId: number) {
  return useQuery<ActiveTreatmentStudentDto[]>({
    queryKey: ["active-treatment-patients", therapistId],
    queryFn: () => getActiveTreatmentPatientsByTherapist(therapistId),
    enabled: !!therapistId,
  });
}
