import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import theme from "../../screens/styles/themeConstants";

interface DatePickerModalProps {
  visible: boolean;
  date: Date | null;
  onClose: () => void;
  onChange: (event: any, date?: Date) => void;
  onConfirm: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  date,
  onClose,
  onChange,
  onConfirm,
}) => {
  if (!visible) return null;

  // Android: cerrar automáticamente cuando se selecciona fecha
  if (Platform.OS === "android") {
    return (
      <DateTimePicker
        value={date || new Date(2000, 0, 1)}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          // Siempre cerrar
          onClose();

          // Si el usuario no canceló (cancel = event.type === "dismissed")
          if (event.type !== "dismissed" && selectedDate) {
            onChange(event, selectedDate);
          }
        }}
        maximumDate={new Date()}
        minimumDate={new Date(1920, 0, 1)}
      />
    );
  }

  // iOS: mostrar el modal y botones
  return (
    <View style={styles.datePickerContainer}>
      <View style={styles.datePickerHeader}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.datePickerCancelButton}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onConfirm}>
          <Text style={styles.datePickerDoneButton}>Listo</Text>
        </TouchableOpacity>
      </View>
      <DateTimePicker
        value={date || new Date(2000, 0, 1)}
        mode="date"
        display="spinner"
        onChange={onChange}
        maximumDate={new Date()}
        minimumDate={new Date(1920, 0, 1)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    backgroundColor: theme.colors.background.paper,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...theme.shadows.lg,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[200],
  },
  datePickerCancelButton: {
    color: theme.colors.error.main,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  datePickerDoneButton: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
});
