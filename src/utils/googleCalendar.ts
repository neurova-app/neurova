import { supabase } from "./supabase";
import { Appointment } from "@/types";
import { Session } from "@supabase/supabase-js";

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
      method: "email" | "popup";
      minutes: number;
    }[];
  };
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
    entryPoints?: Array<{
      entryPointType: string;
      uri: string;
      label?: string;
    }>;
  };
}

// Type for patient information
export interface PatientInfo {
  full_name: string;
  email?: string;
}

// Extended Session type to include provider token expiry date
interface ExtendedSession extends Session {
  provider_token_expiry_date?: string;
}

/**
 * Checks if a token is expired or about to expire
 * @param expiresAt Timestamp when the token expires
 * @returns True if the token is expired or will expire in the next 5 minutes
 */
function isTokenExpired(expiresAt: number): boolean {
  // Consider token expired if it will expire in the next 5 minutes
  const expirationBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
  return Date.now() + expirationBuffer >= expiresAt;
}

/**
 * Gets a valid access token, refreshing if necessary
 * @returns A valid access token or null if not available
 */
async function getValidAccessToken(): Promise<string | null> {
  try {
    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.error("No active session found");
      return null;
    }

    // Cast to extended session type
    const extendedSession = session as ExtendedSession;

    // Check if we have a provider token (Google access token)
    if (!extendedSession.provider_token) {
      console.error("No provider token found");
      return null;
    }

    // Check if the token is expired
    if (
      extendedSession.provider_token_expiry_date &&
      isTokenExpired(
        new Date(extendedSession.provider_token_expiry_date).getTime()
      )
    ) {
      console.log("Token expired, refreshing...");

      // Refresh the session
      const {
        data: { session: refreshedSession },
        error,
      } = await supabase.auth.refreshSession();

      if (error || !refreshedSession?.provider_token) {
        console.error("Failed to refresh token:", error);
        return null;
      }

      return refreshedSession.provider_token;
    }

    // Return the existing valid token
    return extendedSession.provider_token;
  } catch (error) {
    console.error("Error getting valid access token:", error);
    return null;
  }
}

/**
 * Creates a dedicated Neurova calendar in the user's Google Calendar
 * @returns The ID of the created calendar
 */
export async function createNeurovaCalendar(): Promise<string | null> {
  try {
    // Get a valid access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    // Create a new calendar via Google Calendar API
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: "Neurova Appointments",
          description: "Calendar for Neurova therapy appointments",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create calendar: ${response.statusText}`);
    }

    const data = await response.json();

    // Store the calendar ID in user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        neurova_calendar_id: data.id,
        calendar_connected: true,
      },
    });

    if (updateError) {
      console.error("Error updating user metadata:", updateError);
    }

    return data.id;
  } catch (error) {
    console.error("Error creating Neurova calendar:", error);
    return null;
  }
}

/**
 * Gets the Neurova calendar ID from user metadata or creates a new one
 */
export async function getNeurovaCalendarId(): Promise<string | null> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Check if the calendar ID is already stored in user metadata
    const calendarId = user.user_metadata?.neurova_calendar_id;
    if (calendarId) {
      return calendarId;
    }

    // If not, create a new calendar
    return await createNeurovaCalendar();
  } catch (error) {
    console.error("Error getting Neurova calendar ID:", error);
    return null;
  }
}

/**
 * Creates a new event in the Neurova calendar
 * @param event The event details
 * @returns The created event or null if there was an error
 */
export async function createCalendarEvent(
  event: CalendarEvent
): Promise<CalendarEvent | null> {
  try {
    // Get a valid access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    // Get the Neurova calendar ID
    const calendarId = await getNeurovaCalendarId();
    if (!calendarId) {
      throw new Error("No Neurova calendar found");
    }

    // Create the event via Google Calendar API
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating calendar event:", error);
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
  timeMax: string = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toISOString()
): Promise<CalendarEvent[] | null> {
  try {
    // Get a valid access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    // Get the Neurova calendar ID
    const calendarId = await getNeurovaCalendarId();
    if (!calendarId) {
      throw new Error("No Neurova calendar found");
    }

    // Get events via Google Calendar API
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${encodeURIComponent(
        timeMin
      )}&timeMax=${encodeURIComponent(timeMax)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get events: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error getting calendar events:", error);
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
  // Parse the date string in YYYY-MM-DD format
  // This ensures we're interpreting the date correctly regardless of locale
  const dateStr = appointment.date || "";

  // Explicitly parse the date in YYYY-MM-DD format to avoid timezone/locale issues
  // dateStr format is YYYY-MM-DD (e.g., 2025-03-04 for March 4, 2025)
  const [year, month, day] = dateStr.split("-").map(Number);

  // Create a date object in local timezone - month is 0-indexed in JavaScript
  const startTime = new Date(year, month - 1, day);

  // Set the start time if provided
  if (appointment.startTime) {
    const [hours, minutes] = appointment.startTime.split(":").map(Number);
    startTime.setHours(hours, minutes, 0, 0);
  }

  // Create end time based on the provided end time or default to 1 hour after start
  let endTime: Date;

  if (appointment.endTime) {
    // If end time is provided, use it
    endTime = new Date(year, month - 1, day);
    const [hours, minutes] = appointment.endTime.split(":").map(Number);
    endTime.setHours(hours, minutes, 0, 0);

    // If end time is earlier than start time, assume it's for the next day
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
  } else {
    // Default to 1 hour after start time
    endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
  }

  // Get the user's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Generate a unique ID for the conference request
  const requestId = `neurova-meeting-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 7)}`;

  return {
    summary: `${appointment.type || "Appointment"} with ${patient.full_name}`,
    description: `Type: ${appointment.type || "Therapy Session"}\n\n${
      appointment.notes || ""
    }`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: userTimeZone,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: userTimeZone,
    },
    attendees: [
      {
        email: patient.email || "patient@example.com",
        displayName: patient.full_name,
      },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 }, // 1 day before
        { method: "popup", minutes: 30 }, // 30 minutes before
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: requestId,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };
}

/**
 * Deletes an event from the Neurova calendar
 * @param eventId The ID of the event to delete
 * @returns True if the event was deleted successfully, false otherwise
 */
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  try {
    // Get a valid access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    // Get the Neurova calendar ID
    const calendarId = await getNeurovaCalendarId();
    if (!calendarId) {
      throw new Error("No Neurova calendar found");
    }

    // Delete the event via Google Calendar API
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    return false;
  }
}

/**
 * Updates an existing event in the Google Calendar
 * @param eventId The ID of the event to update
 * @param event The updated event data
 * @returns True if successful, false otherwise
 */
export async function updateCalendarEvent(
  eventId: string,
  event: CalendarEvent
): Promise<boolean> {
  try {
    // Get a valid access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    // Get the Neurova calendar ID
    const calendarId = await getNeurovaCalendarId();
    if (!calendarId) {
      throw new Error("No Neurova calendar found");
    }

    // Update the event via Google Calendar API
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating calendar event:", error);
    return false;
  }
}
