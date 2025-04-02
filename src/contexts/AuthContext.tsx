"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types";
import { supabase } from "@/utils/supabase";
import { AuthError, User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  loginWithGoogle: () => Promise<{ error: AuthError | null }>;
  signup: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserProfile: (
    userData: Partial<User>
  ) => Promise<{ error: AuthError | null }>;
  hasCalendarConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCalendarConnected, setHasCalendarConnected] = useState(false);

  // Convert Supabase user to our User type
  const formatUser = (supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null;

    // Check if user has Google provider and calendar permissions
    const hasGoogleProvider =
      supabaseUser.app_metadata?.providers?.includes("google");
    const hasProviderToken = !!supabaseUser.app_metadata?.provider_token;

    // If user has signed in with Google and has a provider token, they've granted calendar access
    // We should automatically set the calendar_connected flag
    if (
      hasGoogleProvider &&
      hasProviderToken &&
      supabaseUser.user_metadata?.calendar_connected !== true
    ) {
      // Update user metadata to set calendar_connected flag
      supabase.auth
        .updateUser({
          data: { calendar_connected: true },
        })
        .then(({ error }) => {
          if (error) {
            console.error("Error updating calendar_connected flag:", error);
          } else {
            console.log("Calendar connected flag set successfully");
            setHasCalendarConnected(true);
          }
        });
    }

    // Set calendar connected state based on current metadata
    const hasCalendarAccess =
      supabaseUser.user_metadata?.calendar_connected === true;
    setHasCalendarConnected(
      hasGoogleProvider && (hasCalendarAccess || hasProviderToken)
    );

    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || "User",
      email: supabaseUser.email || "",
      role: supabaseUser.user_metadata?.role || "user",
      avatar: supabaseUser.user_metadata?.avatar_url,
    };
  };

  useEffect(() => {
    // Check if user is authenticated with Supabase
    const initializeAuth = async () => {
      try {
        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setIsAuthenticated(true);
          setUser(formatUser(session.user));
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true);
        setUser(formatUser(session.user));
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    const publicPaths = [
      "/",
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
    ];
    const isPublicPath = publicPaths.includes(pathname);
    const isLandingPage = pathname === '/';

    if (!isAuthenticated && !isPublicPath) {
      router.push("/login");
    } else if (isAuthenticated && isPublicPath && !isLandingPage) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, pathname, router, loading]);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        router.push("/dashboard");
      }

      return { error };
    } catch (error) {
      console.error("Login error:", error);
      return { error: error as AuthError };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: "https://www.googleapis.com/auth/calendar.app.created",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Google login error:", error);
      }

      return { error };
    } catch (error) {
      console.error("Google login error:", error);
      return { error: error as AuthError };
    }
  };

  const signup = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || "user",
            avatar_url: userData.avatar,
          },
        },
      });

      if (!error) {
        // Note: User will need to verify email before being fully authenticated
        router.push("/login?verified=pending");
      }

      return { error };
    } catch (error) {
      console.error("Signup error:", error);
      return { error: error as AuthError };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: error as AuthError };
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: userData.name ?? "",
          role: userData.role ?? "",
          avatar_url: userData.avatar ?? "",
          calendar_connected: hasCalendarConnected,
        },
      });

      if (!error && user) {
        // Update the local user state with the new data
        setUser({
          ...user,
          name: userData.name || user.name,
          role: userData.role || user.role,
          avatar: userData.avatar || user.avatar,
        });
      }

      return { error };
    } catch (error) {
      console.error("Update user profile error:", error);
      return { error: error as AuthError };
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    loginWithGoogle,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    hasCalendarConnected,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
