# 🚀 Vercel Production Deployment Commands

## Quick Deploy Commands

### Option 1: Deploy from Admin Directory (Recommended)

```bash
cd /Users/vansh/ReactProject/Agribook/admin
vercel --prod
```

### Option 2: Use the Deployment Script

```bash
cd /Users/vansh/ReactProject/Agribook
./DEPLOY_VERCEL_PRODUCTION.sh
```

### Option 3: Deploy with Specific Options

```bash
cd /Users/vansh/ReactProject/Agribook/admin
vercel --prod --yes
```

## First Time Setup

If you haven't deployed before:

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link to Project (if needed)
```bash
cd /Users/vansh/ReactProject/Agribook/admin
vercel link
```

### 4. Deploy to Production
```bash
vercel --prod
```

## Common Commands

### Deploy to Production
```bash
vercel --prod
```

### Deploy to Preview
```bash
vercel
```

### View Deployments
```bash
vercel ls
```

### View Project Info
```bash
vercel inspect
```

### Remove Deployment
```bash
vercel remove
```

## Environment Variables

Make sure environment variables are set in Vercel Dashboard:
- Go to: https://vercel.com/dashboard
- Select your project
- Settings → Environment Variables
- Add all required variables (see `VERCEL_ENV_SETUP.md`)

## After Deployment

1. **Get deployment URL** from Vercel CLI output
2. **Test the deployment**:
   - Dashboard: `https://your-project.vercel.app/dashboard`
   - API: `https://your-project.vercel.app/api/dashboard`
3. **Check build logs** in Vercel Dashboard

## Troubleshooting

### Issue: "Not logged in"
```bash
vercel login
```

### Issue: "Project not found"
```bash
vercel link
```

### Issue: "Build failed"
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript/ESLint errors

### Issue: "Environment variables missing"
- Go to Vercel Dashboard → Settings → Environment Variables
- Add all required variables
- Redeploy

---

**Quick Deploy: `cd admin && vercel --prod`** 🚀
