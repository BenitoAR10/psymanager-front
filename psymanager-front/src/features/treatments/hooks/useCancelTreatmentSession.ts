import { useMutation } from "@tanstack/react-query";
import axios from "../../../services/axiosInstance";

export const useCancelTreatmentSession = () => {
  return useMutation({
    mutationFn: async ({
      treatmentId,
      sessionId,
    }: {
      treatmentId: number;
      sessionId: number;
    }) => {
      axios.delete(`/api/treatments/${treatmentId}/sessions/${sessionId}`);
    },
  });
};
