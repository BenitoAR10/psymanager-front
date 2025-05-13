import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Text, Button, useTheme, Surface } from "react-native-paper";
import { MotiView, MotiText } from "moti";
import { Skeleton } from "moti/skeleton";
import { loginWithGoogle } from "../services/authService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { width, height } = Dimensions.get("window");

  // Colores consistentes con tu tema web
  const colors = {
    primary: "#4DB6AC",
    primaryLight: "#80CBC4",
    primaryDark: "#00897B",
    secondary: "#64B5F6",
    textPrimary: "#2A3548",
    textSecondary: "#6B7A99",
    background: "#F5F7FA",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Parte superior con gradiente */}
      <View style={styles.topSection}>
        <LinearGradient
          colors={[colors.primaryLight, colors.primary, colors.primaryDark]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 800 }}
            style={styles.logoContainer}
          >
            <Surface style={styles.logoSurface}>
              <Image
                source={require("../../assets/logo.jpg")}
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
        transition={{ type: "timing", duration: 800, delay: 200 }}
        style={styles.contentWrapper}
      >
        <View style={styles.textContainer}>
          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 400 }}
          >
            <Text
              variant="headlineMedium"
              style={[styles.title, { color: colors.textPrimary }]}
            >
              Bienvenido
            </Text>
          </MotiText>

          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 600 }}
          >
            <Text
              variant="titleMedium"
              style={[styles.subtitle, { color: colors.textSecondary }]}
            >
              a Tu Espacio de Bienestar Emocional
            </Text>
          </MotiText>

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 800, delay: 800 }}
          >
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Accede a herramientas y recursos para manejar el estrés y la
              ansiedad, además de agendar tus citas con terapeutas de forma
              rápida y sencilla.
            </Text>
          </MotiView>
        </View>

        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 600, delay: 1000 }}
          style={styles.buttonContainer}
        >
          <Surface style={styles.buttonSurface}>
            <Button
              mode="outlined"
              onPress={loginWithGoogle}
              style={[styles.loginButton, { borderColor: "#E0E0E0" }]}
              contentStyle={styles.buttonContent}
              labelStyle={[styles.buttonLabel, { color: colors.textPrimary }]}
              icon={({ size, color }) => (
                <MaterialCommunityIcons
                  name="google"
                  size={size}
                  color="#4285F4"
                />
              )}
            >
              Iniciar sesión con Google
            </Button>
          </Surface>

          <Text style={styles.footerText}>
            © {new Date().getFullYear()} PSI UCB
          </Text>
        </MotiView>
      </MotiView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSurface: {
    width: 140,
    height: 140,
    borderRadius: 70,
    elevation: 6,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: "90%",
    height: "90%",
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 30,
    justifyContent: "space-between",
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 10,
    fontWeight: "400",
    maxWidth: 340,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 30,
  },
  buttonSurface: {
    borderRadius: 28,
    elevation: 2,
    overflow: "hidden",
    width: "90%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
  },
  loginButton: {
    borderRadius: 28,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  buttonContent: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonLabel: {
    fontWeight: "500",
    fontSize: 15,
  },
  footerText: {
    marginTop: 20,
    fontSize: 12,
    color: "#9AA4B8",
    textAlign: "center",
  },
});
