"use client";

import type React from "react";
import { useCallback, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Calendar, type ICalendarEventBase } from "react-native-big-calendar";
import { useTreatmentScheduleSessions } from "../services/hooks/useTreatmentScheduleSessions";

import dayjs from "dayjs";
import "dayjs/locale/es";
import {
  useFocusEffect,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import WeekHeader from "../components/WeekHeader";
import Legend from "../components/Legend";
import ReservedSessionModal from "../components/ReservedSessionModal";
import { getAvailableSchedules } from "../services/scheduleService";
import { useAuth } from "../auth/useAuth";
import type { RootStackParamList } from "../navigation/AppNavigator";
import type { NavigationProp } from "@react-navigation/native";
import type { ScheduleAvailabilityDto } from "../types/scheduleTypes";
import scheduleStyles from "./styles/scheduleStyles";

dayjs.locale("es");

type SessionState = "PENDING" | "ACCEPTED" | "REJECTED";

const colors = {
  primary: "#4DB6AC",
  textPrimary: "#2A3548",
  textSecondary: "#6B7A99",
  background: "#F5F7FA",
  surface: "#FFFFFF",
  available: "#9AE6B4",
  reserved: "#8C9EFF",
  taken: "#FEB2B2",
  pastEvent: "#E2E8F0", // Color para eventos pasados
};

interface CustomEvent extends ICalendarEventBase {
  scheduleId: number;
  therapistName: string;
  availabilityStatus: "available" | "taken" | "treatment-assigned";
  reservedByUserId?: number | null;
  sessionState?: SessionState;
  color: string;
  isPast?: boolean; // Nueva propiedad para marcar eventos pasados
}

const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, userInfo } = useAuth();
  const userId = userInfo?.userId;
  const { height } = useWindowDimensions();
  const isFocused = useIsFocused();

  // Referencia para controlar si el componente está montado
  const isMounted = useRef(true);

  const [weekStart, setWeekStart] = useState(
    dayjs().startOf("week").add(1, "day").toDate()
  );
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const { data: treatmentSessions, isLoading: loadingTreatment } =
    useTreatmentScheduleSessions();

  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0); // Clave para forzar re-renderizado
  const [showEmptyState, setShowEmptyState] = useState(false); // Estado para controlar la visualización del estado vacío

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CustomEvent | null>(
    null
  );

  // Altura del calendario - ajustada para permitir scroll
  const calendarHeight = height - 180; // Reducimos un poco para asegurar que haya espacio para scroll

  // Función para mostrar notificaciones según la plataforma
  const showNotification = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Información", message);
    }
  };

  // Efecto para limpiar la referencia cuando el componente se desmonta
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchSchedules = useCallback(async () => {
    if (!token || !isMounted.current) return;
    if (initialLoadComplete) setLoading(true);

    try {
      const now = dayjs();

      // Si el paciente está en tratamiento, usar las sesiones del tratamiento
      if (treatmentSessions && treatmentSessions.length > 0) {
        const mappedEvents = treatmentSessions.map((item) => {
          const startDateTime = dayjs(`${item.date}T${item.startTime}`);
          const endDateTime = dayjs(`${item.date}T${item.endTime}`);
          const isPast = endDateTime.isBefore(now);

          return {
            scheduleId: item.scheduleId,
            title: (() => {
              const parts = item.therapistName.trim().split(" ");
              const firstName =
                parts[0]?.charAt(0).toUpperCase() +
                parts[0]?.slice(1).toLowerCase();
              const firstSurnameInitial = parts[2]?.charAt(0).toUpperCase();
              return firstSurnameInitial
                ? `${firstName} ${firstSurnameInitial}.`
                : firstName;
            })(),
            start: startDateTime.toDate(),
            end: endDateTime.toDate(),
            availabilityStatus: "treatment-assigned" as const,
            reservedByUserId: item.reservedByUserId,
            sessionState: item.sessionState,
            therapistName: item.therapistName,
            color: isPast ? colors.pastEvent : colors.reserved,
            isPast,
          };
        });

        if (isMounted.current) {
          setEvents(mappedEvents);
          setShowEmptyState(mappedEvents.length === 0);
          // Forzar re-renderizado del calendario
          setCalendarKey((prev) => prev + 1);
        }
      } else {
        // Si no está en tratamiento → traer horarios disponibles como antes
        const startDate = dayjs(weekStart).format("YYYY-MM-DD");
        const endDate = dayjs(weekStart).add(6, "day").format("YYYY-MM-DD");

        const result: ScheduleAvailabilityDto[] = await getAvailableSchedules({
          token,
          startDate,
          endDate,
        });

        const mappedEvents = result.map((item) => {
          const startDateTime = dayjs(`${item.date}T${item.startTime}`);
          const endDateTime = dayjs(`${item.date}T${item.endTime}`);
          const isPast = endDateTime.isBefore(now);

          let eventColor;
          if (isPast) {
            eventColor = colors.pastEvent;
          } else {
            eventColor =
              item.availabilityStatus === "available"
                ? colors.available
                : item.reservedByUserId === userId
                ? colors.reserved
                : colors.taken;
          }

          return {
            scheduleId: item.scheduleId,
            title: (() => {
              const parts = item.therapistName.trim().split(" ");
              const firstName =
                parts[0]?.charAt(0).toUpperCase() +
                parts[0]?.slice(1).toLowerCase();
              const firstSurnameInitial = parts[2]?.charAt(0).toUpperCase();
              return firstSurnameInitial
                ? `${firstName} ${firstSurnameInitial}.`
                : firstName;
            })(),
            start: startDateTime.toDate(),
            end: endDateTime.toDate(),
            availabilityStatus: item.availabilityStatus,
            reservedByUserId: item.reservedByUserId,
            sessionState: item.sessionState,
            therapistName: item.therapistName,
            color: eventColor,
            isPast,
          };
        });

        if (isMounted.current) {
          setEvents(mappedEvents);
          setShowEmptyState(mappedEvents.length === 0);
          // Forzar re-renderizado del calendario
          setCalendarKey((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error al cargar horarios semanales:", error);
      if (isMounted.current) {
        setShowEmptyState(true);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        if (!initialLoadComplete) setInitialLoadComplete(true);
      }
    }
  }, [token, userId, weekStart, initialLoadComplete, treatmentSessions]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (token && !initialLoadComplete && !loadingTreatment) {
      fetchSchedules();
    }
  }, [token, initialLoadComplete, loadingTreatment, fetchSchedules]);

  // Efecto para recargar datos cuando cambia la semana
  useEffect(() => {
    if (initialLoadComplete && isFocused) {
      fetchSchedules();
    }
  }, [weekStart, isFocused, initialLoadComplete, fetchSchedules]);

  // Usar useFocusEffect para recargar al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      if (initialLoadComplete) {
        // Pequeño retraso para evitar problemas de renderizado
        const timer = setTimeout(() => {
          if (isMounted.current) {
            fetchSchedules();
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [fetchSchedules, initialLoadComplete])
  );

  const handleWeekChange = (direction: "prev" | "next") => {
    const newStart = dayjs(weekStart)
      .add(direction === "prev" ? -7 : 7, "day")
      .toDate();
    setWeekStart(newStart);
  };

  const handlePressEvent = (event: CustomEvent) => {
    // Si el evento ya pasó, mostrar un mensaje informativo y no hacer nada más
    if (event.isPast) {
      showNotification("Este horario ya ha pasado y no está disponible");
      return;
    }

    const isAvailable = event.availabilityStatus === "available";
    const isOwnReservation = event.reservedByUserId === userId;

    if (isAvailable) {
      navigation.navigate("ScheduleDetail", {
        scheduleId: event.scheduleId,
        therapistName: event.therapistName,
        startTime: dayjs(event.start).format("HH:mm"),
        endTime: dayjs(event.end).format("HH:mm"),
        date: dayjs(event.start).format("YYYY-MM-DD"),
      });
    } else if (isOwnReservation) {
      setSelectedSession(event);
      setModalVisible(true);
    }
  };

  // Componente personalizado para renderizar eventos
  const renderEvent = (event: CustomEvent, touchableOpacityProps: any) => {
    const { key, ...otherProps } = touchableOpacityProps;
    return (
      <TouchableOpacity
        key={key} // Pasar key directamente
        {...otherProps} // Pasar el resto de props con spread
        style={[otherProps.style, event.isPast && styles.pastEventContainer]}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={[styles.eventTitle, event.isPast && styles.pastEventText]}
          >
            {event.title}
          </Text>

          {event.isPast && (
            <View style={styles.pastIndicator}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={10}
                color="#718096"
              />
              <Text style={styles.pastIndicatorText}>Pasado</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Renderizar el estado vacío sin animaciones
  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, { height: calendarHeight }]}>
      <MaterialCommunityIcons
        name="calendar-blank"
        size={60}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>
        {treatmentSessions && treatmentSessions.length === 0
          ? "No tienes sesiones asignadas para esta semana"
          : "No hay horarios disponibles"}
      </Text>
      <Text style={[styles.emptyText, { fontSize: 14, marginTop: 8 }]}>
        Intenta seleccionar otra semana
      </Text>
    </View>
  );

  const renderContent = () => {
    if (loading && !initialLoadComplete) {
      return (
        <View style={styles.skeletonContainer}>
          <Skeleton
            height={calendarHeight - 32}
            width="100%"
            radius={12}
            colorMode="light"
            transition={{ type: "timing", duration: 1000 }}
          />
        </View>
      );
    }

    if (showEmptyState) {
      return renderEmptyState();
    }

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <Calendar
          key={`calendar-${calendarKey}`} // Usar una key para forzar re-renderizado
          height={calendarHeight}
          mode="custom"
          weekStartsOn={1}
          weekEndsOn={6}
          swipeEnabled={false}
          showTime
          locale="es"
          date={weekStart}
          events={events}
          minHour={8}
          maxHour={18}
          scrollOffsetMinutes={0} // Comenzar desde la parte superior
          renderHeader={() => null}
          headerContainerAccessibilityProps={{ accessibilityRole: "header" }}
          dayHeaderStyle={scheduleStyles.dayHeader}
          dayHeaderHighlightColor={colors.primary + "30"}
          hourStyle={scheduleStyles.hourRow}
          eventCellStyle={(event: CustomEvent) => ({
            backgroundColor: event.color,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: event.isPast
              ? "rgba(203, 213, 224, 0.5)"
              : event.color === colors.available
              ? "rgba(56, 161, 105, 0.2)"
              : event.color === colors.reserved
              ? "rgba(92, 107, 192, 0.2)"
              : "rgba(229, 62, 62, 0.2)",
            justifyContent: "center",
            paddingHorizontal: 4,
            paddingVertical: 2,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: event.isPast ? 0.05 : 0.1,
            shadowRadius: 1,
            elevation: event.isPast ? 0 : 1,
            opacity: event.isPast ? 0.7 : 1,
          })}
          renderEvent={renderEvent}
          onChangeDate={(dates) => {
            if (dates && dates.length > 0) {
              const first = dates[0];
              if (first && !dayjs(first).isSame(weekStart, "day")) {
                setWeekStart(new Date(first));
              }
            }
          }}
          onPressEvent={handlePressEvent}
        />
      </ScrollView>
    );
  };

  return (
    <View style={scheduleStyles.container}>
      <WeekHeader
        weekStart={weekStart}
        onPrev={() => handleWeekChange("prev")}
        onNext={() => handleWeekChange("next")}
      />
      <Legend />
      {renderContent()}

      <ReservedSessionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        therapistName={selectedSession?.therapistName ?? ""}
        date={
          selectedSession
            ? dayjs(selectedSession.start).format("YYYY-MM-DD")
            : ""
        }
        startTime={
          selectedSession ? dayjs(selectedSession.start).format("HH:mm") : ""
        }
        endTime={
          selectedSession ? dayjs(selectedSession.end).format("HH:mm") : ""
        }
        state={selectedSession?.sessionState ?? "PENDING"}
        availabilityStatus={selectedSession?.availabilityStatus ?? "available"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 16,
    height: "100%",
    width: "100%",
    backgroundColor: colors.surface,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
  },
  emptyIcon: {
    marginBottom: 16,
    color: colors.textSecondary,
    opacity: 0.5,
  },
  pastEventContainer: {
    borderStyle: "dashed",
  },
  pastEventText: {
    color: "#718096",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "#718096",
    fontSize: 10,
  },
  eventTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  pastIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  pastIndicatorText: {
    fontSize: 8,
    color: "#718096",
    marginLeft: 2,
  },
});

export default ScheduleScreen;
