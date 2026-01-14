# 🔥 Firebase Setup for Vercel Deployment

This guide walks you through setting up Firebase Cloud Messaging for push notifications on Vercel.

## Prerequisites

- ✅ Firebase project created
- ✅ Android app registered in Firebase
- ✅ `google-services.json` file downloaded
- ✅ Vercel project deployed

## Step-by-Step Setup

### 1. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **agriebook-1a0bc**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Click **Generate Key** to confirm
7. Download the JSON file (e.g., `agriebook-1a0bc-firebase-adminsdk-xxxxx.json`)

⚠️ **Important**: Keep this file secure! Never commit it to git.

### 2. Convert JSON to Single-Line String

Vercel environment variables need the JSON as a single-line string.

#### Option A: Using jq (Recommended)

```bash
# Install jq if not installed
# Mac: brew install jq
# Linux: sudo apt-get install jq

# Convert JSON to single line
cat agriebook-1a0bc-firebase-adminsdk-xxxxx.json | jq -c
```

#### Option B: Using Python

```bash
python3 -c "import json; print(json.dumps(json.load(open('agriebook-1a0bc-firebase-adminsdk-xxxxx.json'))))"
```

#### Option C: Manual Conversion

1. Open the JSON file in a text editor
2. Remove all line breaks (`\n`)
3. Remove extra spaces
4. Make it a single continuous line
5. Ensure all quotes are properly escaped

**Example format:**
```
{"type":"service_account","project_id":"agriebook-1a0bc","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@agriebook-1a0bc.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40agriebook-1a0bc.iam.gserviceaccount.com"}
```

### 3. Add Environment Variable to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **admin-orcin-omega**
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New**
6. Fill in:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the single-line JSON string (from Step 2)
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
7. Click **Save**

### 4. Redeploy Application

After adding the environment variable, you must redeploy:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots** (⋯) menu
4. Click **Redeploy**
5. Wait for deployment to complete

**Option B: Via Git Push**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger redeploy for Firebase"
git push
```

**Option C: Via Vercel CLI**
```bash
vercel --prod
```

### 5. Verify Setup

#### Test Push Notification API

```bash
curl -X POST https://admin-orcin-omega.vercel.app/api/notifications/push \
  -H "Content-Type: application/json" \
  -d '{
    "role": "reader",
    "title": "Test Notification",
    "body": "This is a test push notification from Vercel"
  }'
```

**Expected Success Response:**
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

**If you get an error**, check the troubleshooting section below.

#### Test from Admin Panel

1. Go to: `https://admin-orcin-omega.vercel.app/notifications`
2. Select target (e.g., "By Role" → "Readers")
3. Enter title and message
4. Click "Send Notification"
5. Check if notification appears on mobile devices

## Troubleshooting

### Error: "Firebase Admin not initialized"

**Symptoms:**
- API returns error about Firebase Admin
- Logs show "Firebase Admin credentials not found"

**Solutions:**
1. ✅ Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is set in Vercel
2. ✅ Check the JSON string is valid (no line breaks, properly formatted)
3. ✅ Ensure you've redeployed after adding the variable
4. ✅ Verify the variable is set for Production environment

**Test JSON validity:**
```bash
# Try parsing the JSON
echo 'YOUR_JSON_STRING' | jq .
```

### Error: "Invalid FIREBASE_SERVICE_ACCOUNT_KEY format"

**Symptoms:**
- Error message about invalid JSON format

**Solutions:**
1. Ensure JSON is a single line (no `\n` characters)
2. Escape quotes properly
3. Don't add extra quotes around the JSON string
4. The value should start with `{"type":"service_account"...`

### Error: "No FCM tokens found"

**Symptoms:**
- API returns success but `tokens_found: 0`

**Solutions:**
1. ✅ Verify users have FCM tokens saved in database:
   ```sql
   SELECT id, name, fcm_token 
   FROM users 
   WHERE fcm_token IS NOT NULL;
   ```
2. ✅ Ensure mobile app has registered tokens
3. ✅ Check database migration was run (`add_fcm_token.sql`)

### Error: "Notifications sent: 0, Failed: X"

**Symptoms:**
- Some notifications fail to send

**Solutions:**
1. Check Firebase Console → Cloud Messaging → Reports
2. Verify FCM tokens are valid (not expired)
3. Check device has internet connection
4. Verify app has notification permissions

### Environment Variable Not Working

**Symptoms:**
- Variable is set but code can't access it

**Solutions:**
1. ✅ Redeploy after adding variable (variables only available after deployment)
2. ✅ Check variable name is exactly: `FIREBASE_SERVICE_ACCOUNT_KEY`
3. ✅ Verify variable is set for the correct environment (Production)
4. ✅ Check Vercel deployment logs for errors

## Complete Environment Variables Checklist

Make sure these are all set in Vercel:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `NEXT_PUBLIC_APP_URL` | ✅ | Vercel app URL |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | ✅ | Firebase Admin credentials |

## Security Best Practices

1. ✅ **Never commit** service account keys to git
2. ✅ Use environment variables (not files) in Vercel
3. ✅ Restrict Firebase Admin permissions in production
4. ✅ Rotate service account keys periodically
5. ✅ Monitor Firebase usage in Firebase Console

## Testing Checklist

- [ ] Firebase service account key downloaded
- [ ] JSON converted to single-line string
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` added to Vercel
- [ ] Variable set for Production, Preview, and Development
- [ ] Application redeployed
- [ ] Push notification API tested (returns success)
- [ ] Admin panel notification page accessible
- [ ] Test notification sent from admin panel
- [ ] Mobile app receives push notification

## Next Steps

After Firebase is set up:

1. ✅ Test token registration on mobile app
2. ✅ Send test notification from admin panel
3. ✅ Verify notifications appear on devices
4. ✅ Monitor Firebase Console for delivery reports

## Support

- **Firebase Console**: https://console.firebase.google.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs/concepts/projects/environment-variables

---

**Quick Links:**
- Your Vercel Project: https://vercel.com/dashboard
- Firebase Project: https://console.firebase.google.com/project/agriebook-1a0bc
- API Endpoint: https://admin-orcin-omega.vercel.app/api/notifications/push
