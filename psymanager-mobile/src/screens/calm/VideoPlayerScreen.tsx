"use client";

import type React from "react";
import { useState } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import PlayerHeader from "./PlayerHeader";
import { theme } from "../../screens/styles/themeConstants";

const { colors, typography, spacing, borderRadius } = theme;

interface VideoPlayerScreenProps {
  title: string;
  category: string;
  pointsReward: number;
  mediaUrl: string;
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({
  title,
  category,
  pointsReward,
  mediaUrl,
}) => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  const videoPlayer = useVideoPlayer(mediaUrl, (player) => {
    player.loop = false;
    player.muted = false;
  });

  const handleClose = () => {
    videoPlayer.pause();
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getCategoryIcon = (
    category: string
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (category.toLowerCase()) {
      case "ansiedad":
        return "heart-pulse";
      case "estrés":
        return "leaf";
      case "relajación":
        return "meditation";
      case "respiración":
        return "lungs";
      default:
        return "play-circle";
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case "ansiedad":
        return "#F687B3";
      case "estrés":
        return "#68D391";
      case "relajación":
        return "#81E6D9";
      case "respiración":
        return "#90CDF4";
      default:
        return "#A78BFA";
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#F0F7FA", "#E6F0F5", "#DCE9F0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      >
        <PlayerHeader
          onClose={handleClose}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />

        {/* Información del ejercicio */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 600 }}
          style={styles.exerciseInfoContainer}
        >
          <View style={styles.categoryBadge}>
            <MaterialCommunityIcons
              name={getCategoryIcon(category)}
              size={16}
              color={getCategoryColor(category)}
              style={styles.categoryIcon}
            />
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(category) },
              ]}
            >
              {category}
            </Text>
          </View>

          <Text style={styles.exerciseTitle}>{title}</Text>
        </MotiView>

        {/* Reproductor de video */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 700, delay: 200 }}
          style={styles.videoContainer}
        >
          <VideoView
            player={videoPlayer}
            style={styles.videoPlayer}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls
          />
        </MotiView>

        {/* Mensaje motivacional */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 600, delay: 400 }}
          style={styles.motivationalSection}
        >
          <View style={styles.motivationalCard}>
            <MaterialCommunityIcons
              name="heart"
              size={24}
              color="#F687B3"
              style={styles.motivationalIcon}
            />
            <Text style={styles.motivationalTitle}>Tómate tu tiempo</Text>
            <Text style={styles.motivationalText}>
              Cada momento que dedicas a tu bienestar es una inversión en tu
              salud mental. Respira profundo y disfruta este momento para ti.
            </Text>
          </View>
        </MotiView>
      </LinearGradient>
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F7FA",
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  exerciseInfoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold as any,
    textTransform: "capitalize",
  },
  exerciseTitle: {
    fontSize: 28,
    fontWeight: typography.fontWeights.bold as any,
    color: "#2D3748",
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 34,
  },
  exerciseMetrics: {
    flexDirection: "row",
    justifyContent: "center",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  metricText: {
    fontSize: typography.sizes.sm,
    color: "#4A5568",
    marginLeft: spacing.xs,
    fontWeight: typography.fontWeights.medium as any,
  },
  videoContainer: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  videoPlayer: {
    width: width - spacing.lg * 2,
    height: (width - spacing.lg * 2) * 0.6,
    backgroundColor: "#000",
  },
  motivationalSection: {
    marginBottom: spacing.xl,
  },
  motivationalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  motivationalIcon: {
    marginBottom: spacing.md,
  },
  motivationalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold as any,
    color: "#2D3748",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  motivationalText: {
    fontSize: typography.sizes.sm,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
});

export default VideoPlayerScreen;
