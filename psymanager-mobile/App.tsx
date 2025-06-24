import React from "react";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-toast-notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/utils/queryClient";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/auth/AuthContext";

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
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SafeAreaProvider>
              <AppNavigator />
            </SafeAreaProvider>
          </AuthProvider>
        </QueryClientProvider>
      </PaperProvider>
    </ToastProvider>
  );
}
