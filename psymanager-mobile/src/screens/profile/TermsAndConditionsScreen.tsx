import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { theme } from "../styles/themeConstants";

const { colors, spacing, typography } = theme;

const TermsAndConditionsScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Términos y Condiciones</Text>

      <Text style={styles.sectionTitle}>Introducción</Text>
      <Text style={styles.paragraph}>
        Este documento explica tus derechos, deberes y el tratamiento de tu
        información durante el uso del Servicio de Atención Psicológica y Salud
        Mental de la Universidad Católica Boliviana “San Pablo”.
      </Text>

      <Text style={styles.sectionTitle}>Sobre el/la terapeuta</Text>
      <Text style={styles.paragraph}>
        La atención es brindada por profesionales en Psicología. La supervisión
        está a cargo de la Mgtr. Ximena Rojas Paz Soldán y la Dra. María Elena
        Lora Fuentes.
      </Text>

      <Text style={styles.sectionTitle}>Sobre las sesiones</Text>
      <Text style={styles.paragraph}>
        - Duración: hasta 45 minutos.{"\n"}- Frecuencia: 1 vez por semana (puede
        variar).{"\n"}- Límite: hasta 12 sesiones por semestre (puede
        modificarse).{"\n"}- Confidencialidad garantizada.{"\n"}- El terapeuta
        podrá contactar a responsables si hay riesgo.{"\n"}- Se puede derivar a
        otra especialidad si es necesario.{"\n"}- Toda grabación requiere
        consentimiento explícito.
      </Text>

      <Text style={styles.sectionTitle}>Responsabilidades del paciente</Text>
      <Text style={styles.paragraph}>
        - Puntualidad: perderá la sesión si se retrasa más de 10 min.{"\n"}-
        Cancelaciones: máximo 2 seguidas, con al menos 1 día de anticipación.
        {"\n"}- Seguir recomendaciones terapéuticas.{"\n"}- Guardar el celular
        salvo acuerdo previo.
      </Text>

      <Text style={styles.sectionTitle}>Derechos del paciente</Text>
      <Text style={styles.paragraph}>
        - Puede dejar el servicio en cualquier momento.{"\n"}- Tiene derecho a
        información clara.{"\n"}- Sus datos son tratados con confidencialidad.
      </Text>

      <Text style={styles.sectionTitle}>Consentimiento</Text>
      <Text style={styles.paragraph}>
        Al continuar, confirmas que:{"\n"}- Has leído y comprendido este
        documento.{"\n"}- Aceptas de forma voluntaria participar en el proceso
        terapéutico.{"\n"}- Puedes retirarte sin penalización en cualquier
        momento.
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("HelpCenter")}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Ver Política de privacidad completa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    color: colors.primary.main,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  linkButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  linkText: {
    fontSize: typography.sizes.md,
    color: colors.primary.dark,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
