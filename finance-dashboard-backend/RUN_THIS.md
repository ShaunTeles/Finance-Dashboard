# 🚀 Run Setup Commands

Since Node.js/npm is not available in this automated environment, please run these commands **in your own terminal**.

## Quick Setup (Recommended)

I've created a setup script that does everything automatically:

```bash
cd "/Users/shaun/Dropbox/My Mac (Shaun's MacBook Pro)/Desktop/Local-Repo/REPOs/finance-dashboard-backend"
chmod +x run-setup.sh
./run-setup.sh
```

This script will:
- ✅ Check for Node.js/npm
- ✅ Install all dependencies
- ✅ Generate encryption key
- ✅ Create/update .env file with encryption key
- ✅ Show next steps

---

## Manual Setup (Alternative)

If you prefer to run commands manually:

```bash
# 1. Navigate to backend directory
cd "/Users/shaun/Dropbox/My Mac (Shaun's MacBook Pro)/Desktop/Local-Repo/REPOs/finance-dashboard-backend"

# 2. Install dependencies
npm install

# 3. Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Copy the generated key and add it to .env file
# Edit .env and replace: ENCRYPTION_KEY=your_generated_key_here
```

---

## After Running Setup

1. **Edit `.env` file** - Add your Supabase credentials:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Apply database migration** - See `SETUP_SUPABASE.md`

3. **Start the server**:
   ```bash
   npm run dev
   ```

---

## Troubleshooting

**"command not found: npm"**
- Install Node.js from https://nodejs.org/
- Or use Homebrew: `brew install node`
- Restart your terminal after installation

**"Permission denied"**
- Make script executable: `chmod +x run-setup.sh`

**Dependencies fail to install**
- Check internet connection
- Try: `npm install --legacy-peer-deps`
- Or: `npm cache clean --force && npm install`

