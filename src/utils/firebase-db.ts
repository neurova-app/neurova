import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Patient } from '@/types/patient';

export const patientOperations = {
  getPatients: async (userId: string) => {
    const snap = await getDocs(collection(db, 'users', userId, 'patients'));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Patient) }));
  },
  getPatient: async (userId: string, id: string) => {
    const ref = doc(db, 'users', userId, 'patients', id);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...(snap.data() as Patient) } as Patient) : null;
  },
  createPatient: async (patient: Omit<Patient, 'id'>, userId: string) => {
    const col = collection(db, 'users', userId, 'patients');
    const docRef = await addDoc(col, patient);
    return { id: docRef.id, ...patient } as Patient;
  },
  updatePatient: async (id: string, patient: Partial<Patient>, userId: string) => {
    const ref = doc(db, 'users', userId, 'patients', id);
    await updateDoc(ref, patient);
    const snap = await getDoc(ref);
    return { id: snap.id, ...(snap.data() as Patient) } as Patient;
  },
  deletePatient: async (id: string, userId: string) => {
    const ref = doc(db, 'users', userId, 'patients', id);
    await deleteDoc(ref);
    return true;
  },
};

interface TherapistProfile {
  id?: string;
  user_id: string;
  specialty?: string;
  bio?: string;
  education?: string;
  years_of_experience?: number;
  profile_picture?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  languages_spoken?: string[];
  license_number?: string;
}

export const therapistOperations = {
  getTherapistProfile: async (userId: string) => {
    const ref = doc(db, 'users', userId, 'profile', 'info');
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as TherapistProfile) : null;
  },
  upsertTherapistProfile: async (userId: string, data: Partial<TherapistProfile>) => {
    const ref = doc(db, 'users', userId, 'profile', 'info');
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return snap.data() as TherapistProfile;
  },
};
export const sessionNoteOperations = {
  getSessionNotes: async (userId: string, patientId: string) => {
    const col = collection(db, 'users', userId, 'patients', patientId, 'session_notes');
    const snap = await getDocs(col);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  },
  createSessionNote: async (userId: string, patientId: string, data: any) => {
    const col = collection(db, 'users', userId, 'patients', patientId, 'session_notes');
    const docRef = await addDoc(col, data);
    return { id: docRef.id, ...data };
  },
  updateSessionNote: async (userId: string, patientId: string, id: string, data: any) => {
    const ref = doc(db, 'users', userId, 'patients', patientId, 'session_notes', id);
    await updateDoc(ref, data);
    const snap = await getDoc(ref);
    return { id: snap.id, ...(snap.data() as any) };
  },
  deleteSessionNote: async (userId: string, patientId: string, id: string) => {
    const ref = doc(db, 'users', userId, 'patients', patientId, 'session_notes', id);
    await deleteDoc(ref);
    return true;
  },
};
