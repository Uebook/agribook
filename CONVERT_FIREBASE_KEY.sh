#!/bin/bash

# Convert Firebase Service Account JSON to Single-Line String for Vercel
# Usage: ./CONVERT_FIREBASE_KEY.sh path/to/your-firebase-key.json

if [ -z "$1" ]; then
    echo "❌ Error: Please provide the path to your Firebase service account JSON file"
    echo ""
    echo "Usage:"
    echo "  ./CONVERT_FIREBASE_KEY.sh path/to/your-firebase-key.json"
    echo ""
    echo "Example:"
    echo "  ./CONVERT_FIREBASE_KEY.sh ~/Downloads/agriebook-1a0bc-firebase-adminsdk-xxxxx.json"
    exit 1
fi

FILE_PATH="$1"

if [ ! -f "$FILE_PATH" ]; then
    echo "❌ Error: File not found: $FILE_PATH"
    exit 1
fi

echo "📄 Converting Firebase service account key to single-line string..."
echo ""

# Try using jq first (cleaner output)
if command -v jq &> /dev/null; then
    echo "✅ Using jq to convert..."
    SINGLE_LINE=$(cat "$FILE_PATH" | jq -c .)
    echo ""
    echo "📋 Copy this entire line and paste it into Vercel as FIREBASE_SERVICE_ACCOUNT_KEY:"
    echo ""
    echo "$SINGLE_LINE"
    echo ""
    echo "✅ Done! Copy the line above."
# Fallback to Python
elif command -v python3 &> /dev/null; then
    echo "✅ Using Python to convert..."
    SINGLE_LINE=$(python3 -c "import json; print(json.dumps(json.load(open('$FILE_PATH'))))")
    echo ""
    echo "📋 Copy this entire line and paste it into Vercel as FIREBASE_SERVICE_ACCOUNT_KEY:"
    echo ""
    echo "$SINGLE_LINE"
    echo ""
    echo "✅ Done! Copy the line above."
else
    echo "❌ Error: Neither jq nor python3 is installed"
    echo ""
    echo "Install one of them:"
    echo "  Mac: brew install jq"
    echo "  Or use Python (usually pre-installed)"
    exit 1
fi
