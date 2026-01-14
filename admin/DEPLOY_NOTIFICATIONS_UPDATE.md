# 🚀 Deploy Notification Updates to Vercel

This guide helps you deploy the enhanced notification system with image, description, and user selection features.

## ✅ What's New

1. **Enhanced Notifications Page** (`/notifications`)
   - Image URL support with preview
   - Description field for detailed content
   - Multi-user selection with search
   - Notification type selector (Offer, Announcement, etc.)

2. **New API Endpoint**
   - `/api/users/all` - Get all users for selection

3. **Updated Push Notification API**
   - Supports image URLs in notifications
   - Includes description in in-app notifications

4. **Database Migration**
   - Adds `description` and `image_url` columns to notifications table

## 📋 Pre-Deployment Checklist

### 1. Database Migration (Required)

**Run this SQL in Supabase SQL Editor:**

```sql
-- File: admin/database/add_notification_fields.sql

-- Add description column
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add image_url column
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

**Steps:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the SQL above
3. Click "Run"
4. Verify columns were added

### 2. Verify Code Changes

Make sure these files are committed:
- ✅ `admin/app/notifications/page.tsx` (enhanced)
- ✅ `admin/app/api/users/all/route.ts` (new)
- ✅ `admin/app/api/notifications/push/route.ts` (updated)
- ✅ `admin/lib/firebase/admin.ts` (updated for images)
- ✅ `admin/database/add_notification_fields.sql` (migration)

## 🚀 Deployment Steps

### Option 1: Automatic Deployment (Git Push)

If your Vercel project is connected to Git:

```bash
# Navigate to project root
cd /Users/vansh/ReactProject/Agribook

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Add enhanced notification system with image, description, and user selection"

# Push to trigger deployment
git push
```

Vercel will automatically:
1. Detect the push
2. Build the project
3. Deploy to production

### Option 2: Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Navigate to admin directory
cd /Users/vansh/ReactProject/Agribook/admin

# Login (if not already)
vercel login

# Deploy to production
vercel --prod
```

### Option 3: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **admin-orcin-omega**
3. Go to **Deployments** tab
4. Click **Redeploy** on the latest deployment
5. Or push to your connected Git repository

## ✅ Post-Deployment Verification

### 1. Test New API Endpoint

```bash
curl https://admin-orcin-omega.vercel.app/api/users/all?limit=10
```

**Expected:** JSON response with users array

### 2. Test Notifications Page

1. Go to: `https://admin-orcin-omega.vercel.app/notifications`
2. Verify you can see:
   - Notification type selector
   - Image URL field
   - Description field
   - User selection option

### 3. Test Sending Notification

1. Fill in the form:
   - Select notification type: "Offer / Promotion"
   - Choose "Select Users"
   - Select some users
   - Add title: "Test Offer"
   - Add message: "50% off on all books!"
   - Add description: "This is a detailed description"
   - Add image URL: `https://example.com/offer.jpg`
2. Click "Send Notification"
3. Verify success message appears

### 4. Check Database

Verify notifications were created with new fields:

```sql
SELECT id, title, message, description, image_url, created_at 
FROM notifications 
ORDER BY created_at DESC 
LIMIT 5;
```

## 🔧 Troubleshooting

### Issue: "Column does not exist" error

**Solution:** Run the database migration SQL in Supabase

### Issue: Users not loading in selection

**Solution:** 
1. Check `/api/users/all` endpoint is accessible
2. Verify API returns users
3. Check browser console for errors

### Issue: Image not showing in notification

**Solution:**
1. Verify image URL is publicly accessible
2. Check image URL format is correct (http:// or https://)
3. Verify Firebase Admin is configured correctly

### Issue: Deployment fails

**Solution:**
1. Check Vercel build logs
2. Verify all dependencies are in `package.json`
3. Check for TypeScript/ESLint errors
4. Ensure environment variables are set

## 📝 Environment Variables

Make sure these are set in Vercel:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_APP_URL`
- ✅ `FIREBASE_SERVICE_ACCOUNT_KEY`

## 🎯 Quick Deploy Command

```bash
cd /Users/vansh/ReactProject/Agribook && \
git add . && \
git commit -m "Deploy enhanced notifications" && \
git push
```

## 📚 Related Files

- Migration: `admin/database/add_notification_fields.sql`
- API: `admin/app/api/users/all/route.ts`
- UI: `admin/app/notifications/page.tsx`
- Firebase: `admin/lib/firebase/admin.ts`

---

**After deployment, test the notification system and verify all features work correctly!** 🎉
