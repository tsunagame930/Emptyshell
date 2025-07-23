# Emptyshell Optician Dashboard

## Overview

This is a professional optician partner interface for the Emptyshell platform, built as a React-based dashboard similar to Pennylane's design. The application allows opticians to manage client requests, optical savings accounts (cagnottes), payments, deliveries, inventory, and their profile information.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Registration Form Validation (2025-01-23)
- Updated registration schema to make most fields required except SIRET
- Modified frontend form to show required validation for: nom, prenom, email, telephone, adresse, ville, codePostal
- SIRET field marked as optional in both backend validation and UI label
- Fixed JWT token generation TypeScript errors
- Fixed profile update form TypeScript issues

### Logo Navigation Enhancement (2025-01-23)
- Made Emptyshell logo in sidebar clickable to navigate back to dashboard
- Added hover effect for better user experience

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful API with structured route handlers
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Middleware**: CORS enabled, request logging, error handling

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless driver with WebSocket support

## Key Components

### Authentication System
- JWT token-based authentication
- Secure password hashing with bcryptjs
- Protected routes with authentication middleware
- User session management via localStorage

### Layout Components
- **Sidebar**: Fixed navigation with active state indicators
- **Header**: Page title, user profile, and notifications
- **DataTable**: Reusable table component for listing data
- **CardStat**: Dashboard statistics cards with icons and trends

### Page Structure
- `/dashboard` - Overview with statistics and charts
- `/demandes` - Client submissions (prescription + insurance)
- `/cagnottes` - Optical savings accounts management
- `/paiements` - Payment tracking and outstanding balances
- `/livraisons` - Delivery management
- `/produits` - Inventory management (frames/lenses)
- `/profil` - Optician profile settings

### Data Models
- **Opticiens**: Optician profile and business information
- **ClientSubmissions**: Customer requests with file uploads
- **Cagnottes**: Optical savings accounts with collection tracking
- **Paiements**: Payment records and status tracking
- **Livraisons**: Delivery orders and status updates
- **Produits**: Inventory items (frames, corrective lenses, sunglasses)

## Data Flow

### Authentication Flow
1. User submits login credentials
2. Server validates credentials and generates JWT
3. Token stored in localStorage for subsequent requests
4. Protected routes validate token via Authorization header
5. User profile data cached in localStorage

### API Request Flow
1. Frontend makes authenticated requests with Bearer token
2. Auth middleware validates JWT and extracts user context
3. Controllers handle business logic with database operations
4. Responses include appropriate status codes and error handling
5. React Query manages caching and synchronization

### File Upload Flow
- Prescription and insurance document uploads
- File validation and storage handling
- Metadata stored in database with file references

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant management

### Data and State
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for type safety

### Backend Dependencies
- **Express.js**: Web application framework
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **cors**: Cross-origin resource sharing
- **Drizzle ORM**: Type-safe database ORM

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server with TypeScript compilation via tsx
- Environment variables for database connection
- Development-specific error overlays and debugging

### Production Build
1. Frontend built with Vite to `dist/public`
2. Backend compiled with ESBuild to `dist/index.js`
3. Static file serving for built frontend assets
4. Environment-based configuration for database and CORS

### Database Management
- Schema changes managed through Drizzle migrations
- Connection pooling via Neon serverless
- Environment variable configuration for database URL

### Security Considerations
- JWT secret key configuration
- Password hashing with salt rounds
- CORS configuration for allowed origins
- Input validation with Zod schemas
- Protected API routes with authentication middleware