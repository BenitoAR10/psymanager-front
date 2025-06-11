import { useQuery } from "@tanstack/react-query";
import { getPendingAppointments } from "../services/appointments";
import type { UpcomingAppointmentDto } from "../types";

/**
 * Hook para obtener todas las solicitudes PENDING del terapeuta.
 * Cache key: ['pending']
 */
export function usePendingAppointmentsQuery() {
  return useQuery<UpcomingAppointmentDto[], Error>({
    queryKey: ["pending"],
    queryFn: getPendingAppointments,
    staleTime: 5 * 1000,
    refetchInterval: 5 * 1000,
    refetchOnWindowFocus: true,
    placeholderData: [],
  });
}
