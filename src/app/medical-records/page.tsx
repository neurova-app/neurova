'use client'
import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: string;
  notes: string;
}

const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-03-14',
    type: 'Progress Review',
    notes: 'Quarterly assessment shows significant improvement in social interactions...',
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-01-21',
    type: 'Therapy Session',
    notes: 'Patient reported improved sleep patterns and reduced anxiety...',
  },
  {
    id: '3',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-01-14',
    type: 'Initial Assessment',
    notes: 'First consultation - discussed primary concerns and family history...',
  },
];

const MedicalRecords: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [notes, setNotes] = useState('');

  const handleRecordSelect = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setNotes(record.notes);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Progress Review':
        return 'secondary';
      case 'Therapy Session':
        return 'primary';
      case 'Initial Assessment':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Left Sidebar - Records List */}
      <Card sx={{ width: 300, flexShrink: 0 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search records..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<FilterListIcon />}
              variant="outlined"
            >
              Date Range
            </Button>
            <Button
              size="small"
              startIcon={<FilterListIcon />}
              variant="outlined"
            >
              Filters
            </Button>
          </Box>
        </Box>

        <Divider />

        <List sx={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
          {mockRecords.map((record) => (
            <React.Fragment key={record.id}>
              <ListItemButton
                selected={selectedRecord?.id === record.id}
                onClick={() => handleRecordSelect(record)}
                sx={{ 
                  '&:hover': { bgcolor: 'background.default' }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2">
                        {record.patientName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.date}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Chip
                        label={record.type}
                        size="small"
                        color={getTypeColor(record.type)}
                        sx={{ my: 0.5 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {record.notes}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Card>

      {/* Main Content - Record Editor */}
      <Card sx={{ flex: 1 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <IconButton color="primary">
                <SaveIcon />
              </IconButton>
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 2, height: 'calc(100vh - 200px)' }}>
          <TextField
            fullWidth
            multiline
            rows={20}
            placeholder="Enter your medical notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
          />
        </Box>
      </Card>
    </Box>
  );
};

export default MedicalRecords;
