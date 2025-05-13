// components/DeleteAccountModal.tsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles } from "./styles/modalStyles";

interface DeleteAccountModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="fadeOut"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      useNativeDriver
      onBackdropPress={onCancel}
      style={modalStyles.modal}
    >
      <View style={modalStyles.container}>
        <View style={modalStyles.iconContainer}>
          <MaterialCommunityIcons name="delete" size={32} color="#FFFFFF" />
        </View>
        <Text style={modalStyles.title}>Eliminar cuenta</Text>
        <Text style={modalStyles.description}>
          Esta acción{" "}
          <Text style={modalStyles.highlightText}>no se puede deshacer</Text>.
          ¿Deseas continuar y eliminar tu cuenta?
        </Text>

        <View style={modalStyles.buttonRow}>
          <TouchableOpacity
            onPress={onCancel}
            style={modalStyles.cancelButton}
            activeOpacity={0.7}
          >
            <Text style={modalStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onConfirm}
            style={modalStyles.confirmButton}
            activeOpacity={0.7}
          >
            <Text style={modalStyles.confirmText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;
