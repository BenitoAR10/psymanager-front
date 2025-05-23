import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { modalStyles } from "../styles/modalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CancelModalProps {
  visible: boolean;
  reason: string;
  onChangeReason: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({
  visible,
  reason,
  onChangeReason,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={modalStyles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View style={modalStyles.container}>
          <View style={modalStyles.iconContainer}>
            <View style={modalStyles.iconInner}>
              <MaterialCommunityIcons
                name="calendar-remove"
                size={32}
                color="#fff"
              />
            </View>
          </View>

          <Text style={modalStyles.title}>Cancelar cita</Text>
          <Text style={modalStyles.description}>
            Por favor ingresa el motivo de la cancelación para continuar.
          </Text>

          <TextInput
            value={reason}
            onChangeText={onChangeReason}
            placeholder="Escribe el motivo..."
            multiline
            numberOfLines={4}
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 12,
              padding: 12,
              minHeight: 90,
              textAlignVertical: "top",
              marginBottom: 20,
              fontSize: 15,
              color: "#333",
            }}
          />

          <View style={modalStyles.buttonRow}>
            <TouchableOpacity
              onPress={onCancel}
              style={modalStyles.cancelButton}
            >
              <Text style={modalStyles.cancelText}>Volver</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={modalStyles.confirmButton}
            >
              <Text style={modalStyles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CancelModal;
