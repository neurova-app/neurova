"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Card, Typography, Avatar, Fab, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AdapterMoment } from "@mui/x-date-pickers-pro/AdapterMoment";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers-pro";
import { Appointment } from "@/types";
import moment, { Moment } from "moment";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Sarah Johnson",
    date: "2024-02-15",
    startTime: "09:00",
    endTime: "10:00",
    type: "Video Session",
    duration: 60,
    status: "Scheduled",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Michael Chen",
    date: "2024-02-15",
    startTime: "11:30",
    endTime: "12:30",
    type: "In-person session",
    duration: 60,
    status: "Scheduled",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Emily Davis",
    date: "2024-02-15",
    startTime: "14:00",
    endTime: "15:00",
    type: "Phone Session",
    duration: 60,
    status: "Scheduled",
  },
  {
    id: "4",
    patientId: "4",
    patientName: "David Wilson",
    date: "2024-02-15",
    startTime: "15:30",
    endTime: "16:30",
    type: "Video Session",
    duration: 60,
    status: "Scheduled",
  },
  {
    id: "5",
    patientId: "5",
    patientName: "Sophie Martinez",
    date: "2024-02-15",
    startTime: "17:00",
    endTime: "18:00",
    type: "In-person session",
    duration: 60,
    status: "Scheduled",
  },
  {
    id: "6",
    patientId: "6",
    patientName: "James Taylor",
    date: "2024-02-15",
    startTime: "19:00",
    endTime: "20:00",
    type: "Video Session",
    duration: 60,
    status: "Scheduled",
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [currentTime, setCurrentTime] = useState<Moment>(moment());
  const [timeSlots, setTimeSlots] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Generate all 24 hour slots
    const slots = Array.from({ length: 24 }, (_, i) => i);
    setTimeSlots(slots);
  }, []);

  useEffect(() => {
    // Scroll to current time when component mounts
    if (timelineRef.current) {
      const currentHour = currentTime.hours();
      const hourHeight = 60; // height of each hour slot in pixels
      const scrollPosition =
        currentHour * hourHeight - timelineRef.current.clientHeight / 2;
      timelineRef.current.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [currentTime]);

 

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "Video Session":
        return "🎥";
      case "In-person session":
        return "👤";
      case "Phone session":
        return "📞";
      default:
        return "📅";
    }
  };

  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const isCurrentTimeInSlot = (hour: number): boolean => {
    const currentHour = currentTime.hours();
    const currentMinute = currentTime.minutes();
    return currentHour === hour && currentMinute >= 0 && currentMinute <= 59;
  };

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Grid container spacing={3}>
        {/* Calendar Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, height: "100%" }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => newValue && setSelectedDate(newValue)}
                sx={{
                  width: "100%",
                  "& .MuiPickersCalendarHeader-root": {
                    pl: 2,
                    pr: 2,
                  },
                  "& .MuiDayCalendar-header, .MuiDayCalendar-weekContainer": {
                    justifyContent: "space-around",
                    width: "100%",
                  },
                }}
              />
            </LocalizationProvider>

            <Box
              sx={{
                mt: 2,
                overflow: "auto",
                maxHeight: "calc(100vh - 500px)",
                width: "100%",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upcoming Appointments
              </Typography>
              {mockAppointments.slice(0, 3).map((appointment) => (
                <Box
                  key={appointment.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "background.default",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                    }}
                  >
                    {appointment.patientName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">
                      {appointment.patientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getAppointmentTypeIcon(appointment.type)}{" "}
                      {appointment.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {moment(appointment.startTime, "HH:mm").format("h:mm A")}{" "}
                      - {moment(appointment.endTime, "HH:mm").format("h:mm A")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Calendar Main Content */}
        <Grid item xs={12} md={9}>
          <Card sx={{ width: "100%" }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  {selectedDate.format("MMMM D, YYYY")}
                </Typography>
              </Box>
            </Box>

            <Box
              ref={timelineRef}
              sx={{
                height: "calc(100vh - 200px)",
                overflowY: "auto",
                position: "relative",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "4px",
                },
              }}
            >
              <Box sx={{ p: 2 }}>
                {/* Time slots */}
                {timeSlots.map((hour) => (
                  <Box
                    key={hour}
                    sx={{
                      display: "flex",
                      height: "60px",
                      position: "relative",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "60px",
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        position: "absolute",
                        top: -10,
                        left: 0,
                        fontWeight: "medium",
                      }}
                    >
                      {formatHour(hour)}
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        position: "relative",
                        borderBottom: 1,
                        borderColor: "divider",
                        height: "60px",
                        ml: "60px",
                      }}
                    >
                      {isCurrentTimeInSlot(hour) && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: `${(currentTime.minutes() / 60) * 100}%`,
                            left: 0,
                            right: 0,
                            height: "2px",
                            bgcolor: "primary.main",
                            zIndex: 2,
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              left: -2,
                              top: -4,
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                            },
                          }}
                        />
                      )}
                      {mockAppointments
                        .filter(
                          (apt) =>
                            parseInt(apt.startTime.split(":")[0]) === hour
                        )
                        .map((apt) => {
                          const minutes = parseInt(apt.startTime.split(":")[1]);
                          const durationInHours = apt.duration / 60;
                          return (
                            <Box
                              key={apt.id}
                              sx={{
                                bgcolor: "#EFF6FF",
                                p: 1.5,
                                borderRadius: 2,
                                border: 1,
                                borderColor: "#DBEAFE",
                                position: "absolute",
                                top: `${(minutes / 60) * 100}%`,
                                left: 0,
                                right: 0,
                                height: `${durationInHours * 100}%`,
                                zIndex: 1,
                                overflow: "hidden",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                "&:hover": {
                                  bgcolor: "primary.main",
                                  "& .MuiTypography-root": { color: "white" },
                                  "& .MuiAvatar-root": {
                                    bgcolor: "white",
                                    color: "primary.main",
                                  },
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 1.5,
                                  height: "100%",
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    fontSize: "0.75rem",
                                    bgcolor: "primary.main",
                                    color: "white",
                                  }}
                                >
                                  {apt.patientName[0]}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.primary"
                                    fontWeight="medium"
                                    sx={{ mb: 0.5 }}
                                  >
                                    {apt.patientName}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: "0.75rem" }}
                                  >
                                    {moment(apt.startTime, "HH:mm").format(
                                      "h:mm A"
                                    )}{" "}
                                    -{" "}
                                    {moment(apt.endTime, "HH:mm").format(
                                      "h:mm A"
                                    )}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  height: "100%",
                                }}
                              >
                                <Box
                                  sx={{
                                    color: "text.secondary",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: "0.75rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  {getAppointmentTypeIcon(apt.type)}
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.025em",
                                      fontWeight: "medium",
                                    }}
                                  >
                                    {apt.type}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          );
                        })}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add appointment"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
