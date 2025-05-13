export interface CaseFileDto {
  caseFileId: number;
  treatmentId: number;
  date: string;
  summary: string;
  recommendations: string;
}

export interface CreateOrUpdateCaseFileDto {
  treatmentId: number;
  date: string;
  summary: string;
  recommendations: string;
}
