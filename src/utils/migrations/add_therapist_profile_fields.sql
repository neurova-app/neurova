-- Migration to add additional fields to the therapists table

-- First, check if the columns already exist to avoid errors
DO $$
BEGIN
    -- Add profile_picture column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'profile_picture') THEN
        ALTER TABLE therapists ADD COLUMN profile_picture TEXT;
    END IF;

    -- Add phone_number column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'phone_number') THEN
        ALTER TABLE therapists ADD COLUMN phone_number TEXT;
    END IF;

    -- Add address column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'address') THEN
        ALTER TABLE therapists ADD COLUMN address TEXT;
    END IF;

    -- Add city column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'city') THEN
        ALTER TABLE therapists ADD COLUMN city TEXT;
    END IF;

    -- Add state column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'state') THEN
        ALTER TABLE therapists ADD COLUMN state TEXT;
    END IF;

    -- Add zip_code column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'zip_code') THEN
        ALTER TABLE therapists ADD COLUMN zip_code TEXT;
    END IF;

    -- Add years_of_experience column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'years_of_experience') THEN
        ALTER TABLE therapists ADD COLUMN years_of_experience INTEGER;
    END IF;

    -- Add country column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'country') THEN
        ALTER TABLE therapists ADD COLUMN country TEXT;
    END IF;

    -- Add languages_spoken column if it doesn't exist (as a JSON array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'languages_spoken') THEN
        ALTER TABLE therapists ADD COLUMN languages_spoken JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- Add insurance_providers column if it doesn't exist (as a JSON array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'insurance_providers') THEN
        ALTER TABLE therapists ADD COLUMN insurance_providers JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- Add certifications column if it doesn't exist (as a JSON array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'certifications') THEN
        ALTER TABLE therapists ADD COLUMN certifications JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- Add licenses column if it doesn't exist (as a JSON array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'licenses') THEN
        ALTER TABLE therapists ADD COLUMN licenses JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- Add license_number column if it doesn't exist (for backward compatibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'license_number') THEN
        ALTER TABLE therapists ADD COLUMN license_number TEXT;
    END IF;

    -- Add postal_code column if it doesn't exist (for backward compatibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'therapists' AND column_name = 'postal_code') THEN
        ALTER TABLE therapists ADD COLUMN postal_code TEXT;
    END IF;

END$$;

-- Update RLS policies to allow therapists to update their own profiles
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS therapists_select_policy ON therapists;
DROP POLICY IF EXISTS therapists_insert_policy ON therapists;
DROP POLICY IF EXISTS therapists_update_policy ON therapists;
DROP POLICY IF EXISTS therapists_delete_policy ON therapists;

-- Create policies
CREATE POLICY therapists_select_policy ON therapists 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY therapists_insert_policy ON therapists 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY therapists_update_policy ON therapists 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY therapists_delete_policy ON therapists 
    FOR DELETE USING (auth.uid() = user_id);
