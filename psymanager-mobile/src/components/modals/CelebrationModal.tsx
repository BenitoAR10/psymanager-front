"use client";

import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Vibration,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { theme } from "../../screens/styles/themeConstants";
import { celebrationConfigMap } from "../../config/animationMappings";

const { typography, spacing } = theme;
const { width } = Dimensions.get("window");
const modalWidth = Math.min(width * 0.9, 380);

interface CelebrationModalProps {
  visible: boolean;
  category: string;
  pointsReward?: number;
  exerciseTitle?: string;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  category,
  pointsReward = 10,
  exerciseTitle = "ejercicio",
  onClose,
}) => {
  // Animaciones principales - reducidas para mejor rendimiento
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const badgeScaleAnim = useRef(new Animated.Value(0)).current;
  const pointsOpacityAnim = useRef(new Animated.Value(0)).current;

  // Estado para el contador de puntos
  const [displayPoints, setDisplayPoints] = React.useState(0);
  const [animationPhase, setAnimationPhase] = React.useState<
    "entering" | "counting" | "complete"
  >("entering");

  const lottieRef = useRef<LottieView>(null);
  const config =
    celebrationConfigMap[category.toLowerCase()] ||
    celebrationConfigMap["general"];

  // Funciones de vibración simplificadas para Android
  const triggerSuccessVibration = useCallback(() => {
    if (Platform.OS === "android") {
      Vibration.vibrate(120); // Vibración única de éxito
    }
  }, []);

  const triggerPointsVibration = useCallback(() => {
    if (Platform.OS === "android") {
      Vibration.vibrate(60); // Vibración corta para contador
    }
  }, []);

  const triggerCompletionVibration = useCallback(() => {
    if (Platform.OS === "android") {
      // Vibración única más larga para celebración - SIN PATRÓN
      Vibration.vibrate(200);
    }
  }, []);

  // Función optimizada para animar el contador de puntos
  const animatePointsCounter = useCallback(() => {
    setAnimationPhase("counting");
    const duration = 600;
    const startTime = Date.now();
    let hasVibratedMidway = false; // Control para evitar múltiples vibraciones

    // Vibración al iniciar el contador
    triggerPointsVibration();

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Usar easing para suavizar la animación
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const currentValue = Math.round(easedProgress * pointsReward);

      setDisplayPoints(currentValue);

      // Vibración sutil a la mitad del conteo - SOLO UNA VEZ
      if (progress >= 0.5 && !hasVibratedMidway) {
        hasVibratedMidway = true;
        triggerPointsVibration();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setAnimationPhase("complete");

        // Vibración de celebración al completar - SOLO UNA VEZ
        setTimeout(() => {
          triggerCompletionVibration();
        }, 100); // Pequeño delay para sincronizar con la animación

        // Pequeño pulso al finalizar
        Animated.sequence([
          Animated.timing(badgeScaleAnim, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(badgeScaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    requestAnimationFrame(updateCounter);
  }, [
    pointsReward,
    badgeScaleAnim,
    triggerPointsVibration,
    triggerCompletionVibration,
  ]);

  useEffect(() => {
    if (visible) {
      // Reset todos los valores
      setDisplayPoints(0);
      setAnimationPhase("entering");
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      contentAnim.setValue(0);
      badgeScaleAnim.setValue(0);
      pointsOpacityAnim.setValue(0);

      // Vibración inicial de éxito al abrir el modal
      setTimeout(() => {
        triggerSuccessVibration();
      }, 200); // Delay para que coincida con la animación

      // Secuencia de animación optimizada y simplificada
      Animated.sequence([
        // 1. Entrada del modal
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),

        // 2. Contenido general
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),

        // 3. Badge de puntos
        Animated.spring(badgeScaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),

        // 4. Números de puntos
        Animated.timing(pointsOpacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Iniciar contador después de que aparezca el badge
        setTimeout(animatePointsCounter, 100);
      });

      // Lottie con delay para evitar conflictos
      setTimeout(() => {
        lottieRef.current?.reset();
        lottieRef.current?.play();
      }, 400);
    } else {
      // Reset limpio y CANCELAR cualquier vibración pendiente
      Vibration.cancel(); // Importante: cancelar vibraciones al cerrar
      setDisplayPoints(0);
      setAnimationPhase("entering");
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      contentAnim.setValue(0);
      badgeScaleAnim.setValue(0);
      pointsOpacityAnim.setValue(0);
    }
  }, [
    visible,
    fadeAnim,
    scaleAnim,
    contentAnim,
    badgeScaleAnim,
    pointsOpacityAnim,
    animatePointsCounter,
    triggerSuccessVibration,
  ]);

  // Función para manejar el cierre con vibración
  const handleClose = useCallback(() => {
    // Cancelar cualquier vibración pendiente
    Vibration.cancel();

    // Vibración suave al cerrar
    if (Platform.OS === "android") {
      Vibration.vibrate(40); // Muy corta para el cierre
    }

    onClose();
  }, [onClose]);

  if (!visible) return null;

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={200}
      animationOutTiming={200}
      backdropOpacity={0.85}
      backdropColor="#1A202C"
      useNativeDriver
      onBackdropPress={handleClose}
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
          colors={["#FFFFFF", "#F8FAFC", "#EDF2F7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientBackground}
        >
          {/* Confeti optimizado */}
          <View style={styles.confettiContainer}>
            <LottieView
              ref={lottieRef}
              source={require("../../../assets/animations/confeti.json")}
              loop={false}
              style={styles.confettiAnimation}
              resizeMode="contain"
              renderMode="HARDWARE" // Optimización para Android
            />
          </View>

          {/* Contenido principal con una sola animación */}
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: contentAnim,
                transform: [
                  {
                    translateY: contentAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Título */}
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name="trophy"
                size={32}
                color="#FFD700"
                style={styles.trophyIcon}
              />
              <Text style={styles.mainTitle}>¡Increíble trabajo!</Text>
            </View>

            {/* Badge de puntos optimizado */}
            <Animated.View
              style={[
                styles.pointsBadgeContainer,
                {
                  transform: [{ scale: badgeScaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["#4FD1C5", "#38B2AC", "#319795"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.pointsBadge}
              >
                <View style={styles.pointsContent}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color="#FFFFFF"
                    style={styles.plusIcon}
                  />
                  <Animated.View
                    style={[
                      styles.pointsNumberContainer,
                      { opacity: pointsOpacityAnim },
                    ]}
                  >
                    <Text style={styles.pointsNumber}>{displayPoints}</Text>
                  </Animated.View>
                  <Text style={styles.pointsLabel}>PTS</Text>
                </View>

                {/* Efectos estáticos para mejor rendimiento */}
                {animationPhase === "complete" && (
                  <View style={styles.sparkleContainer}>
                    <MaterialCommunityIcons
                      name="star"
                      size={12}
                      color="rgba(255,255,255,0.8)"
                      style={styles.sparkle1}
                    />
                    <MaterialCommunityIcons
                      name="star"
                      size={8}
                      color="rgba(255,255,255,0.6)"
                      style={styles.sparkle2}
                    />
                    <MaterialCommunityIcons
                      name="star"
                      size={10}
                      color="rgba(255,255,255,0.7)"
                      style={styles.sparkle3}
                    />
                  </View>
                )}
              </LinearGradient>
            </Animated.View>

            {/* Mensaje de gamificación */}
            <View style={styles.gamificationMessage}>
              <View style={styles.rewardInfo}>
                <MaterialCommunityIcons
                  name="gift"
                  size={20}
                  color="#4FD1C5"
                  style={styles.giftIcon}
                />
                <Text style={styles.rewardText}>
                  Canjea tus puntos en tu próxima sesión
                </Text>
              </View>
              <Text style={styles.motivationalText}>{config.message}</Text>
            </View>

            {/* Botón de continuar */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleClose}
                style={styles.continueButton}
                labelStyle={styles.buttonLabel}
                contentStyle={styles.buttonContent}
                icon={() => (
                  <MaterialCommunityIcons
                    name="heart"
                    size={18}
                    color="#FFFFFF"
                  />
                )}
              >
                Continuar mi progreso
              </Button>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  container: {
    width: modalWidth,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
  },
  gradientBackground: {
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl * 1.5,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    position: "relative",
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  confettiAnimation: {
    width: modalWidth * 0.8,
    height: modalWidth * 0.8,
  },
  contentContainer: {
    alignItems: "center",
    zIndex: 2,
    width: "100%",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  trophyIcon: {
    marginBottom: spacing.sm,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    fontWeight: "500",
  },
  pointsBadgeContainer: {
    marginBottom: spacing.xl * 1.5,
  },
  pointsBadge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#4FD1C5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  pointsContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    marginBottom: -4,
  },
  pointsNumberContainer: {
    alignItems: "center",
  },
  pointsNumber: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 40,
  },
  pointsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 1,
    marginTop: -2,
  },
  sparkleContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  sparkle1: {
    position: "absolute",
    top: 20,
    right: 25,
  },
  sparkle2: {
    position: "absolute",
    bottom: 30,
    left: 20,
  },
  sparkle3: {
    position: "absolute",
    top: 35,
    left: 30,
  },
  gamificationMessage: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  rewardInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(79, 209, 197, 0.1)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  giftIcon: {
    marginRight: spacing.sm,
  },
  rewardText: {
    fontSize: 14,
    color: "#2D3748",
    fontWeight: "600",
  },
  motivationalText: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 24,
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#4FD1C5",
    borderRadius: 24,
    shadowColor: "#4FD1C5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    paddingVertical: spacing.md,
    flexDirection: "row-reverse",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: spacing.xs,
  },
});

export default CelebrationModal;
