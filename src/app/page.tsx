"use client";

import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Feature icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import VideocamIcon from "@mui/icons-material/Videocam";
import SyncIcon from "@mui/icons-material/Sync";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    router.push("/dashboard");
  }

  const handleOpenApp = () => {
    router.push('/login');
  };

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      {/* Header/Navbar */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ position: "relative", width: 40, height: 40, mr: 1 }}>
            <Image
              src="/images/neurova_logo.png"
              alt="Neurova Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
          <Typography
            variant="h6"
            component="h1"
            sx={{ fontWeight: 700, color: "#333" }}
          >
            NEUROVA
          </Typography>
        </Box>
        <Box>
          <Button 
            onClick={handleOpenApp}
            variant="outlined"
            sx={{ 
              borderColor: "#4285F4", 
              color: "#4285F4",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#3367D6",
                bgcolor: "rgba(66, 133, 244, 0.04)",
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 10 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: "#333",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Streamline Your Therapy Practice
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: "#666",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              All-in-one platform for appointment scheduling, patient
              management, and virtual sessions. Designed specifically for mental
              health professionals.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleOpenApp}
              sx={{ 
                py: 1.5,
                px: 4,
                bgcolor: "#4285F4",
                color: "white",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: "#3367D6",
                },
              }}
            >
              Get Started
            </Button>
            <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
              No credit card required • 14-day free trial
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 300, md: 400 },
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Therapist using Neurova"
                fill
                style={{ objectFit: "cover", borderRadius: "12px" }}
                priority
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: "#f8f9fa", py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              color: "#333",
            }}
          >
            Everything You Need to Run Your Practice
          </Typography>

          <Grid container spacing={4}>
            {/* Feature 1 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{ p: 3, height: "100%", bgcolor: "transparent" }}
              >
                <Box
                  sx={{
                    color: "#4285F4",
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  Smart Scheduling
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                >
                  Effortlessly manage appointments with an intuitive calendar
                  interface
                </Typography>
              </Paper>
            </Grid>

            {/* Feature 2 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{ p: 3, height: "100%", bgcolor: "transparent" }}
              >
                <Box
                  sx={{
                    color: "#4285F4",
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  Patient Management
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                >
                  Keep track of patient information, notes, and progress
                  securely
                </Typography>
              </Paper>
            </Grid>

            {/* Feature 3 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{ p: 3, height: "100%", bgcolor: "transparent" }}
              >
                <Box
                  sx={{
                    color: "#4285F4",
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <VideocamIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  Video Sessions
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                >
                  Conduct virtual therapy sessions with seamless Google Meet
                  integration
                </Typography>
              </Paper>
            </Grid>

            {/* Feature 4 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{ p: 3, height: "100%", bgcolor: "transparent" }}
              >
                <Box
                  sx={{
                    color: "#4285F4",
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <SyncIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  Calendar Sync
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                >
                  Seamlessly sync with Google Calendar
                </Typography>
              </Paper>
            </Grid>

            {/* Feature 5 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{ p: 3, height: "100%", bgcolor: "transparent" }}
              >
                <Box
                  sx={{
                    color: "#4285F4",
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  Automated Reminders
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                >
                  Reduce no-shows with automated email and SMS reminders
                </Typography>
              </Paper>
            </Grid>

            {/* Feature 6 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{ p: 3, height: "100%", bgcolor: "transparent" }}
              >
                <Box
                  sx={{
                    color: "#4285F4",
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  Secure Storage
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                >
                  Secure cloud storage with encryption for patient data
                  protection
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Workflow Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{
            mb: 8,
            fontWeight: 700,
            color: "#333",
          }}
        >
          Simple and Efficient Workflow
        </Typography>

        <Grid container spacing={6} justifyContent="center">
          {/* Step 1 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#4285F4",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  mb: 2,
                  fontWeight: "bold",
                }}
              >
                1
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Sync Your Calendar
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Connect with Google Calendar to keep all your appointments in
                one place
              </Typography>
            </Box>
          </Grid>

          {/* Step 2 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#4285F4",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  mb: 2,
                  fontWeight: "bold",
                }}
              >
                2
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Manage Appointments
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Schedule sessions and send automated reminders to reduce
                no-shows
              </Typography>
            </Box>
          </Grid>

          {/* Step 3 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#4285F4",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  mb: 2,
                  fontWeight: "bold",
                }}
              >
                3
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Conduct Sessions
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Host virtual therapy sessions via Google Meet with automatic
                scheduling
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: "#f8f9fa", py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              color: "#333",
            }}
          >
            Trusted by Mental Health Professionals
          </Typography>

          <Grid container spacing={4}>
            {/* Testimonial 1 */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={1}
                sx={{ p: 4, height: "100%", borderRadius: 2 }}
              >
                <Typography variant="body1" sx={{ mb: 3, fontStyle: "italic" }}>
                  &ldquo;NEUROVA has transformed how I manage my practice. The
                  automated reminders alone have reduced no-shows by 50%.&rdquo;
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Dr. Sarah Johnson
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, color: "text.secondary" }}
                  >
                    Clinical Psychologist
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Testimonial 2 */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={1}
                sx={{ p: 4, height: "100%", borderRadius: 2 }}
              >
                <Typography variant="body1" sx={{ mb: 3, fontStyle: "italic" }}>
                  &ldquo;The intuitive interface and Google Calendar sync make
                  it easy to focus on what matters most - helping my
                  patients.&rdquo;
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Michael Chen
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, color: "text.secondary" }}
                  >
                    Licensed Therapist
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "#4285F4", color: "white", py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Ready to Transform Your Practice?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 400 }}>
            Join thousands of therapists who trust NEUROVA
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleOpenApp}
            sx={{ 
              py: 1.5,
              px: 4,
              bgcolor: "white",
              color: "#4285F4",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              "&:hover": {
                bgcolor: "#f1f3f4",
              },
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1a1a2e", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                NEUROVA
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: "#aaa" }}>
                Empowering mental health professionals with modern practice
                management tools.
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Product
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#aaa" }}>
                Features
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#aaa" }}>
                Security
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#aaa" }}>
                Pricing
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Resources
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#aaa" }}>
                Documentation
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#aaa" }}>
                Help Center
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#aaa" }}>
                Blog
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Company
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#aaa" }}>
                About
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#aaa" }}>
                Careers
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#aaa" }}>
                Contact
              </Typography>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 6,
              pt: 3,
              borderTop: "1px solid #333",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              2025 NEUROVA. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
