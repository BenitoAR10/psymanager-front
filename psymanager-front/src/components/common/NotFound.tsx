import React from "react";
import { Box, Typography } from "@mui/material";

const NotFound: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h3" color="error" gutterBottom>
        404 - Página no encontrada
      </Typography>
      <Typography variant="body1">
        Lo sentimos, la página que buscas no existe.
      </Typography>
    </Box>
  );
};

export default NotFound;
