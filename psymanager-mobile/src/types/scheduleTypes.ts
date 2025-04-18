export interface ScheduleAvailabilityDto {
  scheduleId: number;
  therapistId: number;
  startTime: string;
  endTime: string;
  availabilityStatus: "available" | "taken";
  therapistName: string;
  reservedByUserId?: number | null;
  date: string;
}
