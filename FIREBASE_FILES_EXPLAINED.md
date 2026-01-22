# 📁 Firebase Files Explained

## Two Different Files Needed

### 1. `google-services.json` (Mobile App) ✅ You Have This
- **Location**: `mobile/android/app/google-services.json`
- **Purpose**: Client-side Firebase SDK configuration
- **Used for**: Mobile app (Android)
- **Contains**: Project ID, API keys, app configuration
- **Status**: ✅ Already in your project

### 2. Service Account Key (Vercel/Server) ❌ You Need This
- **Location**: Not in your project (download from Firebase Console)
- **Purpose**: Server-side Firebase Admin SDK credentials
- **Used for**: Vercel backend (sending push notifications)
- **Contains**: Private key, service account email, credentials
- **Status**: ❌ Need to download from Firebase Console

## Why You Need Both

| File | Used By | Purpose |
|------|---------|---------|
| `google-services.json` | Mobile App | Connect mobile app to Firebase |
| Service Account Key | Vercel/Server | Send push notifications from server |

## How to Get Service Account Key

Since you already have `google-services.json`, you're using Firebase project: **agriebook-1a0bc**

### Step 1: Go to Firebase Console
1. Open: https://console.firebase.google.com/project/agriebook-1a0bc
2. Click **⚙️ Settings** (gear icon) → **Project Settings**
3. Go to **Service Accounts** tab
4. Click **Generate New Private Key**
5. Click **Generate Key** to download

### Step 2: Convert to Single Line

After downloading (usually to `~/Downloads/`):

```bash
# Find the downloaded file
ls ~/Downloads/*firebase*admin*.json

# Convert to single line (using jq)
cat ~/Downloads/agriebook-1a0bc-firebase-adminsdk-*.json | jq -c

# Or using Python
python3 -c "import json; print(json.dumps(json.load(open('~/Downloads/agriebook-1a0bc-firebase-adminsdk-*.json'))))"
```

### Step 3: Add to Vercel

1. Copy the single-line output
2. Go to: https://vercel.com/dashboard
3. Select project: `admin-orcin-omega`
4. Settings → Environment Variables
5. Add: `FIREBASE_SERVICE_ACCOUNT_KEY` = (paste the single-line JSON)
6. Save and redeploy

## Quick Command Reference

```bash
# If file is in Downloads with default name
cat ~/Downloads/agriebook-1a0bc-firebase-adminsdk-*.json | jq -c

# If you know exact filename
cat ~/Downloads/agriebook-1a0bc-firebase-adminsdk-xxxxx.json | jq -c

# Using Python (if jq not installed)
python3 -c "import json; print(json.dumps(json.load(open('~/Downloads/agriebook-1a0bc-firebase-adminsdk-xxxxx.json'))))"
```

## Summary

- ✅ `google-services.json` = Already have (for mobile)
- ❌ Service Account Key = Need to download (for Vercel)
- Both from same Firebase project (`agriebook-1a0bc`)
- Different files for different purposes

---

**Next Step**: Download Service Account Key from Firebase Console, then convert and add to Vercel.
