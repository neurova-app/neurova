-- Fix Auth OTP Long Expiry security issue
-- This script reduces the OTP expiry time to a more secure value (less than 1 hour)

-- Update the auth.email_templates configuration to set a shorter OTP expiry time
UPDATE auth.config
SET email_template_forgot_password_text = REPLACE(
  email_template_forgot_password_text,
  'valid for 24 hours',
  'valid for 30 minutes'
)
WHERE email_template_forgot_password_text LIKE '%valid for 24 hours%';

-- Set the actual OTP expiry time to 30 minutes (1800 seconds)
ALTER SYSTEM SET auth.otp_lifetime = 1800;

-- If you're using Google-only authentication, you might want to disable email OTP entirely
-- Uncomment the following line if you want to disable email authentication:
-- UPDATE auth.config SET enable_signup_email = false, enable_signin_email = false;

-- Note: After running this script, you may need to restart your Supabase instance
-- for the changes to take effect.
