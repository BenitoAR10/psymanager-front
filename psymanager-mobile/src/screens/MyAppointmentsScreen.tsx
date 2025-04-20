"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { View, TouchableOpacity, SectionList } from "react-native";
import {
  Text,
  Card,
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../auth/useAuth";
import { getUserAppointments } from "../services/appointmentService";
import type { UserAppointmentDto } from "../types/appointmentTypes";
import appointmentStyles from "./styles/appointmentStyles";

const MyAppointmentsScreen: React.FC = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<UserAppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;

      try {
        const result = await getUserAppointments(token);
        setAppointments(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // Agrupar citas por fecha
  const groupAppointmentsByDate = () => {
    const grouped: { [key: string]: UserAppointmentDto[] } = {};

    appointments.forEach((appointment) => {
      if (!grouped[appointment.date]) {
        grouped[appointment.date] = [];
      }
      grouped[appointment.date].push(appointment);
    });

    return Object.keys(grouped).map((date) => ({
      title: formatDate(date),
      data: grouped[date],
    }));
  };

  // Formatear fecha para mostrar como "20 Sep, 2024"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("es-ES", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  return (
    <View style={appointmentStyles.container}>
      <View style={appointmentStyles.header}>
        <Text style={appointmentStyles.title}>Citas</Text>
        <TouchableOpacity style={appointmentStyles.filterButton}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color="#424242"
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          animating
          size="large"
          style={appointmentStyles.loader}
        />
      ) : error ? (
        <Text style={appointmentStyles.errorText}>{error}</Text>
      ) : appointments.length === 0 ? (
        <View style={appointmentStyles.emptyContainer}>
          <MaterialCommunityIcons
            name="calendar-blank"
            size={64}
            color="#8C9EFF"
          />
          <Text style={appointmentStyles.emptyText}>
            No tienes citas agendadas
          </Text>
        </View>
      ) : (
        <SectionList
          sections={groupAppointmentsByDate()}
          keyExtractor={(item) => item.sessionId.toString()}
          contentContainerStyle={appointmentStyles.listContainer}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={appointmentStyles.dateHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <Card style={appointmentStyles.card}>
              <Card.Content style={appointmentStyles.cardContent}>
                <View style={appointmentStyles.therapistInfo}>
                  <Avatar.Icon
                    size={40}
                    icon="account"
                    style={appointmentStyles.avatar}
                  />
                  <View>
                    <Text style={appointmentStyles.cardTitle}>
                      Psicól. {item.therapistName}
                    </Text>
                    <Text style={appointmentStyles.cardSubtitle}>
                      Terapeuta
                    </Text>
                  </View>
                </View>

                <Divider style={appointmentStyles.divider} />

                <View style={appointmentStyles.appointmentActions}>
                  <Button
                    mode="outlined"
                    icon={() => (
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={16}
                        color="#8C9EFF"
                        style={{ marginRight: 4 }}
                      />
                    )}
                    style={appointmentStyles.sessionButton}
                    labelStyle={appointmentStyles.sessionButtonLabel}
                    contentStyle={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {item.startTime} - {item.endTime}
                  </Button>

                  <View style={appointmentStyles.contactButtons}>
                    <TouchableOpacity style={appointmentStyles.iconButton}>
                      <MaterialCommunityIcons
                        name="phone"
                        size={20}
                        color="#8C9EFF"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={appointmentStyles.iconButton}>
                      <MaterialCommunityIcons
                        name="message-text"
                        size={20}
                        color="#8C9EFF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

export default MyAppointmentsScreen;
