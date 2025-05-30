import type React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";
import { theme } from "../styles/themeConstants";

interface ExerciseInfoProps {
  title: string;
  category: string;
  pointsReward: number;
  description?: string;
}

const ExerciseInfo: React.FC<ExerciseInfoProps> = ({
  title,
  category,
  pointsReward,
  description,
}) => {
  return (
    <View style={exercisePlayerStyles.titleContainer}>
      <View style={exercisePlayerStyles.categoryChip}>
        <Text style={exercisePlayerStyles.categoryText}>{category}</Text>
      </View>

      <Text style={exercisePlayerStyles.title}>{title}</Text>

      {description && (
        <Text style={exercisePlayerStyles.subtitle}>{description}</Text>
      )}

      <View style={exercisePlayerStyles.pointsContainer}>
        <MaterialCommunityIcons
          name="star"
          size={16}
          color={theme.colors.primary.main}
        />
        <Text style={exercisePlayerStyles.pointsText}>
          +{pointsReward} puntos
        </Text>
      </View>
    </View>
  );
};

export default ExerciseInfo;
