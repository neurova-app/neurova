"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types";
import {
  auth,
  googleProvider,
} from "@/utils/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  loginWithGoogle: () => Promise<{ error: Error | null }>;
  signup: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateUserProfile: (
    userData: Partial<User>
  ) => Promise<{ error: Error | null }>;
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

  // Convert Firebase user to our User type
  const formatUser = (firebaseUser: FirebaseUser | null): User | null => {
    if (!firebaseUser) return null;

    const name = firebaseUser.displayName || 'User';
    const email = firebaseUser.email || '';
    const avatar = firebaseUser.photoURL || undefined;

    // Check if Google provider is linked
    const hasGoogleProvider = firebaseUser.providerData.some(
      (p) => p.providerId === 'google.com'
    );
    setHasCalendarConnected(hasGoogleProvider);

    return {
      id: firebaseUser.uid,
      name,
      email,
      role: 'user',
      avatar,
    };
  };

  useEffect(() => {
    // Check if user is authenticated with Supabase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        setUser(formatUser(firebaseUser));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    const publicPaths = [
      "/login",
      "/",
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
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
      return { error: null };
    } catch (error: unknown) {
      console.error("Login error:", error);
      return { error: error as Error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        localStorage.setItem('googleAccessToken', credential.accessToken);
      }
      router.push("/dashboard");
      return { error: null };
    } catch (error: unknown) {
      console.error("Google login error:", error);
      return { error: error as Error };
    }
  };

  const signup = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (userData.name) {
        await updateProfile(cred.user, {
          displayName: userData.name,
          photoURL: userData.avatar,
        });
      }
      router.push("/dashboard");
      return { error: null };
    } catch (error: unknown) {
      console.error("Signup error:", error);
      return { error: error as Error };
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      return { error: error as Error };
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!auth.currentUser) return { error: new Error('No user') };
    try {
      await updateProfile(auth.currentUser, {
        displayName: userData.name ?? auth.currentUser.displayName ?? '',
        photoURL: userData.avatar ?? auth.currentUser.photoURL ?? '',
      });

      if (auth.currentUser && user) {
        setUser({
          ...user,
          name: auth.currentUser.displayName || user.name,
          avatar: auth.currentUser.photoURL || user.avatar,
        });
      }

      return { error: null };
    } catch (error: unknown) {
      console.error("Update user profile error:", error);
      return { error: error as Error };
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
