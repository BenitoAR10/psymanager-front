import React, { useState } from "react";
import {
  View,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Divider,
  HelperText,
  TouchableRipple,
  Portal,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeUserProfile } from "../services/userService";
import { useAuth } from "../auth/useAuth";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import dayjs from "dayjs";
import { MotiView } from "moti";
import DateTimePicker from "@react-native-community/datetimepicker";

// Importamos los estilos y constantes
import styles, {
  colors,
  isWeb,
  webStyles,
} from "./styles/completeProfileScreenStyles";

// Definir opciones para los selectores
const genderOptions = ["Masculino", "Femenino", "Otro", "Prefiero no decirlo"];
const ciExtensions = ["LP", "CB", "SC", "OR", "PT", "CH", "TJ", "BE", "PD"];

// Componente de Loader
const FullScreenLoader = () => (
  <View style={styles.loaderContainer}>
    <View style={styles.loaderContent}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loaderText}>Guardando información...</Text>
    </View>
  </View>
);

// Componente personalizado para selector (dropdown)
const CustomSelector = ({
  label,
  value,
  options,
  onSelect,
  error,
  touched,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  error?: string;
  touched?: boolean;
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // En web, usamos un select nativo
  if (isWeb) {
    return (
      <View style={styles.webSelectContainer}>
        <Text style={styles.webSelectLabel}>{label}</Text>
        <select
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          style={{
            ...webStyles.select,
            borderColor: touched && error ? colors.error : colors.border,
          }}
        >
          <option value="" disabled>
            Seleccionar
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {touched && error && (
          <HelperText type="error" visible={true}>
            {error}
          </HelperText>
        )}
      </View>
    );
  }

  // En móvil, usamos un modal personalizado
  return (
    <View style={styles.selectorContainer}>
      <TouchableRipple
        onPress={() => setModalVisible(true)}
        style={[styles.selector, touched && error ? styles.inputError : null]}
      >
        <View style={styles.selectorContent}>
          <View style={styles.selectorTextContainer}>
            <Text style={styles.selectorLabel}>{label}</Text>
            <Text
              style={value ? styles.selectorValue : styles.selectorPlaceholder}
            >
              {value || "Seleccionar"}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={colors.textSecondary}
          />
        </View>
      </TouchableRipple>

      {touched && error && (
        <HelperText type="error" visible={true}>
          {error}
        </HelperText>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
            <Divider style={styles.modalDivider} />
            <ScrollView style={styles.modalScrollView}>
              {options.map((option) => (
                <TouchableRipple
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    setModalVisible(false);
                  }}
                  style={styles.modalOption}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      option === value && styles.modalOptionSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableRipple>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Componente personalizado para selector de fecha
const CustomDatePicker = ({
  label,
  value,
  onChange,
  error,
  touched,
}: {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  touched?: boolean;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // En web, usamos un input de tipo date nativo
  if (isWeb) {
    return (
      <View style={styles.webDatePickerContainer}>
        <Text style={styles.webSelectLabel}>{label}</Text>
        <input
          type="date"
          value={dayjs(value).format("YYYY-MM-DD")}
          onChange={(e) => {
            if (e.target.value) {
              onChange(new Date(e.target.value));
            }
          }}
          style={{
            ...webStyles.datePicker,
            borderColor: touched && error ? colors.error : colors.border,
          }}
          max={dayjs().format("YYYY-MM-DD")}
          min="1920-01-01"
        />
        {touched && error && (
          <HelperText type="error" visible={true}>
            {error}
          </HelperText>
        )}
      </View>
    );
  }

  // En móvil, usamos un componente personalizado con DateTimePicker nativo
  return (
    <View style={styles.datePickerContainer}>
      <TouchableRipple
        onPress={() => setShowPicker(true)}
        style={[
          styles.datePickerButton,
          touched && error ? styles.inputError : null,
        ]}
      >
        <View style={styles.datePickerContent}>
          <View style={styles.datePickerTextContainer}>
            <Text style={styles.datePickerLabel}>{label}</Text>
            <Text style={styles.datePickerValue}>
              {dayjs(value).format("DD/MM/YYYY")}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="calendar"
            size={24}
            color={colors.primary}
          />
        </View>
      </TouchableRipple>

      {touched && error && (
        <HelperText type="error" visible={true}>
          {error}
        </HelperText>
      )}

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
          maximumDate={new Date()}
          minimumDate={new Date(1920, 0, 1)}
        />
      )}
    </View>
  );
};

const CompleteProfileScreen = () => {
  const { logout, userInfo } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const queryClient = useQueryClient();

  // Estado del formulario
  const [form, setForm] = useState({
    birthDate: new Date(1990, 0, 1), // Fecha predeterminada
    birthGender: "",
    identityGender: "",
    ciNumber: "",
    ciComplement: "",
    ciExtension: "",
    phoneNumber: "",
    address: "",
  });

  // Estados para UI
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Actualizar un campo del formulario
  const updateField = (key: string, value: string | Date) => {
    setForm({ ...form, [key]: value });
    setTouched({ ...touched, [key]: true });

    // Validar el campo actualizado
    validateField(key, value);
  };

  // Validar un campo específico
  const validateField = (key: string, value: any) => {
    let newErrors = { ...errors };

    switch (key) {
      case "ciNumber":
        if (!value || value.trim() === "") {
          newErrors.ciNumber = "El número de CI es requerido";
        } else if (!/^\d+$/.test(value)) {
          newErrors.ciNumber = "Solo se permiten números";
        } else {
          delete newErrors.ciNumber;
        }
        break;

      case "phoneNumber":
        if (!value || value.trim() === "") {
          newErrors.phoneNumber = "El número de teléfono es requerido";
        } else if (!/^\d+$/.test(value)) {
          newErrors.phoneNumber = "Solo se permiten números";
        } else if (value.length < 8) {
          newErrors.phoneNumber = "El número debe tener al menos 8 dígitos";
        } else {
          delete newErrors.phoneNumber;
        }
        break;

      case "address":
        if (!value || value.trim() === "") {
          newErrors.address = "La dirección es requerida";
        } else if (value.length < 5) {
          newErrors.address = "La dirección es demasiado corta";
        } else {
          delete newErrors.address;
        }
        break;

      case "birthDate":
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 18) {
          newErrors.birthDate = "Debes ser mayor de 18 años";
        } else if (age > 100) {
          newErrors.birthDate = "La fecha no parece válida";
        } else {
          delete newErrors.birthDate;
        }
        break;

      case "birthGender":
        if (!value || value.trim() === "") {
          newErrors.birthGender = "Este campo es requerido";
        } else {
          delete newErrors.birthGender;
        }
        break;

      case "identityGender":
        if (!value || value.trim() === "") {
          newErrors.identityGender = "Este campo es requerido";
        } else {
          delete newErrors.identityGender;
        }
        break;

      case "ciExtension":
        if (!value || value.trim() === "") {
          newErrors.ciExtension = "La extensión es requerida";
        } else {
          delete newErrors.ciExtension;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Validar todo el formulario
  const validateForm = () => {
    // Marcar todos los campos como tocados
    const allTouched: Record<string, boolean> = {};
    Object.keys(form).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validar cada campo
    Object.keys(form).forEach((key) => {
      validateField(key, form[key as keyof typeof form]);
    });

    // Verificar si hay errores
    return Object.keys(errors).length === 0;
  };

  // Mutación para enviar el formulario
  const mutation = useMutation<void, Error, void>({
    mutationFn: () => completeUserProfile(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        error.message ||
          "No se pudo guardar tu perfil. Intenta de nuevo más tarde."
      );
    },
  });

  // Manejar el envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      mutation.mutate();
    } else {
      Alert.alert(
        "Formulario incompleto",
        "Por favor completa todos los campos requeridos correctamente."
      );
    }
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return (
      form.birthDate &&
      form.birthGender &&
      form.identityGender &&
      form.ciNumber.trim() !== "" &&
      form.ciExtension &&
      form.phoneNumber.trim() !== "" &&
      form.address.trim() !== "" &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 500 }}
          style={styles.content}
        >
          {/* Encabezado */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <MaterialCommunityIcons
                name="account-edit"
                size={28}
                color={colors.primary}
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Completa tu perfil</Text>
              <Text style={styles.subtitle}>
                Necesitamos algunos datos adicionales para completar tu registro
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Sección de información personal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información personal</Text>

            {/* Fecha de nacimiento */}
            <CustomDatePicker
              label="Fecha de nacimiento"
              value={form.birthDate}
              onChange={(date) => updateField("birthDate", date)}
              error={errors.birthDate}
              touched={touched.birthDate}
            />

            {/* Género de nacimiento */}
            <CustomSelector
              label="Género de nacimiento"
              value={form.birthGender}
              options={genderOptions}
              onSelect={(value) => updateField("birthGender", value)}
              error={errors.birthGender}
              touched={touched.birthGender}
            />

            {/* Género con el que se identifica */}
            <CustomSelector
              label="Género con el que te identificas"
              value={form.identityGender}
              options={genderOptions}
              onSelect={(value) => updateField("identityGender", value)}
              error={errors.identityGender}
              touched={touched.identityGender}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Sección de documentación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documentación</Text>

            {/* Número de CI */}
            <TextInput
              label="Número de CI"
              value={form.ciNumber}
              onChangeText={(text) => updateField("ciNumber", text)}
              keyboardType="numeric"
              style={[
                styles.input,
                touched.ciNumber && errors.ciNumber ? styles.inputError : null,
              ]}
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              error={touched.ciNumber && !!errors.ciNumber}
              onBlur={() => setTouched({ ...touched, ciNumber: true })}
            />
            {touched.ciNumber && errors.ciNumber && (
              <HelperText type="error" visible={true}>
                {errors.ciNumber}
              </HelperText>
            )}

            {/* Complemento (opcional) */}
            <TextInput
              label="Complemento (opcional)"
              value={form.ciComplement}
              onChangeText={(text) => updateField("ciComplement", text)}
              style={styles.input}
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            {/* Extensión de CI */}
            <CustomSelector
              label="Extensión de CI"
              value={form.ciExtension}
              options={ciExtensions}
              onSelect={(value) => updateField("ciExtension", value)}
              error={errors.ciExtension}
              touched={touched.ciExtension}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Sección de contacto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de contacto</Text>

            {/* Teléfono */}
            <TextInput
              label="Teléfono"
              value={form.phoneNumber}
              onChangeText={(text) => updateField("phoneNumber", text)}
              keyboardType="phone-pad"
              style={[
                styles.input,
                touched.phoneNumber && errors.phoneNumber
                  ? styles.inputError
                  : null,
              ]}
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              error={touched.phoneNumber && !!errors.phoneNumber}
              onBlur={() => setTouched({ ...touched, phoneNumber: true })}
              left={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="phone"
                      size={24}
                      color={colors.textSecondary}
                    />
                  )}
                />
              }
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <HelperText type="error" visible={true}>
                {errors.phoneNumber}
              </HelperText>
            )}

            {/* Dirección */}
            <TextInput
              label="Dirección"
              value={form.address}
              onChangeText={(text) => updateField("address", text)}
              style={[
                styles.input,
                touched.address && errors.address ? styles.inputError : null,
              ]}
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              error={touched.address && !!errors.address}
              onBlur={() => setTouched({ ...touched, address: true })}
              multiline
              numberOfLines={3}
              left={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={24}
                      color={colors.textSecondary}
                    />
                  )}
                />
              }
            />
            {touched.address && errors.address && (
              <HelperText type="error" visible={true}>
                {errors.address}
              </HelperText>
            )}
          </View>

          {/* Botón de envío */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={mutation.isPending}
            loading={mutation.isPending}
            style={styles.submitBtn}
            contentStyle={styles.submitBtnContent}
            labelStyle={styles.submitBtnLabel}
            icon="check-circle"
          >
            Guardar y continuar
          </Button>

          {/* Botón para saltar (opcional) */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text style={styles.skipButtonText}>Completar más tarde</Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>

      {/* Loader de pantalla completa */}
      {mutation.isPending && <FullScreenLoader />}
    </KeyboardAvoidingView>
  );
};

export default CompleteProfileScreen;
