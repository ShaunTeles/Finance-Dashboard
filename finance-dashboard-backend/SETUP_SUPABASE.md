# Supabase Setup Guide

This guide will walk you through setting up your Supabase project and applying the database migration.

## Prerequisites

- A Supabase account (sign up at https://supabase.com if you don't have one)
- Access to your Supabase project dashboard

## Step 1: Create a New Supabase Project

1. Go to https://supabase.com and sign in to your account
2. Click **"New Project"** or **"Create a new project"**
3. Fill in the project details:
   - **Name**: `finance-dashboard` (or your preferred name)
   - **Database Password**: Create a strong password (save this securely - you'll need it)
   - **Region**: Choose the region closest to you or your users
   - **Pricing Plan**: Select Free tier for development
4. Click **"Create new project"**
5. Wait for the project to be provisioned (this takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to **Settings** → **API** (in the left sidebar)
2. You'll need the following values:
   - **Project URL**: Found under "Project URL" (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**: Found under "Project API keys" → "anon public"
   - **service_role key**: Found under "Project API keys" → "service_role" (⚠️ Keep this secret!)

3. Copy these values - you'll use them in your `.env` file

## Step 3: Apply the Database Migration

### Option A: Using Supabase Dashboard (Recommended for First Time)

1. In your Supabase project, go to **SQL Editor** (in the left sidebar)
2. Click **"New query"**
3. Open the migration file: `supabase/migrations/001_initial_schema.sql`
4. Copy the **entire contents** of the file
5. Paste it into the SQL Editor
6. Click **"Run"** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows/Linux)
7. Wait for the query to complete (should take a few seconds)
8. You should see "Success. No rows returned" or similar success message

### Option B: Using Supabase CLI (Advanced)

If you prefer using the CLI:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Settings → General → Reference ID)

4. Apply the migration:
   ```bash
   supabase db push
   ```

## Step 4: Verify the Migration

1. In Supabase Dashboard, go to **Table Editor** (in the left sidebar)
2. You should see the following tables created:
   - `categories`
   - `accounts`
   - `transactions`
   - `investments`
   - `debts`
   - `budgets`
   - `net_worth_snapshots`
   - `api_connections`
   - `sync_logs`
   - `csv_imports`
   - `user_profiles`

3. Go to **Authentication** → **Policies** to verify RLS policies are enabled

## Step 5: Configure Authentication Providers

### Enable Email/Password Authentication

1. Go to **Authentication** → **Providers** (in the left sidebar)
2. Ensure **Email** is enabled (it should be by default)
3. Configure email settings:
   - **Enable email confirmations**: Toggle OFF for development (ON for production)
   - **Site URL**: Set to `http://localhost:3000` for development
   - **Redirect URLs**: Add `http://localhost:3000/**` for development

### Enable Google OAuth (Optional)

1. In **Authentication** → **Providers**, find **Google**
2. Toggle it **ON**
3. You'll need to:
   - Create a Google OAuth application at https://console.cloud.google.com
   - Get Client ID and Client Secret
   - Add them to Supabase
   - Add authorized redirect URIs in Google Console

## Step 6: Set Up Environment Variables

1. In the backend repository, create a `.env` file:
   ```bash
   cd finance-dashboard-backend
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ENCRYPTION_KEY=your-32-character-hex-key-here
   ```

3. Generate an encryption key (32 bytes = 64 hex characters):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as `ENCRYPTION_KEY`

4. In the frontend repository, create `.env.local`:
   ```bash
   cd finance-dashboard-frontend
   ```

   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

## Step 7: Test the Connection

1. Start the backend server:
   ```bash
   cd finance-dashboard-backend
   npm install
   npm run dev
   ```

2. You should see:
   ```
   Server is running on port 3001
   Environment: development
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

## Troubleshooting

### Migration Fails

- **Error: "relation already exists"**: Some tables might already exist. You can drop them first or modify the migration to use `CREATE TABLE IF NOT EXISTS`
- **Error: "permission denied"**: Make sure you're using the SQL Editor with proper permissions
- **Error: "extension not found"**: The extensions should be available by default. If not, contact Supabase support

### Connection Issues

- **"Missing Supabase environment variables"**: Double-check your `.env` file has all required variables
- **CORS errors**: Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL
- **Authentication errors**: Verify your Supabase URL and keys are correct

### RLS Policy Issues

- If you can't access data, check that RLS policies are correctly applied
- Test with the service_role key (backend) vs anon key (frontend) to verify RLS is working

## Next Steps

Once Supabase is set up:

1. ✅ Database migration applied
2. ✅ Environment variables configured
3. ⏭️ Install dependencies: `npm install` in both repos
4. ⏭️ Start development servers
5. ⏭️ Test authentication flow
6. ⏭️ Test API endpoints

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

