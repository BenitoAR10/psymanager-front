import React, { createContext, useContext, useState, ReactNode } from "react";
import { validateField } from "../utils/validators";

// Tipos
export interface FormData {
  ciNumber: string;
  ciComplement: string;
  ciExtension: string;
  birthDate: Date | null;
  birthGender: string;
  identityGender: string;
  address: string;
  career: string;
}

export interface FormErrors {
  ciNumber: string;
  birthDate: string;
  birthGender: string;
  career: string;
}

export interface FormTouched {
  ciNumber: boolean;
  birthDate: boolean;
  birthGender: boolean;
  career: boolean;
}

interface ModalState {
  showDatePicker: boolean;
  showGenderPicker: boolean;
  showIdentityGenderPicker: boolean;
  showExtensionPicker: boolean;
  showCareerPicker: boolean;
}

interface FormContextType {
  // Datos del formulario
  formData: FormData;
  setFormValue: (field: keyof FormData, value: any) => void;

  // Validación
  errors: FormErrors;
  touched: FormTouched;
  handleBlur: (field: keyof FormTouched) => void;
  validateForm: () => boolean;

  // Estado de modales
  modalState: ModalState;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState<FormData>({
    ciNumber: "",
    ciComplement: "",
    ciExtension: "",
    birthDate: null,
    birthGender: "",
    identityGender: "",
    address: "",
    career: "",
  });

  // Estado de errores y campos tocados
  const [errors, setErrors] = useState<FormErrors>({
    ciNumber: "",
    birthDate: "",
    birthGender: "",
    career: "",
  });

  const [touched, setTouched] = useState<FormTouched>({
    ciNumber: false,
    birthDate: false,
    birthGender: false,
    career: false,
  });

  // Estado de modales
  const [modalState, setModalState] = useState<ModalState>({
    showDatePicker: false,
    showGenderPicker: false,
    showIdentityGenderPicker: false,
    showExtensionPicker: false,
    showCareerPicker: false,
  });

  // Actualizar un valor del formulario
  const setFormValue = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Si el campo es validable y ha sido tocado, validarlo
    if (field in touched && touched[field as keyof FormTouched]) {
      const errorMessage = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  // Marcar un campo como tocado y validarlo
  const handleBlur = (field: keyof FormTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMessage = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {
      ciNumber: validateField("ciNumber", formData.ciNumber),
      birthDate: validateField("birthDate", formData.birthDate),
      birthGender: validateField("birthGender", formData.birthGender),
      career: validateField("career", formData.career),
    };

    setErrors(newErrors);
    setTouched({
      ciNumber: true,
      birthDate: true,
      birthGender: true,
      career: true,
    });

    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Abrir un modal
  const openModal = (modalName: keyof ModalState) => {
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  };

  // Cerrar un modal
  const closeModal = (modalName: keyof ModalState) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  };

  const value = {
    formData,
    setFormValue,
    errors,
    touched,
    handleBlur,
    validateForm,
    modalState,
    openModal,
    closeModal,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext debe usarse dentro de un FormProvider");
  }
  return context;
};
