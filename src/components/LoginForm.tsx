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
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthError } from '@supabase/supabase-js';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ error: AuthError | null }>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const verificationStatus = searchParams.get('verified');
  const { loginWithGoogle } = useAuth();

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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    
    try {
      const { error } = await loginWithGoogle();
      
      if (error) {
        setError('Failed to sign in with Google. Please try again.');
      }
      // Redirect will happen automatically after successful sign-in
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google sign-in error:', err);
    } finally {
      setGoogleLoading(false);
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
          
          {/* Google Sign-in Button */}
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            sx={{ 
              py: 1.2,
              borderColor: '#DADCE0',
              color: 'text.primary',
              '&:hover': {
                borderColor: '#DADCE0',
                bgcolor: 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            {googleLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign in with Google'
            )}
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
              or
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          
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
            disabled={loading || googleLoading}
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
