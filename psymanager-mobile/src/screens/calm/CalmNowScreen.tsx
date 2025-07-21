import type React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { ExerciseCard } from "../../components/calm/ExerciseCard";
import { FeaturedExerciseCard } from "../../components/calm/FeaturedExerciseCard";
import { CategoryChips } from "../../components/calm/CategoryChips";
import type { Exercise } from "../../types/exercise";
import { theme } from "../../screens/styles/themeConstants";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/AppNavigator";

const { colors, typography, spacing, borderRadius } = theme;

interface CalmNowScreenProps {
  isLoading: boolean;
  error: Error | null;
  exercises: Exercise[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onExercisePress: (exercise: Exercise) => void;
  // Props para manejo de descargas
  downloadedMap: Record<number, string>;
  onDownload: (exercise: Exercise) => void;
  onRemoveDownload: (exerciseId: number) => void;
  isConnected: boolean;
  downloadingIds: number[];
}

export const CalmNowScreen: React.FC<CalmNowScreenProps> = ({
  isLoading,
  error,
  exercises,
  selectedCategory,
  onCategoryChange,
  onExercisePress,
  downloadedMap,
  onDownload,
  onRemoveDownload,
  isConnected,
  downloadingIds,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Cargando ejercicios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar los ejercicios 😢</Text>
        <Text style={styles.errorTextSmall}>{error.message}</Text>
      </View>
    );
  }

  const [first, ...rest] = exercises;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Calma Ahora</Text>
      <Text style={styles.description}>
        Aquí encontrarás ejercicios y técnicas para calmarte durante momentos de
        ansiedad y estrés, y mantener tu bienestar emocional.
      </Text>

      <CategoryChips
        selected={selectedCategory}
        onSelectCategory={onCategoryChange}
      />

      {first && (
        <FeaturedExerciseCard
          exercise={first}
          onPress={() => onExercisePress(first)}
          // Props de descarga
          isDownloaded={!!downloadedMap[first.id]}
          onDownload={() => onDownload(first)}
          onRemoveDownload={() => onRemoveDownload(first.id)}
          isConnected={isConnected}
          isDownloading={downloadingIds.includes(first.id)}
        />
      )}

      <View style={styles.gridContainer}>
        {/* Diario de Ansiedad como primer elemento especial */}
        <ExerciseCard
          title="Diario de Ansiedad"
          category="Herramienta TCC"
          pointsReward={25}
          audioUrl=""
          onPress={() => navigation.navigate("AnxietyJournal" as never)}
          index={0}
          // Props de descarga (no aplicables para el diario)
          isDownloaded={true} // Siempre disponible localmente
          onDownload={() => {}} // No hace nada
          onRemoveDownload={() => {}} // No hace nada
          isConnected={isConnected}
          isDownloading={false}
          // Prop especial para identificar el diario
          isSpecial={true}
        />

        {rest.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            title={exercise.title}
            category={exercise.category}
            pointsReward={exercise.pointsReward}
            audioUrl={exercise.audioUrl}
            onPress={() => onExercisePress(exercise)}
            index={index + 1} // +1 porque el diario ocupa el índice 0
            // Props de descarga
            isDownloaded={!!downloadedMap[exercise.id]}
            onDownload={() => onDownload(exercise)}
            onRemoveDownload={() => onRemoveDownload(exercise.id)}
            isConnected={isConnected}
            isDownloading={downloadingIds.includes(exercise.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: typography.sizes.sm,
    textAlign: "center",
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background.paper,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium as any,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.error.main,
    textAlign: "center",
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeights.semibold as any,
  },
  errorTextSmall: {
    fontSize: typography.sizes.sm,
    color: colors.grey[400],
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
});

export default CalmNowScreen;
