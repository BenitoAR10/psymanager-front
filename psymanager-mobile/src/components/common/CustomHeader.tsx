import type React from "react";
import { View, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { theme } from "../../screens/styles/themeConstants";

const { colors, typography, spacing, shadows } = theme;

interface CustomHeaderProps {
  currentRoute:
    | "Schedule"
    | "ScheduleWeekly"
    | "Appointments"
    | "CalmNow"
    | "Profile"
    | "ScheduleDetail"
    | "AccountSettings"
    | "HelpCenter"
    | "TermsAndConditions";
  rightComponent?: React.ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  currentRoute,
  rightComponent,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isDetail =
    currentRoute === "ScheduleDetail" ||
    currentRoute === "AccountSettings" ||
    currentRoute === "TermsAndConditions" ||
    currentRoute === "HelpCenter";

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
        return "Cuenta";
      case "HelpCenter":
        return "Centro de Ayuda";
      case "TermsAndConditions":
        return "Términos y Condiciones";
      default:
        return "Pantalla";
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.paper}
        translucent={false}
      />
      <View style={styles.container} accessibilityRole="header">
        <View style={styles.leftContainer}>
          {isDetail && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconButton}
              accessibilityLabel="Volver"
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={22}
                color={colors.primary.main}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {getTitle(currentRoute)}
          </Text>
        </View>

        <View style={styles.rightContainer}>{rightComponent}</View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.main + "40",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.background.default,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftContainer: {
    width: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rightContainer: {
    width: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  title: {
    fontWeight: "600",
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    letterSpacing: -0.2,
    textAlign: "center",
  },
});

export default CustomHeader;
