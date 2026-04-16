-- Migration: Add unique constraint on username in profiles table
-- This creates a unique index on non-empty usernames

CREATE UNIQUE INDEX idx_profiles_username_non_empty 
ON profiles (username) 
WHERE username <> '' AND username IS NOT NULL;