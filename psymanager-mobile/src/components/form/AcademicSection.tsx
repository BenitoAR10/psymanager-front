import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sharedStyles } from "../styles/styles";
import theme from "../../screens/styles/themeConstants";
import { useFaculties, useCareersByFaculty } from "../../hooks/useFaculties";

interface AcademicSectionProps {
  faculty: string;
  careerId: number | null;
  errors: { faculty?: string; career?: string };
  touched: { faculty?: boolean; career?: boolean };
  onSelectFaculty: () => void;
  onSelectCareer: () => void;
}

export const AcademicSection: React.FC<AcademicSectionProps> = React.memo(
  ({ faculty, careerId, errors, touched, onSelectFaculty, onSelectCareer }) => {
    const { data: faculties = [], isLoading: loadingFaculties } =
      useFaculties();
    const { data: careers = [], isLoading: loadingCareers } =
      useCareersByFaculty(faculty);

    const selectedFacultyLabel = faculty || "Selecciona facultad";
    const selectedCareerLabel =
      careers.find((c) => c.careerId === careerId)?.careerName ||
      "Selecciona carrera";

    return (
      <View style={sharedStyles.sectionContainer}>
        <Text style={sharedStyles.sectionTitle}>Información académica</Text>

        {/* Selector de facultad */}
        <View style={sharedStyles.inputContainer}>
          <TouchableOpacity
            style={[
              sharedStyles.inputWrapper,
              touched.faculty && errors.faculty
                ? sharedStyles.inputError
                : null,
            ]}
            onPress={onSelectFaculty}
          >
            <MaterialCommunityIcons
              name="office-building-outline"
              size={20}
              color={theme.colors.text.secondary}
              style={sharedStyles.inputIcon}
            />
            <Text
              style={[
                sharedStyles.input,
                !faculty && { color: theme.colors.grey[400] },
              ]}
            >
              {loadingFaculties ? "Cargando..." : selectedFacultyLabel}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color={theme.colors.grey[400]}
              style={sharedStyles.dropdownIcon}
            />
          </TouchableOpacity>
          {touched.faculty && errors.faculty && (
            <Text style={sharedStyles.errorText}>{errors.faculty}</Text>
          )}
        </View>

        {/* Selector de carrera */}
        <View style={sharedStyles.inputContainer}>
          <TouchableOpacity
            style={[
              sharedStyles.inputWrapper,
              touched.career && errors.career ? sharedStyles.inputError : null,
            ]}
            onPress={onSelectCareer}
            disabled={!faculty}
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
                !careerId && { color: theme.colors.grey[400] },
              ]}
            >
              {loadingCareers
                ? "Cargando..."
                : faculty
                ? selectedCareerLabel
                : "Selecciona primero una facultad"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color={theme.colors.grey[400]}
              style={sharedStyles.dropdownIcon}
            />
          </TouchableOpacity>
          {touched.career && errors.career && (
            <Text style={sharedStyles.errorText}>{errors.career}</Text>
          )}
        </View>
      </View>
    );
  }
);
