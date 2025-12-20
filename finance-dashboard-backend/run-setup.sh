#!/bin/bash

# Complete setup script for Finance Dashboard Backend
# Run this in your terminal: ./run-setup.sh

set -e  # Exit on error

echo "🚀 Finance Dashboard Backend - Complete Setup"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the finance-dashboard-backend directory"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo ""
    echo "Please install Node.js:"
    echo "  - Visit: https://nodejs.org/"
    echo "  - Or use Homebrew: brew install node"
    echo ""
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed or not in PATH"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm install
echo ""

# Step 2: Generate encryption key
echo "🔐 Step 2: Generating encryption key..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo ""
echo "✅ Encryption Key Generated:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$ENCRYPTION_KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Encryption Key for API Credentials
ENCRYPTION_KEY=$ENCRYPTION_KEY

# TrueLayer API Configuration (when ready)
TRUELAYER_CLIENT_ID=
TRUELAYER_CLIENT_SECRET=
TRUELAYER_REDIRECT_URI=http://localhost:3001/api/integrations/truelayer/callback

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
EOF
    echo "✅ .env file created with encryption key!"
else
    echo "📝 .env file already exists"
    echo ""
    echo "⚠️  IMPORTANT: Add this encryption key to your .env file:"
    echo "   ENCRYPTION_KEY=$ENCRYPTION_KEY"
    echo ""
    echo "You can do this manually or run:"
    echo "   sed -i '' 's/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/' .env"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Edit .env file and add your Supabase credentials:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "2. Apply database migration in Supabase dashboard"
echo "   (See SETUP_SUPABASE.md for instructions)"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. The server will run on http://localhost:3001"
echo ""

