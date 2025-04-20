"use client";

import type React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

import ScheduleScreen from "../screens/ScheduleScreen";
import MyAppointmentsScreen from "../screens/MyAppointmentsScreen";
import CustomHeader from "../components/CustomHeader";

// Pantallas no implementadas aún
const CalmNowScreen = () => <Text>Calma Ahora</Text>;
const ProfileScreen = () => <Text>Mi Perfil</Text>;

const Tab = createBottomTabNavigator();

const PatientTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#8C9EFF",
        tabBarInactiveTintColor: "#9E9E9E",
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
        tabBarLabel: ({ color }) => {
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
            <Text style={{ color, fontSize: 12, marginTop: 2 }}>{label}</Text>
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
            <View style={focused ? styles.activeIconContainer : undefined}>
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="CalmNow" component={CalmNowScreen} />
      <Tab.Screen name="Appointments" component={MyAppointmentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
  activeIconContainer: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    padding: 8,
    marginBottom: 2,
  },
});

export default PatientTabs;
