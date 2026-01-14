# 🚀 Vercel Deployment Checklist

## Files to Deploy

### ✅ Admin Panel (Vercel)

**New Files:**
- `admin/app/api/users/all/route.ts` - User selection API
- `admin/app/api/users/fcm-token/route.ts` - FCM token registration
- `admin/app/api/notifications/push/route.ts` - Push notification API
- `admin/app/notifications/page.tsx` - Enhanced notifications UI
- `admin/lib/firebase/admin.ts` - Firebase Admin helper
- `admin/database/add_fcm_token.sql` - FCM token migration
- `admin/database/add_notification_fields.sql` - Notification fields migration

**Modified Files:**
- `admin/lib/utils/notifications.ts` - Added Firebase push support
- `admin/package.json` - Added firebase-admin dependency

### ⚠️ Mobile App (Not for Vercel)

These files are for the mobile app and should NOT be deployed to Vercel:
- `mobile/` directory files
- Firebase mobile configuration files

## 📋 Deployment Steps

### Step 1: Commit Changes

```bash
cd /Users/vansh/ReactProject/Agribook

# Add admin panel changes only
git add admin/

# Add documentation
git add FIREBASE_SETUP.md
git add FIREBASE_IMPLEMENTATION_SUMMARY.md
git add admin/DEPLOY_TO_VERCEL.md
git add admin/VERCEL_FIREBASE_SETUP.md
git add admin/DEPLOY_NOTIFICATIONS_UPDATE.md

# Commit
git commit -m "Deploy enhanced notification system with Firebase support

- Add notification page with image, description, and user selection
- Add Firebase push notification support
- Add FCM token registration API
- Add user selection API endpoint
- Update notification utilities to send Firebase push notifications"

# Push to trigger Vercel deployment
git push
```

### Step 2: Run Database Migrations

**In Supabase SQL Editor, run these migrations:**

1. **FCM Token Migration:**
   ```sql
   -- File: admin/database/add_fcm_token.sql
   ALTER TABLE users 
   ADD COLUMN IF NOT EXISTS fcm_token TEXT;
   
   ALTER TABLE users 
   ADD COLUMN IF NOT EXISTS fcm_token_updated_at TIMESTAMP;
   
   CREATE INDEX IF NOT EXISTS idx_users_fcm_token ON users(fcm_token) WHERE fcm_token IS NOT NULL;
   ```

2. **Notification Fields Migration:**
   ```sql
   -- File: admin/database/add_notification_fields.sql
   ALTER TABLE notifications 
   ADD COLUMN IF NOT EXISTS description TEXT;
   
   ALTER TABLE notifications 
   ADD COLUMN IF NOT EXISTS image_url TEXT;
   ```

### Step 3: Verify Environment Variables

Check Vercel Dashboard → Settings → Environment Variables:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_APP_URL`
- ✅ `FIREBASE_SERVICE_ACCOUNT_KEY` (for push notifications)

### Step 4: Verify Deployment

1. **Check Build Status:**
   - Go to Vercel Dashboard → Deployments
   - Wait for build to complete
   - Check for any build errors

2. **Test New Endpoints:**
   ```bash
   # Test user selection API
   curl https://admin-orcin-omega.vercel.app/api/users/all?limit=10
   
   # Test notifications page
   # Visit: https://admin-orcin-omega.vercel.app/notifications
   ```

3. **Test Notification Sending:**
   - Go to `/notifications` page
   - Fill in form with test data
   - Send notification
   - Verify success message

## 🎯 Quick Deploy Script

```bash
#!/bin/bash
# Quick deploy script

cd /Users/vansh/ReactProject/Agribook

echo "📦 Staging admin panel changes..."
git add admin/ FIREBASE_SETUP.md FIREBASE_IMPLEMENTATION_SUMMARY.md admin/*.md

echo "💾 Committing changes..."
git commit -m "Deploy enhanced notification system with Firebase"

echo "🚀 Pushing to trigger Vercel deployment..."
git push

echo "✅ Deployment triggered!"
echo "📋 Next steps:"
echo "1. Run database migrations in Supabase"
echo "2. Verify environment variables in Vercel"
echo "3. Check deployment status in Vercel Dashboard"
```

## ⚠️ Important Notes

1. **Don't commit mobile files to trigger Vercel deployment** - Only admin panel files
2. **Run database migrations BEFORE testing** - New columns are required
3. **Firebase Admin must be configured** - Set `FIREBASE_SERVICE_ACCOUNT_KEY` in Vercel
4. **Test after deployment** - Verify all features work correctly

## 🔍 Post-Deployment Testing

### Test 1: User Selection API
```bash
curl https://admin-orcin-omega.vercel.app/api/users/all
```

### Test 2: Notifications Page
- Visit: `https://admin-orcin-omega.vercel.app/notifications`
- Verify all fields are visible
- Test user selection

### Test 3: Send Notification
- Fill form with test data
- Select users
- Add image URL
- Send notification
- Verify success

### Test 4: Database
```sql
-- Check notifications have new fields
SELECT id, title, description, image_url 
FROM notifications 
ORDER BY created_at DESC 
LIMIT 1;
```

## 📞 Support

If deployment fails:
1. Check Vercel build logs
2. Verify all dependencies in `package.json`
3. Check TypeScript/ESLint errors
4. Verify environment variables

---

**Ready to deploy? Run the commit and push commands above!** 🚀
