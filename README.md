# Country Travel App

A full-stack web application for exploring countries worldwide with real-time data synchronization, interactive mapping, and currency exchange rate tracking.

## 🌍 Project Overview

Country Travel App is a modern monorepo application that enables users to:

- **Browse Countries**: View a comprehensive list of countries with their details (capital, currency, flag, coordinates)
- **Interactive Map**: Visualize countries on an interactive map powered by Leaflet
- **Currency Exchange Rates**: Track historical exchange rates for different currencies
- **Real-time Synchronization**: Automatically syncs country data from the REST Countries API
- **Search and Filter**: Quickly find countries using a command palette interface

The application pulls data from the [REST Countries API](https://restcountries.com/),  [REST Exchange rates API](https://frankfurter.dev/) and maintains a PostgreSQL database for efficient access and caching.

---

Data Flow

1. **Backend Initialization**: When the backend starts, it checks if the database is empty. If so, it fetches countries from REST Countries API and populates the database.
2. **Scheduled Sync**: A cron job is configured to run periodically to fetch and update country data (*Note: Currently under development*).
3. **API Requests**: Frontend makes HTTP requests to NestJS API endpoints to fetch countries and exchange rates.
4. **Frontend Rendering**: React Query manages caching and prefetching; Next.js SSR hydrates initial data for optimal performance.

🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19) with App Router
- **Styling**: Tailwind CSS 4 with custom design system
- **State Management**: TanStack Query (React Query) v5
- **UI Components**: Radix UI primitives, custom components with CVA
- **Mapping**: Leaflet + React Leaflet
- **HTTP Client**: Axios with custom interceptors
- **Icons**: Lucide React
- **Language**: TypeScript 5.9

### Backend
- **Framework**: NestJS 11
- **Database ORM**: TypeORM 0.3
- **Database**: PostgreSQL 16 with pgvector extension
- **Scheduling**: @nestjs/schedule (cron jobs)
- **HTTP Client**: @nestjs/axios (Axios wrapper)
- **Validation**: class-validator + class-transformer
- **Language**: TypeScript 5.7

### Infrastructure
- **Monorepo**: Turborepo 2.5
- **Package Manager**: pnpm 9.0
- **Containerization**: Docker + Docker Compose
- **Node Runtime**: v18+
- **Code Quality**: ESLint 9, Prettier 3


---

## 📦 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **pnpm**: v9.0.0 or higher (`npm install -g pnpm`)
- **Docker & Docker Compose**: Latest version ([Download](https://www.docker.com/))

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/mikisek/country_travel_app.git
cd country_travel_app
```

#### 2. Install Dependencies

Install all dependencies for the monorepo (this will install dependencies for both frontend and backend):

```bash
pnpm install
```

#### 3. Set Up Environment Variables

Create a `.env` file in the `apps/backend/` directory:

```bash
cd apps/backend
```

Add the following environment variables:

```bash
POSTGRES_HOST=database
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=country_travel_db
NODE_ENV=development
REST_COUNTRIES_API_URL=https://restcountries.com/v3.1/all?status=true&fields=name,capital,flag,latlng,currencies
```

#### 4. Start Backend Services with Docker Compose

Navigate to the backend directory and start the database and backend services:

```bash
cd apps/backend
docker-compose up
```

**Wait for the backend to fully initialize.** You should see logs indicating:
- Database connection established
- Countries synced from REST Countries API (on first run)

#### 5. Start Frontend Development Server

Open a new terminal window/tab, navigate to the project root, and run:

```bash
pnpm turbo dev --filter=web
```

This starts the Next.js development server with:
- Frontend running at **http://localhost:3000**
- Hot module replacement (HMR) enabled
- TypeScript type checking
- Fast refresh for React components

#### 6. Access the Application

Open your browser and navigate to:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080



## 📡 API Documentation

### Base URL

```
Development: http://localhost:8080
```

### Endpoints

#### 1. **Get All Countries**

Retrieve a list of all countries in the database.

**Endpoint**: `GET /country`

**Response**:
```
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "United States",
    "capital": "Washington, D.C.",
    "currency": "USD",
    "flag": "🇺🇸",
    "latitude": 38.8951,
    "longitude": -77.0364,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Poland",
    "capital": "Warsaw",
    "currency": "PLN",
    "flag": "🇵🇱",
    ...
  }
]
```

**Status Codes**:
- `200 OK`: Successfully retrieved countries
- `500 Internal Server Error`: Server error

---

#### 2. **Get Country by ID**

Retrieve detailed information about a specific country.

**Endpoint**: `GET /country/:id`

**Parameters**:
- `id` (string, required): UUID of the country

**Example Request**:
```
GET /country/550e8400-e29b-41d4-a716-446655440000
```

**Response**:
```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "United States",
  "capital": "Washington, D.C.",
  "currency": "USD",
  "flag": "🇺🇸",
  "latitude": 38.8951,
  "longitude": -77.0364,
  "rawData": { ... },  // Full REST Countries API response
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

**Status Codes**:
- `200 OK`: Country found
- `404 Not Found`: Country with given ID doesn't exist
- `500 Internal Server Error`: Server error

---

#### 3. **Get Exchange Rate History**

Retrieve historical exchange rates for a specific currency within a date range.

**Endpoint**: `GET /exchange-rates/:currencyCode/history`

**Parameters**:
- `currencyCode` (string, required): Currency code (e.g., "USD", "EUR", "PLN")
- `fromDate` (string, required): Start date (ISO 8601 format: `YYYY-MM-DD`)
- `toDate` (string, required): End date (ISO 8601 format: `YYYY-MM-DD`)

**Example Request**:
```
GET /exchange-rates/USD/history?fromDate=2025-01-01&toDate=2025-01-15
```

**Response**:
```
{
  "currencyCode": "USD",
  "fromDate": "2025-01-01",
  "toDate": "2025-01-15",
  "rates": [
    {
      "date": "2025-01-01",
      "rate": 1.0,
      "baseCurrency": "USD"
    },
    {
      "date": "2025-01-02",
      "rate": 1.01,
      "baseCurrency": "USD"
    },
    ...
  ]
}

```

### 🤔 Assumptions and Trade-offs


1. **Monorepo with Turborepo**
**Assumption**: Frontend and backend should be co-located for easier development and code sharing.

**Rationale**:
- Shared TypeScript types between frontend and backend
- Unified linting and formatting rules
- Single repository for version control
- Turborepo provides caching and parallel execution

**Trade-off**: Slightly more complex initial setup. 

---

#### 2. **Server-Side Rendering with Next.js**
**Assumption**: SEO and initial load performance are important.

**Rationale**:
- Better SEO for country information pages
- Faster initial page load (data prefetched on server)

**Trade-off**: More complex deployment than static site; requires Node.js server.

#### 3. **Data Synchronization Strategy**
**Current Implementation**: Scheduled sync every midnight.

**Assumption**: Country data doesn't change frequently in real-world scenarios.

**Trade-off**: More API calls = higher resource usage vs. data freshness.

#### 4. **React Query for State Management**
**Assumption**: Server state should be managed separately from client state.

**Rationale**:
- Built-in caching, refetching, and background updates
- Reduces boilerplate for API calls
- Excellent TypeScript support
- SSR/SSG compatibility

**Trade-off**: Additional library dependency; learning curve for team members unfamiliar with React Query.

---

#### 5. **Tailwind CSS for Styling**
**Assumption**: Rapid UI development is prioritized over custom design system.

**Rationale**:
- Utility-first approach speeds up development

**Trade-off**: Verbose HTML classes; requires team buy-in on utility-first methodology.

---

#### 6. **Leaflet over Google Maps**
**Assumption**: Open-source mapping library is preferable.

**Rationale**:
- No API key required
- Lightweight and performant
- Highly customizable
- Good React integration via react-leaflet

**Trade-off**: Less polished UI than Google Maps; fewer built-in features (Street View, etc.).


#### 7. **Automatic Database Initialization**
**Decision**: Backend auto-fetches country data on first run if database is empty.

**Rationale**:
- Reduces manual setup steps
- Better developer experience
- Ensures data is always available

**Trade-off**: First startup takes longer; potential for errors if REST Countries API is unavailable.

---

#### 8. **TypeORM Schema Synchronization**
**Current Setting**: `synchronize: true` in development mode.

**Rationale**:
- Auto-creates/updates database schema based on entities
- Speeds up development iteration

**Production Recommendation**: Set to `false` and use migrations.

**Trade-off**: Risk of accidental data loss in production if not disabled.

---

## ⏱️ Time Breakdown

### **Session 1: October 29, 2025 (16:00 - 20:13)

#### Initial Setup & Backend Foundation (16:00 - 19:57) 

- **Project Scaffolding** (~25 min)
  - `16:00` - Turbo monorepo initialization
  - Setting up pnpm workspace
  - Initial project structure

- **Backend Development** (~2.5 hours)
  - NestJS setup and configuration
  - TypeORM configuration
  - Database connection setup
  - Country entity and module
  - REST Countries API integration
  - Docker Compose setup

- **Frontent & integration** (~1 hour)
  - NextJS setup and configuration
  - Api integration
  - Map and markers integration 

#### Documentation (~20 min)

---

### **Session 2: November 2, 2025 (15:02 - 19:59)

#### Backend Enhancements (15:02 - 15:56) - **~1 hour**
- `15:02` - Configuration fixes
- `15:05` - Basic components setup 
- `15:55` - **Currency & Exchange Rates module** 
  - Currency entity creation
  - Exchange rate entity with relationships
  - Historical data service
  - API endpoint with date validation
- `15:56` - Code cleanup (removed unused controller)

#### Frontend Foundation (16:17 - 16:22) - **~20 minutes**
- `16:17` - TypeScript type definitions for web app
- `16:19` - Axios setup and API client configuration
- `16:22` - Loading screen component

#### Core Frontend Features (16:22 - 19:59) - **~3.5 hours**

- **Map Integration & Home Page** (~2.5 hours)
  - `19:36` - Home page with country selector
  - Leaflet/React Leaflet setup
  - Map component with pins
  - Handling SSR issues with dynamic imports
  - Interactive country markers

- **Country Detail Page** (~40 minutes)
  - `19:36` - Country detail page implementation
  - Data fetching with React Query
  - UI components for country information

- **Error Handling** (~20 minutes)
  - `19:59` - Error boundary implementation




