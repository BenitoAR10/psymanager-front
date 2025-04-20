import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { Calendar, type ICalendarEventBase } from "react-native-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";

import { useAuth } from "../auth/useAuth";
import LoadingOverlay from "../components/LoadingOverlay";
import { getAvailableSchedules } from "../services/scheduleService";
import type { RootStackParamList } from "../navigation/AppNavigator";
import type { ScheduleAvailabilityDto } from "../types/scheduleTypes";
import scheduleStyles from "./styles/scheduleStyles";

dayjs.locale("es");

interface CustomEvent extends ICalendarEventBase {
  scheduleId: number;
  therapistName: string;
  availabilityStatus: "available" | "taken";
  reservedByUserId?: number | null;
  color: string;
}

const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, userInfo } = useAuth();
  const userId = userInfo?.userId;
  const { height } = useWindowDimensions();

  const [weekStart, setWeekStart] = useState(
    dayjs().startOf("week").add(1, "day").toDate()
  );
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      const startDate = dayjs(weekStart).format("YYYY-MM-DD");
      const endDate = dayjs(weekStart).add(6, "day").format("YYYY-MM-DD");

      const result: ScheduleAvailabilityDto[] = await getAvailableSchedules({
        token,
        startDate,
        endDate,
      });

      const mapped: CustomEvent[] = result.map((item) => ({
        scheduleId: item.scheduleId,
        title: item.therapistName,
        start: dayjs(`${item.date}T${item.startTime}`).toDate(),
        end: dayjs(`${item.date}T${item.endTime}`).toDate(),
        availabilityStatus: item.availabilityStatus,
        reservedByUserId: item.reservedByUserId,
        therapistName: item.therapistName,
        color:
          item.availabilityStatus === "available"
            ? "#9AE6B4"
            : item.reservedByUserId === userId
            ? "#8C9EFF"
            : "#FEB2B2",
      }));

      setEvents(mapped);
    } catch (error) {
      console.error("Error al cargar horarios semanales:", error);
    } finally {
      setLoading(false);
    }
  }, [token, userId, weekStart]);

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, [fetchSchedules])
  );

  const handleWeekChange = (direction: "prev" | "next") => {
    const newStart =
      direction === "prev"
        ? dayjs(weekStart).subtract(7, "day").toDate()
        : dayjs(weekStart).add(7, "day").toDate();
    setWeekStart(newStart);
  };

  return (
    <>
      <View style={scheduleStyles.container}>
        <View style={styles.weekHeader}>
          <TouchableOpacity onPress={() => handleWeekChange("prev")}>
            <Text style={styles.navText}>← Anterior</Text>
          </TouchableOpacity>
          <Text style={styles.weekText}>
            Semana del {dayjs(weekStart).format("D [de] MMMM")}
          </Text>
          <TouchableOpacity onPress={() => handleWeekChange("next")}>
            <Text style={styles.navText}>Siguiente →</Text>
          </TouchableOpacity>
        </View>

        <Calendar
          height={height - 130}
          mode="week"
          weekStartsOn={1}
          swipeEnabled
          showTime
          locale="es"
          date={weekStart}
          events={events}
          onChangeDate={(dates) => {
            const first = dates[0];
            if (first && dayjs(first).isSame(weekStart, "day") === false) {
              setWeekStart(new Date(first));
            }
          }}
          onPressEvent={(event) => {
            if (
              event.availabilityStatus === "available" ||
              event.reservedByUserId === userId
            ) {
              navigation.navigate("ScheduleDetail", {
                scheduleId: event.scheduleId,
                therapistName: event.therapistName,
                startTime: dayjs(event.start).format("HH:mm"),
                endTime: dayjs(event.end).format("HH:mm"),
                date: dayjs(event.start).format("YYYY-MM-DD"),
              });
            }
          }}
          eventCellStyle={(event) => ({
            backgroundColor: event.color,
            borderRadius: 6,
          })}
        />
      </View>

      <LoadingOverlay visible={loading} />
    </>
  );
};

const styles = StyleSheet.create({
  weekHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  navText: {
    color: "#8C9EFF",
    fontSize: 14,
    fontWeight: "600",
  },
  weekText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
});

export default ScheduleScreen;
