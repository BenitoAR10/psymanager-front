// Formatear fecha para mostrar al usuario (DD/MM/YYYY)
export const formatDate = (date: Date | null): string => {
  if (!date) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Formatear fecha para enviar al servidor (YYYY-MM-DD)

export const formatDateForServer = (date: Date | null): string => {
  if (!date) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

// src/utils/validators.ts

/**
 * Valida un campo del formulario de perfil.
 * Retorna cadena vacía si pasa, o el mensaje de error.
 */
export const validateField = (name: string, value: any): string => {
  let errorMessage = "";

  switch (name) {
    // Número de CI: 7 u 8 dígitos
    case "ciNumber": {
      const ci = value?.toString().trim() || "";
      if (!ci) {
        errorMessage = "El número de CI es requerido";
      } else if (!/^\d{7,8}$/.test(ci)) {
        errorMessage = "El CI debe tener sólo dígitos 7 u 8 caracteres";
      }
      break;
    }

    // Teléfono: exactamente 8 dígitos
    case "phoneNumber": {
      const phone = value?.toString().trim() || "";
      if (!phone) {
        errorMessage = "El número de teléfono es requerido";
      } else if (!/^\d{8}$/.test(phone)) {
        errorMessage =
          "El teléfono debe tener sólo dígitos y exactamente 8 caracteres";
      }
      break;
    }

    // Fecha de nacimiento
    case "birthDate":
      if (!value) {
        errorMessage = "La fecha de nacimiento es requerida";
      } else {
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear();
        if (age < 16) {
          errorMessage = "Debes tener al menos 16 años";
        } else if (age > 100) {
          errorMessage = "Fecha de nacimiento inválida";
        }
      }
      break;

    // Género biológico
    case "birthGender":
      if (!value) {
        errorMessage = "El género biológico es requerido";
      }
      break;

    // Facultad (dropdown)
    case "faculty":
      if (!value) {
        errorMessage = "La facultad es requerida";
      }
      break;

    // Carrera (dropdown)
    case "careerId":
      if (value == null) {
        errorMessage = "La carrera es requerida";
      }
      break;

    // Si el campo no está en este switch, no hay error
    default:
      break;
  }

  return errorMessage;
};
