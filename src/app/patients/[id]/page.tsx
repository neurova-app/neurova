"use client";

import React from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Tab,
  Tabs,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Card,
  TextField,
  InputAdornment,
  IconButton,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Patient } from "@/types/patient";
import { useSearchParams } from "next/navigation";

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

// Mock patient data
const mockPatient: Patient = {
  id: "12345",
  fullName: "Sarah Johnson",
  dateOfBirth: "1985-03-15",
  gender: "female",
  nationalId: "123456789",
  bloodType: "O+",
  maritalStatus: "Married",
  educationLevel: "University",
  phoneNumber: "(555) 123-4567",
  email: "sarah.j@email.com",
  emergencyContact: {
    name: "John Johnson",
    relationship: "Spouse",
    phoneNumber: "(555) 987-6543",
  },
  address: "123 Main St",
  city: "Springfield",
  state: "IL",
  country: "USA",
  occupation: "Teacher",
  reasonForConsultation: "Anxiety and stress management",
  diagnoses: [
    {
      description: "Generalized Anxiety Disorder",
      date: "2024-03-26",
    },
  ],
  medicalHistory: {
    chronicIllnesses: ["Asthma", "Migraine"],
    allergies: ["Penicillin", "Pollen"],
    currentMedications: ["Albuterol inhaler", "Sumatriptan"],
    previousTreatments: [
      {
        therapistName: "Dr. Smith",
        duration: "6 months",
        treatmentType: "CBT",
      },
    ],
  },
  familyHistory: "Mother: Depression, Father: Hypertension",
  createdAt: "2024-01-01",
  updatedAt: "2024-03-26",
};

// Mock records data
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
  const initialTab = searchParams.get("tab");
  const [tabValue, setTabValue] = React.useState(initialTab ? parseInt(initialTab) : 0);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<MedicalRecord | null>(null);
  const [notes, setNotes] = React.useState("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = (patientData: Patient) => {
    console.log(patientData)
    setIsEditDialogOpen(false);
    // TODO: Implement save logic
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

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Column - Patient Info */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                src="/sarah-johnson.jpg"
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                }}
              >
                {mockPatient.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Typography variant="h6">{mockPatient.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: #{mockPatient.id}
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
                        {mockPatient.fullName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth (Age)
                      </Typography>
                      <Typography variant="body1">
                        {new Date(mockPatient.dateOfBirth).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}{" "}
                        ({calculateAge(mockPatient.dateOfBirth)} years)
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
                        {mockPatient.gender}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        National ID (Cédula)
                      </Typography>
                      <Typography variant="body1">
                        {mockPatient.nationalId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Blood Type (RH)
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {mockPatient.bloodType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Marital Status
                      </Typography>
                      <Typography variant="body1">
                        {mockPatient.maritalStatus}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Education Level
                      </Typography>
                      <Typography variant="body1">
                        {mockPatient.educationLevel}
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
                        {mockPatient.phoneNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1">
                        {mockPatient.email}
                      </Typography>
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
                          {mockPatient.emergencyContact.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Relationship
                        </Typography>
                        <Typography variant="body1">
                          {mockPatient.emergencyContact.relationship}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1">
                          {mockPatient.emergencyContact.phoneNumber}
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
                        {mockPatient.address || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        City
                      </Typography>
                      <Typography variant="body1">
                        {mockPatient.city}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        State
                      </Typography>
                      <Typography variant="body1">
                        {mockPatient.state}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Country
                      </Typography>
                      <Typography variant="body1">
                        {mockPatient.country}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Occupation
                      </Typography>
                      <Typography variant="body1">
                        {mockPatient.occupation}
                      </Typography>
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
                      {mockPatient.reasonForConsultation}
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
                    {mockPatient.diagnoses.map((diagnosis, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Diagnosis {index + 1}
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
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
                      {mockPatient.medicalHistory.chronicIllnesses.map(
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
                      {mockPatient.medicalHistory.allergies.map(
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
                      {mockPatient.medicalHistory.currentMedications.map(
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
                      {mockPatient.medicalHistory.previousTreatments.map(
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
                      {mockPatient.familyHistory}
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
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
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
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Patient Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Patient Information</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <PatientDetailsForm
              patient={mockPatient}
              onClose={() => setIsEditDialogOpen(false)}
              onSave={handleSave}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

const PatientDetailsForm = ({
  patient,
  onClose,
  onSave,
}: {
  patient: Patient;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}) => {
  const [formData, setFormData] = React.useState<Patient>(patient);

  const handleInputChange = (field: keyof Patient, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (
    parent: keyof Patient,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        // @ts-expect-error ts(2345)
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (
    field: keyof typeof formData.medicalHistory,
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...prev.medicalHistory[field]];
      newArray[index] = value;
      return {
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [field]: newArray,
        },
      };
    });
  };

  const handleAddArrayItem = (field: keyof typeof formData.medicalHistory) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: [...prev.medicalHistory[field], ""],
      },
    }));
  };

  const handleRemoveArrayItem = (
    field: keyof typeof formData.medicalHistory,
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: prev.medicalHistory[field].filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddDiagnosis = () => {
    setFormData((prev) => ({
      ...prev,
      diagnoses: [
        ...prev.diagnoses,
        { description: "", date: new Date().toISOString().split("T")[0] },
      ],
    }));
  };

  const handleDiagnosisChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newDiagnoses = [...prev.diagnoses];
      newDiagnoses[index] = {
        ...newDiagnoses[index],
        [field]: value,
      };
      return {
        ...prev,
        diagnoses: newDiagnoses,
      };
    });
  };

  const handleRemoveDiagnosis = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      diagnoses: prev.diagnoses.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogTitle>Edit Patient Details</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="National ID"
                value={formData.nationalId}
                onChange={(e) =>
                  handleInputChange("nationalId", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Blood Type"
                value={formData.bloodType}
                onChange={(e) => handleInputChange("bloodType", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Marital Status"
                value={formData.maritalStatus}
                onChange={(e) =>
                  handleInputChange("maritalStatus", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Education Level"
                value={formData.educationLevel}
                onChange={(e) =>
                  handleInputChange("educationLevel", e.target.value)
                }
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Contact Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Emergency Contact
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Name"
                value={formData.emergencyContact.name}
                onChange={(e) =>
                  handleNestedChange("emergencyContact", "name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Relationship"
                value={formData.emergencyContact.relationship}
                onChange={(e) =>
                  handleNestedChange(
                    "emergencyContact",
                    "relationship",
                    e.target.value
                  )
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.emergencyContact.phoneNumber}
                onChange={(e) =>
                  handleNestedChange(
                    "emergencyContact",
                    "phoneNumber",
                    e.target.value
                  )
                }
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </Grid>

            {/* Medical Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Medical Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Reason for Consultation"
                value={formData.reasonForConsultation}
                onChange={(e) =>
                  handleInputChange("reasonForConsultation", e.target.value)
                }
              />
            </Grid>

            {/* Diagnoses */}
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography variant="subtitle1">Diagnoses</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddDiagnosis}
                >
                  Add Diagnosis
                </Button>
              </Box>
              {formData.diagnoses.map((diagnosis, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Diagnosis"
                    value={diagnosis.description}
                    onChange={(e) =>
                      handleDiagnosisChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <IconButton
                    color="error"
                    onClick={() => handleRemoveDiagnosis(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            {/* Medical History */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Medical History</Typography>
            </Grid>

            {/* Chronic Illnesses */}
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography variant="subtitle2">Chronic Illnesses</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem("chronicIllnesses")}
                >
                  Add
                </Button>
              </Box>
              {formData.medicalHistory.chronicIllnesses.map(
                (illness, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Illness"
                      value={illness}
                      onChange={(e) =>
                        handleArrayChange(
                          "chronicIllnesses",
                          index,
                          e.target.value
                        )
                      }
                    />
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleRemoveArrayItem("chronicIllnesses", index)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )
              )}
            </Grid>

            {/* Allergies */}
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography variant="subtitle2">Allergies</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem("allergies")}
                >
                  Add
                </Button>
              </Box>
              {formData.medicalHistory.allergies.map((allergy, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Allergy"
                    value={allergy}
                    onChange={(e) =>
                      handleArrayChange("allergies", index, e.target.value)
                    }
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveArrayItem("allergies", index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            {/* Current Medications */}
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography variant="subtitle2">Current Medications</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddArrayItem("currentMedications")}
                >
                  Add
                </Button>
              </Box>
              {formData.medicalHistory.currentMedications.map(
                (medication, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Medication"
                      value={medication}
                      onChange={(e) =>
                        handleArrayChange(
                          "currentMedications",
                          index,
                          e.target.value
                        )
                      }
                    />
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleRemoveArrayItem("currentMedications", index)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )
              )}
            </Grid>

            {/* Family History */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Family History"
                value={formData.familyHistory}
                onChange={(e) =>
                  handleInputChange("familyHistory", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(formData)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
