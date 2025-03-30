"use client";

import React, { useState } from "react";
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
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import { Patient } from "@/types/patient";
import { PatientDetailsForm } from "@/components/PatientDetailsForm";
import { usePatients } from "@/contexts/PatientContext";

export default function PatientsPage() {
  const router = useRouter();
  const { patients, loading, error, deletePatient } = usePatients();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Helper function to create a URL-friendly slug from patient name and ID
  const createPatientSlug = (patient: Patient) => {
    if (!patient.id || !patient.fullName) return patient.id;

    // Create a slug from the patient name
    const nameSlug = patient.fullName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
      .trim();

    // Add the first 8 characters of the ID as a suffix for uniqueness
    const idSuffix = patient.id.split("-")[0];
    return `${nameSlug}-${idSuffix}`;
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    patientId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const handleEdit = () => {
    if (selectedPatient) {
      const patient = patients.find((p) => p.id === selectedPatient);
      if (patient) {
        router.push(`/patients/${createPatientSlug(patient)}`);
      }
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedPatient) {
      setIsDeleting(true);
      try {
        await deletePatient(selectedPatient);
        setNotification({
          open: true,
          message: "Patient deleted successfully",
          severity: "success",
        });
      } catch (err) {
        console.error("Error deleting patient:", err);
        setNotification({
          open: true,
          message: "Failed to delete patient",
          severity: "error",
        });
      } finally {
        setIsDeleting(false);
        handleMenuClose();
      }
    }
  };

  const handleRowClick = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      router.push(`/patients/${createPatientSlug(patient)}`);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Patients</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Add Patient
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : patients.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No patients found. Click &quot;Add Patient&quot; to create your first
          patient record.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Profile</TableCell>
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
              {patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  onClick={() => patient.id && handleRowClick(patient.id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <TableCell>
                    <Avatar
                      src={patient.profilePicture || ""}
                      sx={{ width: 40, height: 40 }}
                    >
                      {patient.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                  </TableCell>
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
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </MenuItem>
      </Menu>

      <PatientDetailsForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
