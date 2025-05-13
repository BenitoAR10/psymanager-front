import { alpha, type Theme } from "@mui/material";

// Estilos para el componente ScheduleSessionsModal
export const scheduleSessionsModalStyles = (theme: Theme) => ({
  dialog: {
    paper: {
      elevation: 3,
      borderRadius: 3,
      overflow: "hidden",
      maxHeight: "90vh",
    },
  },
  dialogTitle: {
    p: 0,
    bgcolor: "background.paper",
  },
  headerBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    p: 2,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
  closeButton: {
    color: "text.secondary",
    "&:hover": {
      bgcolor: alpha(theme.palette.grey[500], 0.1),
    },
  },
  searchFilterBox: {
    px: 2,
    py: 1.5,
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: alpha(theme.palette.background.default, 0.5),
  },
  searchInput: {
    borderRadius: 2,
    bgcolor: "background.paper",
  },
  filterButton: (showFilters: boolean) => ({
    bgcolor: showFilters
      ? alpha(theme.palette.primary.main, 0.1)
      : "transparent",
  }),
  selectAllButton: {
    borderRadius: 2,
    textTransform: "none",
    ml: "auto",
  },
  dialogContent: {
    p: 0,
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.grey[300],
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: theme.palette.grey[400],
    },
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 6,
    px: 3,
    gap: 2,
  },
  errorBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 6,
    px: 3,
    gap: 2,
  },
  errorIconBox: {
    width: 56,
    height: 56,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    mb: 1,
  },
  emptyBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 6,
    px: 3,
    gap: 2,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.main,
    mb: 1,
  },
  retryButton: {
    borderRadius: 2,
  },
  dateHeaderBox: {
    px: 3,
    py: 1.5,
    bgcolor: alpha(theme.palette.background.default, 0.7),
    borderBottom: "1px solid",
    borderColor: "divider",
    display: "flex",
    alignItems: "center",
    gap: 1,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  dateChip: {
    ml: "auto",
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    fontWeight: 500,
  },
  listItemButton: {
    py: 1.5,
    px: 3,
    borderBottom: "1px solid",
    borderColor: alpha(theme.palette.divider, 0.5),
    "&.Mui-selected": {
      bgcolor: alpha(theme.palette.primary.main, 0.08),
      "&:hover": {
        bgcolor: alpha(theme.palette.primary.main, 0.12),
      },
    },
  },
  checkbox: {
    mr: 1,
  },
  timeBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  footerBox: {
    px: 3,
    py: 2,
    borderTop: "1px solid",
    borderColor: "divider",
    bgcolor: alpha(theme.palette.background.default, 0.7),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelButton: {
    borderRadius: 2,
    px: 3,
    borderColor: alpha(theme.palette.grey[500], 0.2),
    color: "text.secondary",
    "&:hover": {
      borderColor: alpha(theme.palette.grey[500], 0.3),
      bgcolor: alpha(theme.palette.grey[500], 0.05),
    },
  },
  confirmButton: {
    borderRadius: 2,
    px: 3,
    boxShadow: theme.shadows[2],
    "&:hover": {
      boxShadow: theme.shadows[4],
    },
    minWidth: 180,
  },
});
