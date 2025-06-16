import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import customAxios from "../../../services/axiosInstance";
import type { ReopenTreatmentRequestDto } from "../types";
import type { TreatmentPlanDto } from "../../dashboard/types";

/**
 * Hook para enviar la solicitud de reapertura de un tratamiento cerrado.
 */
export function useReopenTreatmentMutation(treatmentId: number) {
  const queryClient = useQueryClient();

  return useMutation<TreatmentPlanDto, Error, ReopenTreatmentRequestDto>({
    mutationFn: async (payload) => {
      const { data } = await customAxios.post<TreatmentPlanDto>(
        "/api/treatments/reopen",
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Tratamiento reabierto exitosamente");

      queryClient.invalidateQueries({
        queryKey: ["closed-treatment-detail", treatmentId],
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "No se pudo reabrir el tratamiento. Intenta más tarde."
      );
    },
  });
}
