import type React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";

interface PlayerHeaderProps {
  onClose: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  onClose,
  onToggleFavorite,
  isFavorite,
}) => {
  return (
    <View style={exercisePlayerStyles.header}>
      <TouchableOpacity
        style={exercisePlayerStyles.headerButton}
        onPress={onClose}
      >
        <MaterialCommunityIcons
          name="close"
          size={28}
          color="rgba(255, 255, 255, 0.9)"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={exercisePlayerStyles.headerButton}
        onPress={onToggleFavorite}
      >
        <MaterialCommunityIcons
          name={isFavorite ? "heart" : "heart-outline"}
          size={28}
          color={isFavorite ? "#FF6B6B" : "rgba(255, 255, 255, 0.9)"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerHeader;
