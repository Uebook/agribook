/**
 * Supabase Client Configuration for Mobile App
 * 
 * IMPORTANT: Replace these values with your actual Supabase credentials
 * You can find them in Supabase Dashboard → Settings → API
 * 
 * Or copy from admin/.env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase credentials
// Get these from: Supabase Dashboard → Settings → API
const SUPABASE_URL = 'https://isndoxsyjbdzibhkrisj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbmRveHN5amJkemliaGtyaXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1ODg4NTEsImV4cCI6MjA4MzE2NDg1MX0.xAhUBZ-5NCySy6QmF0DheBZaeFZRBBtnHRDHYcpQglo';

// Always try to create Supabase client - fail gracefully if it doesn't work
let supabase = null;

try {
  // Validate that we have real credentials (not placeholders)
  const hasValidUrl = SUPABASE_URL && 
                      SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co' &&
                      SUPABASE_URL.startsWith('https://');
  
  const hasValidKey = SUPABASE_ANON_KEY && 
                      SUPABASE_ANON_KEY !== 'YOUR_PUBLIC_ANON_KEY' &&
                      SUPABASE_ANON_KEY.length > 50;

  if (hasValidUrl && hasValidKey) {
    console.log('🔧 Initializing Supabase client...');
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized successfully');
  } else {
    console.warn('⚠️ Supabase credentials not configured properly:', {
      hasValidUrl,
      hasValidKey,
      url: SUPABASE_URL?.substring(0, 40),
      keyLength: SUPABASE_ANON_KEY?.length,
    });
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error);
  console.error('Error details:', error?.message);
  supabase = null;
}

export default supabase;
