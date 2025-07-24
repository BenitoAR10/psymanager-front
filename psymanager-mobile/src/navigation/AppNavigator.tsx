"use client";

import type React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../auth/useAuth";
import { navigationRef } from "./navigationRef";
import { useConnectivity } from "../hooks/useConnectivity";
import LoginScreen from "../screens/auth/LoginScreen";
import AuthSuccessScreen from "../screens/auth/AuthSuccessScreen";
import RegisterStep1Screen from "../screens/auth/RegisterStep1Screen";
import RegisterStep2Screen from "../screens/auth/RegisterStep2Screen";
import CustomHeader from "../components/common/CustomHeader";
import ScheduleDetailScreen from "../screens/schedule/ScheduleDetailScreen";
import AppointmentDetailScreen from "../screens/appointments/AppointmentDetailScreen";
import AccountSettingsScreen from "../screens/profile/AccountSettingsScreen";
import HelpCenterScreen from "../screens/profile/HelpCenterScreen";
import TermsAndConditionsScreen from "../screens/profile/TermsAndConditionsScreen";
import { ExercisePlayerContainer } from "../screens/calm/ExercisePlayerContainer";
import AnxietyJournalScreen from "../screens/axiety/AnxietyJournalScreen";
import PatientTabs from "./PatientTabs";

export type RootStackParamList = {
  Login: undefined;
  AuthSuccess: undefined;
  RegisterStep1: undefined;
  CompleteProfile: undefined;
  MainTabs: undefined;
  ScheduleDetail: {
    scheduleId: number;
    therapistName: string;
    startTime: string;
    endTime: string;
    date: string;
  };
  AppointmentDetail: {
    sessionId: number;
  };
  AccountSettings: undefined;
  HelpCenter: undefined;
  TermsAndConditions: undefined;
  ExercisePlayer: {
    exercise: {
      id: number;
      title: string;
      category: string;
      audioUrl: string;
      pointsReward: number;
      showPoints: boolean;
    };
  };
  AnxietyJournal: undefined; // Nueva pantalla agregada
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticatedLocal, userInfo, isInitializing, justRegistered } =
    useAuth();
  const { isConnected } = useConnectivity();
  const isPatient = userInfo?.roles?.includes("PATIENT");

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando sesión...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticatedLocal && isPatient ? (
        justRegistered ? (
          // Si acaba de registrarse, solo mostrar CompleteProfile
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="CompleteProfile"
              component={RegisterStep2Screen}
            />
          </Stack.Navigator>
        ) : (
          // Usuario autenticado: tabs + pantallas secundarias con header
          <Stack.Navigator>
            {/* -- Tab principal sin header -- */}
            <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
              {() => <PatientTabs isConnected={isConnected} />}
            </Stack.Screen>

            {/* -- Detalle de agenda, con encabezado y flecha atrás -- */}
            <Stack.Screen
              name="ScheduleDetail"
              component={ScheduleDetailScreen}
              options={{
                header: () => <CustomHeader currentRoute="ScheduleDetail" />,
              }}
            />

            {/* -- Detalle de cita -- */}
            <Stack.Screen
              name="AppointmentDetail"
              component={AppointmentDetailScreen}
              options={{
                header: () => <CustomHeader currentRoute="ScheduleDetail" />,
              }}
            />

            {/* -- Configuración de cuenta -- */}
            <Stack.Screen
              name="AccountSettings"
              component={AccountSettingsScreen}
              options={{
                header: () => <CustomHeader currentRoute="AccountSettings" />,
              }}
            />

            {/* -- Centro de ayuda -- */}
            <Stack.Screen
              name="HelpCenter"
              component={HelpCenterScreen}
              options={{
                header: () => <CustomHeader currentRoute="HelpCenter" />,
              }}
            />

            {/* -- Términos y condiciones -- */}
            <Stack.Screen
              name="TermsAndConditions"
              component={TermsAndConditionsScreen}
              options={{
                header: () => (
                  <CustomHeader currentRoute="TermsAndConditions" />
                ),
              }}
            />

            {/* -- Reproductor de ejercicio (sin header) -- */}
            <Stack.Screen
              name="ExercisePlayer"
              component={ExercisePlayerContainer}
              options={{ headerShown: false }}
            />

            {/* -- Diario de Ansiedad (sin header, maneja su propio header) -- */}
            <Stack.Screen
              name="AnxietyJournal"
              component={AnxietyJournalScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        )
      ) : (
        // Flujo público: Login, AuthSuccess, RegisterStep1
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AuthSuccess" component={AuthSuccessScreen} />
          <Stack.Screen name="RegisterStep1" component={RegisterStep1Screen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
