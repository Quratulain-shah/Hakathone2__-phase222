---
id: 0001
title: Frontend UI Planning
stage: plan
date: 2025-12-26
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-frontend-ui
branch: 001-frontend-ui
user: LENOVO X1 YOGA
command: /sp.plan
labels: ["plan", "frontend", "nextjs", "architecture", "mock-data", "react"]
links:
  spec: specs/001-frontend-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-frontend-ui/plan.md
 - specs/001-frontend-ui/research.md
 - specs/001-frontend-ui/data-model.md
 - specs/001-frontend-ui/contracts/mock-api.md
 - specs/001-frontend-ui/quickstart.md
tests:
 - None (planning documents)
---

## Prompt

```text
Frontend UI Implementation from @specs/features/frontend-ui.md

# Plan: Todo App Phase 2 - Frontend UI Technical Architecture

## Objective
Create a detailed technical plan for implementing the complete frontend UI with:
- Next.js 14 App Router + React Server Components
- Mock data with optimistic UI
- Full CRUD operations
- Filtering, sorting, responsive design
- Authentication pages (mock)

[User provided high-level structure outline for components, state management, routing, styling, accessibility, and tasks breakdown]
```

## Response snapshot

**Comprehensive Frontend UI Implementation Plan Created**

**Branch**: `001-frontend-ui`
**Plan File**: `specs/001-frontend-ui/plan.md` (375 lines)

### Planning Artifacts Generated

**1. Implementation Plan** (`plan.md`):
- ✅ Technical Context: TypeScript 5.x, Next.js 14, React 18, Tailwind CSS 3.x, Lucide React
- ✅ Constitution Check: All 6 principles validated (Spec-Driven, Security, Performance, Minimalism, Maintainability, Speed)
- ✅ Project Structure: Detailed file tree for `/frontend` directory (App Router, components by type, lib, contexts, hooks, types)
- ✅ Component Hierarchy: RootLayout → Header → Pages (login/signup/tasks) → TaskList → TaskCard/TaskForm/Filters
- ✅ State Management: React Context (Auth/Task/Toast) + useOptimistic for instant feedback + URL params for filter/sort
- ✅ Development Workflow: 9-phase implementation order (setup → infrastructure → layout → auth → tasks → filters → responsive → polish → testing)

**2. Research Document** (`research.md`):
- 8 research questions addressed with decisions, rationale, alternatives
- Key decisions: Server + Client Components with useOptimistic, in-memory mock data (50ms delay), React Context API (zero deps), manual form validation (Zod deferred to Phase 2b), Tailwind mobile-first, Lucide React icons, custom ToastContext, URL search params
- Technology stack summary: Next.js 14, React 18, TypeScript 5, Tailwind 3, Lucide React only (minimal dependencies)
- Risks & mitigations documented (useOptimistic experimental, mock data limitations)

**3. Data Model** (`data-model.md`):
- 4 core entities defined: Task (id, title, description, status, timestamps), User (mock, id, name, email, avatar), FilterState (status, sort), UIState (modals, toasts, loading)
- TypeScript interfaces for all entities
- Validation rules (client-side): title 1-200 chars, email format, password strength
- State transitions documented (pending ↔ completed, modal open/close, toast lifecycle)
- Mock seed data (5 sample tasks for immediate visual feedback)
- Phase 2 vs Phase 2b differences table (in-memory vs PostgreSQL, mock vs real JWT)

**4. API Contracts** (`contracts/mock-api.md`):
- Mock API specification with 50ms simulated latency
- Auth operations: POST /api/auth/login, POST /api/auth/signup, POST /api/auth/logout
- Task operations: GET /api/tasks (with filter/sort params), POST /api/tasks, PATCH /api/tasks/:id, DELETE /api/tasks/:id
- Standardized error response format (code, message, fields)
- Mock implementation examples in `/lib/api.ts` and `/lib/actions.ts` (Server Actions)
- Phase 2b migration path documented (replace mock with real FastAPI fetch calls + JWT headers)

**5. Quickstart Guide** (`quickstart.md`):
- Prerequisites checklist (Node 18+, npm 9+)
- Step-by-step setup: create Next.js app, install deps (lucide-react), directory structure
- Configuration files (tsconfig, tailwind.config, next.config)
- Development workflow (npm run dev, type checking, linting)
- Implementation order (aligned with plan.md phases)
- Testing checklist (auth flow, task management, filtering, responsive, accessibility, edge cases)
- Troubleshooting common issues
- Useful commands reference

### Constitution Compliance Verification

✅ **All 6 Principles Met**:
1. Spec-Driven Integrity: Approved spec.md, references acceptance criteria
2. Security by Default: Auth UI present, mock validation (real JWT in Phase 2b)
3. Performance First: Server Components, <2s FCP, useOptimistic <100ms response
4. Minimalism: Only P1-P3 features, no Phase 3 scope creep, zero unnecessary deps
5. Reusability: Server Actions pattern, clean component hierarchy, shared types
6. Hackathon Speed: Claude Code workflow, Tailwind rapid styling, mock data enables parallel dev

✅ **Tech Stack Constraints**: Next.js 14 ✓, Server Components ✓, Tailwind ✓, TypeScript ✓, /lib/api.ts ✓

✅ **Allowed Patterns**: Server Actions (placeholder), useOptimistic, URL params, Suspense

✅ **Anti-Patterns Avoided**: No direct fetch outside /lib/api.ts, no Phase 3 features, no manual coding

**Gate Status**: ✅ PASS - Ready for task generation

### Architecture Highlights

**Component Hierarchy**:
```
RootLayout (Server)
├── Header (Client - nav state)
└── Pages
    ├── / (redirect)
    ├── /login (LoginForm)
    ├── /signup (SignupForm)
    └── /tasks (Server wrapper)
        └── TaskList (Client + useOptimistic)
            ├── TaskFilters, TaskSort
            ├── TaskCard[], TaskForm, DeleteConfirm, EmptyState
```

**Data Flow**:
1. Server Component fetches mock data → hydrates Client Components
2. User actions → Server Actions → useOptimistic instant UI update → mock API confirms (50ms)
3. Filter/sort → URL params update → Server re-renders
4. Modals/toasts → Client contexts

**Directory Structure**: `/frontend/src` with app/ (routes), components/ (ui/layout/tasks/auth), lib/ (api, actions, utils), contexts/, hooks/, types/

### Ready for Next Phase

**Status**: ✅ **Complete** - All planning artifacts generated and validated

**Next Command**: `/sp.tasks` - Generate atomic, dependency-ordered implementation tasks

## Outcome

- ✅ Impact: Complete architectural blueprint for frontend UI; enables immediate implementation via /sp.tasks → /sp.implement workflow
- 🧪 Tests: Constitution Check PASS (6/6 principles), all gates validated, no violations
- 📁 Files: Generated plan.md (375 lines), research.md (8 decisions), data-model.md (4 entities), contracts/mock-api.md (8 endpoints), quickstart.md (10 sections)
- 🔁 Next prompts: Run /sp.tasks to convert plan into atomic implementation tasks; then /sp.implement for execution
- 🧠 Reflection: Plan successfully balances comprehensiveness with actionability. Mock data strategy enables rapid UI iteration without backend blockers while maintaining patterns for Phase 2b backend swap. Component hierarchy and state management decisions align with Next.js 14 best practices and constitution constraints.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution Check PASS (6/6 principles validated), Technical Context complete (no NEEDS CLARIFICATION), Project Structure detailed (Web App Option 2 selected)
- Prompt variant (if applicable): Standard /sp.plan workflow with user-provided architectural outline
- Next experiment (smallest change to try): Proceed to /sp.tasks; validate task atomicity and dependency ordering against component hierarchy defined in plan
