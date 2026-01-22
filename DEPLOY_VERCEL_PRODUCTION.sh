#!/bin/bash

# Deploy to Vercel Production
# This script deploys the admin panel to Vercel production

set -e

echo "🚀 Deploying to Vercel Production..."
echo ""

# Navigate to admin directory
cd /Users/vansh/ReactProject/Agribook/admin

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "📋 Checking Vercel login status..."
vercel whoami || vercel login

# Deploy to production
echo ""
echo "🚀 Deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Check your deployment at: https://vercel.com/dashboard"
