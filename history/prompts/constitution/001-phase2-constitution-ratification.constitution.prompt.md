---
id: 001
title: Phase 2 Constitution Ratification
stage: constitution
date: 2025-12-26
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: LENOVO X1 YOGA
command: /sp.constitution
labels: ["constitution", "phase2", "full-stack", "governance", "security", "performance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - None (constitution document)
---

## Prompt

```text
                                                                                                      # Todo App Constitution - Phase 2: Full-Stack Web Application

## Purpose (WHY)
This constitution defines the non-negotiable principles, constraints, and standards for Phase 2 of the Todo App. The goal is to transform the in-memory console app from Phase 1 into a secure, multi-user full-stack ent.

**Backend**:
- Python FastAPI – Async routes by default; Pydantic v2 for models/validation.
- ORM: SQLModel – Async sessions; no raw SQL unless performance-critical.
- Authentication: Better Auth with JWT – Shared secret via env var; token expiry (e.g., 7 days) with refresh mechanism.

**Database**:
- Neon Serverless PostgreSQL – Managed service; no local DB for production.
- Schema: User-owned tables with `user_id` FK; indexes on filters (user_id, completed, created_at).
- Migrations: Alembic for schema changes.

**Infrastructure**:
- Moweb application using spec-driven development. All decisions must align with hackathon efficiency, scalability for future phases (e.g., AI chatbot), and zero manual coding—relying on Claude Code, Spec-Kit Plus, and the Agentic Dev Stack workflow (Specify → Plan → Tasks → Implement).

**Core Values**:
- **Spec-Driven Integrity**: No implementation without approved specs. Every line of code traces back to a validated requirement.
- **Security by Default**: User isolation and authentication in every feature to prevent data leaks.
- **Performance First**: Optimize for fast loads and responses, assuming 1k+ users in later phases.
- **Minimalism**: Implement only Phase 2 features (CRUD, auth, filtering/sorting); defer advanced (recurring tasks, reminders) to Phase 5.
- **Reusability & Maintainability**: Clean patterns for easy evolution to Phase 3 AI integration.
- **Hackathon Speed**: Leverage AI tools (Claude Code, Spec-Kit) to minimize iteration time.

## Tech Stack Constraints
**Frontend**:
- Next.js 14norepo: Root with /frontend, /backend, /specs; use Docker Compose for local dev.
- No external libraries beyond specified stack unless justified in specs.

## Security Rules
- **User Isolation**: Every endpoint/query must validate `path user_id == JWT user_id`; 403 on mismatch. No global access.
- **Authentication**: JWT required on all /api/ endpoints; 401 on missing/invalid token. Use Better Auth plugin.
- **Input Validation**: Pydantic for all requests; reject invalid data early with 400/422.
- **Error Handling**: Structured JSON errors (code, message, details); no stack traces or sensitive info leaked.
- **Data Protection**: No PII in logs; encrypt secrets (DB URL, JWT secret) via env vars.
- **Rate Limiting**: Implement on high-risk endpoints (e.g., auth) to prevent abuse.

## Performance Expectations
- **API Response Time**: <200ms p95 for CRUD; use indexes for filtering/sorting.
- **Frontend Load**: <2s FCP; Server Components minimize JS bundle.
- **Database Queries**: No N+1; use eager loading where needed.
- **Scalability Prep**: Design for horizontal scaling (stateless backend); pagination on lists (>50 items).
- **Monitoring**: Log all requests/errors; prepare for Phase 5 with metrics.

## Allowed Patterns
- **Frontend**: Server Actions for mutations; optimistic updates for UI; Suspense for loading; URL params for filters.
- **Backend**: APIRouter for grouping; Depends() for DB/user injection; async def for routes.
- **Database**: SQLModel tables with __table_args__ for indexes/constraints; no stored procedures.
- **Workflow**: Always reference @specs/ in Claude Code; update specs on changes.
- **Testing**: Implicit via AI-generated code; add unit tests in Phase 5.

## Anti-Patterns (Prohibited)
- No direct fetch() in frontend – only /lib/api.ts.
- No sync DB calls in async routes.
- No vague specs – all AC must be SMART.
- No Phase 3 features (e.g., AI chat) in Phase 2.
- No manual code – all via Claude Code.

## Enforcement
- Agents/Skills must reference this constitution in every decision.
- Violations escalate to human review.
- Updates to constitution require full team (or hackathon judge) approval.

This constitution governs Phase 2 only; evolve for Phase 3+ as needed.
```

## Response snapshot

**Constitution Updated Successfully**

Created comprehensive Phase 2 constitution v1.0.0 defining:

**Six Core Principles**:
1. Spec-Driven Integrity - No code without approved specs
2. Security by Default - User isolation and JWT authentication mandatory
3. Performance First - <200ms p95 API, <2s FCP frontend
4. Minimalism - Phase 2 features only (CRUD, auth, filtering)
5. Reusability & Maintainability - Clean patterns for Phase 3 AI
6. Hackathon Speed - AI-assisted development workflow

**Tech Stack Formalized**:
- Frontend: Next.js 14 + Server Components + Tailwind
- Backend: FastAPI + SQLModel + Pydantic v2 + Better Auth
- Database: Neon PostgreSQL + Alembic migrations
- Infrastructure: Monorepo with Docker Compose

**Security Rules Codified**:
- User isolation on every endpoint (path user_id == JWT user_id)
- JWT required on all /api/ routes
- Pydantic validation for all inputs
- Structured JSON errors only
- Rate limiting on auth endpoints

**Anti-Patterns Explicitly Prohibited**:
- No direct fetch() (use /lib/api.ts)
- No sync DB calls in async routes
- No vague specs (SMART criteria required)
- No Phase 3 features in Phase 2
- No manual coding

**Template Consistency Verified**:
- ✅ plan-template.md Constitution Check aligns
- ✅ spec-template.md requirements match security rules
- ✅ tasks-template.md supports Phase 2 structure

**Version**: 1.0.0 | **Ratified**: 2025-12-26

## Outcome

- ✅ Impact: Established foundational governance for Phase 2 development; all future specs/plans/tasks must comply
- 🧪 Tests: N/A (governance document)
- 📁 Files: Created .specify/memory/constitution.md (229 lines)
- 🔁 Next prompts: Create feature specs for Phase 2 CRUD operations; run /sp.specify for first feature
- 🧠 Reflection: Constitution successfully captures hackathon constraints (speed, security, minimalism) while setting clear technical boundaries. The six principles provide actionable guidance without over-specification.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution template validation PASS (all placeholders resolved)
- Prompt variant (if applicable): Standard constitution creation from user specification
- Next experiment (smallest change to try): Validate constitution compliance during first /sp.specify execution
