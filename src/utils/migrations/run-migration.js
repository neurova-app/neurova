// Script to run SQL migrations against Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

// Create Supabase client with service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get the migration file path from command line arguments
const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Error: No migration file specified.');
  console.error('Usage: node run-migration.js <migration-file.sql>');
  process.exit(1);
}

const migrationPath = path.resolve(__dirname, migrationFile);

// Check if the file exists
if (!fs.existsSync(migrationPath)) {
  console.error(`Error: Migration file not found: ${migrationPath}`);
  process.exit(1);
}

// Read the migration SQL
const sql = fs.readFileSync(migrationPath, 'utf8');

// Execute the migration
async function runMigration() {
  console.log(`Running migration: ${migrationFile}`);
  
  try {
    const { error } = await supabase.rpc('pgapply', { query: sql });
    
    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
    
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Error executing migration:', err);
    process.exit(1);
  }
}

runMigration();
