"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../screens/styles/themeConstants";
import { celebrationConfigMap } from "../../config/animationMappings";

const { typography, spacing } = theme;
const { width } = Dimensions.get("window");

interface CelebrationModalProps {
  visible: boolean;
  category: string;
  onClose: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  category,
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Animación de entrada más suave
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();

      // Animación sutil de "respiración" para el ícono
      const breatheAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1.08,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );
      breatheAnimation.start();

      return () => breatheAnimation.stop();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [visible]);

  if (!visible) return null;

  const config =
    celebrationConfigMap[category.toLowerCase()] ||
    celebrationConfigMap["general"];

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={400}
      animationOutTiming={300}
      backdropOpacity={0.12}
      backdropColor="#1A202C"
      useNativeDriver
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={["#FEFEFE", "#F7FAFC", "#EDF2F7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientBackground}
        >
          {/* Ícono con animación de respiración muy sutil */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: breatheAnim }],
              },
            ]}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="heart-outline"
                size={28}
                color="#68D391"
              />
            </View>
          </Animated.View>

          {/* Título con mejor jerarquía */}
          <Text style={styles.title}>Momento de pausa</Text>

          {/* Mensaje principal con mejor espaciado */}
          <View style={styles.messageContainer}>
            <Text style={styles.message}>{config.message}</Text>
          </View>

          {/* Pregunta reflexiva con diseño más distintivo */}
          <View style={styles.reflectionContainer}>
            <View style={styles.reflectionQuote}>
              <Text style={styles.reflection}>{config.reflection}</Text>
            </View>
          </View>

          {/* Espacio de respiración visual */}
          <View style={styles.breathingSpace} />

          {/* Botón con diseño más suave y terapéutico */}
          <Button
            mode="contained"
            onPress={onClose}
            uppercase={false}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Continuar con esta sensación de calma"
          >
            Llevar esta calma conmigo
          </Button>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

const modalWidth = Math.min(width * 0.86, 320);

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  container: {
    width: modalWidth,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 12,
  },
  gradientBackground: {
    paddingTop: spacing.xl * 1.5,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(104, 211, 145, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(104, 211, 145, 0.15)",
  },
  title: {
    fontSize: 24,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: spacing.xl,
    letterSpacing: 0.2,
  },
  messageContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  message: {
    fontSize: 17,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 26,
  },
  reflectionContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  reflectionQuote: {
    backgroundColor: "rgba(104, 211, 145, 0.04)",
    borderLeftWidth: 3,
    borderLeftColor: "rgba(104, 211, 145, 0.3)",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
  },
  reflection: {
    fontSize: 15,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    color: "#68727A",
    textAlign: "center",
    lineHeight: 23,
    fontStyle: "italic",
  },
  breathingSpace: {
    height: spacing.md,
  },
  button: {
    backgroundColor: "#68D391",
    borderRadius: 20,
    width: "100%",
    shadowColor: "#68D391",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonContent: {
    paddingVertical: spacing.md + 2,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default CelebrationModal;
