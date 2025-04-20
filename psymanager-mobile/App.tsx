import React from "react";
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/auth/AuthContext";
import { StatusBar } from "expo-status-bar";
import { ToastProvider } from "react-native-toast-notifications";

export default function App() {
  return (
    <ToastProvider
      duration={3000}
      animationType="slide-in"
      placement="top"
      offset={50}
      successColor="#48BB78"
      dangerColor="#F56565"
    >
      <PaperProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </ToastProvider>
  );
}
