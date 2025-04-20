import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.4}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver
      onBackdropPress={onCancel}
      style={styles.modal}
    >
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="calendar-check"
          size={40}
          color="#8C9EFF"
          style={styles.icon}
        />
        <Text style={styles.title}>Confirmar reserva</Text>
        <Text style={styles.description}>
          ¿Deseas reservar la cita a las{" "}
          <Text style={{ fontWeight: "bold" }}>{hour}</Text>?
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
    elevation: 6,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#8C9EFF",
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ConfirmReservationModal;
