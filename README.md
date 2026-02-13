# Quilters Unite

A community platform for quilters inspired by Ravelry.com. Discover quilt patterns and blocks, share projects, manage a personal quilting notebook, and connect with the quilting community through forums, groups, messaging, and events.

## Features

### Browse & Discover
- **Pattern Library** — Browse and filter quilt patterns by difficulty, type, technique, and price. Submit your own patterns for community review.
- **Block Library** — Explore quilt block designs from traditional to modern, with filtering by category, difficulty, and grid size.
- **Project Gallery** — View community projects with photo galleries, comments, and likes.
- **Quilt Shops** — Find local and online quilt shops with favorites and filtering.

### Community
- **Forums** — Discuss quilting topics across organized categories with threaded conversations.
- **Groups** — Join or create quilting groups around shared interests.
- **Events** — Discover quilting events, workshops, retreats, and virtual sew-alongs. Mark events as "I'm Interested."
- **Blog** — Community blog with articles on quilting tips, techniques, and inspiration, with category filtering.
- **People Directory** — Browse community members and find quilters to connect with.
- **Friends** — Add friends and follow their projects.
- **Messaging** — Private conversations with other quilters.

### Personal Notebook (Authenticated)
- **Projects** — Track your quilting projects with photos (up to 10), notes, fabric details, start/finish dates, and status tracking (Not Started, In Progress, Finished, Frogged).
- **Queue** — Save patterns you want to make as a personal wishlist.
- **Favorites** — Bookmark patterns, blocks, projects, shops, events, and groups.
- **Library** — Manage patterns you own, whether purchased or free.

### Subscription & Payments
- **14-Day Free Trial** — Full access upon registration, no credit card required.
- **Monthly Plan** — $4.99/month after trial ends.
- **Yearly Plan** — $49.99/year (save 17%).
- **Always Free** — Browsing patterns, blocks, projects, and viewing forums remain free.
- **Restricted After Trial** — Creating projects, managing queue/favorites, and posting in forums require an active subscription.

### User Accounts
- **Quilter** — Standard user account for browsing, saving, and sharing projects.
- **Designer** — Enhanced profile with background, inspiration, pattern links, and shop URL. Designers can list patterns for sale (10% platform fee).

### Support & Help
- **Getting Started Guide** — Six detailed sub-pages walking new users through the platform:
  - Create Your Account
  - Explore Patterns & Blocks
  - Build Your Queue
  - Start a Project
  - Manage Your Library
  - Join the Community
- **Contact Us** — Contact form for support inquiries.
- **Privacy Policy** — Platform privacy information.
- **Terms of Service** — Usage terms and conditions.
- **Community Guidelines** — Rules for respectful community participation.
- **Publishing Rules** — Guidelines for pattern publishers.

### Additional Features
- **4 Color Themes** — Choose from Warm & Classic (default), Night Mode, Bright & Colorful, or Soft Pastel. Preference is saved automatically.
- **Multi-Language Support** — Full UI translations in 7 languages: English, French, Spanish, German, Dutch, Danish, and Japanese. Automated content translation via Google Cloud Translation API.
- **Photo Upload System** — Reusable drag-and-drop photo upload component supporting URL input and file upload (max 10 photos per item).
- **Pattern & Block Submissions** — Users can submit patterns and blocks for administrator approval.
- **User Profiles** — Customizable profiles with bio, quilting interests, and activity history.
- **SEO Optimized** — Per-page meta tags, JSON-LD structured data, sitemap.xml, and robots.txt.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI) |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL, Drizzle ORM |
| Authentication | Email/password with Passport.js (local strategy), bcryptjs |
| Sessions | PostgreSQL-backed via connect-pg-simple |
| Payments | Stripe (checkout, customer portal, webhooks) |
| Server State | TanStack Query (React Query) |
| Client Routing | Wouter |
| Internationalization | react-i18next, i18next-browser-languagedetector |
| SEO | react-helmet-async |
| Date Picker | react-day-picker v9 |
| Icons | Lucide React |
| Animations | Framer Motion |
| Charts | Recharts |
| Carousel | Embla Carousel |

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quilters-unite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   SESSION_SECRET=your-session-secret
   ```

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Seed Stripe products (run once):
   ```bash
   npx tsx server/seed-stripe-products.ts
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The app runs on port 5000 and includes sample seed data on first run.

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push Drizzle schema to database |

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Secret key for session encryption (auto-generated if not set) | Recommended |
| `GOOGLE_CLOUD_API_KEY` | Google Cloud Translation API key (for automated content translation) | No |

### Stripe Configuration

Stripe is used for subscription billing. You will need:
- A Stripe account with API keys configured
- Stripe webhook endpoint set to `<your-domain>/api/stripe/webhook`
- Subscription products seeded via `npx tsx server/seed-stripe-products.ts`

## Project Structure

```
quilters-unite/
├── client/                              # Frontend React application
│   ├── public/
│   │   └── locales/                    # Translation files (7 languages)
│   │       ├── en/translation.json
│   │       ├── fr/translation.json
│   │       ├── es/translation.json
│   │       ├── de/translation.json
│   │       ├── nl/translation.json
│   │       ├── da/translation.json
│   │       └── ja/translation.json
│   └── src/
│       ├── App.tsx                      # Root component with routing
│       ├── main.tsx                     # Entry point
│       ├── i18n.ts                      # i18next configuration
│       ├── index.css                    # Global styles and theme variables
│       ├── components/
│       │   ├── layout/
│       │   │   ├── header.tsx           # Navigation header
│       │   │   └── footer.tsx           # Site footer
│       │   ├── seo.tsx                  # SEO meta tags and JSON-LD
│       │   ├── language-selector.tsx    # Language picker dropdown
│       │   ├── theme-provider.tsx       # 4-theme context provider
│       │   ├── theme-toggle.tsx         # Theme dropdown selector
│       │   └── ui/                      # shadcn/ui components (40+)
│       ├── hooks/
│       │   ├── use-auth.ts              # Authentication hook
│       │   ├── use-mobile.tsx           # Mobile detection hook
│       │   └── use-toast.ts             # Toast notification hook
│       ├── lib/
│       │   ├── queryClient.ts           # TanStack Query client & API helpers
│       │   └── utils.ts                 # General utilities (cn, etc.)
│       └── pages/
│           ├── landing.tsx              # Public landing page
│           ├── home.tsx                 # Authenticated home page
│           ├── patterns.tsx             # Pattern listing
│           ├── pattern-detail.tsx       # Individual pattern view
│           ├── pattern-list-form.tsx    # Pattern submission form
│           ├── blocks.tsx               # Block listing
│           ├── block-detail.tsx         # Individual block view
│           ├── block-list-form.tsx      # Block submission form
│           ├── projects.tsx             # Project gallery
│           ├── project-detail.tsx       # Individual project view
│           ├── new-project.tsx          # New project form
│           ├── notebook.tsx             # Personal notebook (tabs)
│           ├── profile.tsx              # User profile page
│           ├── subscription.tsx         # Pricing page
│           ├── about.tsx                # About page
│           ├── support.tsx              # Support hub
│           ├── contact.tsx              # Contact form
│           ├── privacy-policy.tsx       # Privacy policy
│           ├── terms-of-service.tsx     # Terms of service
│           ├── community-guidelines.tsx # Community guidelines
│           ├── publishing-rules.tsx     # Publishing rules
│           ├── auth/
│           │   ├── login.tsx            # Login page
│           │   └── register.tsx         # Registration page
│           ├── subscription/
│           │   ├── success.tsx          # Checkout success
│           │   └── cancel.tsx           # Checkout cancelled
│           ├── community/
│           │   ├── blog.tsx             # Community blog
│           │   ├── forums.tsx           # Forum categories
│           │   ├── forum-category.tsx   # Forum category threads
│           │   ├── thread.tsx           # Forum thread posts
│           │   ├── groups.tsx           # Quilting groups
│           │   ├── events.tsx           # Quilting events
│           │   ├── people.tsx           # People directory
│           │   ├── friends.tsx          # Friends list
│           │   ├── messages.tsx         # Private messages
│           │   ├── shops.tsx            # Quilt shops
│           │   └── add-shop.tsx         # Add a shop form
│           └── getting-started/
│               ├── create-account.tsx
│               ├── explore-patterns.tsx
│               ├── build-queue.tsx
│               ├── start-project.tsx
│               ├── manage-library.tsx
│               └── join-community.tsx
├── server/                              # Backend Express server
│   ├── index.ts                         # Server entry point
│   ├── routes.ts                        # API route definitions
│   ├── storage.ts                       # Database storage layer (IStorage)
│   ├── seed.ts                          # Database seeding with sample data
│   ├── db.ts                            # Database connection
│   ├── stripeClient.ts                  # Stripe client configuration
│   ├── stripeService.ts                 # Stripe service helpers
│   ├── webhookHandlers.ts               # Stripe webhook processing
│   ├── seed-stripe-products.ts          # Seed Stripe subscription products
│   ├── translation-service.ts           # Google Cloud Translation API service
│   ├── vite.ts                          # Vite dev server integration
│   ├── static.ts                        # Static file serving (production)
│   └── replit_integrations/auth/        # Authentication setup
│       ├── index.ts
│       ├── replitAuth.ts
│       ├── routes.ts
│       └── storage.ts
├── shared/                              # Shared between client and server
│   ├── schema.ts                        # Drizzle database schema
│   └── models/
│       └── auth.ts                      # Auth-related models
├── script/
│   └── build.ts                         # Production build script
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── drizzle.config.ts
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with email, password, firstName, status (quilter/designer) |
| POST | `/api/auth/login` | Login with email and password |
| POST | `/api/auth/logout` | Logout and destroy session |
| GET | `/api/auth/user` | Get current authenticated user |

### Stripe & Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stripe/publishable-key` | Get Stripe publishable key |
| POST | `/api/stripe/create-checkout-session` | Create checkout session for subscription |
| GET | `/api/stripe/prices` | Get subscription prices |
| POST | `/api/stripe/customer-portal` | Open Stripe customer portal |
| GET | `/api/subscription/status` | Check current subscription status |
| POST | `/api/stripe/webhook` | Stripe webhook (raw body) |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patterns` | List patterns with filtering and sorting |
| GET | `/api/patterns/:id` | Get pattern details |
| GET | `/api/blocks` | List blocks |
| GET | `/api/blocks/:id` | Get block details |
| GET | `/api/projects` | List public projects |
| GET | `/api/projects/:id` | Get project details |
| GET | `/api/shops` | List quilt shops |
| GET | `/api/forums` | List forum categories |
| GET | `/api/forums/:id` | Get forum category with threads |
| GET | `/api/threads/:id` | Get thread with posts |
| GET | `/api/events` | List events |
| GET | `/api/groups` | List groups |
| GET | `/sitemap.xml` | XML sitemap |
| GET | `/robots.txt` | Robots.txt |

### Authenticated (require active trial or subscription for writes)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create a project |
| PATCH | `/api/projects/:id` | Update a project |
| GET/POST/DELETE | `/api/favorites` | Manage favorites |
| GET/POST/DELETE | `/api/queue` | Manage pattern queue |
| GET/POST/DELETE | `/api/library` | Manage owned patterns |
| POST | `/api/patterns` | Submit a new pattern |
| POST | `/api/blocks` | Submit a new block |
| GET | `/api/friends` | Get friends list |
| GET | `/api/messages` | Get messages |
| POST | `/api/events/:id/interested` | Mark interest in an event |

## Internationalization

- **7 Languages**: English (default), French, Spanish, German, Dutch, Danish, Japanese
- **UI Translations**: 420+ keys covering all pages, buttons, labels, and messages
- **Content Translation**: Automated via Google Cloud Translation API v2 (requires `GOOGLE_CLOUD_API_KEY`)
- **Language Selector**: Globe icon in header; preference saved to database (logged-in) or localStorage (guests)

## Themes

Four built-in color themes, selectable from the header:

| Theme | Description |
|-------|-------------|
| Warm & Classic | Warm cream background with rose and teal accents (default) |
| Night Mode | Dark background for comfortable low-light use |
| Bright & Colorful | Vibrant hot pink and vivid teal on a clean white background |
| Soft Pastel | Gentle lavender and mint tones on a light lavender background |

## Design

- **Primary**: Rose — Buttons, links, and accent elements
- **Accent**: Teal — Secondary actions and highlights
- **Typography**: Inter (body text) + Libre Baskerville (serif headings)
- **Navigation**: Consistent "Back" buttons on all sub-pages

## Database Schema

Key tables:
- `users` — User accounts with email/password auth, subscription status, Stripe customer/subscription IDs
- `sessions` — Session management (connect-pg-simple)
- `user_profiles` — Extended profiles with designer-specific fields
- `patterns` — Quilt patterns
- `blocks` — Quilt block patterns
- `projects` — User projects
- `favorites` — User favorites (polymorphic)
- `queue` — Pattern queue
- `library` — Owned patterns
- `comments` — Project comments
- `project_likes` — Project likes
- `content_translations` — Translated content for patterns and blocks
- `stripe.*` — Managed by Stripe sync (products, prices, customers, subscriptions)

## Quilt Size Options

Baby, Lap, Twin, Double/Full, Queen, King

## License

MIT
