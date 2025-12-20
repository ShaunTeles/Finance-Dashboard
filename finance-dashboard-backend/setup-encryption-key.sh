#!/bin/bash

# Script to generate encryption key for the backend .env file

echo "🔐 Generating Encryption Key for Backend"
echo "========================================"
echo ""

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the backend directory?"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Generate encryption key
echo "🔑 Generating 32-byte encryption key..."
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo ""
echo "✅ Encryption Key Generated:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$ENCRYPTION_KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next Steps:"
echo "1. Copy the encryption key above"
echo "2. Open the .env file in this directory"
echo "3. Replace 'your_32_character_hex_encryption_key_here' with the key above"
echo ""
echo "Example:"
echo "   ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""

