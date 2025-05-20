import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sharedStyles } from "./styles/styles";
import theme from "../screens/styles/themeConstants";
import { CAREER_OPTIONS } from "../utils/constants";

interface AcademicSectionProps {
  career: string;
  errors: { career: string };
  touched: { career: boolean };
  onCareerPress: () => void;
}

export const AcademicSection: React.FC<AcademicSectionProps> = React.memo(
  ({ career, errors, touched, onCareerPress }) => {
    return (
      <View style={sharedStyles.sectionContainer}>
        <Text style={sharedStyles.sectionTitle}>Información académica</Text>

        {/* Campo de carrera */}
        <View style={sharedStyles.inputContainer}>
          <TouchableOpacity
            style={[
              sharedStyles.inputWrapper,
              touched.career && errors.career ? sharedStyles.inputError : null,
            ]}
            onPress={onCareerPress}
          >
            <MaterialCommunityIcons
              name="school-outline"
              size={20}
              color={theme.colors.text.secondary}
              style={sharedStyles.inputIcon}
            />
            <Text
              style={[
                sharedStyles.input,
                !career && { color: theme.colors.grey[400] },
              ]}
            >
              {career
                ? CAREER_OPTIONS.find((option) => option.value === career)
                    ?.label
                : "Carrera"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color={theme.colors.grey[400]}
              style={sharedStyles.dropdownIcon}
            />
          </TouchableOpacity>
          {touched.career && errors.career ? (
            <Text style={sharedStyles.errorText}>{errors.career}</Text>
          ) : null}
        </View>
      </View>
    );
  }
);
