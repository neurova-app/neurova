'use client';

import { Box, Container, Paper } from '@mui/material';
import Image from 'next/image';
import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react';

export default function Login() {
  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper 
        elevation={2} 
        sx={{ 
          maxWidth: 480, 
          width: '100%', 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 4
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', width: 60, height: 60, mx: 'auto', mb: 2 }}>
              <Image
                src="/images/neurova_logo.png"
                alt="Neurova Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box component="h1" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 1, color: '#2196f3' }}>
                NEUROVA
              </Box>
              <Box component="h2" sx={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}>
                Welcome to Neurova
              </Box>
            </Box>
          </Box>
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
          <Box sx={{ mt: 4, textAlign: 'center', fontSize: '0.75rem', color: '#757575' }}>
            2025 Neurova. All rights reserved.
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
