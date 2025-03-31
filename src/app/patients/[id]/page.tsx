"use client";

import React from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Card,
  InputAdornment,
  ListItemButton,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSearchParams, useParams } from "next/navigation";
import { usePatients } from "@/contexts/PatientContext";
import { useSnackbar } from "notistack";
import { PatientDetailsForm } from "@/components/PatientDetailsForm";
import PatientProfilePictureUpload from "@/components/PatientProfilePictureUpload";
import RichTextEditor from "@/components/RichTextEditor";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface MedicalRecord {
  id: number;
  patientName: string;
  date: string;
  type: string;
  notes: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock records data for now - we'll implement this later
const mockRecords: MedicalRecord[] = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    date: "2024-01-01",
    type: "Medical Note",
    notes: "This is a sample medical note.",
  },
  {
    id: 2,
    patientName: "Sarah Johnson",
    date: "2024-01-15",
    type: "Lab Result",
    notes: "This is a sample lab result.",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "Medical Note":
      return "primary";
    case "Lab Result":
      return "success";
    default:
      return "info";
  }
};

export default function PatientDetailPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const { patients, loading, error } = usePatients();
  const { enqueueSnackbar } = useSnackbar();

  const initialTab = searchParams.get("tab");
  const [tabValue, setTabValue] = React.useState(
    initialTab ? parseInt(initialTab) : 0
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] =
    React.useState<MedicalRecord | null>(null);
  const [notes, setNotes] = React.useState("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRecordSelect = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setNotes(record.notes);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const patientId = params.id as string;

  // Find the patient by ID or by slug
  const patient = patients.find((p) => {
    // If the URL parameter is a UUID, match directly
    if (patientId.includes('-') && p.id === patientId) {
      return true;
    }

    // Otherwise, check if it's a slug that contains the patient's name and ID
    if (p.id && p.fullName) {
      // Extract the ID suffix from the slug (last part after the last hyphen)
      const slugParts = patientId.split('-');
      const idSuffix = slugParts[slugParts.length - 1];

      // Check if the ID starts with this suffix
      return p.id.startsWith(idSuffix);
    }

    return false;
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    enqueueSnackbar("Error loading patient data", { variant: "error" });
    return null;
  }

  if (!patient) {
    enqueueSnackbar("Patient not found", { variant: "error" });
    return null;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Column - Patient Info */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <PatientProfilePictureUpload
                currentImageUrl={patient.profilePicture || ""}
                patientId={patient.id || ""}
                fullName={patient.fullName}
                onImageUploaded={(url) => {
                  // This is handled by the component internally
                  console.log("Patient profile picture updated:", url);
                }}
              />
              <Typography variant="h6">{patient.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: #{patient.id}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                size="small"
                onClick={() => setIsEditDialogOpen(true)}
              >
                Edit
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right Column - Tabs and Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ bgcolor: "background.paper" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  textTransform: "none",
                  minHeight: 48,
                  color: "text.secondary",
                },
                "& .Mui-selected": {
                  color: "primary.main",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              <Tab label="Personal Information" />
              <Tab label="Medical History" />
              <Tab label="Session Registry" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box
                sx={{
                  p: 3,
                  height: "70vh",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto",
                }}
              >
                {/* Basic Personal Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Basic Personal Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1">
                        {patient.fullName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth (Age)
                      </Typography>
                      <Typography variant="body1">
                        {new Date(patient.dateOfBirth).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}{" "}
                        ({calculateAge(patient.dateOfBirth)} years)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {patient.gender}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        National ID (Cédula)
                      </Typography>
                      <Typography variant="body1">
                        {patient.nationalId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Blood Type (RH)
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {patient.bloodType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Marital Status
                      </Typography>
                      <Typography variant="body1">
                        {patient.maritalStatus}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Education Level
                      </Typography>
                      <Typography variant="body1">
                        {patient.educationLevel}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Occupation
                      </Typography>
                      <Typography variant="body1">
                        {patient.occupation}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Contact Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Contact Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1">
                        {patient.phoneNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1">{patient.email}</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Emergency Contact
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1">
                          {patient.emergencyContact.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Relationship
                        </Typography>
                        <Typography variant="body1">
                          {patient.emergencyContact.relationship}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1">
                          {patient.emergencyContact.phoneNumber}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                {/* Address and Demographics */}
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Address and Demographics
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Residential Address
                      </Typography>
                      <Typography variant="body1">
                        {patient.address || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        City
                      </Typography>
                      <Typography variant="body1">{patient.city}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        State
                      </Typography>
                      <Typography variant="body1">{patient.state}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Country
                      </Typography>
                      <Typography variant="body1">{patient.country}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box
                sx={{
                  p: 3,
                  height: "70vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Medical History
                </Typography>

                <Box
                  sx={{
                    flex: 1,
                    overflow: "auto",
                    pr: 2,
                    mr: -2,
                  }}
                >
                  {/* Reason for Consultation */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Reason for Consultation
                    </Typography>
                    <Typography variant="body1">
                      {patient.reasonForConsultation}
                    </Typography>
                  </Box>

                  {/* Diagnoses */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Diagnoses
                    </Typography>
                    {patient.diagnoses.map((diagnosis, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Diagnosis {index + 1}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: "pre-line" }}
                        >
                          {diagnosis.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Chronic Illnesses */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Chronic Illnesses
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {patient.medicalHistory.chronicIllnesses.map(
                        (illness, index) => (
                          <Chip key={index} label={illness} />
                        )
                      )}
                    </Box>
                  </Box>

                  {/* Allergies */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Allergies
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {patient.medicalHistory.allergies.map(
                        (allergy, index) => (
                          <Chip
                            key={index}
                            label={allergy}
                            color="error"
                            variant="outlined"
                          />
                        )
                      )}
                    </Box>
                  </Box>

                  {/* Current Medications */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Current Medications
                    </Typography>
                    <List dense>
                      {patient.medicalHistory.currentMedications.map(
                        (medication, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={medication} />
                          </ListItem>
                        )
                      )}
                    </List>
                  </Box>

                  {/* Previous Treatments */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Previous Treatments
                    </Typography>
                    <List>
                      {patient.medicalHistory.previousTreatments.map(
                        (treatment, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={treatment.treatmentType}
                              secondary={`${treatment.therapistName} - ${treatment.duration}`}
                            />
                          </ListItem>
                        )
                      )}
                    </List>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Family History */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Family Medical History
                    </Typography>
                    <Typography variant="body1">
                      {patient.familyHistory}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  gap: 3,
                  height: "calc(100vh - 200px)",
                }}
              >
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
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
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

                  <List
                    sx={{
                      height: "calc(100vh - 280px)",
                      overflow: "auto",
                    }}
                  >
                    {mockRecords.map((record) => (
                      <React.Fragment key={record.id}>
                        <ListItemButton
                          selected={selectedRecord?.id === record.id}
                          onClick={() => handleRecordSelect(record)}
                          sx={{
                            "&:hover": { bgcolor: "background.default" },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {record.patientName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {record.date}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box component="div">
                                <Box component="span" sx={{ display: 'inline-block' }}>
                                  <Chip
                                    label={record.type}
                                    size="small"
                                    color={getTypeColor(record.type)}
                                    sx={{ my: 0.5 }}
                                  />
                                </Box>
                                <Typography
                                  variant="body2"
                                  component="span"
                                  color="text.secondary"
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {record.notes}
                                </Typography>
                              </Box>
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
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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

                  <Box
                    sx={{
                      p: 2,
                      height: "calc(100vh - 280px)",
                    }}
                  >
                    <RichTextEditor />
                  </Box>
                </Card>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Patient Dialog */}
      <PatientDetailsForm patient={patient} open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />
    </Box>
  );
}
