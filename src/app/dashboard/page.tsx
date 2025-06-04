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
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import VideocamIcon from "@mui/icons-material/Videocam";
import CancelIcon from "@mui/icons-material/Cancel";
import AppointmentForm from "@/components/AppointmentForm";
import { Appointment } from "@/types";
import { PatientDetailsForm } from "@/components/PatientDetailsForm";
import { useAuth } from "@/contexts/AuthContext";
import { usePatients } from "@/contexts/PatientContext";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  appointmentToCalendarEvent,
  deleteCalendarEvent,
} from "@/utils/googleCalendar";

// Define the notification interface
interface Notification {
  id: string;
  message: string;
  time: string;
  type: "appointment" | "message" | "system";
}

// Define some sample notifications
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
  const { user } = useAuth();
  const { patients } = usePatients();
  const [isNewPatientOpen, setIsNewPatientOpen] = React.useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = React.useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [cancelingAppointment, setCancelingAppointment] = useState<
    string | null
  >(null);
  const [cancelSuccessMessage, setCancelSuccessMessage] = useState<
    string | null
  >(null);
  const [cancelErrorMessage, setCancelErrorMessage] = useState<string | null>(
    null
  );
  const [appointmentToEdit, setAppointmentToEdit] =
    useState<Appointment | null>(null);

  // Add a ref to track if calendar events have been fetched to prevent duplicate fetches in StrictMode
  const calendarFetchedRef = React.useRef(false);

  useEffect(() => {
    if (user) {
      console.log(`Dashboard loaded for user: ${user.name} (${user.id})`);

      // Since we're using Google-only auth, we can assume calendar is always connected
      // Just update user metadata if needed
      // Calendar integration handled by Google sign-in

      // Only fetch calendar events if they haven't been fetched already
      // This prevents duplicate fetches during the initial mount in StrictMode
      if (!calendarFetchedRef.current) {
        calendarFetchedRef.current = true;
        fetchCalendarEvents();
      }
    }
  }, [user]);

  useEffect(() => {
    document.title = "Neurova - Dashboard";
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      setCalendarLoading(true);
      const events = await getCalendarEvents();

      if (events) {
        const appointments: Appointment[] = events.map((event) => {
          // Extract appointment type from the summary
          let appointmentType = "Therapy Session"; // Default type
          let patientName = "Unknown Patient";

          if (event.summary) {
            // Parse appointment type and patient name from the summary
            // Format: "Type with Patient Name"
            const withIndex = event.summary.indexOf(" with ");
            if (withIndex > 0) {
              appointmentType = event.summary.substring(0, withIndex);
              patientName = event.summary.substring(withIndex + 6); // " with " is 6 characters
            } else {
              // Fallback to old format if "with" is not found
              patientName = event.summary.replace("Appointment with ", "");
            }
          }

          // Extract type from description if available
          if (event.description && event.description.startsWith("Type:")) {
            const typeEndIndex = event.description.indexOf("\n\n");
            if (typeEndIndex > 0) {
              appointmentType = event.description
                .substring(6, typeEndIndex)
                .trim();
            }
          }

          return {
            id: event.id || "",
            patientId: "",
            patientName,
            // Fix timezone issue by parsing date components directly
            date: (() => {
              const eventDate = new Date(event.start.dateTime);
              // Use UTC methods to avoid timezone shifts
              return `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
            })(),
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
            notes: event.description
              ? event.description.includes("\n\n")
                ? event.description.substring(
                    event.description.indexOf("\n\n") + 2
                  )
                : event.description
              : "",
            type: appointmentType,
            meetLink:
              event.conferenceData?.entryPoints?.find(
                (ep) => ep.entryPointType === "video"
              )?.uri || "",
            startDateTime: new Date(event.start.dateTime).getTime(), // Store timestamp for sorting
            attendees: event.attendees,
          };
        });

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

  const handleCloseAppointmentForm = () => {
    setIsNewAppointmentOpen(false);
    setAppointmentToEdit(null);
  };

  const handleSaveAppointment = async (
    appointmentData: Appointment,
    patient: { full_name: string; email?: string }
  ) => {
    try {
      if (appointmentData.id) {
        // This is a reschedule - update the existing event
        // Ensure the date is in the correct format before converting to calendar event
        const formattedAppointment = {
          ...appointmentData,
          // Ensure date is in YYYY-MM-DD format without any time component
          date: appointmentData.date.includes("T")
            ? appointmentData.date.split("T")[0]
            : appointmentData.date,
        };

        const calendarEvent = appointmentToCalendarEvent(
          formattedAppointment,
          patient
        );

        // Update the event in Google Calendar
        await updateCalendarEvent(appointmentData.id, calendarEvent);

        // Update the local state with consistent date format
        setUpcomingAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentData.id
              ? {
                  ...formattedAppointment,
                  patientName: patient.full_name,
                  startDateTime: new Date(
                    `${formattedAppointment.date}T${formattedAppointment.startTime}`
                  ).getTime(),
                }
              : apt
          )
        );

        // Show success message
        setCancelSuccessMessage("Appointment rescheduled successfully");
        setTimeout(() => setCancelSuccessMessage(null), 3000);
      } else {
        // This is a new appointment - create a new event
        // Ensure the date is in the correct format before converting to calendar event
        const formattedAppointment = {
          ...appointmentData,
          // Ensure date is in YYYY-MM-DD format without any time component
          date: appointmentData.date.includes("T")
            ? appointmentData.date.split("T")[0]
            : appointmentData.date,
        };

        const calendarEvent = appointmentToCalendarEvent(
          formattedAppointment,
          patient
        );

        // Create the event in Google Calendar
        await createCalendarEvent(calendarEvent);
      }

      // Refresh the calendar events
      fetchCalendarEvents();
    } catch (error) {
      console.error("Error saving appointment:", error);
      setCancelErrorMessage("Failed to save appointment");
      setTimeout(() => setCancelErrorMessage(null), 3000);
    }
  };

  const handleRescheduleAppointment = (appointment: Appointment) => {
    console.log(appointment)
    // Ensure the date is in the correct format for the form (YYYY-MM-DD)
    // This is crucial because the date might have been parsed differently when fetched from Google Calendar
    const appointmentToEdit = {
      ...appointment,
      // Ensure date is in YYYY-MM-DD format
      date: appointment.date.includes("T")
        ? appointment.date.split("T")[0] // Handle ISO format if present
        : appointment.date,
      attendees: appointment.attendees,
    };

    setAppointmentToEdit(appointmentToEdit);
    setIsNewAppointmentOpen(true);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      setCancelingAppointment(appointmentId);

      const success = await deleteCalendarEvent(appointmentId);

      if (success) {
        setUpcomingAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== appointmentId)
        );

        setCancelSuccessMessage("Appointment cancelled successfully");
        setTimeout(() => setCancelSuccessMessage(null), 3000);
      } else {
        throw new Error("Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setCancelErrorMessage("Failed to cancel appointment");
      setTimeout(() => setCancelErrorMessage(null), 3000);
    } finally {
      setCancelingAppointment(null);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Middle Column - Calendar */}
      <Grid item xs={12} md={9}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardHeader title="Upcoming Appointments" />
          <CardContent sx={{ flexGrow: 1, overflow: "auto" }}>
            {calendarLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : upcomingAppointments.length > 0 ? (
              <Box
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
                <List>
                  {upcomingAppointments.map((appointment) => (
                    <ListItem
                      key={appointment.id}
                      disablePadding
                      secondaryAction={
                        appointment.meetLink && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={
                                cancelingAppointment === appointment.id ? (
                                  <CircularProgress size={16} color="error" />
                                ) : (
                                  <CancelIcon />
                                )
                              }
                              onClick={() =>
                                handleCancelAppointment(appointment.id)
                              }
                              disabled={cancelingAppointment === appointment.id}
                              sx={{ fontSize: "0.75rem" }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              startIcon={<EventIcon />}
                              onClick={() =>
                                handleRescheduleAppointment(appointment)
                              }
                              sx={{ fontSize: "0.75rem" }}
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<VideocamIcon />}
                              onClick={() =>
                                window.open(appointment.meetLink, "_blank")
                              }
                              sx={{ fontSize: "0.75rem" }}
                            >
                              Join
                            </Button>
                          </Box>
                        )
                      }
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar
                            src={(() => {
                              // Find the patient in our patients list to get their profile picture
                              const patientName = appointment.patientName;
                              const patient = patients.find(
                                (p) => p.fullName === patientName
                              );
                              return patient?.profilePicture || "";
                            })()}
                          >
                            {/* Always render initials as fallback */}
                            {appointment.patientName
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                              .substring(0, 2)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <>
                              <Typography
                                component="span"
                                variant="h6"
                                color="text.primary"
                              >
                                {`${appointment.type} - ${appointment.patientName}`}
                              </Typography>
                            </>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {(() => {
                                  // Format the date consistently
                                  if (!appointment.date) return "No date";

                                  try {
                                    // Parse the date in YYYY-MM-DD format without timezone shifts
                                    // This approach ensures the date displayed is exactly as stored
                                    const [year, month, day] = appointment.date
                                      .split("-")
                                      .map(Number);

                                    // Create a date object with the correct values
                                    // Use UTC date to prevent timezone shifts
                                    const date = new Date(Date.UTC(year, month - 1, day));
                                    
                                    // Format the date in a user-friendly way
                                    return new Intl.DateTimeFormat("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      timeZone: "UTC" // Use UTC to prevent timezone shifts
                                    }).format(date);
                                  } catch (error) {
                                    console.error(
                                      "Error formatting date:",
                                      error
                                    );
                                    return appointment.date;
                                  }
                                })()}
                              </Typography>
                              <br />
                              <Typography
                                component="span"
                                variant="body2"
                                color="grey.500"
                              >
                                {(() => {
                                  // Convert start time to AM/PM format
                                  if (!appointment.startTime) return "No time";

                                  const [hours, minutes] = appointment.startTime
                                    .split(":")
                                    .map(Number);
                                  const startPeriod = hours >= 12 ? "PM" : "AM";
                                  const startHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
                                  const startFormatted = `${startHours}:${minutes
                                    .toString()
                                    .padStart(2, "0")} ${startPeriod}`;

                                  // Convert end time to AM/PM format if available
                                  if (!appointment.endTime)
                                    return `${startFormatted}`;

                                  const [endHours, endMinutes] =
                                    appointment.endTime.split(":").map(Number);
                                  const endPeriod =
                                    endHours >= 12 ? "PM" : "AM";
                                  const displayEndHours = endHours % 12 || 12; // Convert 0 to 12 for 12 AM
                                  const endFormatted = `${displayEndHours}:${endMinutes
                                    .toString()
                                    .padStart(2, "0")} ${endPeriod}`;

                                  return `${startFormatted} - ${endFormatted}`;
                                })()}
                              </Typography>
                              <br />
                              {/* {appointment.type} */}
                            </>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
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
        onClose={handleCloseAppointmentForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {appointmentToEdit
            ? "Reschedule Appointment"
            : "Schedule New Appointment"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <AppointmentForm
              onClose={handleCloseAppointmentForm}
              onSave={handleSaveAppointment}
              onAddPatient={() => setIsNewPatientOpen(true)}
              appointment={
                appointmentToEdit || {
                  id: "",
                  patientId: "",
                  patientName: "",
                  date: new Date().toISOString().split("T")[0],
                  startTime: "",
                  endTime: "",
                  type: "Therapy Session",
                  duration: 60,
                  status: "scheduled",
                  notes: "",
                }
              }
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Alert */}
      <Snackbar
        open={!!cancelSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setCancelSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setCancelSuccessMessage(null)} severity="success">
          {cancelSuccessMessage}
        </Alert>
      </Snackbar>

      {/* Error Alert for Cancellation */}
      <Snackbar
        open={!!cancelErrorMessage}
        autoHideDuration={6000}
        onClose={() => setCancelErrorMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setCancelErrorMessage(null)} severity="error">
          {cancelErrorMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
