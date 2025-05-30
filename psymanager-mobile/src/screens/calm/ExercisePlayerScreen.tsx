"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import CelebrationModal from "../../components/modals/CelebrationModal";

import PlayerHeader from "./PlayerHeader";
import ExerciseInfo from "./ExerciseInfo";
import PlayerControls from "./PlayerControls";
import ProgressBar from "./ProgressBar";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";
import { theme } from "../styles/themeConstants";
import { completeExercise } from "../../services/exerciseService";

interface ExercisePlayerScreenProps {
  id: number;
  title: string;
  category: string;
  pointsReward: number;
  mediaUrl: string;
  description?: string;
}

const ExercisePlayerScreen: React.FC<ExercisePlayerScreenProps> = ({
  id,
  title,
  category,
  pointsReward,
  mediaUrl,
  description = "Ejercicio de relajación y bienestar",
}) => {
  const navigation = useNavigation();
  const toast = useToast();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasBeenCompleted, setHasBeenCompleted] = useState(false);

  const audioPlayer = useAudioPlayer(mediaUrl);
  const audioStatus = useAudioPlayerStatus(audioPlayer);

  const isPlaying = audioStatus?.playing ?? false;
  const isLoaded = audioStatus?.isLoaded ?? false;
  const currentTime = audioStatus?.currentTime ?? 0;
  const duration = audioStatus?.duration ?? 0;

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);

  // Detectar cuando termina el audio
  useEffect(() => {
    if (audioStatus?.didJustFinish && !hasBeenCompleted) {
      setHasBeenCompleted(true);
      completeExercise({ exerciseId: id })
        .then(() => {
          setShowCelebration(true);
        })
        .catch((error) => {
          console.error("❌ Error al registrar ejercicio:", error);
          toast.show("No se pudo registrar el ejercicio.", { type: "danger" });
        });
    }
  }, [audioStatus, hasBeenCompleted, id, toast]);

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    navigation.goBack();
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await audioPlayer.pause();
      } else {
        await audioPlayer.play();
      }
    } catch (error) {
      console.error("Error al reproducir:", error);
      setHasError(true);
    }
  };

  const handleClose = () => {
    if (isPlaying) {
      audioPlayer.pause();
    }
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (hasError) {
    return (
      <View style={exercisePlayerStyles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={64}
          color={theme.colors.error.main}
        />
        <Text style={exercisePlayerStyles.errorText}>
          Error al cargar el contenido. Por favor, intenta nuevamente.
        </Text>
      </View>
    );
  }

  const [showCelebration, setShowCelebration] = useState(false);

  return (
    <View style={exercisePlayerStyles.container}>
      <LinearGradient
        colors={["#F0F7FA", "#E6F0F5", "#DCE9F0"]} // Gradiente suave
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={exercisePlayerStyles.gradientBackground}
      >
        <PlayerHeader
          onClose={handleClose}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />

        <View style={exercisePlayerStyles.contentContainer}>
          {isLoading ? (
            <View style={exercisePlayerStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#4FD1C5" />
            </View>
          ) : (
            <>
              <View style={exercisePlayerStyles.illustrationContainer}>
                <MaterialCommunityIcons
                  name="music-note"
                  size={60}
                  color="#4FD1C5"
                />
              </View>

              <ExerciseInfo
                title={title}
                category={category}
                pointsReward={pointsReward}
                description={description}
              />
            </>
          )}
        </View>

        {!isLoading && (
          <View style={exercisePlayerStyles.playerSection}>
            <PlayerControls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSeekBackward={() => {}}
              onSeekForward={() => {}}
              canSeek={false}
            />

            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              formatTime={formatTime}
            />
          </View>
        )}
        <CelebrationModal
          visible={showCelebration}
          points={pointsReward}
          onClose={handleCelebrationClose}
        />
      </LinearGradient>
    </View>
  );
};

export default ExercisePlayerScreen;
