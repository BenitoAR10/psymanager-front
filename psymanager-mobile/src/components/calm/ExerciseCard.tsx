import type React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { theme } from "../../screens/styles/themeConstants";

const { colors, typography, spacing, borderRadius } = theme;

// Colores de gradientes para las tarjetas
const GRADIENTS = [
  ["#A0C4FF", "#4895EF"], // Azul
  ["#FFA07A", "#FF7E5F"], // Naranja/Rojo
  ["#9BF6FF", "#00BBF9"], // Azul claro
  ["#CAFFBF", "#80ED99"], // Verde
];

interface ExerciseCardProps {
  title: string;
  category?: string;
  pointsReward: number;
  audioUrl?: string;
  onPress: () => void;
  index: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  category,
  onPress,
  index,
}) => {
  // Seleccionar un gradiente basado en el índice
  const gradientIndex = index % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIndex];

  // Imágenes de fondo según el índice
  const getBackgroundImage = () => {
    switch (index % 3) {
      case 0:
        return require("../../../assets/calm-bg-1.jpg");
      case 1:
        return require("../../../assets/calm-bg-2.jpg");
      case 2:
        return require("../../../assets/calm-bg-3.jpg");
      default:
        return require("../../../assets/calm-bg-4.jpg");
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 100 + index * 100, type: "timing", duration: 500 }}
      style={styles.cardWrapper}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.container}
      >
        <ImageBackground
          source={getBackgroundImage()}
          style={styles.background}
          imageStyle={styles.backgroundImage}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)"]}
            style={styles.overlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{title}</Text>
              {category && <Text style={styles.category}>{category}</Text>}
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: "48%",
    marginBottom: spacing.md,
  },
  container: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 160,
  },
  background: {
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    borderRadius: borderRadius.lg,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: borderRadius.lg,
  },
  contentContainer: {
    padding: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.bold as any,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  category: {
    fontSize: typography.sizes.xs,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
