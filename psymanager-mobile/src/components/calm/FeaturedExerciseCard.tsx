import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Exercise } from "../../types/exercise";

interface FeaturedExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
}

export const FeaturedExerciseCard: React.FC<FeaturedExerciseCardProps> = ({
  exercise,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ImageBackground
        source={require("../../../assets/icon.png")} // o usa color/fondo estático si prefieres
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{exercise.title}</Text>
          {exercise.category && (
            <Text style={styles.category}>{exercise.category}</Text>
          )}
          <Text style={styles.points}>+{exercise.pointsReward} pts</Text>
        </View>
        <MaterialCommunityIcons
          name="play-circle-outline"
          size={48}
          color="#fff"
        />
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
  },
  background: {
    height: 160,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    color: "#eee",
  },
  points: {
    fontSize: 14,
    color: "#a0e1ff",
    marginTop: 6,
  },
});
