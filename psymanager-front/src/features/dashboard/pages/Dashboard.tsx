"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";

import CalendarWidget from "../components/CalendarWidget";
import { useUpcomingAppointmentsQuery } from "../hooks/useUpcomingAppointmentsQuery";

import TreatmentModal from "../../treatments/components/TreatmentModal";

import UpcomingAppointmentsModal from "../components/UpcomingAppointmentsModal";

import UpcomingAppointments from "../components/UpcomingAppointments";

const Dashboard: React.FC = () => {
  const LIMIT = 5;

  const { data: upcomingAppointments = [], refetch: refetchUpcoming } =
    useUpcomingAppointmentsQuery(LIMIT);

  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(
    null
  );
  const [selectedPatientName, setSelectedPatientName] = useState<string | null>(
    null
  );

  const handleStartTreatment = (
    patientId: number,
    therapistId: number,
    patientName: string
  ) => {
    setSelectedPatientId(patientId);
    setSelectedTherapistId(therapistId);
    setSelectedPatientName(patientName);
    setIsTreatmentModalOpen(true);
  };

  const eventDates = upcomingAppointments.map(
    (appt) => new Date(appt.dateTime)
  );

  useEffect(() => {
    if (!isTreatmentModalOpen) {
      setHighlightedAppointmentId(null);
    }
  }, [isTreatmentModalOpen]);

  const [highlightedAppointmentId, setHighlightedAppointmentId] = useState<
    number | null
  >(null);

  const handleViewAllAppointments = () => {
    const upcoming = [...upcomingAppointments].filter(
      (a) => a.state === "ACCEPTED" && new Date(a.dateTime) >= new Date()
    );

    const next = upcoming.sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    )[0];

    setHighlightedAppointmentId(next?.appointmentId ?? null);
    setIsAppointmentsModalOpen(true);
  };

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      {/* Banner informativo (más corto) */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #4DB6AC, #26A69A)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
            borderRadius: "50% 0 0 50%",
          },
        }}
      >
        <Box sx={{ maxWidth: "100%", zIndex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: "common.white",
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            Gestiona horarios de consulta y los historiales de los estudiantes
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.9)", maxWidth: "90%" }}
          >
            Organiza tu agenda, visualiza tus citas y accede al historial de tus
            estudiantes en un solo lugar.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.9)", maxWidth: "90%" }}
          >
            Aquí podrás ver tus citas próximas y gestionar los tratamientos de
            tus pacientes.
          </Typography>
        </Box>
      </Paper>

      {/* Contenedor de calendario + lista de citas */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Lista de citas */}
        <Box sx={{ flex: 1 }}>
          <UpcomingAppointments
            appointments={upcomingAppointments}
            onViewAll={handleViewAllAppointments}
            onStartTreatment={handleStartTreatment}
            onListChanged={refetchUpcoming}
          />

          <UpcomingAppointmentsModal
            open={isAppointmentsModalOpen}
            onClose={() => setIsAppointmentsModalOpen(false)}
            appointments={upcomingAppointments}
            highlightedId={highlightedAppointmentId}
          />
        </Box>

        {/* Calendario flotante a la derecha */}
        <Box
          sx={{
            width: { xs: "100%", md: "300px" },
            flexShrink: 0,
            position: "sticky",
            top: 24,
          }}
        >
          <CalendarWidget eventDates={eventDates} />
        </Box>
      </Box>

      {selectedPatientId && selectedTherapistId && selectedPatientName && (
        <TreatmentModal
          open={isTreatmentModalOpen}
          onClose={() => setIsTreatmentModalOpen(false)}
          patientId={selectedPatientId}
          therapistId={selectedTherapistId}
          patientName={selectedPatientName}
        />
      )}
    </Box>
  );
};

export default Dashboard;
