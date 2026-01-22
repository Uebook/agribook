# 🔥 Quick Firebase Environment Variable Setup for Vercel

## Error You're Seeing
```
Error: Firebase Admin credentials not found. Please set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT_PATH environment variable.
```

## Quick Fix - Add Environment Variable to Vercel

### Step 1: Get Firebase Service Account Key

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**
3. **Go to**: Project Settings (gear icon) → Service Accounts
4. **Click**: "Generate new private key"
5. **Download** the JSON file

### Step 2: Convert JSON to Single Line String

The JSON file needs to be converted to a single-line string for Vercel.

**Option A: Using Terminal (Mac/Linux)**
```bash
# Replace path/to/serviceAccountKey.json with your actual file path
cat path/to/serviceAccountKey.json | jq -c . | tr -d '\n'
```

**Option B: Using Online Tool**
1. Copy the entire JSON content
2. Go to: https://www.freeformatter.com/json-formatter.html
3. Paste JSON and click "Minify"
4. Copy the minified JSON (single line)

**Option C: Manual (Simple)**
- Open the JSON file
- Remove all line breaks and extra spaces
- Make it one continuous line

### Step 3: Add to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `admin-orcin-omega` (or your project name)
3. **Go to**: Settings → Environment Variables
4. **Add New Variable**:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the single-line JSON string
   - **Environment**: ✅ Production, ✅ Preview, ✅ Development
5. **Click**: Save

### Step 4: Redeploy

After adding the environment variable:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

**Option B: Via CLI**
```bash
cd /Users/vansh/ReactProject/Agribook/admin
vercel --prod
```

## Example JSON Format

Your `FIREBASE_SERVICE_ACCOUNT_KEY` should look like this (all on one line):

```
{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

## Verify It's Working

After redeploying, try sending a notification again. Check Vercel function logs:
1. Go to Vercel Dashboard → Functions → `/api/notifications/push`
2. Check logs for: `✅ Firebase Admin initialized successfully`

## Troubleshooting

### Issue: "Invalid FIREBASE_SERVICE_ACCOUNT_KEY format"
- Make sure JSON is valid
- Make sure it's all on one line
- Make sure there are no extra quotes or escaping issues

### Issue: "Firebase Admin credentials not found" (after adding)
- Wait 2-3 minutes for environment variable to propagate
- Redeploy the application
- Check that variable is set for all environments (Production, Preview, Development)

### Issue: Still not working
- Check Vercel function logs for detailed error
- Verify the JSON is valid: https://jsonlint.com
- Make sure you're using the correct Firebase project

---

**Quick Steps:**
1. Download Firebase service account JSON
2. Convert to single-line string
3. Add as `FIREBASE_SERVICE_ACCOUNT_KEY` in Vercel
4. Redeploy

**That's it!** 🚀
