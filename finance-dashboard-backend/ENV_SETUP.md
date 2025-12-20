# Environment Variables Setup Guide

## 📝 Where to Add Your Supabase Credentials

You need to add your Supabase values to **TWO** different `.env` files:

### 1. Backend `.env` File
**Location:** `finance-dashboard-backend/.env`

**Values to add:**
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these in Supabase:**
- Go to your Supabase project → **Settings** → **API**
- **SUPABASE_URL**: "Project URL" section
- **SUPABASE_ANON_KEY**: "Project API keys" → "anon public"
- **SUPABASE_SERVICE_ROLE_KEY**: "Project API keys" → "service_role" ⚠️ (Keep secret!)

### 2. Frontend `.env.local` File
**Location:** `finance-dashboard-frontend/.env.local`

**Values to add:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note:** Frontend only needs the anon key (not the service role key for security)

---

## 🔐 Additional Setup Required

### Backend `.env` - Generate Encryption Key

You also need to generate an encryption key for the backend:

```bash
cd finance-dashboard-backend
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (64 hex characters) and add it to:
```env
ENCRYPTION_KEY=your_generated_64_character_hex_string_here
```

---

## ✅ Quick Setup Steps

1. **Backend Setup:**
   ```bash
   cd finance-dashboard-backend
   # Edit .env file and add your Supabase values
   # Generate and add ENCRYPTION_KEY
   ```

2. **Frontend Setup:**
   ```bash
   cd finance-dashboard-frontend
   # Edit .env.local file and add your Supabase values
   ```

3. **Verify:**
   - Backend `.env` has: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, ENCRYPTION_KEY
   - Frontend `.env.local` has: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

---

## 📋 Complete Example

### Backend `.env` (finance-dashboard-backend/.env)
```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.example
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend `.env.local` (finance-dashboard-frontend/.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## ⚠️ Important Notes

1. **Never commit `.env` or `.env.local` files to git** (they're in `.gitignore`)
2. **Service Role Key is secret** - only use in backend, never expose to frontend
3. **Restart servers** after changing environment variables
4. **Frontend variables** must start with `NEXT_PUBLIC_` to be accessible in the browser

