import { useQuery } from "@tanstack/react-query";
import { getClosedTreatmentsByTherapist } from "../services/treatmentService";
import type { ClosedTreatmentSummaryDto } from "../types";

export const useClosedTreatmentsQuery = (
  therapistId: number,
  enabled = true
) => {
  const isValid = !!therapistId && Number.isFinite(therapistId);
  return useQuery<ClosedTreatmentSummaryDto[]>({
    queryKey: ["closed-treatments", therapistId],
    queryFn: () => getClosedTreatmentsByTherapist(therapistId),
    enabled: enabled && isValid,
    staleTime: 1000 * 60 * 5,
  });
};
