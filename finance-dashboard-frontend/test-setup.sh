#!/bin/bash

# Test script for frontend setup
# This verifies the environment is ready

set -e

echo "🧪 Testing Frontend Setup"
echo "========================"
echo ""

ERRORS=0

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in frontend directory (package.json not found)"
    exit 1
fi

echo "✅ In correct directory"

# Check for .env.local file
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ .env.local file exists"
    
    # Check for required variables
    source .env.local 2>/dev/null || true
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ "$NEXT_PUBLIC_SUPABASE_URL" = "your_supabase_project_url_here" ]; then
        echo "⚠️  NEXT_PUBLIC_SUPABASE_URL not set or still has placeholder"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" = "your_supabase_anon_key_here" ]; then
        echo "⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY not set or still has placeholder"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
    fi
    
    if [ -z "$NEXT_PUBLIC_API_URL" ]; then
        echo "⚠️  NEXT_PUBLIC_API_URL not set"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ NEXT_PUBLIC_API_URL is set: $NEXT_PUBLIC_API_URL"
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

# Try to build Next.js (if dependencies installed)
if [ -d "node_modules" ]; then
    echo ""
    echo "🔨 Testing Next.js build..."
    if npm run build 2>&1 | tail -5 | grep -q "error\|Error\|failed"; then
        echo "⚠️  Build errors found (check output above)"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ Next.js build check passed"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo "✅ Frontend setup looks good!"
    echo ""
    echo "To start the development server:"
    echo "  npm run dev"
else
    echo "⚠️  Found $ERRORS issue(s) that need to be fixed"
    echo ""
    echo "Next steps:"
    echo "  1. Ensure .env.local file has all required values"
    echo "  2. Run: npm install"
fi
echo ""

