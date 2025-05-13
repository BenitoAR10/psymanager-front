import type React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { theme } from "../screens/styles/themeConstants";

const { colors, typography, spacing, shadows } = theme;

interface CustomHeaderProps {
  currentRoute:
    | "Schedule"
    | "ScheduleWeekly"
    | "Appointments"
    | "CalmNow"
    | "Profile"
    | "ScheduleDetail"
    | "AccountSettings";
  rightComponent?: React.ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  currentRoute,
  rightComponent,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isDetail = currentRoute === "ScheduleDetail";

  const getTitle = (route: string) => {
    switch (route) {
      case "Schedule":
      case "ScheduleWeekly":
        return "Calendario de disponibilidad";
      case "Appointments":
        return "Mis citas";
      case "CalmNow":
        return "Calma Ahora";
      case "Profile":
        return "Mi Perfil";
      case "ScheduleDetail":
        return "Detalles del Horario";
      case "AccountSettings":
        return "Configuración de la cuenta";
      default:
        return "Pantalla";
    }
  };

  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={styles.leftContainer}>
        {isDetail && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
            accessibilityLabel="Volver"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.primary.main}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{getTitle(currentRoute)}</Text>
      <View style={styles.rightContainer}>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.paper,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    ...shadows.sm,
  },
  iconButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.default,
    ...shadows.sm,
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rightContainer: {
    minWidth: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    letterSpacing: -0.3,
  },
});

export default CustomHeader;
