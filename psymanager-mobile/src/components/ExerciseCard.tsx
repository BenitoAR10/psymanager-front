import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface ExerciseCardProps {
  title: string;
  category?: string;
  pointsReward: number;
  audioUrl: string;
}

/**
 * Muestra una tarjeta con los datos de un ejercicio de bienestar.
 * Incluye botón de reproducción para escuchar el audio.
 */
export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  category,
  pointsReward,
  audioUrl,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const soundRef = React.useRef<Audio.Sound | null>(null);

  const handlePlay = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      soundRef.current = sound;
      setIsPlaying(true);

      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.warn("Error al reproducir audio:", error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        {category && <Text style={styles.category}>{category}</Text>}
        <Text style={styles.points}>+{pointsReward} pts</Text>
      </View>

      <TouchableOpacity onPress={handlePlay} style={styles.iconButton}>
        <MaterialCommunityIcons
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={42}
          color="#007aff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#777",
  },
  points: {
    fontSize: 14,
    color: "#1e90ff",
    marginTop: 4,
  },
  iconButton: {
    marginLeft: 12,
  },
});
