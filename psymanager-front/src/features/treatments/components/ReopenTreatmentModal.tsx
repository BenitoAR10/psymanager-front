import type React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useReopenTreatmentMutation } from "../hooks/useReopenTreatmentMutation";
import type { ReopenTreatmentRequestDto } from "../types";
import dayjs from "dayjs";

/**
 * Props del modal para reabrir tratamiento cerrado.
 */
interface ReopenTreatmentModalProps {
  open: boolean;
  onClose: () => void;
  treatmentId: number;
  therapistId: number;
}

const ReopenTreatmentModal: React.FC<ReopenTreatmentModalProps> = ({
  open,
  onClose,
  treatmentId,
  therapistId,
}) => {
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [reason, setReason] = useState("");
  const [semester, setSemester] = useState("");

  const mutation = useReopenTreatmentMutation(treatmentId);

  const isLoading = mutation.status === "pending";

  const handleSubmit = () => {
    const payload: ReopenTreatmentRequestDto = {
      previousTreatmentId: treatmentId,
      therapistId,
      newStartDate: startDate,
      newEndDate: startDate, // mismo valor para simplificar
      reason,
      semester,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Reabrir tratamiento</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Motivo del tratamiento"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <TextField
            label="Semestre académico"
            fullWidth
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
          <TextField
            label="Fecha de inicio del tratamiento"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !reason || !semester}
        >
          Reabrir tratamiento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReopenTreatmentModal;
