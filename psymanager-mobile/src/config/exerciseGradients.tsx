export interface ExerciseGradient {
  colors: readonly [string, string, ...string[]]; // Al menos 2 colores requeridos
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const exerciseGradients: Record<string, ExerciseGradient> = {
  ansiedad: {
    colors: ["#667eea", "#764ba2", "#a8c8ec"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  estrés: {
    colors: ["#2c5282", "#4299e1", "#90cdf4"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  relajación: {
    colors: ["#553c9a", "#b794f6", "#e9d8fd"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  depresión: {
    colors: ["#2d3748", "#4a5568", "#a0aec0"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  mindfulness: {
    colors: ["#38a169", "#68d391", "#c6f6d5"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  respiración: {
    colors: ["#319795", "#4fd1c5", "#b2f5ea"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  general: {
    colors: ["#2d3748", "#4a5568", "#ed8936", "#fbb6ce"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;

// Función helper para obtener el gradiente según categoría
export const getExerciseGradient = (category: string): ExerciseGradient => {
  const normalizedCategory = category.toLowerCase().trim();

  // Buscar coincidencia exacta primero
  if (exerciseGradients[normalizedCategory]) {
    return exerciseGradients[normalizedCategory];
  }

  // Buscar coincidencias parciales para mayor flexibilidad
  const partialMatch = Object.keys(exerciseGradients).find(
    (key) =>
      normalizedCategory.includes(key) || key.includes(normalizedCategory)
  );

  if (partialMatch) {
    return exerciseGradients[partialMatch];
  }

  // Fallback al gradiente general
  return exerciseGradients.general;
};

// Gradientes alternativos para diferentes momentos del día (opcional)
export const timeBasedGradients = {
  morning: {
    colors: ["#fbb6ce", "#f687b3", "#ed64a6"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  afternoon: {
    colors: ["#4299e1", "#63b3ed", "#90cdf4"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  evening: {
    colors: ["#553c9a", "#805ad5", "#b794f6"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  night: {
    colors: ["#1a202c", "#2d3748", "#4a5568"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;
