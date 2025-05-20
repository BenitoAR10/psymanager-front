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

export const validateField = (name: string, value: any): string => {
  let errorMessage = "";

  switch (name) {
    case "ciNumber":
      if (!value?.toString().trim()) {
        errorMessage = "El número de CI es requerido";
      } else if (!/^\d+$/.test(value.toString())) {
        errorMessage = "El CI debe contener solo números";
      }
      break;

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

    case "birthGender":
      if (!value) {
        errorMessage = "El género biológico es requerido";
      }
      break;

    case "career":
      if (!value) {
        errorMessage = "La carrera es requerida";
      }
      break;
  }

  return errorMessage;
};
