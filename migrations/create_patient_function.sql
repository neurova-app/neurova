-- Create a PostgreSQL function to directly create a patient and its relationship
-- This bypasses RLS policies by using security definer

CREATE OR REPLACE FUNCTION create_patient_direct(
  patient_data JSONB,
  therapist_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the creator
SET search_path = public
AS $$
DECLARE
  new_patient_id UUID;
  result JSONB;
BEGIN
  -- Insert the patient
  INSERT INTO patients
  SELECT * FROM jsonb_populate_record(null::patients, patient_data)
  RETURNING id INTO new_patient_id;
  
  -- Create the therapist-patient relationship
  INSERT INTO therapist_patients (therapist_id, patient_id)
  VALUES (therapist_id, new_patient_id);
  
  -- Get the created patient data
  SELECT row_to_json(p)::jsonb INTO result
  FROM patients p
  WHERE p.id = new_patient_id;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_patient_direct(JSONB, UUID) TO authenticated;

-- Test the function by checking if it exists
SELECT EXISTS(
  SELECT 1 
  FROM pg_proc 
  WHERE proname = 'create_patient_direct'
) AS function_exists;
