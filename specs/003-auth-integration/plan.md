# Implementation Plan: Todo App Authentication Integration

**Branch**: `003-auth-integration` | **Date**: 2025-12-27 | **Spec**: specs/003-auth-integration/spec.md
**Input**: Feature specification from `/specs/003-auth-integration/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement real authentication using Better Auth (v0.4+) with JWT plugin on Next.js frontend and FastAPI backend with JWT verification middleware. Replace mock authentication with production-ready system that enforces user isolation across all API endpoints. The system will use shared BETTER_AUTH_SECRET, store JWT tokens in localStorage, and implement proper session management.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript/JavaScript (frontend Next.js 14)
**Primary Dependencies**: FastAPI, Better Auth v0.4+, SQLModel, Pydantic v2, Next.js 14 with App Router
**Storage**: PostgreSQL (Neon Serverless) with user-scoped data
**Testing**: pytest (backend), Next.js testing (frontend)
**Target Platform**: Web application (frontend: browser, backend: Linux server)
**Project Type**: Web application (full-stack)
**Performance Goals**: <200ms p95 for JWT verification, 99% successful authentication requests
**Constraints**: JWT in localStorage (simple for hackathon), 7-day token expiry, all endpoints require authentication validation, strict user isolation (path user_id == JWT user_id)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Security by Default**:
- ✅ All API endpoints will validate `path user_id == JWT user_id` and return 403 on mismatch
- ✅ JWT required on all /api/ routes; return 401 on missing/invalid tokens
- ✅ Input validation via Pydantic schemas for all requests
- ✅ Structured JSON errors only (code, message, details); no stack traces
- ✅ No PII in logs; secrets stored only in environment variables
- ✅ Rate limiting will be implemented on authentication endpoints

**Performance First**:
- ✅ API p95 latency target <200ms for JWT verification operations
- ✅ Database queries will use indexes for filtering/sorting
- ✅ No N+1 query patterns expected with proper async sessions
- ✅ Frontend will use Server Components where appropriate

**Tech Stack Constraints**:
- ✅ Using Next.js 14 with App Router (frontend)
- ✅ Using FastAPI with async routes (backend)
- ✅ Using SQLModel for ORM (backend)
- ✅ Using Pydantic v2 for request/response models
- ✅ Using Better Auth with JWT for authentication (per spec)
- ✅ Using centralized /lib/api.ts for all backend calls
- ✅ Using APIRouter for endpoint grouping
- ✅ Using FastAPI Depends() for dependency injection

## Project Structure

### Documentation (this feature)

```text
specs/003-auth-integration/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── main.py              # FastAPI application entry point
├── config.py            # Application settings including JWT secret
├── database.py          # Database connection utilities
├── models/
│   ├── __init__.py
│   ├── user.py          # User model for Better Auth integration
│   └── task.py          # Task model with user_id foreign key
├── schemas/
│   ├── __init__.py
│   ├── user.py          # User schemas for registration/login
│   ├── task.py          # Task schemas
│   └── auth.py          # Authentication-related schemas
├── routes/
│   ├── __init__.py
│   ├── auth.py          # Authentication endpoints
│   └── tasks.py         # Task endpoints with user isolation
├── dependencies.py      # Dependency injection functions including auth validation
├── middleware/
│   ├── __init__.py
│   └── auth.py          # JWT verification middleware
└── utils.py             # Utility functions

frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...auth]/
│   │   │           └── route.ts  # Better Auth API routes
│   │   ├── login/
│   │   │   └── page.tsx   # Login page
│   │   ├── signup/
│   │   │   └── page.tsx   # Signup page
│   │   └── tasks/
│   │       └── page.tsx   # Tasks page with auth guard
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   └── guards/
│   │       └── AuthGuard.tsx
│   ├── lib/
│   │   ├── api.ts       # API client with JWT token attachment
│   │   └── auth.ts      # Authentication utilities
│   ├── hooks/
│   │   └── useAuth.ts   # Authentication hook
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── types/
│   │   ├── auth.ts      # Authentication-related types
│   │   └── user.ts      # User-related types
│   └── styles/
├── package.json         # Dependencies including better-auth
├── next.config.js       # Next.js configuration
└── .env.local           # Environment variables
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| JWT in localStorage | Simple implementation for hackathon | httpOnly cookies would require more complex server-side setup |
