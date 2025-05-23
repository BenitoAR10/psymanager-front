import { useQuery } from "@tanstack/react-query";
import { getAvailableSchedules } from "../services/scheduleService";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../auth/useAuth";
import dayjs from "dayjs";

export const useAvailableSchedules = (weekStart: Date, enabled: boolean) => {
  const { token } = useAuth();
  const isFocused = useIsFocused();

  const startDate = dayjs(weekStart).format("YYYY-MM-DD");
  const endDate = dayjs(weekStart).add(6, "day").format("YYYY-MM-DD");

  const finalEnabled = !!token && isFocused && enabled;

  return useQuery({
    queryKey: ["available-schedules", startDate, endDate, finalEnabled],
    queryFn: () =>
      getAvailableSchedules({
        token: token!,
        startDate,
        endDate,
      }),
    enabled: finalEnabled,
    staleTime: 1000 * 60 * 1,
    refetchInterval: finalEnabled ? 1000 * 15 : false,
    refetchOnWindowFocus: true,
  });
};
