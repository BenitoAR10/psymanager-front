"use client";

import type React from "react";
import { useState, useCallback, useRef } from "react";
import {
  View,
  TouchableOpacity,
  RefreshControl,
  Animated,
  SafeAreaView,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../auth/useAuth";
import { getUserAppointments } from "../../services/appointmentService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MotiView, MotiText } from "moti";
import type { UserAppointmentDto } from "../../types/appointmentTypes";
import appointmentStyles from "../../screens/styles/appointmentStyles";
import { theme } from "../../screens/styles/themeConstants";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import dayjs from "dayjs";
import { getAppointmentVisualState } from "../../utils/appointmentStatus";
import "dayjs/locale/es";

// Configurar dayjs para español
dayjs.locale("es");

const { colors, animations } = theme;

const MyAppointmentsScreen: React.FC = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<UserAppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPastSectionExpanded, setIsPastSectionExpanded] = useState(false); // Estado para acordeón de sección
  const scrollY = useRef(new Animated.Value(0)).current;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isPastAppointment = (appointment: UserAppointmentDto) => {
    const appointmentEnd = dayjs(`${appointment.date}T${appointment.endTime}`);
    return appointmentEnd.isBefore(dayjs());
  };

  // Función para alternar la expansión de la sección de citas pasadas
  const togglePastSection = () => {
    setIsPastSectionExpanded(!isPastSectionExpanded);
  };

  const fetchAppointments = useCallback(
    async (showLoader = true) => {
      if (!token) return;

      if (showLoader) setLoading(true);

      try {
        const result = await getUserAppointments();
        setAppointments(result);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching appointments:", err);
        setError(err.message || "No se pudieron cargar tus citas");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments(false);
  }, [fetchAppointments]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const groupAppointmentsByDate = () => {
    const grouped: { [key: string]: UserAppointmentDto[] } = {};
    const now = dayjs();

    // Primero agrupamos por fecha
    appointments.forEach((appointment) => {
      if (!grouped[appointment.date]) {
        grouped[appointment.date] = [];
      }
      grouped[appointment.date].push(appointment);
    });

    // Luego separamos en próximas y pasadas
    const upcoming: {
      title: string;
      date: string;
      data: UserAppointmentDto[];
    }[] = [];
    const past: { title: string; date: string; data: UserAppointmentDto[] }[] =
      [];

    Object.keys(grouped).forEach((date) => {
      const dateObj = dayjs(date);
      const section = {
        title: formatDate(date),
        date: date, // Guardamos la fecha original para ordenar
        data: grouped[date].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        ),
      };

      if (dateObj.isAfter(now, "day") || dateObj.isSame(now, "day")) {
        upcoming.push(section);
      } else {
        past.push(section);
      }
    });

    // Ordenamos las secciones
    upcoming.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
    past.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

    // Combinamos con las etiquetas adecuadas
    const result = [];

    if (upcoming.length > 0) {
      result.push({
        title: "Próximas citas",
        data: [],
        isHeader: true,
        isPastSection: false,
      });
      result.push(
        ...upcoming.map((section) => ({ ...section, isPastSection: false }))
      );
    }

    if (past.length > 0) {
      result.push({
        title: "Citas pasadas",
        data: [],
        isHeader: true,
        isPastSection: true,
        pastCount: past.reduce(
          (total, section) => total + section.data.length,
          0
        ), // Contar total de citas pasadas
      });

      // Solo incluir las secciones de citas pasadas si están expandidas
      if (isPastSectionExpanded) {
        result.push(
          ...past.map((section) => ({ ...section, isPastSection: true }))
        );
      }
    }

    return result;
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("dddd, D [de] MMMM");
  };

  const formatTime = (time: string) => {
    // Convertir formato 24h a 12h
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const renderAppointmentStatus = (appointment: UserAppointmentDto) => {
    const { text, color, bgColor } = getAppointmentVisualState(
      appointment.sessionState,
      appointment.date,
      appointment.endTime
    );

    return (
      <View
        style={[
          appointmentStyles.statusContainer,
          { backgroundColor: bgColor },
        ]}
      >
        <Text style={[appointmentStyles.statusText, { color }]}>{text}</Text>
      </View>
    );
  };

  const navigateToSchedule = () => {
    navigation.navigate("Schedule");
  };

  const renderEmptyState = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 500 }}
      style={appointmentStyles.emptyContainer}
    >
      <MaterialCommunityIcons
        name="calendar-blank"
        size={70}
        color={colors.primary.main}
        style={appointmentStyles.emptyIcon}
      />
      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 200, duration: 300 }}
        style={appointmentStyles.emptyText}
      >
        No tienes citas agendadas
      </MotiText>
      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 300, duration: 300 }}
        style={appointmentStyles.emptyDescription}
      >
        Agenda una cita con un terapeuta para comenzar tu proceso de atención
      </MotiText>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 400, duration: 300 }}
      >
        <TouchableOpacity
          style={appointmentStyles.scheduleButton}
          onPress={navigateToSchedule}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="calendar-plus"
            size={20}
            color={colors.primary.contrastText}
          />
          <Text style={appointmentStyles.scheduleButtonText}>Agendar cita</Text>
        </TouchableOpacity>
      </MotiView>
    </MotiView>
  );

  const renderErrorState = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 500 }}
      style={appointmentStyles.errorContainer}
    >
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={70}
        color={colors.error.main}
        style={appointmentStyles.errorIcon}
      />
      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 200, duration: 300 }}
        style={appointmentStyles.errorText}
      >
        No pudimos cargar tus citas
      </MotiText>
      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 300, duration: 300 }}
        style={appointmentStyles.errorDescription}
      >
        {error ||
          "Ocurrió un error al cargar tus citas. Por favor intenta nuevamente."}
      </MotiText>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 400, duration: 300 }}
      >
        <TouchableOpacity
          style={appointmentStyles.retryButton}
          onPress={() => fetchAppointments()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={20}
            color={colors.primary.contrastText}
          />
          <Text style={appointmentStyles.retryButtonText}>
            Intentar nuevamente
          </Text>
        </TouchableOpacity>
      </MotiView>
    </MotiView>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={appointmentStyles.container}>
        <View style={appointmentStyles.loader}>
          <ActivityIndicator
            animating
            size="large"
            color={colors.primary.main}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={appointmentStyles.container}>
      {error ? (
        renderErrorState()
      ) : appointments.length === 0 ? (
        renderEmptyState()
      ) : (
        <Animated.SectionList
          sections={groupAppointmentsByDate()}
          keyExtractor={(item, index) =>
            item.sessionId ? item.sessionId.toString() : `header-${index}`
          }
          contentContainerStyle={appointmentStyles.listContainer}
          stickySectionHeadersEnabled={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary.main]}
              tintColor={colors.primary.main}
            />
          }
          renderSectionHeader={({ section }) => {
            if ("isHeader" in section && section.isHeader) {
              const isPastHeader = section.isPastSection;
              const pastCount = section.pastCount || 0;

              return (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "timing", duration: 500 }}
                >
                  {isPastHeader ? (
                    <TouchableOpacity
                      style={appointmentStyles.pastSectionHeader}
                      onPress={togglePastSection}
                      activeOpacity={0.7}
                    >
                      <View style={appointmentStyles.pastSectionHeaderContent}>
                        <Text style={appointmentStyles.sectionHeader}>
                          {section.title}
                        </Text>
                        <View style={appointmentStyles.pastSectionInfo}>
                          <Text style={appointmentStyles.pastCount}>
                            {pastCount} {pastCount === 1 ? "cita" : "citas"}
                          </Text>
                          <MaterialCommunityIcons
                            name={
                              isPastSectionExpanded
                                ? "chevron-up"
                                : "chevron-down"
                            }
                            size={24}
                            color={colors.text.secondary}
                            style={appointmentStyles.chevronIcon}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Text style={appointmentStyles.sectionHeader}>
                      {section.title}
                    </Text>
                  )}
                </MotiView>
              );
            }

            return (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 500 }}
                style={appointmentStyles.dateHeader}
              >
                <View style={appointmentStyles.dateIcon}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={18}
                    color={colors.primary.main}
                  />
                </View>
                <Text style={appointmentStyles.dateText}>{section.title}</Text>
              </MotiView>
            );
          }}
          renderItem={({ item, index }) => {
            const isPast = isPastAppointment(item);

            return (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  delay: index * 80,
                  type: "timing",
                  duration: 400,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    // Solo navegar para citas futuras
                    if (!isPast) {
                      navigation.navigate("AppointmentDetail", {
                        sessionId: item.sessionId,
                      });
                    }
                  }}
                >
                  <View
                    style={[
                      appointmentStyles.card,
                      isPast && appointmentStyles.pastCard,
                    ]}
                  >
                    <View style={appointmentStyles.cardContent}>
                      <View style={appointmentStyles.therapistInfo}>
                        <View style={appointmentStyles.avatar}>
                          <Text
                            style={{
                              color: colors.primary.main,
                              fontWeight: "600",
                            }}
                          >
                            {item.therapistName.charAt(0)}
                          </Text>
                        </View>
                        <View style={appointmentStyles.therapistTextContainer}>
                          <Text style={appointmentStyles.cardTitle}>
                            Psicól.{" "}
                            {(() => {
                              const parts = item.therapistName
                                .trim()
                                .split(" ");
                              const firstName =
                                parts[0]?.charAt(0).toUpperCase() +
                                parts[0]?.slice(1).toLowerCase();
                              const firstSurnameInitial = parts[2]
                                ?.charAt(0)
                                .toUpperCase();
                              return firstSurnameInitial
                                ? `${firstName} ${firstSurnameInitial}.`
                                : firstName;
                            })()}
                          </Text>
                          <Text style={appointmentStyles.cardSubtitle}>
                            Terapeuta
                          </Text>
                        </View>

                        {renderAppointmentStatus(item)}
                      </View>

                      <View style={appointmentStyles.appointmentDetails}>
                        <View style={appointmentStyles.detailItem}>
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={16}
                            color={colors.text.secondary}
                            style={appointmentStyles.detailIcon}
                          />
                          <Text style={appointmentStyles.detailText}>
                            {formatTime(item.startTime)} -{" "}
                            {formatTime(item.endTime)}
                          </Text>
                        </View>
                      </View>

                      {/* Solo mostrar acciones para citas futuras */}
                      {!isPast && (
                        <>
                          <View style={appointmentStyles.divider} />
                          <View style={appointmentStyles.appointmentActions}>
                            <TouchableOpacity
                              style={[
                                appointmentStyles.sessionButton,
                                {
                                  backgroundColor: colors.background.paper,
                                  borderWidth: 1,
                                  borderColor: colors.secondary.main,
                                  borderRadius: 12,
                                  paddingHorizontal: 16,
                                  paddingVertical: 8,
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                },
                              ]}
                              onPress={() =>
                                navigation.navigate("AppointmentDetail", {
                                  sessionId: item.sessionId,
                                })
                              }
                            >
                              <MaterialCommunityIcons
                                name="calendar-clock"
                                size={16}
                                color={colors.secondary.main}
                                style={{ marginRight: 6 }}
                              />
                              <Text
                                style={{
                                  color: colors.secondary.main,
                                  fontSize: 13,
                                  fontWeight: "600",
                                }}
                              >
                                Ver detalles
                              </Text>
                            </TouchableOpacity>

                            <View style={appointmentStyles.contactButtons}>
                              <TouchableOpacity
                                style={appointmentStyles.iconButton}
                                activeOpacity={0.7}
                              >
                                <MaterialCommunityIcons
                                  name="phone"
                                  size={18}
                                  color={colors.secondary.main}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={appointmentStyles.iconButton}
                                activeOpacity={0.7}
                              >
                                <MaterialCommunityIcons
                                  name="message-text-outline"
                                  size={18}
                                  color={colors.secondary.main}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </MotiView>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default MyAppointmentsScreen;
