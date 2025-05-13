import customAxios from "../../../services/axiosInstance";
import type { ClosedTreatmentDetailDto } from "../types";

/**
 * Obtiene el historial completo de un tratamiento cerrado.
 */
export const getClosedTreatmentDetail = async (
  treatmentId: number
): Promise<ClosedTreatmentDetailDto> => {
  const { data } = await customAxios.get(
    `/api/treatments/closed/${treatmentId}/history`
  );
  return data;
};
