'use client';

import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Patient } from '@/types/patient';

interface PatientDetailsFormProps {
  patient?: Patient;
  onSave: (patient: Partial<Patient>) => void;
}

const initialFormData: Partial<Patient> = {
  fullName: '',
  dateOfBirth: '',
  gender: 'other',
  nationalId: '',
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
  medicalHistory: {
    chronicIllnesses: [''],
    allergies: [''],
    currentMedications: [''],
    previousTreatments: [{ therapistName: '', duration: '', treatmentType: '' }],
  },
  familyHistory: '',
};

export default function PatientDetailsForm({ patient, onSave }: PatientDetailsFormProps) {
  const [formData, setFormData] = React.useState<Partial<Patient>>(patient || initialFormData);

  const handleChange = (field: keyof Patient, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (category: 'chronicIllnesses' | 'allergies' | 'currentMedications', index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory!,
        [category]: prev.medicalHistory![category].map((item, i) => (i === index ? value : item)),
      },
    }));
  };

  const handleAddArrayItem = (category: 'chronicIllnesses' | 'allergies' | 'currentMedications') => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory!,
        [category]: [...prev.medicalHistory![category], ''],
      },
    }));
  };

  const handleRemoveArrayItem = (category: 'chronicIllnesses' | 'allergies' | 'currentMedications', index: number) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory!,
        [category]: prev.medicalHistory![category].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Basic Personal Information */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Personal Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                required
                fullWidth
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="National ID (Cédula)"
                required
                fullWidth
                value={formData.nationalId}
                onChange={(e) => handleChange('nationalId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Date of Birth"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Gender"
                required
                fullWidth
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value as Patient['gender'])}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Contact Information */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                required
                fullWidth
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="email"
                label="Email Address"
                required
                fullWidth
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Emergency Contact
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Name"
                required
                fullWidth
                value={formData.emergencyContact?.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergencyContact: {
                      ...prev.emergencyContact!,
                      name: e.target.value,
                    },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Relationship"
                required
                fullWidth
                value={formData.emergencyContact?.relationship}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergencyContact: {
                      ...prev.emergencyContact!,
                      relationship: e.target.value,
                    },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Phone Number"
                required
                fullWidth
                value={formData.emergencyContact?.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergencyContact: {
                      ...prev.emergencyContact!,
                      phoneNumber: e.target.value,
                    },
                  }))
                }
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Address and Demographics */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Address and Demographics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Residential Address"
                fullWidth
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="City"
                required
                fullWidth
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="State"
                required
                fullWidth
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Country"
                required
                fullWidth
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Occupation"
                fullWidth
                value={formData.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Clinical Information */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Clinical Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Reason for Consultation"
                multiline
                rows={3}
                required
                fullWidth
                value={formData.reasonForConsultation}
                onChange={(e) => handleChange('reasonForConsultation', e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Medical History
          </Typography>

          {/* Chronic Illnesses */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Chronic Illnesses</Typography>
              <IconButton
                size="small"
                onClick={() => handleAddArrayItem('chronicIllnesses')}
                sx={{ ml: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            {formData.medicalHistory?.chronicIllnesses.map((illness, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={illness}
                  onChange={(e) => handleArrayChange('chronicIllnesses', index, e.target.value)}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveArrayItem('chronicIllnesses', index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Allergies */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Allergies</Typography>
              <IconButton
                size="small"
                onClick={() => handleAddArrayItem('allergies')}
                sx={{ ml: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            {formData.medicalHistory?.allergies.map((allergy, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={allergy}
                  onChange={(e) => handleArrayChange('allergies', index, e.target.value)}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveArrayItem('allergies', index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Current Medications */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Current Medications</Typography>
              <IconButton
                size="small"
                onClick={() => handleAddArrayItem('currentMedications')}
                sx={{ ml: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            {formData.medicalHistory?.currentMedications.map((medication, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={medication}
                  onChange={(e) => handleArrayChange('currentMedications', index, e.target.value)}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveArrayItem('currentMedications', index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Family History */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Family Medical and Psychological History"
                multiline
                rows={4}
                fullWidth
                value={formData.familyHistory}
                onChange={(e) => handleChange('familyHistory', e.target.value)}
                helperText="Include known hereditary conditions (mental health, chronic diseases)"
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained">
            Save Patient Information
          </Button>
        </Box>
      </Box>
    </form>
  );
}
