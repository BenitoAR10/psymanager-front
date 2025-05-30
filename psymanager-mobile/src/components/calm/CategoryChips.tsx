import type React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../screens/styles/themeConstants";

const { colors, typography, spacing, borderRadius } = theme;

const CATEGORIES = [
  { name: "Todos", icon: "plus" },
  { name: "Mis ejercicios", icon: "heart" },
  { name: "Ansiedad", icon: "emoticon-sad-outline" },
  { name: "Estrés", icon: "emoticon-neutral-outline" },
];

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
        const isSelected = selected === category.name;

        return (
          <TouchableOpacity
            key={category.name}
            style={[styles.chip, isSelected && styles.selectedChip]}
            onPress={() => onSelectCategory(category.name)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                isSelected && styles.selectedIconContainer,
              ]}
            >
              <MaterialCommunityIcons
                name={category.icon as any}
                size={20}
                color={isSelected ? "#FFFFFF" : "#718096"}
              />
            </View>
            <Text
              style={[styles.chipText, isSelected && styles.selectedChipText]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  chip: {
    alignItems: "center",
    marginRight: spacing.lg,
    minWidth: 70,
  },
  selectedChip: {},
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  selectedIconContainer: {
    backgroundColor: colors.primary.main,
  },
  chipText: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium as any,
    textAlign: "center",
  },
  selectedChipText: {
    color: colors.text.primary,
    fontWeight: typography.fontWeights.semibold as any,
  },
});
