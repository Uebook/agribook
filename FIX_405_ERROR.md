# Fix: 405 Method Not Allowed Error for FCM Token

## Error
```
HTTP error! status: 405
```

## Cause
The `/api/users/fcm-token` endpoint is returning 405 (Method Not Allowed), which means:
1. The route might not be deployed to Vercel
2. Next.js might not be recognizing the route file
3. The route file structure might be incorrect

## Solutions

### Solution 1: Verify Route File Exists

Check that the file exists at:
```
admin/app/api/users/fcm-token/route.ts
```

### Solution 2: Deploy to Vercel

The route file needs to be deployed:

```bash
cd /Users/vansh/ReactProject/Agribook

# Commit and push
git add admin/app/api/users/fcm-token/route.ts
git commit -m "Add FCM token API endpoint with CORS support"
git push
```

### Solution 3: Verify Route Structure

The route file should have:
- `POST` function exported
- `OPTIONS` function for CORS (already added)
- Proper Next.js App Router structure

### Solution 4: Test the Endpoint

After deploying, test the endpoint:

```bash
curl -X POST https://admin-orcin-omega.vercel.app/api/users/fcm-token \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-id",
    "fcm_token": "test-token-12345"
  }'
```

**Expected Response:**
- If user doesn't exist: `404` with "User not found"
- If columns missing: `500` with migration SQL
- If successful: `200` with success message

### Solution 5: Check Vercel Deployment

1. Go to Vercel Dashboard
2. Check Deployments
3. Verify the latest deployment includes `admin/app/api/users/fcm-token/route.ts`
4. Check Function logs for any errors

### Solution 6: Verify Database Columns

Make sure the database columns exist:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token_updated_at TIMESTAMP;
```

## Quick Fix Checklist

- [ ] Route file exists: `admin/app/api/users/fcm-token/route.ts`
- [ ] Route file has `POST` export
- [ ] Route file has `OPTIONS` export (for CORS)
- [ ] Changes committed to git
- [ ] Changes pushed to repository
- [ ] Vercel deployment completed
- [ ] Database columns exist
- [ ] Test endpoint with curl

## After Fix

Once deployed, the mobile app should be able to:
1. Get FCM token from Firebase
2. Call `/api/users/fcm-token` with POST
3. Receive success response
4. Token saved in database

Check mobile app logs for:
- `📱 FCM Token:` - Token retrieved
- `📡 Calling FCM token API:` - API call started
- `✅ FCM token registered successfully` - Success!
