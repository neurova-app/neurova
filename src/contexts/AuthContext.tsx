'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Emily Wilson',
    email: 'emily.wilson@neurova.com',
    role: 'doctor',
    avatar: undefined
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(auth);
      
      // Redirect logic
      const publicPaths = ['/login', '/signup'];
      const isPublicPath = publicPaths.includes(pathname);

      if (!auth && !isPublicPath) {
        router.push('/login');
      } else if (auth && isPublicPath) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router, pathname]);

  const login = (email: string, password: string) => {
    // Dev bypass
    if (email === 'admin' && password === 'admin') {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setUser({
        id: '1',
        name: 'Emily Wilson',
        email: email,
        role: 'doctor',
        avatar: undefined
      });
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
