import React from "react";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import ExercisePlayerScreen from "./ExercisePlayerScreen";
import VideoPlayerScreen from "./VideoPlayerScreen";

type ExercisePlayerRouteProp = RouteProp<RootStackParamList, "ExercisePlayer">;

export const ExercisePlayerContainer: React.FC = () => {
  const route = useRoute<ExercisePlayerRouteProp>();
  const { exercise } = route.params;

  const mediaUrl = exercise.audioUrl.toLowerCase();
  const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm");

  if (isVideo) {
    return (
      <VideoPlayerScreen
        title={exercise.title}
        category={exercise.category}
        pointsReward={exercise.pointsReward}
        mediaUrl={exercise.audioUrl}
      />
    );
  }

  return (
    <ExercisePlayerScreen
      title={exercise.title}
      category={exercise.category}
      pointsReward={exercise.pointsReward}
      mediaUrl={exercise.audioUrl}
    />
  );
};
