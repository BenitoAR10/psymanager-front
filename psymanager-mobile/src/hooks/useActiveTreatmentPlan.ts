import { useQuery } from "@tanstack/react-query";
import { getActiveTreatmentPlan } from "../services/treatmentService";

/**
 * Hook para obtener el plan de tratamiento activo del paciente.
 * Se ejecuta solo si se proporciona un ID de paciente válido.
 *
 * @param patientId ID del paciente autenticado
 */
export const useActiveTreatmentPlan = (patientId?: number) => {
  return useQuery({
    queryKey: ["active-treatment", patientId],
    queryFn: async () => {
      if (!patientId) return null;
      return await getActiveTreatmentPlan(patientId);
    },
    enabled: !!patientId,
  });
};
