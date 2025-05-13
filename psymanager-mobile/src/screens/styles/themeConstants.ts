// themeConstants.ts - Archivo centralizado de constantes de diseño
import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// Paleta de colores exactamente igual a la web
export const colors = {
  // Colores primarios
  primary: {
    light: "#80CBC4",
    main: "#4DB6AC",
    dark: "#00897B",
    contrastText: "#FFFFFF",
  },
  // Colores secundarios
  secondary: {
    light: "#90CAF9",
    main: "#64B5F6",
    dark: "#42A5F5",
    contrastText: "#FFFFFF",
  },
  // Colores de texto
  text: {
    primary: "#2A3548",
    secondary: "#6B7A99",
  },
  // Colores de fondo
  background: {
    default: "#F5F7FA",
    paper: "#FFFFFF",
  },
  // Colores de borde
  border: {
    light: "#EEF2F6",
    main: "#E3E8EF",
    dark: "#CDD5DF",
  },
  // Colores de estado
  success: {
    light: "#81C784",
    main: "#43A047",
    dark: "#388E3C",
  },
  error: {
    light: "#EF5350",
    main: "#E53935",
    dark: "#D32F2F",
    lightBg: "#FFEBEE",
  },
  warning: {
    light: "#FFEE58",
    main: "#FDD835",
    dark: "#FBC02D",
  },
  info: {
    light: "#4FC3F7",
    main: "#29B6F6",
    dark: "#0288D1",
  },
  // Grises
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
};

// Tipografía
export const typography = {
  fontFamily: Platform.select({
    ios: "Poppins, System",
    android: "Poppins, Roboto",
    default: "Poppins, System",
  }),
  fontWeights: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
};

// Espaciado
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
};

// Bordes
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Sombras
export const shadows = Platform.select({
  ios: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
  },
  android: {
    sm: { elevation: 1 },
    md: { elevation: 3 },
    lg: { elevation: 6 },
  },
  default: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
  },
});

// Dimensiones de pantalla
export const dimensions = {
  width,
  height,
  maxWidth: 428, // iPhone 12 Pro Max width
};

// Animaciones
export const animations = {
  durations: {
    fast: 300,
    normal: 500,
    slow: 700,
  },
  types: {
    spring: "spring",
    timing: "timing",
  },
};

// Exportar todo como un objeto theme
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  dimensions,
  animations,
};

export default theme;
