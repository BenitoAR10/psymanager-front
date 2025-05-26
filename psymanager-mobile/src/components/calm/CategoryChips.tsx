import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const CATEGORIES = ["Todos", "Mis ejercicios", "Ansiedad", "Estrés"];

interface CategoryChipsProps {
  selected: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selected,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {CATEGORIES.map((category) => {
        const isSelected = selected === category;

        return (
          <TouchableOpacity
            key={category}
            style={[styles.chip, isSelected && styles.selectedChip]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[styles.chipText, isSelected && styles.selectedChipText]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: "#007aff",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
  },
  selectedChipText: {
    color: "#fff",
    fontWeight: "600",
  },
});
