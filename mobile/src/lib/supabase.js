/**
 * Supabase Client Configuration for Mobile App
 * 
 * Credentials are configured below.
 * To update: Get values from Supabase Dashboard → Settings → API
 */

// Immediate log to verify module is loading
console.log('🚀 SUPABASE MODULE STARTING - Line 1');

let createClient;
try {
  console.log('🚀 Importing createClient...');
  const supabaseModule = require('@supabase/supabase-js');
  createClient = supabaseModule.createClient;
  console.log('✅ createClient imported successfully:', typeof createClient);
} catch (importError) {
  console.error('❌ CRITICAL: Failed to import createClient:', importError);
  createClient = null;
}

// Also try ES6 import as fallback
if (!createClient) {
  try {
    const { createClient: createClientES6 } = require('@supabase/supabase-js');
    createClient = createClientES6;
    console.log('✅ createClient imported via ES6 fallback');
  } catch (e) {
    console.error('❌ ES6 import also failed:', e);
  }
}

console.log('📦 Supabase module loading...');

// Supabase Configuration - Already configured ✅
const SUPABASE_URL = 'https://isndoxsyjbdzibhkrisj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbmRveHN5amJkemliaGtyaXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1ODg4NTEsImV4cCI6MjA4MzE2NDg1MX0.xAhUBZ-5NCySy6QmF0DheBZaeFZRBBtnHRDHYcpQglo';

console.log('📦 Supabase credentials loaded:', {
  url: SUPABASE_URL,
  keyLength: SUPABASE_ANON_KEY?.length,
  hasUrl: !!SUPABASE_URL,
  hasKey: !!SUPABASE_ANON_KEY,
});

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

console.log('🔍 Validation check:', {
  hasValidUrl,
  hasValidKey,
  url: SUPABASE_URL,
  urlCheck: SUPABASE_URL !== PLACEHOLDER_URL,
  urlStartsWithHttps: SUPABASE_URL?.startsWith('https://'),
  keyLength: SUPABASE_ANON_KEY?.length,
  keyCheck: SUPABASE_ANON_KEY !== PLACEHOLDER_KEY,
});

if (hasValidUrl && hasValidKey) {
  console.log('✅ Validation passed, creating client...');
  
  if (!createClient) {
    console.error('❌ CRITICAL: createClient function is not available!');
    console.error('❌ Cannot create Supabase client without createClient function');
  } else {
    try {
      console.log('🔧 Calling createClient with:', {
        url: SUPABASE_URL,
        keyLength: SUPABASE_ANON_KEY.length,
        keyPreview: SUPABASE_ANON_KEY.substring(0, 20) + '...',
        createClientType: typeof createClient,
      });

      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log('🔧 createClient returned:', {
      isNull: supabase === null,
      isUndefined: supabase === undefined,
      type: typeof supabase,
      hasStorage: supabase ? !!supabase.storage : false,
    });

    // Verify client was created
    if (supabase) {
      console.log('✅ Supabase client initialized successfully');
      console.log('✅ Client type:', typeof supabase);
      console.log('✅ Client has storage:', !!supabase.storage);
      console.log('✅ Client has auth:', !!supabase.auth);
    } else {
      console.error('❌ Supabase client is null after createClient call');
    }
  } catch (error) {
      console.error('❌ CRITICAL: Exception during createClient:', error);
      console.error('Error details:', {
        message: error?.message,
        name: error?.name,
        stack: error?.stack?.substring(0, 500),
      });
      supabase = null;
    }
  }
} else {
  console.error('❌ CRITICAL: Validation failed - credentials are invalid:', {
    hasValidUrl,
    hasValidKey,
    url: SUPABASE_URL,
    keyLength: SUPABASE_ANON_KEY?.length,
  });
}

// Final verification
console.log('📊 Final module state:', {
  supabaseIsNull: supabase === null,
  supabaseIsUndefined: supabase === undefined,
  supabaseType: typeof supabase,
  supabaseValue: supabase,
});

if (!supabase) {
  console.error('❌ CRITICAL: Supabase client is NULL - profile image uploads will fail!');
  console.error('❌ This means createClient() returned null or threw an error');
} else {
  console.log('✅ Supabase client is ready for use');
  console.log('✅ Exporting supabase client');
}

export default supabase;
