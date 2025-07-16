import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface BoxBreathingProps {
  onComplete: () => void;
}

const BoxBreathing: React.FC<BoxBreathingProps> = ({ onComplete }) => {
  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>Ejercicio: Box Breathing</Text>
      <Text style={styles.instructions}>
        Inhala (1), retén (2), exhala (3), retén (4). Repite.
      </Text>
      <Button title="He terminado" onPress={onComplete} />
    </View>
  );
};

export default BoxBreathing;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: "#eee",
    textAlign: "center",
    marginBottom: 20,
  },
});
