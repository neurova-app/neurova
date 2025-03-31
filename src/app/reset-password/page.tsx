'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if we have a hash from the URL (from email link)
  useEffect(() => {
    // The hash contains the access token when coming from a reset password email
    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (hash && hash.substring(1).split('&').find(param => param.startsWith('access_token'))) {
        // Hash with access token exists
        try {
          // Extract the access token
          const accessToken = hash
            .substring(1)
            .split('&')
            .find(param => param.startsWith('access_token'))
            ?.split('=')[1];

          if (accessToken) {
            // Set the access token in the session
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: '',
            });
          }
        } catch (error) {
          console.error('Error setting session from URL hash:', error);
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      } else if (!hash) {
        // No hash, check if user is authenticated
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          // Not authenticated and no hash, redirect to forgot password
          router.push('/forgot-password');
        }
      }
    };

    handleHashChange();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        setError(error.message || 'Failed to update password. Please try again.');
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        gap: 3,
        p: 2,
      }}
    >
      <Typography variant="h2" component="h1" color="primary" fontWeight="bold">
        NEUROVA
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Set New Password
      </Typography>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password updated successfully! Redirecting to login...
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1" align="center" gutterBottom>
              Enter your new password below.
            </Typography>
            <TextField
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              disabled={loading || success}
              helperText="Password must be at least 6 characters"
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              disabled={loading || success}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || success}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Remember your password?{' '}
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button variant="text" size="small">
                  Sign in
                </Button>
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
