// ConfirmReservationModal.tsx
import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ConfirmReservationModalProps {
  visible: boolean;
  hour: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmReservationModal: React.FC<ConfirmReservationModalProps> = ({
  visible,
  hour,
  onCancel,
  onConfirm,
}) => {
  // Animaciones para mejorar la experiencia de usuario
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animar entrada
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Resetear animaciones cuando se cierra
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      useNativeDriver
      onBackdropPress={onCancel}
      style={styles.modal}
      avoidKeyboard
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconInner}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={32}
              color="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.title}>Solicitar horario</Text>

        <Text style={styles.description}>
          ¿Deseas solicitar una cita para el horario{" "}
          <Text style={styles.highlightText}>{hour}</Text>?
        </Text>

        <Text style={styles.note}>
          Tu solicitud será enviada al terapeuta para su confirmación.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={onCancel}
            style={styles.cancelButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Cancelar solicitud"
            accessibilityHint="Toca para cancelar la solicitud de horario"
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onConfirm}
            style={styles.confirmButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Solicitar horario"
            accessibilityHint="Toca para enviar la solicitud de horario"
          >
            <MaterialCommunityIcons
              name="calendar-plus"
              size={18}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.confirmText}>Solicitar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

// Colores consistentes con el resto de la aplicación
const colors = {
  primary: "#4DB6AC",
  primaryLight: "#80CBC4",
  primaryDark: "#00897B",
  textPrimary: "#2A3548",
  textSecondary: "#6B7A99",
  background: "#F5F7FA",
  surface: "#FFFFFF",
  border: "#E3E8EF",
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight + "30",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  note: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.8,
  },
  highlightText: {
    color: colors.primary,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 15,
  },
  confirmText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  buttonIcon: {
    marginRight: 6,
  },
});

export default ConfirmReservationModal;
