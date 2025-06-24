import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { theme } from "../../screens/styles/themeConstants";
import { celebrationConfigMap } from "../../config/animationMappings";

const { typography, spacing } = theme;
const { width } = Dimensions.get("window");
const modalWidth = Math.min(width * 0.86, 320);

interface CelebrationModalProps {
  visible: boolean;
  category: string;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  category,
  onClose,
}) => {
  // anims de contenedor
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  // anim “respiración” (opcional, lo puedes quitar si no lo quieres)
  const breatheAnim = useRef(new Animated.Value(1)).current;

  // anims de contenido (opacidad + translateY)
  const titleAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const reflectionAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  const lottieRef = useRef<LottieView>(null);
  const config =
    celebrationConfigMap[category.toLowerCase()] ||
    celebrationConfigMap["general"];

  useEffect(() => {
    if (visible) {
      // 1) Entrada del modal
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();

      // 2) Loop “respirar” (puedes quitarlo si no lo necesitas)
      Animated.loop(
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
      ).start();

      // 3) Lottie confeti
      lottieRef.current?.reset();
      lottieRef.current?.play();

      // 4) Cascada de contenido con stagger
      [titleAnim, messageAnim, reflectionAnim, buttonAnim].forEach((a) =>
        a.setValue(0)
      );
      Animated.sequence([
        Animated.delay(200), // deja que el confeti empiece
        Animated.stagger(100, [
          Animated.parallel([
            Animated.timing(titleAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(messageAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(reflectionAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(buttonAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    } else {
      // reset total
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
      breatheAnim.setValue(1);
      [titleAnim, messageAnim, reflectionAnim, buttonAnim].forEach((a) =>
        a.setValue(0)
      );
    }
  }, [visible]);

  if (!visible) return null;

  // helper para interpolar translateY
  const interpY = (anim: Animated.Value) =>
    anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.12}
      backdropColor="#1A202C"
      useNativeDriver
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LinearGradient
          colors={["#FEFEFE", "#F7FAFC", "#EDF2F7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientBackground}
        >
          {/* Confeti Lottie */}
          <LottieView
            ref={lottieRef}
            source={require("../../../assets/animations/confeti.json")}
            loop={false}
            style={{ width: 140, height: 140, marginBottom: spacing.lg }}
          />

          {/* Título */}
          <Animated.View
            style={{
              opacity: titleAnim,
              transform: [{ translateY: interpY(titleAnim) }],
            }}
          >
            <Text style={styles.title}>Momento de pausa</Text>
          </Animated.View>

          {/* Mensaje */}
          <Animated.View
            style={{
              opacity: messageAnim,
              transform: [{ translateY: interpY(messageAnim) }],
            }}
          >
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{config.message}</Text>
            </View>
          </Animated.View>

          {/* Reflexión */}
          <Animated.View
            style={{
              opacity: reflectionAnim,
              transform: [{ translateY: interpY(reflectionAnim) }],
            }}
          >
            <View style={styles.reflectionContainer}>
              <View style={styles.reflectionQuote}>
                <Text style={styles.reflection}>{config.reflection}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Botón */}
          <Animated.View
            style={{
              opacity: buttonAnim,
              transform: [{ translateY: interpY(buttonAnim) }],
            }}
          >
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
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: "center", alignItems: "center", margin: 0 },
  container: {
    width: modalWidth,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
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
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  messageContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  message: {
    fontSize: 17,
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
    color: "#68727A",
    textAlign: "center",
    lineHeight: 23,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#68D391",
    borderRadius: 20,
    width: "100%",
    shadowColor: "#68D391",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonContent: { paddingVertical: spacing.md + 2 },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default CelebrationModal;
