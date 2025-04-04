'use client';

import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/utils/theme';
import Box from '@mui/material/Box';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { PatientProvider } from '@/contexts/PatientContext';
import { TherapistProfileProvider } from '@/contexts/TherapistProfileContext';
import { SessionNoteProvider } from '@/contexts/SessionNoteContext';
import Navbar from '@/components/Navbar';
import { SnackbarProvider } from 'notistack';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = ['/', '/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <title>Neurova - Mental Health Platform</title>
        <meta name="description" content="A comprehensive platform for mental health professionals" />
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
              <AuthProvider>
                <PatientProvider>
                  <TherapistProfileProvider>
                    <SessionNoteProvider>
                      <Box sx={{ display: "flex", minHeight: "100vh" }}>
                        {!isAuthPage && <Navbar />}
                        <Box
                          component="main"
                          sx={{
                            flexGrow: 1,
                            p: 3,
                            mt: !isAuthPage ? 8 : 0,
                            bgcolor: "background.default",
                          }}
                        >
                          {children}
                        </Box>
                      </Box>
                    </SessionNoteProvider>
                  </TherapistProfileProvider>
                </PatientProvider>
              </AuthProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
