import type React from "react";
import { View, Text } from "react-native";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  formatTime,
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={exercisePlayerStyles.progressContainer}>
      <View style={exercisePlayerStyles.progressBar}>
        <View
          style={[
            exercisePlayerStyles.progressFill,
            {
              width: `${Math.min(100, Math.max(0, progress))}%`,
            },
          ]}
        />
      </View>
      <View style={exercisePlayerStyles.timeContainer}>
        <Text style={exercisePlayerStyles.timeText}>
          {formatTime(currentTime)}
        </Text>
        <Text style={exercisePlayerStyles.timeText}>
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};

export default ProgressBar;
