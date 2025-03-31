'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from './AuthContext';
import { OutputData } from '@editorjs/editorjs';

// Define the SessionNote interface
export interface SessionNote {
  id: string;
  patient_id: string;
  patient_name: string;
  title: string;
  type: string;
  date: string;
  content: OutputData;
  created_at?: string;
  updated_at?: string;
  // For backward compatibility with existing code
  patientName?: string;
}

interface SessionNoteContextType {
  sessionNotes: SessionNote[];
  loading: boolean;
  error: string | null;
  getSessionNotesByPatientId: (patientId: string) => Promise<void>;
  createSessionNote: (sessionNote: Omit<SessionNote, 'id' | 'created_at' | 'updated_at'>) => Promise<SessionNote | null>;
  updateSessionNote: (sessionNote: Pick<SessionNote, 'id'> & Partial<SessionNote>) => Promise<SessionNote | null>;
  deleteSessionNote: (sessionNoteId: string) => Promise<boolean>;
}

const SessionNoteContext = createContext<SessionNoteContextType | undefined>(undefined);

export function SessionNoteProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSessionNotesByPatientId = useCallback(async (patientId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('session_notes')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      setSessionNotes(data || []);
    } catch (err) {
      console.error('Error fetching session notes:', err);
      setError('Failed to load session notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createSessionNote = async (sessionNote: Omit<SessionNote, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('session_notes')
        .insert(sessionNote)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new session note to the state
      setSessionNotes(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      console.error('Error creating session note:', err);
      setError('Failed to create session note. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSessionNote = async (sessionNote: Pick<SessionNote, 'id'> & Partial<SessionNote>) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('session_notes')
        .update(sessionNote)
        .eq('id', sessionNote.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the session note in the state
      setSessionNotes(prev => 
        prev.map(note => note.id === data.id ? data : note)
      );
      
      return data;
    } catch (err) {
      console.error('Error updating session note:', err);
      setError('Failed to update session note. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSessionNote = async (sessionNoteId: string) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('session_notes')
        .delete()
        .eq('id', sessionNoteId);
      
      if (error) throw error;
      
      // Remove the session note from the state
      setSessionNotes(prev => prev.filter(note => note.id !== sessionNoteId));
      
      return true;
    } catch (err) {
      console.error('Error deleting session note:', err);
      setError('Failed to delete session note. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    sessionNotes,
    loading,
    error,
    getSessionNotesByPatientId,
    createSessionNote,
    updateSessionNote,
    deleteSessionNote,
  };

  return <SessionNoteContext.Provider value={value}>{children}</SessionNoteContext.Provider>;
}

export function useSessionNotes() {
  const context = useContext(SessionNoteContext);
  if (context === undefined) {
    throw new Error('useSessionNotes must be used within a SessionNoteProvider');
  }
  return context;
}
