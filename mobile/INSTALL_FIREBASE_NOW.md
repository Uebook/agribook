# 🚨 URGENT: Install Firebase Packages

## Current Status
❌ Firebase packages are **NOT installed** in `node_modules`
❌ This is why you're seeing the error: "Unable to resolve module @react-native-firebase/messaging"

## ✅ Solution: Install Packages Now

### Step 1: Open Terminal

Open your terminal and navigate to the mobile directory:

```bash
cd /Users/vansh/ReactProject/Agribook/mobile
```

### Step 2: Install Firebase Packages

Run this command:

```bash
npm install @react-native-firebase/app@^21.0.0 @react-native-firebase/messaging@^21.0.0
```

**If you get permission errors**, try:

```bash
# Fix npm permissions first
sudo chown -R $(whoami) ~/.npm

# Then install
npm install @react-native-firebase/app@^21.0.0 @react-native-firebase/messaging@^21.0.0
```

**Or install all packages:**

```bash
npm install
```

### Step 3: Verify Installation

Check if packages are installed:

```bash
ls node_modules/@react-native-firebase/
```

You should see:
- `app/`
- `messaging/`

### Step 4: Stop Metro Bundler

If Metro bundler is running, stop it:
- Press `Ctrl+C` in the terminal where Metro is running

### Step 5: Clear Cache and Rebuild

```bash
# Clear Metro cache and restart
npm start -- --reset-cache
```

**In a NEW terminal window**, run:

```bash
cd /Users/vansh/ReactProject/Agribook/mobile
npm run android
```

## Alternative: Complete Clean Install

If the above doesn't work, do a complete clean:

```bash
cd /Users/vansh/ReactProject/Agribook/mobile

# Remove node_modules
rm -rf node_modules

# Remove package-lock.json (optional, but helps)
rm -f package-lock.json

# Reinstall everything
npm install

# Clean Android build
cd android
./gradlew clean
cd ..

# Clear Metro cache
npm start -- --reset-cache
```

Then in a new terminal:
```bash
cd /Users/vansh/ReactProject/Agribook/mobile
npm run android
```

## Quick One-Liner

If you want to do everything at once:

```bash
cd /Users/vansh/ReactProject/Agribook/mobile && \
npm install @react-native-firebase/app@^21.0.0 @react-native-firebase/messaging@^21.0.0 && \
cd android && ./gradlew clean && cd .. && \
echo "✅ Installation complete! Now run: npm start -- --reset-cache"
```

## After Installation

Once packages are installed:

1. ✅ Stop Metro bundler (Ctrl+C)
2. ✅ Run: `npm start -- --reset-cache`
3. ✅ In new terminal: `npm run android`

The error should be gone! 🎉

## Still Having Issues?

If npm install keeps failing:

1. **Check Node version**: `node --version` (should be >= 20)
2. **Check npm version**: `npm --version`
3. **Try with yarn**: `yarn add @react-native-firebase/app @react-native-firebase/messaging`
4. **Check internet connection**
5. **Try clearing npm cache**: `npm cache clean --force`
