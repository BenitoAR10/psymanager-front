import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#80CBC4",
      main: "#4DB6AC",
      dark: "#00897B",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#90CAF9",
      main: "#64B5F6",
      dark: "#42A5F5",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F5F7FA",
      paper: "#ffffff",
    },
    text: {
      primary: "#2A3548",
      secondary: "#6B7A99",
    },
    error: {
      light: "#EF5350",
      main: "#E53935",
      dark: "#D32F2F",
    },
    warning: {
      light: "#FFEE58",
      main: "#FDD835",
      dark: "#FBC02D",
    },
    success: {
      light: "#81C784",
      main: "#43A047",
      dark: "#388E3C",
    },
    info: {
      light: "#4FC3F7",
      main: "#29B6F6",
      dark: "#0288D1",
    },
    grey: {
      50: "#F8FAFC",
      100: "#EEF2F6",
      200: "#E3E8EF",
      300: "#CDD5DF",
      400: "#9AA4B8",
      500: "#6B7A99",
      600: "#4A5568",
      700: "#2D3748",
      800: "#1A202C",
      900: "#171923",
    },
    divider: "rgba(0, 0, 0, 0.06)",
  },
  typography: {
    fontFamily: ["Poppins", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.57,
      color: "#6B7A99",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.66,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.66,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.5px",
      lineHeight: 2.5,
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 4px 8px rgba(0, 0, 0, 0.05)",
    "0px 8px 16px rgba(0, 0, 0, 0.05)",
    "0px 12px 24px rgba(0, 0, 0, 0.05)",
    "0px 16px 32px rgba(0, 0, 0, 0.05)",
    "0px 20px 40px rgba(0, 0, 0, 0.05)",
    "0px 24px 48px rgba(0, 0, 0, 0.05)",
    "0px 28px 56px rgba(0, 0, 0, 0.05)",
    "0px 32px 64px rgba(0, 0, 0, 0.05)",
    "0px 36px 72px rgba(0, 0, 0, 0.05)",
    "0px 40px 80px rgba(0, 0, 0, 0.05)",
    "0px 44px 88px rgba(0, 0, 0, 0.05)",
    "0px 48px 96px rgba(0, 0, 0, 0.05)",
    "0px 52px 104px rgba(0, 0, 0, 0.05)",
    "0px 56px 112px rgba(0, 0, 0, 0.05)",
    "0px 60px 120px rgba(0, 0, 0, 0.05)",
    "0px 64px 128px rgba(0, 0, 0, 0.05)",
    "0px 68px 136px rgba(0, 0, 0, 0.05)",
    "0px 72px 144px rgba(0, 0, 0, 0.05)",
    "0px 76px 152px rgba(0, 0, 0, 0.05)",
    "0px 80px 160px rgba(0, 0, 0, 0.05)",
    "0px 84px 168px rgba(0, 0, 0, 0.05)",
    "0px 88px 176px rgba(0, 0, 0, 0.05)",
    "0px 92px 184px rgba(0, 0, 0, 0.05)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 16px",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.12)",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#3DA599",
          },
        },
        text: {
          padding: "8px 12px",
        },
        textPrimary: {
          color: "#4DB6AC",
          "&:hover": {
            backgroundColor: "rgba(77, 182, 172, 0.08)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
        outlinedPrimary: {
          borderColor: "#4DB6AC",
          "&:hover": {
            borderColor: "#3DA599",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        },
        elevation1: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        },
        elevation2: {
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.06)",
        },
        elevation3: {
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: 0,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          "&:last-child": {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        filled: {
          backgroundColor: "#EEF2F6",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#E3E8EF",
          color: "#6B7A99",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.85rem",
          fontWeight: 400,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: 8,
          padding: "8px 12px",
        },
        arrow: {
          color: "rgba(0, 0, 0, 0.8)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 8,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
  },
});

export default theme;
