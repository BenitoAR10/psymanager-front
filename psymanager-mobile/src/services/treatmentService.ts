import { API_URL } from "../utils/constants";
import { storage } from "../utils/storage";

/**
 * Obtiene el plan de tratamiento activo del paciente actual.
 * Retorna null si no hay tratamiento activo.
 */
export const getActiveTreatmentPlan = async (patientId: number) => {
  const accessToken = await storage.getItem("accessToken");

  const response = await fetch(
    `${API_URL}/api/treatments/patient/${patientId}/active`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 204 || response.status === 409) {
    // 204: sin contenido, 409: sin tratamiento activo
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al obtener tratamiento activo");
  }

  return response.json();
};
