import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchSpecialties,
  updateTherapistProfile,
} from "../services/profileService";
import type { SpecialtyDto, TherapistProfileUpdateDto } from "../types";

export function useTherapistProfileForm() {
  const [form, setForm] = useState<TherapistProfileUpdateDto>({
    ciNumber: "",
    ciComplement: "",
    ciExtension: "",
    phoneNumber: "",
    address: "",
    specialtyIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState<SpecialtyDto[]>([]);

  useEffect(() => {
    fetchSpecialties()
      .then(setSpecialties)
      .catch(() => toast.error("No se pudieron cargar las especialidades."));
  }, []);

  const handleChange = <K extends keyof TherapistProfileUpdateDto>(
    field: K,
    value: TherapistProfileUpdateDto[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof TherapistProfileUpdateDto) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const validateField = <K extends keyof TherapistProfileUpdateDto>(
    field: K,
    value: TherapistProfileUpdateDto[K]
  ): boolean => {
    let error = "";
    if (field === "ciNumber" && typeof value === "string" && !value.trim()) {
      error = "El número de CI es requerido.";
    }
    if (field === "phoneNumber" && typeof value === "string" && !value.trim()) {
      error = "El teléfono es requerido.";
    }
    if (field === "ciExtension" && typeof value === "string" && !value.trim()) {
      error = "La extensión del CI es requerida.";
    }
    if (
      field === "specialtyIds" &&
      Array.isArray(value) &&
      value.length === 0
    ) {
      error = "Selecciona al menos una especialidad.";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const validateForm = () => {
    const fields: (keyof TherapistProfileUpdateDto)[] = [
      "ciNumber",
      "ciExtension",
      "phoneNumber",
      "specialtyIds",
    ];
    const result = fields.map((field) => validateField(field, form[field]));
    return result.every((isValid) => isValid);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateTherapistProfile(form);
      toast.success("Perfil actualizado correctamente.");
    } catch (error) {
      toast.error("No se pudo actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    touched,
    loading,
    specialties,
    handleChange,
    handleBlur,
    handleSubmit,
    setForm,
  };
}
