"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Autocomplete,
  Typography,
  Alert,
} from "@mui/material";
import { Appointment } from "@/types";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Patient {
  id: string;
  full_name: string;
  email?: string;
}

interface AppointmentFormProps {
  onClose: () => void;
  onSave: (
    appointment: Appointment,
    patient: { full_name: string; email?: string }
  ) => void;
  onAddPatient?: () => void;
  appointment?: Partial<Appointment>;
}

const defaultAppointment: Appointment = {
  id: "",
  patientId: "",
  patientName: "",
  date: new Date().toISOString().split("T")[0],
  type: "Therapy Session",
  status: "scheduled",
  startTime: "",
  endTime: "",
  duration: 60,
  notes: "",
};

export default function AppointmentForm({
  onClose,
  onSave,
  onAddPatient,
  appointment = defaultAppointment,
}: AppointmentFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Appointment>({
    ...defaultAppointment,
    ...(appointment as Appointment),
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>({
    id: appointment.patientId || "",
    full_name: appointment.patientName || "",
  });
  const [loading, setLoading] = useState(false);
  const [noPatients, setNoPatients] = useState(false);

  const fetchPatients = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: therapistData, error: therapistError } = await supabase
        .from("therapists")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (therapistError) throw therapistError;

      if (!therapistData) {
        console.error("No therapist record found for current user");
        setNoPatients(true);
        return;
      }

      const { data: patientRelations, error: relationsError } = await supabase
        .from("therapist_patients")
        .select("patient_id")
        .eq("therapist_id", therapistData.id);

      if (relationsError) throw relationsError;

      if (!patientRelations || patientRelations.length === 0) {
        setNoPatients(true);
        return;
      }

      const patientIds = patientRelations.map(
        (relation) => relation.patient_id
      );

      const { data, error } = await supabase
        .from("patients")
        .select("id, full_name, email")
        .in("id", patientIds);

      if (error) throw error;

      if (data && data.length > 0) {
        setPatients(data);
        setNoPatients(false);

        if (appointment.patientId) {
          const patient = data.find((p) => p.id === appointment.patientId);
          if (patient) {
            setSelectedPatient(patient);
            setFormData((prev) => ({
              ...prev,
              patientName: patient.full_name,
            }));
          }
        }
      } else {
        setNoPatients(true);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setNoPatients(true);
    } finally {
      setLoading(false);
    }
  }, [appointment.patientId, user]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleInputChange = (
    field: keyof Appointment,
    value: string | number
  ) => {
    // Special handling for date to ensure timezone consistency
    if (field === "date") {
      setFormData((prev) => ({
        ...prev,
        [field]: String(value), // Ensure value is a string
      }));
      return;
    }

    // Special handling for start time to automatically set end time
    if (field === "startTime") {
      const startTimeStr = String(value);

      // Calculate end time (1 hour after start time)
      if (startTimeStr) {
        const [hours, minutes] = startTimeStr.split(":").map(Number);
        let endHours = hours + 1;

        // Handle day overflow (e.g., if start time is 23:00, end time should be 00:00)
        if (endHours >= 24) {
          endHours = endHours - 24;
        }

        const endTimeStr = `${endHours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;

        setFormData((prev) => ({
          ...prev,
          startTime: startTimeStr,
          // Always set end time automatically when start time changes
          // This ensures it works for both new appointments and rescheduling
          endTime: endTimeStr,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          startTime: startTimeStr,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePatientChange = (
    _: React.SyntheticEvent,
    patient: Patient | null
  ) => {
    setSelectedPatient(patient);
    if (patient) {
      setFormData((prev) => ({
        ...prev,
        patientId: patient.id,
        patientName: patient.full_name,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }

    onSave(formData as Appointment, {
      full_name: selectedPatient.full_name,
      email: selectedPatient.email,
    });
  };

  const handleAddPatientClick = () => {
    onClose();
    if (onAddPatient) {
      onAddPatient();
    }
  };

  if (noPatients) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          You need to add patients before you can schedule appointments
        </Alert>
        <Typography variant="body1" gutterBottom>
          You don&apos;t have any patients yet. Add a patient first to schedule
          appointments.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPatientClick}
          sx={{ mt: 2 }}
        >
          Add New Patient
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            id="patient-select"
            options={patients}
            getOptionLabel={(option) => option.full_name}
            value={selectedPatient}
            onChange={handlePatientChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient"
                required
                fullWidth
                disabled={loading}
                helperText="Only showing patients assigned to you"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Date"
            type="date"
            value={formData.date || ""}
            onChange={(e) => handleInputChange("date", e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            helperText="Date is stored exactly as selected"
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Start Time"
            type="time"
            value={formData.startTime || ""}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="End Time"
            type="time"
            value={formData.endTime || ""}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type || ""}
              onChange={(e) => handleInputChange("type", e.target.value)}
              label="Type"
              required
            >
              <MenuItem value="Therapy Session">Therapy Session</MenuItem>
              <MenuItem value="Initial Consultation">
                Initial Consultation
              </MenuItem>
              <MenuItem value="Follow-up">Follow-up</MenuItem>
              <MenuItem value="Assessment">Assessment</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Notes"
            multiline
            rows={3}
            value={formData.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Save Appointment
        </Button>
      </DialogActions>
    </Box>
  );
}
