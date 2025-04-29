import axiosInstance from "../../../services/axiosInstance";
import type { CalendarEvent } from "../types";

// Definimos cómo luce la respuesta del backend
interface ScheduleResponseDto {
  therapistScheduleId: number;
  userTherapistId: number;
  date: string; // formato "yyyy-MM-dd"
  startTime: string; // formato "HH:mm"
  endTime: string; // formato "HH:mm"
  therapistName: string;
}

// Petición para crear o actualizar un horario
export interface CreateScheduleRequestDto {
  userTherapistId: number;
  date: string; // "yyyy-MM-dd"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

// Servicio para obtener los horarios
export async function fetchSchedules(): Promise<CalendarEvent[]> {
  const response = await axiosInstance.get<ScheduleResponseDto[]>(
    `/api/schedules`
  );
  return response.data.map((schedule) => ({
    id: schedule.therapistScheduleId,
    title: schedule.therapistName,
    start: new Date(`${schedule.date}T${schedule.startTime}`),
    end: new Date(`${schedule.date}T${schedule.endTime}`),
    userTherapistId: schedule.userTherapistId,
  }));
}

// Servicio para crear un nuevo horario
export async function createSchedule(
  request: CreateScheduleRequestDto
): Promise<CalendarEvent> {
  const response = await axiosInstance.post<ScheduleResponseDto>(
    `/api/schedules`,
    request
  );
  const schedule = response.data;
  return {
    id: schedule.therapistScheduleId,
    title: schedule.therapistName,
    start: new Date(`${schedule.date}T${schedule.startTime}`),
    end: new Date(`${schedule.date}T${schedule.endTime}`),
    userTherapistId: schedule.userTherapistId,
  };
}

// Servicio para actualizar un horario existente
export async function updateSchedule(
  scheduleId: number,
  request: CreateScheduleRequestDto
): Promise<CalendarEvent> {
  const response = await axiosInstance.put<ScheduleResponseDto>(
    `/api/schedules/${scheduleId}`,
    request
  );
  const schedule = response.data;
  return {
    id: schedule.therapistScheduleId,
    title: schedule.therapistName,
    start: new Date(`${schedule.date}T${schedule.startTime}`),
    end: new Date(`${schedule.date}T${schedule.endTime}`),
    userTherapistId: schedule.userTherapistId,
  };
}
