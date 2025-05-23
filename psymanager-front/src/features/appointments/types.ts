/**
 * DTO que viene del backend en /api/sessions/upcoming
 */
export interface UpcomingAppointmentDto {
  appointmentId: number;
  studentName: string;
  dateTime: string;
  state: string;
  reason?: string;
}
