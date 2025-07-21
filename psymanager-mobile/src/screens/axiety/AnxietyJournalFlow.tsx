"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Vibration,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { anxietyJournalService } from "../../services/anxietyJournalService";
import type { AnxietyEntry } from "../../types/anxietyTypes";
import { theme } from "../../screens/styles/themeConstants";
import { useToast } from "react-native-toast-notifications";

const { colors, typography, spacing, borderRadius } = theme;

interface AnxietyJournalFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

type FlowStep =
  | "intro"
  | "trigger"
  | "structured"
  | "reflection"
  | "restructure"
  | "summary";

const AnxietyJournalFlow: React.FC<AnxietyJournalFlowProps> = ({
  onComplete,
  onCancel,
}) => {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState<FlowStep>("intro");
  const [entry, setEntry] = useState<Partial<AnxietyEntry>>({
    id: anxietyJournalService.generateId(),
    date: new Date().toISOString().split("T")[0],
    timestamp: Date.now(),
    completed: false,
    pointsEarned: 0,
  });

  const progressAnim = useRef(new Animated.Value(0)).current;

  const steps: { [key in FlowStep]: { title: string; progress: number } } = {
    intro: { title: "Introducción", progress: 0 },
    trigger: { title: "Identificar trigger", progress: 20 },
    structured: { title: "Registro estructurado", progress: 40 },
    reflection: { title: "Reflexión", progress: 60 },
    restructure: { title: "Reestructuración", progress: 80 },
    summary: { title: "Resumen", progress: 100 },
  };

  const updateProgress = (step: FlowStep) => {
    Animated.timing(progressAnim, {
      toValue: steps[step].progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const nextStep = () => {
    Vibration.vibrate(50);
    const stepOrder: FlowStep[] = [
      "intro",
      "trigger",
      "structured",
      "reflection",
      "restructure",
      "summary",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      const nextStepName = stepOrder[currentIndex + 1];
      setCurrentStep(nextStepName);
      updateProgress(nextStepName);
    }
  };

  const prevStep = () => {
    const stepOrder: FlowStep[] = [
      "intro",
      "trigger",
      "structured",
      "reflection",
      "restructure",
      "summary",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStepName = stepOrder[currentIndex - 1];
      setCurrentStep(prevStepName);
      updateProgress(prevStepName);
    }
  };

  const saveAndComplete = async () => {
    try {
      const completedEntry: AnxietyEntry = {
        ...entry,
        completed: true,
        pointsEarned: 25, // Puntos por completar el diario
        trigger: entry.trigger || "",
        triggerType: entry.triggerType || "pensamiento",
        situation: entry.situation || "",
        thought: entry.thought || "",
        emotion: entry.emotion || "",
        physicalResponse: entry.physicalResponse || "",
        behavior: entry.behavior || "",
        evidenceFor: entry.evidenceFor || "",
        evidenceAgainst: entry.evidenceAgainst || "",
        alternativeView: entry.alternativeView || "",
        adviceToFriend: entry.adviceToFriend || "",
        alternativeThought: entry.alternativeThought || "",
      } as AnxietyEntry;

      await anxietyJournalService.saveEntry(completedEntry);
      toast.show("¡Registro guardado exitosamente! +25 puntos", {
        type: "success",
      });
      Vibration.vibrate(100);
      onComplete();
    } catch (error) {
      toast.show("Error al guardar el registro", { type: "danger" });
    }
  };

  const renderIntroStep = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 500 }}
      style={styles.stepContainer}
    >
      <View style={styles.yellowCard}>
        <View style={styles.brainContainer}>
          <MaterialCommunityIcons name="brain" size={60} color="#FF6B6B" />
          <View style={styles.confusionLines}>
            <View
              style={[
                styles.confusionLine,
                { transform: [{ rotate: "15deg" }] },
              ]}
            />
            <View
              style={[
                styles.confusionLine,
                { transform: [{ rotate: "-15deg" }] },
              ]}
            />
            <View
              style={[
                styles.confusionLine,
                { transform: [{ rotate: "45deg" }] },
              ]}
            />
          </View>
        </View>

        <View style={styles.paperCard}>
          <Text style={styles.paperTitle}>Qué hacer cuando</Text>
          <Text style={styles.paperMainTitle}>Tengo ansiedad</Text>
        </View>

        <View style={styles.faceContainer}>
          <View style={styles.face}>
            <View style={styles.eyes}>
              <View style={styles.eye} />
              <View style={styles.eye} />
            </View>
            <View style={styles.mouth} />
          </View>
        </View>
      </View>

      <Text style={styles.introText}>
        Te guiaré paso a paso para identificar y manejar tus pensamientos
        ansiosos usando técnicas de terapia cognitivo-conductual.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={nextStep}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Comenzar</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </MotiView>
  );

  const renderTriggerStep = () => (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 400 }}
      style={styles.stepContainer}
    >
      <View style={styles.yellowCard}>
        <View style={styles.thoughtBubbleContainer}>
          <MaterialCommunityIcons
            name="thought-bubble-outline"
            size={40}
            color="#4ECDC4"
          />
        </View>

        <View style={styles.paperCard}>
          <Text style={styles.paperInstructionTitle}>
            Trata de identificar qué pensamiento, imagen o situación activó tu
            ansiedad.
          </Text>
          <View style={styles.exampleContainer}>
            <MaterialCommunityIcons
              name="circle"
              size={8}
              color="#E53E3E"
              style={styles.bulletPoint}
            />
            <Text style={styles.exampleText}>
              Ejemplo: "Estoy pensando que no voy a poder con esto".
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>¿Qué activó tu ansiedad?</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Describe el pensamiento, imagen o situación que desencadenó tu ansiedad..."
          placeholderTextColor={colors.text.secondary}
          value={entry.trigger}
          onChangeText={(text) => setEntry({ ...entry, trigger: text })}
        />
      </View>
    </MotiView>
  );

  const renderStructuredStep = () => (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 400 }}
      style={styles.stepContainer}
    >
      <Text style={styles.stepTitle}>Registro estructurado</Text>
      <Text style={styles.stepSubtitle}>
        Analicemos la situación paso a paso para entender mejor lo que pasó.
      </Text>

      <ScrollView
        style={styles.structuredForm}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color={colors.primary.main}
            />{" "}
            Situación
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={3}
            placeholder="¿Dónde estabas? ¿Qué estaba pasando?"
            value={entry.situation}
            onChangeText={(text) => setEntry({ ...entry, situation: text })}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>
            <MaterialCommunityIcons
              name="thought-bubble"
              size={16}
              color={colors.primary.main}
            />{" "}
            Pensamiento
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={3}
            placeholder="¿Qué pensaste exactamente?"
            value={entry.thought}
            onChangeText={(text) => setEntry({ ...entry, thought: text })}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>
            <MaterialCommunityIcons
              name="heart"
              size={16}
              color={colors.primary.main}
            />{" "}
            Emoción
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={2}
            placeholder="¿Cómo te sentiste? (ansiedad, miedo, preocupación...)"
            value={entry.emotion}
            onChangeText={(text) => setEntry({ ...entry, emotion: text })}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>
            <MaterialCommunityIcons
              name="human"
              size={16}
              color={colors.primary.main}
            />{" "}
            Respuesta física
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={2}
            placeholder="¿Qué sentiste en tu cuerpo? (palpitaciones, sudor, tensión...)"
            value={entry.physicalResponse}
            onChangeText={(text) =>
              setEntry({ ...entry, physicalResponse: text })
            }
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>
            <MaterialCommunityIcons
              name="run"
              size={16}
              color={colors.primary.main}
            />{" "}
            Conducta
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={2}
            placeholder="¿Qué hiciste? ¿Cómo reaccionaste?"
            value={entry.behavior}
            onChangeText={(text) => setEntry({ ...entry, behavior: text })}
          />
        </View>
      </ScrollView>
    </MotiView>
  );

  const renderReflectionStep = () => (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 400 }}
      style={styles.stepContainer}
    >
      <View style={styles.yellowCard}>
        <View style={styles.questionMarksContainer}>
          <MaterialCommunityIcons name="help" size={32} color="#FF6B6B" />
          <MaterialCommunityIcons name="help" size={24} color="#4ECDC4" />
          <MaterialCommunityIcons name="help" size={20} color="#45B7D1" />
        </View>

        <View style={styles.paperCard}>
          <Text style={styles.paperTitle}>Pregúntate:</Text>
          <View style={styles.questionsList}>
            <Text style={styles.questionItem}>
              • ¿Qué evidencia tengo a favor y en contra de esto?
            </Text>
            <Text style={styles.questionItem}>
              • ¿Hay otra forma de ver esta situación?
            </Text>
            <Text style={styles.questionItem}>
              • ¿Qué le diría a alguien que quiero si pensara esto?
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.reflectionForm}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Evidencia a favor</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            placeholder="¿Qué evidencia tienes de que tu pensamiento es cierto?"
            value={entry.evidenceFor}
            onChangeText={(text) => setEntry({ ...entry, evidenceFor: text })}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Evidencia en contra</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            placeholder="¿Qué evidencia tienes de que tu pensamiento podría no ser cierto?"
            value={entry.evidenceAgainst}
            onChangeText={(text) =>
              setEntry({ ...entry, evidenceAgainst: text })
            }
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Perspectiva alternativa</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            placeholder="¿Hay otra forma de interpretar esta situación?"
            value={entry.alternativeView}
            onChangeText={(text) =>
              setEntry({ ...entry, alternativeView: text })
            }
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Consejo a un amigo</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            placeholder="¿Qué le dirías a un buen amigo que tuviera este pensamiento?"
            value={entry.adviceToFriend}
            onChangeText={(text) =>
              setEntry({ ...entry, adviceToFriend: text })
            }
          />
        </View>
      </ScrollView>
    </MotiView>
  );

  const renderRestructureStep = () => (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 400 }}
      style={styles.stepContainer}
    >
      <View style={styles.yellowCard}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="#666" />
            <Text style={styles.searchText}>
              ¿Retrocedí en mi proceso terapéutico?
            </Text>
            <MaterialCommunityIcons name="microphone" size={20} color="#666" />
          </View>
        </View>

        <View style={styles.paperCard}>
          <Text style={styles.paperInstructionText}>
            No, esto también es parte del proceso. Para trabajarlo con tu
            psicólogo/a puedes anotar lo que pasó:
          </Text>
          <View style={styles.processList}>
            <Text style={styles.processItem}>Situación</Text>
            <Text style={styles.processItem}>Pensamiento</Text>
            <Text style={styles.processItem}>Emoción</Text>
            <Text style={styles.processItem}>Respuesta física</Text>
            <Text style={styles.processItem}>Conducta</Text>
            <Text style={styles.processItem}>Alternativa pensada</Text>
          </View>
        </View>

        <View style={styles.therapyIllustration}>
          <MaterialCommunityIcons
            name="account-group"
            size={40}
            color="#4ECDC4"
          />
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Pensamiento alternativo</Text>
        <Text style={styles.inputDescription}>
          Basándote en tus reflexiones anteriores, escribe un pensamiento más
          equilibrado y realista.
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Ej: 'Aunque esto es difícil, he superado desafíos antes y puedo buscar ayuda si la necesito...'"
          value={entry.alternativeThought}
          onChangeText={(text) =>
            setEntry({ ...entry, alternativeThought: text })
          }
        />
      </View>
    </MotiView>
  );

  const renderSummaryStep = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 500 }}
      style={styles.stepContainer}
    >
      <View style={styles.summaryHeader}>
        <MaterialCommunityIcons
          name="check-circle"
          size={48}
          color={colors.success.main}
        />
        <Text style={styles.summaryTitle}>¡Excelente trabajo!</Text>
        <Text style={styles.summarySubtitle}>
          Has completado tu registro de ansiedad
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Trigger identificado:</Text>
        <Text style={styles.summaryValue}>{entry.trigger}</Text>

        <Text style={styles.summaryLabel}>Pensamiento alternativo:</Text>
        <Text style={styles.summaryValue}>{entry.alternativeThought}</Text>

        <View style={styles.pointsContainer}>
          <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
          <Text style={styles.pointsText}>+25 puntos ganados</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={saveAndComplete}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="content-save"
          size={20}
          color="#FFFFFF"
          style={styles.buttonIcon}
        />
        <Text style={styles.primaryButtonText}>Guardar registro</Text>
      </TouchableOpacity>
    </MotiView>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "intro":
        return renderIntroStep();
      case "trigger":
        return renderTriggerStep();
      case "structured":
        return renderStructuredStep();
      case "reflection":
        return renderReflectionStep();
      case "restructure":
        return renderRestructureStep();
      case "summary":
        return renderSummaryStep();
      default:
        return renderIntroStep();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con progreso */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{steps[currentStep].title}</Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Contenido del paso actual */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {renderCurrentStep()}
      </ScrollView>

      {/* Navegación */}
      {currentStep !== "intro" && currentStep !== "summary" && (
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, styles.secondaryButton]}
            onPress={prevStep}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={20}
              color={colors.primary.main}
            />
            <Text style={styles.secondaryButtonText}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.primaryButton]}
            onPress={nextStep}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Siguiente</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
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
  closeButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border.main,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  yellowCard: {
    backgroundColor: "#F7DC6F",
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    position: "relative",
    minHeight: 200,
  },
  brainContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
    position: "relative",
  },
  confusionLines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  confusionLine: {
    position: "absolute",
    width: 80,
    height: 2,
    backgroundColor: "#FF6B6B",
    opacity: 0.6,
  },
  thoughtBubbleContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  questionMarksContainer: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  searchContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 280,
  },
  searchText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: "#666",
    marginHorizontal: spacing.sm,
  },
  therapyIllustration: {
    position: "absolute",
    bottom: spacing.md,
    right: spacing.md,
  },
  paperCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#2D3748",
  },
  paperTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold as any,
    color: "#2D3748",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  paperMainTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: "#2D3748",
    textAlign: "center",
  },
  paperInstructionTitle: {
    fontSize: typography.sizes.md,
    color: "#2D3748",
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  paperInstructionText: {
    fontSize: typography.sizes.sm,
    color: "#2D3748",
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  questionsList: {
    marginTop: spacing.sm,
  },
  questionItem: {
    fontSize: typography.sizes.sm,
    color: "#4A5568",
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  processList: {
    marginTop: spacing.sm,
  },
  processItem: {
    fontSize: typography.sizes.sm,
    color: "#4A5568",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  exampleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.md,
  },
  bulletPoint: {
    marginRight: spacing.sm,
    marginTop: 6,
  },
  exampleText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: "#4A5568",
    fontStyle: "italic",
    lineHeight: 20,
  },
  faceContainer: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.md,
  },
  face: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  eyes: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  eye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2D3748",
    marginHorizontal: 3,
  },
  mouth: {
    width: 12,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#2D3748",
  },
  introText: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  inputDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  textArea: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.main,
    textAlignVertical: "top",
    minHeight: 100,
  },
  triggerTypeContainer: {
    flexDirection: "row",
    marginTop: spacing.sm,
  },
  triggerTypeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.main,
    backgroundColor: colors.background.paper,
    marginRight: spacing.sm,
    alignItems: "center",
  },
  triggerTypeButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  triggerTypeText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium as any,
  },
  triggerTypeTextActive: {
    color: "#FFFFFF",
  },
  structuredForm: {
    flex: 1,
  },
  reflectionForm: {
    flex: 1,
  },
  formField: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.main,
    textAlignVertical: "top",
    minHeight: 80,
  },
  summaryHeader: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  summaryTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  summarySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  pointsText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  navigation: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  primaryButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold as any,
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.primary.main,
    marginLeft: spacing.xs,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
});

export default AnxietyJournalFlow;
