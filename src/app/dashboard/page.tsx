"use client";

import React from "react";
import { Box, Grid, Card, Typography, Avatar, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

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

interface Appointment {
  id: string;
  patientName: string;
  type: string;
  time: string;
  duration: number;
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
    patientName: "Sarah Johnson",
    type: "Cognitive Behavioral Therapy",
    time: "2:00 PM",
    duration: 45,
  },
  {
    id: "2",
    patientName: "Sarah Johnson",
    type: "Cognitive Behavioral Therapy",
    time: "2:00 PM",
    duration: 45,
  },
  {
    id: "3",
    patientName: "Sarah Johnson",
    type: "Cognitive Behavioral Therapy",
    time: "2:00 PM",
    duration: 45,
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
        <Card sx={{ p: 3, mb: 3 }}>
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

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Patients
          </Typography>
          {recentPatients.map((patient) => (
            <Box
              key={patient.id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
                p: 1,
                borderRadius: 1,
              }}
              onClick={() => router.push(`/patients/${patient.id}?tab=1`)}
            >
              <Avatar sx={{ mr: 2 }}>{patient.name.charAt(0)}</Avatar>
              <Box>
                <Typography variant="subtitle2">{patient.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  {patient.nextAppointment}
                </Typography>
              </Box>
            </Box>
          ))}
        </Card>
      </Grid>

      {/* Middle Column - Calendar */}
      <Grid item xs={12} md={6}>
        <Card sx={{ px: 3, pt: 2, height: "40%", mb: 2 }}>
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
                    router.push(
                      `/patients/12345?tab=2`
                    );
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

        <Card sx={{ p: 3 }}>
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
                    {appointment.time}
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
        <Card sx={{ p: 3, mb: 3 }}>
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

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
          >
            New Appointment
          </Button>
          <Button fullWidth variant="outlined" startIcon={<PersonAddIcon />}>
            Add Patient
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
}
