"use client";

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import DeleteAccountModal from "../../components/modals/DeleteAccountModal";

const AccountSettingsScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 500,
        }}
      >
        <TouchableOpacity
          style={styles.option}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="close" size={18} color="#8C9EFF" />
          </View>
          <Text style={styles.optionLabel}>Eliminar cuenta</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#BDBDBD"
          />
        </TouchableOpacity>
      </MotiView>

      <DeleteAccountModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          // futura lógica para eliminar cuenta
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  option: {
    backgroundColor: "#F5F7FF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    color: "#333333",
    fontWeight: "500",
  },
});

export default AccountSettingsScreen;
