# 🔥 Get Firebase Service Account Key from Same Project

Since you already have `google-services.json`, you're using the same Firebase project. Here's how to get the service account key:

## Quick Steps

### Step 1: Go to Firebase Console

1. **Open**: https://console.firebase.google.com
2. **Select your project** (the same one that has your `google-services.json`)
3. **Check project ID** in `google-services.json`:
   - Your project ID is in the file: `"project_id": "your-project-id"`

### Step 2: Get Service Account Key

1. In Firebase Console, click **⚙️ Settings** (gear icon) → **Project Settings**
2. Go to **Service Accounts** tab
3. Click **Generate New Private Key** button
4. Click **Generate Key** to confirm
5. **Download** the JSON file (e.g., `your-project-id-firebase-adminsdk-xxxxx.json`)

⚠️ **Important**: This is different from `google-services.json`:
- `google-services.json` = For mobile app (client-side)
- Service Account Key = For server/Vercel (admin SDK)

### Step 3: Convert to Single Line

```bash
# Replace with your downloaded file path
cat your-project-id-firebase-adminsdk-xxxxx.json | jq -c
```

Or if you don't have `jq`:
```bash
python3 -c "import json; print(json.dumps(json.load(open('your-project-id-firebase-adminsdk-xxxxx.json'))))"
```

### Step 4: Add to Vercel

1. **Go to**: https://vercel.com/dashboard
2. **Select project**: `admin-orcin-omega`
3. **Go to**: Settings → Environment Variables
4. **Add**:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the single-line JSON (from Step 3)
   - **Environment**: ✅ Production, ✅ Preview, ✅ Development
5. **Save**

### Step 5: Redeploy

```bash
cd /Users/vansh/ReactProject/Agribook/admin
vercel --prod
```

## What's the Difference?

| File | Purpose | Used For |
|------|---------|----------|
| `google-services.json` | Client SDK config | Mobile app (Android) |
| Service Account Key | Admin SDK credentials | Server/Vercel (Backend) |

Both are from the **same Firebase project**, but serve different purposes!

---

**Quick Summary:**
1. Firebase Console → Project Settings → Service Accounts
2. Generate New Private Key → Download JSON
3. Convert to single line
4. Add to Vercel as `FIREBASE_SERVICE_ACCOUNT_KEY`
5. Redeploy
