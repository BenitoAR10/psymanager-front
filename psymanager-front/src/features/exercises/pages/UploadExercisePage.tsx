"use client";

import type React from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import axiosInstance from "../../../services/axiosInstance";

interface UploadExerciseFormValues {
  title: string;
  category: string;
  pointsReward: number;
  audioFile: FileList;
  showPoints: boolean; // Nuevo campo para controlar si mostrar la recompensa
}

const UploadExercisePage: React.FC = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UploadExerciseFormValues>({
    defaultValues: {
      title: "",
      category: "",
      pointsReward: 10,
      audioFile: undefined,
      showPoints: true, // Valor por defecto activado
    },
  });

  const onSubmit = async (data: UploadExerciseFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("pointsReward", String(data.pointsReward));
    formData.append("showPoints", String(data.showPoints)); // Incluir el campo showPoints
    formData.append("audioFile", data.audioFile[0]);

    try {
      await axiosInstance.post("/api/wellness-exercises", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Ejercicio subido correctamente");
      reset();
    } catch (error) {
      // El interceptor global ya maneja los errores
    }
  };

  const getFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  return (
    <Box p={3} maxWidth={800} mx="auto">
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            bgcolor: "primary.main",
          }}
        />

        <Typography
          variant="h4"
          mb={3}
          sx={{
            fontWeight: 600,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Subir nuevo ejercicio
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            {/* Título */}
            <Controller
              name="title"
              control={control}
              rules={{ required: "El título es obligatorio" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Título del ejercicio"
                  placeholder="Ej: Meditación guiada para reducir ansiedad"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              )}
            />

            {/* Categoría y puntos */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Controller
                name="category"
                control={control}
                rules={{ required: "La categoría es obligatoria" }}
                render={({ field, fieldState }) => (
                  <FormControl
                    fullWidth
                    error={!!fieldState.error}
                    sx={{ flex: 2 }}
                  >
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      {...field}
                      label="Categoría"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="Ansiedad">Ansiedad</MenuItem>
                      <MenuItem value="Estrés">Estrés</MenuItem>
                      <MenuItem value="Relajación">Relajación</MenuItem>
                    </Select>
                    {fieldState.error && (
                      <Typography variant="caption" color="error">
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="pointsReward"
                control={control}
                rules={{
                  required: "Los puntos son obligatorios",
                  min: { value: 1, message: "Debe ser al menos 1 punto" },
                }}
                render={({ field, fieldState }) => (
                  <Box sx={{ flex: 1, position: "relative" }}>
                    <TextField
                      {...field}
                      label="Puntos de recompensa"
                      type="number"
                      inputProps={{ min: 1 }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      InputProps={{
                        sx: { borderRadius: 2 },
                        endAdornment: (
                          <Tooltip title="Los puntos que recibirá el usuario al completar este ejercicio">
                            <IconButton size="small" sx={{ mr: -1 }}>
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                  </Box>
                )}
              />
            </Box>

            {/* Mostrar puntos */}
            <Controller
              name="showPoints"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Mostrar puntos al completar"
                />
              )}
            />

            <Divider sx={{ my: 1 }} />

            {/* Archivo de audio/video */}
            <Controller
              name="audioFile"
              control={control}
              rules={{
                required: "El archivo es obligatorio",
                validate: (files) => {
                  if (!files || files.length === 0)
                    return "Selecciona un archivo";
                  const file = files[0];
                  const allowed = [
                    "audio/mpeg",
                    "audio/wav",
                    "video/mp4",
                    "video/webm",
                    "video/quicktime",
                  ];
                  const max = 524288000;
                  if (!allowed.includes(file.type))
                    return "Formato no permitido";
                  if (file.size > max)
                    return "El archivo no debe superar los 500MB";
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <Box>
                  <Typography variant="subtitle1" mb={1} fontWeight={500}>
                    Archivo de audio/video
                  </Typography>

                  <Box
                    sx={{
                      border: "2px dashed",
                      borderColor: fieldState.error ? "error.main" : "grey.300",
                      borderRadius: 2,
                      p: 3,
                      textAlign: "center",
                      bgcolor: "grey.50",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "primary.light",
                        opacity: 0.8,
                      },
                    }}
                  >
                    {!field.value?.[0] ? (
                      <Box>
                        <CloudUploadIcon
                          sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                        />
                        <Typography variant="body1" mb={2}>
                          Arrastra tu archivo aquí o
                        </Typography>
                        <Button
                          variant="contained"
                          component="label"
                          sx={{ borderRadius: 6 }}
                        >
                          Seleccionar archivo
                          <input
                            type="file"
                            hidden
                            accept=".mp3,.wav,.mp4,.webm, .mov"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </Button>
                        <Typography
                          variant="caption"
                          display="block"
                          mt={2}
                          color="text.secondary"
                        >
                          Formatos permitidos: MP3, WAV, MP4, WEBM, MOV (máx. 500MB)
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          <AudioFileIcon
                            sx={{ fontSize: 32, color: "primary.main", mr: 1 }}
                          />
                          <Typography
                            variant="body1"
                            fontWeight={500}
                            noWrap
                            sx={{ maxWidth: "80%" }}
                          >
                            {field.value[0].name}
                          </Typography>
                        </Box>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                          mb={2}
                        >
                          <Chip
                            label={field.value[0].type
                              .split("/")[1]
                              .toUpperCase()}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={getFileSize(field.value[0].size)}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                        <Button
                          variant="outlined"
                          component="label"
                          size="small"
                        >
                          Cambiar archivo
                          <input
                            type="file"
                            hidden
                            accept=".mp3,.wav,.mp4,.webm"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </Button>
                      </Box>
                    )}
                  </Box>
                  {fieldState.error && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {fieldState.error.message}
                    </Typography>
                  )}
                </Box>
              )}
            />

            {/* Botones de acción */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="outlined" sx={{ mr: 2 }} onClick={() => reset()}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ px: 4, py: 1.2, fontWeight: 600 }}
              >
                {isSubmitting ? "Subiendo..." : "Subir ejercicio"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default UploadExercisePage;
