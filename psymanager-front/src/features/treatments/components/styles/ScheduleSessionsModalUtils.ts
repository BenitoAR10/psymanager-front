import type { ScheduleAvailabilityDto } from "../../types";

// Función para formatear la fecha en un formato más legible
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  const localDate = new Date(Number(year), Number(month) - 1, Number(day));
  return localDate.toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Función para formatear la hora en un formato más legible
export const formatTime = (timeString: string): string => {
  // Asumiendo que timeString viene en formato "HH:MM:SS"
  return timeString.substring(0, 5); // Devuelve solo "HH:MM"
};

// Función para calcular la duración en minutos entre dos horas
export const calculateDuration = (
  startTime: string,
  endTime: string
): number => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return endMinutes - startMinutes;
};

// Función para agrupar horarios por fecha
export const groupSchedulesByDate = (schedules: ScheduleAvailabilityDto[]) => {
  const groups: Record<string, ScheduleAvailabilityDto[]> = {};

  schedules.forEach((slot) => {
    if (!groups[slot.date]) {
      groups[slot.date] = [];
    }
    groups[slot.date].push(slot);
  });

  // Ordenar las fechas
  return Object.keys(groups)
    .sort()
    .map((date) => ({
      date,
      slots: groups[date].sort((a, b) => (a.startTime > b.startTime ? 1 : -1)),
    }));
};

// Componente RefreshIcon
