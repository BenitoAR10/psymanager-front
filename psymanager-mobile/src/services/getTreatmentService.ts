import { fetcher } from "../utils/fetcher";
import type { TreatmentStatusDto } from "../types/treatmentTypes";

export const getTreatmentStatus = async (): Promise<TreatmentStatusDto> => {
  return await fetcher("/api/treatments/my/active-status");
};
