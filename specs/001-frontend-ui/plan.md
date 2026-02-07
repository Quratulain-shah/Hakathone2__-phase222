# Implementation Plan: Todo App Frontend UI

**Branch**: `001-frontend-ui` | **Date**: 2025-12-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-frontend-ui/spec.md`

**Note**: This plan focuses exclusively on frontend UI implementation with mock data. Backend integration (FastAPI, PostgreSQL, JWT) will be addressed in a separate specification (Phase 2b).

## Summary

Implement a complete, production-ready frontend user interface for the Todo App using Next.js 14 App Router with React Server Components. The UI will demonstrate full CRUD functionality, filtering, sorting, authentication pages, and responsive design using mock data and optimistic UI patterns. All interactions will feel production-ready while using in-memory state, preparing the codebase for seamless backend integration in the next phase.

**Key Technical Approach**: Leverage Next.js 14 App Router with Server Components for initial rendering, Client Components with `useOptimistic` for instant user feedback, URL search params for shareable filter state, and Tailwind CSS for responsive, accessible styling.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14 (App Router)
**Primary Dependencies**: Next.js 14, React 18, Tailwind CSS 3.x, Lucide React (icons)
**Storage**: In-memory state (React Context + useState) with mock data; no persistence (page refresh clears data)
**Testing**: Manual UI testing via browser; automated tests deferred to Phase 5 per constitution
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge); responsive design for mobile/tablet/desktop
**Project Type**: Web application (frontend-only monorepo structure)
**Performance Goals**: <2s First Contentful Paint, <100ms UI response time, 60fps animations
**Constraints**: <200ms p95 for UI interactions, WCAG AA accessibility, mobile-first responsive (min 320px width)
**Scale/Scope**: ~15 components, 4 pages/routes, 4 prioritized user stories, mock data for 0-100 tasks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Spec-Driven Integrity
- [x] Feature has approved spec.md in /specs/001-frontend-ui/
- [x] Implementation will reference spec acceptance criteria
- [x] All user stories (P1-P3) documented with testable scenarios

### ✅ Principle II: Security by Default
- [x] Authentication UI present (login/signup pages)
- [x] Mock auth state (no real JWT yet - acceptable for UI-only phase)
- [x] Input validation on forms (client-side, will add backend validation in Phase 2b)
- [x] No PII exposure (mock user data only)
- **Note**: Real JWT validation, user isolation, and rate limiting deferred to Phase 2b (backend integration)

### ✅ Principle III: Performance First
- [x] Server Components for initial render (minimize JS bundle)
- [x] Optimistic UI for instant feedback (<100ms perceived response)
- [x] Target <2s FCP per constitution
- [x] No N+1 patterns (mock data in memory, no queries)
- [x] Pagination ready (UI components support it; enforced when backend added)

### ✅ Principle IV: Minimalism
- [x] Only P1-P3 features from spec (CRUD, filter/sort, auth UI, responsive)
- [x] No recurring tasks, reminders, notifications, AI chat, search
- [x] Mock data approach avoids backend complexity in this phase

### ✅ Principle V: Reusability & Maintainability
- [x] Server Actions for mutations (placeholder pattern ready for backend)
- [x] Clean component hierarchy (atoms → molecules → organisms)
- [x] Shared types (/types/task.ts) for future backend contract alignment
- [x] /lib/api.ts placeholder structure for backend swap-in

### ✅ Principle VI: Hackathon Speed
- [x] Claude Code workflow: spec → plan → tasks → implement
- [x] Tailwind for rapid styling
- [x] Mock data enables parallel frontend/backend development

### 🔒 Tech Stack Constraints
- [x] Next.js 14 App Router ✓
- [x] React Server Components ✓
- [x] Tailwind CSS ✓
- [x] TypeScript ✓
- [x] Centralized /lib/api.ts (mock) ✓

### ✅ Allowed Patterns
- [x] Server Actions for mutations (placeholder)
- [x] Optimistic updates (useOptimistic)
- [x] URL params for state (filter/sort)
- [x] Suspense for loading

### ✅ Anti-Patterns (Prohibited)
- [x] No direct fetch() outside /lib/api.ts
- [x] No Phase 3 features
- [x] No manual coding (all via Claude Code)

**Gate Status**: ✅ **PASS** - All constitution requirements met for UI-only phase. Security and backend constraints will be enforced in Phase 2b.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-ui/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 research output
├── data-model.md        # Phase 1 data model (UI entities)
├── quickstart.md        # Phase 1 development guide
├── contracts/           # Phase 1 mock API contracts
│   └── mock-api.md      # Mock API interface documentation
└── checklists/
    └── requirements.md  # Spec quality validation
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with header
│   │   ├── page.tsx             # Root redirect to /login or /tasks
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page
│   │   └── tasks/
│   │       └── page.tsx         # Main task list page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx       # Reusable button component
│   │   │   ├── Input.tsx        # Form input component
│   │   │   ├── Modal.tsx        # Modal dialog component
│   │   │   ├── Toast.tsx        # Toast notification component
│   │   │   ├── Skeleton.tsx     # Loading skeleton component
│   │   │   └── Badge.tsx        # Status badge component
│   │   ├── layout/
│   │   │   ├── Header.tsx       # App header with navigation
│   │   │   ├── MobileNav.tsx    # Mobile hamburger menu
│   │   │   └── Footer.tsx       # Optional footer
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx     # Task list container (Client)
│   │   │   ├── TaskCard.tsx     # Individual task card
│   │   │   ├── TaskForm.tsx     # Create/edit task form modal
│   │   │   ├── DeleteConfirm.tsx# Delete confirmation modal
│   │   │   ├── TaskFilters.tsx  # Filter buttons (All/Pending/Completed)
│   │   │   ├── TaskSort.tsx     # Sort dropdown
│   │   │   └── EmptyState.tsx   # No tasks empty state
│   │   └── auth/
│   │       ├── LoginForm.tsx    # Login form component
│   │       └── SignupForm.tsx   # Signup form component
│   ├── lib/
│   │   ├── api.ts               # Mock API client (placeholder for backend)
│   │   ├── actions.ts           # Server Actions (create/update/delete tasks)
│   │   └── utils.ts             # Utility functions (formatDate, truncate, etc.)
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Mock auth state provider
│   │   ├── TaskContext.tsx      # Task state provider (mock data)
│   │   └── ToastContext.tsx     # Toast notification state
│   ├── hooks/
│   │   ├── useAuth.tsx          # Mock auth hook
│   │   ├── useTasks.tsx         # Task operations hook (CRUD)
│   │   └── useToast.tsx         # Toast notification hook
│   ├── types/
│   │   ├── task.ts              # Task interface
│   │   ├── user.ts              # User interface (mock)
│   │   └── api.ts               # API response types
│   └── styles/
│       └── globals.css          # Tailwind imports + custom styles
├── public/
│   └── images/                  # Icons, logos, empty state illustrations
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies
```

**Structure Decision**: Web application structure (Option 2) selected. Frontend-only for this phase, located in `/frontend` directory. Backend will be added in separate `/backend` directory in Phase 2b. This monorepo structure aligns with constitution's infrastructure constraints and supports parallel development.

**Key Directories**:
- `/app`: Next.js 14 App Router pages and layouts
- `/components`: Organized by UI hierarchy (ui/layout/tasks/auth)
- `/lib`: API client, Server Actions, utilities
- `/contexts` & `/hooks`: State management for mock data and auth
- `/types`: Shared TypeScript interfaces for future backend alignment

## Complexity Tracking

> **No violations** - All constitution constraints met. Mock data approach simplifies this phase while maintaining patterns for Phase 2b backend integration.

---

## Phase 0: Research & Technology Decisions

**Status**: ✅ Complete (see [research.md](./research.md))

### Research Questions Addressed

1. **Next.js 14 App Router patterns** for Server Components + Client Components with optimistic updates
2. **Mock data strategy** for realistic UI behavior without backend
3. **State management approach** for in-memory task data with context and useOptimistic
4. **Form validation patterns** for client-side validation ready for backend extension
5. **Responsive design strategy** for mobile-first Tailwind implementation
6. **Icon library selection** (Lucide React for lightweight, tree-shakeable icons)
7. **Toast notification approach** (lightweight custom context vs library)
8. **URL state management** for shareable filter/sort links

### Key Decisions

See [research.md](./research.md) for detailed findings, rationale, and alternatives considered.

---

## Phase 1: Data Model & API Contracts

**Status**: ✅ Complete (see [data-model.md](./data-model.md) and [contracts/](./contracts/))

### Data Model

See [data-model.md](./data-model.md) for detailed entity definitions, state transitions, and validation rules.

**Key Entities**:
- **Task**: Core todo item with title, description, status, created date, ID
- **User** (Mock): Auth state for UI display
- **FilterState**: Current filter (all/pending/completed) and sort (date/title)
- **UIState**: Modal visibility, loading states, toast queue

### API Contracts

See [contracts/mock-api.md](./contracts/mock-api.md) for mock API interface documentation, including:
- Task CRUD operations (create, read, update, delete)
- Filter and sort operations
- Mock auth operations (login, signup, logout)
- Response formats and error handling patterns

**Note**: These contracts define the interface that will be replaced with real FastAPI endpoints in Phase 2b.

---

## Phase 2: Implementation Readiness

**Prerequisites**: ✅ research.md, data-model.md, contracts/ complete

### Component Hierarchy

```
RootLayout (Server Component)
├── Header (Client - nav state)
└── Page Routes
    ├── / (redirect logic)
    ├── /login (Client - LoginForm)
    ├── /signup (Client - SignupForm)
    └── /tasks (Server Component wrapper)
        └── TaskList (Client - useOptimistic)
            ├── TaskFilters (Client)
            ├── TaskSort (Client)
            ├── TaskCard[] (Client - each card)
            ├── TaskForm (Client modal)
            ├── DeleteConfirm (Client modal)
            └── EmptyState (Client)
```

### Data Flow

1. **Initial Load**: Server Component fetches mock data → hydrates Client Components
2. **User Actions**: Client Components call Server Actions → `useOptimistic` updates UI immediately → mock "API" confirms
3. **Filtering/Sorting**: URL search params update → Server Component re-renders with new data
4. **Modals/Toasts**: Client-side state managed via contexts

### State Management Strategy

- **Mock Task Data**: TaskContext provides CRUD operations, wraps useState with mock array
- **Optimistic Updates**: `useOptimistic` hook for create/update/delete immediate feedback
- **URL State**: `useSearchParams` + `useRouter` for filter (status) and sort (date/title) persistence
- **Form State**: Local `useState` in forms with controlled inputs
- **Toast State**: ToastContext with queue, auto-dismiss after 3s
- **Mock Auth**: AuthContext with session storage (persists across page nav, cleared on logout/refresh)

### Routing Strategy

- **App Router**: Leverages Next.js 14 file-based routing
- **Server Components**: Default for all pages, fetch mock data server-side
- **Client Components**: Marked with "use client" for interactivity (forms, lists, modals)
- **Protected Routes**: Middleware or layout-level check redirects to /login if not "authenticated" (mock check)
- **URL Parameters**: `/tasks?status=completed&sort=date` for shareable state

### Styling Approach

- **Tailwind CSS**: Utility-first styling with custom theme configuration
- **Mobile-First**: Base styles for mobile, `sm:`, `md:`, `lg:` breakpoints for larger screens
- **Component Variants**: Button (primary/secondary/danger), Badge (pending/completed), Input (default/error)
- **Animations**: `transition-all duration-200` for hover/focus states, `animate-pulse` for skeletons
- **Dark Mode**: Not implemented in Phase 2 (deferred per spec Out of Scope)

### Accessibility Strategy

- **Semantic HTML**: `<button>`, `<form>`, `<main>`, `<nav>`, `<h1-h6>` hierarchy
- **ARIA Labels**: `aria-label` for icon buttons, `aria-live` for toast announcements
- **Keyboard Navigation**: Tab order, Enter to submit, Escape to close modals, focus trap in modals
- **Color Contrast**: WCAG AA minimum 4.5:1 for text, 3:1 for large text/graphics
- **Focus Indicators**: Visible focus rings on all interactive elements

---

## Development Workflow

### 1. Project Initialization
- Create Next.js 14 app with TypeScript and Tailwind
- Configure `tsconfig.json`, `tailwind.config.js`, `next.config.js`
- Install dependencies: `lucide-react` (icons)
- Set up directory structure per plan

### 2. Core Infrastructure
- Create shared types (`/types/task.ts`, `/types/user.ts`)
- Implement contexts (AuthContext, TaskContext, ToastContext)
- Build base UI components (`Button`, `Input`, `Modal`, `Toast`, `Skeleton`, `Badge`)
- Set up `/lib/api.ts` mock API client
- Create `/lib/actions.ts` Server Actions placeholders

### 3. Layout & Navigation
- Implement RootLayout with Header
- Build MobileNav with hamburger menu
- Add responsive breakpoints and navigation logic

### 4. Authentication Pages (P3)
- Build /login page with LoginForm
- Build /signup page with SignupForm
- Implement form validation (client-side)
- Add mock auth logic in AuthContext
- Test redirect flow (/ → /login or /tasks based on auth state)

### 5. Task Management UI (P1)
- Build /tasks page (Server Component wrapper)
- Implement TaskList (Client Component with useOptimistic)
- Create TaskCard with toggle completion, edit, delete actions
- Build TaskForm modal (create/edit modes)
- Add DeleteConfirm modal
- Implement EmptyState component
- Add toast notifications for all actions

### 6. Filtering & Sorting (P2)
- Build TaskFilters component (All/Pending/Completed buttons)
- Build TaskSort dropdown (Date/Title)
- Implement URL search param logic
- Test filter/sort combinations with URL sharing

### 7. Responsive Design (P2)
- Test all breakpoints (320px, 375px, 768px, 1024px, 1440px)
- Add mobile-specific elements (bottom-fixed add button, hamburger menu)
- Verify touch target sizes (min 44px)
- Test keyboard navigation on all devices

### 8. Polish & Edge Cases
- Add skeleton loading states
- Handle empty filter results
- Implement text truncation for long titles/descriptions
- Add smooth animations and transitions
- Test rapid clicks and double-submission prevention

### 9. Validation & Testing
- Manual test all user stories (P1, P2, P3)
- Verify acceptance criteria from spec.md
- Check accessibility (keyboard nav, screen reader, contrast)
- Test performance (FCP < 2s, interactions < 100ms)
- Validate against constitution constraints

---

## Next Steps

1. **Run `/sp.tasks`**: Generate atomic, dependency-ordered implementation tasks from this plan
2. **Run `/sp.implement`**: Execute tasks in order with Claude Code
3. **Phase 2b (Future)**: Create separate spec for backend integration (FastAPI, PostgreSQL, JWT, real API calls)

---

## Quick Reference

**Feature Branch**: `001-frontend-ui`
**Spec**: [spec.md](./spec.md)
**Research**: [research.md](./research.md)
**Data Model**: [data-model.md](./data-model.md)
**Contracts**: [contracts/mock-api.md](./contracts/mock-api.md)
**Quickstart**: [quickstart.md](./quickstart.md)

**Constitution Compliance**: ✅ All principles and constraints met
**Ready for Tasks**: ✅ Yes - proceed to `/sp.tasks`
