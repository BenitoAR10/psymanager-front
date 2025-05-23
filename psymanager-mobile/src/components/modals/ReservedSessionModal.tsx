"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} from "../../screens/styles/themeConstants";
import type { SessionState } from "../../types/sessionTypes";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { MotiView } from "moti";

// Configurar dayjs para español
dayjs.locale("es");

interface ReservedSessionModalProps {
  visible: boolean;
  onClose: () => void;
  therapistName: string;
  date: string;
  startTime: string;
  endTime: string;
  state: SessionState;
  availabilityStatus?: "available" | "taken" | "treatment-assigned";
}

const ReservedSessionModal: React.FC<ReservedSessionModalProps> = ({
  visible,
  onClose,
  therapistName,
  date,
  startTime,
  endTime,
  state,
  availabilityStatus = "taken",
}) => {
  // Animaciones
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

  // Formatear la fecha para mostrarla en un formato más amigable
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return dayjs(dateString).format("dddd, D [de] MMMM [de] YYYY");
  };

  // Formatear la hora
  const formatTime = (time: string) => {
    if (!time) return "";
    // Convertir formato 24h a 12h
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStateLabel = (state: SessionState) => {
    switch (state) {
      case "PENDING":
        return "Pendiente";
      case "ACCEPTED":
        return "Confirmada";
      case "REJECTED":
        return "Rechazada";
      case "CANCELED":
        return "Cancelada";
      case "COMPLETED":
        return "Completada";
      default:
        return "Desconocido";
    }
  };

  const getStatusInfo = (): {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    color: string;
    title: string;
    message: string;
    actionText: string;
  } => {
    if (availabilityStatus === "treatment-assigned") {
      return {
        icon: "calendar-clock",
        color: colors.primary.main,
        title: "Sesión programada",
        message:
          "Esta sesión ha sido programada por tu terapeuta como parte de tu tratamiento psicológico.",
        actionText: "Entendido",
      };
    }

    switch (state) {
      case "PENDING":
        return {
          icon: "clock-time-four-outline",
          color: colors.warning.main,
          title: "Cita pendiente",
          message:
            "Tu solicitud de cita está pendiente de confirmación por parte del terapeuta.",
          actionText: "Cerrar",
        };
      case "ACCEPTED":
        return {
          icon: "check-circle-outline",
          color: colors.success.main,
          title: "Cita confirmada",
          message: "¡Excelente! Tu cita ha sido confirmada por el terapeuta.",
          actionText: "Aceptar",
        };
      case "REJECTED":
        return {
          icon: "close-circle-outline",
          color: colors.error.main,
          title: "Cita rechazada",
          message:
            "Lo sentimos, tu cita fue rechazada. Puedes elegir otro horario disponible.",
          actionText: "Buscar otro horario",
        };
      case "CANCELED":
        return {
          icon: "calendar-remove-outline",
          color: colors.error.main,
          title: "Cita cancelada",
          message:
            "Has cancelado esta cita. Puedes reservar otro horario si lo deseas.",
          actionText: "Cerrar",
        };
      case "COMPLETED":
        return {
          icon: "check-decagram",
          color: colors.success.main,
          title: "Sesión completada",
          message:
            "Esta sesión fue marcada como completada. Puedes revisar tu progreso con tu terapeuta.",
          actionText: "Entendido",
        };

      default:
        return {
          icon: "help-circle-outline",
          color: colors.secondary.main,
          title: "Estado desconocido",
          message: "No podemos determinar el estado actual de tu cita.",
          actionText: "Cerrar",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay} />
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Botón de cerrar en la esquina superior derecha */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityLabel="Cerrar modal"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          {/* Icono de estado */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 400, delay: 100 }}
            style={[
              styles.iconContainer,
              { backgroundColor: statusInfo.color + "20" },
            ]}
          >
            <View
              style={[styles.iconInner, { backgroundColor: statusInfo.color }]}
            >
              <MaterialCommunityIcons
                name={statusInfo.icon}
                size={32}
                color="#FFFFFF"
              />
            </View>
          </MotiView>

          {/* Título y estado */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: 200 }}
          >
            <Text style={styles.title}>{statusInfo.title}</Text>

            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {getStateLabel(state)}
              </Text>
            </View>
          </MotiView>

          {/* Información de la cita */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: 300 }}
            style={styles.infoContainer}
          >
            {/* Terapeuta */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons
                  name="account"
                  size={20}
                  color={colors.primary.main}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Terapeuta</Text>
                <Text style={styles.infoValue}>{therapistName}</Text>
              </View>
            </View>

            {/* Fecha */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={colors.primary.main}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Fecha</Text>
                <Text style={styles.infoValue}>{formatDate(date)}</Text>
              </View>
            </View>

            {/* Hora */}
            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color={colors.primary.main}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Hora</Text>
                <Text style={styles.infoValue}>
                  {formatTime(startTime)} - {formatTime(endTime)}
                </Text>
              </View>
            </View>
          </MotiView>

          {/* Mensaje de estado */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: 400 }}
          >
            <Text style={styles.message}>{statusInfo.message}</Text>
          </MotiView>

          {/* Botones de acción */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: 500 }}
            style={styles.buttonRow}
          >
            {state === "REJECTED" && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onClose}
                activeOpacity={0.7}
                accessibilityLabel="Cancelar"
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                state === "REJECTED" ? { flex: 2 } : { width: "100%" },
                { backgroundColor: statusInfo.color },
              ]}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel={statusInfo.actionText}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>
                {statusInfo.actionText}
              </Text>
            </TouchableOpacity>
          </MotiView>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Definimos algunos colores adicionales que no están en el tema
const modalColors = {
  overlay: "rgba(0, 0, 0, 0.5)",
};

// Estilos específicos para este modal
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: modalColors.overlay,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: "90%",
    maxWidth: 360,
    alignItems: "center",
    ...shadows.lg,
  },
  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.default,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    ...shadows.sm,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  iconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.default,
    marginBottom: spacing.lg,
    alignSelf: "center",
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: "semibold",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
  },
  lastInfoRow: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.light + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
    color: colors.text.primary,
  },
  message: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    textAlign: "center",
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.default,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  secondaryButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
    color: colors.text.primary,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  primaryButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: "semibold",
    color: "#FFFFFF",
  },
});

export default ReservedSessionModal;
