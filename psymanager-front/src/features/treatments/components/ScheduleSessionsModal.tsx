"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Checkbox,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  useTheme,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  Collapse,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import SearchIcon from "@mui/icons-material/Search";

import DateRangeIcon from "@mui/icons-material/DateRange";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import { toast } from "sonner";
import { useAddSessionsMutation } from "../../dashboard/hooks/useAddSessionsMutation";
import { useAvailableSchedulesQuery } from "../../dashboard/hooks/useAvailableSchedulesQuery";
import { scheduleSessionsModalStyles } from "./styles/scheduleSessionsModalStyles";
import {
  formatDate,
  formatTime,
  calculateDuration,
  groupSchedulesByDate,
} from "./styles/ScheduleSessionsModalUtils";

interface ScheduleSessionsModalProps {
  open: boolean;
  onClose: () => void;
  therapistId: number;
  treatmentId: number;
}

const ScheduleSessionsModal: React.FC<ScheduleSessionsModalProps> = ({
  open,
  onClose,
  therapistId,
  treatmentId,
}) => {
  const theme = useTheme();
  const styles = scheduleSessionsModalStyles(theme);

  const [selectedSlotIds, setSelectedSlotIds] = useState<Set<number>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters] = useState(false);
  const [groupByDate, setGroupByDate] = useState(true);

  const mutation = useAddSessionsMutation(treatmentId, therapistId);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const in30Days = new Date();
  in30Days.setDate(tomorrow.getDate() + 30);

  const start = tomorrow.toISOString().split("T")[0];
  const end = in30Days.toISOString().split("T")[0];

  const {
    data: schedules = [],
    isLoading,
    isError,
    refetch,
  } = useAvailableSchedulesQuery(therapistId, start, end, open);

  useEffect(() => {
    if (!open) {
      setSelectedSlotIds(new Set());
      setSearchTerm("");
      refetch();
    }
  }, [open, refetch]);

  const toggleSelection = (id: number) => {
    setSelectedSlotIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleConfirm = async () => {
    if (selectedSlotIds.size === 0) return;
    try {
      await mutation.mutateAsync(Array.from(selectedSlotIds));
      toast.success(`${selectedSlotIds.size} sesiones agendadas exitosamente.`);
      onClose();
    } catch {
      toast.error("Error al agendar sesiones.");
    }
  };

  const handleSelectAll = () => {
    setSelectedSlotIds(
      new Set(
        filteredSchedules.length === selectedSlotIds.size
          ? []
          : filteredSchedules.map((s) => s.scheduleId)
      )
    );
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(
      (slot) =>
        slot.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.startTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.endTime.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schedules, searchTerm]);

  const groupedSchedules = useMemo(() => {
    return groupByDate ? groupSchedulesByDate(filteredSchedules) : null;
  }, [filteredSchedules, groupByDate]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={styles.loadingBox}>
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            Cargando horarios disponibles...
          </Typography>
        </Box>
      );
    }

    if (isError) {
      return (
        <Box sx={styles.errorBox}>
          <Box sx={styles.errorIconBox}>
            <ErrorOutlineIcon fontSize="large" />
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            Error al cargar horarios
          </Typography>
          <Button
            variant="outlined"
            onClick={() => refetch()}
            sx={styles.retryButton}
          >
            Intentar nuevamente
          </Button>
        </Box>
      );
    }

    if (filteredSchedules.length === 0) {
      return (
        <Box sx={styles.emptyBox}>
          <Box sx={styles.emptyIconBox}>
            <EventBusyIcon fontSize="large" />
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            No hay horarios disponibles
          </Typography>
        </Box>
      );
    }

    const renderList = (slots: typeof schedules) =>
      slots.map((slot) => (
        <ListItemButton
          key={`schedule-${slot.scheduleId}`}
          onClick={() => toggleSelection(slot.scheduleId)}
          selected={selectedSlotIds.has(slot.scheduleId)}
          sx={styles.listItemButton}
        >
          <Checkbox
            checked={selectedSlotIds.has(slot.scheduleId)}
            color="primary"
            sx={styles.checkbox}
          />
          <ListItemText
            primary={
              <Typography variant="body1" fontWeight={500}>
                {groupByDate
                  ? `${formatTime(slot.startTime)} - ${formatTime(
                      slot.endTime
                    )}`
                  : `${formatDate(slot.date)} — ${formatTime(
                      slot.startTime
                    )} - ${formatTime(slot.endTime)}`}
              </Typography>
            }
            secondary={`Duración: ${calculateDuration(
              slot.startTime,
              slot.endTime
            )} minutos`}
          />
        </ListItemButton>
      ));

    return groupByDate && groupedSchedules ? (
      <List disablePadding>
        {groupedSchedules.map((group) => (
          <Box key={`group-${group.date}`}>
            <Box sx={styles.dateHeaderBox}>
              <DateRangeIcon fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                {formatDate(group.date)}
              </Typography>
              <Chip size="small" label={`${group.slots.length} horarios`} />
            </Box>
            {renderList(group.slots)}
          </Box>
        ))}
      </List>
    ) : (
      <List disablePadding>{renderList(filteredSchedules)}</List>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={mutation.isPending ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={styles.headerBox}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <EventNoteOutlinedIcon />
            <Typography variant="h6" fontWeight={600}>
              Agendar sesiones
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={mutation.isPending}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <Box sx={styles.searchFilterBox}>
        <TextField
          placeholder="Buscar horarios..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Collapse in={showFilters}>
          <FormControlLabel
            control={
              <Switch
                checked={groupByDate}
                onChange={(e) => setGroupByDate(e.target.checked)}
              />
            }
            label="Agrupar por fecha"
          />
          <Button
            size="small"
            onClick={handleSelectAll}
            disabled={filteredSchedules.length === 0}
          >
            {filteredSchedules.length === selectedSlotIds.size
              ? "Deseleccionar todos"
              : "Seleccionar todos"}
          </Button>
        </Collapse>
      </Box>

      <DialogContent sx={styles.dialogContent}>{renderContent()}</DialogContent>

      <Box sx={styles.footerBox}>
        <Typography variant="body2" color="text.secondary">
          {selectedSlotIds.size > 0 &&
            `${selectedSlotIds.size} horarios seleccionados`}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={selectedSlotIds.size === 0 || mutation.isPending}
            startIcon={<CheckCircleOutlineIcon />}
          >
            {mutation.isPending ? <CircularProgress size={22} /> : "Confirmar"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ScheduleSessionsModal;
