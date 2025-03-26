'use client';

import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/utils/theme';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Typography
      component={Link}
      href={href}
      sx={{
        color: isActive ? "#4A90E2" : "text.primary",
        textDecoration: "none",
        fontWeight: isActive ? "medium" : "regular",
        transition: "color 0.2s ease",
        "&:hover": {
          color: "#4A90E2",
        },
      }}
    >
      {children}
    </Typography>
  );
};

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
                {!isAuthPage && (
                  <AppBar
                    position="fixed"
                    color="inherit"
                    elevation={0}
                    sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
                  >
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography
                          variant="h6"
                          component={Link}
                          href="/dashboard"
                          sx={{
                            color: "primary.main",
                            textDecoration: "none",
                            fontWeight: "bold",
                            flexGrow: 1,
                            mr: 4,
                          }}
                        >
                          NEUROVA
                        </Typography>
                        <Box sx={{ display: "flex", gap: 3 }}>
                          <NavLink href="/dashboard">Dashboard</NavLink>
                          <NavLink href="/patients">Patients</NavLink>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1">Dr. Emily Wilson</Typography>
                        <IconButton>
                          <Avatar src="/path-to-avatar.jpg" alt="Dr. Emily Wilson" />
                        </IconButton>
                      </Box>
                    </Toolbar>
                  </AppBar>
                )}
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    p: isAuthPage ? 0 : 3,
                    mt: isAuthPage ? 0 : 8,
                    backgroundColor: "background.default",
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
