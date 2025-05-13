import { useQuery } from "@tanstack/react-query";
import { getSchedulesByTherapistAndDateRange } from "../services/scheduleService";
import { ScheduleAvailabilityDto } from "../types";

export function useAvailableSchedulesQuery(
  therapistId: number,
  startDate: string,
  endDate: string,
  open: boolean
) {
  return useQuery<ScheduleAvailabilityDto[]>({
    queryKey: ["schedules", "available", therapistId, startDate, endDate],
    queryFn: () =>
      getSchedulesByTherapistAndDateRange(therapistId, startDate, endDate),
    enabled: open && !!therapistId && !!startDate && !!endDate,

    select: (schedules) =>
      schedules.filter((s) => s.availabilityStatus === "available"),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
