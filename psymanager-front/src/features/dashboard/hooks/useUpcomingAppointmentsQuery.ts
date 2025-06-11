import { useQuery } from "@tanstack/react-query";
import { getUpcomingAppointments } from "../services/appointmentsService";
import type { UpcomingAppointmentDto } from "../types";

/**
 * Hook para obtener las próximas citas ( ACCEPTED | COMPLETED)
 * @param limit número máximo de citas a pedirle al backend
 */
export function useUpcomingAppointmentsQuery(limit: number) {
  return useQuery<UpcomingAppointmentDto[], Error>({
    queryKey: ["upcomingAppointments", limit],
    queryFn: () => getUpcomingAppointments(limit),
    staleTime: 1000 * 60, // 1 minuto
  });
}
