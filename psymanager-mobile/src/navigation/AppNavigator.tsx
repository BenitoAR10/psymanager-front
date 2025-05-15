import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useAuth } from "../auth/useAuth";
import LoginScreen from "../screens/LoginScreen";
import AuthSuccessScreen from "../screens/AuthSuccessScreen";
import ScheduleDetailScreen from "../screens/ScheduleDetailScreen";
import CustomHeader from "../components/CustomHeader";
import PatientTabs from "./PatientTabs";
import AppointmentDetailScreen from "../screens/AppointmentDetailScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import CompleteProfileScreen from "../screens/CompleteProfileScreen";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileInfo } from "../services/authService";

export type RootStackParamList = {
  Login: undefined;
  AuthSuccess: undefined;
  MainTabs: { screen: keyof RootStackParamList } | undefined;
  Schedule: undefined;
  ScheduleWeekly: undefined;
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
  CompleteProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ["http://localhost:8081", "exp://localhost:19000"],
  config: {
    screens: {
      Login: "login",
      AuthSuccess: "auth/success",
      MainTabs: "home",
      ScheduleDetail: "schedule/detail",
    },
  },
};

const PatientStack = () => (
  <Stack.Navigator initialRouteName="MainTabs">
    <Stack.Screen
      name="MainTabs"
      component={PatientTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ScheduleDetail"
      component={ScheduleDetailScreen}
      options={{
        header: () => <CustomHeader currentRoute="ScheduleDetail" />,
      }}
    />
    <Stack.Screen
      name="AppointmentDetail"
      component={AppointmentDetailScreen}
      options={{
        header: () => <CustomHeader currentRoute="ScheduleDetail" />,
      }}
    />
    <Stack.Screen
      name="AccountSettings"
      component={AccountSettingsScreen}
      options={{
        header: () => <CustomHeader currentRoute="AccountSettings" />,
      }}
    />
  </Stack.Navigator>
);

const CompleteProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CompleteProfile"
      component={CompleteProfileScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const PublicStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AuthSuccess"
      component={AuthSuccessScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => {
  const { isAuthenticated, userInfo, isInitializing } = useAuth();
  const isPatient = userInfo?.roles?.includes("PATIENT");

  const {
    data: profileData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getUserProfileInfo,
    enabled: isAuthenticated && isPatient && !isInitializing,
  });

  if (isInitializing || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando sesión...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated && isPatient ? (
        profileData?.profileComplete ? (
          <PatientStack />
        ) : (
          <CompleteProfileStack />
        )
      ) : (
        <PublicStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
