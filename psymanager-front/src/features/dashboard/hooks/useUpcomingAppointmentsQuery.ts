import { useQuery } from "@tanstack/react-query";
import { getUpcomingAppointments } from "../services/appointmentsService";
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
      const GRACE_MINUTES = 10;

      return data
        .filter((appt) => {
          const start = new Date(appt.dateTime);
          const end = new Date(start.getTime() + 60 * 60 * 1000);

          const isActiveAccepted = appt.state === "ACCEPTED" && end >= now;
          const isGraceCompleted =
            appt.state === "COMPLETED" &&
            now <= new Date(end.getTime() + GRACE_MINUTES * 60 * 1000);

          return isActiveAccepted || isGraceCompleted;
        })
        .slice(0, limit);
    },
  });
}
