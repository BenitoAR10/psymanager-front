import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { theme } from "../styles/themeConstants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { colors, spacing, typography } = theme;

const HelpCenterScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preguntas frecuentes</Text>

      <View style={styles.item}>
        <MaterialCommunityIcons
          name="calendar-question"
          size={20}
          color={colors.primary.main}
        />
        <View style={styles.textContainer}>
          <Text style={styles.question}>¿Cómo agendo una cita?</Text>
          <Text style={styles.answer}>
            Ve a la pestaña Calendario, selecciona un horario disponible y
            confirma.
          </Text>
        </View>
      </View>

      <View style={styles.item}>
        <MaterialCommunityIcons
          name="account-question"
          size={20}
          color={colors.primary.main}
        />
        <View style={styles.textContainer}>
          <Text style={styles.question}>¿Puedo cancelar una cita?</Text>
          <Text style={styles.answer}>
            Sí. En la sección Citas puedes cancelar o reprogramar si lo haces
            con anticipación.
          </Text>
        </View>
      </View>

      {/* Puedes agregar más preguntas aquí */}
    </ScrollView>
  );
};

export default HelpCenterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  textContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  question: {
    fontSize: typography.sizes.md,
    fontWeight: "600",
    color: colors.text.primary,
  },
  answer: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: 4,
  },
});
