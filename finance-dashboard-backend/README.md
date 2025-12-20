# Finance Dashboard Backend

Backend API for the Personal Finance Dashboard platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **API Integration**: TrueLayer (extensible framework)

## Setup

### Quick Start

**🚀 New to this project?** Start with the [Quick Start Guide](./QUICK_START.md) for step-by-step instructions.

**📖 Need detailed Supabase setup?** See [Supabase Setup Guide](./SETUP_SUPABASE.md).

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- npm or yarn

### Installation

1. **Set up Supabase** (see [SETUP_SUPABASE.md](./SETUP_SUPABASE.md) for detailed instructions):
   - Create Supabase project
   - Apply migration: `supabase/migrations/001_initial_schema.sql`
   - Get your project URL and API keys

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Option 1: Use setup script (recommended)
   chmod +x scripts/setup-env.sh
   ./scripts/setup-env.sh
   
   # Option 2: Manual setup
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3001` (or PORT from .env).

## Project Structure

```
finance-dashboard-backend/
├── src/
│   ├── auth/              # Authentication middleware and utilities
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── database/          # Database types and utilities
│   ├── integrations/      # API integration connectors
│   ├── jobs/              # Background jobs
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   └── server.ts         # Express server entry point
├── supabase/
│   ├── migrations/       # Database migrations
│   └── config.toml       # Supabase configuration
├── .env.example          # Environment variables template
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Dashboard
- `GET /api/dashboard/net-worth` - Get net worth data
- `GET /api/dashboard/spending` - Get spending analysis
- `GET /api/dashboard/accounts` - Get account summaries

### Integrations
- `GET /api/integrations/providers` - List available providers
- `POST /api/integrations/truelayer/connect` - Initiate TrueLayer OAuth
- `GET /api/integrations/truelayer/callback` - OAuth callback
- `POST /api/integrations/:id/sync` - Trigger manual sync

### CSV Import
- `POST /api/imports/upload` - Upload CSV file
- `GET /api/imports/:id` - Get import status
- `POST /api/imports/:id/map` - Set column mapping
- `POST /api/imports/:id/process` - Process import

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Type check without building

## Database Migrations

Migrations are located in `supabase/migrations/`. Apply them via:
- Supabase CLI: `supabase db push`
- Supabase Dashboard: SQL Editor
- Direct PostgreSQL connection

## Security

- Row Level Security (RLS) enabled on all tables
- JWT token validation on protected routes
- Encrypted storage of API credentials
- Rate limiting on API endpoints
- CORS configuration for frontend

## License

MIT

