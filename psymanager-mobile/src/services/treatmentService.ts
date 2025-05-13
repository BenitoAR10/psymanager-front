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

  if (response.status === 204) return null;

  if (!response.ok) {
    throw new Error("Error al obtener tratamiento activo");
  }

  return response.json();
};
