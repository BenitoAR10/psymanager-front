import { useMutation } from "@tanstack/react-query";
import axios from "../../../services/axiosInstance";

interface CreateCloseTreatmentRequest {
  closingDate: string;
  reason: string;
}

export const useCloseTreatmentMutation = (treatmentId: number) => {
  return useMutation({
    mutationFn: async (data: CreateCloseTreatmentRequest) => {
      const response = await axios.post(
        `/api/treatments/${treatmentId}/close`,
        data
      );
      return response.data;
    },
    retry: false,
    onError: () => {},
  });
};
