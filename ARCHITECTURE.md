# xg2huo Architecture

## Overview

xg2huo is a modern, localized classifieds marketplace built using a Turborepo monorepo architecture. The project is designed to be scalable, maintainable, and developer-friendly.

## Technology Stack

### Frontend
- **Next.js 15**: App Router for server-side rendering and static site generation
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **next-intl**: Internationalization support for zh-CN, en, and km locales
- **next-auth**: Authentication framework with credentials provider
- **next-pwa**: Progressive Web App capabilities

### Backend
- **Fastify**: Fast and low overhead web framework
- **TypeScript**: Type-safe server-side code
- **Drizzle ORM**: TypeScript-first ORM
- **SQLite**: Development database
- **LibSQL/Turso**: Production-ready distributed database

### Monorepo
- **Turborepo**: High-performance build system for JavaScript/TypeScript
- **npm workspaces**: Dependency management

## Project Structure

```
xg2huo/
├── apps/
│   ├── api/              # Fastify REST API
│   │   ├── src/
│   │   │   ├── index.ts  # Server entry point
│   │   │   └── routes/   # API route handlers
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/              # Next.js web application
│       ├── i18n/         # Internationalization config
│       ├── public/       # Static assets and PWA files
│       ├── src/
│       │   ├── app/      # Next.js App Router pages
│       │   ├── components/ # React components
│       │   ├── lib/      # Utility functions
│       │   ├── messages/ # i18n translation files
│       │   ├── middleware.ts # Next.js middleware
│       │   └── routing.ts    # i18n routing config
│       ├── next.config.js
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── config/           # Shared configurations
│   │   ├── eslint-*.json # ESLint configs
│   │   ├── prettier-*.json # Prettier configs
│   │   ├── tsconfig-*.json # TypeScript configs
│   │   └── package.json
│   │
│   ├── db/               # Database package
│   │   ├── src/
│   │   │   ├── index.ts  # Database client
│   │   │   └── schema/   # Drizzle ORM schemas
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/               # Shared UI components
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── lib/      # Utility functions
│       │   └── index.tsx # Package entry point
│       ├── package.json
│       └── tsconfig.json
│
├── .github/
│   └── workflows/        # CI/CD workflows
│       └── ci.yml        # GitHub Actions CI
│
├── turbo.json            # Turborepo configuration
├── package.json          # Root package.json
└── .env.example          # Environment variables template
```

## Database Schema

### Users
- Authentication and user profile information
- Fields: id, email, passwordHash, name, phone, createdAt, updatedAt

### Categories
- Hierarchical category structure
- Fields: id, name, slug, parentId, createdAt
- Self-referential relationship for subcategories

### Locations
- Geographic location data
- Fields: id, country, city, lat, lng, createdAt

### Listings
- Product/service listings
- Fields: id, title, description, price, currency, categoryId, locationId, userId, status, createdAt, updatedAt
- Foreign keys: categoryId → categories, locationId → locations, userId → users

### Images
- Multiple images per listing
- Fields: id, listingId, url, order, createdAt
- Foreign key: listingId → listings

### Favorites
- User bookmarks/favorites
- Fields: id, userId, listingId, createdAt
- Foreign keys: userId → users, listingId → listings

## API Endpoints

### Users
- `GET /api/users` - List users (paginated)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories
- `GET /api/categories` - List categories (paginated)
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Locations
- `GET /api/locations` - List locations (paginated)
- `GET /api/locations/:id` - Get location by ID
- `POST /api/locations` - Create location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Listings
- `GET /api/listings` - List listings (paginated)
- `GET /api/listings/:id` - Get listing with images
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `POST /api/listings/:id/images` - Add image to listing

### Favorites
- `GET /api/favorites/user/:userId` - Get user favorites (paginated)
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites` - Remove favorite

## Internationalization

The application supports three languages:
- English (en)
- Chinese Simplified (zh-CN)
- Khmer (km)

Translations are stored in JSON files in `apps/web/src/messages/`.

## Suno Control Panel Architecture (Proposed)

This section outlines a production-grade, modular architecture for a private “Suno Control Panel / Composer Console.” The system treats Suno as a generation engine while giving the creator full control over structured prompting, asset management, and post-production pipelines.

### Goals
- **Structured prompting**: enforce a multi-layer prompt system (Structure, Harmony, Emotion, Render).
- **Adapter isolation**: avoid hard-coupling to a single third-party API provider.
- **Asset governance**: manage projects, songs, versions, metadata, and legal artifacts.
- **Pipeline readiness**: pass generation intent into downstream mastering workflows.

### High-Level Modules

#### 1) Frontend (Producer Console)
- **Prompt Builder**
  - Layered prompt editor: Structure, Harmony, Emotion, Render.
  - Preset library with tagging and versioning.
  - “Target Profile” selector (Streaming / Broadcast / Demo).
- **Job Queue**
  - Batch submission, priority ordering, and retry handling.
  - Status timeline (queued → running → completed → failed).
- **Result Inspector**
  - A/B listening, rating, approval/kill switch.
  - Export panel for WAV/MP3 and metadata bundles.
- **Project Library**
  - Project → Song → Version hierarchy.
  - Full prompt, model version, timestamp, ownership, and rights metadata.

#### 2) Application Service (Orchestration Layer)
- **Generation Service**
  - Converts structured prompts into provider-specific payloads.
  - Stores full reproducible prompt + config snapshots.
  - Pushes jobs into a queue for async processing.
- **Prompt Compiler**
  - Deterministic prompt assembly and linting rules.
  - Enforces layering and ensures required fields.
- **Target Profile Engine**
  - Maps “target profiles” to prompt hints and export labels.
  - Example: Streaming (-14 LUFS) → dynamic preservation tag.
- **Asset Manager**
  - Versioned storage of audio, stems, and metadata.
  - Generates copyright PDF + metadata packs.

#### 3) Adapter Layer (Provider Abstraction)
- **GenerationAdapter Interface**
  - `submitJob(prompt, options) -> jobId`
  - `getStatus(jobId) -> status`
  - `fetchResult(jobId) -> audioUrls + metadata`
- **Provider Implementations**
  - Adapter A (current third-party API)
  - Adapter B (future migration)
  - Mock Adapter (local testing)

#### 4) Data Layer
- **Core Entities**
  - Project
  - Song
  - Version
  - PromptSnapshot
  - Job
  - ProviderRun
  - Asset (audio, metadata, legal docs)
- **Storage**
  - SQL DB for metadata
  - Object storage for audio + PDFs

### Suggested Service Boundaries

```
Frontend (Web)
  └── API Gateway
        ├── Auth / User Profiles
        ├── Prompt Service
        ├── Job Queue Service
        ├── Asset Service
        └── Legal/Metadata Service

Worker (Background)
  └── Generation Orchestrator
        ├── Adapter Router
        ├── Provider Adapter A/B
        └── Result Normalizer
```

### MVP Cut (First Release)
1. **Prompt Builder** with layered prompt schema.
2. **Job Queue** with batch submit + status.
3. **Result Inspector** with tagging, approval, export.

### Non-Functional Requirements
- **Provider independence** via adapters.
- **Full reproducibility** of every generated output.
- **Clear legal metadata** embedded in every export.
- **No reverse engineering** of official endpoints.

Routes are prefixed with the locale: `/{locale}/path`
- `/en/categories`
- `/zh-CN/categories`
- `/km/categories`

## Authentication

NextAuth is configured with a credentials provider (stub implementation).

Current implementation:
- Stub credential validation
- JWT session strategy
- Custom sign-in page at `/auth/signin`

To implement full authentication:
1. Update `apps/web/src/lib/auth.ts`
2. Connect to the API user endpoints
3. Implement password hashing (e.g., bcrypt)
4. Add proper credential validation

## Progressive Web App (PWA)

The web app is PWA-enabled:
- Service worker for offline functionality
- Web app manifest for installation
- Optimized caching strategies
- Disabled in development mode

Manifest file: `apps/web/public/manifest.json`
Service worker: Generated in `apps/web/public/sw.js`

## Development Workflow

### Running the project

```bash
# Install dependencies
npm install

# Run all apps in development
npm run dev

# Build all apps
npm run build

# Lint all code
npm run lint

# Run tests
npm run test
```

### Adding a new feature

1. Create feature branch
2. Make changes in appropriate package/app
3. Run lint and build locally
4. Commit and push changes
5. CI will automatically run tests
6. Create pull request

### Adding a new package

1. Create directory in `packages/`
2. Add `package.json` with proper name (`@xg2huo/package-name`)
3. Add to root `package.json` workspaces
4. Run `npm install` to link
5. Use in other packages with dependency `"@xg2huo/package-name": "*"`

## Build & Deployment

### Development
- SQLite database (file-based)
- Hot reload enabled
- PWA disabled

### Production
- LibSQL/Turso database (distributed)
- Optimized builds
- PWA enabled
- Static page generation where possible

### Environment Variables

Required environment variables:
- `DATABASE_URL`: Database connection string
- `DATABASE_AUTH_TOKEN`: Database authentication token (for Turso)
- `NEXTAUTH_SECRET`: Secret key for NextAuth
- `NEXTAUTH_URL`: Base URL for authentication
- `API_URL`: API server URL (optional)
- `CORS_ORIGIN`: Allowed CORS origins (optional)

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run linting
5. Build all packages
6. Run tests

Triggers on:
- Push to main branch
- Pull requests to main branch

## Performance Considerations

- Turborepo caching for faster builds
- Next.js static page generation for SEO
- Image optimization (Next.js automatic)
- Code splitting and lazy loading
- PWA caching for offline support

## Security

- CSRF protection via NextAuth
- JWT-based authentication
- CORS configuration
- Environment variable protection
- SQL injection prevention via Drizzle ORM
- Input validation on API endpoints

## Future Enhancements

- Image upload and storage (S3/CloudFlare R2)
- Real-time messaging between users
- Payment integration
- Advanced search with filters
- Email notifications
- SMS verification
- Rate limiting on API
- Comprehensive test coverage
- E2E testing with Playwright
- Performance monitoring
- Error tracking (Sentry)
