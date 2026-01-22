# 🔍 Vercel Deployment Troubleshooting

## Issue: Latest Code Not Showing on Vercel

### Step 1: Verify Code Was Pushed
```bash
cd /Users/vansh/ReactProject/Agribook
git log --oneline -5
```

You should see:
- `4f2918f` - Change grey colors to black in dashboard
- `ddff2f0` - Fix: Remove non-existent columns
- `39ae7cc` - Fix: Use select(*) instead of specific columns

### Step 2: Check Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (admin panel)
3. **Check Deployments tab**:
   - Look for the latest deployment
   - Check if it shows the latest commit hash (`4f2918f`)
   - Check build status (should be "Ready" or "Building")

### Step 3: Check Build Logs

1. Click on the latest deployment
2. Check **Build Logs**:
   - Look for errors
   - Check if build completed successfully
   - Verify files were built correctly

### Step 4: Verify Vercel Project Settings

1. Go to **Project Settings** → **General**
2. Check **Root Directory**:
   - Should be set to `admin` (if your Next.js app is in admin folder)
   - OR should be empty if Vercel is at repo root

3. Check **Build Command**:
   - Should be: `npm run build` (or `cd admin && npm run build` if root is repo)

4. Check **Output Directory**:
   - Should be: `.next` (default for Next.js)

### Step 5: Common Issues & Fixes

#### Issue 1: Wrong Root Directory
**Problem**: Vercel is building from wrong directory

**Fix**:
1. Vercel Dashboard → Settings → General
2. Set **Root Directory** to `admin`
3. Redeploy

#### Issue 2: Build Failing
**Problem**: Build errors preventing deployment

**Fix**:
1. Check build logs for errors
2. Fix TypeScript/ESLint errors
3. Ensure all dependencies are in `package.json`

#### Issue 3: Cache Issues
**Problem**: Old code cached

**Fix**:
1. Vercel Dashboard → Deployments
2. Click "..." on latest deployment
3. Click **Redeploy**
4. Or clear cache: Settings → General → Clear Build Cache

#### Issue 4: Environment Variables Missing
**Problem**: Build fails due to missing env vars

**Fix**:
1. Vercel Dashboard → Settings → Environment Variables
2. Ensure all required variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - Firebase Admin credentials (if using)

### Step 6: Force Redeploy

If changes still not showing:

```bash
# Make a small change to trigger redeploy
cd /Users/vansh/ReactProject/Agribook/admin
echo "// Deploy trigger $(date)" >> app/dashboard/page.tsx

git add admin/app/dashboard/page.tsx
git commit -m "Trigger redeploy"
git push origin main
```

Or use Vercel Dashboard:
1. Go to Deployments
2. Click "..." on latest deployment
3. Click **Redeploy**

### Step 7: Verify Files Are Deployed

Check if files exist in deployment:
1. Vercel Dashboard → Deployments → Latest
2. Click **View Function Logs**
3. Or check **Source** tab to see deployed files

### Step 8: Check Browser Cache

Sometimes browser caches old code:
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try incognito/private window

## Quick Checklist

- [ ] Code pushed to GitHub (verified with `git log`)
- [ ] Vercel deployment shows latest commit
- [ ] Build completed successfully (no errors)
- [ ] Root directory set correctly in Vercel
- [ ] Environment variables configured
- [ ] Browser cache cleared
- [ ] Tried hard refresh

## Still Not Working?

1. **Check Vercel Function Logs**:
   - Go to Functions tab
   - Check `/api/dashboard` logs
   - Look for errors

2. **Test API Directly**:
   ```bash
   curl https://admin-orcin-omega.vercel.app/api/dashboard
   ```
   Check if response has latest data

3. **Compare Local vs Production**:
   - Test locally: `npm run dev`
   - Compare with production
   - Check if same code behaves differently

---

**Most common issue: Wrong root directory or build cache. Check Vercel settings first!** 🔧
