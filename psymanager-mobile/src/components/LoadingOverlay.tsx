import React from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { MotiView, AnimatePresence } from "moti";

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={styles.overlay}
        >
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#8C9EFF" />
          </View>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loaderContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoadingOverlay;
