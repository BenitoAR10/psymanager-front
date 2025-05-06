import React from "react";
import { Box, Typography, useTheme, Paper } from "@mui/material";

const Legend: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        gap: { xs: 2, sm: 3 },
        alignItems: "center",
        padding: { xs: "10px 16px", sm: "12px 20px" },
        backgroundColor: theme.palette.grey[50],
        borderRadius: theme.shape.borderRadius,
        marginBottom: 2,
        border: `1px solid ${theme.palette.grey[100]}`,
        flexWrap: "wrap",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 600,
          mr: 1,
          display: { xs: "none", sm: "block" },
        }}
      ></Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            backgroundColor: theme.palette.primary.main,
            borderRadius: "3px",
            boxShadow: `0 1px 3px ${theme.palette.primary.main}30`,
          }}
        />
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.primary, fontWeight: 500 }}
        >
          Mis horarios
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            backgroundColor: theme.palette.secondary.main,
            borderRadius: "3px",
            boxShadow: `0 1px 3px ${theme.palette.secondary.main}30`,
          }}
        />
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.primary, fontWeight: 500 }}
        >
          Horarios ocupados
        </Typography>
      </Box>
    </Paper>
  );
};

export default Legend;
