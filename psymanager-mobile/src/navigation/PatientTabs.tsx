// src/navigation/PatientTabs.tsx
"use client";

import React from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { useAuth } from "../auth/useAuth";
import { useActiveTreatmentPlan } from "../hooks/useActiveTreatmentPlan";
import { useTreatmentStatus } from "../hooks/useTreatmentStatus";

import ScheduleScreen from "../screens/schedule/ScheduleContainer";
import MyAppointmentsScreen from "../screens/appointments/MyAppointmentsScreen";
import CustomHeader from "../components/common/CustomHeader";
import ProfileScreen from "../screens/profile/ProfileScreen";
import CalmNowContainer from "../screens/calm/CalmNowContainer";

interface PatientTabsProps {
  isConnected: boolean;
}

const colors = {
  primary: "#4DB6AC",
  textSecondary: "#6B7A99",
  surface: "#FFFFFF",
  border: "#E3E8EF",
  activeBackground: "#4DB6AC15", // 15% opacity
};

const Tab = createBottomTabNavigator();

const PatientTabs: React.FC<PatientTabsProps> = ({ isConnected }) => {
  const { userInfo } = useAuth();
  const patientId = userInfo?.userId;

  const { data: treatmentStatus, isLoading: loadingTreatmentStatus } =
    useTreatmentStatus();
  const hasActiveTreatment = treatmentStatus?.hasTreatment ?? false;

  if (loadingTreatmentStatus) return null;

  const handleNoConnection = () => {
    Alert.alert("Sin conexión", "Esta sección requiere conexión a Internet.");
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        header: () => {
          switch (route.name) {
            case "Schedule":
              return <CustomHeader currentRoute="Schedule" />;
            case "CalmNow":
              return <CustomHeader currentRoute="CalmNow" />;
            case "Appointments":
              return <CustomHeader currentRoute="Appointments" />;
            case "Profile":
              return <CustomHeader currentRoute="Profile" />;
            default:
              return null;
          }
        },
        tabBarLabel: ({ color, focused }) => {
          let label = "";
          switch (route.name) {
            case "Schedule":
              label = "Calendario";
              break;
            case "CalmNow":
              label = "Calma Ahora";
              break;
            case "Appointments":
              label = "Citas";
              break;
            case "Profile":
              label = "Mi Perfil";
              break;
          }
          return (
            <Text
              style={[
                styles.tabLabel,
                {
                  color,
                  fontWeight: focused ? "600" : "500",
                  opacity: focused ? 1 : 0.8,
                },
              ]}
            >
              {label}
            </Text>
          );
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap =
            "calendar";
          switch (route.name) {
            case "Schedule":
              iconName = "calendar";
              break;
            case "CalmNow":
              iconName = "meditation";
              break;
            case "Appointments":
              iconName = "message-text";
              break;
            case "Profile":
              iconName = "account";
              break;
          }
          return (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <View
                style={[
                  styles.iconWrapper,
                  focused && styles.activeIconWrapper,
                ]}
              >
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={color}
                />
              </View>
            </View>
          );
        },
      })}
    >
      {isConnected ? (
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
      ) : (
        <Tab.Screen
          name="Schedule"
          component={View}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleNoConnection();
            },
          }}
        />
      )}

      {hasActiveTreatment && (
        <Tab.Screen name="CalmNow" component={CalmNowContainer} />
      )}

      {isConnected ? (
        <Tab.Screen
          name="Appointments"
          component={MyAppointmentsScreen}
          options={{ tabBarBadgeStyle: styles.badge }}
        />
      ) : (
        <Tab.Screen
          name="Appointments"
          component={View}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleNoConnection();
            },
          }}
          options={{ tabBarBadgeStyle: styles.badge }}
        />
      )}

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: colors.border + "60",
    height: Platform.OS === "ios" ? 84 : 64,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabBarItem: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 32,
    width: 32,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  activeIconWrapper: {
    backgroundColor: colors.activeBackground,
  },
  activeIndicator: {
    position: "absolute",
    top: -2,
    width: 20,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
  badge: {
    backgroundColor: colors.primary,
    fontSize: 10,
    fontWeight: "600",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    top: 4,
    right: -6,
  },
});

export default PatientTabs;
