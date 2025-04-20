import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CalmNowScreen: React.FC = () => (
  <View style={styles.container}>
    <Text>Sección Calma Ahora (pendiente)</Text>
  </View>
);

export default CalmNowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
