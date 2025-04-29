import React from "react";
import { Box } from "@mui/material";

const Legend: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        padding: "8px 16px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        marginBottom: "8px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            backgroundColor: "#4DB6AC",
            borderRadius: "4px",
          }}
        />
        <span>Mis horarios</span>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            backgroundColor: "#64B5F6",
            borderRadius: "4px",
          }}
        />
        <span>Horarios ocupados</span>
      </Box>
    </Box>
  );
};

export default Legend;
