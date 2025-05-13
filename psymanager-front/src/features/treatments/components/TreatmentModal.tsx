"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Box,
  IconButton,
  useTheme,
  alpha,
  Divider,
  Alert,
  Fade,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useCreateTreatmentMutation } from "../../dashboard/hooks/useCreateTreatmentMutation";
import ScheduleSessionsModal from "./ScheduleSessionsModal";
import { toast } from "sonner";

interface TreatmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  patientId: number;
  therapistId: number;
  patientName?: string;
}

function getLocalISOStringWithoutZ(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

const TreatmentModal: React.FC<TreatmentModalProps> = ({
  open,
  onClose,
  onSuccess,
  patientId,
  therapistId,
  patientName = "hola",
}) => {
  const theme = useTheme();
  const [reason, setReason] = useState("");
  const [semester, setSemester] = useState("");
  const [createdTreatmentId, setCreatedTreatmentId] = useState<number | null>(
    null
  );
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const createMutation = useCreateTreatmentMutation();

  const handleCreate = async () => {
    try {
      const response = await createMutation.mutateAsync({
        patientId,
        therapistId,
        reason,
        semester,
        firstSessionDateTime: getLocalISOStringWithoutZ(new Date()),
        recurrent: false,
      });

      setCreatedTreatmentId(response.id);
      setSuccessMessage(true);
      toast.success("Tratamiento creado exitosamente");

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al crear tratamiento:", error);
      toast.error("Hubo un error al crear el tratamiento");
    }
  };

  const handleCloseAll = () => {
    setReason("");
    setSemester("");
    setCreatedTreatmentId(null);
    setSuccessMessage(false);
    setScheduleModalOpen(false);
    onClose();
  };

  const loading = createMutation.isPending;
  const treatmentCreated = !!createdTreatmentId;

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? undefined : handleCloseAll}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {/* Cabecera del modal */}
        <DialogTitle
          sx={{
            p: 0,
            bgcolor: treatmentCreated
              ? alpha(theme.palette.success.main, 0.05)
              : "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
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
                  bgcolor: treatmentCreated
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.primary.main, 0.1),
                  color: treatmentCreated
                    ? theme.palette.success.main
                    : theme.palette.primary.main,
                }}
              >
                {treatmentCreated ? (
                  <CheckCircleOutlineIcon />
                ) : (
                  <MedicalServicesOutlinedIcon />
                )}
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  fontWeight={600}
                  color="text.primary"
                >
                  {treatmentCreated
                    ? "Tratamiento creado"
                    : "Iniciar nuevo tratamiento"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {treatmentCreated
                    ? `ID: ${createdTreatmentId} • ${patientName}`
                    : `Paciente: ${patientName}`}
                </Typography>
              </Box>
            </Box>
            <IconButton
              aria-label="cerrar"
              onClick={handleCloseAll}
              disabled={loading}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  bgcolor: alpha(theme.palette.grey[500], 0.1),
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        {/* Contenido del modal */}
        <DialogContent
          sx={{
            p: 3,
            pt: 2.5,
            pb: 3,
          }}
        >
          {/* Mensaje de éxito */}
          {successMessage && (
            <Fade in={successMessage}>
              <Alert
                icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                severity="success"
                variant="outlined"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  borderColor: theme.palette.success.light,
                  "& .MuiAlert-icon": {
                    color: theme.palette.success.main,
                  },
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  El tratamiento ha sido creado exitosamente. Ahora puedes
                  agendar sesiones para este tratamiento.
                </Typography>
              </Alert>
            </Fade>
          )}

          {/* Formulario */}
          <Box sx={{ mt: successMessage ? 0 : 1 }}>
            <TextField
              label="Motivo del tratamiento"
              fullWidth
              margin="normal"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              rows={3}
              disabled={treatmentCreated || loading}
              placeholder="Describa el motivo por el cual se inicia este tratamiento..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SubjectOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  bgcolor: treatmentCreated
                    ? alpha(theme.palette.grey[100], 0.5)
                    : "transparent",
                },
              }}
              helperText={
                !treatmentCreated && !reason
                  ? "Este campo es obligatorio"
                  : "Describa de forma clara y concisa el motivo del tratamiento"
              }
              FormHelperTextProps={{
                sx: {
                  mt: 0.5,
                  ml: 1,
                },
              }}
            />

            <TextField
              label="Semestre"
              fullWidth
              margin="normal"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              disabled={treatmentCreated || loading}
              placeholder="Ej: 2023-2"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  bgcolor: treatmentCreated
                    ? alpha(theme.palette.grey[100], 0.5)
                    : "transparent",
                },
              }}
              helperText={
                !treatmentCreated && !semester
                  ? "Este campo es obligatorio"
                  : "Indique el semestre académico en el que se inicia el tratamiento"
              }
              FormHelperTextProps={{
                sx: {
                  mt: 0.5,
                  ml: 1,
                },
              }}
            />
          </Box>
        </DialogContent>

        {/* Acciones del modal */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: alpha(theme.palette.background.default, 0.5),
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", justifyContent: "space-between" }}
          >
            <Button
              onClick={handleCloseAll}
              disabled={loading}
              variant="outlined"
              color="inherit"
              sx={{
                borderRadius: 2,
                px: 3,
                borderColor: alpha(theme.palette.grey[500], 0.2),
                color: "text.secondary",
                "&:hover": {
                  borderColor: alpha(theme.palette.grey[500], 0.3),
                  bgcolor: alpha(theme.palette.grey[500], 0.05),
                },
              }}
            >
              {treatmentCreated ? "Cerrar" : "Cancelar"}
            </Button>

            <Box>
              {treatmentCreated ? (
                <Tooltip title="Agendar sesiones para este tratamiento" arrow>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setScheduleModalOpen(true)}
                    startIcon={<EventNoteOutlinedIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      boxShadow: theme.shadows[2],
                      "&:hover": {
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    Agendar sesiones
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  onClick={handleCreate}
                  variant="contained"
                  color="primary"
                  disabled={loading || !reason || !semester}
                  startIcon={loading ? undefined : <AddCircleOutlineIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    boxShadow: theme.shadows[2],
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                    },
                    minWidth: 120,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} thickness={4} />
                  ) : (
                    "Crear"
                  )}
                </Button>
              )}
            </Box>
          </Stack>
        </DialogActions>
      </Dialog>

      {treatmentCreated && (
        <ScheduleSessionsModal
          open={scheduleModalOpen}
          onClose={handleCloseAll}
          therapistId={therapistId}
          treatmentId={createdTreatmentId}
        />
      )}
    </>
  );
};

export default TreatmentModal;
