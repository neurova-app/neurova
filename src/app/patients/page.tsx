'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Patient {
  id: string;
  name: string;
  email: string;
  lastVisit: string;
  status: 'Active' | 'Scheduled' | 'Inactive';
  avatar?: string;
}

const patients: Patient[] = [
  {
    id: '12345',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    lastVisit: 'Jan 12, 2024',
    status: 'Active',
  },
  {
    id: '12346',
    name: 'Michael Chen',
    email: 'michael.c@email.com',
    lastVisit: 'Jan 10, 2024',
    status: 'Scheduled',
  },
  {
    id: '12347',
    name: 'Emily Brown',
    email: 'emily.b@email.com',
    lastVisit: 'Jan 9, 2024',
    status: 'Inactive',
  },
];

export default function PatientsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'Active':
        return {
          color: '#4CAF50',
          bgcolor: '#E8F5E9',
        };
      case 'Scheduled':
        return {
          color: '#2196F3',
          bgcolor: '#E3F2FD',
        };
      default:
        return {
          color: '#9E9E9E',
          bgcolor: '#F5F5F5',
        };
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Patients</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ px: 3 }}
        >
          Add New Patient
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search patients..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{ minWidth: 100 }}
        >
          Filters
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow
                key={patient.id}
                hover
                onClick={() => handlePatientClick(patient.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={patient.avatar}>{patient.name[0]}</Avatar>
                    <Typography>{patient.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <Chip
                    label={patient.status}
                    size="small"
                    sx={{
                      ...getStatusColor(patient.status),
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
