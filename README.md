# Country Travel App

A full-stack web application for exploring countries worldwide with real-time data synchronization and interactive mapping capabilities.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Assumptions and Trade-offs](#assumptions-and-trade-offs)
- [Time Breakdown](#time-breakdown)

## Project Overview

Country Travel App is a monorepo application that enables users to:

- **Browse Countries**: View a comprehensive list of countries with their details (capital, currency, flag, coordinates)
- **Interactive Map**: Visualize countries on an interactive map powered by Leaflet
- **Real-time Synchronization**: Automatically syncs country data from the REST Countries API at regular intervals
- **Search and Filter**: Quickly find countries using a command palette interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices

The application pulls data from the [REST Countries API](https://restcountries.com/) and maintains a PostgreSQL database for efficient access and caching.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js + React)               │
│  - Interactive map (React Leaflet)                          │
│  - Country list with search (Command Palette)               │
│  - Server-side rendering with React Query                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP/REST
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                Backend (NestJS)                             │
│  - RESTful API endpoints (/api/country)                    │
│  - Scheduled data synchronization (every 10 seconds)       │
│  - Input validation & error handling                        │
│  - TypeORM integration with PostgreSQL                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Database Connection
                  │
┌─────────────────▼───────────────────────────────────────────┐
│           PostgreSQL Database (pgvector)                    │
│  - Countries table with UUID primary key                   │
│  - Stores metadata (capital, currency, coordinates)         │
│  - Raw API response storage for flexibility                │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure (Monorepo)

```
country_travel_app/
├── apps/
│   ├── backend/                    # NestJS backend application
│   │   ├── src/
│   │   │   ├── config/            # Database and app configuration
│   │   │   ├── filters/           # Exception filters
│   │   │   ├── models/
│   │   │   │   └── country/       # Country module (controller, service, entity)
│   │   │   ├── app.module.ts      # Root module
│   │   │   └── main.ts            # Application entry point
│   │   ├── docker-compose.yml     # Docker services for development
│   │   ├── Dockerfile             # Production/development image
│   │   └── package.json
│   │
│   └── web/                        # Next.js frontend application
│       ├── src/
│       │   ├── app/               # Next.js app directory
│       │   ├── components/        # Reusable UI components
│       │   │   ├── pages/         # Page components
│       │   │   ├── map/           # Map-related components
│       │   │   ├── countries/     # Country-related components
│       │   │   └── ui/            # Base UI components (buttons, dialogs, etc.)
│       │   ├── services/          # API client services
│       │   ├── lib/               # Utility functions and query setup
│       │   └── types/             # TypeScript type definitions
│       └── package.json
│
├── packages/                       # Shared packages
│   ├── eslint-config/             # Shared ESLint configuration
│   └── typescript-config/         # Shared TypeScript configuration
│
├── turbo.json                      # Turbo monorepo configuration
├── pnpm-workspace.yaml            # pnpm workspace configuration
└── package.json                   # Root package configuration
```

### Data Flow

1. **Backend Initialization**: When the backend starts, it checks if the database is empty. If so, it fetches countries from REST Countries API.
2. **Scheduled Sync**: A cron job runs every 10 seconds to fetch and update country data. (does not works yet)
3. **API Endpoints**: Frontend makes requests to NestJS API to fetch countries.
4. **Frontend Rendering**: React Query handles caching and prefetching of data; Server-side rendering hydrates with initial data.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI, custom UI library with CVA
- **Mapping**: Leaflet + React Leaflet
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS
- **Database ORM**: TypeORM
- **Database**: PostgreSQL with pgvector extension
- **Scheduling**: @nestjs/schedule (cron jobs)
- **HTTP Client**: Axios
- **Validation**: class-validator, class-transformer
- **Language**: TypeScript

### Infrastructure
- **Monorepo**: Turbo
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose
- **Node**: 18+

## Setup Instructions

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v9.0.0 or higher
- **Docker & Docker Compose**: For database and containerized services
- **PostgreSQL**: If not using Docker

### Local Development

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd country_travel_app
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Set Up Environment Variables

Backend requires these environment variables. Create a `.env` file in `apps/backend/`:

```bash
NODE_ENV=development
PORT=8080
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=country_travel
```

#### 4. Start Services

**Using Docker Compose**

```bash
cd apps/backend
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Backend on port 8080 (with hot reload)

#### 5. Access the Application

run
```bash
pnpm turbo dev --filter=web
```


### Development Commands

```bash
# Install dependencies
pnpm install

# Start all services in development mode
pnpm run dev

# Build all applications
pnpm run build

# Run linting across monorepo
pnpm run lint

# Type checking
pnpm run check-types
```

## Assumptions and Trade-offs

### Architectural Assumptions

1. **REST API Design**: Assumed a traditional REST API was preferred over GraphQL for simplicity.
2. **Monorepo Structure**: Used Turbo monorepo to keep frontend and backend code organized while sharing configuration.
3. **Server-side Rendering**: Frontend uses SSR for better SEO and initial data loading.

### Data Synchronization

1. **Frequent Sync (10 seconds)**: Data syncs every 10 seconds instead of daily. This was chosen for demo purposes but should be adjusted to 1-2 days in production. (DOES NOT WORK YET)
   - **Trade-off**: More API calls to REST Countries vs. keeping data fresh
   - **Solution**: Adjust `CronExpression.EVERY_10_SECONDS` in production

2. **On-demand Manual Sync**: Users can trigger sync manually via `/api/country/sync` endpoint for flexibility.

### Frontend Choices

1. **React Query for Caching**: Provides excellent out-of-the-box caching and prefetching.
2. **Tailwind CSS**: Rapid UI development with utility-first approach.
3. **Leaflet for Maps**: Lightweight, open-source mapping library; good alternative to Google Maps without API keys.

### Database

1. **PostgreSQL with pgvector**: Chose pgvector for future vector search capabilities (geographic queries, similarity search).
2. **JSON Storage**: `rawData` field stores full API response for flexibility.
3. **UUID Primary Keys**: Better for distributed systems and privacy.

### Backend Optimizations

1. **Automatic Synchronization**: Backend auto-initializes database on first run, reducing manual setup.
2. **Global Validation Pipe**: All requests are validated and transformed automatically.
3. **TypeORM Automatic Schema Sync**: In development, schema auto-syncs; disabled in production for safety.

### Limitations & Known Trade-offs

1. **No Authentication**: This is a public API. Add JWT/OAuth2 if needed.
2. **No Rate Limiting**: Consider adding rate limiting for production.
3. **No Caching Headers**: Could add ETag/Last-Modified headers for client-side caching.
4. **Limited Error Details**: Production errors don't expose stack traces for security.
5. **No API Versioning**: Single `/api/` version; should plan `/api/v1/` for future versions.
6. **Frontend Map**: Basic map without additional features like clustering or heatmaps.


---

**Last Updated**: January 2025
**Project Author**: Development Team
**Repository**: [country_travel_app](https://github.com/mikisek/country_travel_app)
