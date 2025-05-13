"use client";

import type React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { MotiView } from "moti";
import { useAuth } from "../auth/useAuth";
import { useActiveTreatmentPlan } from "../services/hooks/useActiveTreatmentPlan";

import ScheduleScreen from "../screens/ScheduleScreen";
import MyAppointmentsScreen from "../screens/MyAppointmentsScreen";
import CustomHeader from "../components/CustomHeader";
import ProfileScreen from "../screens/ProfileScreen";

// Colores consistentes con tu tema
const colors = {
  primary: "#4DB6AC",
  primaryLight: "#80CBC4",
  primaryDark: "#00897B",
  secondary: "#64B5F6",
  textPrimary: "#2A3548",
  textSecondary: "#6B7A99",
  background: "#F5F7FA",
  surface: "#FFFFFF",
  border: "#E3E8EF",
};

// Pantallas no implementadas aún
const CalmNowScreen = () => <Text>Calma Ahora</Text>;

const Tab = createBottomTabNavigator();

const PatientTabs: React.FC = () => {
  const { userInfo } = useAuth();
  const patientId = userInfo?.userId;

  const { data: activeTreatment } = useActiveTreatmentPlan(patientId);
  const hasActiveTreatment = !!activeTreatment;

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
            case "Appointments":
              return <CustomHeader currentRoute="Appointments" />;
            case "CalmNow":
              return <CustomHeader currentRoute="CalmNow" />;
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
          return label ? (
            <Text
              style={{
                color,
                fontSize: 12,
                fontWeight: focused ? "600" : "400",
                marginTop: 2,
                opacity: focused ? 1 : 0.8,
              }}
            >
              {label}
            </Text>
          ) : null;
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

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
            default:
              iconName = "calendar";
          }

          return (
            <View style={styles.iconOuterContainer}>
              {focused ? (
                <MotiView
                  from={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "timing", duration: 300 }}
                  style={[styles.activeIconContainer]}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={size}
                    color={color}
                  />
                </MotiView>
              ) : (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarBadge: undefined,
        }}
      />
      {hasActiveTreatment && (
        <Tab.Screen name="CalmNow" component={CalmNowScreen} />
      )}
      <Tab.Screen
        name="Appointments"
        component={MyAppointmentsScreen}
        options={{
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 64,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
  iconOuterContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    width: 28,
  },
  activeIconContainer: {
    backgroundColor: `${colors.primaryLight}30`,
    borderRadius: 14,
    padding: 6,
    height: 28,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
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
