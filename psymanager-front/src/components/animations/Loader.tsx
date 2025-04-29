import React from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";

const Loader: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <motion.div
        style={{
          width: 50,
          height: 50,
          border: "5px solid #ccc",
          borderTop: "5px solid #4DB6AC",
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{ ease: "linear", duration: 1, repeat: Infinity }}
      />
    </Box>
  );
};

export default Loader;
