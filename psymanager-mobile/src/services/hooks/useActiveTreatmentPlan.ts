import { useQuery } from "@tanstack/react-query";
import { getActiveTreatmentPlan } from "../treatmentService";

export const useActiveTreatmentPlan = (patientId: number | undefined) => {
  return useQuery({
    queryKey: ["active-treatment", patientId],
    queryFn: () => {
      if (!patientId) return Promise.resolve(null);
      return getActiveTreatmentPlan(patientId);
    },
    enabled: !!patientId, // Solo corre si hay un ID válido
  });
};
