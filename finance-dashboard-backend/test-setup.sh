#!/bin/bash

# Test script for backend setup
# This verifies the environment is ready

set -e

echo "🧪 Testing Backend Setup"
echo "========================"
echo ""

ERRORS=0

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in backend directory (package.json not found)"
    exit 1
fi

echo "✅ In correct directory"

# Check for .env file
if [ ! -f ".env" ]; then
    echo "❌ .env file not found"
    echo "   Create it from .env.example or run setup script"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ .env file exists"
    
    # Check for required variables
    source .env 2>/dev/null || true
    
    if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" = "your_supabase_project_url_here" ]; then
        echo "⚠️  SUPABASE_URL not set or still has placeholder"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ SUPABASE_URL is set"
    fi
    
    if [ -z "$SUPABASE_ANON_KEY" ] || [ "$SUPABASE_ANON_KEY" = "your_supabase_anon_key_here" ]; then
        echo "⚠️  SUPABASE_ANON_KEY not set or still has placeholder"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ SUPABASE_ANON_KEY is set"
    fi
    
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ "$SUPABASE_SERVICE_ROLE_KEY" = "your_supabase_service_role_key_here" ]; then
        echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not set or still has placeholder"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ SUPABASE_SERVICE_ROLE_KEY is set"
    fi
    
    if [ -z "$ENCRYPTION_KEY" ] || [ "$ENCRYPTION_KEY" = "your_32_character_hex_encryption_key_here" ]; then
        echo "⚠️  ENCRYPTION_KEY not set or still has placeholder"
        ERRORS=$((ERRORS + 1))
    else
        if [ ${#ENCRYPTION_KEY} -eq 64 ]; then
            echo "✅ ENCRYPTION_KEY is set (64 characters)"
        else
            echo "⚠️  ENCRYPTION_KEY should be 64 hex characters (currently ${#ENCRYPTION_KEY})"
            ERRORS=$((ERRORS + 1))
        fi
    fi
fi

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found - run 'npm install'"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ Dependencies installed"
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found in PATH"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ Node.js version: $(node --version)"
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found in PATH"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ npm version: $(npm --version)"
fi

# Try to build TypeScript (if dependencies installed)
if [ -d "node_modules" ]; then
    echo ""
    echo "🔨 Testing TypeScript compilation..."
    if npm run type-check 2>&1 | grep -q "error"; then
        echo "⚠️  TypeScript errors found (check output above)"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ TypeScript compilation successful"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo "✅ Backend setup looks good!"
    echo ""
    echo "To start the server:"
    echo "  npm run dev"
else
    echo "⚠️  Found $ERRORS issue(s) that need to be fixed"
    echo ""
    echo "Next steps:"
    echo "  1. Ensure .env file has all required values"
    echo "  2. Run: npm install"
    echo "  3. Generate encryption key if needed"
fi
echo ""

