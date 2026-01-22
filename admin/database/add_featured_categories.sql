-- Add featured_category_ids column to website_content table
-- Run this in Supabase SQL Editor

ALTER TABLE website_content 
ADD COLUMN IF NOT EXISTS featured_category_ids UUID[] DEFAULT '{}';
