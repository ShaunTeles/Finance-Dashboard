#!/bin/bash

# Setup script for environment variables
# This script helps generate the .env file for the backend

echo "🚀 Finance Dashboard Backend - Environment Setup"
echo "================================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

echo "Please provide the following information:"
echo ""

# Get Supabase URL
read -p "Supabase Project URL: " SUPABASE_URL
if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Supabase URL is required!"
    exit 1
fi

# Get Supabase Anon Key
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Supabase Anon Key is required!"
    exit 1
fi

# Get Supabase Service Role Key
read -p "Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Supabase Service Role Key is required!"
    exit 1
fi

# Generate encryption key
echo ""
echo "🔐 Generating encryption key..."
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null)

if [ -z "$ENCRYPTION_KEY" ]; then
    echo "⚠️  Could not generate encryption key automatically."
    read -p "Please enter a 64-character hex string (or press Enter to skip): " ENCRYPTION_KEY
fi

# Get optional values
read -p "Port (default: 3001): " PORT
PORT=${PORT:-3001}

read -p "CORS Origin (default: http://localhost:3000): " CORS_ORIGIN
CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:3000}

read -p "Node Environment (default: development): " NODE_ENV
NODE_ENV=${NODE_ENV:-development}

# Create .env file
cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Server Configuration
PORT=$PORT
NODE_ENV=$NODE_ENV

# CORS Configuration
CORS_ORIGIN=$CORS_ORIGIN

# Encryption Key for API Credentials (32 character hex string)
ENCRYPTION_KEY=$ENCRYPTION_KEY

# TrueLayer API Configuration (when ready)
TRUELAYER_CLIENT_ID=
TRUELAYER_CLIENT_SECRET=
TRUELAYER_REDIRECT_URI=http://localhost:3001/api/integrations/truelayer/callback

# JWT Secret (for additional token validation if needed)
JWT_SECRET=

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Review the .env file and update any additional values"
echo "   2. Make sure your Supabase migration has been applied"
echo "   3. Run 'npm install' to install dependencies"
echo "   4. Run 'npm run dev' to start the development server"
echo ""

