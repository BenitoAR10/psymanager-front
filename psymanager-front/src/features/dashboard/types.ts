/**
 * DTO que viene del backend en /api/sessions/upcoming
 */
export interface UpcomingAppointmentDto {
  appointmentId: number;
  patientId: number;
  therapistId: number;
  studentName: string;
  dateTime: string;
  state: string;
  isPartOfTreatment: boolean;
}

export interface CreateTreatmentPlanRequestDto {
  patientId: number;
  therapistId: number;
  reason: string;
  semester: string;
  firstSessionDateTime: string; // o LocalDateTime ISO
  recurrent: boolean;
  numberOfSessions?: number;
  intervalWeeks?: number;
}

export interface TreatmentPlanDto {
  id: number;
  patientId: number;
  therapistId: number;
  reason?: string;
  semester?: string;
  startDate: string;
  firstSessionDateTime: string;
  recurrent: boolean;
  numberOfSessions?: number;
  intervalWeeks?: number;
}

export interface ActiveTreatmentStudentDto {
  treatmentId: number;
  patientId: number;
  studentName: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
}

export interface ScheduleAvailabilityDto {
  scheduleId: number;
  therapistId: number;
  date: string;
  startTime: string;
  endTime: string;
  availabilityStatus: "available" | "taken";
  therapistName: string;
  reservedByUserId: number | null;
  sessionState: string | null;
}
