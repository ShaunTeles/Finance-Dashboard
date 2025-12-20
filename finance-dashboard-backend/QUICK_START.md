# Quick Start Guide

## 🎯 Setup Checklist

Follow these steps in order:

### 1. Supabase Setup (5-10 minutes)

- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project in Supabase dashboard
- [ ] Copy Project URL, Anon Key, and Service Role Key
- [ ] Go to SQL Editor in Supabase dashboard
- [ ] Copy contents of `supabase/migrations/001_initial_schema.sql`
- [ ] Paste and run in SQL Editor
- [ ] Verify tables are created in Table Editor
- [ ] Configure Authentication → Email provider
- [ ] (Optional) Configure Google OAuth

**📖 Detailed instructions**: See [SETUP_SUPABASE.md](./SETUP_SUPABASE.md)

### 2. Backend Setup (2-3 minutes)

```bash
cd finance-dashboard-backend

# Install dependencies
npm install

# Create .env file (use the setup script or manually)
# Option A: Use setup script
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh

# Option B: Manual setup
cp .env.example .env
# Edit .env with your Supabase credentials

# Generate encryption key (if not using script)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Start development server
npm run dev
```

**Expected output:**
```
Server is running on port 3001
Environment: development
```

### 3. Frontend Setup (2-3 minutes)

```bash
cd finance-dashboard-frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

# Start development server
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

### 4. Verify Setup

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend:**
   - Open http://localhost:3000
   - You should see the login page
   - Try creating an account

3. **Database:**
   - Go to Supabase → Table Editor
   - After signing up, check `auth.users` table for your user
   - Check `user_profiles` table for your profile

## 🐛 Common Issues

### "Missing Supabase environment variables"
- Check that `.env` file exists in backend directory
- Verify all required variables are set
- Restart the server after changing `.env`

### "Failed to fetch" errors in frontend
- Verify `NEXT_PUBLIC_API_URL` points to backend (http://localhost:3001)
- Check backend server is running
- Check CORS settings in backend `.env`

### "Relation does not exist" errors
- Migration not applied - go to Supabase SQL Editor and run migration
- Check table names match exactly (case-sensitive)

### Authentication not working
- Verify Supabase URL and keys are correct
- Check Site URL in Supabase Auth settings
- Ensure redirect URLs are configured

## 📚 Next Steps

Once setup is complete:

1. **Test Authentication:**
   - Sign up a new user
   - Log in
   - Verify session persists

2. **Test API Endpoints:**
   - Use Postman or curl to test backend endpoints
   - Verify authentication middleware works

3. **Add Test Data:**
   - Manually add accounts via Supabase dashboard
   - Or use the CSV import feature

4. **Connect TrueLayer (when ready):**
   - Get TrueLayer API credentials
   - Add to backend `.env`
   - Test OAuth flow

## 🔗 Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Backend API Docs](./README.md)
- [Frontend Docs](../finance-dashboard-frontend/README.md)
- [Detailed Supabase Setup](./SETUP_SUPABASE.md)

