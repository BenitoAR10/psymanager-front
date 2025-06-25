import React, { useState, useContext, useRef } from "react";
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";
import { Text, Button, ProgressBar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView, MotiText } from "moti";
import {
  registerPatientStep1,
  loginWithEmailAndPassword,
} from "../../services/authService";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { storage } from "../../utils/storage";
import theme from "../styles/themeConstants";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useToast } from "react-native-toast-notifications";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;

const RegisterStep1Screen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login, setJustRegistered } = useContext(AuthContext);

  const toast = useToast();

  // Referencias para navegación entre campos
  const lastNameInputRef = useRef<RNTextInput>(null);
  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);

  // Estados para los campos del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Estados para errores de validación
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Estados para campos tocados (para validación)
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

  // Detectar cuando el teclado está visible
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Calcular la fortaleza de la contraseña
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;

    let strength = 0;

    // Longitud mínima
    if (password.length >= 8) strength += 0.25;

    // Contiene números
    if (/\d/.test(password)) strength += 0.25;

    // Contiene letras minúsculas y mayúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 0.25;

    // Contiene caracteres especiales
    if (/[^a-zA-Z0-9]/.test(password)) strength += 0.25;

    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);

  // Obtener color y texto según la fortaleza de la contraseña
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 0.25) return theme.colors.error.main;
    if (passwordStrength <= 0.5) return theme.colors.warning.main;
    if (passwordStrength <= 0.75) return theme.colors.warning.dark;
    return theme.colors.success.main;
  };

  const getPasswordStrengthText = () => {
    if (!password) return "";
    if (passwordStrength <= 0.25) return "Débil";
    if (passwordStrength <= 0.5) return "Regular";
    if (passwordStrength <= 0.75) return "Buena";
    return "Fuerte";
  };

  // Validar campos individuales
  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          errorMessage = "El nombre es requerido";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(value)) {
          errorMessage = "El nombre solo puede contener letras y espacios";
        }
        break;

      case "lastName":
        if (!value.trim()) {
          errorMessage = "El apellido es requerido";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(value)) {
          errorMessage = "El apellido solo puede contener letras y espacios";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMessage = "El correo electrónico es requerido";
        } else if (!/^[^\s@]+@ucb\.edu\.bo$/.test(value.toLowerCase())) {
          errorMessage = "El correo debe terminar en @ucb.edu.bo";
        }
        break;

      case "password":
        if (!value) {
          errorMessage = "La contraseña es requerida";
        } else if (value.length < 8) {
          errorMessage = "La contraseña debe tener al menos 8 caracteres";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    return !errorMessage;
  };
  // Marcar un campo como tocado cuando pierde el foco
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(
      field,
      field === "firstName"
        ? firstName
        : field === "lastName"
        ? lastName
        : field === "email"
        ? email
        : password
    );
  };

  // Validar todo el formulario
  const validateForm = () => {
    const isFirstNameValid = validateField("firstName", firstName);
    const isLastNameValid = validateField("lastName", lastName);
    const isEmailValid = validateField("email", email);
    const isPasswordValid = validateField("password", password);

    // Marcar todos los campos como tocados
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    });

    return (
      isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid
    );
  };

  // Manejar el registro
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // 1. Crear el usuario
      await registerPatientStep1(firstName, lastName, email, password);

      // 2. Loguearlo automáticamente
      await loginWithEmailAndPassword(email, password);
      const accessToken = await storage.getItem("accessToken");
      const refreshToken = await storage.getItem("refreshToken");

      // 3. Guardar los tokens en el contexto
      if (accessToken && refreshToken) {
        await login(accessToken, refreshToken, true);
        setJustRegistered(true); // <- ESTA LÍNEA FALTA
      } else {
        throw new Error("No se pudieron obtener los tokens de autenticación");
      }
    } catch (error: any) {
      console.log("ERROR COMPLETO ===>", error.response?.data);
      const message =
        error?.response?.data?.message || "Ocurrió un error inesperado";
      toast.show(message, { type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  // Ir a la pantalla de inicio de sesión
  const goToLogin = () => {
    navigation.navigate("Login" as never);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          keyboardVisible
            ? { justifyContent: "flex-start", paddingTop: 20 }
            : {},
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: theme.animations.durations.normal,
          }}
          style={styles.formContainer}
        >
          {/* Encabezado */}
          <View style={styles.headerContainer}>
            <MotiText
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "timing",
                duration: theme.animations.durations.fast,
              }}
            >
              <Text style={styles.title}>Crea tu cuenta</Text>
            </MotiText>

            <MotiText
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "timing",
                duration: theme.animations.durations.fast,
                delay: 200,
              }}
            >
              <Text style={styles.subtitle}>
                Completa tus datos para comenzar
              </Text>
            </MotiText>
          </View>

          {/* Indicador de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, styles.activeStep]}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={[styles.stepText, styles.activeStepText]}>
                Datos básicos
              </Text>
            </View>
            <View style={styles.progressLine} />
            <View style={styles.progressStep}>
              <View style={styles.progressDot}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <Text style={styles.stepText}>Perfil</Text>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.inputsContainer}>
            {/* Campo de nombre */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  touched.firstName && errors.firstName
                    ? styles.inputError
                    : null,
                ]}
              >
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={styles.inputIcon}
                />
                <RNTextInput
                  placeholder="Nombre"
                  style={styles.input}
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (touched.firstName) validateField("firstName", text);
                  }}
                  onBlur={() => handleBlur("firstName")}
                  onSubmitEditing={() => lastNameInputRef.current?.focus()}
                  returnKeyType="next"
                  placeholderTextColor={theme.colors.grey[400]}
                  autoComplete="name"
                  textContentType="givenName"
                />
              </View>
              {touched.firstName && errors.firstName ? (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              ) : null}
            </View>

            {/* Campo de apellido */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  touched.lastName && errors.lastName
                    ? styles.inputError
                    : null,
                ]}
              >
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={styles.inputIcon}
                />
                <RNTextInput
                  ref={lastNameInputRef}
                  placeholder="Apellido"
                  style={styles.input}
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (touched.lastName) validateField("lastName", text);
                  }}
                  onBlur={() => handleBlur("lastName")}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  returnKeyType="next"
                  placeholderTextColor={theme.colors.grey[400]}
                  autoComplete="name"
                  textContentType="familyName"
                />
              </View>
              {touched.lastName && errors.lastName ? (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              ) : null}
            </View>

            {/* Campo de correo electrónico */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  touched.email && errors.email ? styles.inputError : null,
                ]}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={styles.inputIcon}
                />
                <RNTextInput
                  ref={emailInputRef}
                  placeholder="Correo institucional"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (touched.email) validateField("email", text);
                  }}
                  onBlur={() => handleBlur("email")}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  returnKeyType="next"
                  placeholderTextColor={theme.colors.grey[400]}
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              </View>
              {touched.email && errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Campo de contraseña */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  touched.password && errors.password
                    ? styles.inputError
                    : null,
                ]}
              >
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={styles.inputIcon}
                />
                <RNTextInput
                  ref={passwordInputRef}
                  placeholder="Contraseña"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (touched.password) validateField("password", text);
                  }}
                  onBlur={() => handleBlur("password")}
                  returnKeyType="done"
                  placeholderTextColor={theme.colors.grey[400]}
                  autoComplete="password-new"
                  textContentType="newPassword"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={theme.colors.grey[400]}
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : password ? (
                <View style={styles.passwordStrengthContainer}>
                  <ProgressBar
                    progress={passwordStrength}
                    color={getPasswordStrengthColor()}
                    style={styles.passwordStrengthBar}
                  />
                  <Text
                    style={[
                      styles.passwordStrengthText,
                      { color: getPasswordStrengthColor() },
                    ]}
                  >
                    {getPasswordStrengthText()}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Términos y condiciones */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Al crear una cuenta, aceptas nuestros{" "}
                <Text style={styles.termsLink}>Términos de servicio</Text> y{" "}
                <Text style={styles.termsLink}>Política de privacidad</Text>
              </Text>
            </View>

            {/* Botón de registro */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "timing",
                duration: theme.animations.durations.fast,
                delay: 400,
              }}
            >
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.registerButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                buttonColor={theme.colors.primary.main}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </MotiView>

            {/* Enlace para ir a inicio de sesión */}
            <TouchableOpacity
              onPress={goToLogin}
              style={styles.loginLinkContainer}
            >
              <Text style={styles.loginLinkText}>
                ¿Ya tienes una cuenta?{" "}
                <Text style={styles.loginLink}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  formContainer: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: isSmallDevice
      ? theme.typography.sizes.xl
      : theme.typography.sizes["2xl"],
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  progressStep: {
    alignItems: "center",
    width: 100,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.grey[200],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  activeStep: {
    backgroundColor: theme.colors.primary.main,
  },
  stepNumber: {
    color: theme.colors.grey[600],
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  stepText: {
    fontSize: isSmallDevice
      ? theme.typography.sizes.xs
      : theme.typography.sizes.sm,
    color: theme.colors.grey[500],
  },
  activeStepText: {
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.grey[200],
    marginHorizontal: theme.spacing.sm,
  },
  inputsContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    height: 56,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.error.main,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  },
  passwordToggle: {
    padding: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: theme.typography.sizes.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  passwordStrengthContainer: {
    marginTop: theme.spacing.xs,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordStrengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.grey[200],
  },
  passwordStrengthText: {
    fontSize: theme.typography.sizes.xs,
    marginLeft: theme.spacing.sm,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  termsContainer: {
    marginVertical: theme.spacing.lg,
  },
  termsText: {
    fontSize: isSmallDevice
      ? theme.typography.sizes.xs
      : theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  termsLink: {
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  registerButton: {
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
    height: 52,
  },
  buttonLabel: {
    fontWeight: theme.typography.fontWeights.semibold as any,
    fontSize: theme.typography.sizes.md,
    letterSpacing: 0.5,
  },
  loginLinkContainer: {
    marginTop: theme.spacing.lg,
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  loginLink: {
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
});

export default RegisterStep1Screen;
