import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  CircularProgress,
  Button,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  FormHelperText,
  alpha,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Psychology as PsychologyIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import type { SpecialtyDto, TherapistProfileUpdateDto } from "../types";

interface ProfileEditFormProps {
  form: TherapistProfileUpdateDto;
  errors: Partial<Record<keyof TherapistProfileUpdateDto, string>>;
  touched: Record<string, boolean>;
  specialties: SpecialtyDto[];
  loading: boolean;
  onChange: <K extends keyof TherapistProfileUpdateDto>(
    field: K,
    value: TherapistProfileUpdateDto[K]
  ) => void;
  onBlur: (field: keyof TherapistProfileUpdateDto) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

const ciExtensions = ["LP", "CB", "SC", "OR", "PT", "CH", "TJ", "BE", "PD"];

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  form,
  errors,
  touched,
  specialties,
  loading,
  onChange,
  onBlur,
  onSubmit,
  onCancel,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    return !Object.keys(errors).some(
      (key) => errors[key as keyof TherapistProfileUpdateDto]
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: "800px",
        mx: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: "white",
            py: 3,
            px: 4,
            position: "relative",
          }}
        >
          {/* Elementos decorativos */}
          <Box
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 150,
              height: 150,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          />

          <IconButton
            onClick={onCancel}
            sx={{
              color: "white",
              mr: 2,
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
            Editar perfil
          </Typography>
        </Box>

        {/* Contenido del formulario */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: 4,
          }}
        >
          {/* Sección de Identificación */}
          <FormSection
            title="Identificación"
            icon={<BadgeIcon />}
            description="Información de tu documento de identidad"
          >
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box flexGrow={1} flexBasis={{ xs: "100%", sm: "45%" }}>
                <TextField
                  label="Número de CI"
                  fullWidth
                  value={form.ciNumber}
                  onChange={(e) => onChange("ciNumber", e.target.value)}
                  onBlur={() => onBlur("ciNumber")}
                  error={Boolean(errors.ciNumber && touched.ciNumber)}
                  helperText={touched.ciNumber ? errors.ciNumber : ""}
                  required
                  InputProps={{
                    startAdornment: (
                      <BadgeIcon
                        sx={{
                          color:
                            errors.ciNumber && touched.ciNumber
                              ? theme.palette.error.main
                              : theme.palette.action.active,
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                    ),
                  }}
                />
              </Box>

              <Box flexGrow={1} flexBasis={{ xs: "100%", sm: "25%" }}>
                <TextField
                  label="Complemento"
                  fullWidth
                  value={form.ciComplement}
                  onChange={(e) => onChange("ciComplement", e.target.value)}
                  onBlur={() => onBlur("ciComplement")}
                  placeholder="Opcional"
                />
              </Box>

              <Box flexGrow={1} flexBasis={{ xs: "100%", sm: "28%" }}>
                <FormControl fullWidth>
                  <InputLabel id="ci-extension-label">Extensión</InputLabel>
                  <Select
                    labelId="ci-extension-label"
                    value={form.ciExtension}
                    onChange={(e) => onChange("ciExtension", e.target.value)}
                    onBlur={() => onBlur("ciExtension")}
                    input={<OutlinedInput label="Extensión" />}
                    required
                  >
                    {ciExtensions.map((ext) => (
                      <MenuItem key={ext} value={ext}>
                        {ext}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Departamento de emisión</FormHelperText>
                </FormControl>
              </Box>
            </Box>
          </FormSection>

          {/* Sección de Contacto */}
          <FormSection
            title="Información de contacto"
            icon={<PhoneIcon />}
            description="Datos para que tus pacientes puedan contactarte"
          >
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box flexGrow={1} flexBasis={{ xs: "100%", sm: "48%" }}>
                <TextField
                  label="Teléfono"
                  fullWidth
                  value={form.phoneNumber}
                  onChange={(e) => onChange("phoneNumber", e.target.value)}
                  onBlur={() => onBlur("phoneNumber")}
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon
                        sx={{
                          color: theme.palette.action.active,
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                    ),
                  }}
                  placeholder="Ej: 78451236"
                />
              </Box>

              <Box flexGrow={1} flexBasis={{ xs: "100%", sm: "48%" }}>
                <TextField
                  label="Dirección"
                  fullWidth
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  onBlur={() => onBlur("address")}
                  InputProps={{
                    startAdornment: (
                      <LocationIcon
                        sx={{
                          color: theme.palette.action.active,
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                    ),
                  }}
                  placeholder="Ej: Av. Busch #123"
                />
              </Box>
            </Box>
          </FormSection>

          {/* Sección de Especialidades */}
          <FormSection
            title="Especialidades"
            icon={<PsychologyIcon />}
            description="Selecciona las especialidades en las que te desempeñas"
          >
            <FormControl fullWidth>
              <InputLabel id="specialties-label">Especialidades</InputLabel>
              <Select
                labelId="specialties-label"
                multiple
                value={form.specialtyIds}
                onChange={(e) =>
                  onChange("specialtyIds", e.target.value as number[])
                }
                onBlur={() => onBlur("specialtyIds")}
                input={<OutlinedInput label="Especialidades" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => {
                      const match = specialties.find(
                        (s) => s.specialtyId === id
                      );
                      return (
                        <Chip
                          key={id}
                          label={match?.specialtyName || id}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {specialties.map((spec) => (
                  <MenuItem key={spec.specialtyId} value={spec.specialtyId}>
                    {spec.specialtyName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Puedes seleccionar múltiples especialidades
              </FormHelperText>
            </FormControl>
          </FormSection>

          {/* Barra de acciones */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              pt: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              disabled={loading || submitting}
              startIcon={<CancelIcon />}
              sx={{
                borderRadius: 6,
                px: 3,
                textTransform: "none",
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || submitting || !isFormValid()}
              startIcon={
                submitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              sx={{
                borderRadius: 6,
                px: 3,
                textTransform: "none",
              }}
            >
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

// Componente para secciones del formulario
interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon,
  description,
  children,
}) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            mr: 2,
            display: "flex",
            p: 1,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            {title}
          </Typography>
          {description && (
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      <CardContent sx={{ p: 3 }}>{children}</CardContent>
    </Card>
  );
};

export default ProfileEditForm;
