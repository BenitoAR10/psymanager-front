import { useMutation } from "@tanstack/react-query";
import axios from "../../../services/axiosInstance";

interface CreateCloseTreatmentRequest {
  closingDate: string; // ISO format
  reason: string;
}

export const useCloseTreatmentMutation = (treatmentId: number) => {
  return useMutation({
    mutationFn: (data: CreateCloseTreatmentRequest) =>
      axios
        .post(`/api/treatments/${treatmentId}/close`, data)
        .then((res) => res.data),
  });
};
