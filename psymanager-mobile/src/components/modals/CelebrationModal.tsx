import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import { useTheme, Button } from "react-native-paper";

interface CelebrationModalProps {
  visible: boolean;
  points: number;
  onClose: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  points,
  onClose,
}) => {
  const theme = useTheme();

  // Auto cierre del modal después de 3.5 segundos
  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="fadeOut"
      backdropOpacity={0.7}
      useNativeDriver
    >
      <View style={styles.modalContainer}>
        <LottieView
          source={require("../../../assets/congrats.json")}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          ¡Ejercicio Completado!
        </Text>
        <Text style={styles.pointsText}>+{points} puntos de bienestar</Text>
        <Button
          mode="contained"
          onPress={onClose}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Continuar
        </Button>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: width * 0.5,
    height: width * 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
  },
  pointsText: {
    fontSize: 18,
    color: "#4CAF50",
    marginVertical: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 20,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default CelebrationModal;
