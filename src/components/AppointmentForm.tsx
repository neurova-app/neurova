'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import { Appointment } from '@/types';
import { supabase } from '@/utils/supabase';

interface Patient {
  id: string;
  full_name: string;
  email?: string;
}

interface AppointmentFormProps {
  appointment?: Partial<Appointment>;
  onClose: () => void;
  onSave: (appointment: Partial<Appointment>, patient: { full_name: string; email?: string }) => void;
}

const defaultAppointment: Partial<Appointment> = {
  id: '',
  patientId: '',
  patientName: '',
  date: new Date().toISOString().split('T')[0],
  type: 'Therapy Session',
  status: 'scheduled',
  notes: '',
};

export default function AppointmentForm({
  appointment = defaultAppointment,
  onClose,
  onSave,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>(appointment);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

 

  // Fetch patients from Supabase
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name, email');
      
      if (error) throw error;
      
      if (data) {
        setPatients(data);
        
        // If editing an existing appointment, set the selected patient
        if (appointment.patientId) {
          const patient = data.find(p => p.id === appointment.patientId);
          if (patient) {
            setSelectedPatient(patient);
            setFormData(prev => ({
              ...prev,
              patientName: patient.full_name,
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  }, [appointment.patientId]);

   // Fetch patients when component mounts
   useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  const handleInputChange = (field: keyof Appointment, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePatientChange = (_: React.SyntheticEvent, patient: Patient | null) => {
    setSelectedPatient(patient);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientId: patient.id,
        patientName: patient.full_name,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure we have a patient
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }
    
    // Call onSave with both the appointment data and patient info
    onSave(formData, {
      full_name: selectedPatient.full_name,
      email: selectedPatient.email
    });
  };

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
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => handleInputChange('date', e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            label="Start Time"
            type="time"
            value={formData.startTime || ''}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type || ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              label="Type"
              required
            >
              <MenuItem value="Therapy Session">Therapy Session</MenuItem>
              <MenuItem value="Initial Consultation">Initial Consultation</MenuItem>
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
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
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
