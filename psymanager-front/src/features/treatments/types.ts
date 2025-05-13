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

export interface TreatmentDetailDto {
  treatmentId: number;
  startDate: string;
  endDate: string;
  reason: string;
  semester: string;
  sessions: TreatmentSessionDetailDto[];
}

export interface SessionNoteDto {
  sessionNoteId: number;
  treatmentSessionId: number;
  topicAddressed: string;
  sessionSummary: string;
  relevantObservations: string;
  nextTopic: string;
  createdAt: string;
}

export interface CreateOrUpdateSessionNoteDto {
  treatmentSessionId: number;
  topicAddressed: string;
  sessionSummary: string;
  relevantObservations: string;
  nextTopic: string;
}

export interface ClosedTreatmentSummaryDto {
  treatmentId: number;
  studentName: string;
  startDate: string;
  closingDate: string;
  reason: string;
  completedSessions: number;
}

export interface SessionNoteSummaryDto {
  sessionDate: string;
  topicAddressed: string;
  sessionSummary: string;
  relevantObservations: string;
  nextTopic: string;
}

export interface CaseFileDto {
  caseFileId: number;
  treatmentId: number;
  date: string;
  summary: string;
  recommendations: string;
}

export interface ClosedTreatmentDetailDto {
  treatmentId: number;
  studentName: string;
  semester: string;
  reason: string;
  startDate: string;
  endDate: string;
  closingDate: string;
  closureReason: string;
  sessionNotes: SessionNoteSummaryDto[];
  caseFile?: CaseFileDto;
}
