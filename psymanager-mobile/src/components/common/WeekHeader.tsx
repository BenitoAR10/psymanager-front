// WeekHeader.tsx
"use client";

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import dayjs from "dayjs";
import { MotiView } from "moti";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface WeekHeaderProps {
  weekStart: Date;
  onPrev: () => void;
  onNext: () => void;
}

const WeekHeader: React.FC<WeekHeaderProps> = ({
  weekStart,
  onPrev,
  onNext,
}) => {
  // Generar los días de la semana (lunes a sábado)
  const weekDays = Array.from({ length: 6 }, (_, i) => {
    return dayjs(weekStart).add(i, "day");
  });

  // Obtener el día actual
  const today = dayjs();

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <Text style={styles.monthYear}>
          {dayjs(weekStart).format("MMMM YYYY")}
        </Text>
      </View>

      <View style={styles.daysContainer}>
        {weekDays.map((day, index) => {
          const isToday =
            day.format("YYYY-MM-DD") === today.format("YYYY-MM-DD");

          return (
            <View
              key={index}
              style={[styles.dayColumn, index === 0 && styles.firstDayColumn]}
            >
              <Text style={styles.dayName}>
                {day.format("ddd").charAt(0).toUpperCase() +
                  day.format("ddd").slice(1, 3)}
              </Text>
              <View style={[styles.dayCircle, isToday && styles.todayCircle]}>
                <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                  {day.format("D")}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onPrev}
          accessibilityLabel="Semana anterior"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color="#4DB6AC"
          />
          <Text style={styles.navText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={onNext}
          accessibilityLabel="Semana siguiente"
        >
          <Text style={styles.navText}>Siguiente</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#4DB6AC"
          />
        </TouchableOpacity>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E3E8EF",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A3548",
    textTransform: "capitalize",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayColumn: {
    alignItems: "center",
    flex: 1,
  },
  dayName: {
    fontSize: 12,
    color: "#6B7A99",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCircle: {
    backgroundColor: "#4DB6AC",
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2A3548",
  },
  todayText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  firstDayColumn: {
    marginLeft: 0,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  navText: {
    fontSize: 14,
    color: "#4DB6AC",
    fontWeight: "500",
  },
});

export default WeekHeader;
