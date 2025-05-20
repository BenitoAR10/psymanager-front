/**
 * Representa una especialidad que el terapeuta puede seleccionar.
 */
export interface SpecialtyDto {
  specialtyId: number;
  specialtyName: string;
}

export interface TherapistProfileViewDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  ciNumber?: string;
  ciComplement?: string;
  ciExtension?: string;

  // Añade esta propiedad si tu backend ya la devuelve
  specialties: {
    specialtyId: number;
    specialtyName: string;
  }[];
}

/**
 * DTO para actualizar o completar el perfil del terapeuta.
 */
export interface TherapistProfileUpdateDto {
  ciNumber: string;
  ciComplement?: string;
  ciExtension: string;
  phoneNumber: string;
  address?: string;
  specialtyIds: number[];
}
