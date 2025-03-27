'use client';

import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/utils/theme';
import Box from '@mui/material/Box';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/signup'].includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
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
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
