import React, { useContext, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  StatusBar,
  Alert,
  TextInput as RNTextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { Text, Button, Surface, ActivityIndicator } from "react-native-paper";
import { MotiView, MotiText } from "moti";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { loginWithEmailAndPassword } from "../../services/authService";
import { AuthContext } from "../../auth/AuthContext";
import { storage } from "../../utils/storage";
import { useNavigation } from "@react-navigation/native";
import theme from "../styles/themeConstants";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const { width, height } = Dimensions.get("window");

  // Referencias para los inputs
  const passwordInputRef = useRef<RNTextInput>(null);

  // Estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Efecto para detectar cuando el teclado está visible
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

  // Validación de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("El correo electrónico es requerido");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Ingresa un correo electrónico válido");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  // Validación de contraseña
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("La contraseña es requerida");
      return false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  // Manejo de inicio de sesión
  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      await loginWithEmailAndPassword(email, password);
      const accessToken = await storage.getItem("accessToken");
      const refreshToken = await storage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        await login(accessToken, refreshToken);
      } else {
        throw new Error("No se pudieron obtener los tokens de autenticación");
      }
    } catch (error: any) {
      Alert.alert(
        "Error de inicio de sesión",
        error.message ||
          "No se pudo iniciar sesión. Verifica tus credenciales e intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para ir al siguiente input
  const focusNextInput = () => {
    passwordInputRef.current?.focus();
  };

  // Función para recuperar contraseña
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword" as never);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />

          {/* Sección superior con gradiente y logo */}
          <View
            style={[
              styles.topSection,
              keyboardVisible && Platform.OS === "ios"
                ? { height: height * 0.2 }
                : {},
            ]}
          >
            <LinearGradient
              colors={[
                theme.colors.primary.light,
                theme.colors.primary.main,
                theme.colors.primary.dark,
              ]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "timing",
                  duration: theme.animations.durations.normal,
                }}
                style={styles.logoContainer}
              >
                <Surface style={styles.logoSurface}>
                  <Image
                    source={require("../../../assets/logo.jpg")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </Surface>
              </MotiView>
            </LinearGradient>
          </View>

          {/* Contenido principal */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: theme.animations.durations.normal,
              delay: 200,
            }}
            style={styles.contentWrapper}
          >
            {/* Títulos */}
            <View style={styles.textContainer}>
              <MotiText
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: "timing",
                  duration: theme.animations.durations.fast,
                  delay: 400,
                }}
              >
                <Text variant="headlineMedium" style={styles.title}>
                  Iniciar sesión
                </Text>
              </MotiText>

              <MotiText
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: "timing",
                  duration: theme.animations.durations.fast,
                  delay: 600,
                }}
              >
                <Text variant="titleMedium" style={styles.subtitle}>
                  con tu cuenta institucional
                </Text>
              </MotiText>

              {/* Formulario */}
              <View style={styles.formContainer}>
                {/* Campo de email */}
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      emailError ? styles.inputError : null,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={20}
                      color={theme.colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <RNTextInput
                      placeholder="Correo electrónico"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={styles.input}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) validateEmail(text);
                      }}
                      onBlur={() => validateEmail(email)}
                      onSubmitEditing={focusNextInput}
                      returnKeyType="next"
                      placeholderTextColor={theme.colors.grey[400]}
                      autoComplete="email"
                      textContentType="emailAddress"
                    />
                    {email.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setEmail("")}
                        style={styles.clearButton}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={18}
                          color={theme.colors.grey[400]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                {/* Campo de contraseña */}
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      passwordError ? styles.inputError : null,
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
                        if (passwordError) validatePassword(text);
                      }}
                      onBlur={() => validatePassword(password)}
                      onSubmitEditing={handleLogin}
                      returnKeyType="done"
                      placeholderTextColor={theme.colors.grey[400]}
                      autoComplete="password"
                      textContentType="password"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.clearButton}
                    >
                      <MaterialCommunityIcons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color={theme.colors.grey[400]}
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                </View>
              </View>
            </View>

            {/* Botones de acción */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "timing",
                duration: theme.animations.durations.fast,
                delay: 800,
              }}
              style={styles.buttonContainer}
            >
              {/* Botón de inicio de sesión */}
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                buttonColor={theme.colors.primary.main}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>

              {/* Separador */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.divider} />
              </View>

              {/* Botón de registro */}
              <Button
                mode="outlined"
                onPress={() => navigation.navigate("RegisterStep1" as never)}
                style={styles.registerButton}
                contentStyle={styles.buttonContent}
                labelStyle={[
                  styles.buttonLabel,
                  { color: theme.colors.primary.main },
                ]}
              >
                Crear cuenta nueva
              </Button>

              {/* Texto de pie de página */}
              <Text style={styles.footerText}>
                © {new Date().getFullYear()} PSI UCB
              </Text>
            </MotiView>
          </MotiView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  topSection: {
    height: "35%",
    width: "100%",
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSurface: {
    width: 120,
    height: 120,
    borderRadius: 60,
    ...theme.shadows.lg,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background.paper,
  },
  logo: {
    width: "90%",
    height: "90%",
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    justifyContent: "space-between",
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontWeight: theme.typography.fontWeights.bold as any,
    fontSize: theme.typography.sizes["2xl"],
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    textAlign: "center",
    fontWeight: theme.typography.fontWeights.medium as any,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  formContainer: {
    width: "100%",
    marginTop: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    paddingHorizontal: theme.spacing.md,
    height: 56,
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.error.main,
    borderWidth: 1,
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
  clearButton: {
    padding: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: theme.typography.sizes.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  loginButton: {
    borderRadius: theme.borderRadius.full,
    width: "100%",
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  registerButton: {
    borderRadius: theme.borderRadius.full,
    width: "100%",
    borderColor: theme.colors.primary.main,
    borderWidth: 1.5,
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.lg,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.main,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
  },
  footerText: {
    marginTop: theme.spacing.xl,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.grey[500],
    textAlign: "center",
  },
});

export default LoginScreen;
