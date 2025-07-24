"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
import CircleBreathing from "./CircleBreathing"; // Solo uno ahora
// import BoxBreathing from "./BoxBreathing";     // Ya no se usa

import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";
import { theme } from "../styles/themeConstants";
import { completeExercise } from "../../services/exerciseService";
import { getExerciseGradient } from "../../config/exerciseGradients";

interface ExercisePlayerScreenProps {
  id: number;
  title: string;
  category: string;
  pointsReward: number;
  mediaUrl: string;
  description?: string;
  showPoints: boolean;
}

const ExercisePlayerScreen: React.FC<ExercisePlayerScreenProps> = ({
  id,
  title,
  category,
  pointsReward,
  mediaUrl,
  showPoints,
  description = "Ejercicio de relajación y bienestar",
}) => {
  const navigation = useNavigation();
  const toast = useToast();

  // Estados generales
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasBeenCompleted, setHasBeenCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Audio player
  const audioPlayer = useAudioPlayer(mediaUrl);
  const audioStatus = useAudioPlayerStatus(audioPlayer);
  const isPlaying = audioStatus?.playing ?? false;
  const isLoaded = audioStatus?.isLoaded ?? false;
  const currentTime = audioStatus?.currentTime ?? 0; // en segundos
  const duration = audioStatus?.duration ?? 0; // en segundos

  // Solo un cue point a 1:28 → 88 segundos
  const cuePoints = [{ time: 88, type: "circle" }];

  // Para no disparar dos veces cada cue
  const seen = useRef<{ [key: number]: boolean }>({});

  // Ejercicio activo actualmente
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

  // Gradiente según categoría
  const gradient = getExerciseGradient(category);

  // Cuando el audio carga
  useEffect(() => {
    if (isLoaded) setIsLoading(false);
  }, [isLoaded]);

  // Detectar fin de reproducción para registrar ejercicio
  useEffect(() => {
    if (audioStatus?.didJustFinish && !hasBeenCompleted) {
      setHasBeenCompleted(true);
      completeExercise({ exerciseId: id })
        .then(() => {
          if (showPoints) {
            // ← envolvemos aquí
            setShowCelebration(true);
          }
        })
        .catch((error) => {
          console.error("❌ Error al registrar ejercicio:", error);
          toast.show("No se pudo registrar el ejercicio.", { type: "danger" });
        });
    }
  }, [audioStatus, hasBeenCompleted, id, toast, showPoints]);

  // Vigilar currentTime para disparar el cue en 88s
  useEffect(() => {
    const t = Math.floor(currentTime);
    cuePoints.forEach(({ time, type }) => {
      if (t >= time && !seen.current[time]) {
        seen.current[time] = true;
        audioPlayer.pause();
        setActiveExercise(type);
      }
    });
  }, [currentTime, audioPlayer]);

  // Saltos de 15s
  const seekBackward = async () => {
    const t = Math.max(0, currentTime - 15);
    try {
      await audioPlayer.seekTo(t);
    } catch (e) {
      console.error(e);
    }
  };
  const seekForward = async () => {
    const t = Math.min(duration, currentTime + 15);
    try {
      await audioPlayer.seekTo(t);
    } catch (e) {
      console.error(e);
    }
  };

  // Play / Pause
  const handlePlayPause = async () => {
    try {
      if (isPlaying) await audioPlayer.pause();
      else await audioPlayer.play();
    } catch (error) {
      console.error("Error al reproducir:", error);
      setHasError(true);
    }
  };

  // Cerrar pantalla
  const handleClose = () => {
    if (isPlaying) audioPlayer.pause();
    navigation.goBack();
  };

  // Favoritos
  const handleToggleFavorite = () => setIsFavorite((fav) => !fav);

  // Formatear tiempos
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Error base
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

  return (
    <View style={exercisePlayerStyles.container}>
      <LinearGradient
        colors={gradient.colors}
        start={gradient.start}
        end={gradient.end}
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
              <ActivityIndicator size="large" color="rgba(255,255,255,0.8)" />
            </View>
          ) : (
            <>
              <View style={exercisePlayerStyles.illustrationContainer}>
                <MaterialCommunityIcons
                  name="music-note"
                  size={60}
                  color="rgba(255,255,255,0.9)"
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
              onSeekBackward={seekBackward}
              onSeekForward={seekForward}
              canSeek={isLoaded}
            />
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              formatTime={formatTime}
              onSeek={async (pos) => {
                try {
                  await audioPlayer.seekTo(pos);
                } catch {}
              }}
              canSeek={isLoaded}
            />
          </View>
        )}

        {/* Solo CircleBreathing a los 88 segundos */}
        {activeExercise === "circle" && (
          <CircleBreathing
            onComplete={() => {
              setActiveExercise(null);
              audioPlayer.play();
            }}
          />
        )}

        {/* Modal de celebración / fin de ejercicio */}
        <CelebrationModal
          visible={showCelebration}
          category={category}
          onClose={() => {
            setShowCelebration(false);
            navigation.goBack();
          }}
        />
      </LinearGradient>
    </View>
  );
};

export default ExercisePlayerScreen;
