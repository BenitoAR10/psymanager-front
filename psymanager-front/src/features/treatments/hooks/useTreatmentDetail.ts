import { useQuery } from "@tanstack/react-query";
import { getTreatmentDetail } from "../services/getTreatmentDetail";

export const useTreatmentDetail = (treatmentId: number) =>
  useQuery({
    queryKey: ["treatment-detail", treatmentId],
    queryFn: () => getTreatmentDetail(treatmentId),
    enabled: !!treatmentId,
  });
