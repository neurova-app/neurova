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
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationalId: string;
  bloodType: string;
  maritalStatus: string;
  educationLevel: string;
  phoneNumber: string;
  email: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  address: string;
  city: string;
  state: string;
  country: string;
  occupation: string;
  reasonForConsultation: string;
  diagnoses: Array<{
    description: string;
    date: string;
  }>;
  medicalHistory: {
    chronicIllnesses: string[];
    allergies: string[];
    currentMedications: string[];
    previousTreatments: Array<{
      therapistName: string;
      duration: string;
      treatmentType: string;
    }>;
  };
  familyHistory: string;
  createdAt?: string;
  updatedAt?: string;
}
