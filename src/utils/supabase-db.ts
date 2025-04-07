import { supabase } from "./supabase";
import { Patient } from "@/types/patient";

// Define database table names
const TABLES = {
  PATIENTS: "patients",
  THERAPISTS: "therapists",
  THERAPIST_PATIENTS: "therapist_patients", // Relationship table
};

// Define therapist profile interface
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

// Helper function to convert camelCase to snake_case
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Helper function to convert snake_case to camelCase
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Helper function to convert Patient object to database format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function patientToDbFormat(patient: Partial<Patient>): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbPatient: Record<string, any> = {};

  for (const [key, value] of Object.entries(patient)) {
    // Handle special nested objects
    if (key === "emergencyContact") {
      dbPatient["emergency_contact"] = value;
    } else if (key === "medicalHistory") {
      dbPatient["medical_history"] = value;
    } else if (key === "createdAt") {
      dbPatient["created_at"] = value;
    } else if (key === "updatedAt") {
      dbPatient["updated_at"] = value;
    } else {
      // Convert other camelCase keys to snake_case
      dbPatient[camelToSnake(key)] = value;
    }
  }

  return dbPatient;
}

// Helper function to convert database record to Patient object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToPatientFormat(dbRecord: Record<string, any>): Patient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patient: Record<string, any> = {};

  for (const [key, value] of Object.entries(dbRecord)) {
    // Handle special nested objects
    if (key === "emergency_contact") {
      patient["emergencyContact"] = value;
    } else if (key === "medical_history") {
      patient["medicalHistory"] = value;
    } else if (key === "created_at") {
      patient["createdAt"] = value;
    } else if (key === "updated_at") {
      patient["updatedAt"] = value;
    } else {
      // Convert other snake_case keys to camelCase
      patient[snakeToCamel(key)] = value;
    }
  }

  return patient as Patient;
}

// Patient operations
export const patientOperations = {
  // Get all patients for the current therapist
  getPatients: async (userId: string) => {
    try {
      // First, get the therapist profile ID
      const { data: therapistData, error: therapistError } = await supabase
        .from(TABLES.THERAPISTS)
        .select("id")
        .eq("user_id", userId)
        .single();

      if (therapistError) {
        console.error("Error fetching therapist profile:", therapistError);
        throw therapistError;
      }

      if (!therapistData || !therapistData.id) {
        console.warn("Therapist profile not found for user:", userId);
        return [];
      }

      const therapistId = therapistData.id;

      // Now get the patients for this therapist
      const { data, error } = await supabase
        .from(TABLES.THERAPIST_PATIENTS)
        .select(
          `
          patient_id,
          patients (*)
        `
        )
        .eq("therapist_id", therapistId);

      if (error) throw error;

      // Extract the patient data from the nested structure and convert to proper format
      const patients =
        data
          ?.map((item) => {
            if (item.patients) {
              return dbToPatientFormat(item.patients);
            }
            return null;
          })
          .filter(Boolean) || [];

      return patients;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  },

  // Get a single patient by ID
  getPatientById: async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PATIENTS)
        .select("*")
        .eq("id", patientId)
        .single();

      if (error) throw error;
      return dbToPatientFormat(data);
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw error;
    }
  },

  // Create a new patient and associate with therapist
  createPatient: async (patient: Omit<Patient, "id">, userId: string) => {
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Authentication error:", sessionError);
        throw new Error("User not authenticated");
      }
      
      if (!session) {
        console.error("No active session found");
        throw new Error("User not authenticated");
      }
      
      console.log("Authenticated as:", session.user.id);
      console.log("Creating patient for therapist with userId:", userId);
      
      // First, get the therapist profile ID
      const { data: therapistData, error: therapistError } = await supabase
        .from(TABLES.THERAPISTS)
        .select("id")
        .eq("user_id", userId)
        .single();

      if (therapistError) {
        console.error("Error fetching therapist profile:", therapistError);
        throw therapistError;
      }

      if (!therapistData || !therapistData.id) {
        throw new Error("Therapist profile not found");
      }

      const therapistId = therapistData.id;

      // Convert patient to database format
      const dbPatient = patientToDbFormat(patient);

      // Add timestamps
      dbPatient.created_at = new Date().toISOString();
      dbPatient.updated_at = new Date().toISOString();

      console.log("Attempting to create patient using direct database access");
      
      // Try the direct database access approach (similar to how profile picture uploads were fixed)
      // This uses a direct SQL query to bypass RLS policies
      const { data: directPatientData, error: directPatientError } = await supabase.rpc(
        'create_patient_direct',
        { 
          patient_data: dbPatient,
          therapist_id: therapistId 
        }
      );

      // If the stored procedure doesn't exist yet, fall back to the regular approach
      if (directPatientError && directPatientError.message.includes('function "create_patient_direct" does not exist')) {
        console.log("Direct database access function not available, falling back to regular insert");
        
        // Regular approach with RLS policies
        const { data: patientData, error: patientError } = await supabase
          .from(TABLES.PATIENTS)
          .insert([dbPatient])
          .select();

        if (patientError) {
          console.error("Error creating patient:", patientError);
          console.error("Error code:", patientError.code);
          console.error("Error message:", patientError.message);
          
          // Check if it's an RLS violation
          if (patientError.code === '42501') {
            console.error("This is an RLS policy violation. The application needs to create a stored procedure");
            console.error("Please run the SQL script in migrations/create_patient_function.sql");
            
            throw new Error("RLS policy violation. Database setup required - see console for details.");
          }
          
          throw patientError;
        }

        if (!patientData || patientData.length === 0) {
          throw new Error("Failed to create patient");
        }

        const patientId = patientData[0].id;

        // Create the therapist-patient relationship
        const { error: relationError } = await supabase
          .from(TABLES.THERAPIST_PATIENTS)
          .insert([
            {
              therapist_id: therapistId,
              patient_id: patientId,
            },
          ]);

        if (relationError) {
          // If creating the relationship fails, delete the patient to avoid orphaned records
          await supabase.from(TABLES.PATIENTS).delete().eq("id", patientId);
          
          console.error(
            "Error creating therapist-patient relationship:",
            relationError
          );
          throw relationError;
        }

        return dbToPatientFormat(patientData[0]);
      } else if (directPatientError) {
        // Some other error with the direct approach
        console.error("Error with direct patient creation:", directPatientError);
        throw directPatientError;
      }

      // If we got here, the direct approach worked
      return directPatientData as Patient;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  },

  // Update an existing patient
  updatePatient: async (patientId: string, patientData: Partial<Patient>) => {
    try {
      // Convert patient to database format
      const dbPatient = patientToDbFormat(patientData);

      // Add updated timestamp
      dbPatient.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from(TABLES.PATIENTS)
        .update(dbPatient)
        .eq("id", patientId)
        .select();

      if (error) throw error;
      return dbToPatientFormat(data?.[0]);
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  },

  // Delete a patient
  deletePatient: async (patientId: string) => {
    try {
      // First, delete the relationship
      const { error: relationError } = await supabase
        .from(TABLES.THERAPIST_PATIENTS)
        .delete()
        .eq("patient_id", patientId);

      if (relationError) throw relationError;

      // Then, delete the patient
      const { error } = await supabase
        .from(TABLES.PATIENTS)
        .delete()
        .eq("id", patientId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  },
};

// Therapist operations
export const therapistOperations = {
  // Get therapist profile
  getTherapistProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.THERAPISTS)
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data as TherapistProfile;
    } catch (error) {
      console.error("Error fetching therapist profile:", error);
      throw error;
    }
  },

  // Create or update therapist profile
  upsertTherapistProfile: async (
    userId: string,
    profileData: Partial<TherapistProfile>
  ) => {
    try {
      // Check if a profile exists for the user
      const { data: existingProfile, error: existingError } = await supabase
        .from(TABLES.THERAPISTS)
        .select("id")
        .eq("user_id", userId)
        .single();

      if (existingError) {
        console.error(
          "Error checking for existing therapist profile:",
          existingError
        );
        throw existingError;
      }

      if (existingProfile && existingProfile.id) {
        // Update the existing profile
        const { data, error } = await supabase
          .from(TABLES.THERAPISTS)
          .update({
            ...profileData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingProfile.id)
          .select();

        if (error) throw error;
        return data?.[0] as TherapistProfile;
      } else {
        // Create a new profile
        const { data, error } = await supabase
          .from(TABLES.THERAPISTS)
          .insert({
            user_id: userId,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();

        if (error) throw error;
        return data?.[0] as TherapistProfile;
      }
    } catch (error) {
      console.error("Error updating therapist profile:", error);
      throw error;
    }
  },
};
