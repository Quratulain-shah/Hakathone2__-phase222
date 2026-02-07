# Research: Todo App Frontend UI

**Feature**: 001-frontend-ui
**Date**: 2025-12-26
**Purpose**: Resolve technical unknowns and establish best practices for Next.js 14 App Router frontend implementation with mock data

---

## Research Questions & Findings

### 1. Next.js 14 App Router Patterns (Server + Client Components with Optimistic Updates)

**Question**: How should we architect Server Components and Client Components for optimal performance with optimistic UI updates?

**Research Findings**:
- **Server Components** (default): Use for initial data fetch, layouts, static content. Reduces JavaScript bundle size, improves FCP.
- **Client Components** (`"use client"` directive): Required for interactivity (forms, buttons, state, effects, browser APIs).
- **useOptimistic hook**: React 18 experimental hook for instant UI updates before server confirmation. Perfect for CRUD operations with perceived <100ms response.
- **Data flow**: Server Component fetches data → passes to Client Component → Client mutates with Server Actions → `useOptimistic` provides instant feedback.

**Decision**:
- Use Server Components for page routes (/tasks page wrapper)
- Use Client Components for interactive elements (TaskList, TaskCard, forms, modals)
- Implement `useOptimistic` in TaskList for create/update/delete actions
- Server Actions as placeholders (mock implementation, ready for backend swap)

**Rationale**: Maximizes performance (minimal JS), aligns with Next.js 14 best practices, provides instant user feedback per constitution's <100ms requirement.

**Alternatives Considered**:
- **Full Client-Side Rendering**: Rejected - larger bundle, slower FCP, violates constitution's Server Component mandate.
- **Traditional useState without useOptimistic**: Rejected - no instant feedback, violates constitution's optimistic update requirement.

**References**:
- Next.js 14 App Router docs: https://nextjs.org/docs/app
- React useOptimistic RFC: https://github.com/reactjs/rfcs/pull/229

---

### 2. Mock Data Strategy for Realistic UI Behavior

**Question**: What's the best approach for mock data that feels production-ready without backend?

**Research Findings**:
- **In-Memory State**: Use React Context + useState to store mock task array. Data resets on page refresh (acceptable for UI-only phase).
- **Realistic Delays**: Add 50-100ms `setTimeout` in mock API to simulate network latency (tests loading states without blocking).
- **Initial Seed Data**: Pre-populate 5-7 sample tasks on app load for immediate visual feedback.
- **Local Storage Option**: Could persist data across refreshes, but adds complexity and isn't required by spec.

**Decision**:
- TaskContext provides mock CRUD operations wrapping useState
- Mock API in `/lib/api.ts` returns promises with 50ms delay
- Seed 5 initial tasks (mix of pending/completed) on context mount
- No persistence (refresh clears data - acceptable per spec assumptions)

**Rationale**: Simplest approach meeting spec requirements. In-memory state is fast, tests all UI flows, and makes backend swap trivial (replace context with real API calls).

**Alternatives Considered**:
- **Local Storage Persistence**: Rejected - adds complexity, not required by spec, may mask backend integration issues.
- **IndexedDB**: Rejected - overkill for UI-only phase.
- **Static JSON File**: Rejected - doesn't support CRUD mutations.

---

### 3. State Management Approach (Context + useOptimistic)

**Question**: Should we use Context API, Zustand, Redux, or another state solution for managing tasks and auth?

**Research Findings**:
- **React Context API**: Built-in, no dependencies, sufficient for moderate state (tasks, auth, toasts).
- **Zustand**: Lightweight (3KB), simpler API than Redux, good for complex state. Adds dependency.
- **Redux Toolkit**: Powerful but overkill for UI-only mock data. Large bundle, steep learning curve.
- **useOptimistic + Server Actions**: React 18 pattern for optimistic updates without extra state libraries.

**Decision**:
- Use React Context API for AuthContext, TaskContext, ToastContext
- Combine with `useOptimistic` in TaskList for instant CRUD feedback
- URL search params (`useSearchParams`) for filter/sort state
- No external state library

**Rationale**: Zero dependencies, built-in React solution, aligns with minimalism principle. Context is sufficient for ~100 tasks and 3 state domains (auth, tasks, toasts). useOptimistic provides instant feedback without library overhead.

**Alternatives Considered**:
- **Zustand**: Rejected - adds dependency for marginal benefit in UI-only phase. Context is sufficient.
- **Redux**: Rejected - overkill, violates minimalism, larger bundle.
- **Jotai/Recoil**: Rejected - experimental, unnecessary complexity.

---

### 4. Form Validation Patterns (Client-Side, Backend-Ready)

**Question**: How should we validate forms (login, signup, task create/edit) with mock auth but prepare for backend validation?

**Research Findings**:
- **HTML5 Validation**: `required`, `type="email"`, `minLength` attributes. Basic, browser-native.
- **React Hook Form**: Popular library (40KB), handles validation, error messages, submission.
- **Zod + React Hook Form**: TypeScript-first schema validation, reusable across client and backend.
- **Manual useState Validation**: Custom logic, no dependencies, full control.

**Decision**:
- Use controlled inputs with `useState` for form state
- Manual validation logic (check required fields, email format, password strength)
- Display inline error messages below inputs
- Validation triggers on blur and submit
- Prepare for Zod schemas in Phase 2b (can be shared with FastAPI Pydantic)

**Rationale**: Keeps Phase 2 lightweight (no form library dependency). Manual validation is simple for 2-3 fields per form. Zod deferred to Phase 2b when backend validation is added (one schema for client + server).

**Alternatives Considered**:
- **React Hook Form + Zod**: Rejected for Phase 2 - adds dependencies, overkill for mock forms. Will adopt in Phase 2b.
- **Formik**: Rejected - heavier than React Hook Form, less TypeScript support.
- **HTML5 Only**: Rejected - insufficient for password strength, custom error messages.

**References**:
- Zod: https://zod.dev (deferred to Phase 2b)

---

### 5. Responsive Design Strategy (Mobile-First Tailwind)

**Question**: What breakpoints and patterns should we use for mobile/tablet/desktop responsiveness?

**Research Findings**:
- **Tailwind Default Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.
- **Mobile-First Approach**: Write base styles for mobile, use `sm:`, `md:`, etc. for larger screens.
- **Common Patterns**: Hamburger menu < 768px, stacked layout < 768px, multi-column ≥ 768px.
- **Touch Targets**: iOS/Android guidelines recommend min 44px for tappable elements.

**Decision**:
- Use Tailwind's default breakpoints (sm/md/lg/xl)
- Mobile-first: base styles for 320px+, `md:` for tablet (768px+), `lg:` for desktop (1024px+)
- Hamburger menu + slide-out nav for < 768px
- Bottom-fixed "Add Task" button on mobile for easy thumb access
- Ensure all buttons/icons have `min-h-[44px]` and `min-w-[44px]` on mobile

**Rationale**: Standard breakpoints align with industry practices. Mobile-first matches constitution's mobile-first mandate. 44px touch targets meet accessibility guidelines (iOS HIG, Android Material).

**Alternatives Considered**:
- **Custom Breakpoints**: Rejected - Tailwind defaults are well-tested, no need to customize.
- **Desktop-First**: Rejected - violates constitution's mobile-first requirement.

**References**:
- Apple iOS HIG: 44pt minimum touch target
- Android Material: 48dp minimum (roughly 44px at standard density)

---

### 6. Icon Library Selection

**Question**: Which icon library should we use for UI icons (hamburger, edit, delete, checkmark)?

**Research Findings**:
- **Heroicons**: Tailwind's official icons, 292 icons, MIT license, well-designed. 28KB gzipped.
- **Lucide React**: Fork of Feather Icons, 1000+ icons, tree-shakeable, TypeScript support. ~2KB per icon.
- **React Icons**: Aggregates multiple icon sets (Font Awesome, Material, etc.). Large bundle if not careful.
- **Font Awesome**: Popular but heavy, requires CSS, not tree-shakeable by default.

**Decision**:
- Use **Lucide React** for all icons
- Import only needed icons (tree-shaking keeps bundle small)
- Consistent 24px size, stroke-width 2 for visual harmony

**Rationale**: Lucide React offers best tree-shaking (only import what you use), excellent TypeScript support, lightweight, and has all needed icons (Menu, X, Plus, Edit, Trash, Check, ChevronDown).

**Alternatives Considered**:
- **Heroicons**: Rejected - smaller icon set (292 vs 1000+), slightly larger per-icon size.
- **React Icons**: Rejected - risk of accidentally importing large bundles without careful tree-shaking.
- **Font Awesome**: Rejected - heavier, requires CSS, less tree-shakeable.

**References**:
- Lucide React: https://lucide.dev/guide/packages/lucide-react

---

### 7. Toast Notification Approach

**Question**: Should we use a toast library or build a custom solution?

**Research Findings**:
- **React Hot Toast**: Popular (10KB), simple API, customizable. `toast.success("Message")`.
- **React Toastify**: Feature-rich (15KB), multiple positions, progress bars.
- **Custom Context**: Roll your own with ToastContext + portal rendering. Zero dependencies, full control.
- **Sonner**: New library (8KB), beautiful animations, good DX.

**Decision**:
- Build custom ToastContext with queue management
- Render toasts in a portal (fixed top-right position)
- Auto-dismiss after 3 seconds
- Support success, error, info types (color-coded)
- Max 3 toasts visible at once (stack with spacing)

**Rationale**: Custom solution is lightweight (<50 lines), no dependency, meets all spec requirements (success/error/info toasts for CRUD actions). Full control over styling and behavior.

**Alternatives Considered**:
- **React Hot Toast**: Rejected - adds dependency (10KB) for simple use case. Custom solution is lighter.
- **React Toastify**: Rejected - too feature-rich, heavier than needed.
- **Sonner**: Rejected - new library, less battle-tested, adds dependency.

---

### 8. URL State Management for Shareable Filter/Sort Links

**Question**: How should we persist filter and sort state in the URL for shareability?

**Research Findings**:
- **useSearchParams + useRouter**: Next.js 14 hooks for reading/writing URL search params.
- **Query String Pattern**: `/tasks?status=completed&sort=date` is standard, SEO-friendly.
- **Shallow Routing**: `router.push(..., { shallow: true })` prevents full page reload (faster).
- **Default Values**: Omit params for defaults (e.g., `/tasks` = all tasks, sorted by date).

**Decision**:
- Use `useSearchParams` to read `?status=<all|pending|completed>` and `?sort=<date|title>`
- Use `useRouter` to update URL when filters/sort change (shallow routing)
- Defaults: `status=all`, `sort=date` (omit from URL to keep clean)
- TaskFilters and TaskSort components read/write these params

**Rationale**: Standard web pattern, enables bookmarking/sharing specific views, aligns with spec requirement (FR-015). Shallow routing keeps UX snappy without full page reload.

**Alternatives Considered**:
- **Client-Side State Only**: Rejected - violates spec requirement for shareable links (FR-015).
- **Hash Fragments** (`#filter=completed`): Rejected - less semantic, harder to parse, not Next.js convention.

**References**:
- Next.js useSearchParams: https://nextjs.org/docs/app/api-reference/functions/use-search-params

---

## Summary of Key Decisions

| Decision Area | Choice | Rationale |
|---------------|--------|-----------|
| **Architecture** | Server Components + Client Components with useOptimistic | Minimal bundle, instant feedback, aligns with constitution |
| **Mock Data** | React Context + useState, 50ms delay, 5 seed tasks | Simplest approach, no persistence needed, easy backend swap |
| **State Management** | React Context API (Auth, Task, Toast) + useOptimistic | Zero dependencies, sufficient for scope, built-in React |
| **Form Validation** | Manual useState validation, prepare Zod for Phase 2b | Lightweight for mock forms, Zod deferred for client+server sharing |
| **Responsive Design** | Tailwind mobile-first, default breakpoints, 44px touch targets | Industry standard, accessibility compliant, mobile-first mandate |
| **Icons** | Lucide React | Lightweight, tree-shakeable, TypeScript support, 1000+ icons |
| **Toasts** | Custom ToastContext | Zero dependencies, full control, <50 lines, meets all requirements |
| **URL State** | useSearchParams + useRouter (shallow) | Standard pattern, shareable links, spec requirement (FR-015) |

---

## Technology Stack Summary

**Core Framework**:
- Next.js 14.x (App Router)
- React 18.x (Server Components + useOptimistic)
- TypeScript 5.x

**Styling**:
- Tailwind CSS 3.x
- PostCSS (Tailwind dependency)

**Icons**:
- Lucide React (tree-shakeable)

**Dependencies** (minimal per constitution's minimalism principle):
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

**No Additional Libraries Needed**:
- ❌ State management (Redux, Zustand) - Context API sufficient
- ❌ Form library (React Hook Form, Formik) - Manual validation for Phase 2
- ❌ Toast library (React Hot Toast, Toastify) - Custom implementation
- ❌ UI component library (MUI, Chakra) - Custom Tailwind components

---

## Best Practices Applied

1. **Performance**: Server Components for initial render, Client Components only where needed, tree-shaking icons
2. **Accessibility**: WCAG AA contrast, 44px touch targets, semantic HTML, ARIA labels, keyboard nav
3. **Maintainability**: Clear component hierarchy, typed interfaces, future-proof patterns (Server Actions)
4. **Minimalism**: Zero unnecessary dependencies, spec-driven scope, mock data avoids backend complexity
5. **Developer Experience**: TypeScript for safety, Tailwind for speed, clear file structure

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| useOptimistic is experimental | May change in React 19 | Use stable fallback (immediate setState), document upgrade path in Phase 2b |
| Mock data doesn't test real errors | Backend issues missed | Document error handling patterns in contracts, implement in Phase 2b |
| No form library may cause validation duplication | More code to maintain | Keep validation logic in reusable functions, adopt Zod in Phase 2b |
| Custom toast may miss edge cases | Toast bugs | Thorough testing, consider library in Phase 2b if issues arise |

---

## Next Phase Prerequisites

All research questions resolved. Ready to proceed to **Phase 1: Data Model & API Contracts**.

**Generated Artifacts**:
- ✅ All NEEDS CLARIFICATION items resolved
- ✅ Technology stack defined
- ✅ Best practices documented
- ✅ Risks identified and mitigated

**Status**: ✅ **Complete** - Proceed to data-model.md and contracts/
