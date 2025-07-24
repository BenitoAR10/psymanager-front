"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { anxietyJournalService } from "../../services/anxietyJournalService";
import type { AnxietyEntry } from "../../types/anxietyTypes";
import { theme } from "../../screens/styles/themeConstants";
import AnxietyJournalFlow from "./AnxietyJournalFlow";

const { colors, typography, spacing, borderRadius } = theme;

const AnxietyJournalScreen: React.FC = () => {
  const navigation = useNavigation();
  const [showFlow, setShowFlow] = useState(false);
  const [recentEntries, setRecentEntries] = useState<AnxietyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentEntries();
  }, []);

  const loadRecentEntries = async () => {
    try {
      const entries = await anxietyJournalService.getEntries();
      const sortedEntries = entries
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 3);
      setRecentEntries(sortedEntries);
    } catch (error) {
      console.error("Error loading entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (showFlow) {
    return (
      <AnxietyJournalFlow
        onComplete={() => {
          setShowFlow(false);
          loadRecentEntries();
        }}
        onCancel={() => setShowFlow(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 500 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Diario de Ansiedad</Text>
          <View style={styles.headerSpacer} />
        </MotiView>

        {/* Introducción inspirada en el recurso */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 600, delay: 100 }}
          style={styles.introCard}
        >
          <View style={styles.yellowBackground}>
            <View style={styles.questionMarks}>
              <MaterialCommunityIcons name="help" size={32} color="#FF6B6B" />
              <MaterialCommunityIcons name="help" size={24} color="#4ECDC4" />
              <MaterialCommunityIcons name="help" size={20} color="#45B7D1" />
            </View>

            <View style={styles.paperNote}>
              <Text style={styles.paperTitle}>
                ¿Qué hacer cuando tengo ansiedad?
              </Text>
              <Text style={styles.paperSubtitle}>
                Esta herramienta te ayudará a identificar y manejar tus
                pensamientos ansiosos
              </Text>
            </View>

            <View style={styles.characterContainer}>
              <View style={styles.thoughtBubble} />
              <View style={styles.character}>
                <MaterialCommunityIcons
                  name="account"
                  size={40}
                  color="#2D3748"
                />
              </View>
            </View>
          </View>
        </MotiView>

        {/* Botón principal */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 500, delay: 200 }}
          style={styles.actionContainer}
        >
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowFlow(true)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="plus-circle"
              size={24}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.startButtonText}>
              Nuevo registro de ansiedad
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* Entradas recientes */}
        {recentEntries.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 500, delay: 300 }}
            style={styles.recentSection}
          >
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="history"
                size={20}
                color={colors.primary.main}
              />
              <Text style={styles.sectionTitle}>Registros recientes</Text>
            </View>

            {recentEntries.map((entry, index) => (
              <MotiView
                key={entry.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 400, delay: 400 + index * 100 }}
              >
                <TouchableOpacity style={styles.entryCard} activeOpacity={0.7}>
                  <View style={styles.entryHeader}>
                    <View style={styles.entryIcon}>
                      <MaterialCommunityIcons
                        name={
                          entry.completed ? "check-circle" : "clock-outline"
                        }
                        size={20}
                        color={
                          entry.completed
                            ? colors.success.main
                            : colors.warning.main
                        }
                      />
                    </View>
                    <View style={styles.entryInfo}>
                      <Text style={styles.entryDate}>
                        {formatDate(entry.timestamp)}
                      </Text>
                      <Text style={styles.entryTrigger} numberOfLines={1}>
                        {entry.trigger || "Registro en progreso..."}
                      </Text>
                    </View>
                    <View style={styles.entryPoints}>
                      <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color="#FFD700"
                      />
                      <Text style={styles.pointsText}>
                        {entry.pointsEarned}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}

            <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>Ver todos los registros</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.primary.main}
              />
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Información adicional */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 500, delay: 500 }}
          style={styles.infoCard}
        >
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={24}
            color={colors.primary.main}
            style={styles.infoIcon}
          />
          <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
          <Text style={styles.infoText}>
            Te guiaremos paso a paso para identificar qué desencadena tu
            ansiedad y cómo puedes manejarla mejor. Cada registro completado te
            ayudará a entender tus patrones y te dará herramientas para el
            futuro.
          </Text>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  introCard: {
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  yellowBackground: {
    backgroundColor: "#F7DC6F",
    padding: spacing.xl,
    position: "relative",
    minHeight: 200,
  },
  questionMarks: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  paperNote: {
    backgroundColor: "#F8F9FA",
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#2D3748",
  },
  paperTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: "#2D3748",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  paperSubtitle: {
    fontSize: typography.sizes.sm,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 20,
  },
  characterContainer: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.md,
    alignItems: "center",
  },
  thoughtBubble: {
    width: 40,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  character: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  startButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  startButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold as any,
    color: "#FFFFFF",
  },
  recentSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  entryCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.default,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  entryTrigger: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: typography.fontWeights.medium as any,
  },
  entryPoints: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  viewAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeights.medium as any,
    marginRight: spacing.xs,
  },
  infoCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  infoIcon: {
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default AnxietyJournalScreen;
