export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface MedicalHistory {
  chronicIllnesses: string[];
  allergies: string[];
  currentMedications: string[];
  previousTreatments: {
    therapistName: string;
    duration: string;
    treatmentType: string;
  }[];
}

export interface Patient {
  // Basic Personal Information
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationalId: string;
  bloodType: string; 
  maritalStatus: string;
  educationLevel: string;

  // Contact Information
  phoneNumber: string;
  email: string;
  emergencyContact: EmergencyContact;

  // Address and Demographics
  address?: string;
  city: string;
  state: string;
  country: string;
  occupation: string;

  // Clinical Information
  reasonForConsultation: string;
  diagnoses: {
    description: string;
    date: string;
  }[];
  medicalHistory: MedicalHistory;
  familyHistory: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}
