-- Fix student_profiles table schema
-- Run this in Supabase SQL Editor if student registration fails

-- Check if student_profiles exists
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'student_profiles'
);

-- If it doesn't exist or has issues, recreate it:
-- Drop if exists (be careful!)
-- DROP TABLE IF EXISTS student_profiles CASCADE;

-- Create student_profiles table with correct columns
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  university_name VARCHAR(255),
  degree VARCHAR(100),
  branch VARCHAR(100),
  year_of_study VARCHAR(50),
  urn VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);

-- If you get an error about the column already existing, just run this:
-- ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS university_name VARCHAR(255);
-- ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS degree VARCHAR(100);
-- ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS branch VARCHAR(100);
-- ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS year_of_study VARCHAR(50);
-- ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS urn VARCHAR(50);
