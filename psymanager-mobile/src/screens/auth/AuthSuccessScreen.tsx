import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../auth/useAuth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { MotiView } from "moti";

const AuthSuccessScreen: React.FC = () => {
  const { login } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      login(accessToken, refreshToken).then(() => {
        navigation.replace("MainTabs");
      });
    } else {
      navigation.replace("Login");
    }
  }, []);

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "timing",
          duration: 800,
        }}
        style={styles.pulseCircle}
      />
      <Text style={styles.text}>Iniciando sesión...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  pulseCircle: {
    width: 80,
    height: 80,
    backgroundColor: "#8C9EFF",
    borderRadius: 40,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

export default AuthSuccessScreen;
