# Finance Dashboard Frontend

Frontend application for the Personal Finance Dashboard platform.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **HTTP Client**: Axios

## Setup

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Backend API running (see backend README)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

The application will run on `http://localhost:3000`.

## Project Structure

```
finance-dashboard-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group
│   │   ├── (dashboard)/       # Dashboard route group
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   └── imports/           # CSV import components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Next.js middleware
├── public/                     # Static assets
└── package.json
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check without building

## Features

- User authentication (email/password, OAuth)
- Protected routes with middleware
- Responsive dashboard UI
- Real-time data visualization
- CSV import functionality
- Account management

## License

MIT

