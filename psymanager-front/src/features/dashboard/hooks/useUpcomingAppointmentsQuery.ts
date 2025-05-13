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
    staleTime: 1000 * 60,
    select: (data) => {
      const now = new Date();
      return data
        .filter((appt) => {
          if (appt.state !== "ACCEPTED") return false;

          const start = new Date(appt.dateTime);
          const end = new Date(start.getTime() + 60 * 60 * 1000);

          return end >= now;
        })
        .slice(0, limit);
    },
  });
}
