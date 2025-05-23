"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  alpha,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SubjectIcon from "@mui/icons-material/Subject";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { useCloseTreatmentMutation } from "../hooks/useCloseTreatmentMutation";

interface CloseTreatmentModalProps {
  open: boolean;
  onClose: () => void;
  treatmentId: number;
}

const CloseTreatmentModal: React.FC<CloseTreatmentModalProps> = ({
  open,
  onClose,
  treatmentId,
}) => {
  const theme = useTheme();
  const [reason, setReason] = useState("");
  const [date] = useState(dayjs().format("YYYY-MM-DD"));

  const navigate = useNavigate();

  const mutation = useCloseTreatmentMutation(treatmentId);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      toast.warning("Por favor, indica un motivo para el cierre.");
      return;
    }

    try {
      await mutation.mutateAsync({ reason, closingDate: date });
      toast.success("Tratamiento cerrado exitosamente.");
      onClose();

      setTimeout(() => {
        navigate("/dashboard/estudiantes");
      }, 1500); // Espera 1.5 segundos para que el toast se vea
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "response" in e) {
        const err = e as { response?: { data?: { message?: string } } };
        toast.error(
          err.response?.data?.message || "Error al cerrar tratamiento."
        );
      } else {
        toast.error("Error inesperado al cerrar tratamiento.");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={mutation.isPending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          overflow: "hidden",
        },
      }}
    >
      {/* Encabezado mejorado */}
      <Box
        sx={{
          p: 0,
          m: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            pb: 1.5,
            backgroundColor: alpha(theme.palette.error.main, 0.05),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.error.main,
                color: "#fff",
              }}
            >
              <EventBusyIcon />
            </Box>
            <Typography variant="h6" component="div" fontWeight={600}>
              Cerrar tratamiento
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={mutation.isPending}
            sx={{
              color: theme.palette.grey[500],
              "&:hover": {
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 3, pt: 2.5 }}>
        <Alert
          severity="warning"
          variant="outlined"
          icon={<WarningAmberIcon />}
          sx={{
            mb: 3,
            borderRadius: 2,
            borderWidth: "1.5px",
            "& .MuiAlert-icon": {
              color: theme.palette.warning.main,
            },
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            ¿Estás seguro que deseas cerrar este tratamiento?
          </Typography>
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <SubjectIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" color="text.primary">
              Motivo del cierre
            </Typography>
          </Box>
          <TextField
            multiline
            fullWidth
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={mutation.isPending}
            placeholder="Describe el motivo por el cual se cierra este tratamiento..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused": {
                  boxShadow: `0 0 0 2px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                },
              },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CalendarTodayIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" color="text.primary">
              Fecha de cierre
            </Typography>
          </Box>
          <TextField
            type="date"
            fullWidth
            value={date}
            disabled
            InputProps={{
              readOnly: true,
              sx: {
                bgcolor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 2,
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5, ml: 1 }}
          >
            La fecha de cierre se establece automáticamente al día de hoy
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          disabled={mutation.isPending}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            borderWidth: "1.5px",
            "&:hover": {
              borderWidth: "1.5px",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={mutation.isPending}
          color="error"
          startIcon={
            mutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CheckCircleIcon />
            )
          }
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: theme.shadows[2],
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          {mutation.isPending ? "Procesando..." : "Confirmar cierre"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseTreatmentModal;
