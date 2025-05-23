export interface UserAppointmentDto {
  sessionId: number;
  therapistName: string;
  date: string;
  startTime: string;
  endTime: string;

  // Add the missing sessionState property
  sessionState: "PENDING" | "CONFIRMED" | "REJECTED";
}

export interface UserAppointmentDetailDto {
  sessionId: number;
  therapistName: string;
  therapistPhoneNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionState: "PENDING" | "REJECTED" | "CONFIRMED";
}
