import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ExercisePlayerScreenProps {
  title: string;
  category: string;
  pointsReward: number;
  audioUrl: string;
}

const ExercisePlayerScreen: React.FC<ExercisePlayerScreenProps> = ({
  title,
  category,
  pointsReward,
  audioUrl,
}) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);

  // Cargar el audio al montar
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false }
        );
        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          setPositionMillis(status.positionMillis);
          setDurationMillis(status.durationMillis || 0);
          setIsPlaying(status.isPlaying ?? false);
        });
      } catch (e) {
        console.warn("Error al cargar el audio:", e);
      }
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [audioUrl]);

  const handlePlayPause = async () => {
    if (!soundRef.current) return;

    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const formatMillis = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.points}>+{pointsReward} pts</Text>

      <View style={styles.playerContainer}>
        <TouchableOpacity onPress={handlePlayPause}>
          <MaterialCommunityIcons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={72}
            color="#007aff"
          />
        </TouchableOpacity>

        <Text style={styles.time}>
          {formatMillis(positionMillis)} / {formatMillis(durationMillis)}
        </Text>
      </View>
    </View>
  );
};

export default ExercisePlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  points: {
    fontSize: 16,
    color: "#007aff",
    marginBottom: 20,
  },
  playerContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  time: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
});
