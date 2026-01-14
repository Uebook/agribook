-- Add FCM token columns to users table for Firebase Cloud Messaging
-- Run this SQL in Supabase SQL Editor

-- Add fcm_token column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token TEXT;

-- Add fcm_token_updated_at column to track when token was last updated
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token_updated_at TIMESTAMP;

-- Add index for faster lookups (optional, but recommended)
CREATE INDEX IF NOT EXISTS idx_users_fcm_token ON users(fcm_token) WHERE fcm_token IS NOT NULL;

-- Add comment
COMMENT ON COLUMN users.fcm_token IS 'Firebase Cloud Messaging token for push notifications';
COMMENT ON COLUMN users.fcm_token_updated_at IS 'Timestamp when FCM token was last updated';
