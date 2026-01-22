-- Remove logo_icon column and keep only logo_url for image uploads
-- Run this in Supabase SQL Editor

ALTER TABLE website_content 
DROP COLUMN IF EXISTS logo_icon;
