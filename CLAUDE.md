# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WisdomWall is a Next.js 16 application where students can share advice/tips with each other. The app is built with TypeScript, uses PostgreSQL via Prisma ORM, and implements authentication with Better Auth.

## Essential Commands

### Development

```bash
pnpm run dev              # Start Next.js dev server on localhost:3000
pnpm run build            # Build for production
pnpm run start            # Start production server
pnpm run lint             # Run ESLint
```

### Database

```bash
npx prisma migrate dev   # Create and apply new migration
npx prisma migrate reset # Reset database and apply all migrations
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio GUI
npm run seed             # Seed database with sample data
```

## Architecture

### Database Layer

The application uses **Prisma with PostgreSQL**, accessed via the `@prisma/adapter-pg` adapter. Key models:

- **User** - Better Auth user model (email/password auth)
- **Student** - User profile extension with username, position, LinkedIn/GitHub URLs (1:1 with User)
- **Advice** - Main content entity (messages/tips shared by students)
- **AdviceLike** - Many-to-many join table for advice likes
- **AdviceComment** - Comments on advice posts
- **Session, Account, Verification** - Better Auth models

**Important**: Every authenticated user must complete onboarding to create their Student profile. The Student model links to User via `userId` field.

### Authentication Flow

Authentication is handled by **Better Auth** (NOT NextAuth):

1. `app/lib/auth.ts` - Server-side Better Auth instance using Prisma adapter
2. `app/lib/auth-client.ts` - Client-side auth hooks (`useSession`, `signIn`, `signUp`, `signOut`)
3. `app/api/auth/[...all]/route.ts` - Better Auth API routes
4. After sign-up, users are redirected to `/onboarding` to create their Student profile
5. `useStudentProfile` hook checks if Student profile exists, redirects to onboarding if not

### Application Structure

**Route Layout**:

- `/` - Main feed showing all advice posts with sort/filter controls
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/onboarding` - Student profile creation (required after sign-up)

**Key Patterns**:

- Client components use `"use client"` directive (Next.js App Router)
- Session management via Better Auth's `useSession()` hook
- Student profile fetched via `useStudentProfile()` custom hook
- All data fetching from API routes (not direct Prisma calls from client)

### Prisma Client Singleton

The Prisma client is instantiated in `app/lib/prisma.ts` using the PostgreSQL adapter. This singleton should be imported as:

```typescript
import prisma from "./lib/prisma";
```

Always use this shared instance to prevent connection pooling issues.

### API Routes

API routes follow Next.js 13+ App Router conventions (`app/api/*/route.ts`):

- `GET /api/advices` - Fetch all advice with nested student, likes, comments
- `POST /api/student/create` - Create Student profile (requires auth)
- `GET /api/student/me` - Get current user's Student profile

When creating new API routes:

1. Check authentication state when needed using Better Auth session
2. Use Prisma's `include` to fetch related data (avoid N+1 queries)
3. Return `NextResponse.json()` responses

### Type Definitions

Custom types are defined in `app/types/`:

- `app/types/advice.ts` - Advice, AdviceStudent, AdviceLike, AdviceComment interfaces

These mirror Prisma types but are used on the client side.

### Environment Variables

Required in `.env`:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Used by Better Auth client
```

## Important Notes

- The app is in French (UI labels, placeholders)
- Prisma client is generated to `app/generated/prisma/` (not the default location)
- Better Auth is configured for email/password only
- All cascading deletes are configured in Prisma schema (`onDelete: Cascade`)
- The `AdviceForm` component exists but is currently commented out in the main page
