"use client";

import React from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import AppointmentForm from "@/components/AppointmentForm";

import { Appointment } from "@/types";
import { PatientDetailsForm } from "@/components/PatientDetailsForm";

interface OverviewItem {
  label: string;
  value: string;
  color: string;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  type: "appointment" | "message" | "system";
}

interface RecentPatient {
  id: string;
  name: string;
  nextAppointment: string;
}

const overviewItems: OverviewItem[] = [
  { label: "Appointments", value: "8", color: "#4A90E2" },
  { label: "Pending Tasks", value: "3", color: "#50C878" },
  { label: "Unread Messages", value: "5", color: "#FF6B6B" },
];

const recentPatients: RecentPatient[] = [
  { id: "1", name: "Emily Parker", nextAppointment: "Today, 2:00 PM" },
  { id: "2", name: "Sarah Johnson", nextAppointment: "Today, 3:00 PM" },
  { id: "3", name: "Michael Brown", nextAppointment: "Tomorrow, 10:00 AM" },
  { id: "4", name: "Jessica Wilson", nextAppointment: "Tomorrow, 11:30 AM" },
];

const upcomingAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Sarah Johnson",
    type: "Cognitive Behavioral Therapy",
    date: "2024-03-26",
    startTime: "14:00",
    endTime: "14:45",
    duration: 45,
    status: "scheduled",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Emily Parker",
    type: "Initial Consultation",
    date: "2024-03-26",
    startTime: "15:00",
    endTime: "15:45",
    duration: 45,
    status: "scheduled",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Michael Brown",
    type: "Follow-up",
    date: "2024-03-26",
    startTime: "16:00",
    endTime: "16:45",
    duration: 45,
    status: "scheduled",
  },
];

const notifications: Notification[] = [
  {
    id: "1",
    message: "Appointment with Emily Parker in 30 minutes",
    time: "35m ago",
    type: "appointment",
  },
  {
    id: "3",
    message: "System maintenance scheduled for tonight",
    time: "2h ago",
    type: "system",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isNewPatientOpen, setIsNewPatientOpen] = React.useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = React.useState(false);

  const handleClose = () => {
    setIsNewPatientOpen(false);
    setIsNewAppointmentOpen(false);
  };
  const handleNewAppointment = (appointment: Appointment) => {
    console.log("New appointment:", appointment);
    setIsNewAppointmentOpen(false);
    // TODO: Implement API call to save appointment
  };

  const getNextFourHours = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const hours = [];

    for (let i = 0; i < 4; i++) {
      const hour = (currentHour + i) % 24;
      const isPM = hour >= 12;
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      hours.push(`${hour12}:00 ${isPM ? "PM" : "AM"}`);
    }

    return hours;
  };

  return (
    <Grid container spacing={3}>
      {/* Left Column - Overview and Recent Patients */}
      <Grid item xs={12} md={3}>
        <Card sx={{ p: 3, mb: 3, position: "relative" }}>
          {/* Under Construction Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: "inherit",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold", mb: 1 }}
            >
              UNDER CONSTRUCTION
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", textAlign: "center", px: 2 }}
            >
              We're working on improving this feature for you
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Today&apos;s Overview
          </Typography>
          {overviewItems.map((item) => (
            <Box
              key={item.label}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body1">{item.label}</Typography>
              <Typography
                variant="h6"
                sx={{ color: item.color, fontWeight: "medium" }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Card>
      </Grid>

      {/* Middle Column - Calendar */}
      <Grid item xs={12} md={6}>
        <Card sx={{ px: 3, pt: 2, height: "40%", mb: 2, position: "relative" }}>
          {/* Under Construction Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: "inherit",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold", mb: 1 }}
            >
              UNDER CONSTRUCTION
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", textAlign: "center", px: 2 }}
            >
              We're working on improving this feature for you
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Calendar</Typography>
          </Box>

          {/* Calendar Content */}
          <Box sx={{ position: "relative", height: "240px", mb: 4 }}>
            {/* Time markers */}
            {getNextFourHours().map((time, index) => (
              <Box
                key={time}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: `${index * 25}%`,
                  color: "text.secondary",
                  fontSize: "0.875rem",
                }}
              >
                {time}
              </Box>
            ))}

            {/* Example appointment */}
            <Box
              sx={{
                position: "absolute",
                left: "60px",
                top: "15%",
                width: "calc(100% - 70px)",
                height: "60px",
                bgcolor: "primary.light",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  width: "100%",
                  height: "100%",
                }}
              >
                <Typography variant="subtitle2">Sarah Johnson</Typography>
                <Button
                  onClick={() => {
                    router.push(`/patients/12345?tab=2`);
                    window.open(
                      "https://meet.google.com/auz-djks-zuk",
                      "_blank"
                    );
                  }}
                >
                  Start Session
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 3, position: "relative" }}>
          {/* Under Construction Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: "inherit",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold", mb: 1 }}
            >
              UNDER CONSTRUCTION
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", textAlign: "center", px: 2 }}
            >
              We're working on improving this feature for you
            </Typography>
          </Box>
          {/* Upcoming Appointments */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upcoming Appointments
            </Typography>
            {upcomingAppointments.map((appointment) => (
              <Box
                key={appointment.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar>{appointment.patientName.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="subtitle2">
                      {appointment.patientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.type}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2" color="primary">
                    {appointment.startTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.duration} min
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      </Grid>

      {/* Right Column - Notifications and Quick Actions */}
      <Grid item xs={12} md={3}>
        <Card sx={{ p: 3, mb: 3, position: "relative" }}>
          {/* Under Construction Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: "inherit",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold", mb: 1 }}
            >
              UNDER CONSTRUCTION
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", textAlign: "center", px: 2 }}
            >
              We're working on improving this feature for you
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 2,
                p: 1.5,
                bgcolor: "background.default",
                borderRadius: 1,
              }}
            >
              <NotificationsIcon
                sx={{
                  mr: 1.5,
                  color:
                    notification.type === "appointment"
                      ? "primary.main"
                      : notification.type === "message"
                      ? "success.main"
                      : "warning.main",
                }}
              />
              <Box>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                >
                  {notification.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Card>

        <Card sx={{ p: 3, position: "relative" }}>
          {/* Under Construction Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: "inherit",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold", mb: 1 }}
            >
              UNDER CONSTRUCTION
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", textAlign: "center", px: 2 }}
            >
              We're working on improving this feature for you
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
            onClick={() => setIsNewAppointmentOpen(true)}
          >
            New Appointment
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => setIsNewPatientOpen(true)}
          >
            Add Patient
          </Button>
        </Card>
      </Grid>

      {/* New Patient Dialog */}
      <Box sx={{ mt: 2 }}>
        <PatientDetailsForm open={isNewPatientOpen} onClose={handleClose} />
      </Box>

      {/* New Appointment Dialog */}
      <Dialog
        open={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule New Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <AppointmentForm
              onClose={() => setIsNewAppointmentOpen(false)}
              onSave={handleNewAppointment}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
