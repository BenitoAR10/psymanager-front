import { useQuery } from "@tanstack/react-query";
import { getTotalPoints } from "../services/patientStatsService";
import type { TotalPointsDto } from "../types/patientTypes";

/**
 * Hook para obtener el total de puntos acumulados por un paciente.
 *
 * @param patientId ID del paciente
 */
export const useTotalPoints = (patientId: number) => {
  return useQuery<TotalPointsDto>({
    queryKey: ["totalPoints", patientId],
    queryFn: () => getTotalPoints(patientId),
    staleTime: 1000 * 30, // Reducido a 30 segundos para actualizaciones más frecuentes
    retry: false,
    refetchOnWindowFocus: true, // Activado para refrescar cuando la ventana recibe foco
    refetchOnMount: true, // Refrescar al montar el componente
  });
};
