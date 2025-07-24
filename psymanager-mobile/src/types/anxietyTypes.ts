export interface AnxietyEntry {
  id: string;
  date: string;
  timestamp: number;

  // Identificación del trigger
  trigger: string;
  triggerType: "pensamiento" | "imagen" | "situacion";

  // Registro estructurado
  situation: string;
  thought: string;
  emotion: string;
  physicalResponse: string;
  behavior: string;

  // Preguntas de reflexión
  evidenceFor: string;
  evidenceAgainst: string;
  alternativeView: string;
  adviceToFriend: string;

  // Reestructuración
  alternativeThought: string;

  // Metadata
  completed: boolean;
  pointsEarned: number;
}

export interface AnxietyJournalStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
