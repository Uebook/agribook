# Test FCM Token Endpoint

## Quick Test Commands

### Test 1: Check if endpoint exists (GET)

```bash
curl https://admin-orcin-omega.vercel.app/api/users/fcm-token
```

**Expected:** `{"success":true,"message":"FCM token endpoint is accessible","methods":["POST","OPTIONS","GET"]}`

### Test 2: Test POST request

```bash
curl -X POST https://admin-orcin-omega.vercel.app/api/users/fcm-token \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "fcm_token": "test-token-12345"
  }'
```

### Test 3: Test with real user ID

1. Get a user ID from database:
   ```sql
   SELECT id, name, email FROM users LIMIT 1;
   ```

2. Test with that ID:
   ```bash
   curl -X POST https://admin-orcin-omega.vercel.app/api/users/fcm-token \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "PASTE_USER_ID_HERE",
       "fcm_token": "test-fcm-token-12345"
     }'
   ```

## Expected Responses

### Success (200)
```json
{
  "success": true,
  "message": "FCM token updated successfully",
  "user_id": "...",
  "fcm_token": "test-fcm-token-123..."
}
```

### Missing Fields (400)
```json
{
  "error": "user_id and fcm_token are required"
}
```

### User Not Found (404)
```json
{
  "error": "User not found",
  "details": "..."
}
```

### Column Missing (500)
```json
{
  "error": "FCM token column not found. Please run the database migration...",
  "migration_sql": "..."
}
```

## Troubleshooting 405 Error

If you still get 405:

1. **Check if route is deployed:**
   - Visit: https://admin-orcin-omega.vercel.app/api/users/fcm-token
   - Should return JSON (not 404 or 405)

2. **Check Vercel Functions:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Look for `/api/users/fcm-token`
   - Check if it shows POST method

3. **Verify route file structure:**
   - File should be at: `admin/app/api/users/fcm-token/route.ts`
   - Should export `POST` function
   - Should export `OPTIONS` function

4. **Clear Vercel cache:**
   - Redeploy the project
   - Or wait a few minutes for cache to clear

5. **Check mobile app API URL:**
   - Verify `API_BASE_URL` in `mobile/src/services/api.js`
   - Should be: `https://admin-orcin-omega.vercel.app`

## Verify in Database

After successful update:

```sql
SELECT id, name, email, fcm_token, fcm_token_updated_at 
FROM users 
WHERE fcm_token IS NOT NULL
ORDER BY fcm_token_updated_at DESC
LIMIT 5;
```
