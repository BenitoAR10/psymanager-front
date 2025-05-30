"use client";

import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import PlayerHeader from "./PlayerHeader";
import ExerciseInfo from "./ExerciseInfo";
import PlayerControls from "./PlayerControls";
import ProgressBar from "./ProgressBar";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";
import { theme } from "../styles/themeConstants";

interface ExercisePlayerScreenProps {
  title: string;
  category: string;
  pointsReward: number;
  mediaUrl: string;
  description?: string;
}

const ExercisePlayerScreen: React.FC<ExercisePlayerScreenProps> = ({
  title,
  category,
  pointsReward,
  mediaUrl,
  description = "Ejercicio de relajación y bienestar",
}) => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const audioPlayer = useAudioPlayer(mediaUrl);
  const audioStatus = useAudioPlayerStatus(audioPlayer);

  const isPlaying = audioStatus?.playing ?? false;
  const isLoaded = audioStatus?.isLoaded ?? false;
  const currentTime = (audioStatus?.currentTime ?? 0) / 1000;
  const duration = (audioStatus?.duration ?? 0) / 1000;

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);

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

  return (
    <View style={exercisePlayerStyles.container}>
      <LinearGradient
        colors={["#F8FAFC", "#EEF2F6", "#E3E8EF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
              <ActivityIndicator
                size="large"
                color={theme.colors.primary.main}
              />
            </View>
          ) : (
            <>
              <View style={exercisePlayerStyles.illustrationContainer}>
                <View style={exercisePlayerStyles.illustration}>
                  <MaterialCommunityIcons
                    name="music-note"
                    size={80}
                    color={theme.colors.primary.main}
                    style={{ opacity: 0.6 }}
                  />
                </View>
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
          <View style={exercisePlayerStyles.playerContainer}>
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
      </LinearGradient>
    </View>
  );
};

export default ExercisePlayerScreen;
