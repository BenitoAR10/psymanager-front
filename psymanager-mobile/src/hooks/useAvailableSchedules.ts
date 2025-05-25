import { useQuery } from "@tanstack/react-query";
import { getAvailableSchedules } from "../services/scheduleService";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../auth/useAuth";
import dayjs from "dayjs";

/**
 * Hook que obtiene los horarios disponibles para la semana dada.
 * Se activa solo si la pantalla está en foco y hay un token válido.
 *
 * @param weekStart Fecha de inicio de semana (tipo Date)
 * @param enabled Booleano adicional para control externo
 */
export const useAvailableSchedules = (weekStart: Date, enabled: boolean) => {
  const { token } = useAuth();
  const isFocused = useIsFocused();

  const startDate = dayjs(weekStart).format("YYYY-MM-DD");
  const endDate = dayjs(weekStart).add(6, "day").format("YYYY-MM-DD");

  const finalEnabled = !!token && isFocused && enabled;

  return useQuery({
    queryKey: ["available-schedules", startDate, endDate],
    queryFn: () =>
      getAvailableSchedules({
        startDate,
        endDate,
      }),
    enabled: finalEnabled,
    staleTime: 60_000,
    refetchInterval: finalEnabled ? 15_000 : false,
    refetchOnWindowFocus: true,
  });
};
