-- Fix the search_path issue with the create_therapist_profile_on_signup function
-- This addresses the security warning about mutable search_path

-- First, drop the existing trigger that depends on the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Now we can safely modify the function
CREATE OR REPLACE FUNCTION create_therapist_profile_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public  -- Explicitly set the search path to public schema
AS $func$
BEGIN
  -- Create a therapist profile for the new user
  INSERT INTO therapists (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  
  RETURN NEW;
END;
$func$;

-- Recreate the trigger with the original name
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_therapist_profile_on_signup();
