import { addSessionsToPlan } from "../services/treatmentService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddSessionsMutation(planId: number, therapistId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotIds: number[]) => addSessionsToPlan(planId, slotIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["active-treatment-patients", therapistId],
      });
    },
  });
}
