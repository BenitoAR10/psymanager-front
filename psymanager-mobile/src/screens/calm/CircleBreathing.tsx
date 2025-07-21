"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Vibration,
  Animated,
} from "react-native";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CircleBreathingProps {
  onComplete: () => void;
}

const { width } = Dimensions.get("window");
const animation = require("../../../assets/animations/deep breathing.json");

type BreathingPhase = "ready" | "inhaling" | "holding" | "exhaling" | "paused";

const CircleBreathing: React.FC<CircleBreathingProps> = ({ onComplete }) => {
  const [started, setStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("ready");
  const [cycleCount, setCycleCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const lottieRef = useRef<LottieView>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Animaciones optimizadas para Android con native driver
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const messageScale = useRef(new Animated.Value(0.8)).current;
  const breathingOpacity = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;
  const instructionsOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const breathingScale = useRef(new Animated.Value(1)).current;

  const totalCycles = 3; // Reducido de 5 a 3

  // Configuración de las fases de respiración basada en el JSON de Lottie
  const phases = {
    inhale: {
      start: 0,
      end: 150,
      duration: 4000,
      instruction: "Mantén presionado para inhalar",
      activeInstruction: "Inhalando... mantén presionado",
    },
    hold: {
      start: 150,
      end: 240,
      duration: 2000,
      instruction: "Mantén la respiración... suelta para exhalar",
    },
    exhale: {
      start: 240,
      end: 390,
      duration: 6000,
      instruction: "Exhalando... relájate",
    },
  };

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }
    };
  }, []);

  // Animación de entrada del mensaje optimizada
  useEffect(() => {
    if (!started) {
      // Reset valores
      messageOpacity.setValue(0);
      messageScale.setValue(0.8);

      // Animación suave de entrada
      Animated.parallel([
        Animated.timing(messageOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(messageScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [started, messageOpacity, messageScale]);

  // Animación de entrada de la respiración optimizada
  useEffect(() => {
    if (started) {
      // Reset valores
      breathingOpacity.setValue(0);
      progressOpacity.setValue(0);
      instructionsOpacity.setValue(0);

      // Secuencia optimizada
      Animated.sequence([
        Animated.timing(breathingOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(progressOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(instructionsOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [started, breathingOpacity, progressOpacity, instructionsOpacity]);

  // Actualizar progreso
  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: (cycleCount / totalCycles) * 100,
      duration: 500,
      useNativeDriver: false, // width no puede usar native driver
    }).start();
  }, [cycleCount, progressWidth, totalCycles]);

  // Animación de escala al presionar
  useEffect(() => {
    Animated.spring(breathingScale, {
      toValue: isPressed ? 1.05 : 1,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isPressed, breathingScale]);

  const triggerVibration = (duration = 50) => {
    Vibration.vibrate(duration);
  };

  const resetCycle = () => {
    setCurrentPhase("ready");
    setIsPressed(false);

    if (lottieRef.current) {
      try {
        lottieRef.current.reset();
      } catch (error) {
        console.warn("Error resetting Lottie animation:", error);
      }
    }

    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
    }
  };

  const handlePressIn = () => {
    if (currentPhase === "ready") {
      setIsPressed(true);
      setCurrentPhase("inhaling");
      triggerVibration(60);

      lottieRef.current?.play(phases.inhale.start, phases.inhale.end);

      phaseTimerRef.current = setTimeout(() => {
        if (isPressed) {
          setCurrentPhase("holding");
          triggerVibration(40);
          lottieRef.current?.play(phases.hold.start, phases.hold.end);
        }
      }, phases.inhale.duration);
    }
  };

  const handlePressOut = () => {
    if (currentPhase === "holding" || currentPhase === "inhaling") {
      setIsPressed(false);
      setCurrentPhase("exhaling");
      triggerVibration(80);

      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }

      lottieRef.current?.play(phases.exhale.start, phases.exhale.end);

      phaseTimerRef.current = setTimeout(() => {
        const nextCycle = cycleCount + 1;
        setCycleCount(nextCycle);

        if (nextCycle >= totalCycles) {
          triggerVibration(150);
          onComplete();
        } else {
          setCurrentPhase("paused");
          phaseTimerRef.current = setTimeout(() => {
            resetCycle();
          }, 1500);
        }
      }, phases.exhale.duration);
    }
  };

  const getInstructions = (): string => {
    switch (currentPhase) {
      case "ready":
        return phases.inhale.instruction;
      case "inhaling":
        return phases.inhale.activeInstruction;
      case "holding":
        return phases.hold.instruction;
      case "exhaling":
        return phases.exhale.instruction;
      case "paused":
        return "Preparándote para el siguiente ciclo...";
      default:
        return "";
    }
  };

  const getPhaseColor = (): string => {
    switch (currentPhase) {
      case "ready":
      case "inhaling":
        return "#4FD1C5";
      case "holding":
        return "#FFD700";
      case "exhaling":
        return "#F687B3";
      case "paused":
        return "#A78BFA";
      default:
        return "#4FD1C5";
    }
  };

  const getPhaseIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (currentPhase) {
      case "ready":
      case "inhaling":
        return "arrow-down";
      case "holding":
        return "pause";
      case "exhaling":
        return "arrow-up";
      case "paused":
        return "timer-sand";
      default:
        return "lungs";
    }
  };

  if (!started) {
    return (
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.messageContainer,
            {
              opacity: messageOpacity,
              transform: [{ scale: messageScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.messageContent}
            activeOpacity={0.8}
            onPress={() => {
              setStarted(true);
              triggerVibration(100);
            }}
          >
            <MaterialCommunityIcons
              name="lungs"
              size={48}
              color="#4FD1C5"
              style={styles.messageIcon}
            />
            <Text style={styles.title}>
              Ahora, practiquemos juntos un ejercicio de respiración
            </Text>
            <Text style={styles.instructions}>
              Toca la pantalla cuando estés listo
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[styles.breathingContainer, { opacity: breathingOpacity }]}
      >
        {/* Contador de progreso */}
        <Animated.View
          style={[styles.progressContainer, { opacity: progressOpacity }]}
        >
          <Text style={styles.progressText}>
            Ciclo {cycleCount + 1} de {totalCycles}
          </Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: getPhaseColor(),
                  width: progressWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* Área de respiración interactiva */}
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.breathingArea,
            {
              backgroundColor: isPressed
                ? `${getPhaseColor()}20`
                : "rgba(255, 255, 255, 0.1)",
              borderColor: getPhaseColor(),
              borderWidth: isPressed ? 3 : 1,
            },
          ]}
          activeOpacity={1}
          disabled={currentPhase === "paused"}
        >
          <Animated.View
            style={[
              styles.lottieContainer,
              {
                transform: [{ scale: breathingScale }],
              },
            ]}
          >
            <LottieView
              ref={lottieRef}
              source={animation}
              loop={false}
              style={styles.lottie}
              speed={1}
              autoPlay={false}
              renderMode="HARDWARE" // Optimización para Android
            />
          </Animated.View>

          {/* Overlay con icono de fase - simplificado */}
          <View style={styles.phaseOverlay}>
            <View
              style={[styles.phaseIcon, { backgroundColor: getPhaseColor() }]}
            >
              <MaterialCommunityIcons
                name={getPhaseIcon()}
                size={24}
                color="#FFFFFF"
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Instrucciones dinámicas */}
        <Animated.View
          style={[
            styles.instructionsContainer,
            { opacity: instructionsOpacity },
          ]}
        >
          <Text
            style={[styles.dynamicInstructions, { color: getPhaseColor() }]}
          >
            {getInstructions()}
          </Text>

          {/* Indicador visual del estado */}
          <View
            style={[
              styles.stateIndicator,
              { backgroundColor: getPhaseColor() },
            ]}
          />
        </Animated.View>

        {/* Botón de saltar (opcional) */}
        {cycleCount > 0 && (
          <Animated.View
            style={[styles.skipContainer, { opacity: instructionsOpacity }]}
          >
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                triggerVibration(100);
                onComplete();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Saltar ejercicio</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
};

export default CircleBreathing;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    marginHorizontal: 40,
  },
  messageContent: {
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  messageIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 24,
  },
  instructions: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    fontWeight: "500",
  },
  breathingContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
    maxWidth: 300,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  breathingArea: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lottieContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  phaseOverlay: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  phaseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  instructionsContainer: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  dynamicInstructions: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  stateIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  skipContainer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  skipText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
