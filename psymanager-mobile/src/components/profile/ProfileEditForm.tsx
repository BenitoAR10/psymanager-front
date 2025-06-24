"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { theme } from "../../screens/styles/themeConstants";
import type { UserProfileDto } from "../../types/userTypes";
import { useToast } from "react-native-toast-notifications";
import { useUpdateUserProfile } from "../../hooks/useUpdateUserProfile";
import dayjs from "dayjs";

const { colors, spacing, borderRadius, typography, shadows } = theme;

interface Props {
  profile: UserProfileDto;
}

const ProfileEditForm: React.FC<Props> = ({ profile }) => {
  const [form, setForm] = useState({
    phoneNumber: profile.phoneNumber || "",
    address: profile.address || "",
    identityGender: profile.identityGender || "",
  });
  const [isModified, setIsModified] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [phoneError, setPhoneError] = useState<string>("");
  const { mutateAsync: updateProfile } = useUpdateUserProfile();
  const toast = useToast();

  const formattedDate = dayjs(profile.birthDate).format("DD/MM/YYYY");

  useEffect(() => {
    setIsModified(
      form.phoneNumber !== profile.phoneNumber ||
        form.address !== profile.address ||
        form.identityGender !== profile.identityGender
    );
  }, [form, profile]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    // Si el teléfono no tiene exactamente 8 dígitos, mostramos error y no seguimos
    if (form.phoneNumber.length < 8) {
      setPhoneError("El teléfono debe tener exactamente 8 dígitos");
      return;
    }

    try {
      await updateProfile(form);
      toast.show("Perfil actualizado correctamente.", { type: "success" });
      setIsModified(false);
    } catch (error: any) {
      toast.show(error.message || "Error al actualizar perfil.", {
        type: "danger",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Información en dos columnas */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 500, delay: 100 }}
        style={styles.mainCard}
      >
        {/* Fila 1: Nombre y Apellido */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Nombre(s)</Text>
            <View style={styles.readOnlyContainer}>
              <Text style={styles.readOnlyText}>{profile.firstName}</Text>
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Apellido(s)</Text>
            <View style={styles.readOnlyContainer}>
              <Text style={styles.readOnlyText}>{profile.lastName}</Text>
            </View>
          </View>
        </View>

        {/* Fila 2: Email */}
        <View style={styles.fullField}>
          <Text style={styles.label}>Email institucional</Text>
          <View style={styles.readOnlyContainer}>
            <MaterialCommunityIcons
              name="email"
              size={16}
              color={colors.text.secondary}
              style={styles.fieldIcon}
            />
            <Text style={styles.readOnlyText}>{profile.email}</Text>
          </View>
        </View>

        {/* Fila 3: Fecha de nacimiento y CI */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <View style={styles.readOnlyContainer}>
              <Text style={styles.readOnlyText}>{formattedDate}</Text>
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>CI</Text>
            <View style={styles.readOnlyContainer}>
              <Text style={styles.readOnlyText}>{profile.ciNumber}</Text>
            </View>
          </View>
        </View>
        {/* Fila 5: Género */}
        <View style={styles.fullField}>
          <Text style={styles.label}>Género</Text>
          <View style={styles.readOnlyContainer}>
            <MaterialCommunityIcons
              name="gender-male-female"
              size={16}
              color={colors.text.secondary}
              style={styles.fieldIcon}
            />
            <Text style={styles.readOnlyText}>
              {profile.identityGender || "No especificado"}
            </Text>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>Información editable</Text>
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.fullField}>
          <View style={styles.editableLabelContainer}>
            <Text style={styles.editableLabel}>Teléfono</Text>
            <MaterialCommunityIcons
              name="phone"
              size={14}
              color={colors.primary.main}
            />
          </View>
          <View
            style={[
              styles.inputContainer,
              focusedField === "phoneNumber" && styles.inputContainerFocused,
              phoneError && styles.inputError, // cambiar borde si hay error
            ]}
          >
            <MaterialCommunityIcons
              name="phone"
              size={16}
              color={colors.text.secondary}
              style={styles.fieldIcon}
            />
            <TextInput
              style={styles.input}
              value={form.phoneNumber}
              keyboardType="number-pad"
              maxLength={8}
              placeholder="Ej: 70123456"
              placeholderTextColor={colors.grey[400]}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, "").slice(0, 8);
                handleChange("phoneNumber", digits);
                // limpiar error si alcanza 8 dígitos
                if (digits.length === 8) {
                  setPhoneError("");
                }
              }}
              onFocus={() => setFocusedField("phoneNumber")}
              onBlur={() => {
                setFocusedField(null);
                // validar longitud mínima
                if (form.phoneNumber.length < 8) {
                  setPhoneError("El teléfono debe tener exactamente 8 dígitos");
                } else {
                  setPhoneError("");
                }
              }}
            />
          </View>
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}
        </View>

        {/* Fila 6: Dirección */}
        <View style={styles.fullField}>
          <View style={styles.editableLabelContainer}>
            <Text style={styles.editableLabel}>Dirección</Text>
            <MaterialCommunityIcons
              name="pencil"
              size={14}
              color={colors.primary.main}
            />
          </View>
          <View
            style={[
              styles.inputContainer,
              focusedField === "address" && styles.inputContainerFocused,
            ]}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color={colors.text.secondary}
              style={styles.fieldIcon}
            />
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={(text) => handleChange("address", text)}
              placeholder="Ej: Av. Siempre Viva 123, La Paz"
              placeholderTextColor={colors.grey[400]}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>
      </MotiView>

      {/* Botón de guardar */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 500, delay: 200 }}
        style={styles.buttonContainer}
      >
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={!isModified || !!phoneError}
          style={[styles.saveButton, !isModified && styles.saveButtonDisabled]}
          labelStyle={styles.saveButtonLabel}
          icon="content-save-outline"
          contentStyle={styles.saveButtonContent}
        >
          {isModified ? "Guardar cambios" : "Sin cambios"}
        </Button>

        {isModified && (
          <View style={styles.changeIndicator}>
            <MaterialCommunityIcons
              name="circle"
              size={6}
              color={colors.warning.main}
            />
            <Text style={styles.changeIndicatorText}>Cambios pendientes</Text>
          </View>
        )}
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: spacing.md,
  },
  headerContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  mainCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  row: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: spacing.md,
  },
  halfField: {
    flex: 0.48,
  },
  fullField: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium as any,
    marginBottom: spacing.xs,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  editableLabelContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: spacing.xs,
  },
  editableLabel: {
    fontSize: typography.sizes.xs,
    color: colors.primary.main,
    fontWeight: typography.fontWeights.medium as any,
    marginRight: spacing.xs,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  readOnlyContainer: {
    backgroundColor: colors.grey[50],
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    minHeight: 44,
  },
  readOnlyText: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeights.regular as any,
    flex: 1,
  },
  inputContainer: {
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.main,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  inputContainerFocused: {
    borderColor: colors.primary.main,
    backgroundColor: colors.background.paper,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeights.regular as any,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  fieldIcon: {
    marginRight: spacing.sm,
  },
  separator: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginVertical: spacing.lg,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.main,
  },
  separatorText: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium as any,
    marginHorizontal: spacing.md,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    marginTop: "auto" as const,
  },
  saveButton: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.main,
    ...shadows.md,
  },
  saveButtonDisabled: {
    backgroundColor: colors.grey[300],
  },
  saveButtonContent: {
    paddingVertical: spacing.xs,
  },
  saveButtonLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.primary.contrastText,
  },
  changeIndicator: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: spacing.sm,
  },
  changeIndicatorText: {
    fontSize: typography.sizes.xs,
    color: colors.warning.main,
    marginLeft: spacing.xs,
    fontWeight: typography.fontWeights.medium as any,
  },
  errorText: {
    color: colors.error.main,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
    fontWeight: typography.fontWeights.medium as any,
  },
  inputError: {
    borderColor: colors.error.main,
    borderWidth: 2,
  },
});

export default ProfileEditForm;
