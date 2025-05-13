import { useQuery } from "@tanstack/react-query";
import { getCaseFileByTreatmentId } from "../services/caseFileService";
import type { CaseFileDto } from "../types";

export const useCaseFileQuery = (treatmentId: number, enabled = true) => {
  const isValid = !!treatmentId && Number.isFinite(treatmentId);

  return useQuery<CaseFileDto>({
    queryKey: ["case-file", treatmentId],
    queryFn: () => getCaseFileByTreatmentId(treatmentId),
    enabled: enabled && isValid,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
