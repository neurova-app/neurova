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

-- Policy for therapists to manage their own profile
CREATE POLICY therapist_manage_own_profile ON therapists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for therapists to view their patients through the junction table
CREATE POLICY therapist_view_own_patients ON therapist_patients
  FOR SELECT
  TO authenticated
  USING (therapist_id IN (
    SELECT id FROM therapists WHERE user_id = auth.uid()
  ));

-- Policy for therapists to create relationships with patients
CREATE POLICY therapist_create_patient_relationship ON therapist_patients
  FOR INSERT
  TO authenticated
  WITH CHECK (therapist_id IN (
    SELECT id FROM therapists WHERE user_id = auth.uid()
  ));

-- Policy for therapists to delete relationships with patients
CREATE POLICY therapist_delete_patient_relationship ON therapist_patients
  FOR DELETE
  TO authenticated
  USING (therapist_id IN (
    SELECT id FROM therapists WHERE user_id = auth.uid()
  ));

-- Policy for therapists to view patients
-- This allows therapists to view patients that are linked to them
CREATE POLICY therapist_view_patients ON patients
  FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT patient_id FROM therapist_patients
    WHERE therapist_id IN (
      SELECT id FROM therapists WHERE user_id = auth.uid()
    )
  ));

-- Policy for therapists to create patients
-- This allows any authenticated user to create patients
CREATE POLICY therapist_create_patients ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for therapists to update their patients
CREATE POLICY therapist_update_patients ON patients
  FOR UPDATE
  TO authenticated
  USING (id IN (
    SELECT patient_id FROM therapist_patients
    WHERE therapist_id IN (
      SELECT id FROM therapists WHERE user_id = auth.uid()
    )
  ));

-- Policy for therapists to delete their patients
CREATE POLICY therapist_delete_patients ON patients
  FOR DELETE
  TO authenticated
  USING (id IN (
    SELECT patient_id FROM therapist_patients
    WHERE therapist_id IN (
      SELECT id FROM therapists WHERE user_id = auth.uid()
    )
  ));

-- Verify policies were created
SELECT tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename IN ('patients', 'therapist_patients', 'therapists')
ORDER BY tablename, policyname;
