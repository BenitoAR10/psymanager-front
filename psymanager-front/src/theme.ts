import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2D65A7",
    },
    secondary: {
      main: "#C9242B",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: ["Poppins", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    // Puedes añadir h4, h5, etc. si lo requieres
  },
  shape: {
    borderRadius: 8, // Borde redondeado en componentes (cards, botones, etc.)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Evita que el texto se ponga en mayúsculas
          // Puedes ajustar padding, borderRadius, etc.
        },
      },
    },
    // Ejemplo si quisieras modificar Cards, AppBar, etc.
    // MuiCard: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: 16,
    //     },
    //   },
    // },
  },
});

export default theme;
