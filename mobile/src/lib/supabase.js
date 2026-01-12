/**
 * Supabase Client Configuration for Mobile App
 * 
 * Credentials are configured below.
 * To update: Get values from Supabase Dashboard → Settings → API
 */

import { createClient } from '@supabase/supabase-js';

// Supabase Configuration - Already configured ✅
// Same credentials as used in admin/.env.local
const SUPABASE_URL = 'https://isndoxsyjbdzibhkrisj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbmRveHN5amJkemliaGtyaXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1ODg4NTEsImV4cCI6MjA4MzE2NDg1MX0.xAhUBZ-5NCySy6QmF0DheBZaeFZRBBtnHRDHYcpQglo';

// Validate credentials
const PLACEHOLDER_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const PLACEHOLDER_KEY = 'YOUR_PUBLIC_ANON_KEY';

const hasValidUrl = SUPABASE_URL &&
  SUPABASE_URL !== PLACEHOLDER_URL &&
  SUPABASE_URL.startsWith('https://');

const hasValidKey = SUPABASE_ANON_KEY &&
  SUPABASE_ANON_KEY !== PLACEHOLDER_KEY &&
  SUPABASE_ANON_KEY.length > 50;

// Create Supabase client - always create if credentials are valid
let supabase = null;

if (hasValidUrl && hasValidKey) {
  try {
    // Use same pattern as backend: createClient with auth options
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    supabase = null;
  }
}

export default supabase;
