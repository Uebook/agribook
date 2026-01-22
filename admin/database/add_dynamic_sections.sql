-- Add columns for dynamic navigation, CTA, and footer sections
-- Run this in Supabase SQL Editor

ALTER TABLE website_content 
ADD COLUMN IF NOT EXISTS navigation_links JSONB DEFAULT '[]', -- Array of {label, href} objects
ADD COLUMN IF NOT EXISTS footer_quick_links JSONB DEFAULT '[]', -- Array of {label, href} objects
ADD COLUMN IF NOT EXISTS footer_categories JSONB DEFAULT '[]'; -- Array of {label, href} objects
