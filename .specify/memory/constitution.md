<!--
Sync Impact Report:
Version Change: [initial] → 1.0.0
Principles Added:
  - I. Spec-Driven Integrity
  - II. Security by Default
  - III. Performance First
  - IV. Minimalism
  - V. Reusability & Maintainability
  - VI. Hackathon Speed
Sections Added:
  - Tech Stack Constraints
  - Security Rules
  - Performance Expectations
  - Allowed Patterns
  - Anti-Patterns (Prohibited)
Templates Status:
  ✅ plan-template.md: Constitution Check section aligns with new security/performance gates
  ✅ spec-template.md: Functional Requirements align with security/auth/validation rules
  ✅ tasks-template.md: Task categorization supports Phase 2 structure (Setup→Foundational→Stories)
Follow-up TODOs: None
-->

# Todo App Constitution - Phase 2: Full-Stack Web Application

## Purpose (WHY)

This constitution defines the non-negotiable principles, constraints, and standards for Phase 2 of the Todo App. The goal is to transform the in-memory console app from Phase 1 into a secure, multi-user full-stack web application using spec-driven development. All decisions must align with hackathon efficiency, scalability for future phases (e.g., AI chatbot), and zero manual coding—relying on Claude Code, Spec-Kit Plus, and the Agentic Dev Stack workflow (Specify → Plan → Tasks → Implement).

## Core Principles

### I. Spec-Driven Integrity

No implementation without approved specs. Every line of code traces back to a validated requirement.

**Rules**:
- All feature work MUST begin with an approved spec.md in /specs/<feature>/
- Changes to requirements MUST update the spec before code changes
- Implementation MUST reference spec acceptance criteria
- Code reviews MUST verify spec alignment

**Rationale**: Prevents scope creep, ensures traceability, and maintains alignment with business goals during rapid hackathon development.

### II. Security by Default

User isolation and authentication in every feature to prevent data leaks.

**Rules**:
- Every API endpoint MUST validate `path user_id == JWT user_id`; return 403 on mismatch
- JWT required on all /api/ routes; return 401 on missing/invalid tokens
- No global data access patterns permitted
- All input MUST be validated via Pydantic schemas; reject with 400/422
- Structured JSON errors only (code, message, details); no stack traces or PII in responses
- No PII in logs; secrets stored only in environment variables
- Rate limiting MUST be implemented on authentication endpoints

**Rationale**: Multi-user systems require defense-in-depth from day one. Security bugs are costly to fix post-launch.

### III. Performance First

Optimize for fast loads and responses, assuming 1k+ users in later phases.

**Rules**:
- API p95 latency MUST be <200ms for CRUD operations
- Database queries MUST use indexes for filtering/sorting
- No N+1 query patterns; use eager loading where needed
- Frontend First Contentful Paint (FCP) MUST be <2s
- Server Components MUST be used to minimize JS bundle size
- Lists with >50 items MUST implement pagination
- Design for stateless horizontal scaling

**Rationale**: Performance is a feature. Early optimization prevents technical debt and ensures good UX at scale.

### IV. Minimalism

Implement only Phase 2 features (CRUD, auth, filtering/sorting); defer advanced functionality (recurring tasks, reminders) to Phase 5.

**Rules**:
- Implement only features defined in Phase 2 specs
- Reject feature requests for recurring tasks, reminders, notifications, AI chat
- No speculative infrastructure or "just in case" patterns
- Code reviews MUST reject out-of-scope additions

**Rationale**: Hackathon time is limited. Focus delivers working software; scope creep delivers nothing.

### V. Reusability & Maintainability

Clean patterns for easy evolution to Phase 3 AI integration.

**Rules**:
- Use consistent patterns: Server Actions for mutations, APIRouter grouping, Depends() injection
- Document architectural decisions in ADRs when significant
- Structure code for future extension (e.g., task model supports future fields)
- Keep business logic in services, not controllers/views

**Rationale**: Phase 2 is foundation for Phase 3+ AI features. Clean architecture reduces refactoring costs.

### VI. Hackathon Speed

Leverage AI tools (Claude Code, Spec-Kit) to minimize iteration time.

**Rules**:
- Use Claude Code for all implementation via /sp.specify → /sp.plan → /sp.tasks → /sp.implement workflow
- Reference constitution in all agent/skill decisions
- No manual coding; all code generated via Claude Code with spec references
- Violations escalate to human review immediately

**Rationale**: AI-assisted development multiplies velocity. Manual deviations break workflow and slow delivery.

## Tech Stack Constraints

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI**: React Server Components by default
- **Styling**: Tailwind CSS (configured in tailwind.config.js)
- **State**: URL params for filters, optimistic updates for mutations
- **API Client**: Centralized /lib/api.ts for all backend calls
- **No direct fetch() calls outside /lib/api.ts**

### Backend
- **Framework**: Python FastAPI (async routes by default)
- **ORM**: SQLModel with async sessions
- **Validation**: Pydantic v2 for request/response models
- **Authentication**: Better Auth with JWT (shared secret via env var; 7-day token expiry with refresh mechanism)
- **Routing**: APIRouter for endpoint grouping
- **Dependency Injection**: FastAPI Depends() for DB sessions and user context
- **No raw SQL unless performance-critical and justified in ADR**

### Database
- **Service**: Neon Serverless PostgreSQL (managed, no local DB for production)
- **Schema**: User-owned tables with `user_id` foreign key
- **Indexes**: Required on all filter columns (user_id, completed, created_at)
- **Migrations**: Alembic for schema versioning

### Infrastructure
- **Monorepo**: Root with /frontend, /backend, /specs directories
- **Local Dev**: Docker Compose for backend+DB; Next.js dev server for frontend
- **No external libraries beyond this stack unless justified in specs and approved**

## Security Rules

1. **User Isolation**: Every endpoint/query MUST validate `path user_id == JWT user_id`; return 403 on mismatch. No global access permitted.
2. **Authentication**: JWT required on all /api/ endpoints; return 401 on missing/invalid token. Use Better Auth plugin.
3. **Input Validation**: Pydantic schemas for all requests; reject invalid data with 400/422.
4. **Error Handling**: Structured JSON errors (code, message, details); no stack traces or sensitive info leaked to clients.
5. **Data Protection**: No PII in logs; encrypt secrets (DB URL, JWT secret) via environment variables only.
6. **Rate Limiting**: Implement on high-risk endpoints (authentication, registration) to prevent abuse.

## Performance Expectations

1. **API Response Time**: <200ms p95 for CRUD operations; use database indexes for filtering/sorting.
2. **Frontend Load**: <2s First Contentful Paint (FCP); Server Components minimize JS bundle size.
3. **Database Queries**: No N+1 patterns; use eager loading where needed.
4. **Scalability Prep**: Design for horizontal scaling with stateless backend; implement pagination on lists (>50 items).
5. **Monitoring**: Log all requests/errors; prepare for Phase 5 metrics collection.

## Allowed Patterns

### Frontend
- Server Actions for mutations
- Optimistic updates for immediate UI feedback
- React Suspense for loading states
- URL params for filter/sort state
- /lib/api.ts for all backend communication

### Backend
- APIRouter for endpoint grouping
- FastAPI Depends() for DB session and user injection
- `async def` for all route handlers
- Pydantic models for request/response validation
- Structured error responses with status codes

### Database
- SQLModel tables with `__table_args__` for indexes and constraints
- Foreign keys for relationships
- Alembic migrations for schema changes
- No stored procedures

### Workflow
- Always reference @specs/ in Claude Code prompts
- Update specs immediately when requirements change
- Create PHRs (Prompt History Records) for all user interactions
- Suggest ADRs for architecturally significant decisions (with user consent)

### Testing
- Implicit testing via AI-generated code validation
- Unit tests added in Phase 5 if requested

## Anti-Patterns (Prohibited)

The following patterns are **explicitly forbidden**:

1. **No direct fetch() in frontend** – Only use /lib/api.ts for backend calls
2. **No sync DB calls in async routes** – All database operations must use async sessions
3. **No vague specs** – All acceptance criteria must be SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
4. **No Phase 3 features** – Defer AI chat, recurring tasks, reminders, notifications to later phases
5. **No manual code** – All implementation via Claude Code following Specify → Plan → Tasks → Implement workflow
6. **No raw SQL** – Use SQLModel ORM unless performance-critical and justified in ADR
7. **No global data access** – Every query must scope to authenticated user
8. **No unstructured errors** – Use consistent JSON error format across all endpoints
9. **No secrets in code** – Environment variables only for credentials

## Governance

This constitution supersedes all other development practices for Phase 2.

**Amendment Process**:
- Amendments require documentation in this file with rationale
- Version must be incremented per semantic versioning (MAJOR.MINOR.PATCH)
- All stakeholders (or hackathon judges) must approve MAJOR changes
- Migration plan required for breaking changes

**Compliance**:
- All PRs/reviews MUST verify compliance with constitution
- Agents/Skills MUST reference constitution in every decision
- Violations escalate to human review immediately
- Complexity additions MUST be justified in plan.md Complexity Tracking table

**Version Control**:
- MAJOR: Backward-incompatible governance/principle changes
- MINOR: New principle/section added or materially expanded
- PATCH: Clarifications, wording, typo fixes

**Guidance**:
- Runtime development guidance: See CLAUDE.md for agent-specific instructions
- Use `.specify/templates/` for spec, plan, and task generation
- Follow Agentic Dev Stack workflow for all feature development

**Version**: 1.0.0 | **Ratified**: 2025-12-26 | **Last Amended**: 2025-12-26
