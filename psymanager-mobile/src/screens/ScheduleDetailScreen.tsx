"use client";

import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import dayjs from "dayjs";
import "dayjs/locale/es";
import TherapistContact from "../components/TherapistContact";
import scheduleDetailStyles from "./styles/scheduleDetailStyles";
import { colors } from "./styles/scheduleDetailStyles";
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

// Configurar dayjs para español
dayjs.locale("es");

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

  // Agrupar horarios por fecha
  const [groupedTimes, setGroupedTimes] = useState<{
    [key: string]: ScheduleAvailabilityDto[];
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const result = await getRelatedSchedulesByScheduleId({
          token,
          scheduleId,
        });

        const availableSlots = result.filter(
          (item) => item.availabilityStatus === "available"
        );

        setAvailableTimes(availableSlots);

        // Agrupar por fecha
        const grouped = availableSlots.reduce((acc, slot) => {
          const dateKey = slot.date;
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(slot);
          return acc;
        }, {} as { [key: string]: ScheduleAvailabilityDto[] });

        setGroupedTimes(grouped);
      } catch (error) {
        console.error("Error al obtener horarios relacionados", error);
      }
    };

    fetchData();
  }, [token, scheduleId]);

  const handleOpenModal = () => {
    if (!selectedHourId) {
      toast.show("Por favor selecciona un horario antes de continuar.", {
        type: "warning",
      });
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

      toast.show(
        "Tu solicitud de cita fue enviada. Espera la confirmación del terapeuta.",
        {
          type: "success",
        }
      );

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
        if (parsed.status === 409) {
          toast.show("Este horario ya ha sido reservado por otro estudiante.", {
            type: "danger",
          });
        } else if (parsed.status === 400) {
          toast.show("No fue posible registrar la cita. Verifica tu perfil.", {
            type: "danger",
          });
        } else {
          toast.show(parsed.message || "Ocurrió un error inesperado.", {
            type: "danger",
          });
        }
      } catch {
        toast.show(error.message || "No se pudo agendar la cita.", {
          type: "danger",
        });
      }
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    return {
      day: date.format("D"),
      month: date.format("MMMM"),
      weekday: date.format("dddd"),
    };
  };

  return (
    <SafeAreaView style={scheduleDetailStyles.safeArea}>
      {/* Header con botón de regreso */}

      <ScrollView
        style={scheduleDetailStyles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={scheduleDetailStyles.contentContainer}>
          {/* Tarjeta del terapeuta */}
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 500 }}
            style={scheduleDetailStyles.therapistCard}
          >
            <View style={scheduleDetailStyles.therapistInfo}>
              <Avatar.Image
                size={60}
                source={{ uri: "https://via.placeholder.com/60" }}
                style={scheduleDetailStyles.avatar}
              />
              <View style={scheduleDetailStyles.therapistTextContainer}>
                <Text style={scheduleDetailStyles.therapistName}>
                  Psicól. {therapistName}
                </Text>
                <Text style={scheduleDetailStyles.therapistSpecialty}>
                  Psicóloga Especialista
                </Text>
              </View>
            </View>

            {/* Componente de contacto del terapeuta */}
            <TherapistContact />
          </MotiView>

          {/* Horarios disponibles agrupados por fecha */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 500, delay: 200 }}
            style={scheduleDetailStyles.scheduleContainer}
          >
            <Text style={scheduleDetailStyles.mainTitle}>
              Horarios Disponibles
            </Text>
            <Text style={scheduleDetailStyles.subtitle}>
              Selecciona el horario que prefieras para tu consulta
            </Text>

            {Object.keys(groupedTimes).length > 0 ? (
              Object.entries(groupedTimes).map(([dateKey, slots], index) => {
                const { day, month, weekday } = formatDate(dateKey);
                return (
                  <MotiView
                    key={dateKey}
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 400, delay: 300 + index * 100 }}
                    style={scheduleDetailStyles.dateSection}
                  >
                    <View style={scheduleDetailStyles.dateHeader}>
                      <View style={scheduleDetailStyles.dateCircle}>
                        <Text style={scheduleDetailStyles.dateDay}>{day}</Text>
                      </View>
                      <View style={scheduleDetailStyles.dateInfo}>
                        <Text style={scheduleDetailStyles.dateMonth}>
                          {month.charAt(0).toUpperCase() + month.slice(1)}
                        </Text>
                        <Text style={scheduleDetailStyles.dateWeekday}>
                          {weekday.charAt(0).toUpperCase() + weekday.slice(1)}
                        </Text>
                      </View>
                    </View>

                    <View style={scheduleDetailStyles.timeSlots}>
                      {slots.map((item) => (
                        <TouchableOpacity
                          key={item.scheduleId}
                          style={[
                            scheduleDetailStyles.timeSlot,
                            selectedHourId === item.scheduleId &&
                              scheduleDetailStyles.selectedTimeSlot,
                          ]}
                          onPress={() => setSelectedHourId(item.scheduleId)}
                        >
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={16}
                            color={
                              selectedHourId === item.scheduleId
                                ? "#FFFFFF"
                                : colors.textSecondary
                            }
                            style={scheduleDetailStyles.timeIcon}
                          />
                          <Text
                            style={[
                              scheduleDetailStyles.timeText,
                              selectedHourId === item.scheduleId &&
                                scheduleDetailStyles.selectedTimeText,
                            ]}
                          >
                            {item.startTime} - {item.endTime}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </MotiView>
                );
              })
            ) : (
              <View style={scheduleDetailStyles.emptyState}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={50}
                  color="#CBD5E0"
                />
                <Text style={scheduleDetailStyles.emptyText}>
                  No hay horarios disponibles para este terapeuta
                </Text>
              </View>
            )}
          </MotiView>
        </View>
      </ScrollView>

      {/* Botón de reserva */}
      <View style={scheduleDetailStyles.buttonContainer}>
        <TouchableOpacity
          style={[
            scheduleDetailStyles.reserveButton,
            !selectedHourId && scheduleDetailStyles.disabledButton,
          ]}
          onPress={handleOpenModal}
          disabled={!selectedHourId}
        >
          <MaterialCommunityIcons
            name="calendar-check"
            size={20}
            color="#FFFFFF"
            style={scheduleDetailStyles.buttonIcon}
          />
          <Text style={scheduleDetailStyles.reserveButtonText}>
            Reservar Cita
          </Text>
        </TouchableOpacity>
      </View>

      <ConfirmReservationModal
        visible={modalVisible}
        hour={selectedHourLabel}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirmReservation}
      />

      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
};

export default ScheduleDetailScreen;
