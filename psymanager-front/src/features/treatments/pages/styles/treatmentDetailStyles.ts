import {
  styled,
  TableCell,
  TableRow,
  tableCellClasses,
  alpha,
  type Theme,
} from "@mui/material";

// Estilos personalizados para las celdas de la tabla
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "12px 16px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.875rem",
    padding: "12px 16px",
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.background.default, 0.4),
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  "&.completed": {
    backgroundColor: alpha(theme.palette.success.main, 0.08),
    "&:hover": {
      backgroundColor: alpha(theme.palette.success.main, 0.12),
    },
  },
}));

// Objeto con todos los estilos organizados por secciones
export const styles = {
  // Estilos para el contenedor principal
  container: {
    p: { xs: 2, md: 4 },
  },

  // Estilos para estados de carga y error
  loadingContainer: {
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  errorContainer: {
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
    textAlign: "center",
  },
  errorPaper: (theme: Theme) => ({
    p: 4,
    borderRadius: 2,
    border: "1px solid",
    borderColor: alpha(theme.palette.error.main, 0.2),
    bgcolor: alpha(theme.palette.error.main, 0.05),
    maxWidth: 500,
  }),

  // Estilos para el encabezado
  header: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", md: "center" },
    mb: 4,
    gap: 2,
  },
  headerTitle: (theme: Theme) => ({
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -8,
      left: 0,
      width: 60,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.palette.primary.main,
    },
  }),
  headerSubtitle: {
    mt: 2,
  },
  headerActions: {
    display: "flex",
    gap: 2,
  },
  closeButton: (theme: Theme) => ({
    borderRadius: 2,
    fontWeight: 600,
    borderWidth: "1.5px",
    "&:hover": {
      borderWidth: "1.5px",
      bgcolor: alpha(theme.palette.error.main, 0.05),
    },
  }),
  addButton: (theme: Theme) => ({
    borderRadius: 2,
    fontWeight: 600,
    boxShadow: theme.shadows[2],
    "&:hover": {
      boxShadow: theme.shadows[4],
    },
  }),

  // Estilos para la tarjeta de detalles
  detailsCard: (theme: Theme) => ({
    mb: 4,
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: theme.shadows[2],
      borderColor: alpha(theme.palette.primary.main, 0.2),
    },
  }),
  cardHeader: (theme: Theme) => ({
    bgcolor: alpha(theme.palette.primary.main, 0.05),
    py: 2,
    px: 3,
    borderBottom: "1px solid",
    borderColor: "divider",
  }),
  cardContent: {
    p: 0,
  },
  cardGridItem: {
    p: 3,
    borderRight: { xs: "none", md: "1px solid" },
    borderBottom: { xs: "1px solid", md: "none" },
    borderColor: "divider",
  },
  cardGridItemRight: {
    p: 3,
  },
  infoItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
  },
  infoIcon: (theme: Theme) => ({
    color: theme.palette.primary.main,
    mt: 0.5,
    fontSize: "1.2rem",
  }),

  // Estilos para la sección de sesiones
  sessionsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  },
  sessionsTitle: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  noSessionsContainer: (theme: Theme) => ({
    p: 4,
    textAlign: "center",
    borderRadius: 3,
    border: "1px dashed",
    borderColor: "divider",
    bgcolor: alpha(theme.palette.background.default, 0.5),
  }),
  noSessionsText: {
    mb: 3,
    maxWidth: 500,
    mx: "auto",
  },
  sessionsTableContainer: {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    overflow: "hidden",
    mb: 4,
  },
  tableScrollContainer: (theme: Theme) => ({
    width: "100%",
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.grey[300],
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: theme.palette.grey[400],
    },
  }),
  table: {
    minWidth: 800,
  },
  sessionOrderCell: {
    fontWeight: 600,
  },
  dateTimeCell: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  dateTimeIcon: (theme: Theme) => ({
    color: theme.palette.primary.main,
    opacity: 0.7,
  }),
  statusChip: {
    fontWeight: 600,
    fontSize: "0.7rem",
    height: 24,
    "& .MuiChip-label": {
      px: 1,
    },
  },
  noteButton: {
    borderRadius: 1.5,
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.75rem",
    py: 0.5,
  },
  actionButton: (theme: Theme, color: "error" | "success") => ({
    bgcolor: alpha(theme.palette[color].main, 0.1),
    "&:hover": {
      bgcolor: alpha(theme.palette[color].main, 0.2),
    },
  }),

  // Estilos para diálogos
  dialogPaper: (theme: Theme) => ({
    borderRadius: 2,
    boxShadow: theme.shadows[3],
  }),
  dialogTitle: {
    fontWeight: 600,
  },
  dialogActions: {
    p: 2,
    pt: 0,
  },
  cancelButton: {
    borderRadius: 1.5,
    fontWeight: 500,
  },
  confirmButton: (theme: Theme) => ({
    borderRadius: 1.5,
    fontWeight: 600,
    boxShadow: "none",
    "&:hover": {
      boxShadow: theme.shadows[2],
    },
  }),
};
