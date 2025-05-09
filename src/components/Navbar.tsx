"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTherapistProfile } from "@/contexts/TherapistProfileContext";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        sx={{
          color: isActive ? "primary.main" : "text.primary",
          fontWeight: isActive ? 600 : 400,
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        {children}
      </Typography>
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { therapistProfile, isLoading } = useTherapistProfile();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [userInitials, setUserInitials] = useState<string>("U");

  useEffect(() => {
    if (user?.name) {
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      setUserInitials(initials);
    }
  }, [user?.name]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleProfile = () => {
    handleClose();
    router.push("/profile");
  };

  return (
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
            href="/"
            sx={{
              textDecoration: "none",
              color: "primary.main",
              fontWeight: 600,
            }}
          >
            NEUROVA
          </Typography>
          <Box sx={{ display: "flex", gap: 3, ml: 4 }}>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/patients">Patients</NavLink>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Dr. {user?.name || "Emily Wilson"}
          </Typography>
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{ position: 'relative' }}
          >
            {isLoading ? (
              <CircularProgress size={32} thickness={2} sx={{ position: 'absolute' }} />
            ) : null}
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                opacity: isLoading ? 0.5 : 1 
              }} 
              src={therapistProfile?.profile_picture || user?.avatar || ""}
            >
              {userInitials}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
