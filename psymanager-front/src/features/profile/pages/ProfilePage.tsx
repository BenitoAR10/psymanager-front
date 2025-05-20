import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  alpha,
  Divider,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  Psychology as PsychologyIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  ContentCopy as CopyIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useAuth } from "../../auth/context/AuthContext";
import { useTherapistProfile } from "../hooks/useTherapistProfile";
import { useTherapistProfileForm } from "../hooks/updateTherapistProfile";
import ProfileEditForm from "../components/ProfileEditForm";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const lightAccentColor = alpha(theme.palette.primary.main, 0.08);
  const accentColor = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, justRegistered, setJustRegistered } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const { profile, updateProfile } = useTherapistProfile();

  const {
    form,
    errors,
    touched,
    specialties,
    loading,
    handleBlur,
    handleChange,
    setForm,
  } = useTherapistProfileForm();

  // Activar edición al primer login
  useEffect(() => {
    if (justRegistered) {
      toast.info("Por favor completa tu perfil antes de continuar.", {
        id: "just-registered",
      });
      setEditMode(true);
      setJustRegistered(false);
    }
  }, [justRegistered, setJustRegistered]);

  // Setear los datos iniciales del perfil al hook del formulario
  useEffect(() => {
    if (profile && editMode) {
      setForm({
        ciNumber: profile.ciNumber || "",
        ciComplement: profile.ciComplement || "",
        ciExtension: profile.ciExtension || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        specialtyIds: profile.specialties.map((s) => s.specialtyId),
      });
    }
  }, [profile, editMode, setForm]);

  const handleFormSuccess = async () => {
    await updateProfile(form);
    setEditMode(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`${label} copiado al portapapeles`);
      },
      () => {
        toast.error(`No se pudo copiar ${label.toLowerCase()}`);
      }
    );
  };

  if (editMode) {
    if (!profile || specialties.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size={40} thickness={4} color="primary" />
          <Typography sx={{ mt: 2, color: "text.secondary" }}>
            Cargando información...
          </Typography>
        </Box>
      );
    }

    return (
      <ProfileEditForm
        form={form}
        errors={errors}
        touched={touched}
        specialties={specialties}
        loading={loading}
        onChange={handleChange}
        onBlur={handleBlur}
        onSubmit={handleFormSuccess}
        onCancel={() => setEditMode(false)}
      />
    );
  }

  // Safe guard para evitar acceder a `profile` si aún no está cargado
  if (!profile) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
        }}
      >
        <CircularProgress size={40} thickness={4} color="primary" />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Cargando perfil...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: { xs: 4, md: 6 },
          alignItems: isMobile ? "center" : "flex-start",
        }}
      >
        {/* Columna izquierda - Avatar y acciones */}
        <Box
          sx={{
            width: isMobile ? "100%" : "280px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              width: { xs: 120, md: 160 },
              height: { xs: 120, md: 160 },
              bgcolor: theme.palette.primary.main,
              color: "white",
              fontSize: { xs: "3rem", md: "4rem" },
              fontWeight: "bold",
              mb: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {user?.firstName?.charAt(0).toUpperCase() ||
              user?.email?.charAt(0).toUpperCase()}
          </Avatar>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
            fullWidth
            sx={{
              borderRadius: 28,
              textTransform: "none",
              py: 1.5,
              px: 3,
              mb: 2,
              bgcolor: theme.palette.primary.main,
              color: "white",
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
              width: "100%",
              maxWidth: "220px",
            }}
          >
            Editar perfil
          </Button>

          {/* Información de contacto en móvil */}
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "center",
                width: "100%",
              }}
            >
              <EmailIcon
                sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mr: 1,
                }}
              >
                {profile.email}
                console.log("hola", profile.email);
              </Typography>
              <Tooltip title="Copiar email">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(profile.email || "", "Email")}
                  sx={{ color: "action.active" }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Columna derecha - Información del perfil */}
        <Box sx={{ flex: 1 }}>
          {/* Nombre y email */}
          <Box
            sx={{
              mb: 4,
              pb: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{ mb: 1, color: "text.primary" }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>

            {/* Email en desktop */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <EmailIcon
                  sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mr: 1,
                  }}
                >
                  {profile.email}
                </Typography>
                <Tooltip title="Copiar email">
                  <IconButton
                    size="small"
                    onClick={() =>
                      copyToClipboard(profile.email || "", "Email")
                    }
                    sx={{ color: "action.active" }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {/* Secciones de información */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {/* Sección de información personal */}
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "white",
              }}
            >
              {/* Encabezado de la sección */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: lightAccentColor,
                    color: accentColor,
                    width: 36,
                    height: 36,
                    mr: 2,
                  }}
                >
                  <AssignmentIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={500}>
                  Información personal
                </Typography>
              </Box>

              {/* Contenido de la sección */}
              <Box sx={{ p: 2 }}>
                {/* Teléfono */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: lightAccentColor,
                        color: accentColor,
                        width: 32,
                        height: 32,
                        mr: 2,
                      }}
                    >
                      <PhoneIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", ml: 7 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: profile.phoneNumber ? 500 : 400,
                        color: profile.phoneNumber
                          ? "text.primary"
                          : "text.disabled",
                      }}
                    >
                      {profile.phoneNumber || "No disponible"}
                    </Typography>
                    {profile.phoneNumber && (
                      <Tooltip title="Copiar teléfono">
                        <IconButton
                          size="small"
                          onClick={() =>
                            copyToClipboard(
                              profile.phoneNumber || "",
                              "Teléfono"
                            )
                          }
                          sx={{ ml: 1, color: "action.active" }}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Divider sx={{ mt: 2, ml: 7 }} />
                </Box>

                {/* CI */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: lightAccentColor,
                        color: accentColor,
                        width: 32,
                        height: 32,
                        mr: 2,
                      }}
                    >
                      <BadgeIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      CI
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, color: "text.primary", ml: 7 }}
                  >
                    {profile.ciNumber}
                    {profile.ciComplement && `-${profile.ciComplement}`}{" "}
                    {profile.ciExtension && `(${profile.ciExtension})`}
                  </Typography>
                  <Divider sx={{ mt: 2, ml: 7 }} />
                </Box>

                {/* Dirección */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: lightAccentColor,
                        color: accentColor,
                        width: 32,
                        height: 32,
                        mr: 2,
                      }}
                    >
                      <LocationIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      Dirección
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: profile.address ? 500 : 400,
                      color: profile.address ? "text.primary" : "text.disabled",
                      ml: 7,
                    }}
                  >
                    {profile.address || "No registrada"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Sección de especialidades */}
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "white",
                height: "fit-content",
              }}
            >
              {/* Encabezado de la sección */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: lightAccentColor,
                    color: accentColor,
                    width: 36,
                    height: 36,
                    mr: 2,
                  }}
                >
                  <PsychologyIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={500}>
                  Especialidades
                </Typography>
              </Box>

              {/* Contenido de la sección */}
              <Box sx={{ p: 3 }}>
                {profile.specialties.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {profile.specialties.map((specialty) => (
                      <Chip
                        key={specialty.specialtyId}
                        label={specialty.specialtyName}
                        sx={{
                          bgcolor: lightAccentColor,
                          color: accentColor,
                          fontWeight: 500,
                          px: 1,
                          borderRadius: "16px",
                          "&:hover": {
                            bgcolor: "rgba(77, 190, 173, 0.25)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(255, 193, 7, 0.1)",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      No tienes especialidades asignadas. Edita tu perfil para
                      añadir especialidades.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
