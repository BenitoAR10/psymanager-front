import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface CircleBreathingProps {
  onComplete: () => void;
}

const CircleBreathing: React.FC<CircleBreathingProps> = ({ onComplete }) => {
  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>Ejercicio: Respiración en Círculo</Text>
      <Text style={styles.instructions}>
        Inhala al expandir el círculo, exhala al contraerlo.
      </Text>
      <Button title="He terminado" onPress={onComplete} />
    </View>
  );
};

export default CircleBreathing;

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
