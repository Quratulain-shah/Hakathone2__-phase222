# Implementation Plan: Todo App Phase 2 - Backend API Implementation

**Branch**: `002-backend-api` | **Date**: 2025-12-27 | **Spec**: [specs/002-backend-api/spec.md](specs/002-backend-api/spec.md)
**Input**: Feature specification from `/specs/002-backend-api/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a FastAPI backend API for the Todo App Phase 2, providing secure user-isolated CRUD endpoints for task management. The backend will use SQLModel for database operations, Pydantic for validation, and async patterns throughout. Authentication will be mocked for now with plans to integrate real JWT in the next phase. The API will follow REST conventions with proper error handling and structured responses compatible with the existing frontend.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, Pydantic v2, asyncpg, uvicorn
**Storage**: PostgreSQL (Neon Serverless via SQLAlchemy/SQLModel async engine)
**Testing**: pytest (for backend tests, to be added in later phase)
**Target Platform**: Linux server (containerized deployment ready)
**Project Type**: web (backend API service)
**Performance Goals**: <200ms p95 latency for CRUD operations, handle 1000+ concurrent users
**Constraints**: All routes must be async, user isolation required, structured JSON errors only
**Scale/Scope**: Multi-user support, 10k+ users planned for Phase 3

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Security Compliance
- ✅ User isolation: Every endpoint will validate `path user_id == JWT user_id` (mocked for now)
- ✅ JWT authentication: Required on all /api/ routes via dependency (mock implementation)
- ✅ Input validation: All requests validated via Pydantic schemas
- ✅ Structured JSON errors: Error responses will follow consistent format (code, message, details)
- ✅ No PII in logs: Implementation will follow security rules

### Performance Compliance
- ✅ <200ms p95 latency: Target for CRUD operations
- ✅ Database indexes: Required on user_id, completed, created_at fields
- ✅ No N+1 queries: Will use proper eager loading where needed
- ✅ Async routes: All routes implemented with `async def`

### Tech Stack Compliance
- ✅ Framework: FastAPI (async routes by default)
- ✅ ORM: SQLModel with async sessions
- ✅ Validation: Pydantic v2 for request/response models
- ✅ Authentication: Better Auth planned (mock for now)
- ✅ Database: Neon Serverless PostgreSQL with user-owned tables

### Anti-Pattern Compliance
- ✅ No sync DB calls: All operations will use async sessions
- ✅ No global data access: Every query scoped to authenticated user
- ✅ No unstructured errors: Consistent JSON error format across all endpoints
- ✅ No secrets in code: Environment variables for credentials

### Post-Design Validation
- ✅ All API endpoints follow REST conventions per contract specification
- ✅ Task model includes all required fields and validation rules
- ✅ Error handling strategy implemented as planned
- ✅ Database schema includes required indexes
- ✅ Authentication dependency structure in place for future JWT integration

## Project Structure

### Documentation (this feature)

```text
specs/002-backend-api/
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
├── main.py              # FastAPI app entry point
├── database.py          # Database connection and session management
├── models/
│   ├── __init__.py
│   ├── task.py          # SQLModel Task model
│   └── user.py          # Mock User model
├── schemas/
│   ├── __init__.py
│   ├── task.py          # Pydantic schemas for task operations
│   └── error.py         # Error response schemas
├── routes/
│   ├── __init__.py
│   └── tasks.py         # APIRouter for task endpoints
├── dependencies.py      # Dependency injection functions
├── utils.py             # Utility functions
└── config.py            # Configuration settings
```

**Structure Decision**: Backend-only structure selected as per feature requirements. The backend directory contains all FastAPI application components following the required architecture with models, schemas, routes, and dependencies separated into logical modules.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Mock authentication | Needed for Phase 2 implementation | Real JWT integration deferred to next phase as per spec |
