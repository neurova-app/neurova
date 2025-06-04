-- Direct approach to fix the create_patient_with_therapist function
-- This script addresses the security warning about mutable search path

-- First, let's recreate the function with an explicit search path
CREATE OR REPLACE FUNCTION create_patient_with_therapist(
  patient_data JSONB,
  therapist_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from SECURITY DEFINER to INVOKER as suggested
SET search_path = ''  -- Set to empty string as suggested for maximum security
AS $$
DECLARE
  new_patient_id UUID;
  result JSONB;
BEGIN
  -- Generate a new UUID for the patient
  new_patient_id := gen_random_uuid();
  
  -- Merge the patient_data with the new ID
  patient_data := jsonb_set(patient_data, '{id}', to_jsonb(new_patient_id));
  
  -- Use fully qualified names since search_path is empty
  INSERT INTO public.patients
  SELECT * FROM jsonb_populate_record(null::public.patients, patient_data);
  
  -- Create the therapist-patient relationship
  INSERT INTO public.therapist_patients (therapist_id, patient_id)
  VALUES (therapist_id, new_patient_id);
  
  -- Get the created patient data
  SELECT row_to_json(p)::jsonb INTO result
  FROM public.patients p
  WHERE p.id = new_patient_id;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_patient_with_therapist(JSONB, UUID) TO authenticated;

-- Also fix create_patient_direct function if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_patient_direct') THEN
    -- Drop and recreate with proper settings
    DROP FUNCTION IF EXISTS create_patient_direct(JSONB, UUID);
    
    CREATE OR REPLACE FUNCTION create_patient_direct(
      patient_data JSONB,
      therapist_id UUID
    )
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY INVOKER
    SET search_path = ''
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
      INSERT INTO public.patients
      SELECT * FROM jsonb_populate_record(null::public.patients, patient_data);
      
      -- Create the therapist-patient relationship
      INSERT INTO public.therapist_patients (therapist_id, patient_id)
      VALUES (therapist_id, new_patient_id);
      
      -- Get the created patient data
      SELECT row_to_json(p)::jsonb INTO result
      FROM public.patients p
      WHERE p.id = new_patient_id;
      
      RETURN result;
    END;
    $func$;
    
    -- Grant execute permission
    GRANT EXECUTE ON FUNCTION create_patient_direct(JSONB, UUID) TO authenticated;
  END IF;
END
$$;
