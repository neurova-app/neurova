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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useSearchParams, useParams } from "next/navigation";
import { usePatients } from "@/contexts/PatientContext";
import { useSnackbar } from "notistack";
import { PatientDetailsForm } from "@/components/PatientDetailsForm";
import PatientProfilePictureUpload from "@/components/PatientProfilePictureUpload";
import ClientRichTextEditor from "@/components/ClientRichTextEditor";
import { OutputData } from "@editorjs/editorjs";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Session {
  id: string;
  patientName: string;
  date: string;
  type: "Medical Note" | "Lab Result" | "Therapy Session" | string;
  title: string;
  content: OutputData;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}


// Mock session data
const mockSessions: Session[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    date: "2024-03-15",
    type: "Therapy Session",
    title: "Initial Assessment",
    content: {
      time: 1616069996740,
      blocks: [
        {
          type: "header",
          data: {
            text: "Initial Assessment Session",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Patient presented with symptoms of anxiety and depression. Reports difficulty sleeping and concentrating at work.",
          },
        },
        {
          type: "list",
          data: {
            style: "unordered",
            items: [
              "Sleep disturbance - 3 hours per night",
              "Decreased appetite",
              "Social withdrawal",
              "Difficulty concentrating",
            ],
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Will begin weekly therapy sessions focusing on CBT techniques and mindfulness practices.",
          },
        },
      ],
      version: "2.26.5",
    },
  },
  {
    id: "2",
    patientName: "Sarah Johnson",
    date: "2024-03-22",
    type: "Therapy Session",
    title: "Follow-up Session",
    content: {
      time: 1616069996740,
      blocks: [
        {
          type: "header",
          data: {
            text: "Follow-up Session",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Patient reports slight improvement in sleep patterns after implementing bedtime routine. Still experiencing anxiety at work.",
          },
        },
        {
          type: "checklist",
          data: {
            items: [
              {
                text: "Practiced deep breathing exercises",
                checked: true,
              },
              {
                text: "Maintained sleep journal",
                checked: true,
              },
              {
                text: "Reduced screen time before bed",
                checked: false,
              },
            ],
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Will continue with current treatment plan and add stress management techniques for workplace situations.",
          },
        },
      ],
      version: "2.26.5",
    },
  },
  {
    id: "3",
    patientName: "Sarah Johnson",
    date: "2024-03-29",
    type: "Medical Note",
    title: "Medication Review",
    content: {
      time: 1616069996740,
      blocks: [
        {
          type: "header",
          data: {
            text: "Medication Review",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Patient reports side effects from current medication including dry mouth and mild headaches. Considering adjustment to dosage or alternative medication.",
          },
        },
        {
          type: "table",
          data: {
            withHeadings: true,
            content: [
              ["Medication", "Dosage", "Frequency", "Side Effects"],
              ["Sertraline", "50mg", "Daily", "Dry mouth, headache"],
              ["Lorazepam", "0.5mg", "As needed", "Drowsiness"],
            ],
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Will monitor for one more week before making any changes to medication regimen.",
          },
        },
      ],
      version: "2.26.5",
    },
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "Medical Note":
      return "primary";
    case "Lab Result":
      return "success";
    case "Therapy Session":
      return "secondary";
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

  // Session registry state
  const [sessions, setSessions] = React.useState<Session[]>(mockSessions);
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(
    null
  );
  const [editorContent, setEditorContent] = React.useState<OutputData | null>(
    null
  );
  const [isCreatingSession, setIsCreatingSession] = React.useState(false);
  const [sessionTitle, setSessionTitle] = React.useState<string>("");
  const [sessionType, setSessionType] =
    React.useState<string>("Therapy Session");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    setEditorContent(session.content);
    setSessionTitle(session.title);
    setSessionType(session.type);
    setIsCreatingSession(false);
  };

  const handleCreateSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      patientName: patient?.fullName || "Unknown Patient",
      date: new Date().toISOString().split("T")[0],
      type: "Therapy Session",
      title: "New Session",
      content: {
        time: Date.now(),
        blocks: [],
        version: "2.26.5",
      },
    };

    setSelectedSession(newSession);
    setEditorContent(newSession.content);
    setSessionTitle("New Session");
    setSessionType("Therapy Session");
    setIsCreatingSession(true);
  };

  const handleSaveSession = () => {
    if (!editorContent || !selectedSession) return;

    // Find the first header or paragraph to use as title
    let autoTitle = sessionTitle;
    if (!autoTitle || autoTitle === "New Session") {
      // Try to find the first header
      const headerBlock = editorContent.blocks.find(block => block.type === "header");
      if (headerBlock && headerBlock.data.text) {
        autoTitle = headerBlock.data.text;
      } else {
        // Try to find the first paragraph
        const paragraphBlock = editorContent.blocks.find(block => block.type === "paragraph");
        if (paragraphBlock && paragraphBlock.data.text) {
          // Limit to first 30 characters
          autoTitle = paragraphBlock.data.text.substring(0, 30) + (paragraphBlock.data.text.length > 30 ? "..." : "");
        }
      }
    }

    if (isCreatingSession) {
      // Creating a new session
      const newSession: Session = {
        ...selectedSession,
        title: autoTitle || sessionTitle,
        type: sessionType,
        content: editorContent,
        date: new Date().toISOString().split("T")[0],
      };

      setSessions([newSession, ...sessions]);
      setSelectedSession(newSession);
      setIsCreatingSession(false);
      enqueueSnackbar("Session created successfully", { variant: "success" });
    } else if (selectedSession) {
      // Updating an existing session
      const updatedSessions = sessions.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              title: autoTitle || sessionTitle,
              type: sessionType,
              content: editorContent,
            }
          : session
      );

      setSessions(updatedSessions);
      setSelectedSession({
        ...selectedSession,
        title: autoTitle || sessionTitle,
        type: sessionType,
        content: editorContent,
      });
      enqueueSnackbar("Session updated successfully", { variant: "success" });
    }
  };

  const handleDeleteSession = () => {
    if (!selectedSession) return;

    const updatedSessions = sessions.filter(
      (session) => session.id !== selectedSession.id
    );
    setSessions(updatedSessions);
    setSelectedSession(null);
    setEditorContent(null);
    setSessionTitle("");
    setSessionType("");
    enqueueSnackbar("Session deleted successfully", { variant: "success" });
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
    if (patientId.includes("-") && p.id === patientId) {
      return true;
    }

    // Otherwise, check if it's a slug that contains the patient's name and ID
    if (p.id && p.fullName) {
      // Extract the ID suffix from the slug (last part after the last hyphen)
      const slugParts = patientId.split("-");
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
                {/* Left Sidebar - Sessions List */}
                <Card sx={{ width: 300, flexShrink: 0 }}>
                  <Box sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search sessions..."
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
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={handleCreateSession}
                      >
                        New Session
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
                    {sessions.map((session) => (
                      <React.Fragment key={session.id}>
                        <ListItemButton
                          selected={selectedSession?.id === session.id}
                          onClick={() => handleSessionSelect(session)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box component="div">
                                <Typography variant="subtitle1" component="div">
                                  {session.title}
                                </Typography>
                                <Typography variant="caption" component="div" color="text.secondary">
                                  {session.date}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <>
                                <Chip
                                  label={session.type}
                                  size="small"
                                  color={getTypeColor(session.type)}
                                  sx={{ my: 0.5, display: "inline-block" }}
                                />
                                <Box component="span" sx={{ display: "block", mt: 0.5 }}>
                                  {session.content.blocks[0]?.data?.text || "No content"}
                                </Box>
                              </>
                            }
                            secondaryTypographyProps={{ component: "div" }}
                          />
                        </ListItemButton>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </Card>

                {/* Main Content - Session Editor */}
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
                        <IconButton
                          color="primary"
                          onClick={handleSaveSession}
                          disabled={!selectedSession && !isCreatingSession}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={handleDeleteSession}
                          disabled={!selectedSession || isCreatingSession}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      {selectedSession && (
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel id="session-type-label">Session Type</InputLabel>
                            <Select
                              labelId="session-type-label"
                              value={sessionType}
                              label="Session Type"
                              onChange={(e) => setSessionType(e.target.value)}
                            >
                              <MenuItem value="Therapy Session">Therapy Session</MenuItem>
                              <MenuItem value="Medical Note">Medical Note</MenuItem>
                              <MenuItem value="Lab Result">Lab Result</MenuItem>
                              <MenuItem value="Assessment">Assessment</MenuItem>
                              <MenuItem value="Treatment Plan">Treatment Plan</MenuItem>
                            </Select>
                          </FormControl>
                          <Typography variant="subtitle1">
                            {isCreatingSession
                              ? "New Session"
                              : selectedSession.title}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      height: "calc(100vh - 280px)",
                    }}
                  >
                    <ClientRichTextEditor
                      data={editorContent || undefined}
                      onChange={setEditorContent}
                      readOnly={!selectedSession && !isCreatingSession}
                      height="calc(100vh - 320px)"
                    />
                  </Box>
                </Card>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Patient Dialog */}
      <PatientDetailsForm
        patient={patient}
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </Box>
  );
}
