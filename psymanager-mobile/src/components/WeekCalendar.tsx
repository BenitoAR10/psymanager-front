"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/es";
import { MaterialCommunityIcons } from "@expo/vector-icons";

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.locale("es");

interface WeekCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const [baseDate, setBaseDate] = useState(dayjs(selectedDate || dayjs()));

  useEffect(() => {
    // Sincroniza baseDate cuando selectedDate cambia desde fuera
    setBaseDate(dayjs(selectedDate));
  }, [selectedDate]);

  const getWeekDays = () => {
    const startOfWeek = baseDate.startOf("isoWeek");
    return Array.from({ length: 7 }, (_, i) =>
      startOfWeek.add(i, "day").format("YYYY-MM-DD")
    );
  };

  const weekDays = getWeekDays();

  const handlePrevWeek = () => {
    const newBase = baseDate.subtract(1, "week");
    setBaseDate(newBase);
    onSelectDate(newBase.startOf("isoWeek").format("YYYY-MM-DD"));
  };

  const handleNextWeek = () => {
    const newBase = baseDate.add(1, "week");
    setBaseDate(newBase);
    onSelectDate(newBase.startOf("isoWeek").format("YYYY-MM-DD"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <TouchableOpacity onPress={handlePrevWeek} style={styles.arrowButton}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color="#8C9EFF"
          />
        </TouchableOpacity>

        <View style={styles.daysContainer}>
          {weekDays.map((date) => {
            const dayNum = dayjs(date).format("D");
            const dayName = dayjs(date).format("dd");
            const isSelected = selectedDate === date;

            return (
              <TouchableOpacity
                key={date}
                onPress={() => onSelectDate(date)}
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDayButton,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.selectedDayText,
                  ]}
                >
                  {dayNum}
                </Text>
                <Text
                  style={[styles.dayName, isSelected && styles.selectedDayText]}
                >
                  {dayName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#8C9EFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  daysContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  dayButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 12,
    marginHorizontal: 4,
    width: 36,
    height: 60,
  },
  selectedDayButton: {
    backgroundColor: "#8C9EFF",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#424242",
  },
  dayName: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  arrowButton: {
    padding: 8,
  },
});

export default WeekCalendar;
