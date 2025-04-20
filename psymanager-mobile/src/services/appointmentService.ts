import { UserAppointmentDto } from "../types/appointmentTypes";

export async function getUserAppointments(
  token: string
): Promise<UserAppointmentDto[]> {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

  const response = await fetch(`${baseUrl}/api/sessions/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al obtener citas agendadas");
  }

  const data = await response.json();
  return data;
}
