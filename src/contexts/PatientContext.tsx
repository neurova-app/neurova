'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Patient } from '@/types/patient';
import { patientOperations } from '@/utils/supabase-db';
import { useAuth } from './AuthContext';

interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<Patient>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<Patient>;
  deletePatient: (id: string) => Promise<boolean>;
  getPatient: (id: string) => Promise<Patient>;
  refreshPatients: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Helper function to validate if an object is a Patient
function isPatient(obj: unknown): obj is Patient {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'fullName' in obj &&
    'dateOfBirth' in obj &&
    'gender' in obj &&
    'nationalId' in obj
  );
}

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const rawData = await patientOperations.getPatients(user.id);
      
      // Process the data to ensure it's an array of Patient objects
      const processedData: Patient[] = [];
      
      if (Array.isArray(rawData)) {
        for (const item of rawData) {
          // For each item, check if it's a valid Patient object
          if (isPatient(item)) {
            processedData.push(item);
          } else {
            console.warn('Received invalid patient data:', item);
          }
        }
      }
      
      setPatients(processedData);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchPatients();
    }
  }, [user?.id, fetchPatients]);

  const addPatient = async (patientData: Omit<Patient, 'id'>) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      const newPatient = await patientOperations.createPatient(patientData, user.id);
      
      // Refresh the patient list to ensure we have the latest data
      await fetchPatients();
      
      return newPatient;
    } catch (err) {
      console.error('Error adding patient:', err);
      setError('Failed to add patient. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPatient = await patientOperations.updatePatient(id, patientData);
      setPatients(prev => 
        prev.map(p => p.id === id ? updatedPatient : p)
      );
      return updatedPatient;
    } catch (err) {
      console.error('Error updating patient:', err);
      setError('Failed to update patient. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await patientOperations.deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError('Failed to delete patient. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPatient = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const patient = await patientOperations.getPatientById(id);
      return patient;
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError('Failed to load patient details. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshPatients = async () => {
    await fetchPatients();
  };

  const value = {
    patients,
    loading,
    error,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    refreshPatients,
  };

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}
