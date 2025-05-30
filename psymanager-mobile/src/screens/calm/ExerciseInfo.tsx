import type React from "react";
import { View, Text } from "react-native";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";

interface ExerciseInfoProps {
  title: string;
  category: string;
  pointsReward: number;
  description?: string;
}

const ExerciseInfo: React.FC<ExerciseInfoProps> = ({ title, description }) => {
  return (
    <View style={exercisePlayerStyles.titleContainer}>
      <Text style={exercisePlayerStyles.title}>{title}</Text>
      {description && (
        <Text style={exercisePlayerStyles.subtitle}>{description}</Text>
      )}
    </View>
  );
};

export default ExerciseInfo;
