import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileScreen: React.FC = () => (
  <View style={styles.container}>
    <Text>Mi Perfil (pendiente)</Text>
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
