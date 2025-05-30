import type React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";
import { theme } from "../styles/themeConstants";

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
          size={24}
          color={theme.colors.text.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={exercisePlayerStyles.headerButton}
        onPress={onToggleFavorite}
      >
        <MaterialCommunityIcons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={
            isFavorite ? theme.colors.error.main : theme.colors.text.primary
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerHeader;
