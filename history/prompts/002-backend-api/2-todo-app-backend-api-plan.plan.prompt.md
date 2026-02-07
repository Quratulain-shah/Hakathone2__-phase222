---
id: 2
title: Todo App Backend API Plan
stage: plan
date: 2025-12-27
surface: agent
model: Claude Sonnet 4.5
feature: 002-backend-api
branch: 002-backend-api
user: LENOVO X1 YOGA
command: /sp.plan
labels: [backend,api,plan,architecture]
links:
  spec: specs/002-backend-api/spec.md
  plan: specs/002-backend-api/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-backend-api/plan.md
 - specs/002-backend-api/research.md
 - specs/002-backend-api/data-model.md
 - specs/002-backend-api/quickstart.md
 - specs/002-backend-api/contracts/task-api.yaml
 - .specify/memory/constitution.md
tests:
 - specs/002-backend-api/research.md
 - specs/002-backend-api/data-model.md
 - specs/002-backend-api/contracts/task-api.yaml
---

## Prompt

Todo App Phase 2 - Backend API Implementation from @specs/002-backend-api/spec.md

# Plan: Todo App Phase 2 - FastAPI Backend Technical Architecture

## Objective
Create a detailed technical plan for implementing the FastAPI backend API as specified. Focus on secure user-isolated CRUD endpoints, async patterns, SQLModel integration, and preparation for real JWT in next phase.

## Key Constraints from Constitution & Spec
- Async routes everywhere
- User isolation (path user_id + mock current_user check)
- Pydantic validation + structured errors
- SQLModel models with indexes
- No real JWT yet – mock dependency
- Ready for frontend /lib/api.ts consumption

## Required Plan Sections

### 1. File & Directory Structure
Define exact backend/ structure:
- backend/main.py (FastAPI app)
- backend/database.py (AsyncSession dependency)
- backend/models/task.py (SQLModel Task)
- backend/models/user.py (mock User)
- backend/schemas/task.py (Pydantic Create/Update/Response)
- backend/routes/tasks.py (APIRouter with all CRUD)
- backend/dependencies.py (get_current_user mock, get_db)
- backend/utils.py (error helpers if needed)

### 2. Database Schema & Models
- Task table: id, user_id (FK), title, description, completed, created_at, updated_at
- Indexes: user_id, completed, created_at
- SQLModel with __table_args__

### 3. API Route Design
- APIRouter prefix="/api/v1/{user_id}/tasks"
- Dependency chain: get_db + get_current_user (mock)
- User isolation: if current_user.id != user_id → 403
- Async CRUD operations

### 4. Error Handling Strategy
- Structured JSON errors
- HTTPException for 400, 403, 404
- Pydantic auto 422

### 5. Mock Authentication
- get_current_user returns fixed User(id=1) for testing
- Ready to swap with real JWT dependency later

### 6. Tasks Breakdown
Generate atomic tasks:
- T-001: Setup FastAPI app
- T-002: Database connection
- T-003: SQLModel models
- etc.

Plan must be complete for immediate implementation using backend agents.

## Response snapshot

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

## Outcome

- ✅ Impact: Created comprehensive technical plan with architecture decisions, data models, API contracts, and implementation structure
- 🧪 Tests: All constitutional compliance checks passed with proper validation
- 📁 Files: Generated plan.md, research.md, data-model.md, quickstart.md, and contracts/task-api.yaml
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Plan aligns with spec requirements and constitutional principles, ready for implementation

## Evaluation notes (flywheel)

- Failure modes observed: None - all constitutional gates passed
- Graders run and results (PASS/FAIL): PASS - all compliance checks validated
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to task generation with /sp.tasks