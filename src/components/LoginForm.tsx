'use client';

import { useState } from 'react';
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
import { useSearchParams } from 'next/navigation';
import { AuthError } from '@supabase/supabase-js';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ error: AuthError | null }>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const verificationStatus = searchParams.get('verified');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await onLogin(email, password);
      
      if (error) {
        setError(error.message || 'Failed to sign in. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      {verificationStatus === 'pending' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please check your email to verify your account before logging in.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Access your account
          </Typography>
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Link href="/forgot-password" style={{ textDecoration: 'none' }}>
              <Button variant="text" size="small">
                Forgot Password?
              </Button>
            </Link>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="text" size="small">
                Sign up
              </Button>
            </Link>
          </Box>
        </Box>
      </form>
    </Paper>
  );
}
