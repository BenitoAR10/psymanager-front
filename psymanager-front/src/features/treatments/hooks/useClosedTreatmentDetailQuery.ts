import { useQuery } from "@tanstack/react-query";
import { getClosedTreatmentDetail } from "../services/getClosedTreatmentDetail";
import type { ClosedTreatmentDetailDto } from "../types";

export const useClosedTreatmentDetailQuery = (
  treatmentId: number | null,
  enabled = true
) => {
  const shouldFetch = !!treatmentId && enabled;

  return useQuery<ClosedTreatmentDetailDto>({
    queryKey: ["closed-treatment-detail", treatmentId],
    queryFn: () => getClosedTreatmentDetail(treatmentId!),
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  });
};
