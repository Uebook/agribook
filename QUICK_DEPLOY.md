# 🚀 Quick Deploy to Vercel

## Option 1: Use the Deployment Script (Easiest)

```bash
cd /Users/vansh/ReactProject/Agribook
./deploy-to-vercel.sh
```

## Option 2: Manual Deployment

Run these commands in your terminal:

```bash
cd /Users/vansh/ReactProject/Agribook

# Add admin panel files
git add admin/app/api/users/fcm-token/
git add admin/app/api/users/all/
git add admin/app/api/notifications/push/
git add admin/app/notifications/
git add admin/components/Sidebar.tsx
git add admin/lib/firebase/
git add admin/lib/utils/notifications.ts
git add admin/package.json
git add admin/database/add_fcm_token.sql
git add admin/database/add_notification_fields.sql

# Add documentation
git add FIREBASE_SETUP.md FIREBASE_IMPLEMENTATION_SUMMARY.md DEPLOY_CHECKLIST.md
git add FIX_405_ERROR.md FIX_NOTIFICATIONS_AND_FCM.md
git add admin/*.md

# Commit
git commit -m "Deploy: Firebase notifications system with enhanced admin panel"

# Push (triggers Vercel deployment)
git push
```

## What Gets Deployed

### New API Endpoints
- ✅ `/api/users/fcm-token` - FCM token registration
- ✅ `/api/users/all` - User selection for notifications
- ✅ `/api/notifications/push` - Send push notifications

### New Pages
- ✅ `/notifications` - Enhanced notification sending page

### Updated Components
- ✅ Sidebar - Added notifications link

### Backend Updates
- ✅ Firebase Admin SDK integration
- ✅ Enhanced notification utilities

## After Deployment

### 1. Run Database Migrations

In Supabase SQL Editor, run:

```sql
-- FCM Token columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fcm_token_updated_at TIMESTAMP;

-- Notification fields
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### 2. Verify Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Check deployment status
3. Wait for build to complete

### 3. Test Endpoints

```bash
# Test FCM token endpoint
curl -X POST https://admin-orcin-omega.vercel.app/api/users/fcm-token \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","fcm_token":"test-token"}'

# Test notifications page
# Visit: https://admin-orcin-omega.vercel.app/notifications
```

### 4. Verify Features

- [ ] Notifications link appears in sidebar
- [ ] Notifications page loads
- [ ] User selection works
- [ ] FCM token API accepts POST requests
- [ ] Push notification API works

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all dependencies in `package.json`
- Check for TypeScript errors

### 405 Error Still Appears
- Verify route file is deployed
- Check Vercel function logs
- Ensure route file structure is correct

### Notifications Not in Sidebar
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Verify Sidebar.tsx was deployed

---

**Ready? Run the deployment script or manual commands above!** 🚀
