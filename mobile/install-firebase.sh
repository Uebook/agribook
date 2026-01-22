#!/bin/bash

# Firebase Installation Script for React Native
# This script installs Firebase packages and rebuilds the Android app

set -e

echo "🔥 Installing Firebase packages..."

# Navigate to mobile directory
cd "$(dirname "$0")"

# Install Firebase packages
echo "📦 Installing @react-native-firebase/app and @react-native-firebase/messaging..."
npm install @react-native-firebase/app@^21.0.0 @react-native-firebase/messaging@^21.0.0

echo "✅ Packages installed successfully!"
echo ""
echo "🧹 Cleaning Android build..."
cd android
./gradlew clean
cd ..

echo "✅ Clean complete!"
echo ""
echo "📱 Next steps:"
echo "1. Stop Metro bundler if running (Ctrl+C)"
echo "2. Clear cache: npm start -- --reset-cache"
echo "3. In a new terminal, run: npm run android"
echo ""
echo "Or run this complete command:"
echo "  npm start -- --reset-cache & sleep 3 && npm run android"
