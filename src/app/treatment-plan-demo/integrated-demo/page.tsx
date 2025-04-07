"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Breadcrumbs,
  Divider,
} from "@mui/material";
import Link from "next/link";
import TreatmentPlanDemo from "@/components/TreatmentPlanDemo";
import SessionWithTreatmentPlan from "@/components/SessionWithTreatmentPlan";
import GAD7Assessment from "@/components/GAD7Assessment";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`demo-tabpanel-${index}`}
      aria-labelledby={`demo-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function IntegratedDemoPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 2 }}>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary">
            Treatment Plan Integration Demo
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ width: "100%", mb: 4, overflow: "hidden" }} elevation={3}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f5f5f5" }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="demo tabs"
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                py: 2,
                fontWeight: 500,
              },
            }}
          >
            <Tab
              icon={<AssignmentIcon />}
              iconPosition="start"
              label="Treatment Plan"
              sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)" }}
            />
            <Tab
              icon={<CalendarTodayIcon />}
              iconPosition="start"
              label="Session Integration"
              sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)" }}
            />
            <Tab
              icon={<AssessmentIcon />}
              iconPosition="start"
              label="Assessment Tools"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" color="primary">
                Patient Treatment Plan
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setTabValue(1)}
                endIcon={<ArrowForwardIcon />}
              >
                Next: Session Integration
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <TreatmentPlanDemo />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" color="primary">
                Session with Treatment Plan Integration
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setTabValue(2)}
                endIcon={<ArrowForwardIcon />}
              >
                Next: Assessment Tools
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <SessionWithTreatmentPlan />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" color="primary">
                Standardized Assessment Tools
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setTabValue(0)}
                endIcon={<ArrowForwardIcon />}
              >
                Back to Treatment Plan
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <GAD7Assessment />
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}
