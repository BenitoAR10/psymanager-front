import React from "react";
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

// Stack de usuario autenticado con tabs y pantallas fuera de tabs
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
  const { isAuthenticated, userInfo } = useAuth();
  const isPatient = userInfo?.roles?.includes("PATIENT");

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated && isPatient ? <PatientStack /> : <PublicStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
