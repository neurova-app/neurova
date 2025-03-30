#!/bin/bash

# Check if filename is provided
if [ -z "$1" ]; then
  echo "Error: No SQL file provided"
  echo "Usage: ./run-migration.sh <sql-file>"
  exit 1
fi

# Get the SQL file path
SQL_FILE=$1

# Check if file exists
if [ ! -f "$SQL_FILE" ]; then
  echo "Error: SQL file not found: $SQL_FILE"
  exit 1
fi

# Run the SQL file using the Supabase CLI
echo "Running migration: $SQL_FILE"
cat "$SQL_FILE" | supabase db execute

# Check if the command was successful
if [ $? -eq 0 ]; then
  echo "Migration completed successfully!"
else
  echo "Migration failed."
  exit 1
fi
