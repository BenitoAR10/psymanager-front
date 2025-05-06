import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentState } from "../services/appointments";

/**
 * Hook para mutar el estado de una cita (ACCEPTED/REJECTED).
 * Al tener éxito, invalida las queries 'pending' y 'upcoming'.
 */
export function useUpdateAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { appointmentId: number; newState: "ACCEPTED" | "REJECTED" }
  >({
    mutationFn: ({ appointmentId, newState }) =>
      updateAppointmentState(appointmentId, newState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming"] });
    },
  });
}
