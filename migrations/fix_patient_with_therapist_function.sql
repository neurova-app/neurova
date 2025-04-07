-- Fix the search_path issue with the create_patient_with_therapist function
-- This addresses the security warning about mutable search_path

-- Check if the function exists before attempting to modify it
DO $$
DECLARE
  func_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM pg_proc WHERE proname = 'create_patient_with_therapist'
  ) INTO func_exists;
  
  IF func_exists THEN
    -- Function exists, so we'll update it with a fixed search path
    RAISE NOTICE 'Updating create_patient_with_therapist function with explicit search_path';
  ELSE
    RAISE NOTICE 'Function create_patient_with_therapist does not exist, no changes needed';
    RETURN;
  END IF;
END
$$;

-- Update the function with an explicit search path
-- We'll use CREATE OR REPLACE to avoid dependency issues
CREATE OR REPLACE FUNCTION create_patient_with_therapist(
  patient_data JSONB,
  therapist_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public  -- Explicitly set the search path to public schema
AS $func$
DECLARE
  new_patient_id UUID;
  result JSONB;
BEGIN
  -- Generate a new UUID for the patient
  new_patient_id := gen_random_uuid();
  
  -- Merge the patient_data with the new ID
  patient_data := jsonb_set(patient_data, '{id}', to_jsonb(new_patient_id));
  
  -- Insert the patient with the generated ID
  INSERT INTO patients
  SELECT * FROM jsonb_populate_record(null::patients, patient_data);
  
  -- Create the therapist-patient relationship
  INSERT INTO therapist_patients (therapist_id, patient_id)
  VALUES (therapist_id, new_patient_id);
  
  -- Get the created patient data
  SELECT row_to_json(p)::jsonb INTO result
  FROM patients p
  WHERE p.id = new_patient_id;
  
  RETURN result;
END;
$func$;

-- Grant execute permission to authenticated users if the function exists
DO $$
BEGIN
  IF EXISTS(
    SELECT 1 FROM pg_proc WHERE proname = 'create_patient_with_therapist'
  ) THEN
    GRANT EXECUTE ON FUNCTION create_patient_with_therapist(JSONB, UUID) TO authenticated;
    RAISE NOTICE 'Granted execute permission on create_patient_with_therapist to authenticated users';
  END IF;
END
$$;
