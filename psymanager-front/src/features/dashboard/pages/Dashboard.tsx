"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Paper } from "@mui/material";

import AssignedStudents, {
  AssignedStudent,
} from "../components/AssignedStudents";
import CalendarWidget from "../components/CalendarWidget";
import { useUpcomingAppointmentsQuery } from "../hooks/useUpcomingAppointmentsQuery";
import { useActiveTreatmentPatientsQuery } from "../hooks/useActiveTreatmentPatientsQuery";
import { ActiveTreatmentStudentDto } from "../types";
import TreatmentModal from "../../treatments/components/TreatmentModal";
import { useAuth } from "../../auth/context/AuthContext";
import UpcomingAppointmentsModal from "../components/UpcomingAppointmentsModal";

import UpcomingAppointments from "../components/UpcomingAppointments";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const therapistId = user?.userId;

  const navigate = useNavigate();

  const { data: upcomingAppointments = [] } = useUpcomingAppointmentsQuery(
    therapistId ?? 0
  );
  const { data: activeTreatmentStudents = [] } =
    useActiveTreatmentPatientsQuery(therapistId ?? 0);

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
  function mapToAssignedStudentFromTreatment(
    dto: ActiveTreatmentStudentDto
  ): AssignedStudent {
    return {
      patientId: dto.patientId,
      therapistId: therapistId ?? 0,
      name: dto.studentName,
      status: "En tratamiento",
      startDate: dto.startDate,
      endDate: dto.endDate,
      assignedSessions: dto.totalSessions ?? 0,
      completedSessions: dto.completedSessions ?? 0,
      treatmentId: dto.treatmentId,
    };
  }

  const assignedStudents = Array.isArray(activeTreatmentStudents)
    ? activeTreatmentStudents.map(mapToAssignedStudentFromTreatment)
    : [];

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

  const handleViewAllStudents = () => {
    navigate("/dashboard/estudiantes");
  };

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
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #4DB6AC, #26A69A)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: { xs: 4, md: 0 },
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
        <Box sx={{ maxWidth: { xs: "100%", md: "60%" }, zIndex: 1 }}>
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
        </Box>
      </Paper>

      {/* Reemplazando Grid container por Box con flexbox */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Columna izquierda (antes Grid item xs={12} md={8}) */}
        <Box sx={{ width: { xs: "100%", md: "66.666%" } }}>
          <AssignedStudents
            students={assignedStudents}
            onViewAll={handleViewAllStudents}
            onStartTreatment={handleStartTreatment}
          />
        </Box>

        {/* Columna derecha (antes Grid item xs={12} md={4}) */}
        <Box sx={{ width: { xs: "100%", md: "33.333%" } }}>
          <Card
            elevation={2}
            sx={{ borderRadius: 3, position: "sticky", top: 24 }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  Próximas citas
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <CalendarWidget eventDates={eventDates} />
                <Box sx={{ mt: 3 }}>
                  <UpcomingAppointments
                    appointments={upcomingAppointments}
                    onViewAll={handleViewAllAppointments}
                    onStartTreatment={handleStartTreatment}
                  />

                  <UpcomingAppointmentsModal
                    open={isAppointmentsModalOpen}
                    onClose={() => setIsAppointmentsModalOpen(false)}
                    appointments={upcomingAppointments}
                    highlightedId={highlightedAppointmentId}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
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
