#!/bin/bash
# Clean React Native cache and build files

echo "🧹 Cleaning React Native cache..."

# Stop Metro bundler if running
pkill -f "react-native start" || true
pkill -f "metro" || true

# Clean Metro cache
echo "Cleaning Metro cache..."
rm -rf /tmp/metro-* /tmp/haste-* 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .metro 2>/dev/null || true

# Clean Watchman
echo "Cleaning Watchman..."
watchman watch-del-all 2>/dev/null || echo "Watchman not available"

# Clean Android build (if accessible)
echo "Cleaning Android build..."
cd android 2>/dev/null && ./gradlew clean 2>/dev/null || echo "Android clean skipped (permission issues)"
cd .. 2>/dev/null || true

echo "✅ Cache cleaned!"
echo ""
echo "📱 Next steps:"
echo "1. Restart Metro bundler: npx react-native start --reset-cache"
echo "2. Rebuild the app on your device/emulator"
echo "3. Or press 'r' in Metro bundler to reload"
