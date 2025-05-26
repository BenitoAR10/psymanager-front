import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface ExerciseCardProps {
  title: string;
  category?: string;
  pointsReward: number;
  audioUrl: string;
  onPress?: () => void;
}

/**
 * Muestra una tarjeta con los datos de un ejercicio de bienestar.
 * En esta versión, ya no reproduce audio directamente.
 */
export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  category,
  pointsReward,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        {category && <Text style={styles.category}>{category}</Text>}
        <Text style={styles.points}>+{pointsReward} pts</Text>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={32} color="#007aff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: "#777",
  },
  points: {
    fontSize: 13,
    color: "#1e90ff",
    marginTop: 4,
  },
});
