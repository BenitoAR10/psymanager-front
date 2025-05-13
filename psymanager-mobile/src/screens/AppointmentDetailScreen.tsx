// AppointmentDetailScreen.tsx
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
} from "react-native";
import { Avatar, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import {
  type RouteProp,
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { getAppointmentDetail } from "../services/appointmentService";
import { useAuth } from "../auth/useAuth";
import type { UserAppointmentDetailDto } from "../types/appointmentTypes";
import appointmentDetailStyles from "../screens/styles/appointmentDetailStyles";
import { theme } from "../screens/styles/themeConstants";
import dayjs from "dayjs";
import "dayjs/locale/es";

// Configurar dayjs para español
dayjs.locale("es");

const { colors } = theme;

type AppointmentDetailRouteProp = RouteProp<
  RootStackParamList,
  "AppointmentDetail"
>;

const AppointmentDetailScreen: React.FC = () => {
  const { token } = useAuth();
  const route = useRoute<AppointmentDetailRouteProp>();
  const navigation = useNavigation();
  const { sessionId } = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointment, setAppointment] =
    useState<UserAppointmentDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

  const loadDetails = async (showLoader = true) => {
    if (!token) return;

    if (showLoader) setLoading(true);

    try {
      const result = await getAppointmentDetail(sessionId, token);
      setAppointment(result);
      setError(null);
    } catch (err: any) {
      console.error("Error loading appointment details:", err);
      setError(err.message || "No se pudo cargar el detalle de la cita");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [sessionId, token]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDetails(false);
  };

  const handleReprogramAppointment = () => {
    Alert.alert(
      "Reprogramar cita",
      "¿Estás seguro que deseas reprogramar esta cita?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Reprogramar",
          onPress: () => {
            // Implementar funcionalidad de reprogramación
            Alert.alert(
              "Información",
              "Funcionalidad de reprogramación pendiente"
            );
          },
        },
      ]
    );
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      "Cancelar cita",
      "¿Estás seguro que deseas cancelar esta cita?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => {
            // Implementar funcionalidad de cancelación
            Alert.alert(
              "Información",
              "Funcionalidad de cancelación pendiente"
            );
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1 }}>
        <View style={appointmentDetailStyles.centered}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={{ marginTop: 16, color: colors.text.secondary }}>
            Cargando detalles...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !appointment) {
    return (
      <View style={{ flex: 1 }}>
        <View style={appointmentDetailStyles.errorContainer}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 300 }}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={60}
              color={colors.error.main}
              style={appointmentDetailStyles.errorIcon}
            />
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 300, delay: 100 }}
          >
            <Text style={appointmentDetailStyles.errorText}>
              No pudimos cargar los detalles
            </Text>
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 300, delay: 200 }}
          >
            <Text style={appointmentDetailStyles.errorDescription}>
              {error ||
                "Ocurrió un error al cargar los detalles de la cita. Por favor intenta nuevamente."}
            </Text>
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 300, delay: 300 }}
          >
            <TouchableOpacity
              style={appointmentDetailStyles.retryButton}
              onPress={() => loadDetails()}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={18}
                color="#FFFFFF"
              />
              <Text style={appointmentDetailStyles.retryText}>
                Intentar nuevamente
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </View>
    );
  }

  const durationMinutes = (() => {
    const startTime = appointment.startTime.split(":");
    const endTime = appointment.endTime.split(":");

    const startMinutes =
      Number.parseInt(startTime[0]) * 60 + Number.parseInt(startTime[1]);
    const endMinutes =
      Number.parseInt(endTime[0]) * 60 + Number.parseInt(endTime[1]);

    return endMinutes - startMinutes;
  })();

  // Formatear la fecha para mostrarla en un formato más amigable
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("dddd, D [de] MMMM [de] YYYY");
  };

  // Formatear la hora
  const formatTime = (time: string) => {
    // Convertir formato 24h a 12h
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Verificar si la cita ya pasó
  const isPastAppointment = () => {
    const appointmentEnd = dayjs(`${appointment.date}T${appointment.endTime}`);
    return appointmentEnd.isBefore(dayjs());
  };

  // Obtener estado de la cita
  const getAppointmentStatus = () => {
    if (isPastAppointment()) {
      return {
        text: "Completada",
        color: colors.text.secondary,
        bgColor: colors.grey[300] + "40",
      };
    }

    switch (appointment.sessionState) {
      case "PENDING":
        return {
          text: "Pendiente de confirmación",
          color: colors.warning.main,
          bgColor: colors.warning.main + "20",
        };
      case "REJECTED":
        return {
          text: "Rechazada",
          color: colors.error.main,
          bgColor: colors.error.main + "20",
        };
      default:
        return {
          text: "Confirmada",
          color: colors.success.main,
          bgColor: colors.success.main + "20",
        };
    }
  };

  const statusInfo = getAppointmentStatus();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.default }}>
      <ScrollView
        contentContainerStyle={appointmentDetailStyles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        }
      >
        <View style={appointmentDetailStyles.contentContainer}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 400, type: "timing" }}
          >
            {/* Estado de la cita */}
            <View
              style={[
                appointmentDetailStyles.statusContainer,
                { backgroundColor: statusInfo.bgColor },
              ]}
            >
              <Text
                style={[
                  appointmentDetailStyles.statusText,
                  { color: statusInfo.color },
                ]}
              >
                {statusInfo.text}
              </Text>
            </View>

            {/* Tarjeta del terapeuta */}
            <View style={appointmentDetailStyles.therapistCard}>
              <View style={appointmentDetailStyles.therapistHeader}>
                <Avatar.Image
                  size={56}
                  source={{ uri: "https://via.placeholder.com/56" }}
                  style={appointmentDetailStyles.therapistAvatar}
                />
                <View style={appointmentDetailStyles.therapistInfo}>
                  <Text style={appointmentDetailStyles.therapistName}>
                    Psicól. {appointment.therapistName}
                  </Text>
                  <Text style={appointmentDetailStyles.therapistRole}>
                    Psicólogo(a) especialista
                  </Text>
                </View>
              </View>
              <View style={appointmentDetailStyles.therapistActions}>
                <TouchableOpacity
                  style={appointmentDetailStyles.actionButton}
                  onPress={() =>
                    Alert.alert("Llamar", "Funcionalidad pendiente")
                  }
                >
                  <MaterialCommunityIcons
                    name="phone"
                    size={20}
                    color={colors.secondary.main}
                  />
                  <Text style={appointmentDetailStyles.actionButtonText}>
                    Llamar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={appointmentDetailStyles.actionButton}
                  onPress={() =>
                    Alert.alert("Mensaje", "Funcionalidad pendiente")
                  }
                >
                  <MaterialCommunityIcons
                    name="message-text-outline"
                    size={20}
                    color={colors.secondary.main}
                  />
                  <Text style={appointmentDetailStyles.actionButtonText}>
                    Mensaje
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Información de la cita */}
            <View style={appointmentDetailStyles.sectionContainer}>
              <View style={appointmentDetailStyles.sectionHeader}>
                <View style={appointmentDetailStyles.sectionIcon}>
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={18}
                    color={colors.primary.main}
                  />
                </View>
                <Text style={appointmentDetailStyles.sectionLabel}>
                  Detalles de la cita
                </Text>
              </View>

              <View style={appointmentDetailStyles.infoBlock}>
                <View style={appointmentDetailStyles.infoRow}>
                  <View style={appointmentDetailStyles.infoIcon}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={20}
                      color={colors.primary.main}
                    />
                  </View>
                  <View style={appointmentDetailStyles.infoTextContainer}>
                    <Text style={appointmentDetailStyles.infoLabel}>Fecha</Text>
                    <Text style={appointmentDetailStyles.infoText}>
                      {formatDate(appointment.date)}
                    </Text>
                  </View>
                </View>

                <View style={appointmentDetailStyles.infoRow}>
                  <View style={appointmentDetailStyles.infoIcon}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={20}
                      color={colors.primary.main}
                    />
                  </View>
                  <View style={appointmentDetailStyles.infoTextContainer}>
                    <Text style={appointmentDetailStyles.infoLabel}>Hora</Text>
                    <Text style={appointmentDetailStyles.infoText}>
                      {formatTime(appointment.startTime)} -{" "}
                      {formatTime(appointment.endTime)}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    appointmentDetailStyles.infoRow,
                    appointmentDetailStyles.lastInfoRow,
                  ]}
                >
                  <View style={appointmentDetailStyles.infoIcon}>
                    <MaterialCommunityIcons
                      name="timer-outline"
                      size={20}
                      color={colors.primary.main}
                    />
                  </View>
                  <View style={appointmentDetailStyles.infoTextContainer}>
                    <Text style={appointmentDetailStyles.infoLabel}>
                      Duración
                    </Text>
                    <Text style={appointmentDetailStyles.infoText}>
                      {durationMinutes} minutos
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Notas para la sesión */}
            <View style={appointmentDetailStyles.sectionContainer}>
              <View style={appointmentDetailStyles.sectionHeader}>
                <View style={appointmentDetailStyles.sectionIcon}>
                  <MaterialCommunityIcons
                    name="note-text-outline"
                    size={18}
                    color={colors.primary.main}
                  />
                </View>
                <Text style={appointmentDetailStyles.sectionLabel}>
                  Notas para la sesión
                </Text>
              </View>

              <View style={appointmentDetailStyles.sessionInfoBlock}>
                <View style={appointmentDetailStyles.sessionHeader}>
                  <Text style={appointmentDetailStyles.sessionTitle}>
                    Agrega cualquier información que quieras compartir con tu
                    terapeuta
                  </Text>
                </View>
                <View style={appointmentDetailStyles.sessionContent}>
                  <TextInput
                    style={appointmentDetailStyles.notesInput}
                    multiline
                    placeholder="Escribe aquí tus notas o preguntas para el terapeuta..."
                    placeholderTextColor={colors.text.secondary + "80"}
                    value={notes}
                    onChangeText={setNotes}
                  />
                </View>
              </View>
            </View>
          </MotiView>
        </View>
      </ScrollView>

      {/* Botones fijos en la parte inferior */}
      {!isPastAppointment() && (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300, delay: 300 }}
          style={appointmentDetailStyles.buttonContainer}
        >
          <View style={appointmentDetailStyles.buttonRow}>
            <Button
              mode="contained"
              onPress={handleReprogramAppointment}
              style={appointmentDetailStyles.reprogramButton}
              labelStyle={appointmentDetailStyles.reprogramButtonLabel}
              icon="calendar-edit"
            >
              Reprogramar
            </Button>
            <Button
              mode="outlined"
              onPress={handleCancelAppointment}
              style={appointmentDetailStyles.cancelButton}
              labelStyle={appointmentDetailStyles.cancelButtonLabel}
              icon="calendar-remove"
            >
              Cancelar
            </Button>
          </View>
        </MotiView>
      )}
    </View>
  );
};

export default AppointmentDetailScreen;
