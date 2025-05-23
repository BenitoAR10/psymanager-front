export interface ScheduleAvailabilityDto {
  scheduleId: number;
  therapistId: number;
  startTime: string;
  endTime: string;
  availabilityStatus: "available" | "taken";
  therapistName: string;
  reservedByUserId?: number | null;
  date: string;
  sessionState?: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED" | "COMPLETED";
}

export interface ScheduleAvailabilityWithContactDto {
  scheduleId: number;
  therapistId: number;
  startTime: string;
  endTime: string;
  availabilityStatus: "available" | "taken";
  therapistName: string;
  reservedByUserId?: number | null;
  date: string;
  sessionState?: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED" | "COMPLETED";
  therapistPhoneNumber: string;
  therapistEmail: string;
}
