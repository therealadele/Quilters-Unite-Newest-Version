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

## Authentication
- **Strategy**: passport-local with email/password
- **Password**: bcryptjs (12 rounds), pure JS implementation
- **Sessions**: PostgreSQL-backed via connect-pg-simple, SESSION_SECRET env var (auto-generated if not set)
- **User types**: Quilter (standard) and Designer (pattern creators)
- **Trial**: 14-day free trial on signup, trialEndsAt set to current date + 14 days
- **Auth routes**: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/user
- **User ID**: `req.user.id` (passport-local) - NOT `req.user.claims.sub` (old OIDC pattern)

## Subscription & Payments
- **Provider**: Stripe via Replit integration (stripe-replit-sync)
- **Plans**: Monthly ($4.99/mo), Yearly ($49.99/yr, save 17%)
- **Trial**: 14-day free trial on registration
- **Restricted features (require active trial or subscription)**:
  - Creating/updating projects
  - Adding favorites
  - Adding to queue
  - Creating forum threads/posts
- **Always free**: Browsing patterns, blocks, projects, viewing forums
- **Stripe webhook**: Registered BEFORE express.json() in server/index.ts (critical for raw Buffer handling)
- **Stripe schema**: Managed by stripe-replit-sync, DO NOT create tables in stripe schema manually
- **Subscription status check**: GET /api/subscription/status

## Features

### Public Features
- **Pattern Library**: Browse and filter quilt patterns by difficulty, type, and techniques
- **Block Library**: Explore quilt block patterns from traditional to modern designs
- **Project Gallery**: View community projects and get inspired
- **Subscription Page**: /subscription with pricing cards and Stripe checkout

### Authenticated Features
- **My Notebook**: Personal dashboard with tabs for Projects, Queue, Favorites, Library
- **Create Projects**: Start new projects with pattern association (requires active subscription)
- **Social Features**: Like projects, add comments, share with community
- **Profile**: Comprehensive profile with location, quilting info, social links
- **Designer Profile**: Enhanced profile sections for designers (background, inspiration, pattern links, shop URL)

## API Endpoints

### Auth
- `POST /api/auth/register` - Register with email, password, firstName, status
- `POST /api/auth/login` - Login with email + password
- `POST /api/auth/logout` - Destroy session
- `GET /api/auth/user` - Get current user (sans passwordHash)

### Stripe
- `GET /api/stripe/publishable-key` - Get Stripe publishable key
- `POST /api/stripe/create-checkout-session` - Create checkout session
- `GET /api/stripe/prices` - Get subscription prices
- `POST /api/stripe/customer-portal` - Manage subscription
- `GET /api/subscription/status` - Check subscription status
- `POST /api/stripe/webhook` - Stripe webhook (raw body)

### Public
- `GET /api/patterns` - List patterns (with filtering/sorting)
- `GET /api/patterns/:id` - Get pattern details
- `GET /api/blocks` - List blocks (with filtering/sorting)
- `GET /api/blocks/:id` - Get block details
- `GET /api/projects` - List public projects
- `GET /api/projects/:id` - Get project details

### Authenticated (require active subscription for writes)
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project
- `POST/DELETE /api/favorites` - Manage favorites
- `POST/DELETE /api/queue` - Manage queue
- `POST /api/forums/:categoryId/threads` - Create forum thread
- `POST /api/threads/:threadId/posts` - Create forum post

## Themes
4 built-in color themes selectable from the header dropdown:
- **Warm & Classic** (default) - Rose primary, teal accent, warm cream background
- **Night Mode** - Dark background for low-light use
- **Bright & Colorful** - Vibrant hot pink primary, vivid teal accent
- **Soft Pastel** - Lavender primary, mint accent

## Design
- **Typography**: Inter (sans) + Libre Baskerville (serif for headings)

## Database Schema
Key tables:
- `users` - User accounts with email/password auth, subscription status, Stripe customer/subscription IDs
- `sessions` - Session management (connect-pg-simple)
- `user_profiles` - Extended profiles with designer-specific fields
- `patterns` - Quilt patterns
- `blocks` - Quilt block patterns
- `projects` - User projects
- `favorites` - User favorites (polymorphic)
- `queue` - Pattern queue
- `library` - Owned patterns
- `comments` - Project comments
- `project_likes` - Project likes
- `content_translations` - Translated content
- `stripe.*` - Managed by stripe-replit-sync (products, prices, customers, subscriptions)

## Internationalization (i18n)
- **Framework**: react-i18next with i18next-browser-languagedetector
- **Supported Languages**: English (default), French, Spanish, German, Dutch, Danish, Japanese
- **Translation Files**: `client/public/locales/{lang}/translation.json`
- **Content Translation**: Automated via Google Cloud Translation API v2

## Running the Application
```bash
npm run dev    # Start development server
npm run db:push # Push schema to database
npx tsx server/seed-stripe-products.ts # Seed Stripe products (run once)
```

The app runs on port 5000 and includes sample seed data on first run.

## Recent Changes
- Replaced Replit Auth OIDC with email/password authentication (passport-local, bcryptjs)
- Added user registration with Quilter/Designer status selection and 14-day free trial
- Integrated Stripe for subscription billing ($4.99/mo, $49.99/yr)
- Added subscription pricing page with trial status banners
- Added requireActiveSubscription middleware for restricted features
- Added enhanced Designer profile with background, inspiration, pattern links, shop URL
- Header shows trial expiry warnings and subscription prompts
- Fixed req.user.claims.sub → req.user.id throughout routes (passport-local pattern)
- Added Blog tile to Community page and blog page at /community/blog with sample posts
- Full SEO optimization:
  - react-helmet-async with per-page SEO component (title, description, canonical URL, OG, Twitter Card)
  - SEO component added to all 47 pages with unique titles/descriptions
  - JSON-LD structured data: Organization + WebSite on landing, Blog/BlogPosting on blog, FAQPage on subscription
  - Server-side /sitemap.xml (28 public pages) and /robots.txt endpoints
  - noindex on private/authenticated pages (notebook, profile, forms, etc.)
  - Cleaned index.html: trimmed 25+ unused Google Font families down to Inter + Libre Baskerville
  - Added theme-color, Twitter Card defaults, canonical URL to index.html
  - Semantic HTML: blog posts wrapped in <article> elements with <time> tags

## SEO Component
- **File**: `client/src/components/seo.tsx`
- **Usage**: `<SEO title="Page Title" description="..." path="/page-path" />` — add `noindex` prop for private pages
- **JSON-LD**: `<JsonLd data={{...}} />` for structured data
- **Provider**: HelmetProvider wraps app in `client/src/main.tsx`
- **Site URL**: hardcoded as `https://quiltersunite.com` — update when domain is finalized

## Notes
- SESSION_SECRET should be set in production to prevent session invalidation on restarts
- Google Cloud API key needed for automated content translations. Without it, translations are skipped gracefully.
- Stripe products seeded: Quilters Unite Subscription with monthly and yearly prices
