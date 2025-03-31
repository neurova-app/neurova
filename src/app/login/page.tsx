'use client';

import { Box, Typography } from '@mui/material';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Suspense } from 'react';

export default function Login() {
  const { login } = useAuth();

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
        Advanced Mental Health Practice Management
      </Typography>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm onLogin={login} />
      </Suspense>
    </Box>
  );
}
