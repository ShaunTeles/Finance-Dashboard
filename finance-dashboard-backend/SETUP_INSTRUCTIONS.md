# Quick Setup Instructions

## ⚡ Quick Commands to Run

Since Node.js/npm may not be in your current shell PATH, run these commands **in your terminal** (not in this tool):

### Step 1: Navigate to Backend Directory

```bash
cd "/Users/shaun/Dropbox/My Mac (Shaun's MacBook Pro)/Desktop/Local-Repo/REPOs/finance-dashboard-backend"
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Generate Encryption Key

**Option A: Use the setup script (Recommended)**
```bash
./setup-encryption-key.sh
```

**Option B: Generate manually**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (64 hex characters) and add it to your `.env` file.

### Step 4: Update .env File

Open `finance-dashboard-backend/.env` and replace:

1. **SUPABASE_URL** - Your Supabase project URL
2. **SUPABASE_ANON_KEY** - Your Supabase anon key  
3. **SUPABASE_SERVICE_ROLE_KEY** - Your Supabase service role key
4. **ENCRYPTION_KEY** - The generated key from Step 3

---

## 📋 Complete Setup Checklist

- [ ] Run `npm install` in backend directory
- [ ] Generate encryption key
- [ ] Update backend `.env` with Supabase credentials + encryption key
- [ ] Update frontend `.env.local` with Supabase credentials
- [ ] Apply database migration in Supabase dashboard
- [ ] Test backend: `npm run dev` (should start on port 3001)
- [ ] Test frontend: `npm run dev` (should start on port 3000)

---

## 🔍 Troubleshooting

**If `npm` command not found:**
- Make sure Node.js is installed: https://nodejs.org/
- Check installation: `node --version` and `npm --version`
- You may need to restart your terminal after installing Node.js

**If you get permission errors:**
- Make script executable: `chmod +x setup-encryption-key.sh`

**If dependencies fail to install:**
- Check your internet connection
- Try: `npm install --legacy-peer-deps`
- Or: `npm install --force`

