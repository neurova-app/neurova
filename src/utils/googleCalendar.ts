import { supabase } from './supabase';
import { Appointment } from '@/types';

// Types for calendar events
export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
  }[];
  reminders?: {
    useDefault: boolean;
    overrides?: {
      method: 'email' | 'popup';
      minutes: number;
    }[];
  };
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      }
    },
    entryPoints?: Array<{
      entryPointType: string;
      uri: string;
      label?: string;
    }>
  };
}

// Type for patient information
export interface PatientInfo {
  full_name: string;
  email?: string;
}

/**
 * Creates a dedicated Neurova calendar in the user's Google Calendar
 * @returns The ID of the created calendar
 */
export async function createNeurovaCalendar(): Promise<string | null> {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session found');
    }

    // Get the access token from the session
    const accessToken = session.provider_token;
    if (!accessToken) {
      throw new Error('No access token found');
    }

    // Create a new calendar via Google Calendar API
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: 'Neurova Appointments',
        description: 'Calendar for Neurova therapy appointments',
        timeZone: 'America/New_York',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create calendar: ${response.statusText}`);
    }

    const calendar = await response.json();
    
    // Store the calendar ID in user metadata
    await supabase.auth.updateUser({
      data: {
        neurova_calendar_id: calendar.id,
      },
    });

    return calendar.id;
  } catch (error) {
    console.error('Error creating Neurova calendar:', error);
    return null;
  }
}

/**
 * Gets the Neurova calendar ID from user metadata or creates a new one
 */
export async function getNeurovaCalendarId(): Promise<string | null> {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No user found');
    }

    // Check if calendar ID exists in metadata
    const calendarId = user.user_metadata?.neurova_calendar_id;
    if (calendarId) {
      return calendarId;
    }

    // If not, create a new calendar
    return await createNeurovaCalendar();
  } catch (error) {
    console.error('Error getting Neurova calendar ID:', error);
    return null;
  }
}

/**
 * Creates a new event in the Neurova calendar
 * @param event The event details
 * @returns The created event or null if there was an error
 */
export async function createCalendarEvent(event: CalendarEvent): Promise<CalendarEvent | null> {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session found');
    }

    // Get the access token from the session
    const accessToken = session.provider_token;
    if (!accessToken) {
      throw new Error('No access token found');
    }

    // Get the Neurova calendar ID
    const calendarId = await getNeurovaCalendarId();
    if (!calendarId) {
      throw new Error('No Neurova calendar found');
    }

    // Create the event via Google Calendar API
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return null;
  }
}

/**
 * Gets events from the Neurova calendar
 * @param timeMin The start time for the query
 * @param timeMax The end time for the query
 * @returns Array of calendar events or null if there was an error
 */
export async function getCalendarEvents(
  timeMin: string = new Date().toISOString(),
  timeMax: string = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
): Promise<CalendarEvent[] | null> {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session found');
    }

    // Get the access token from the session
    const accessToken = session.provider_token;
    if (!accessToken) {
      throw new Error('No access token found');
    }

    // Get the Neurova calendar ID
    const calendarId = await getNeurovaCalendarId();
    if (!calendarId) {
      throw new Error('No Neurova calendar found');
    }

    // Get events via Google Calendar API
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get events: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error getting calendar events:', error);
    return null;
  }
}

/**
 * Converts a patient appointment to a calendar event
 * @param appointment The appointment to convert
 * @param patient The patient associated with the appointment
 * @returns A calendar event object
 */
export function appointmentToCalendarEvent(
  appointment: Partial<Appointment>,
  patient: PatientInfo
): CalendarEvent {
  const startTime = new Date(appointment.date || new Date().toISOString());
  if (appointment.startTime) {
    const [hours, minutes] = appointment.startTime.split(':').map(Number);
    startTime.setHours(hours, minutes, 0, 0);
  }
  
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour appointment
  
  // Generate a unique ID for the conference request
  const requestId = `neurova-meeting-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  return {
    summary: `Appointment with ${patient.full_name}`,
    description: appointment.notes || 'Therapy session',
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'America/New_York',
    },
    attendees: [
      {
        email: patient.email || 'patient@example.com',
        displayName: patient.full_name,
      },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 30 }, // 30 minutes before
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: requestId,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    }
  };
}
