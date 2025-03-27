'use client';

import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Appointment } from '@/types';

interface AppointmentFormProps {
  appointment?: Appointment;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
}

const defaultAppointment: Appointment = {
  id: '',
  patientId: '',
  patientName: '',
  date: '',
  startTime: '',
  endTime: '',
  type: '',
  duration: 45,
  status: 'scheduled',
};

export default function AppointmentForm({
  appointment = defaultAppointment,
  onClose,
  onSave,
}: AppointmentFormProps) {
  const [formData, setFormData] = React.useState<Appointment>(appointment);

  const handleInputChange = (field: keyof Appointment, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Patient Name"
            value={formData.patientName}
            onChange={(e) => handleInputChange('patientName', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="time"
            label="Start Time"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <MenuItem value="Initial Consultation">Initial Consultation</MenuItem>
              <MenuItem value="Follow-up">Follow-up</MenuItem>
              <MenuItem value="Therapy Session">Therapy Session</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="number"
            label="Duration (minutes)"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 15, max: 180, step: 15 } }}
          />
        </Grid>
      </Grid>

      <DialogActions sx={{ mt: 4 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Box>
  );
}
