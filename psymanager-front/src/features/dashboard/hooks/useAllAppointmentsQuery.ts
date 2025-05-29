import { useQuery } from "@tanstack/react-query";
import { getAllAppointments } from "../services/appointmentsService";
import type { UpcomingAppointmentDto } from "../types";

/**
 * Hook para obtener todas las citas del terapeuta (pasadas, futuras y completadas).
 * Cache key: ['all-appointments']
 */
export function useAllAppointmentsQuery() {
  return useQuery<UpcomingAppointmentDto[], Error>({
    queryKey: ["all-appointments"],
    queryFn: getAllAppointments,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
