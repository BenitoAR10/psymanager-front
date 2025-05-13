import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";

// Colores consistentes con tu tema pero manteniendo los colores específicos para los horarios
const colors = {
  available: "#9AE6B4", // Verde para disponible
  reserved: "#8C9EFF", // Azul para ocupado por uno mismo
  taken: "#FEB2B2", // Rojo para ocupado por otra persona
  textPrimary: "#2A3548",
  textSecondary: "#6B7A99",
  surface: "#FFFFFF",
  border: "#E3E8EF",
};

const Legend: React.FC = () => {
  const legendItems = [
    { color: colors.available, label: "Disponible" },
    { color: colors.reserved, label: "Mis citas" },
    { color: colors.taken, label: "No disponible" },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.legendContainer}
    >
      {legendItems.map((item, index) => (
        <MotiView
          key={item.label}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 100 + index * 100, duration: 300 }}
          style={styles.legendItem}
        >
          <View style={[styles.legendDot, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>{item.label}</Text>
        </MotiView>
      ))}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: `${colors.surface}`,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
  legendText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
});

export default Legend;
