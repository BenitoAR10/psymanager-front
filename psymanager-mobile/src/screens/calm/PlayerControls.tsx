import React from "react";
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
  onSeekBackward,
  onSeekForward,
  canSeek,
}) => (
  <View style={exercisePlayerStyles.controlsContainer}>
    <TouchableOpacity
      disabled={!canSeek}
      onPress={onSeekBackward}
      style={exercisePlayerStyles.controlButton}
    >
      <MaterialCommunityIcons
        name="rewind-15"
        size={32}
        color={canSeek ? "white" : "rgba(255,255,255,0.5)"}
      />
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onPlayPause}
      style={exercisePlayerStyles.playButton}
    >
      <MaterialCommunityIcons
        name={isPlaying ? "pause" : "play"}
        size={40}
        color="white"
      />
    </TouchableOpacity>

    <TouchableOpacity
      disabled={!canSeek}
      onPress={onSeekForward}
      style={exercisePlayerStyles.controlButton}
    >
      <MaterialCommunityIcons
        name="fast-forward-15"
        size={32}
        color={canSeek ? "white" : "rgba(255,255,255,0.5)"}
      />
    </TouchableOpacity>
  </View>
);

export default PlayerControls;
