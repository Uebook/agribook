-- Add additional user profile columns
-- Run this in Supabase SQL Editor

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS state VARCHAR(100);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS website TEXT;

-- That's it! All profile fields will now be saved.

