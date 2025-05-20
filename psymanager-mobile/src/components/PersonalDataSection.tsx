import React, { useRef } from "react";
import {
  View,
  TextInput as RNTextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sharedStyles } from "./styles/styles";
import theme from "../screens/styles/themeConstants";
import { formatDate } from "../utils/validators";
import { GENDER_OPTIONS, IDENTITY_GENDER_OPTIONS } from "../utils/constants";

// En PersonalDataSection.tsx
import { FormState, FormTouched } from "../services/hooks/useFormState"; // Importa los tipos

interface PersonalDataSectionProps {
  birthDate: Date | null;
  birthGender: string;
  identityGender: string;
  address: string;
  errors: { birthDate: string; birthGender: string };
  touched: { birthDate: boolean; birthGender: boolean };
  onChangeText: (name: keyof FormState, value: any) => void;
  onBlur: (field: keyof FormTouched) => void;
  onDatePress: () => void;
  onGenderPress: () => void;
  onIdentityGenderPress: () => void;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> =
  React.memo(
    ({
      birthDate,
      birthGender,
      identityGender,
      address,
      errors,
      touched,
      onChangeText,
      onBlur,
      onDatePress,
      onGenderPress,
      onIdentityGenderPress,
    }) => {
      const addressInputRef = useRef<RNTextInput>(null);

      return (
        <>
          <View style={sharedStyles.sectionContainer}>
            <Text style={sharedStyles.sectionTitle}>Datos personales</Text>

            {/* Campo de fecha de nacimiento */}
            <View style={sharedStyles.inputContainer}>
              <TouchableOpacity
                style={[
                  sharedStyles.inputWrapper,
                  touched.birthDate && errors.birthDate
                    ? sharedStyles.inputError
                    : null,
                ]}
                onPress={onDatePress}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={sharedStyles.inputIcon}
                />
                <Text
                  style={[
                    sharedStyles.input,
                    !birthDate && { color: theme.colors.grey[400] },
                  ]}
                >
                  {birthDate ? formatDate(birthDate) : "Fecha de nacimiento"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.grey[400]}
                  style={sharedStyles.dropdownIcon}
                />
              </TouchableOpacity>
              {touched.birthDate && errors.birthDate ? (
                <Text style={sharedStyles.errorText}>{errors.birthDate}</Text>
              ) : null}
            </View>

            {/* Campo de género biológico */}
            <View style={sharedStyles.inputContainer}>
              <TouchableOpacity
                style={[
                  sharedStyles.inputWrapper,
                  touched.birthGender && errors.birthGender
                    ? sharedStyles.inputError
                    : null,
                ]}
                onPress={onGenderPress}
              >
                <MaterialCommunityIcons
                  name="gender-male-female"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={sharedStyles.inputIcon}
                />
                <Text
                  style={[
                    sharedStyles.input,
                    !birthGender && { color: theme.colors.grey[400] },
                  ]}
                >
                  {birthGender
                    ? GENDER_OPTIONS.find(
                        (option) => option.value === birthGender
                      )?.label
                    : "Género biológico"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.grey[400]}
                  style={sharedStyles.dropdownIcon}
                />
              </TouchableOpacity>
              {touched.birthGender && errors.birthGender ? (
                <Text style={sharedStyles.errorText}>{errors.birthGender}</Text>
              ) : null}
            </View>

            {/* Campo de género con el que te identificas */}
            <View style={sharedStyles.inputContainer}>
              <TouchableOpacity
                style={sharedStyles.inputWrapper}
                onPress={onIdentityGenderPress}
              >
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={sharedStyles.inputIcon}
                />
                <Text
                  style={[
                    sharedStyles.input,
                    !identityGender && { color: theme.colors.grey[400] },
                  ]}
                >
                  {identityGender
                    ? IDENTITY_GENDER_OPTIONS.find(
                        (option) => option.value === identityGender
                      )?.label
                    : "Género con el que te identificas (opcional)"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.grey[400]}
                  style={sharedStyles.dropdownIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Campo de dirección */}
            <View style={sharedStyles.inputContainer}>
              <View style={sharedStyles.inputWrapper}>
                <MaterialCommunityIcons
                  name="home-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={sharedStyles.inputIcon}
                />
                <RNTextInput
                  ref={addressInputRef}
                  placeholder="Dirección (opcional)"
                  style={sharedStyles.input}
                  value={address}
                  onChangeText={(text) => onChangeText("address", text)}
                  placeholderTextColor={theme.colors.grey[400]}
                />
              </View>
            </View>
          </View>
          <Divider style={sharedStyles.divider} />
        </>
      );
    }
  );
