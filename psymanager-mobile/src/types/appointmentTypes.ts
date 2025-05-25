export interface UserAppointmentDto {
  sessionId: number;
  therapistName: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionState: "PENDING" | "ACCEPTED" | "REJECTED";
}

export interface UserAppointmentDetailDto {
  sessionId: number;
  therapistName: string;
  therapistPhoneNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionState: "PENDING" | "REJECTED" | "ACCEPTED";
}
