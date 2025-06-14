export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  duration: number;
  status: string;
  notes?: string;
  meetLink?: string;
  startDateTime?: number; // Timestamp for sorting
  attendees?: Array<{ email: string; displayName?: string; responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted' }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
