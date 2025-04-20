"use client";

import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import TherapistContact from "../components/TherapistContact";
import scheduleDetailStyles from "./styles/scheduleDetailStyles";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../auth/useAuth";
import {
  getRelatedSchedulesByScheduleId,
  createScheduledSession,
} from "../services/scheduleService";
import { ScheduleAvailabilityDto } from "../types/scheduleTypes";
import { useToast } from "react-native-toast-notifications";
import ConfirmReservationModal from "../components/ConfirmReservationModal";
import LoadingOverlay from "../components/LoadingOverlay";

type ScheduleDetailRouteProp = RouteProp<RootStackParamList, "ScheduleDetail">;

const ScheduleDetailScreen: React.FC = () => {
  const route = useRoute<ScheduleDetailRouteProp>();
  const { scheduleId, therapistName, startTime, endTime, date } = route.params;
  const { token } = useAuth();
  const navigation = useNavigation();
  const toast = useToast();

  const [availableTimes, setAvailableTimes] = useState<
    ScheduleAvailabilityDto[]
  >([]);
  const [selectedHourId, setSelectedHourId] = useState<number | null>(null);
  const [selectedHourLabel, setSelectedHourLabel] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const result = await getRelatedSchedulesByScheduleId({
          token,
          scheduleId,
        });
        setAvailableTimes(
          result.filter((item) => item.availabilityStatus === "available")
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

    const selected = availableTimes.find(
      (t) => t.scheduleId === selectedHourId
    );
    if (selected) {
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
          onCall={() => {}}
          onEmail={() => {}}
          onWhatsApp={() => {}}
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
          style={scheduleDetailStyles.reserveButton}
          onPress={handleOpenModal}
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
