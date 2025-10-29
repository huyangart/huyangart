# xg2huo - Localized Classifieds Marketplace

A modern, localized classifieds marketplace built with a Turbo monorepo architecture.

## 🏗️ Architecture

This project uses Turborepo to manage a monorepo with multiple applications and shared packages.

### Apps

- **web**: Next.js 15 application with App Router, TypeScript, Tailwind CSS, shadcn/ui components
  - Multi-language support (English, Chinese, Khmer)
  - PWA capabilities with service worker and manifest
  - NextAuth authentication (credentials provider stub)
  - Pages: Home, Categories, Listing Details, Post Listing

- **api**: Fastify REST API server with TypeScript
  - Drizzle ORM for database management
  - SQLite for development, LibSQL/Turso for production
  - CRUD endpoints with pagination for all entities
  - CORS enabled for cross-origin requests

### Packages

- **db**: Database schema and configuration
  - Drizzle ORM schemas for all entities
  - Database migration support
  - Type-safe database client

- **ui**: Shared UI components
  - Reusable React components with Tailwind CSS
  - shadcn/ui inspired design
  - Button, Card components

- **config**: Shared configuration
  - ESLint configurations for Next.js and Node.js
  - Prettier configuration
  - TypeScript configurations

## 🗄️ Database Schema

The application includes the following entities:

- **users**: User accounts with authentication
- **categories**: Hierarchical category structure with parent-child relationships
- **listings**: Product/service listings with details
- **images**: Multiple images per listing
- **locations**: Geographic locations with coordinates
- **favorites**: User favorites/bookmarks

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 10 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/huyangart/huyangart.git
cd huyangart
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL`: Database connection string
- `DATABASE_AUTH_TOKEN`: Database authentication token (for Turso)
- `NEXTAUTH_SECRET`: Secret key for NextAuth
- `NEXTAUTH_URL`: Base URL for authentication

### Development

Run all apps in development mode:
```bash
npm run dev
```

This will start:
- Web app at http://localhost:3000
- API server at http://localhost:3001

### Building

Build all apps:
```bash
npm run build
```

### Linting

Lint all code:
```bash
npm run lint
```

### Testing

Run tests:
```bash
npm run test
```

### Database Management

Generate database migrations:
```bash
cd packages/db
npm run db:generate
```

Apply migrations:
```bash
npm run db:migrate
```

Open Drizzle Studio (database GUI):
```bash
npm run db:studio
```

## 🌍 Internationalization

The web app supports three languages:
- English (en)
- Chinese Simplified (zh-CN)
- Khmer (km)

Access different languages via URL: `/en`, `/zh-CN`, `/km`

## 📱 Progressive Web App (PWA)

The web app is PWA-enabled with:
- Service worker for offline functionality
- Web app manifest for installation
- Optimized caching strategies

## 🔒 Authentication

NextAuth is configured with a credentials provider (stub implementation).

To implement full authentication:
1. Update `apps/web/src/lib/auth.ts`
2. Connect to the API user endpoints
3. Implement password hashing and validation

## 🔧 API Endpoints

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

## 📦 Project Structure

```
xg2huo/
├── apps/
│   ├── api/          # Fastify API server
│   └── web/          # Next.js web application
├── packages/
│   ├── config/       # Shared configurations
│   ├── db/           # Database schema and client
│   └── ui/           # Shared UI components
├── .github/
│   └── workflows/    # GitHub Actions CI/CD
├── turbo.json        # Turborepo configuration
├── package.json      # Root package.json
└── .env.example      # Environment variables template
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Fastify, TypeScript
- **Database**: Drizzle ORM, SQLite/LibSQL
- **Monorepo**: Turborepo
- **Authentication**: NextAuth.js
- **i18n**: next-intl
- **PWA**: next-pwa

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Turborepo
