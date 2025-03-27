'use client';

import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { Patient } from '@/types/patient';
import { PatientDetailsForm } from '@/components/PatientDetailsForm';

const mockPatients: Patient[] = [
  {
    id: '1',
    fullName: 'John Doe',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    nationalId: '123456789',
    bloodType: 'A+',
    maritalStatus: 'Single',
    educationLevel: 'Bachelor',
    phoneNumber: '123-456-7890',
    email: 'john@example.com',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Sister',
      phoneNumber: '098-765-4321',
    },
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    country: 'USA',
    occupation: 'Engineer',
    reasonForConsultation: 'Annual checkup',
    diagnoses: [],
    medicalHistory: {
      chronicIllnesses: [],
      allergies: [],
      currentMedications: [],
      previousTreatments: [],
    },
    familyHistory: '',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export default function PatientsPage() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedPatient, setSelectedPatient] = React.useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, patientId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const handleEdit = () => {
    if (selectedPatient) {
      router.push(`/patients/${selectedPatient}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    handleMenuClose();
  };

  const handleSavePatient = () => {
    // TODO: Implement save functionality
    setIsFormOpen(false);
  };

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Patients</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Add Patient
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>National ID</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPatients.map((patient) => (
              <TableRow 
                key={patient.id}
                onClick={() => patient.id && handleRowClick(patient.id)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <TableCell>{patient.fullName}</TableCell>
                <TableCell>{patient.dateOfBirth}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.nationalId}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.city}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      if (!patient.id) return;
                      e.stopPropagation(); // Prevent row click when clicking menu
                      handleMenuOpen(e, patient.id);
                    }}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {isFormOpen && (
        <PatientDetailsForm
          onClose={() => setIsFormOpen(false)}
          onSave={handleSavePatient}
        />
      )}
    </Box>
  );
}
