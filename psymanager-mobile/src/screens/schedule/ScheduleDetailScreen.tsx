"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text, Avatar } from "react-native-paper";
import {
  useRoute,
  type RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TherapistContact from "../../components/common/TherapistContact";
import scheduleDetailStyles from "../styles/scheduleDetailStyles";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../auth/useAuth";
import { Linking, Alert } from "react-native";
import {
  getRelatedSchedulesByScheduleId,
  createScheduledSession,
} from "../../services/scheduleService";
import type { ScheduleAvailabilityWithContactDto } from "../../types/scheduleTypes";

import { useToast } from "react-native-toast-notifications";
import ConfirmReservationModal from "../../components/modals/ConfirmReservationModal";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { TextInput } from "react-native-paper";
import { MotiView } from "moti";
import dayjs from "dayjs";

type ScheduleDetailRouteProp = RouteProp<RootStackParamList, "ScheduleDetail">;

const ScheduleDetailScreen: React.FC = () => {
  const route = useRoute<ScheduleDetailRouteProp>();
  const { scheduleId, therapistName, startTime, endTime, date } = route.params;
  const { token } = useAuth();
  const navigation = useNavigation();
  const toast = useToast();

  const [availableTimes, setAvailableTimes] = useState<
    ScheduleAvailabilityWithContactDto[]
  >([]);

  const [selectedHourId, setSelectedHourId] = useState<number | null>(null);
  const [selectedHourLabel, setSelectedHourLabel] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReason, setSessionReason] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const result = await getRelatedSchedulesByScheduleId({
          token,
          scheduleId,
        });
        setAvailableTimes(
          result.filter((item) => {
            const now = dayjs();
            const slotDateTime = dayjs(`${item.date}T${item.startTime}`);
            const isToday = slotDateTime.isSame(now, "day");
            const isInFuture = slotDateTime.isAfter(now);

            // Si es hoy, solo mostrar horarios futuros
            if (isToday) {
              return item.availabilityStatus === "available" && isInFuture;
            }

            // Si es otro día, mostrar todos los disponibles
            return item.availabilityStatus === "available";
          })
        );
      } catch (error) {
        console.error("Error al obtener horarios relacionados", error);
      }
    };

    fetchData();
  }, [token, scheduleId]);

  const handleOpenModal = () => {
    if (!selectedHourId) {
      toast.show("Selecciona un horario para reservar.", { type: "danger" });
      return;
    }

    if (sessionReason.trim().length === 0) {
      toast.show("Indica brevemente el motivo de tu solicitud.", {
        type: "warning",
      });
      return;
    }

    const selected = availableTimes.find(
      (t) => t.scheduleId === selectedHourId
    );

    if (selected) {
      const slotDateTime = dayjs(`${selected.date}T${selected.startTime}`);
      const now = dayjs();

      const diffInMinutes = slotDateTime.diff(now, "minute");

      if (diffInMinutes < 5) {
        toast.show(
          "El horario seleccionado está demasiado cerca en el tiempo.",
          {
            type: "danger",
          }
        );
        return;
      }

      setSelectedHourLabel(`${selected.startTime} - ${selected.endTime}`);
      setModalVisible(true);
    }
  };

  const handleConfirmReservation = async () => {
    if (!token || !selectedHourId) return;

    setLoading(true);

    try {
      await createScheduledSession({
        token,
        scheduleId: selectedHourId,
        reason: sessionReason.trim(),
      });

      toast.show("Cita agendada correctamente", { type: "success" });
      setTimeout(() => {
        setModalVisible(false);
        setLoading(false);
        navigation.goBack();
      }, 800);
    } catch (error: any) {
      setLoading(false);
      setModalVisible(false);
      try {
        const parsed = JSON.parse(error.message);
        toast.show(parsed.message || "Error desconocido", { type: "danger" });
      } catch {
        toast.show(error.message || "No se pudo agendar la cita.", {
          type: "danger",
        });
      }
    }
  };

  const handleCall = () => {
    const phone = availableTimes[0]?.therapistPhoneNumber?.replace(/\D+/g, "");
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = () => {
    const rawPhone = availableTimes[0]?.therapistPhoneNumber;
    if (!rawPhone) return;

    const localPhone = rawPhone.replace(/\D+/g, "");
    const fullPhone = `591${localPhone}`;
    const url = `https://wa.me/${fullPhone}`;

    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "No se pudo abrir WhatsApp.")
    );
  };

  const handleEmail = () => {
    const email = availableTimes[0]?.therapistEmail;
    if (!email) return;

    const subject = "Consulta sobre cita";
    const body = "Hola, quisiera consultar sobre una sesión.";
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "No se pudo abrir el cliente de correo.")
    );
  };

  return (
    <>
      <ScrollView style={scheduleDetailStyles.container}>
        {/* Perfil del terapeuta */}
        <View style={scheduleDetailStyles.profileContainer}>
          <Avatar.Image
            size={80}
            source={{ uri: "https://via.placeholder.com/80" }}
            style={scheduleDetailStyles.avatar}
          />
          <Text style={scheduleDetailStyles.therapistName}>
            Psicól. {therapistName}
          </Text>
          <Text style={scheduleDetailStyles.therapistSpecialty}>
            Psicóloga Especialista
          </Text>
        </View>

        {/* Contacto */}
        <TherapistContact
          onCall={handleCall}
          onEmail={handleEmail}
          onWhatsApp={handleWhatsApp}
        />

        {/* Sobre la terapeuta */}
        <View style={scheduleDetailStyles.section}>
          <Text style={scheduleDetailStyles.sectionTitle}>
            Sobre la Terapeuta
          </Text>
          <Text style={scheduleDetailStyles.sectionText}>
            Esta terapeuta está especializada en salud emocional universitaria.
          </Text>
        </View>

        {/* Sección de motivo de la sesión */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 500, delay: 400 }}
          style={scheduleDetailStyles.reasonContainer}
        >
          <View style={scheduleDetailStyles.reasonHeader}>
            <MaterialCommunityIcons
              name="message-text-outline"
              size={20}
              color={"#8C9EFF"}
              style={scheduleDetailStyles.reasonIcon}
            />
            <Text style={scheduleDetailStyles.reasonTitle}>
              Motivo de la consulta
            </Text>
          </View>

          <Text style={scheduleDetailStyles.reasonSubtitle}>
            Comparte brevemente por qué necesitas esta sesión
          </Text>

          <TextInput
            label="Describe tu motivo"
            mode="outlined"
            multiline
            numberOfLines={4}
            value={sessionReason}
            onChangeText={setSessionReason}
            style={scheduleDetailStyles.reasonInput}
            contentStyle={scheduleDetailStyles.reasonInputContent}
            outlineStyle={scheduleDetailStyles.reasonInputOutline}
            theme={{
              colors: {
                primary: "#8C9EFF",
                outline: "#E9EEF6",
                onSurfaceVariant: "#666666",
              },
            }}
            placeholder="Ej: Necesito apoyo para manejar el estrés académico..."
            maxLength={500}
          />

          <Text style={scheduleDetailStyles.characterCount}>
            {sessionReason.length}/500 caracteres
          </Text>
        </MotiView>

        {/* Horarios disponibles */}
        <View style={scheduleDetailStyles.section}>
          <Text style={scheduleDetailStyles.sectionTitle}>
            Horarios Disponibles
          </Text>
          <Text style={scheduleDetailStyles.sectionSubtitle}>
            Selecciona el horario que deseas reservar.
          </Text>

          <View style={scheduleDetailStyles.hoursContainer}>
            {availableTimes.map((item) => (
              <TouchableOpacity
                key={item.scheduleId}
                style={[
                  scheduleDetailStyles.hourItem,
                  selectedHourId === item.scheduleId &&
                    scheduleDetailStyles.selectedHourItem,
                ]}
                onPress={() => setSelectedHourId(item.scheduleId)}
              >
                <Text
                  style={[
                    scheduleDetailStyles.hourText,
                    selectedHourId === item.scheduleId &&
                      scheduleDetailStyles.selectedHourText,
                  ]}
                >
                  {item.startTime} - {item.endTime}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón de reserva */}
        <TouchableOpacity
          style={[
            scheduleDetailStyles.reserveButton,
            (!selectedHourId || sessionReason.trim().length === 0) &&
              scheduleDetailStyles.disabledReserveButton,
          ]}
          onPress={handleOpenModal}
          disabled={!selectedHourId || sessionReason.trim().length === 0}
        >
          <Text style={scheduleDetailStyles.reserveButtonText}>
            Reservar Cita
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmReservationModal
        visible={modalVisible}
        hour={selectedHourLabel}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirmReservation}
      />

      <LoadingOverlay visible={loading} />
    </>
  );
};

export default ScheduleDetailScreen;
