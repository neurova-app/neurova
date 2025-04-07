"use client";

import React from "react";
import { Box, Container, Typography, Button, Breadcrumbs } from "@mui/material";
import Link from "next/link";
import TreatmentPlanDemo from "@/components/TreatmentPlanDemo";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function TreatmentPlanDemoPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link href="/patients" style={{ textDecoration: 'none', color: 'inherit' }}>
          Patients
        </Link>
        <Link href="/patients/pat-1" style={{ textDecoration: 'none', color: 'inherit' }}>
          Emily Parker
        </Link>
        <Typography color="text.primary">Treatment Plan</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Emily Parker - Treatment Plan
        </Typography>
        <Box>
          <Button variant="outlined" sx={{ mr: 2 }}>
            Export Plan
          </Button>
          <Button variant="contained">
            Edit Plan
          </Button>
        </Box>
      </Box>

      <TreatmentPlanDemo />
    </Container>
  );
}
