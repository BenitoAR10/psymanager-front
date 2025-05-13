import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTreatment } from "../services/treatmentService";
import type { CreateTreatmentPlanRequestDto, TreatmentPlanDto } from "../types";

export function useCreateTreatmentMutation() {
  const queryClient = useQueryClient();

  return useMutation<TreatmentPlanDto, Error, CreateTreatmentPlanRequestDto>({
    mutationFn: createTreatment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["active-treatment-patients", variables.therapistId],
      });
    },
  });
}
