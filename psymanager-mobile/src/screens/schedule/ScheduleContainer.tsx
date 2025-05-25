import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useNavigation } from "@react-navigation/native";
import {
  useWindowDimensions,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useTreatmentScheduleSessions } from "../../hooks/useTreatmentScheduleSessions";
import { useTreatmentStatus } from "../../hooks/useTreatmentStatus";

import { useAvailableSchedules } from "../../hooks/useAvailableSchedules";
import { getAvailableSchedules } from "../../services/scheduleService";
import { useAuth } from "../../auth/useAuth";
import type { NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import type { SessionState } from "../../types/sessionTypes";
import ScheduleView from "../../components/schedule/ScheduleView";

dayjs.locale("es");
dayjs.extend(isoWeek);

export interface CustomEvent {
  scheduleId: number;
  title: string;
  start: Date;
  end: Date;
  therapistName: string;
  availabilityStatus: "available" | "taken" | "treatment-assigned";
  reservedByUserId?: number | null;
  sessionState?: SessionState;
  color: string;
  isPast?: boolean;
}

const colors = {
  available: "#9AE6B4",
  reserved: "#8C9EFF",
  taken: "#FEB2B2",
  pastEvent: "#E2E8F0",
};

// Formatea nombres como "Carlos A."
const formatTherapistName = (name: string) => {
  const parts = name.trim().split(" ");
  const firstName =
    parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1).toLowerCase();
  const initial = parts[2]?.charAt(0).toUpperCase();
  return initial ? `${firstName} ${initial}.` : firstName;
};

// Transforma sesiones en eventos
const mapToCustomEvents = (
  items: any[],
  type: "treatment" | "available",
  userId?: number
): CustomEvent[] => {
  const now = dayjs();

  return items.map((item) => {
    const start = dayjs(`${item.date}T${item.startTime}`).toDate();
    const end = dayjs(`${item.date}T${item.endTime}`).toDate();
    const isPast = dayjs(end).isBefore(now);

    let color = colors.taken;
    let availabilityStatus: CustomEvent["availabilityStatus"] = "taken";

    if (type === "treatment") {
      color = isPast ? colors.pastEvent : colors.reserved;
      availabilityStatus = "treatment-assigned";
    } else {
      if (isPast) color = colors.pastEvent;
      else if (item.sessionState === "CANCELED") color = "#FFCDD2";
      else if (item.sessionState === "REJECTED") color = "#FFE082";
      else if (item.sessionState === "COMPLETED") color = "#C5E1A5";
      else if (item.availabilityStatus === "available")
        color = colors.available;
      else if (item.reservedByUserId === userId) color = colors.reserved;

      availabilityStatus =
        item.availabilityStatus === "available" ||
        item.availabilityStatus === "taken"
          ? item.availabilityStatus
          : "taken";
    }

    return {
      scheduleId: item.scheduleId,
      title: formatTherapistName(item.therapistName),
      start,
      end,
      availabilityStatus,
      reservedByUserId: item.reservedByUserId,
      sessionState: item.sessionState,
      therapistName: item.therapistName,
      color,
      isPast,
    };
  });
};

const ScheduleContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, userInfo } = useAuth();
  const userId = userInfo?.userId;
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const isMounted = useRef(true);

  const [weekStart, setWeekStart] = useState(
    dayjs().startOf("isoWeek").toDate()
  );

  const { data: treatmentStatus, isLoading: loadingTreatmentStatus } =
    useTreatmentStatus();
  const hasTreatmentActive = treatmentStatus?.hasTreatment ?? false;

  const { sessions: treatmentSessions, isLoading: loadingTreatmentSessions } =
    useTreatmentScheduleSessions({
      enabled: hasTreatmentActive,
    });

  const shouldFetchAvailableSchedules: boolean =
    Boolean(token) && !loadingTreatmentStatus && hasTreatmentActive === false;

  const { data: availableSchedules, isLoading: loadingAvailable } =
    useAvailableSchedules(weekStart, shouldFetchAvailableSchedules);

  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CustomEvent | null>(
    null
  );

  const calendarHeight = height - 180;

  const showNotification = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Información", message);
    }
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const now = dayjs();
    let mappedEvents: CustomEvent[] = [];

    if (
      !loadingTreatmentStatus &&
      hasTreatmentActive &&
      treatmentSessions.length > 0
    ) {
      mappedEvents = mapToCustomEvents(treatmentSessions, "treatment", userId);
    } else if (!hasTreatmentActive && availableSchedules) {
      mappedEvents = mapToCustomEvents(availableSchedules, "available", userId);
    } else {
      return;
    }

    const isSame =
      events.length === mappedEvents.length &&
      events.every((e, i) => e.scheduleId === mappedEvents[i].scheduleId);

    if (!isSame) {
      setEvents(mappedEvents);
      setShowEmptyState(mappedEvents.length === 0);
      setCalendarKey((prev) => prev + 1);
    }

    if (!initialLoadComplete) {
      setInitialLoadComplete(true);
    }
  }, [
    treatmentSessions,
    availableSchedules,
    hasTreatmentActive,
    loadingTreatmentStatus,
    userId,
  ]);

  useEffect(() => {
    if (!token) return;
    const preloadStart = dayjs(weekStart).add(7, "day").format("YYYY-MM-DD");
    const preloadEnd = dayjs(weekStart).add(13, "day").format("YYYY-MM-DD");

    queryClient.prefetchQuery({
      queryKey: ["available-schedules", preloadStart, preloadEnd],
      queryFn: () =>
        getAvailableSchedules({
          startDate: preloadStart,
          endDate: preloadEnd,
        }),
    });
  }, [weekStart, token]);

  const handleWeekChange = (direction: "prev" | "next") => {
    const newStart = dayjs(weekStart)
      .add(direction === "prev" ? -7 : 7, "day")
      .toDate();
    setWeekStart(newStart);
  };

  const handlePressEvent = (event: CustomEvent) => {
    if (event.isPast)
      return showNotification("Este horario ya ha pasado y no está disponible");

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

  return (
    <ScheduleView
      weekStart={weekStart}
      onChangeWeek={handleWeekChange}
      events={events}
      calendarKey={calendarKey}
      calendarHeight={calendarHeight}
      loading={
        loadingTreatmentStatus ||
        ((hasTreatmentActive ? loadingTreatmentSessions : loadingAvailable) &&
          !initialLoadComplete)
      }
      showEmptyState={showEmptyState}
      onPressEvent={handlePressEvent}
      modalVisible={modalVisible}
      selectedSession={selectedSession}
      onCloseModal={() => setModalVisible(false)}
      hasTreatmentActive={hasTreatmentActive}
    />
  );
};

export default ScheduleContainer;
