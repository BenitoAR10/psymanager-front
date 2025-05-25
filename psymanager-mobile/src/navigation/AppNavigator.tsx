import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useAuth } from "../auth/useAuth";
import { navigationRef } from "./navigationRef";

import LoginScreen from "../screens/auth/LoginScreen";
import AuthSuccessScreen from "../screens/auth/AuthSuccessScreen";
import ScheduleDetailScreen from "../screens/schedule/ScheduleDetailScreen";
import CustomHeader from "../components/common/CustomHeader";
import PatientTabs from "./PatientTabs";
import AppointmentDetailScreen from "../screens/appointments/AppointmentDetailScreen";
import AccountSettingsScreen from "../screens/profile/AccountSettingsScreen";
import RegisterStep1Screen from "../screens/auth/RegisterStep1Screen";
import RegisterStep2Screen from "../screens/auth/RegisterStep2Screen";
import HelpCenterScreen from "../screens/profile/HelpCenterScreen";
import TermsAndConditionsScreen from "../screens/profile/TermsAndConditionsScreen";

export type RootStackParamList = {
  Login: undefined;
  AuthSuccess: undefined;
  RegisterStep1: undefined;
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
  HelpCenter: undefined;
  TermsAndConditions: undefined;
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
  <Stack.Navigator>
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
    <Stack.Screen
      name="HelpCenter"
      component={HelpCenterScreen}
      options={{
        header: () => <CustomHeader currentRoute="HelpCenter" />,
      }}
    />
    <Stack.Screen
      name="TermsAndConditions"
      component={TermsAndConditionsScreen}
      options={{
        header: () => <CustomHeader currentRoute="TermsAndConditions" />,
      }}
    />
  </Stack.Navigator>
);

const RegistrationStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CompleteProfile"
      component={RegisterStep2Screen}
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
    <Stack.Screen
      name="RegisterStep1"
      component={RegisterStep1Screen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => {
  const { isAuthenticated, userInfo, isInitializing, justRegistered } =
    useAuth();
  const isPatient = userInfo?.roles?.includes("PATIENT");

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando sesión...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      {isAuthenticated && isPatient ? (
        justRegistered ? (
          <RegistrationStack />
        ) : (
          <PatientStack />
        )
      ) : (
        <PublicStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
