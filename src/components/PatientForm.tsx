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
import { Patient } from '@/types/patient';

interface PatientFormProps {
  patient?: Patient;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

const defaultPatient: Patient = {
  id: '',
  fullName: '',
  dateOfBirth: '',
  gender: 'male' as const,
  nationalId: '',
  bloodType: '',
  maritalStatus: '',
  educationLevel: '',
  phoneNumber: '',
  email: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phoneNumber: '',
  },
  address: '',
  city: '',
  state: '',
  country: '',
  occupation: '',
  reasonForConsultation: '',
  diagnoses: [],
  medicalHistory: {
    chronicIllnesses: [],
    allergies: [],
    currentMedications: [],
    previousTreatments: [],
  },
  familyHistory: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function PatientForm({ patient = defaultPatient, onClose, onSave }: PatientFormProps) {
  const [formData, setFormData] = React.useState<Patient>(patient);

  const handleInputChange = (field: keyof Patient, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (
    parent: 'emergencyContact' | 'medicalHistory',
    field: string,
    value: string
  ) => {
    if (parent === 'emergencyContact') {
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else if (parent === 'medicalHistory') {
      setFormData((prev) => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [field]: value,
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Basic Personal Information */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="date"
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              label="Gender"
              onChange={(e) => handleInputChange('gender', e.target.value)}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="National ID (Cédula)"
            value={formData.nationalId}
            onChange={(e) => handleInputChange('nationalId', e.target.value)}
          />
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Emergency Contact Name"
            value={formData.emergencyContact.name}
            onChange={(e) =>
              handleNestedChange('emergencyContact', 'name', e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Emergency Contact Relationship"
            value={formData.emergencyContact.relationship}
            onChange={(e) =>
              handleNestedChange('emergencyContact', 'relationship', e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Emergency Contact Phone"
            value={formData.emergencyContact.phoneNumber}
            onChange={(e) =>
              handleNestedChange('emergencyContact', 'phoneNumber', e.target.value)
            }
          />
        </Grid>

        {/* Address and Demographics */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Residential Address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Occupation"
            value={formData.occupation}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
          />
        </Grid>

        {/* Clinical Information */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for Consultation"
            value={formData.reasonForConsultation}
            onChange={(e) => handleInputChange('reasonForConsultation', e.target.value)}
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
