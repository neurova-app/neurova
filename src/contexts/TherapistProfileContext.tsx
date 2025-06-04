'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { therapistOperations } from '@/utils/firebase-db';

// Define the shape of the therapist profile data
interface TherapistProfile {
  id?: string;
  user_id: string;
  specialty?: string;
  bio?: string;
  education?: string;
  years_of_experience?: number;
  created_at?: string;
  updated_at?: string;
  profile_picture?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  insurance_providers?: string[];
  languages_spoken?: string[];
  certifications?: string[];
  licenses?: string[];
  license_number?: string;
}

interface TherapistProfileContextType {
  therapistProfile: TherapistProfile | null;
  isLoading: boolean;
  error: Error | null;
  updateProfilePicture: (url: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const TherapistProfileContext = createContext<TherapistProfileContextType | undefined>(undefined);

export function TherapistProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [therapistProfile, setTherapistProfile] = useState<TherapistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTherapistProfile = useCallback(async () => {
    if (!user?.id) {
      setTherapistProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const profile = await therapistOperations.getTherapistProfile(user.id);
      setTherapistProfile(profile);
    } catch (err) {
      console.error('Error fetching therapist profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch therapist profile'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch profile when user changes
  useEffect(() => {
    fetchTherapistProfile();
  }, [fetchTherapistProfile]);

  // Update profile picture and refresh profile
  const updateProfilePicture = async (url: string) => {
    if (!user?.id || !therapistProfile) return;

    try {
      setIsLoading(true);
      await therapistOperations.upsertTherapistProfile(user.id, {
        ...therapistProfile,
        profile_picture: url,
      });
      
      // Update local state immediately
      setTherapistProfile({
        ...therapistProfile,
        profile_picture: url,
      });
    } catch (err) {
      console.error('Error updating profile picture:', err);
      setError(err instanceof Error ? err : new Error('Failed to update profile picture'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh the profile
  const refreshProfile = async () => {
    await fetchTherapistProfile();
  };

  const value = {
    therapistProfile,
    isLoading,
    error,
    updateProfilePicture,
    refreshProfile,
  };

  return <TherapistProfileContext.Provider value={value}>{children}</TherapistProfileContext.Provider>;
}

export function useTherapistProfile() {
  const context = useContext(TherapistProfileContext);
  if (context === undefined) {
    throw new Error('useTherapistProfile must be used within a TherapistProfileProvider');
  }
  return context;
}
