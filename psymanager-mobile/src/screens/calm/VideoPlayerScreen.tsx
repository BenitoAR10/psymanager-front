import React from "react";
import { View, Dimensions } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { exercisePlayerStyles } from "../styles/exercisePlayerStyles";
import PlayerHeader from "./PlayerHeader";

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
  const videoPlayer = useVideoPlayer(mediaUrl, (player) => {
    player.loop = false;
    player.muted = false;
  });

  const handleClose = () => {
    videoPlayer.pause();
    navigation.goBack();
  };

  return (
    <View style={exercisePlayerStyles.container}>
      <PlayerHeader
        onClose={handleClose}
        onToggleFavorite={() => {}}
        isFavorite={false}
      />
      <VideoView
        player={videoPlayer}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").width * 0.6,
          backgroundColor: "#000",
        }}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
      />
    </View>
  );
};

export default VideoPlayerScreen;
