# Fix: Unable to Resolve @react-native-firebase/messaging

## Error
```
Unable to resolve module @react-native-firebase/messaging
```

## Solution

### Step 1: Install Dependencies

```bash
cd mobile
npm install
```

### Step 2: Clean and Rebuild Android

React Native Firebase requires native code linking. After installing, you need to rebuild:

```bash
# Clean Metro bundler cache
npm start -- --reset-cache

# In a new terminal, clean Android build
cd android
./gradlew clean
cd ..

# Rebuild the app
npm run android
```

### Step 3: If Still Not Working

If the error persists, try:

```bash
# 1. Clear all caches
rm -rf node_modules
rm -rf android/app/build
rm -rf android/build
rm -rf android/.gradle

# 2. Reinstall
npm install

# 3. Clean Android
cd android
./gradlew clean
cd ..

# 4. Rebuild
npm run android
```

### Step 4: Verify Installation

Check if packages are installed:

```bash
cd mobile
ls node_modules | grep firebase
```

You should see:
- `@react-native-firebase`
- `@react-native-firebase/app`
- `@react-native-firebase/messaging`

## Alternative: Manual Installation

If npm install fails, try:

```bash
cd mobile
npm install @react-native-firebase/app@^21.0.0
npm install @react-native-firebase/messaging@^21.0.0
```

Then rebuild:
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

## Common Issues

### Issue: "EPERM: operation not permitted"

**Solution**: Run with proper permissions or use `sudo` (not recommended):
```bash
sudo npm install
```

Better solution: Fix npm permissions:
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /opt/homebrew/Cellar/node@22
```

### Issue: "Module not found" after install

**Solution**: 
1. Stop Metro bundler (Ctrl+C)
2. Clear cache: `npm start -- --reset-cache`
3. Rebuild: `npm run android`

### Issue: Build fails with Gradle errors

**Solution**: 
1. Check `google-services.json` is in `android/app/`
2. Verify `android/build.gradle` has Google Services plugin
3. Verify `android/app/build.gradle` has Firebase dependencies

## Quick Fix Command

Run this complete fix:

```bash
cd mobile && \
rm -rf node_modules && \
npm install && \
cd android && \
./gradlew clean && \
cd .. && \
npm start -- --reset-cache
```

Then in a new terminal:
```bash
cd mobile
npm run android
```
