import type React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Exercise } from "../../types/exercise";
import { theme } from "../../screens/styles/themeConstants";

const { typography, borderRadius, spacing } = theme;

interface FeaturedExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;

  // Props para descarga
  isDownloaded: boolean;
  onDownload: (exercise: Exercise) => void;
  onRemoveDownload: (exerciseId: number) => void;
  isConnected: boolean;
  isDownloading: boolean;
}

export const FeaturedExerciseCard: React.FC<FeaturedExerciseCardProps> = ({
  exercise,
  onPress,
  isDownloaded,
  onDownload,
  onRemoveDownload,
  isConnected,
  isDownloading,
}) => {
  // Manejar acción de ingresar al reproductor
  const handlePlayPress = () => {
    onPress();
  };

  // Icono de descarga/eliminación
  const renderDownloadIcon = () => {
    if (isDownloading) {
      return (
        <View style={styles.disabledIconContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      );
    }
    if (isDownloaded) {
      return (
        <TouchableOpacity
          onPress={() => onRemoveDownload(exercise.id)}
          style={styles.downloadIconContainer}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      );
    } else if (isConnected) {
      return (
        <TouchableOpacity
          onPress={() => onDownload(exercise)}
          style={styles.downloadIconContainer}
        >
          <MaterialCommunityIcons
            name="download-outline"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.disabledIconContainer}>
          <MaterialCommunityIcons
            name="cloud-off-outline"
            size={20}
            color="#FFFFFF"
          />
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePlayPress}
      style={styles.container}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={["#FFCBA4", "#FFB347"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.background}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{exercise.title}</Text>
          <Text style={styles.subtitle}>
            Ejercicio de relajación • {exercise.pointsReward} pts
          </Text>
        </View>
        <View style={styles.controls}>
          <View style={styles.playButtonContainer}>
            <TouchableOpacity
              onPress={handlePlayPress}
              style={styles.playButton}
            >
              <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {renderDownloadIcon()}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  background: {
    height: 100,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.bold as any,
    color: "#4A5568",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: "#718096",
    fontWeight: typography.fontWeights.medium as any,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButtonContainer: {
    marginRight: spacing.md,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4A5568",
    justifyContent: "center",
    alignItems: "center",
  },
  downloadIconContainer: {
    backgroundColor: "#4A5568",
    borderRadius: 12,
    padding: 4,
  },
  disabledIconContainer: {
    backgroundColor: "#A0A0A0",
    borderRadius: 12,
    padding: 4,
    opacity: 0.6,
  },
});
