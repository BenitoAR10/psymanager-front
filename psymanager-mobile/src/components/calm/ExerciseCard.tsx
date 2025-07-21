import type React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../screens/styles/themeConstants";

const { colors, typography, spacing, borderRadius } = theme;

// Colores de gradientes para las tarjetas
import type { ColorValue } from "react-native";

const GRADIENTS: ReadonlyArray<readonly [ColorValue, ColorValue]> = [
  ["#A0C4FF", "#4895EF"], // Azul
  ["#FFA07A", "#FF7E5F"], // Naranja/Rojo
  ["#9BF6FF", "#00BBF9"], // Azul claro
  ["#CAFFBF", "#80ED99"], // Verde
  ["#F7DC6F", "#F4D03F"], // Amarillo - para el diario de ansiedad
];

interface ExerciseCardProps {
  title: string;
  category?: string;
  pointsReward: number;
  audioUrl?: string;
  onPress: () => void;
  index: number;
  // Props de descarga
  isDownloaded: boolean;
  onDownload: () => void;
  onRemoveDownload: () => void;
  isConnected: boolean;
  isDownloading: boolean;
  // Prop especial para el diario de ansiedad
  isSpecial?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  category,
  onPress,
  index,
  isDownloaded,
  onDownload,
  onRemoveDownload,
  isConnected,
  isDownloading,
  isSpecial = false,
}) => {
  // Seleccionar un gradiente basado en el índice
  const gradientIndex = isSpecial ? 4 : index % 4; // Usar el gradiente amarillo para especiales
  const gradient = GRADIENTS[gradientIndex];

  // Imágenes de fondo según el índice
  const getBackgroundImage = () => {
    if (isSpecial) {
      // Para el diario de ansiedad, usar un fondo especial o el primero
      return require("../../../assets/calm-bg-1.jpg");
    }

    switch (index % 3) {
      case 0:
        return require("../../../assets/calm-bg-1.jpg");
      case 1:
        return require("../../../assets/calm-bg-2.jpg");
      case 2:
        return require("../../../assets/calm-bg-3.jpg");
      default:
        return require("../../../assets/calm-bg-1.jpg");
    }
  };

  const renderDownloadIcon = () => {
    // Para el diario de ansiedad, mostrar un icono especial
    if (isSpecial) {
      return (
        <View style={styles.specialIcon}>
          <MaterialCommunityIcons
            name="book-edit-outline"
            size={20}
            color="#FFFFFF"
          />
        </View>
      );
    }

    if (isDownloading) {
      return (
        <View style={[styles.downloadIcon, styles.disabledIcon]}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      );
    }
    if (isDownloaded) {
      return (
        <TouchableOpacity
          onPress={onRemoveDownload}
          style={styles.downloadIcon}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      );
    } else if (isConnected) {
      return (
        <TouchableOpacity onPress={onDownload} style={styles.downloadIcon}>
          <MaterialCommunityIcons
            name="download-outline"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={[styles.downloadIcon, styles.disabledIcon]}>
          <MaterialCommunityIcons
            name="cloud-off-outline"
            size={20}
            color="#FFFFFF"
          />
        </View>
      );
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
        {isSpecial ? (
          // Diseño especial para el diario de ansiedad
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.background}
          >
            <View style={styles.specialOverlay}>
              <View style={styles.contentContainer}>
                <View style={styles.specialHeader}>
                  <MaterialCommunityIcons
                    name="book-edit-outline"
                    size={32}
                    color="#FFFFFF"
                  />
                  {isSpecial && (
                    <View style={styles.specialBadge}>
                      <MaterialCommunityIcons
                        name="star"
                        size={12}
                        color="#FFD700"
                      />
                      <Text style={styles.specialText}>Nuevo</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.title}>{title}</Text>
                {category && <Text style={styles.category}>{category}</Text>}
              </View>
            </View>
          </LinearGradient>
        ) : (
          // Diseño normal para ejercicios regulares
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
              <View style={styles.bottomRow}>{renderDownloadIcon()}</View>
            </LinearGradient>
          </ImageBackground>
        )}
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
    height: 180,
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
    padding: spacing.sm,
  },
  specialOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-end",
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  contentContainer: {
    marginBottom: spacing.md,
  },
  specialHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reward: {
    fontSize: typography.sizes.xs,
    color: "#FFFFFF",
    fontWeight: typography.fontWeights.semibold as any,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  downloadIcon: {
    backgroundColor: "#4A5568",
    borderRadius: 12,
    padding: 4,
  },
  specialIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 4,
  },
  disabledIcon: {
    backgroundColor: "#A0A0A0",
    opacity: 0.6,
  },
  specialBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  specialText: {
    fontSize: typography.sizes.xs,
    color: "#FFFFFF",
    fontWeight: typography.fontWeights.semibold as any,
    marginLeft: 2,
  },
});

export default ExerciseCard;
