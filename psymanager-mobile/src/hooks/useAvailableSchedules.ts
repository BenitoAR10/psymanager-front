import { useQuery } from "@tanstack/react-query";
import { getAvailableSchedules } from "../services/scheduleService";
import { useAuth } from "../auth/useAuth";
import dayjs from "dayjs";

/**
 * Hook que obtiene los horarios disponibles para la semana dada.
 */
export const useAvailableSchedules = (
  weekStart: Date,
  enabled: boolean,
  calendarVersion = 0
) => {
  const { token } = useAuth();

  const startDate = dayjs(weekStart).format("YYYY-MM-DD");
  const endDate = dayjs(weekStart).add(6, "day").format("YYYY-MM-DD");

  return useQuery({
    queryKey: ["available-schedules", startDate, endDate, calendarVersion],
    queryFn: () =>
      getAvailableSchedules({
        startDate,
        endDate,
      }),
    enabled: !!token && enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
