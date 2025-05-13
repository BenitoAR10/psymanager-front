import { useMutation } from "@tanstack/react-query";
import axios from "../../../services/axiosInstance";

export const useCompleteSessionMutation = () => {
  return useMutation({
    mutationFn: async (sessionId: number) => {
      await axios.put(`/api/treatments/sessions/${sessionId}/complete`);
    },
  });
};
