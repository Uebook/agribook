#!/bin/bash

# Deploy to Vercel - Complete Script
# Run this script to deploy all Firebase and notification changes

set -e

echo "🚀 Starting Vercel Deployment..."
echo ""

cd /Users/vansh/ReactProject/Agribook

# Step 1: Add all admin panel changes
echo "📦 Staging admin panel files..."
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

# Step 2: Add documentation
echo "📚 Staging documentation..."
git add FIREBASE_SETUP.md
git add FIREBASE_IMPLEMENTATION_SUMMARY.md
git add DEPLOY_CHECKLIST.md
git add FIX_405_ERROR.md
git add FIX_NOTIFICATIONS_AND_FCM.md
git add admin/DEPLOY_TO_VERCEL.md
git add admin/VERCEL_FIREBASE_SETUP.md
git add admin/DEPLOY_NOTIFICATIONS_UPDATE.md
git add admin/TEST_FCM_TOKEN.md

# Step 3: Check status
echo ""
echo "📋 Files to be committed:"
git status --short

# Step 4: Commit
echo ""
echo "💾 Committing changes..."
git commit -m "Deploy: Firebase notifications system with enhanced admin panel

- Add FCM token registration API with CORS support
- Add user selection API for notifications
- Add push notification API with image and description support
- Add notifications page with image, description, and user selection
- Add notifications link to sidebar
- Add Firebase Admin SDK integration
- Update notification utilities to send Firebase push notifications
- Fix local API URL for notifications page
- Add comprehensive documentation and setup guides"

# Step 5: Push to trigger Vercel deployment
echo ""
echo "🚀 Pushing to repository (triggers Vercel deployment)..."
git push

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "📋 Next steps:"
echo "1. Check Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Wait for build to complete"
echo "3. Run database migrations in Supabase:"
echo "   - admin/database/add_fcm_token.sql"
echo "   - admin/database/add_notification_fields.sql"
echo "4. Test the endpoints:"
echo "   - https://admin-orcin-omega.vercel.app/notifications"
echo "   - https://admin-orcin-omega.vercel.app/api/users/fcm-token"
echo ""
echo "🎉 Deployment complete!"
