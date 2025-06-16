/**
 * Detalles de sesión de tratamiento.
 */
export interface TreatmentSessionDetailDto {
  sessionId: number;
  sessionDate: string; // ISO date
  startTime: string; // "HH:mm:ss"
  endTime: string;
  state: string;
  completed: boolean;
  notes: string | null;
  sessionOrder: number;
}

/**
 * Detalles del tratamiento.
 */
export interface TreatmentDetailDto {
  treatmentId: number;
  patientId: number;
  startDate: string;
  endDate: string;
  reason: string;
  semester: string;
  sessions: TreatmentSessionDetailDto[];

  /** Indica si este tratamiento es una reapertura */
  reopened: boolean;
}

/**
 * Nota de sesión.
 */
export interface SessionNoteDto {
  sessionNoteId: number;
  treatmentSessionId: number;
  topicAddressed: string;
  sessionSummary: string;
  relevantObservations: string;
  nextTopic: string;
  createdAt: string;
}

/**
 * DTO para crear o actualizar nota de sesión.
 */
export interface CreateOrUpdateSessionNoteDto {
  treatmentSessionId: number;
  topicAddressed: string;
  sessionSummary: string;
  relevantObservations: string;
  nextTopic: string;
}

/**
 * Resumen de tratamientos cerrados.
 */
export interface ClosedTreatmentSummaryDto {
  treatmentId: number;
  studentName: string;
  startDate: string;
  closingDate: string;
  reason: string;
  completedSessions: number;
}

/**
 * Resumen de nota de sesión para tratamiento cerrado.
 */
export interface SessionNoteSummaryDto {
  sessionDate: string;
  topicAddressed: string;
  sessionSummary: string;
  relevantObservations: string;
  nextTopic: string;
}

/**
 * Caso clínico asociado a tratamiento.
 */
export interface CaseFileDto {
  caseFileId: number;
  treatmentId: number;
  date: string;
  summary: string;
  recommendations: string;
}

/**
 * Detalle de tratamiento cerrado.
 */
export interface ClosedTreatmentDetailDto {
  treatmentId: number;
  therapistId: number;
  studentName: string;
  semester: string;
  reason: string;
  startDate: string;
  endDate: string;
  closingDate: string;
  closureReason: string;
  sessionNotes: SessionNoteSummaryDto[];
  caseFile?: CaseFileDto;
  wasReopened: boolean;
  reopeningDate?: string;
  reopenedTreatmentId?: number;
}

// Estadísticas de ejercicios de bienestar

/**
 * DTO para exponer el conteo total de ejercicios completados.
 */
export interface TotalCountResponseDto {
  /** Número total de ejercicios completados por el paciente en el período. */
  total: number;
}

/**
 * DTO para exponer el número de ejercicios completados por semana.
 */
export interface WeeklyCountResponseDto {
  /** Año ISO de la semana. */
  year: number;
  /** Número de la semana en el año (ISO-8601). */
  week: number;
  /** Cantidad de ejercicios completados en esa semana. */
  count: number;
}

/**
 * DTO para exponer el conteo de ejercicios completados, agrupado por categoría.
 */
export interface CategoryCountResponseDto {
  /** Nombre de la categoría del ejercicio (por ejemplo: Ansiedad, Estrés). */
  category: string;
  /** Número de ejercicios completados en esa categoría. */
  count: number;
}

/**
 * DTO que agrupa las tres métricas de estadísticas:
 * total, serie semanal y distribución por categoría.
 */
export interface StatisticsResponseDto {
  /** Conteo total de ejercicios completados. */
  total: TotalCountResponseDto;
  /** Serie semanal de conteo de ejercicios. */
  series: WeeklyCountResponseDto[];
  /** Conteo de ejercicios completados por categoría. */
  byCategory: CategoryCountResponseDto[];
}

/**
 * DTO para exponer el conteo diario de ejercicios completados.
 */
export interface DailyCountResponseDto {
  /** Fecha del día (ISO-8601), p. ej. "2025-06-10" */
  day: string;
  /** Número de ejercicios completados en ese día */
  count: number;
}

/**
 * DTO que agrupa el total y la serie diaria de estadísticas.
 */
export interface DailySeriesResponseDto {
  /** Suma total de ejercicios completados en el rango */
  total: number;
  /** Serie diaria de conteos */
  series: DailyCountResponseDto[];
}

/**
 * DTO para exponer el conteo por hora de ejercicios completados.
 */
export interface HourlyCountResponseDto {
  /** Fecha y hora truncada a la hora (ISO-8601), p. ej. "2025-06-07T15:00:00" */
  hour: string;
  /** Número de ejercicios completados en esa hora */
  count: number;
}

/**
 * DTO que agrupa el total y la serie horaria de estadísticas.
 */
export interface HourlySeriesResponseDto {
  /** Suma total de ejercicios completados en el rango */
  total: number;
  /** Serie de conteos por cada hora */
  series: HourlyCountResponseDto[];
}

/**
 * DTO para solicitar la reapertura de un tratamiento.
 */
export interface ReopenTreatmentRequestDto {
  previousTreatmentId: number;
  therapistId: number;
  newStartDate: string;
  newEndDate: string;
  reason: string;
  semester: string;
}
