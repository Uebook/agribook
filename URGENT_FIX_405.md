# 🚨 URGENT: Fix 405 Error for FCM Token API

## The Problem

The mobile app is getting **405 Method Not Allowed** when trying to call `/api/users/fcm-token`. This means the route either:
1. **Not deployed to Vercel yet** (most likely)
2. **Route file structure issue**
3. **Next.js not recognizing the route**

## Immediate Solution

### Step 1: Deploy the Route File

The route file exists locally but needs to be deployed. Run:

```bash
cd /Users/vansh/ReactProject/Agribook

# Add the route file
git add admin/app/api/users/fcm-token/route.ts

# Commit
git commit -m "Fix: Add FCM token API endpoint with CORS and GET test"

# Push to deploy
git push
```

### Step 2: Verify Deployment

After pushing, wait 2-5 minutes, then test:

```bash
# Test if endpoint exists
curl https://admin-orcin-omega.vercel.app/api/users/fcm-token
```

**Expected:** Should return JSON, not 404 or 405

### Step 3: Test POST Request

```bash
curl -X POST https://admin-orcin-omega.vercel.app/api/users/fcm-token \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-id","fcm_token":"test-token"}'
```

## What I Fixed

1. ✅ Added GET handler for testing
2. ✅ Added CORS headers to all responses
3. ✅ Fixed CORS header definitions
4. ✅ Added test endpoint at `/api/users/fcm-token/test`

## After Deployment

1. **Restart mobile app** - It should now successfully register FCM tokens
2. **Check mobile logs** - Should see success messages
3. **Check database** - Tokens should be saved

## If Still Getting 405 After Deployment

1. **Check Vercel Functions:**
   - Go to Vercel Dashboard → Functions
   - Look for `/api/users/fcm-token`
   - Check logs for errors

2. **Verify Route File:**
   - File path: `admin/app/api/users/fcm-token/route.ts`
   - Should export `POST`, `GET`, and `OPTIONS` functions

3. **Clear Cache:**
   - Wait 5 minutes for Vercel cache to clear
   - Or trigger a new deployment

## Quick Test Script

```bash
#!/bin/bash
echo "Testing FCM Token Endpoint..."

# Test GET
echo "1. Testing GET..."
curl -s https://admin-orcin-omega.vercel.app/api/users/fcm-token | jq .

# Test POST
echo "2. Testing POST..."
curl -s -X POST https://admin-orcin-omega.vercel.app/api/users/fcm-token \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","fcm_token":"test-token"}' | jq .
```

---

**The route file is fixed. Just deploy it and the 405 error will be resolved!** 🚀
