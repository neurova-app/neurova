"use client";

import React, { useEffect } from "react";
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
import { useSessionNotes, SessionNote } from "@/contexts/SessionNoteContext";
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

// We'll use the SessionNote interface from our context instead

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

const getContentSummary = (content: OutputData) => {
  // Find the index of the first header or text block
  const headerIndex = content.blocks.findIndex(
    (block) => block.type === "header"
  );
  const firstTextIndex = content.blocks.findIndex(
    (block) => block.type === "paragraph"
  );

  // Determine which block is used for the title (header has priority)
  const titleBlockIndex = headerIndex >= 0 ? headerIndex : firstTextIndex;

  // If we found a title block, look for the next text block after it
  if (titleBlockIndex >= 0) {
    // Find the next paragraph after the title block
    const nextTextBlock = content.blocks
      .slice(titleBlockIndex + 1)
      .find((block) => block.type === "paragraph" || block.type === "header");

    if (nextTextBlock && nextTextBlock.data.text) {
      return (
        nextTextBlock.data.text.substring(0, 60) +
        (nextTextBlock.data.text.length > 60 ? "..." : "")
      );
    }
  }

  // Fallback if no suitable block is found
  return "No additional content";
};

export default function PatientDetailPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const { patients, loading, error } = usePatients();
  const { enqueueSnackbar } = useSnackbar();
  const {
    sessionNotes,
    loading: sessionNotesLoading,
    getSessionNotesByPatientId,
    createSessionNote,
    updateSessionNote,
    deleteSessionNote,
  } = useSessionNotes();

  const initialTab = searchParams.get("tab");
  const [tabValue, setTabValue] = React.useState(
    initialTab ? parseInt(initialTab) : 0
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  // Session registry state
  const [selectedSession, setSelectedSession] =
    React.useState<SessionNote | null>(null);
  const [isCreatingSession, setIsCreatingSession] = React.useState(false);
  const [editorContent, setEditorContent] = React.useState<OutputData | null>(
    null
  );
  const [sessionType, setSessionType] =
    React.useState<string>("Therapy Session");

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

  // Load session notes when the patient ID changes or when we switch to the sessions tab
  useEffect(() => {
    if (patient?.id && tabValue === 2) {
      getSessionNotesByPatientId(patient.id);
    }
  }, [patient?.id, tabValue, getSessionNotesByPatientId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // When switching to Session Registry tab (tab 2), create a new session if none is selected
    if (newValue === 2 && !selectedSession && !isCreatingSession) {
      handleCreateSession();
    }
  };

  const handleSessionSelect = (session: SessionNote) => {
    setSelectedSession(session);
    setEditorContent(session.content);
    setIsCreatingSession(false);
  };

  const handleCreateSession = () => {
    if (!patient) return;
    const newSession: Omit<SessionNote, "id" | "created_at" | "updated_at"> = {
      //@ts-expect-error: the ID is a string but cannot be an empty string as the  databse wont know how to handle it
      patient_id: patient.id,
      patient_name: patient.fullName || "Unknown Patient",
      title: "New Session",
      type: "Therapy Session",
      date: new Date().toISOString().split("T")[0],
      content: {
        time: Date.now(),
        blocks: [
          {
            type: "paragraph",
            data: {
              text: "",
            },
          },
        ],
        version: "2.26.5",
      },
      patientName: patient.fullName || "Unknown Patient",
    };

    // Create a temporary session for the UI
    setSelectedSession({
      id: `temp-${Date.now()}`,
      ...newSession,
    });
    setEditorContent(newSession.content);
    setIsCreatingSession(true);
  };

  const handleSaveSession = () => {
    if (!editorContent || !selectedSession || !patient) return;

    // Always generate title based on current content
    let autoTitle = "New Session";

    // Try to find the first header
    const headerBlock = editorContent.blocks.find(
      (block) => block.type === "header"
    );
    if (headerBlock && headerBlock.data.text) {
      autoTitle = headerBlock.data.text;
    } else {
      // Try to find the first paragraph
      const paragraphBlock = editorContent.blocks.find(
        (block) => block.type === "paragraph"
      );
      if (paragraphBlock && paragraphBlock.data.text) {
        // Limit to first 30 characters
        autoTitle =
          paragraphBlock.data.text.substring(0, 30) +
          (paragraphBlock.data.text.length > 30 ? "..." : "");
      }
    }

    if (isCreatingSession) {
      // Creating a new session
      const newSession = {
        patient_id: patient.id,
        patient_name: patient.fullName || "Unknown Patient",
        title: autoTitle,
        type: sessionType,
        date: new Date().toISOString().split("T")[0],
        content: editorContent,
      };

      createSessionNote(
        newSession as Omit<SessionNote, "id" | "created_at" | "updated_at">
      )
        .then((createdNote) => {
          if (createdNote) {
            setSelectedSession(createdNote);
            setIsCreatingSession(false);
            enqueueSnackbar("Session created successfully", {
              variant: "success",
            });
          }
        })
        .catch((error) => {
          console.error("Error creating session:", error);
          enqueueSnackbar("Failed to create session", { variant: "error" });
        });
    } else if (selectedSession) {
      // Updating an existing session
      const updatedSession = {
        id: selectedSession.id,
        title: autoTitle,
        type: sessionType,
        content: editorContent,
      };

      updateSessionNote(updatedSession)
        .then((updatedNote) => {
          if (updatedNote) {
            setSelectedSession(updatedNote);
            enqueueSnackbar("Session updated successfully", {
              variant: "success",
            });
          }
        })
        .catch((error) => {
          console.error("Error updating session:", error);
          enqueueSnackbar("Failed to update session", { variant: "error" });
        });
    }
  };

  const handleDeleteSession = () => {
    if (!selectedSession) return;

    // Store the ID of the current session
    const currentSessionId = selectedSession.id;

    // Delete the current session
    deleteSessionNote(currentSessionId)
      .then((success) => {
        if (success) {
          // Get the updated list of sessions (excluding the deleted one)
          const updatedSessionNotes = sessionNotes
            .filter((session) => session.id !== currentSessionId)
            .slice() // Create a copy to sort
            .sort((a, b) => {
              const dateA = a.created_at ? new Date(a.created_at) : new Date();
              const dateB = b.created_at ? new Date(b.created_at) : new Date();
              return dateB.getTime() - dateA.getTime(); // Newest to oldest
            });

          // Find the next session to select
          let nextSession = null;

          // If there are other sessions available
          if (updatedSessionNotes.length > 0) {
            // Just select the first (newest) session
            nextSession = updatedSessionNotes[0];
          }

          // Set the next session or clear if none available
          if (nextSession) {
            setSelectedSession(nextSession);
            setEditorContent(nextSession.content);
          } else {
            setSelectedSession(null);
            setEditorContent(null);
          }

          enqueueSnackbar("Session deleted successfully", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Failed to delete session", { variant: "error" });
        }
      })
      .catch((error) => {
        console.error("Error deleting session:", error);
        enqueueSnackbar("Failed to delete session", { variant: "error" });
      });
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    
    // Parse the date string directly to avoid timezone issues
    const [year, month, day] = dateOfBirth.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

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

  console.log(sessionNotes);

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
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                size="small"
                onClick={() => setIsEditDialogOpen(true)}
              >
                Edit
              </Button>
              <Typography variant="h6">{patient.fullName || "Not provided"}</Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: #{patient.id || "Not provided"}
              </Typography>
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
                  height: "72vh",
                  display: "flex",
                  paddingBottom: 2,
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
                        {patient.fullName || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth (Age)
                      </Typography>
                      <Typography variant="body1">
                        {(() => {
                          // Parse the date string directly to avoid timezone issues
                          if (!patient.dateOfBirth) return "Not provided";
                          
                          const [year, month, day] = patient.dateOfBirth.split('-').map(Number);
                          const birthDate = new Date(year, month - 1, day);
                          
                          return birthDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                        })()} {" "}
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
                        {patient.gender || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        National ID (Cédula)
                      </Typography>
                      <Typography variant="body1">
                        {patient.nationalId || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Blood Type (RH)
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {patient.bloodType || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Marital Status
                      </Typography>
                      <Typography variant="body1">
                        {patient.maritalStatus || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Education Level
                      </Typography>
                      <Typography variant="body1">
                        {patient.educationLevel || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Occupation
                      </Typography>
                      <Typography variant="body1">
                        {patient.occupation || "Not provided"}
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
                        {patient.phoneNumber || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1">
                        {patient.email || "Not provided"}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Emergency Contact
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1">
                          {patient.emergencyContact?.name || "Not provided"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Relationship
                        </Typography>
                        <Typography variant="body1">
                          {patient.emergencyContact?.relationship || "Not provided"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1">
                          {patient.emergencyContact?.phoneNumber || "Not provided"}
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
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Residential Address
                      </Typography>
                      <Typography variant="body1">
                        {patient.address || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        City
                      </Typography>
                      <Typography variant="body1">
                        {patient.city || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        State
                      </Typography>
                      <Typography variant="body1">
                        {patient.state || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Country
                      </Typography>
                      <Typography variant="body1">
                        {patient.country || "Not provided"}
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
                    {patient.diagnoses && patient.diagnoses.length > 0 ? (
                      patient.diagnoses.map((diagnosis, index) => (
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
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not provided
                      </Typography>
                    )}
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
                      {patient.medicalHistory.chronicIllnesses.length > 0 && 
                       patient.medicalHistory.chronicIllnesses.some(illness => illness.trim() !== "") ? (
                        patient.medicalHistory.chronicIllnesses
                          .filter(illness => illness.trim() !== "")
                          .map((illness, index) => (
                            <Chip key={index} label={illness} />
                          ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not provided
                        </Typography>
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
                      {patient.medicalHistory.allergies.length > 0 && 
                       patient.medicalHistory.allergies.some(allergy => allergy.trim() !== "") ? (
                        patient.medicalHistory.allergies
                          .filter(allergy => allergy.trim() !== "")
                          .map((allergy, index) => (
                            <Chip
                              key={index}
                              label={allergy}
                              color="error"
                              variant="outlined"
                            />
                          ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not provided
                        </Typography>
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
                    {patient.medicalHistory.currentMedications.length > 0 && 
                     patient.medicalHistory.currentMedications.some(med => med.trim() !== "") ? (
                      <List dense>
                        {patient.medicalHistory.currentMedications
                          .filter(med => med.trim() !== "")
                          .map((medication, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={medication} />
                            </ListItem>
                          ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not provided
                      </Typography>
                    )}
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
                    {patient.medicalHistory.previousTreatments.length > 0 && 
                     patient.medicalHistory.previousTreatments.some(t => t.therapistName.trim() !== "" || t.treatmentType.trim() !== "" || t.duration.trim() !== "") ? (
                      <List>
                        {patient.medicalHistory.previousTreatments
                          .filter(t => t.therapistName.trim() !== "" || t.treatmentType.trim() !== "" || t.duration.trim() !== "")
                          .map((treatment, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={treatment.treatmentType || "Unknown treatment"}
                                secondary={`${treatment.therapistName || "Unknown provider"}${treatment.duration ? ` - ${treatment.duration}` : ""}`}
                              />
                            </ListItem>
                          ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not provided
                      </Typography>
                    )}
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
                    {patient.familyHistory && patient.familyHistory.trim() !== "" ? (
                      <Typography variant="body1">
                        {patient.familyHistory}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not provided
                      </Typography>
                    )}
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

                  {sessionNotesLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List
                      sx={{
                        height: "calc(100vh - 280px)",
                        overflow: "auto",
                        paddingBottom: 12,
                      }}
                    >
                      {sessionNotes
                        .slice()
                        .sort((a, b) => {
                          const dateA = a.created_at
                            ? new Date(a.created_at)
                            : new Date();
                          const dateB = b.created_at
                            ? new Date(b.created_at)
                            : new Date();
                          return dateB.getTime() - dateA.getTime();
                        })
                        .map((session) => (
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
                                    <Typography
                                      variant="subtitle1"
                                      component="div"
                                    >
                                      {session.title}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      component="div"
                                      color="text.secondary"
                                    >
                                      {(() => {
                                        // Use session.date if available, otherwise fall back to created_at
                                        const dateString = session.date || session.created_at;
                                        if (!dateString) return "No date available";
                                        
                                        try {
                                          // Handle date string in YYYY-MM-DD format to avoid timezone issues
                                          if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                            const [year, month, day] = dateString.split('-').map(Number);
                                            // Create date with year, month (0-indexed), and day
                                            const date = new Date(year, month - 1, day);
                                            return date.toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric'
                                            });
                                          }
                                          
                                          // For other date formats, use standard parsing
                                          const date = new Date(dateString);
                                          return date.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          });
                                        } catch {
                                          return dateString; // Fallback to original string if parsing fails
                                        }
                                      })()}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Box sx={{ display: "flex", alignItems: "center", my: 0.5 }}>
                                      <Chip
                                        label={session.type}
                                        size="small"
                                        color={getTypeColor(session.type)}
                                        sx={{ display: "inline-flex" }}
                                      />
                                    </Box>
                                    <Box
                                      component="span"
                                      sx={{ display: "block", mt: 0.5 }}
                                    >
                                      {getContentSummary(session.content)}
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
                  )}
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
                        <Box
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel id="session-type-label">
                              Session Type
                            </InputLabel>
                            <Select
                              labelId="session-type-label"
                              value={sessionType}
                              label="Session Type"
                              onChange={(e) => setSessionType(e.target.value)}
                            >
                              <MenuItem value="Therapy Session">
                                Therapy Session
                              </MenuItem>
                              <MenuItem value="Medical Note">
                                Medical Note
                              </MenuItem>
                              <MenuItem value="Lab Result">Lab Result</MenuItem>
                              <MenuItem value="Assessment">Assessment</MenuItem>
                              <MenuItem value="Treatment Plan">
                                Treatment Plan
                              </MenuItem>
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
