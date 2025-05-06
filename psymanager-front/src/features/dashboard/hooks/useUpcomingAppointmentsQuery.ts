import { useQuery } from "@tanstack/react-query";
import { getUpcomingAppointments } from "../services/appointments";
import type { UpcomingAppointmentDto } from "../types";

/**
 * Hook para obtener las próximas citas confirmadas (limitadas).
 * Cache key: ['upcoming', limit]
 */
export function useUpcomingAppointmentsQuery(limit: number) {
  return useQuery<UpcomingAppointmentDto[], Error>({
    queryKey: ["upcoming", limit],
    queryFn: () => getUpcomingAppointments(limit),
    staleTime: 1000 * 60, // 1 minuto
    select: (data) =>
      data.filter((appt) => appt.state === "ACCEPTED").slice(0, limit),
  });
}
