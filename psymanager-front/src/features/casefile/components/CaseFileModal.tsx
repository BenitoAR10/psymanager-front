"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
  alpha,
  useTheme,
  Avatar,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useCaseFileQuery } from "../hook/useCaseFileQuery";
import { useSaveCaseFileMutation } from "../hook/useSaveCaseFileMutation";
import type { CreateOrUpdateCaseFileDto } from "../types";

interface CaseFileModalProps {
  open: boolean;
  onClose: () => void;
  treatmentId: number;
}

const CaseFileModal: React.FC<CaseFileModalProps> = ({
  open,
  onClose,
  treatmentId,
}) => {
  const theme = useTheme();
  const {
    data: caseFile,
    isLoading,
    error,
    refetch,
  } = useCaseFileQuery(treatmentId, open);

  const isNewCaseFile = error?.message === "NOT_FOUND";

  const mutation = useSaveCaseFileMutation();

  const [form, setForm] = useState<CreateOrUpdateCaseFileDto>({
    treatmentId,
    date: dayjs().format("YYYY-MM-DD"),
    summary: "",
    recommendations: "",
  });

  useEffect(() => {
    if (open && !isLoading) {
      if (caseFile) {
        setForm({
          treatmentId,
          date: caseFile.date,
          summary: caseFile.summary,
          recommendations: caseFile.recommendations,
        });
      } else {
        setForm({
          treatmentId,
          date: dayjs().format("YYYY-MM-DD"),
          summary: "",
          recommendations: "",
        });
      }
    }
  }, [caseFile, treatmentId, isLoading, open]);

  const handleChange =
    (field: keyof CreateOrUpdateCaseFileDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = async () => {
    try {
      await mutation.mutateAsync(form);
      toast.success("Ficha guardada correctamente");
      await refetch();
      onClose();
    } catch {
      toast.error("Error al guardar la ficha");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* Encabezado del modal */}
      <DialogTitle
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
            p: 2.5,
            pb: 2,
            backgroundColor: isNewCaseFile
              ? alpha(theme.palette.primary.main, 0.05)
              : alpha(theme.palette.info.main, 0.05),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                backgroundColor: isNewCaseFile
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.info.main, 0.1),
                color: isNewCaseFile
                  ? theme.palette.primary.main
                  : theme.palette.info.main,
              }}
            >
              <DescriptionOutlinedIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" fontWeight={600}>
                {isNewCaseFile
                  ? "Crear ficha del tratamiento"
                  : "Editar ficha del tratamiento"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isNewCaseFile
                  ? "Registra la información del tratamiento"
                  : `Última actualización: ${dayjs(caseFile?.date).format(
                      "DD/MM/YYYY"
                    )}`}
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
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
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              gap: 2,
            }}
          >
            <CircularProgress size={40} thickness={4} />
            <Typography variant="body2" color="text.secondary">
              Cargando información de la ficha...
            </Typography>
          </Box>
        ) : error && !isNewCaseFile ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              border: "1px solid",
              borderColor: alpha(theme.palette.error.main, 0.2),
              bgcolor: alpha(theme.palette.error.main, 0.05),
              my: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                width: 48,
                height: 48,
                mx: "auto",
                mb: 2,
              }}
            >
              <ErrorOutlineIcon />
            </Avatar>
            <Typography
              variant="h6"
              color="error.main"
              gutterBottom
              fontWeight={600}
            >
              Error al cargar la ficha
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              No se pudo cargar la información de la ficha. Por favor, intenta
              nuevamente.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => refetch()}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: "1.5px",
                "&:hover": {
                  borderWidth: "1.5px",
                },
              }}
            >
              Reintentar
            </Button>
          </Paper>
        ) : (
          <Stack spacing={3}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <SummarizeOutlinedIcon color="primary" fontSize="small" />
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.primary"
                >
                  Resumen del tratamiento
                </Typography>
              </Box>
              <TextField
                value={form.summary}
                onChange={handleChange("summary")}
                fullWidth
                multiline
                minRows={4}
                placeholder="Describe el resumen del tratamiento realizado..."
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.5
                    ),
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.background.default,
                        0.8
                      ),
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.divider, 0.8),
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <TipsAndUpdatesOutlinedIcon color="primary" fontSize="small" />
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.primary"
                >
                  Recomendaciones
                </Typography>
              </Box>
              <TextField
                value={form.recommendations}
                onChange={handleChange("recommendations")}
                fullWidth
                multiline
                minRows={4}
                placeholder="Añade recomendaciones para el paciente..."
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.5
                    ),
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.background.default,
                        0.8
                      ),
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.divider, 0.8),
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        )}
      </DialogContent>

      <Divider />

      {/* Acciones del modal */}
      <DialogActions
        sx={{
          p: 2.5,
          pt: 2,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={mutation.isPending}
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
          onClick={handleSave}
          variant="contained"
          disabled={mutation.isPending || isLoading}
          startIcon={
            mutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveOutlinedIcon />
            )
          }
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
            boxShadow: theme.shadows[2],
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          {mutation.isPending
            ? "Guardando..."
            : isNewCaseFile
            ? "Crear ficha"
            : "Actualizar ficha"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CaseFileModal;
