-- Update curriculum table to support government curriculum with all fields
-- Run this in Supabase SQL Editor

-- Add missing columns to curriculum table
ALTER TABLE curriculum 
ADD COLUMN IF NOT EXISTS state VARCHAR(100);

ALTER TABLE curriculum 
ADD COLUMN IF NOT EXISTS state_name VARCHAR(100);

ALTER TABLE curriculum 
ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English';

ALTER TABLE curriculum 
ADD COLUMN IF NOT EXISTS banner_url TEXT;

ALTER TABLE curriculum 
ADD COLUMN IF NOT EXISTS published_date DATE;

ALTER TABLE curriculum 
ADD COLUMN IF NOT EXISTS scheme_name VARCHAR(255);

ALTER TABLE curriculum 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Create index for state filtering
CREATE INDEX IF NOT EXISTS idx_curriculum_state ON curriculum(state);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_curriculum_status ON curriculum(status);

