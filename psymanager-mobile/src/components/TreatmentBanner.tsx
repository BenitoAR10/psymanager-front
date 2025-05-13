import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TreatmentBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="account-heart"
        size={18}
        color="#2C7A7B"
        style={{ marginRight: 6 }}
      />
      <Text style={styles.text}>
        Estás en tratamiento. Tus sesiones serán asignadas por tu terapeuta.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6FFFA",
    borderLeftWidth: 4,
    borderLeftColor: "#38B2AC",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#285E61",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    flexWrap: "wrap",
  },
});

export default TreatmentBanner;
