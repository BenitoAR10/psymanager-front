import customAxios from "../../../services/axiosInstance";
import type { ClosedTreatmentSummaryDto } from "../types";

export const getClosedTreatmentsByTherapist = async (
  therapistId: number
): Promise<ClosedTreatmentSummaryDto[]> => {
  const { data } = await customAxios.get(
    `/api/treatments/therapist/${therapistId}/closed`
  );
  return data;
};
