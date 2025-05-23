import type React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { theme } from "../../screens/styles/themeConstants";

const { colors, typography, spacing, borderRadius, shadows } = theme;

interface LogoutConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.modalContainer}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="logout"
              size={32}
              color={colors.error.main}
            />
          </View>

          <Text style={styles.title}>¿Cerrar sesión?</Text>
          <Text style={styles.message}>
            ¿Estás seguro que deseas cerrar tu sesión? Tendrás que iniciar
            sesión nuevamente para acceder a tu cuenta.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    ...shadows.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.error.lightBg}50`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.grey[100],
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  confirmButton: {
    backgroundColor: colors.error.main,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontWeight: "medium",
    fontSize: typography.sizes.sm,
  },
  confirmButtonText: {
    color: colors.background.paper,
    fontWeight: "semibold",
    fontSize: typography.sizes.sm,
  },
});

export default LogoutConfirmModal;
