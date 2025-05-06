import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      mt: 4,
      py: 2,
      textAlign: "center",
      borderTop: "1px solid",
      borderColor: "divider",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} PSI UCB. Todos los derechos reservados.
    </Typography>
  </Box>
);

export default Footer;
