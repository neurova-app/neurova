"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/Lock";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function LoginForm() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const verificationStatus = searchParams.get("verified");
  const sessionExpired = searchParams.get("expired") === "true";
  const { loginWithGoogle } = useAuth();

  // Show a message when the session has expired
  useEffect(() => {
    if (sessionExpired) {
      setError(
        "Your session has expired. Please sign in again with Google to continue."
      );
    }
  }, [sessionExpired]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error } = await loginWithGoogle();

      if (error) {
        setError("Failed to sign in with Google. Please try again.");
        console.error("Google sign-in error:", error);
      }
      // Redirect will happen automatically after successful sign-in
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Google sign-in error:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {verificationStatus === "pending" && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            "& .MuiAlert-message": { width: "100%", textAlign: "center" },
          }}
        >
          Please check your email to verify your account before logging in.
        </Alert>
      )}

      {sessionExpired && (
        <Box sx={{ mb: 2 }}>
          <Alert
            icon={<WarningAmberIcon fontSize="inherit" />}
            severity="warning"
            sx={{
              "& .MuiAlert-message": { width: "100%", textAlign: "center" },
            }}
          >
            Your session has expired. Please sign in again with Google to
            continue.
          </Alert>
        </Box>
      )}

      {error && !sessionExpired && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            "& .MuiAlert-message": { width: "100%", textAlign: "center" },
          }}
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          p: 2,
          borderRadius: 1,
          mb: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Neurova requires Google authentication to enable calendar integration
          for appointment scheduling.
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LockIcon sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Your data is secure and protected
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        startIcon={
          googleLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '& svg': {
                color: '#fff'
              }
            }}>
              <GoogleIcon />
            </Box>
          )
        }
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        sx={{
          py: 1.5,
          bgcolor: "#4285F4",
          color: "white",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "1rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          "&:hover": {
            bgcolor: "#3367D6",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },
          "&:active": {
            bgcolor: "#2A56C6",
          },
        }}
      >
        {googleLoading ? "Signing in..." : "Continue with Google"}
      </Button>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          By continuing, you agree to our{" "}
          <Link
            href="/terms-of-service"
            style={{ color: "#4285F4", textDecoration: "none" }}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            style={{ color: "#4285F4", textDecoration: "none" }}
          >
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
