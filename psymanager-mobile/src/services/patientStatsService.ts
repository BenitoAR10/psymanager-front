import { fetcher } from "../utils/fetcher";
import type { TotalPointsDto } from "../types/patientTypes";

/**
 * Obtiene el total de puntos acumulados de un paciente.
 *
 * @param patientId ID del paciente
 * @returns Un objeto con la propiedad `totalPoints`
 */
export async function getTotalPoints(
  patientId: number
): Promise<TotalPointsDto> {
  // Ajusta la ruta a la que hayas expuesto en tu controller, p.ej.:
  // GET /api/patients/{id}/wellness-stats
  return fetcher<TotalPointsDto>(`/api/patients/${patientId}/wellness-stats`);
}
