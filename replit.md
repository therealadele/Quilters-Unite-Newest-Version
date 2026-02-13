# Quilters Unite - Quilting Community Platform

## Overview
Quilters Unite is a quilting community platform inspired by Ravelry.com, tailored specifically for quilters. The platform allows users to discover quilt patterns and blocks, share quilting projects, and manage their personal quilting notebook. Users register as either Quilters (standard users) or Designers (pattern creators who receive payments and have enhanced profiles).

## Tech Stack
- **Frontend**: React with TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Email/password with Passport.js local strategy, bcryptjs for hashing, sessions stored in PostgreSQL via connect-pg-simple
- **Payments**: Stripe (via Replit integration) for subscription billing ($4.99/mo or $49.99/yr)
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── layout/   # Header, Footer
│   │   │   ├── ui/       # shadcn/ui components
│   │   ├── pages/        # Page components
│   │   │   ├── auth/     # Login, Register pages
│   │   │   ├── subscription/ # Success, Cancel pages
│   │   ├── hooks/        # Custom React hooks (use-auth, use-toast, etc.)
│   │   ├── lib/          # Utilities and query client
│   │   └── App.tsx       # Main app with routing
├── server/                # Backend Express server
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database storage layer
│   ├── seed.ts           # Database seeding
│   ├── index.ts          # Server entry point (Stripe webhook before express.json)
│   ├── stripeClient.ts   # Stripe client (credentials from Replit connection API)
│   ├── stripeService.ts  # Stripe service helpers
│   ├── webhookHandlers.ts # Stripe webhook processing
│   ├── seed-stripe-products.ts # Seed Stripe subscription products
│   └── replit_integrations/auth/ # Auth setup (passport-local, routes, storage)
├── shared/               # Shared types and schemas
│   ├── schema.ts         # Database schema (Drizzle)
│   └── models/auth.ts    # Users table schema with auth/subscription fields
```

## Running the Application
```bash
npm run dev    # Start development server on port 5000
npm run db:push # Push schema to database
```

## Notes
- Stripe integration requires a Stripe connector to be set up in Replit. Without it, Stripe features are unavailable but the rest of the app works.
- SESSION_SECRET should be set in production to prevent session invalidation on restarts.
- Database is automatically seeded with sample data on first run.
