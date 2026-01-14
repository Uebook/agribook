# Test FCM Token Update API

## Quick Test

### Using cURL

```bash
# Replace USER_ID and FCM_TOKEN with actual values
curl -X POST https://admin-orcin-omega.vercel.app/api/users/fcm-token \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "fcm_token": "YOUR_FCM_TOKEN_HERE"
  }'
```

### Using Browser Console

```javascript
fetch('https://admin-orcin-omega.vercel.app/api/users/fcm-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user_id: 'YOUR_USER_ID',
    fcm_token: 'YOUR_FCM_TOKEN'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

## Expected Responses

### Success (200)
```json
{
  "success": true,
  "message": "FCM token updated successfully",
  "user_id": "user-uuid",
  "fcm_token": "fcm-token-prefix..."
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
  "error": "FCM token column not found. Please run the database migration to add fcm_token column.",
  "details": "...",
  "migration_sql": "ALTER TABLE users ADD COLUMN IF NOT EXISTS fcm_token TEXT; ..."
}
```

## Troubleshooting

### Issue: "FCM token column not found"

**Solution:** Run this SQL in Supabase:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token_updated_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_fcm_token ON users(fcm_token) WHERE fcm_token IS NOT NULL;
```

### Issue: "User not found"

**Solution:** 
1. Verify user_id is correct
2. Check user exists in database:
   ```sql
   SELECT id, name, email FROM users WHERE id = 'YOUR_USER_ID';
   ```

### Issue: API returns 500 error

**Solution:**
1. Check Vercel function logs
2. Verify Supabase connection
3. Check database columns exist
4. Verify environment variables are set

## Verify Token Was Saved

```sql
SELECT id, name, email, fcm_token, fcm_token_updated_at 
FROM users 
WHERE id = 'YOUR_USER_ID';
```
