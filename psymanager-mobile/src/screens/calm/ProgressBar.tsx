import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  onSeek: (seconds: number) => void;
  canSeek: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  formatTime,
  onSeek,
  canSeek,
}) => (
  <View style={exercisePlayerStyles.progressContainer}>
    <Slider
      style={exercisePlayerStyles.slider}
      minimumValue={0}
      maximumValue={duration}
      value={currentTime}
      onSlidingComplete={onSeek}
      disabled={!canSeek}
      minimumTrackTintColor="white"
      maximumTrackTintColor="rgba(255,255,255,0.4)"
      thumbTintColor="white"
    />
    <View style={exercisePlayerStyles.timeContainer}>
      <Text style={exercisePlayerStyles.timeText}>
        {formatTime(currentTime)}
      </Text>
      <Text style={exercisePlayerStyles.timeText}>{formatTime(duration)}</Text>
    </View>
  </View>
);

export default ProgressBar;
