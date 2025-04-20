"use client";

import type React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  onCall?: () => void;
  onEmail?: () => void;
  onWhatsApp?: () => void;
}

const TherapistContact: React.FC<Props> = ({ onCall, onEmail, onWhatsApp }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contactContainer}>
        <TouchableOpacity style={styles.contactButton} onPress={onCall}>
          <MaterialCommunityIcons name="phone" size={24} color="#8C9EFF" />
          <Text style={styles.contactLabel}>Teléfono</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={onEmail}>
          <MaterialCommunityIcons name="email" size={24} color="#8C9EFF" />
          <Text style={styles.contactLabel}>Email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={onWhatsApp}>
          <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
          <Text style={[styles.contactLabel, { color: "#25D366" }]}>
            WhatsApp
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TherapistContact;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 8,
  },
  contactButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: "#8C9EFF",
    marginTop: 4,
  },
});
