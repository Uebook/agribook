# Firebase Cloud Messaging Setup Guide

This guide explains how to set up Firebase Cloud Messaging (FCM) for push notifications in the Agribook app.

## Prerequisites

1. Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. Android app registered in Firebase Console
3. `google-services.json` file downloaded and placed in `mobile/android/app/`

## Mobile App Setup

### 1. Install Dependencies

```bash
cd mobile
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### 2. Android Configuration

The Android configuration has been completed:
- ✅ Google Services plugin added to `android/build.gradle`
- ✅ Firebase dependencies added to `android/app/build.gradle`
- ✅ Notification permissions added to `AndroidManifest.xml`
- ✅ Firebase messaging service configured

### 3. iOS Configuration (if needed)

For iOS, you'll need to:
1. Add `GoogleService-Info.plist` to `ios/` directory
2. Configure Firebase in `ios/Podfile`
3. Run `cd ios && pod install`

## Backend Setup

### 1. Install Firebase Admin SDK

```bash
cd admin
npm install firebase-admin
```

### 2. Set Up Firebase Admin Credentials

You have two options:

#### Option A: Service Account Key (Recommended for Production)

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Set the environment variable:

```bash
# In your .env.local or deployment environment
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

#### Option B: Service Account File (For Local Development)

1. Download the service account JSON file
2. Place it in `admin/` directory (add to `.gitignore`)
3. Update `admin/app/api/notifications/push/route.ts` to use the file path

### 3. Database Migration

Run the SQL migration to add FCM token columns:

```sql
-- Run this in Supabase SQL Editor
-- File: admin/database/add_fcm_token.sql
```

Or manually:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token_updated_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_fcm_token ON users(fcm_token) WHERE fcm_token IS NOT NULL;
```

## How It Works

### 1. Token Registration

When a user opens the app:
1. Firebase service requests notification permissions
2. Gets FCM token from Firebase
3. Sends token to backend via `/api/users/fcm-token`
4. Backend saves token in `users.fcm_token` column

### 2. Sending Notifications

#### From Admin Panel

1. Navigate to `/notifications` page
2. Select target (All Users, By Role, or Specific User)
3. Enter title and message
4. Click "Send Notification"

#### From Code

```typescript
import { sendNotificationToUser, sendNotificationToRole } from '@/lib/utils/notifications';

// Send to a single user
await sendNotificationToUser(
  userId,
  'Title',
  'Message',
  {
    icon: '🔔',
    type: 'info',
    action_type: 'navigate',
    action_screen: 'BookDetail',
    action_params: { bookId: '123' }
  }
);

// Send to all users with a role
await sendNotificationToRole(
  'reader',
  'Title',
  'Message',
  { icon: '📚', type: 'info' }
);
```

#### Via API

```bash
POST /api/notifications/push
Content-Type: application/json

{
  "user_id": "user-uuid",  // Optional
  "user_ids": ["uuid1", "uuid2"],  // Optional
  "role": "reader",  // Optional
  "title": "Notification Title",
  "body": "Notification message",
  "data": {  // Optional
    "action_screen": "BookDetail",
    "bookId": "123"
  }
}
```

### 3. Notification Handling

The mobile app handles notifications in three states:

1. **Foreground**: `onMessage` handler receives the notification
2. **Background**: `onNotificationOpenedApp` handler when user taps notification
3. **Quit State**: `getInitialNotification` when app is opened from notification

## Testing

### Test Token Registration

1. Open the app on a device/emulator
2. Check logs for "FCM Token: ..."
3. Verify token is saved in database:
   ```sql
   SELECT id, name, fcm_token, fcm_token_updated_at 
   FROM users 
   WHERE fcm_token IS NOT NULL;
   ```

### Test Push Notification

1. Use Firebase Console → Cloud Messaging → Send test message
2. Or use the admin panel at `/notifications`
3. Or use the API endpoint directly

## Troubleshooting

### Token Not Being Saved

- Check API endpoint `/api/users/fcm-token` is accessible
- Verify database columns exist
- Check server logs for errors

### Notifications Not Received

- Verify FCM token is saved in database
- Check Firebase Admin SDK is properly initialized
- Verify service account credentials are correct
- Check device has internet connection
- Ensure app has notification permissions

### Firebase Admin Not Initialized

- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable is set
- Check service account JSON is valid
- Ensure Firebase Admin SDK is installed

## Environment Variables

### Local Development (.env.local)

Add to your `admin/.env.local` file:

```bash
# Firebase Admin Service Account (JSON string)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"agriebook-1a0bc","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-...@agriebook-1a0bc.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'

# Or if using file path (local development only)
FIREBASE_SERVICE_ACCOUNT_PATH='./path/to/service-account.json'
```

### Vercel Deployment

**Important**: For Vercel, you must use the `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable (not the file path).

#### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **agriebook-1a0bc**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file (e.g., `agriebook-1a0bc-firebase-adminsdk-xxxxx.json`)

#### Step 2: Convert JSON to Single-Line String

The JSON file needs to be converted to a single-line string for Vercel:

**Option A: Using Command Line (Recommended)**
```bash
# On Mac/Linux
cat agriebook-1a0bc-firebase-adminsdk-xxxxx.json | jq -c

# Or using Python
python3 -c "import json; print(json.dumps(json.load(open('agriebook-1a0bc-firebase-adminsdk-xxxxx.json'))))"
```

**Option B: Manual Conversion**
1. Open the JSON file in a text editor
2. Remove all line breaks and extra spaces
3. Make it a single line
4. Escape any quotes if needed

**Example format:**
```
{"type":"service_account","project_id":"agriebook-1a0bc","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@agriebook-1a0bc.iam.gserviceaccount.com",...}
```

#### Step 3: Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **admin-orcin-omega**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add the variable:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the single-line JSON string (from Step 2)
   - **Environment**: Select **Production**, **Preview**, and **Development**
6. Click **Save**

#### Step 4: Redeploy

After adding the environment variable:

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) next to the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger deployment

#### Step 5: Verify

Test the Firebase notification endpoint:

```bash
curl -X POST https://admin-orcin-omega.vercel.app/api/notifications/push \
  -H "Content-Type: application/json" \
  -d '{
    "role": "reader",
    "title": "Test Notification",
    "body": "This is a test push notification"
  }'
```

**Expected Response** (if working):
```json
{
  "success": true,
  "message": "Push notifications sent",
  "target_users": 10,
  "tokens_found": 8,
  "notifications_sent": 8,
  "notifications_failed": 0
}
```

**If you get an error**, check:
1. The JSON string is valid (no line breaks, properly escaped)
2. The environment variable is set for Production environment
3. The deployment has been redeployed after adding the variable
4. Firebase Admin SDK is installed (`npm install firebase-admin`)

---

### Quick Vercel Setup Checklist

- [ ] Firebase service account key downloaded
- [ ] JSON converted to single-line string
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` added to Vercel environment variables
- [ ] Variable set for Production, Preview, and Development
- [ ] Application redeployed
- [ ] Push notification endpoint tested

## Security Notes

1. **Never commit** service account keys to git
2. Use environment variables for credentials
3. Restrict Firebase Admin permissions in production
4. Validate user permissions before sending notifications

## Next Steps

1. ✅ Install Firebase packages: `npm install` in `mobile/` directory
2. ✅ Run database migration: Execute `add_fcm_token.sql` in Supabase
3. ✅ Set up Firebase Admin: Install `firebase-admin` and configure credentials
4. ✅ Test token registration: Open app and verify token is saved
5. ✅ Test push notification: Send a test notification from admin panel

## Support

For issues or questions:
- Check Firebase Console for delivery reports
- Review server logs for errors
- Verify all environment variables are set correctly
