"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { Patient } from "@/types/patient";
import { usePatients } from "@/contexts/PatientContext";
import { useSnackbar } from "notistack";

// Define mandatory fields for validation
const mandatoryFields = [
  "fullName",
  "dateOfBirth",
  "gender",
  "nationalId",
  "phoneNumber",
  "emergencyContact.name",
  "emergencyContact.phoneNumber",
  "reasonForConsultation"
];

const initialFormData: Patient = {
  fullName: "",
  dateOfBirth: "",
  gender: "other",
  nationalId: "",
  bloodType: "",
  maritalStatus: "",
  educationLevel: "",
  phoneNumber: "",
  email: "",
  emergencyContact: {
    name: "",
    relationship: "",
    phoneNumber: "",
  },
  address: "",
  city: "",
  state: "",
  country: "",
  occupation: "",
  reasonForConsultation: "",
  diagnoses: [],
  medicalHistory: {
    chronicIllnesses: [""],
    allergies: [""],
    currentMedications: [""],
    previousTreatments: [
      { therapistName: "", duration: "", treatmentType: "" },
    ],
  },
  familyHistory: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  id: "",
};

export const PatientDetailsForm = ({
  patient,
  onClose,
  open = true,
}: {
  patient?: Patient;
  onClose?: () => void;
  open?: boolean;
}) => {
  const [formData, setFormData] = useState<Patient>(
    patient ?? initialFormData
  );
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { updatePatient, addPatient } = usePatients();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mandatory fields
    const errors: Record<string, string> = {};
    
    // Check basic fields
    mandatoryFields.forEach(field => {
      if (field.includes('.')) {
        // Handle nested fields like emergencyContact.name
        const [parent, child] = field.split('.');
        // @ts-expect-error ts(7053)
        if (!formData[parent] || !formData[parent][child]) {
          errors[field] = 'This field is required';
        }
      } else {
        // @ts-expect-error ts(7053)
        if (!formData[field]) {
          errors[field] = 'This field is required';
        }
      }
    });
    
    // If there are validation errors, display them and stop submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      enqueueSnackbar("Please fill in all required fields", { variant: "error" });
      return;
    }
    
    try {
      if (formData.id) {
        // Update existing patient
        await updatePatient(formData.id, formData);
        enqueueSnackbar("Patient updated successfully", { variant: "success" });
      } else {
        // Create new patient - remove the empty id field
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...patientWithoutId } = formData;
        await addPatient(patientWithoutId);
        enqueueSnackbar("Patient created successfully", { variant: "success" });
      }
      onClose?.();
    } catch (error: unknown) {
      console.error("Error saving patient:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save patient";
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof Patient,
    value: string | number | boolean
  ) => {
    // Clear validation error when field is changed
    if (validationErrors[field as string]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
    
    // Special handling for date of birth to ensure timezone consistency
    if (field === "dateOfBirth") {
      // Store the date string directly without timezone conversion
      setFormData((prev) => ({
        ...prev,
        [field]: String(value), // Ensure value is a string
        updatedAt: new Date().toISOString(),
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
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
        updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddDiagnosis = () => {
    setFormData((prev) => ({
      ...prev,
      diagnoses: [
        ...prev.diagnoses,
        { description: "", date: new Date().toISOString().split("T")[0] },
      ],
      updatedAt: new Date().toISOString(),
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
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleRemoveDiagnosis = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      diagnoses: prev.diagnoses.filter((_, i) => i !== index),
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose ?? (() => {})}>
      <DialogTitle>
        Edit Patient Details
        <Tooltip title="Fields marked with * are mandatory">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                label="Full Name*"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
                error={!!validationErrors["fullName"]}
                helperText={validationErrors["fullName"] || ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth*"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                required
                error={!!validationErrors["dateOfBirth"]}
                helperText={validationErrors["dateOfBirth"] || "Date is stored exactly as selected"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Gender*"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                required
                error={!!validationErrors["gender"]}
                helperText={validationErrors["gender"] || ""}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="National ID (Cédula)*"
                value={formData.nationalId}
                onChange={(e) => handleInputChange("nationalId", e.target.value)}
                required
                error={!!validationErrors["nationalId"]}
                helperText={validationErrors["nationalId"] || ""}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Occupation"
                value={formData.occupation}
                onChange={(e) =>
                  handleInputChange("occupation", e.target.value)
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
                label="Phone Number*"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                required
                error={!!validationErrors["phoneNumber"]}
                helperText={validationErrors["phoneNumber"] || ""}
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
                label="Name*"
                value={formData.emergencyContact?.name || ""}
                onChange={(e) =>
                  handleNestedChange("emergencyContact", "name", e.target.value)
                }
                required
                error={!!validationErrors["emergencyContact.name"]}
                helperText={validationErrors["emergencyContact.name"] || ""}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Relationship"
                value={formData.emergencyContact?.relationship || ""}
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
                label="Phone Number*"
                value={formData.emergencyContact?.phoneNumber || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "emergencyContact",
                    "phoneNumber",
                    e.target.value
                  )
                }
                required
                error={!!validationErrors["emergencyContact.phoneNumber"]}
                helperText={validationErrors["emergencyContact.phoneNumber"] || ""}
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
                label="Reason for Consultation*"
                value={formData.reasonForConsultation}
                onChange={(e) =>
                  handleInputChange("reasonForConsultation", e.target.value)
                }
                required
                error={!!validationErrors["reasonForConsultation"]}
                helperText={validationErrors["reasonForConsultation"] || ""}
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
        <Button onClick={() => onClose?.()}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
