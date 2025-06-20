import type React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  canSeek: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
}) => {
  return (
    <View style={exercisePlayerStyles.controlsContainer}>
      <TouchableOpacity
        style={exercisePlayerStyles.playButton}
        onPress={onPlayPause}
      >
        <MaterialCommunityIcons
          name={isPlaying ? "pause" : "play"}
          size={40}
          color="rgba(255, 255, 255, 0.95)"
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerControls;
