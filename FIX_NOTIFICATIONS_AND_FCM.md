# Fix: Notifications Sidebar & FCM Token Update

## Issues

1. **Notifications not showing in sidebar** - Link exists in code but may not be deployed
2. **FCM token not updating** - All values showing NULL in database

## Solutions

### 1. Deploy Sidebar Changes

The sidebar code has the notifications link, but it needs to be deployed:

```bash
cd /Users/vansh/ReactProject/Agribook

# Commit and push sidebar changes
git add admin/components/Sidebar.tsx
git commit -m "Add notifications link to sidebar"
git push
```

**Or manually verify in Vercel:**
- Check if `admin/components/Sidebar.tsx` has line 16 with notifications link
- If not, the file needs to be updated on Vercel

### 2. Fix FCM Token Update

#### Step 1: Verify Database Columns Exist

Run in Supabase SQL Editor:

```sql
-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('fcm_token', 'fcm_token_updated_at');

-- If missing, add them:
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token_updated_at TIMESTAMP;
```

#### Step 2: Install Firebase Packages in Mobile App

```bash
cd /Users/vansh/ReactProject/Agribook/mobile
npm install @react-native-firebase/app@^21.0.0 @react-native-firebase/messaging@^21.0.0
```

#### Step 3: Rebuild Mobile App

```bash
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
```

Then in new terminal:
```bash
npm run android
```

#### Step 4: Check Mobile App Logs

When app starts, check Metro bundler logs for:
- `📱 FCM Token:` - Should show the token
- `📱 Attempting to get FCM token for user:` - Should show user ID
- `✅ FCM token registered successfully` - Success message
- `❌` - Any error messages

#### Step 5: Test FCM Token API Directly

```bash
# Get a test user ID from database
# Then test the API:
curl -X POST https://admin-orcin-omega.vercel.app/api/users/fcm-token \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "fcm_token": "test-token-12345"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "FCM token updated successfully",
  "user_id": "...",
  "fcm_token": "test-token-12345..."
}
```

### 3. Debugging Steps

#### Check Mobile App Firebase Initialization

1. Open app
2. Check Metro logs for Firebase messages
3. Look for:
   - `⚠️ Firebase messaging not installed` - Packages not installed
   - `📱 FCM Token:` - Token retrieved successfully
   - `✅ FCM token registered successfully` - Backend update successful

#### Check API Endpoint

1. Go to Vercel Dashboard → Functions
2. Check `/api/users/fcm-token` function logs
3. Look for:
   - `📱 FCM Token Update Request:` - Request received
   - `✅ User found` - User exists
   - `✅ FCM token updated successfully` - Update successful
   - `❌` - Any errors

#### Check Database

```sql
-- Check if any tokens are saved
SELECT id, name, email, fcm_token, fcm_token_updated_at 
FROM users 
WHERE fcm_token IS NOT NULL;

-- Check recent updates
SELECT id, name, fcm_token_updated_at 
FROM users 
WHERE fcm_token_updated_at IS NOT NULL
ORDER BY fcm_token_updated_at DESC
LIMIT 10;
```

## Common Issues

### Issue 1: "Firebase messaging not installed"

**Solution:**
```bash
cd mobile
npm install @react-native-firebase/app @react-native-firebase/messaging
cd android && ./gradlew clean && cd ..
npm run android
```

### Issue 2: "FCM token column not found"

**Solution:** Run migration SQL in Supabase (see Step 1 above)

### Issue 3: "User not found"

**Solution:** 
- Verify user_id is correct
- Check user exists in database

### Issue 4: Sidebar not showing notifications

**Solution:**
- Verify `admin/components/Sidebar.tsx` has notifications link
- Redeploy to Vercel
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Verification Checklist

- [ ] Sidebar has notifications link (line 16 in Sidebar.tsx)
- [ ] Changes deployed to Vercel
- [ ] Database columns exist (fcm_token, fcm_token_updated_at)
- [ ] Firebase packages installed in mobile app
- [ ] Mobile app rebuilt after Firebase installation
- [ ] Mobile app logs show FCM token retrieval
- [ ] API endpoint returns success
- [ ] Database shows updated tokens

## Quick Test

1. **Test Sidebar:**
   - Visit: `https://admin-orcin-omega.vercel.app`
   - Look for "🔔 Notifications" in sidebar
   - Click it - should go to `/notifications`

2. **Test FCM Token:**
   - Open mobile app
   - Check Metro logs for FCM token messages
   - Check database for updated token
   - Or test API directly with curl

---

**After fixing, the notifications link should appear in sidebar and FCM tokens should update in database!** 🎉
