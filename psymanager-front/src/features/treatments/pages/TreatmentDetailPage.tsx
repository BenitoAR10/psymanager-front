"use client";

import type React from "react";
import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTreatmentDetail } from "../hooks/useTreatmentDetail";
import { useCancelTreatmentSession } from "../hooks/useCancelTreatmentSession";
import { useCompleteSessionMutation } from "../hooks/useCompleteSessionMutation";
import { useAuth } from "../../auth/context/AuthContext";
import ScheduleSessionsModal from "../components/ScheduleSessionsModal";
import CloseTreatmentModal from "../components/CloseTreatmentModal";
import CaseFileModal from "../../casefile/components/CaseFileModal";
import SessionNoteModal from "../components/SessionNoteModal";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Chip,
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Paper,
  useTheme,
  Tooltip,
  Stack,
  alpha,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneIcon from "@mui/icons-material/Done";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import SubjectIcon from "@mui/icons-material/Subject";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  StyledTableCell,
  StyledTableRow,
  styles,
} from "./styles/treatmentDetailStyles";

const TreatmentDetailPage: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const treatmentId = Number(id);
  const { user } = useAuth();
  const therapistId = user?.userId ?? 0;
  const location = useLocation();
  const studentName = (location.state as { studentName?: string })?.studentName;
  const [noteModalSessionId, setNoteModalSessionId] = useState<number | null>(
    null
  );

  const [isCaseFileModalOpen, setIsCaseFileModalOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } =
    useTreatmentDetail(treatmentId);

  const cancelMutation = useCancelTreatmentSession();
  const completeMutation = useCompleteSessionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    sessionId: number | null;
  }>({
    open: false,
    sessionId: null,
  });

  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);

  const openCloseModal = () => setIsCloseModalOpen(true);
  const closeCloseModal = () => setIsCloseModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = async () => {
    setIsModalOpen(false);
    await refetch();
  };

  const openConfirmDialog = (sessionId: number) =>
    setConfirmDialog({ open: true, sessionId });
  const closeConfirmDialog = () =>
    setConfirmDialog({ open: false, sessionId: null });

  const handleCancelSession = async () => {
    if (!confirmDialog.sessionId) return;
    try {
      setCancellingId(confirmDialog.sessionId);
      await cancelMutation.mutateAsync({
        treatmentId,
        sessionId: confirmDialog.sessionId,
      });
      toast.success("Sesión cancelada.");
      await refetch();
    } catch {
      toast.error("No se pudo cancelar la sesión.");
    } finally {
      closeConfirmDialog();
      setCancellingId(null);
    }
  };

  const handleCompleteSession = async (sessionId: number) => {
    try {
      setCompletingId(sessionId);
      await completeMutation.mutateAsync(sessionId);
      toast.success("Sesión marcada como completada.");
      await refetch();
    } catch {
      toast.error("No se pudo completar la sesión.");
    } finally {
      setCompletingId(null);
    }
  };

  function toPascalCase(name: string): string {
    return name
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (isLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress size={40} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando detalles del tratamiento...
        </Typography>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box sx={styles.errorContainer}>
        <Paper elevation={0} sx={styles.errorPaper(theme)}>
          <Typography
            variant="h5"
            color="error.main"
            gutterBottom
            fontWeight={600}
          >
            Error al cargar el tratamiento
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {(error as Error)?.message ||
              "No se pudo cargar la información solicitada."}
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => refetch()}>
            Intentar nuevamente
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      {/* Encabezado */}
      <Box sx={styles.header}>
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="text.primary"
            gutterBottom
            sx={styles.headerTitle(theme)}
          >
            Tratamiento de{" "}
            {studentName ? toPascalCase(studentName) : "Estudiante"}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={styles.headerSubtitle}
          >
            Gestiona las sesiones y detalles del tratamiento
          </Typography>
        </Box>

        <Box sx={styles.headerActions}>
          <Button
            variant="outlined"
            color="error"
            onClick={openCloseModal}
            startIcon={<EventBusyIcon />}
            sx={styles.closeButton(theme)}
          >
            Cerrar tratamiento
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenModal}
            startIcon={<EventAvailableIcon />}
            sx={styles.addButton(theme)}
          >
            Agregar sesiones
          </Button>
        </Box>
      </Box>

      {/* Tarjeta de detalles */}
      <Card elevation={0} sx={styles.detailsCard(theme)}>
        <Box sx={styles.cardHeader(theme)}>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Información del tratamiento
          </Typography>
        </Box>
        <CardContent sx={styles.cardContent}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Stack spacing={2}>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <SubjectIcon sx={styles.infoIcon(theme)} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Motivo
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="text.primary"
                    >
                      {data.reason || "No especificado"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <SchoolIcon sx={styles.infoIcon(theme)} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Semestre
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="text.primary"
                    >
                      {data.semester}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Stack spacing={2}>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <CalendarMonthIcon sx={styles.infoIcon(theme)} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Fecha de inicio
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="text.primary"
                    >
                      {dayjs(data.startDate).format("DD/MM/YYYY")}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <CalendarMonthIcon sx={styles.infoIcon(theme)} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Fecha de finalización
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="text.primary"
                    >
                      {dayjs(data.endDate).format("DD/MM/YYYY")}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsCaseFileModalOpen(true)}
            startIcon={<SubjectIcon />}
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              borderWidth: "1.5px",
              px: 2.5,
              py: 0.75,
              transition: "all 0.2s ease",
              "&:hover": {
                borderWidth: "1.5px",
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                transform: "translateY(-2px)",
                boxShadow: `0 4px 8px ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}`,
              },
            }}
          >
            Ver ficha del tratamiento
          </Button>
        </Box>
      </Card>

      {/* Sección de sesiones */}
      <Box sx={styles.sessionsHeader}>
        <Typography
          variant="h5"
          fontWeight={600}
          color="text.primary"
          sx={styles.sessionsTitle}
        >
          <AccessTimeIcon sx={{ color: theme.palette.primary.main }} />
          Sesiones asignadas
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {data.sessions.length === 0 ? (
        <Paper elevation={0} sx={styles.noSessionsContainer(theme)}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay sesiones asignadas
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={styles.noSessionsText}
          >
            Este tratamiento aún no tiene sesiones programadas. Puedes agregar
            nuevas sesiones utilizando el botón "Agregar sesiones".
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenModal}
            startIcon={<EventAvailableIcon />}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Agregar sesiones
          </Button>
        </Paper>
      ) : (
        <Paper elevation={0} sx={styles.sessionsTableContainer}>
          <Box sx={styles.tableScrollContainer(theme)}>
            <Table sx={styles.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell width="5%">#</StyledTableCell>
                  <StyledTableCell width="15%">Fecha</StyledTableCell>
                  <StyledTableCell width="15%">Hora</StyledTableCell>
                  <StyledTableCell width="15%">Estado</StyledTableCell>
                  <StyledTableCell width="15%">Completada</StyledTableCell>
                  <StyledTableCell width="20%">Notas</StyledTableCell>
                  <StyledTableCell width="15%" align="right">
                    Acciones
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.sessions.map((session) => {
                  const isFuture = dayjs(session.sessionDate).isAfter(dayjs());
                  const isCancellable = isFuture && !session.completed;
                  const sessionStart = dayjs(
                    `${session.sessionDate}T${session.startTime}`
                  );
                  const isCompletable =
                    !session.completed && sessionStart.isBefore(dayjs());

                  return (
                    <StyledTableRow
                      key={session.sessionId}
                      className={session.completed ? "completed" : ""}
                    >
                      <StyledTableCell>
                        <Typography
                          variant="body2"
                          sx={styles.sessionOrderCell}
                        >
                          {session.sessionOrder}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={styles.dateTimeCell}>
                          <CalendarMonthIcon
                            fontSize="small"
                            sx={styles.dateTimeIcon(theme)}
                          />
                          <Typography variant="body2">
                            {dayjs(session.sessionDate).format("DD/MM/YYYY")}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={styles.dateTimeCell}>
                          <AccessTimeIcon
                            fontSize="small"
                            sx={styles.dateTimeIcon(theme)}
                          />
                          <Typography variant="body2">
                            {dayjs(`1970-01-01T${session.startTime}`).format(
                              "HH:mm"
                            )}{" "}
                            -{" "}
                            {dayjs(`1970-01-01T${session.endTime}`).format(
                              "HH:mm"
                            )}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={
                            session.state === "ACCEPTED"
                              ? "Aceptada"
                              : session.state === "PENDING"
                              ? "Pendiente"
                              : "Rechazada"
                          }
                          color={
                            session.state === "ACCEPTED"
                              ? "success"
                              : session.state === "PENDING"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                          sx={styles.statusChip}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={session.completed ? "Completada" : "Pendiente"}
                          color={session.completed ? "success" : "default"}
                          size="small"
                          variant={session.completed ? "filled" : "outlined"}
                          sx={styles.statusChip}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<NoteAltIcon />}
                          onClick={() =>
                            setNoteModalSessionId(session.sessionId)
                          }
                          sx={styles.noteButton}
                        >
                          Ver nota
                        </Button>
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        {isCancellable ? (
                          cancellingId === session.sessionId ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Tooltip title="Cancelar sesión" arrow>
                              <IconButton
                                color="error"
                                onClick={() =>
                                  openConfirmDialog(session.sessionId)
                                }
                                size="small"
                                sx={styles.actionButton(theme, "error")}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )
                        ) : isCompletable ? (
                          completingId === session.sessionId ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Tooltip title="Marcar como completada" arrow>
                              <IconButton
                                color="success"
                                onClick={() =>
                                  handleCompleteSession(session.sessionId)
                                }
                                size="small"
                                sx={styles.actionButton(theme, "success")}
                              >
                                <DoneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )
                        ) : null}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Modales */}
      <ScheduleSessionsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        therapistId={therapistId}
        treatmentId={data.treatmentId}
      />

      <CloseTreatmentModal
        open={isCloseModalOpen}
        onClose={closeCloseModal}
        treatmentId={data.treatmentId}
      />

      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        PaperProps={{ sx: styles.dialogPaper(theme) }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          ¿Cancelar esta sesión?
        </DialogTitle>
        <DialogActions sx={styles.dialogActions}>
          <Button onClick={closeConfirmDialog} sx={styles.cancelButton}>
            Cancelar
          </Button>
          <Button
            onClick={handleCancelSession}
            color="error"
            variant="contained"
            disabled={cancelMutation.isPending}
            sx={styles.confirmButton(theme)}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {noteModalSessionId !== null && (
        <SessionNoteModal
          open={true}
          onClose={() => setNoteModalSessionId(null)}
          sessionId={noteModalSessionId}
        />
      )}
      <CaseFileModal
        open={isCaseFileModalOpen}
        onClose={() => setIsCaseFileModalOpen(false)}
        treatmentId={treatmentId}
      />
    </Box>
  );
};

export default TreatmentDetailPage;
