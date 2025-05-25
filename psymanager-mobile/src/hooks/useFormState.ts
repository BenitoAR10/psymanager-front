import { useState } from "react";
import { completePatientProfile } from "../services/authService";
import { validateField } from "../utils/validators";
import { formatDateForServer } from "../utils/validators";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../auth/useAuth";
import { useToast } from "react-native-toast-notifications";

export interface FormState {
  ciNumber: string;
  ciComplement: string;
  ciExtension: string;
  birthDate: Date | null;
  birthGender: string;
  identityGender: string;
  address: string;
  faculty: string;
  careerId: number | null;
  phoneNumber: string;
}

export interface FormErrors {
  ciNumber: string;
  birthDate: string;
  birthGender: string;
  faculty: string;
  careerId: string;
  phoneNumber: string;
}

export interface FormTouched {
  ciNumber: boolean;
  birthDate: boolean;
  birthGender: boolean;
  faculty: boolean;
  careerId: boolean;
  phoneNumber: boolean;
}

export const useFormState = (
  navigation: NativeStackNavigationProp<RootStackParamList>
) => {
  // Estados para los campos del formulario
  const [formState, setFormState] = useState<FormState>({
    ciNumber: "",
    ciComplement: "",
    ciExtension: "",
    birthDate: null,
    birthGender: "",
    identityGender: "",
    address: "",
    faculty: "",
    careerId: null,
    phoneNumber: "",
  });

  const toast = useToast();

  const { setJustRegistered } = useAuth();

  // Estados para errores de validación
  const [errors, setErrors] = useState<FormErrors>({
    ciNumber: "",
    birthDate: "",
    birthGender: "",
    faculty: "",
    careerId: "",
    phoneNumber: "",
  });

  // Estados para campos tocados (para validación)
  const [touched, setTouched] = useState<FormTouched>({
    ciNumber: false,
    birthDate: false,
    birthGender: false,
    faculty: false,
    careerId: false,
    phoneNumber: false,
  });

  // Estado de carga
  const [loading, setLoading] = useState(false);

  // Estados para los modales de selección
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showIdentityGenderPicker, setShowIdentityGenderPicker] =
    useState(false);
  const [showExtensionPicker, setShowExtensionPicker] = useState(false);
  const [showCareerPicker, setShowCareerPicker] = useState(false);

  // Manejar cambios en los inputs
  const handleInputChange = (name: keyof FormState, value: any) => {
    setFormState((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof FormTouched]) {
      const errorMessage = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    }
  };

  // Marcar un campo como tocado cuando pierde el foco
  const handleBlur = (field: keyof FormTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMessage = validateField(
      field,
      formState[field as keyof FormState]
    );
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  // Manejar cambio de fecha
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      handleInputChange("birthDate", selectedDate);
    }
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {
      ciNumber: validateField("ciNumber", formState.ciNumber),
      birthDate: validateField("birthDate", formState.birthDate),
      birthGender: validateField("birthGender", formState.birthGender),
      faculty: validateField("faculty", formState.faculty),
      careerId: validateField("careerId", formState.careerId),
      phoneNumber: validateField("phoneNumber", formState.phoneNumber),
    };

    setErrors(newErrors);
    setTouched({
      ciNumber: true,
      birthDate: true,
      birthGender: true,
      faculty: true,
      careerId: true,
      phoneNumber: true,
    });

    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Manejar completar perfil
  // Manejar completar perfil
  const handleCompleteProfile = async () => {
    if (!validateForm()) return;

    const dto = {
      ciNumber: formState.ciNumber,
      ciComplement: formState.ciComplement,
      ciExtension: formState.ciExtension,
      birthDate: formatDateForServer(formState.birthDate),
      birthGender: formState.birthGender,
      identityGender: formState.identityGender,
      address: formState.address,
      faculty: formState.faculty,
      careerId: formState.careerId!,
      status: "activo",
      phoneNumber: formState.phoneNumber,
    };

    setLoading(true);
    try {
      await completePatientProfile(dto);
      setJustRegistered(false);

      toast.show("¡Registro completo! Bienvenido/a a la plataforma.", {
        type: "success",
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Ocurrió un error inesperado";
      toast.show(message, { type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return {
    formState,
    errors,
    touched,
    loading,
    showDatePicker,
    showGenderPicker,
    showIdentityGenderPicker,
    showExtensionPicker,
    showCareerPicker,
    handleInputChange,
    handleBlur,
    handleDateChange,
    setShowDatePicker,
    setShowGenderPicker,
    setShowIdentityGenderPicker,
    setShowExtensionPicker,
    setShowCareerPicker,
    handleCompleteProfile,
  };
};
