import axios from "../../../services/axiosInstance";
import { TreatmentDetailDto } from "../types";

export const getTreatmentDetail = async (
  treatmentId: number
): Promise<TreatmentDetailDto> => {
  const { data } = await axios.get(`/api/treatments/${treatmentId}`);
  return data;
};
