import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";

interface CustomHeaderProps {
  currentRoute:
    | "Schedule"
    | "ScheduleWeekly"
    | "Appointments"
    | "CalmNow"
    | "Profile"
    | "ScheduleDetail";
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ currentRoute }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const toggleRoute =
    currentRoute === "Schedule" ? "ScheduleWeekly" : "Schedule";
  const toggleIcon = currentRoute === "Schedule" ? "calendar-week" : "calendar";

  const getTitle = (route: string) => {
    switch (route) {
      case "Schedule":
      case "ScheduleWeekly":
        return "Calendario de disponibilidad";
      case "Appointments":
        return "Citas";
      case "CalmNow":
        return "Calma Ahora";
      case "Profile":
        return "Mi Perfil";
      case "ScheduleDetail":
        return "Detalles del Horario";
      default:
        return "Pantalla";
    }
  };

  const handleToggle = () => {
    if (currentRoute === "Schedule") {
      navigation.navigate("ScheduleWeekly");
    } else if (currentRoute === "ScheduleWeekly") {
      navigation.navigate("MainTabs", {
        screen: "Schedule",
      });
    }
  };

  const showToggleIcon =
    currentRoute === "Schedule" || currentRoute === "ScheduleWeekly";

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer} />
      <Text style={styles.title}>{getTitle(currentRoute)}</Text>
      <View style={styles.rightContainer}>
        {showToggleIcon && (
          <TouchableOpacity style={styles.rightButton} onPress={handleToggle}>
            <MaterialCommunityIcons
              name={toggleIcon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={24}
              color="#8C9EFF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  rightButton: {
    padding: 8,
    marginRight: -8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
});

export default CustomHeader;
