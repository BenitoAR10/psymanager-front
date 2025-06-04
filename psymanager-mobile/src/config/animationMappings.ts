export interface CelebrationConfig {
  message: string;
  reflection: string;
}

export const celebrationConfigMap: Record<string, CelebrationConfig> = {
  ansiedad: {
    message:
      "Has dedicado unos minutos valiosos para respirar y calmar tu mente.",
    reflection:
      "¿Puedes sentir cómo tu respiración se ha vuelto más tranquila?",
  },
  estrés: {
    message: "Te has regalado un momento de pausa en medio del día.",
    reflection: "Nota cómo tu cuerpo se siente ahora, más relajado y presente.",
  },
  relajación: {
    message: "Has creado un espacio de serenidad para ti mismo.",
    reflection: "Lleva contigo esta sensación de calma hacia lo que sigue.",
  },
  general: {
    message: "Has dedicado unos minutos para cuidarte y estar presente.",
    reflection:
      "Respira hondo y siente cómo este momento te pertenece completamente.",
  },
};
