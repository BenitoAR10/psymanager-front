// TherapistContact.tsx
"use client";

import React, { useState } from "react";
import { View, TouchableOpacity, Animated, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import therapistContactStyles, {
  colors,
} from "../styles/therapistContactStyles";

interface Props {
  onCall?: () => void;
  onEmail?: () => void;
  onWhatsApp?: () => void;
  disabled?: boolean;
}

const TherapistContact: React.FC<Props> = ({
  onCall,
  onEmail,
  onWhatsApp,
  disabled = false,
}) => {
  // Estados para manejar la animación de presionado
  const [phonePressed, setPhonePressed] = useState(false);
  const [emailPressed, setEmailPressed] = useState(false);
  const [whatsappPressed, setWhatsappPressed] = useState(false);

  // Función para manejar la presión de los botones
  const handlePressIn = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!disabled) {
      setter(true);
    }
  };

  const handlePressOut = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!disabled) {
      setter(false);
    }
  };

  return (
    <View style={therapistContactStyles.container}>
      <View style={therapistContactStyles.contactContainer}>
        {/* Botón de teléfono */}
        <Pressable
          style={[
            therapistContactStyles.contactButton,
            therapistContactStyles.phoneButton,
            phonePressed && therapistContactStyles.pressedButton,
            disabled && therapistContactStyles.disabledButton,
          ]}
          onPress={onCall}
          onPressIn={() => handlePressIn(setPhonePressed)}
          onPressOut={() => handlePressOut(setPhonePressed)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Llamar al terapeuta"
          accessibilityHint="Toca para llamar al terapeuta por teléfono"
        >
          <MaterialCommunityIcons
            name="phone"
            size={22}
            color={colors.phone}
            style={therapistContactStyles.contactIcon}
          />
          <Text
            style={[
              therapistContactStyles.contactLabel,
              therapistContactStyles.phoneLabel,
            ]}
          >
            Llamar
          </Text>
        </Pressable>

        {/* Botón de email */}
        <Pressable
          style={[
            therapistContactStyles.contactButton,
            therapistContactStyles.emailButton,
            emailPressed && therapistContactStyles.pressedButton,
            disabled && therapistContactStyles.disabledButton,
          ]}
          onPress={onEmail}
          onPressIn={() => handlePressIn(setEmailPressed)}
          onPressOut={() => handlePressOut(setEmailPressed)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Enviar email al terapeuta"
          accessibilityHint="Toca para enviar un email al terapeuta"
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color={colors.email}
            style={therapistContactStyles.contactIcon}
          />
          <Text
            style={[
              therapistContactStyles.contactLabel,
              therapistContactStyles.emailLabel,
            ]}
          >
            Email
          </Text>
        </Pressable>

        {/* Botón de WhatsApp */}
        <Pressable
          style={[
            therapistContactStyles.contactButton,
            therapistContactStyles.whatsappButton,
            whatsappPressed && therapistContactStyles.pressedButton,
            disabled && therapistContactStyles.disabledButton,
          ]}
          onPress={onWhatsApp}
          onPressIn={() => handlePressIn(setWhatsappPressed)}
          onPressOut={() => handlePressOut(setWhatsappPressed)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Contactar por WhatsApp"
          accessibilityHint="Toca para contactar al terapeuta por WhatsApp"
        >
          <MaterialCommunityIcons
            name="whatsapp"
            size={22}
            color={colors.whatsapp}
            style={therapistContactStyles.contactIcon}
          />
          <Text
            style={[
              therapistContactStyles.contactLabel,
              therapistContactStyles.whatsappLabel,
            ]}
          >
            WhatsApp
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TherapistContact;
