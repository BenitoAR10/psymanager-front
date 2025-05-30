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
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="close" size={28} color="#2D3748" />
      </TouchableOpacity>

      <TouchableOpacity
        style={exercisePlayerStyles.headerButton}
        onPress={onToggleFavorite}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={isFavorite ? "heart" : "heart-outline"}
          size={28}
          color={isFavorite ? "#F56565" : "#2D3748"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerHeader;
