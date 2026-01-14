# 🚀 Deploy to Vercel - Complete Guide

Quick guide to deploy the admin panel to Vercel with all features including Firebase push notifications.

## Prerequisites

- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Git repository connected
- ✅ Firebase project created
- ✅ Supabase project set up

## Quick Deploy

### Option 1: Via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Import your Git repository
   - Select the `admin` folder as root directory

2. **Configure Project**
   - Framework Preset: **Next.js**
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - See `VERCEL_ENV_SETUP.md` for detailed instructions
   - Add all 5 required variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_APP_URL`
     - `FIREBASE_SERVICE_ACCOUNT_KEY` (see `VERCEL_FIREBASE_SETUP.md`)

4. **Deploy**
   - Click **Deploy**
   - Wait for build to complete

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Navigate to admin directory
cd admin

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Environment Variables Setup

### Required Variables

1. **Supabase Variables** (See `VERCEL_ENV_SETUP.md`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **App URL**
   - `NEXT_PUBLIC_APP_URL` = `https://your-project.vercel.app`

3. **Firebase** (See `VERCEL_FIREBASE_SETUP.md`)
   - `FIREBASE_SERVICE_ACCOUNT_KEY` = Single-line JSON from Firebase service account

### Adding Variables via Dashboard

1. Go to: **Settings** → **Environment Variables**
2. Add each variable:
   - Name: `VARIABLE_NAME`
   - Value: `your-value`
   - Environment: ✅ Production, ✅ Preview, ✅ Development
3. Click **Save**
4. **Redeploy** after adding variables

### Adding Variables via CLI

```bash
# Add environment variable
vercel env add VARIABLE_NAME production

# List all variables
vercel env ls

# Pull variables to local .env
vercel env pull .env.local
```

## Post-Deployment Checklist

### 1. Verify Environment Variables

```bash
# Test API endpoint
curl https://your-project.vercel.app/api/upload
```

### 2. Test Firebase Push Notifications

```bash
curl -X POST https://your-project.vercel.app/api/notifications/push \
  -H "Content-Type: application/json" \
  -d '{
    "role": "reader",
    "title": "Test",
    "body": "Testing push notifications"
  }'
```

### 3. Test Admin Panel

- Login: `https://your-project.vercel.app/login`
- Dashboard: `https://your-project.vercel.app/dashboard`
- Notifications: `https://your-project.vercel.app/notifications`

### 4. Update Mobile App API URL

Update `mobile/src/services/api.js`:

```javascript
const API_BASE_URL = 'https://your-project.vercel.app';
```

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Make sure dependencies are installed
cd admin
npm install
```

**Error: TypeScript errors**
```bash
# Check tsconfig.json
# Ensure all types are installed
npm install --save-dev @types/node @types/react
```

### Environment Variables Not Working

1. ✅ Verify variables are set in Vercel Dashboard
2. ✅ Check variable names are exact (case-sensitive)
3. ✅ Ensure variables are set for Production environment
4. ✅ Redeploy after adding variables

### Firebase Not Working

1. ✅ Check `FIREBASE_SERVICE_ACCOUNT_KEY` is valid JSON (single line)
2. ✅ Verify Firebase Admin SDK is installed: `npm install firebase-admin`
3. ✅ Check deployment logs for errors
4. ✅ See `VERCEL_FIREBASE_SETUP.md` for detailed troubleshooting

## Continuous Deployment

Vercel automatically deploys on:
- Push to main/master branch → Production
- Push to other branches → Preview
- Pull requests → Preview

## Custom Domain

1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Monitoring

- **Deployments**: https://vercel.com/dashboard → Your Project → Deployments
- **Logs**: Click on any deployment → View Function Logs
- **Analytics**: Settings → Analytics

## Quick Reference

| Resource | Link |
|----------|------|
| Vercel Dashboard | https://vercel.com/dashboard |
| Environment Variables Setup | `VERCEL_ENV_SETUP.md` |
| Firebase Setup | `VERCEL_FIREBASE_SETUP.md` |
| API Documentation | `API_INTEGRATION_GUIDE.md` |

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs

---

**Ready to deploy?** Follow the steps above and you'll be live in minutes! 🎉
