import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-big-calendar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import WeekHeader from "../common/WeekHeader";
import Legend from "../common/Legend";
import ReservedSessionModal from "../modals/ReservedSessionModal";
import type { CustomEvent } from "../../screens/schedule/ScheduleContainer";
import TreatmentBanner from "../common/TreatmentBanner";

interface Props {
  weekStart: Date;
  onChangeWeek: (direction: "prev" | "next") => void;
  events: CustomEvent[];
  calendarKey: number;
  calendarHeight: number;
  loading: boolean;
  showEmptyState: boolean;
  onPressEvent: (event: CustomEvent) => void;
  modalVisible: boolean;
  selectedSession: CustomEvent | null;
  onCloseModal: () => void;
  hasTreatmentActive: boolean;
}

const colors = {
  primary: "#4DB6AC",
  textPrimary: "#2A3548",
  textSecondary: "#6B7A99",
  surface: "#FFFFFF",
};

const ScheduleView: React.FC<Props> = ({
  weekStart,
  onChangeWeek,
  events,
  calendarKey,
  calendarHeight,
  loading,
  showEmptyState,
  onPressEvent,
  modalVisible,
  selectedSession,
  onCloseModal,
  hasTreatmentActive,
}) => {
  const renderEvent = (event: CustomEvent, touchableOpacityProps: any) => {
    const { key, ...otherProps } = touchableOpacityProps;
    return (
      <TouchableOpacity
        key={key}
        {...otherProps}
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

  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, { height: calendarHeight }]}>
      <MaterialCommunityIcons
        name="calendar-blank"
        size={60}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>No hay horarios disponibles</Text>
      <Text style={[styles.emptyText, { fontSize: 14, marginTop: 8 }]}>
        Intenta seleccionar otra semana
      </Text>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <MotiView
          style={[styles.skeletonContainer, { height: calendarHeight }]}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 400 }}
        >
          <Skeleton
            height={calendarHeight - 32}
            width="100%"
            radius={16}
            colorMode="light"
          />
        </MotiView>
      );
    }

    if (showEmptyState) return renderEmptyState();

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Calendar
          key={`calendar-${calendarKey}`}
          height={calendarHeight}
          mode="custom"
          weekStartsOn={1}
          weekEndsOn={6}
          swipeEnabled={true}
          showTime
          locale="es"
          date={weekStart}
          events={events}
          minHour={8}
          maxHour={18}
          scrollOffsetMinutes={0}
          renderHeader={() => null}
          headerContainerAccessibilityProps={{ accessibilityRole: "header" }}
          dayHeaderHighlightColor={colors.primary + "30"}
          hourStyle={{ fontSize: 12, paddingHorizontal: 4 }}
          eventCellStyle={(event: CustomEvent) => ({
            backgroundColor: event.color,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: event.isPast
              ? "rgba(203, 213, 224, 0.5)"
              : "rgba(0,0,0,0.1)",
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
            if (!dates || dates.length === 2) return;

            const firstDate = dayjs(dates[0]);
            const currentWeek = dayjs(weekStart);

            if (firstDate.isBefore(currentWeek, "week")) {
              onChangeWeek("prev");
            } else if (firstDate.isAfter(currentWeek, "week")) {
              onChangeWeek("next");
            }
          }}
          onPressEvent={onPressEvent}
        />
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <WeekHeader
        weekStart={weekStart}
        onPrev={() => onChangeWeek("prev")}
        onNext={() => onChangeWeek("next")}
      />
      {hasTreatmentActive ? <TreatmentBanner /> : <Legend />}
      {renderContent()}

      <ReservedSessionModal
        visible={modalVisible}
        onClose={onCloseModal}
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

export default ScheduleView;
