# 🚀 Manual Vercel Deployment Guide

## Quick Deployment Steps

Since the Vercel CLI has SSL certificate issues locally, use the Vercel Dashboard to deploy:

### Option 1: Auto-Deployment (Recommended - Already Working)

Your code is already pushed to GitHub. Vercel will automatically deploy when it detects new commits.

**Check Status:**
1. Go to: https://vercel.com/dashboard
2. Find project: `admin-orcin-omega`
3. Check "Deployments" tab
4. Latest commit: `e0fde7d` should be deploying or deployed

### Option 2: Manual Redeploy from Dashboard

If auto-deployment didn't trigger:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click on your project: `admin-orcin-omega`

2. **Go to Deployments Tab:**
   - Click "Deployments" in the top menu
   - Find the latest deployment

3. **Redeploy:**
   - Click the "..." (three dots) menu on the latest deployment
   - Click "Redeploy"
   - Select "Use existing Build Cache" (optional)
   - Click "Redeploy"

### Option 3: Trigger via GitHub

1. **Go to GitHub:**
   - https://github.com/Uebook/agribook
   - Go to "Actions" tab (if GitHub Actions is set up)
   - Or make a small commit to trigger deployment

### Option 4: Fix Vercel CLI SSL Issue (Advanced)

If you want to fix the CLI locally:

1. **Update Node.js certificates:**
   ```bash
   npm install -g update-ca-certificates
   ```

2. **Or use a different method:**
   ```bash
   cd admin
   vercel --version  # Check if CLI is working
   vercel login      # Re-authenticate
   vercel --prod     # Try deployment again
   ```

## Current Deployment Status

**Latest Commits Pushed:**
- `e0fde7d` - Match category fetching pattern from audio book add page
- `00f7f3d` - Force deployment: Categories fetched from database
- `6890fbe` - Improve category loading state

**What's Being Deployed:**
- ✅ Categories fetched from database (no hardcoded values)
- ✅ Notification system for book uploads/verifications
- ✅ Curriculum detail screen with PDF viewing/download
- ✅ All recent improvements

## Verification

After deployment completes:

1. **Hard refresh browser:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Check Add Book page:** Categories should load from database
3. **Check browser console:** Should see "📚 Fetched categories: X"

## Troubleshooting

**If deployment is stuck:**
- Check Vercel Dashboard → Deployments → Check build logs
- Look for any build errors
- Redeploy if needed

**If categories still not showing:**
- Clear browser cache completely
- Check browser console for errors
- Verify categories exist in database (go to Categories page in admin panel)
