import axios from "../../../services/axiosInstance";

/**
 * Marca una sesión individual como completada.
 * Esta función solo debe ser llamada para sesiones que no formen parte de un tratamiento.
 *
 * @param sessionId ID de la sesión a marcar
 */
export async function markSessionAsCompleted(sessionId: number): Promise<void> {
  try {
    await axios.put(`/api/sessions/${sessionId}/complete`);
  } catch (error) {
    console.error(
      `Error al marcar la sesión ID=${sessionId} como completada:`,
      error
    );
    throw error;
  }
}
