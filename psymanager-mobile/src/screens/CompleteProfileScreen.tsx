import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@tanstack/react-query";
import { completeUserProfile } from "../services/userService";
import { useAuth } from "../auth/useAuth";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import dayjs from "dayjs";

const genderOptions = ["Masculino", "Femenino", "Otro", "Prefiero no decirlo"];
const ciExtensions = ["LP", "CB", "SC", "OR", "PT", "CH", "TJ", "BE", "PD"];

const CompleteProfileScreen = () => {
  const { logout } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [form, setForm] = useState({
    birthDate: new Date(),
    birthGender: "",
    identityGender: "",
    ciNumber: "",
    ciComplement: "",
    ciExtension: "",
    phoneNumber: "",
    address: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateField = (key: string, value: string | Date) => {
    setForm({ ...form, [key]: value });
  };

  const mutation = useMutation<void, Error, void>({
    mutationFn: () => completeUserProfile(form),
    onSuccess: () => {
      Alert.alert(
        "Perfil actualizado",
        "Tu perfil ha sido completado exitosamente.",
        [{ text: "Continuar", onPress: () => navigation.navigate("MainTabs") }]
      );
    },
    onError: () => {
      Alert.alert(
        "Error",
        "No se pudo guardar tu perfil. Intenta de nuevo más tarde."
      );
    },
  });

  const isFormValid = () => {
    return (
      form.birthDate &&
      form.birthGender &&
      form.identityGender &&
      form.ciNumber.trim() !== "" &&
      form.ciExtension &&
      form.phoneNumber.trim() !== "" &&
      form.address.trim() !== ""
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Completa tu perfil</Text>

      <TextInput
        label="Número de CI"
        value={form.ciNumber}
        onChangeText={(text) => updateField("ciNumber", text)}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Complemento (opcional)"
        value={form.ciComplement}
        onChangeText={(text) => updateField("ciComplement", text)}
        style={styles.input}
      />

      <TextInput
        label="Extensión"
        value={form.ciExtension}
        onChangeText={(text) => updateField("ciExtension", text)}
        style={styles.input}
      />

      <TextInput
        label="Teléfono"
        value={form.phoneNumber}
        onChangeText={(text) => updateField("phoneNumber", text)}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        label="Dirección"
        value={form.address}
        onChangeText={(text) => updateField("address", text)}
        style={styles.input}
      />

      <Button
        onPress={() => setShowDatePicker(true)}
        mode="outlined"
        style={styles.input}
      >
        Seleccionar Fecha de Nacimiento:{" "}
        {dayjs(form.birthDate).format("DD/MM/YYYY")}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={form.birthDate}
          mode="date"
          display="default"
          onChange={(_: unknown, selectedDate?: Date) => {
            setShowDatePicker(false);
            if (selectedDate) updateField("birthDate", selectedDate);
          }}
        />
      )}

      <TextInput
        label="Género de nacimiento"
        value={form.birthGender}
        onChangeText={(text) => updateField("birthGender", text)}
        style={styles.input}
      />

      <TextInput
        label="Género con el que te identificas"
        value={form.identityGender}
        onChangeText={(text) => updateField("identityGender", text)}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={() => mutation.mutate()}
        disabled={!isFormValid() || mutation.isPending}
        loading={mutation.isPending}
        style={styles.submitBtn}
      >
        Guardar y continuar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    marginBottom: 16,
  },
  submitBtn: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default CompleteProfileScreen;
