import { fetcher } from "../utils/fetcher";
import { API_URL } from "../utils/urlConstant";

/**
 * Obtiene el plan de tratamiento activo del paciente autenticado.
 * Retorna `null` si no hay tratamiento activo (204 o 409).
 */
export const getActiveTreatmentPlan = async (
  patientId: number
): Promise<any | null> => {
  const res = await fetch(
    `${API_URL}/api/treatments/patient/${patientId}/active`,
    {
      headers: { Authorization: "omit" },
    }
  );

  if (res.status === 204 || res.status === 409) {
    return null;
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al obtener tratamiento activo");
  }

  return res.json();
};
