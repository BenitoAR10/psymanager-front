import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Button } from "react-native-paper";
import { MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useFaculties, useCareersByFaculty } from "../../hooks/useFaculties";

import { Header } from "../../components/form/Header";
import { ProgressIndicator } from "../../components/form/ProgressIndicator";
import { DocumentSection } from "../../components/form/DocumentSection";
import { PersonalDataSection } from "../../components/form/PersonalDataSection";
import { AcademicSection } from "../../components/form/AcademicSection";
import { DatePickerModal } from "../../components/modals/DatePickerModal";
import { useFormState } from "../../hooks/useFormState";
import { useKeyboardVisibility } from "../../hooks/useKeyboardVisibility";
import theme from "../../screens/styles/themeConstants";
import { styles } from "../../components/styles/styles";
import { CustomSelector } from "../../components/form/CustomSelector";
import {
  GENDER_OPTIONS,
  IDENTITY_GENDER_OPTIONS,
  CI_EXTENSION_OPTIONS,
} from "../../utils/constants";

const RegisterStep2Screen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { keyboardVisible } = useKeyboardVisibility();

  const {
    formState,
    errors,
    touched,
    loading,
    showDatePicker,
    showGenderPicker,
    showIdentityGenderPicker,
    showExtensionPicker,
    showCareerPicker,
    handleInputChange,
    handleBlur,
    handleDateChange,
    setShowDatePicker,
    setShowGenderPicker,
    setShowIdentityGenderPicker,
    setShowExtensionPicker,
    setShowCareerPicker,
    handleCompleteProfile,
  } = useFormState(navigation);
  const [showFacultyPicker, setShowFacultyPicker] = useState(false);

  const { data: faculties = [] } = useFaculties();
  const { data: careers = [] } = useCareersByFaculty(formState.faculty);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          keyboardVisible
            ? { justifyContent: "flex-start", paddingTop: 20 }
            : {},
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: theme.animations.durations.normal,
          }}
          style={styles.formContainer}
        >
          <Header />
          <ProgressIndicator />

          <View style={styles.inputsContainer}>
            <DocumentSection
              ciNumber={formState.ciNumber}
              ciComplement={formState.ciComplement}
              ciExtension={formState.ciExtension}
              errors={errors}
              touched={touched}
              onChangeText={handleInputChange}
              onBlur={handleBlur}
              onExtensionPress={() => setShowExtensionPicker(true)}
            />

            <PersonalDataSection
              birthDate={formState.birthDate}
              birthGender={formState.birthGender}
              identityGender={formState.identityGender}
              address={formState.address}
              phoneNumber={formState.phoneNumber}
              errors={errors}
              touched={touched}
              onChangeText={handleInputChange}
              onBlur={handleBlur}
              onDatePress={() => setShowDatePicker(true)}
              onGenderPress={() => setShowGenderPicker(true)}
              onIdentityGenderPress={() => setShowIdentityGenderPicker(true)}
            />

            <AcademicSection
              faculty={formState.faculty}
              careerId={formState.careerId}
              errors={errors}
              touched={touched}
              onSelectFaculty={() => setShowFacultyPicker(true)}
              onSelectCareer={() => setShowCareerPicker(true)}
            />

            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "timing",
                duration: theme.animations.durations.fast,
                delay: 400,
              }}
              style={styles.buttonContainer}
            >
              <Button
                mode="contained"
                onPress={handleCompleteProfile}
                loading={loading}
                disabled={loading}
                style={styles.registerButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                buttonColor={theme.colors.primary.main}
              >
                {loading ? "Finalizando..." : "Finalizar registro"}
              </Button>
            </MotiView>
          </View>
        </MotiView>
      </ScrollView>

      <DatePickerModal
        visible={showDatePicker}
        date={formState.birthDate}
        onClose={() => setShowDatePicker(false)}
        onChange={handleDateChange}
        onConfirm={() => {
          setShowDatePicker(false);
          if (touched.birthDate) {
            handleBlur("birthDate");
          }
        }}
      />

      <CustomSelector
        visible={showGenderPicker}
        title="Selecciona tu género biológico"
        options={GENDER_OPTIONS}
        selectedValue={formState.birthGender}
        onSelect={(value) => handleInputChange("birthGender", value)}
        onClose={() => setShowGenderPicker(false)}
      />

      <CustomSelector
        visible={showIdentityGenderPicker}
        title="Selecciona tu género de identidad"
        options={IDENTITY_GENDER_OPTIONS}
        selectedValue={formState.identityGender}
        onSelect={(value) => handleInputChange("identityGender", value)}
        onClose={() => setShowIdentityGenderPicker(false)}
      />

      <CustomSelector
        visible={showExtensionPicker}
        title="Selecciona la extensión de tu CI"
        options={CI_EXTENSION_OPTIONS}
        selectedValue={formState.ciExtension}
        onSelect={(value) => handleInputChange("ciExtension", value)}
        onClose={() => setShowExtensionPicker(false)}
      />

      <CustomSelector
        visible={showFacultyPicker}
        title="Selecciona tu facultad"
        options={faculties.map((f) => ({ label: f, value: f }))}
        selectedValue={formState.faculty}
        onSelect={(value) => handleInputChange("faculty", value)}
        onClose={() => setShowFacultyPicker(false)}
      />

      <CustomSelector
        visible={showCareerPicker}
        title="Selecciona tu carrera"
        options={careers.map((c) => ({
          label: c.careerName,
          value: String(c.careerId),
        }))}
        selectedValue={formState.careerId ? String(formState.careerId) : ""}
        onSelect={(value) => handleInputChange("careerId", Number(value))}
        onClose={() => setShowCareerPicker(false)}
      />

      {/* Importamos y renderizamos los selectores modales */}
      {/* Estos se importarán desde sus respectivos archivos */}
    </KeyboardAvoidingView>
  );
};

export default RegisterStep2Screen;
