"use client";

import React, { useState, useEffect } from "react";
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
  IconButton,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  CardHeader,
  CardContent,
  Paper,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import EventIcon from "@mui/icons-material/Event";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useRouter } from "next/navigation";
import AppointmentForm from "@/components/AppointmentForm";
import { Appointment } from "@/types";
import { PatientDetailsForm } from "@/components/PatientDetailsForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import {
  getCalendarEvents,
  createCalendarEvent,
  appointmentToCalendarEvent,
} from "@/utils/googleCalendar";

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

const overviewItems: OverviewItem[] = [
  { label: "Appointments", value: "8", color: "#4A90E2" },
  { label: "Pending Tasks", value: "3", color: "#50C878" },
  { label: "Unread Messages", value: "5", color: "#FF6B6B" },
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
  // Keep router for potential future use
  const { user, hasCalendarConnected, loginWithGoogle } = useAuth();
  const [isNewPatientOpen, setIsNewPatientOpen] = React.useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = React.useState(false);
  const [showCalendarPrompt, setShowCalendarPrompt] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Check if user has connected Google Calendar
  useEffect(() => {
    // Use the hasCalendarConnected state from AuthContext
    setShowCalendarPrompt(!hasCalendarConnected);

    // Log user info for debugging (using the user variable to fix lint error)
    if (user) {
      console.log(`Dashboard loaded for user: ${user.name} (${user.id})`);
    }
  }, [hasCalendarConnected, user]);

  // Fetch calendar events when calendar is connected
  useEffect(() => {
    if (hasCalendarConnected) {
      fetchCalendarEvents();
    }
  }, [hasCalendarConnected]);

  // Update page title based on connection status
  useEffect(() => {
    document.title = hasCalendarConnected
      ? "Neurova - Dashboard (Calendar Connected)"
      : "Neurova - Dashboard";
  }, [hasCalendarConnected]);

  // Fetch calendar events from Google Calendar
  const fetchCalendarEvents = async () => {
    try {
      setCalendarLoading(true);
      const events = await getCalendarEvents();

      if (events) {
        // Convert Google Calendar events to Appointment type
        const appointments: Appointment[] = events.map((event) => ({
          id: event.id || "",
          patientId: "",
          patientName:
            event.summary?.replace("Appointment with ", "") ||
            "Unknown Patient",
          date: new Date(event.start.dateTime).toISOString().split("T")[0],
          startTime: new Date(event.start.dateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          endTime: new Date(event.end.dateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          duration: Math.round(
            (new Date(event.end.dateTime).getTime() -
              new Date(event.start.dateTime).getTime()) /
              (1000 * 60)
          ),
          status: "scheduled",
          notes: event.description || "",
          type: "Therapy Session",
          meetLink:
            event.conferenceData?.entryPoints?.find(
              (ep) => ep.entryPointType === "video"
            )?.uri || "",
          startDateTime: new Date(event.start.dateTime).getTime(), // Store timestamp for sorting
        }));

        // Sort appointments by proximity to current date/time
        appointments.sort((a, b) => {
          const timeA = a.startDateTime || Number.MAX_SAFE_INTEGER;
          const timeB = b.startDateTime || Number.MAX_SAFE_INTEGER;
          return timeA - timeB;
        });

        setUpcomingAppointments(appointments);
      }
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleClose = () => {
    setIsNewPatientOpen(false);
    setIsNewAppointmentOpen(false);
  };

  const handleCloseCalendarPrompt = () => {
    setShowCalendarPrompt(false);
  };

  const handleConnectCalendar = async () => {
    try {
      console.log("Connecting to Google Calendar...");
      setCalendarLoading(true);
      
      // Use the Auth context's loginWithGoogle function to trigger OAuth flow
      await loginWithGoogle();
      
      // After successful login, update user metadata
      const {
        data: { user: authUser },
      } = await supabase.auth.updateUser({
        data: {
          calendar_connected: true,
        },
      });

      if (authUser) {
        setShowCalendarPrompt(false);
        setShowSuccessAlert(true);
        
        // Fetch calendar events after successful connection
        fetchCalendarEvents();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error connecting to Google Calendar:", error);
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleCreateAppointment = async (
    appointmentData: Partial<Appointment>,
    patient: { full_name: string; email?: string }
  ) => {
    try {
      // Create appointment in your database
      // ...

      // If calendar is connected, also create event in Google Calendar
      if (hasCalendarConnected) {
        const calendarEvent = appointmentToCalendarEvent(
          appointmentData,
          patient
        );
        await createCalendarEvent(calendarEvent);
      }

      // Refresh appointments
      if (hasCalendarConnected) {
        fetchCalendarEvents();
      }

      handleClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Google Calendar Connection Prompt */}
      {showCalendarPrompt && (
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              position: "relative",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "primary.main",
              color: "primary.light",
            }}
          >
            <Box sx={{ mb: { xs: 2, sm: 0 } }}>
              <Typography variant="h6" gutterBottom>
                Connect Your Google Calendar
              </Typography>
              <Typography variant="body2" color="primary.light">
                You must connect your Google Calendar to use appointment
                features. This enables scheduling with Google Meet links for
                virtual sessions.
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<GoogleIcon />}
              onClick={handleConnectCalendar}
              sx={{
                px: 3,
                py: 1,
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}
            >
              Connect Calendar
            </Button>
          </Paper>
        </Grid>
      )}

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
      </Grid>

      {/* Middle Column - Calendar */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardHeader title="Upcoming Appointments" />
          <CardContent sx={{ flexGrow: 1, overflow: "auto" }}>
            {calendarLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : showCalendarPrompt ? (
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Typography color="text.secondary" gutterBottom>
                  Connect Google Calendar to manage appointments
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  You need to connect your Google Calendar to create and view
                  appointments
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<GoogleIcon />}
                  onClick={handleConnectCalendar}
                >
                  Connect Google Calendar
                </Button>
              </Box>
            ) : upcomingAppointments.length > 0 ? (
              <List>
                {upcomingAppointments.map((appointment) => (
                  <ListItem
                    key={appointment.id}
                    disablePadding
                    secondaryAction={
                      appointment.meetLink && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          startIcon={<VideocamIcon />}
                          onClick={() =>
                            window.open(appointment.meetLink, "_blank")
                          }
                          sx={{ fontSize: "0.75rem" }}
                        >
                          Join
                        </Button>
                      )
                    }
                  >
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "secondary.main" }}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.patientName}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {new Date(appointment.date).toLocaleDateString()}{" "}
                              - {appointment.startTime}
                            </Typography>
                            <br />
                            {appointment.type}
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Typography color="text.secondary">
                  No upcoming appointments
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setIsNewAppointmentOpen(true)}
                  sx={{ mt: 2 }}
                  disabled={showCalendarPrompt}
                >
                  Schedule Appointment
                </Button>
              </Box>
            )}
          </CardContent>
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
            startIcon={<EventIcon />}
            onClick={() => setIsNewAppointmentOpen(true)}
            sx={{ mb: 2 }}
            disabled={showCalendarPrompt}
          >
            Schedule Appointment
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
              onSave={handleCreateAppointment}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Alert */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccessAlert(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Google Calendar connected successfully!
        </Alert>
      </Snackbar>
    </Grid>
  );
}
