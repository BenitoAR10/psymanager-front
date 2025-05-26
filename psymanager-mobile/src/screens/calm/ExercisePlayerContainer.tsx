import React from "react";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import ExercisePlayerScreen from "./ExercisePlayerScreen";

type ExercisePlayerRouteProp = RouteProp<RootStackParamList, "ExercisePlayer">;

export const ExercisePlayerContainer: React.FC = () => {
  const route = useRoute<ExercisePlayerRouteProp>();
  const { exercise } = route.params;

  return (
    <ExercisePlayerScreen
      title={exercise.title}
      category={exercise.category}
      pointsReward={exercise.pointsReward}
      audioUrl={exercise.audioUrl}
    />
  );
};
