-- Add missing columns to categories table
-- Run this in Supabase SQL Editor

-- Add description column if it doesn't exist
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add status column if it doesn't exist
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Add updated_at column if it doesn't exist
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

