"use client";

import type React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { MotiView } from "moti";

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { width } = Dimensions.get("window");

  const handleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google-mobile";
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800 }}
        style={styles.contentWrapper}
      >
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/logo.jpg")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            Bienvenido a Tu
          </Text>
          <Text variant="headlineMedium" style={styles.title}>
            Espacio de Bienestar
          </Text>
          <Text variant="headlineMedium" style={styles.title}>
            Emocional
          </Text>

          <Text style={styles.description}>
            Accede a herramientas y recursos para manejar el estrés y la
            ansiedad, además de agendar tus citas con terapeutas de forma rápida
            y sencilla.
          </Text>
        </View>

        {/* Login Button */}
        <Button
          mode="outlined"
          onPress={handleLogin}
          style={styles.loginButton}
          contentStyle={styles.buttonContent}
          icon="google"
        >
          Iniciar sesión con Google
        </Button>
      </MotiView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationContainer: {
    width: "100%",
    height: 240,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    textAlign: "center",
    color: "#8C9EFF",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 32,
  },
  description: {
    textAlign: "center",
    marginTop: 16,
    color: "#333333",
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    borderRadius: 25,
    borderColor: "#e0e0e0",
    backgroundColor: "#ffffff",
    width: "80%",
    marginTop: 10,
  },
  buttonContent: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});
