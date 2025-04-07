-- This script creates very permissive RLS policies for debugging purposes
-- WARNING: These policies are not secure for production use

-- Enable Row Level Security on tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS therapist_manage_own_profile ON therapists;
DROP POLICY IF EXISTS therapist_view_own_patients ON therapist_patients;
DROP POLICY IF EXISTS therapist_create_patient_relationship ON therapist_patients;
DROP POLICY IF EXISTS therapist_delete_patient_relationship ON therapist_patients;
DROP POLICY IF EXISTS therapist_view_patients ON patients;
DROP POLICY IF EXISTS therapist_create_patients ON patients;
DROP POLICY IF EXISTS therapist_update_patients ON patients;
DROP POLICY IF EXISTS therapist_delete_patients ON patients;
DROP POLICY IF EXISTS service_role_manage_patients ON patients;
DROP POLICY IF EXISTS service_role_manage_therapist_patients ON therapist_patients;
DROP POLICY IF EXISTS debug_allow_all_patients ON patients;
DROP POLICY IF EXISTS debug_allow_all_therapist_patients ON therapist_patients;
DROP POLICY IF EXISTS debug_allow_all_therapists ON therapists;

-- Create maximally permissive policies for debugging
CREATE POLICY debug_allow_all_patients ON patients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY debug_allow_all_therapist_patients ON therapist_patients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY debug_allow_all_therapists ON therapists
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verify policies were created
SELECT tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename IN ('patients', 'therapist_patients', 'therapists')
ORDER BY tablename, policyname;
