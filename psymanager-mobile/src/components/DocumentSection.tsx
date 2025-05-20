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
import { CI_EXTENSION_OPTIONS } from "../utils/constants";

// En DocumentSection.tsx
import { FormState, FormTouched } from "../services/hooks/useFormState";

interface DocumentSectionProps {
  ciNumber: string;
  ciComplement: string;
  ciExtension: string;
  errors: { ciNumber: string };
  touched: { ciNumber: boolean };
  onChangeText: (name: keyof FormState, value: any) => void;
  onBlur: (field: keyof FormTouched) => void;
  onExtensionPress: () => void;
}
export const DocumentSection: React.FC<DocumentSectionProps> = React.memo(
  ({
    ciNumber,
    ciComplement,
    ciExtension,
    errors,
    touched,
    onChangeText,
    onBlur,
    onExtensionPress,
  }) => {
    const ciComplementInputRef = useRef<RNTextInput>(null);

    return (
      <>
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.sectionTitle}>Documento de identidad</Text>

          <View style={styles.ciContainer}>
            {/* Campo de número de CI */}
            <View style={[styles.ciNumberContainer, { flex: 2 }]}>
              <View
                style={[
                  sharedStyles.inputWrapper,
                  touched.ciNumber && errors.ciNumber
                    ? sharedStyles.inputError
                    : null,
                ]}
              >
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={sharedStyles.inputIcon}
                />
                <RNTextInput
                  placeholder="Número de CI"
                  keyboardType="numeric"
                  style={sharedStyles.input}
                  value={ciNumber}
                  onChangeText={(text) => onChangeText("ciNumber", text)}
                  onBlur={() => onBlur("ciNumber")}
                  onSubmitEditing={() => ciComplementInputRef.current?.focus()}
                  returnKeyType="next"
                  placeholderTextColor={theme.colors.grey[400]}
                />
              </View>
              {touched.ciNumber && errors.ciNumber ? (
                <Text style={sharedStyles.errorText}>{errors.ciNumber}</Text>
              ) : null}
            </View>

            {/* Campo de complemento de CI */}
            <View
              style={[
                styles.ciComplementContainer,
                { flex: 1, marginHorizontal: theme.spacing.sm },
              ]}
            >
              <View style={sharedStyles.inputWrapper}>
                <RNTextInput
                  ref={ciComplementInputRef}
                  placeholder="Comp."
                  style={sharedStyles.input}
                  value={ciComplement}
                  onChangeText={(text) => onChangeText("ciComplement", text)}
                  returnKeyType="next"
                  placeholderTextColor={theme.colors.grey[400]}
                />
              </View>
            </View>

            {/* Campo de extensión de CI */}
            <View style={[styles.ciExtensionContainer, { flex: 1 }]}>
              <TouchableOpacity
                style={sharedStyles.inputWrapper}
                onPress={onExtensionPress}
              >
                <Text
                  style={[
                    sharedStyles.input,
                    !ciExtension && { color: theme.colors.grey[400] },
                  ]}
                >
                  {ciExtension || "Ext."}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.grey[400]}
                  style={sharedStyles.dropdownIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Divider style={sharedStyles.divider} />
      </>
    );
  }
);

import { ViewStyle } from "react-native";

const styles: {
  ciContainer: ViewStyle;
  ciNumberContainer: ViewStyle;
  ciComplementContainer: ViewStyle;
  ciExtensionContainer: ViewStyle;
} = {
  ciContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ciNumberContainer: {
    flex: 2,
  },
  ciComplementContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  ciExtensionContainer: {
    flex: 1,
  },
};
