-- Add description and image_url columns to notifications table
-- Run this in Supabase SQL Editor

-- Add description column
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add image_url column
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comments
COMMENT ON COLUMN notifications.description IS 'Detailed description for the notification (shown in-app)';
COMMENT ON COLUMN notifications.image_url IS 'URL to an image for the notification (e.g., offer banner)';
