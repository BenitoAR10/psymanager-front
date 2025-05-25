import dayjs from "dayjs";
import { theme } from "../screens/styles/themeConstants";

const { colors } = theme;

type SessionState = "PENDING" | "REJECTED" | "CONFIRMED" | "ACCEPTED" | string;

interface AppointmentVisualState {
  text: string;
  color: string;
  bgColor: string;
}

/**
 * Devuelve información visual para representar el estado de una cita.
 *
 * @param sessionState Estado de la sesión
 * @param date Fecha en formato YYYY-MM-DD
 * @param endTime Hora de finalización en formato HH:mm
 */
export function getAppointmentVisualState(
  sessionState: SessionState,
  date: string,
  endTime: string
): AppointmentVisualState {
  const isPast = dayjs(`${date}T${endTime}`).isBefore(dayjs());

  switch (sessionState) {
    case "PENDING":
      return {
        text: "Pendiente de confirmación",
        color: colors.warning.main,
        bgColor: `${colors.warning.light}20`,
      };
    case "REJECTED":
      return {
        text: "Rechazada",
        color: colors.error.main,
        bgColor: `${colors.error.light}20`,
      };
    case "CONFIRMED":
    case "ACCEPTED":
      if (isPast) {
        return {
          text: "Completada",
          color: colors.text.secondary,
          bgColor: `${colors.grey[300]}40`,
        };
      } else {
        return {
          text: "Confirmada",
          color: colors.success.main,
          bgColor: `${colors.success.light}20`,
        };
      }
    default:
      return {
        text: "Desconocido",
        color: colors.text.secondary,
        bgColor: `${colors.grey[200]}50`,
      };
  }
}
