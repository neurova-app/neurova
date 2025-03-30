-- Add profile_picture column to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Update existing records to have NULL profile_picture (optional)
UPDATE patients SET profile_picture = NULL WHERE profile_picture IS NULL;

-- Add comment to the column for documentation
COMMENT ON COLUMN patients.profile_picture IS 'URL to the patient''s profile picture stored in Supabase storage';
