// src/components/CustomSelector.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Platform,
} from "react-native";
import { Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../screens/styles/themeConstants";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectorProps {
  visible: boolean;
  title: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export const CustomSelector: React.FC<CustomSelectorProps> = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.selectorContainer}>
          <View style={styles.selectorHeader}>
            <Text style={styles.selectorTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          <Divider style={styles.selectorDivider} />

          <FlatList
            data={options.filter((option) => option.value !== "")}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <Text style={styles.optionLabel}>{item.label}</Text>
                {selectedValue === item.value && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={theme.colors.primary.main}
                  />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <Divider style={styles.optionDivider} />
            )}
            contentContainerStyle={styles.optionsList}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  selectorContainer: {
    backgroundColor: theme.colors.background.paper,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: "70%",
    ...theme.shadows.lg,
  },
  selectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  selectorTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.fontWeights.semibold as any,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  selectorDivider: {
    backgroundColor: theme.colors.grey[200],
  },
  optionsList: {
    paddingBottom: Platform.OS === "ios" ? 40 : 0,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  optionLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  optionDivider: {
    backgroundColor: theme.colors.grey[100],
  },
});
