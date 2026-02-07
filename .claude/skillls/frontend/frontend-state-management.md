---
name: frontend-state-management
description: "Authoritative guide for managing state in Todo App Phase 2 Next.js 14 frontend using Server Components first, React Server Actions, minimal client state, optimistic updates, and centralized API client patterns."
version: "1.0"
tags: ["frontend", "nextjs", "state-management", "react", "server-actions", "optimistic-ui"]
author: "Spec-Kit Plus Intelligence Architect"
type: skill
complexity: high
decision_points: 7
---

# Frontend State Management Skill

## Metadata
- **Version**: 1.0
- **Created**: 2025-12-26
- **Category**: Frontend Architecture
- **Complexity Level**: High (7 decision points)
- **Reusability**: Cross-project (any Next.js 14 App Router project with full-stack integration)

## Description

This skill defines the mandatory patterns for state management in Todo App Phase 2 Next.js 14 frontend. It prioritizes Server Components and React Server Actions for data mutations, minimizes client-side state, leverages centralized /lib/api.ts for fetching, and enables optimistic updates for instant UI feedback while maintaining data consistency with the FastAPI backend.

## When to Use This Skill

**Apply when:**
- Designing data flow for new features (task CRUD, filtering, auth)
- Implementing forms, lists, or interactive components
- Managing loading, error, success states
- Handling mutations (create/update/delete tasks)
- Optimizing re-renders and hydration

**Skip when:**
- Pure static pages with no data
- Server-only logic (no UI state)
- Backend or database state management

## Persona

You are a **Senior Next.js Architect** who manages state with the discipline of a performance engineer and the pragmatism of a full-stack developer. You think systematically about:

- **Server-First State**: Data lives on the server; client state is transient
- **Minimal Client Bloat**: Avoid heavy libraries (no Redux, no Zustand unless justified)
- **Instant Feedback**: Optimistic updates make the app feel native
- **Consistency Guarantee**: Server Actions ensure eventual consistency
- **Error Resilience**: Graceful recovery with preserved user intent

Your goal is to deliver a snappy, reliable UI that:
- Loads fast (minimal JS)
- Feels instant (optimistic + loading states)
- Stays in sync with backend
- Recovers from errors without data loss

## Analytical Questions

Before approving state management design, systematically analyze:

### 1. Server vs Client State Balance
- Is primary data fetched in Server Components?
- Is client state limited to UI concerns (form inputs, open modals, selected tabs)?
- Are Server Actions used for all mutations?
- Is revalidation triggered after mutations?

### 2. Data Fetching Strategy
- Are initial data loads in Server Components (no client fetch on mount)?
- Is /lib/api.ts used exclusively for any client-side fetches?
- Are loading states handled with Suspense or skeletons?
- Is error boundary used for fetch failures?

### 3. Form & Mutation Handling
- Are forms submitted via Server Actions (not client POST)?
- Is form state managed with useState only for uncontrolled inputs?
- Are pending states shown during submission?
- Is optimistic update implemented for list mutations?

### 4. Global vs Local State
- Is auth state (current user) passed via Server Component props?
- Are filters/sorting stored in URL search params (for shareable links)?
- Is toast/notification state managed minimally (local or simple context)?
- No global stores unless cross-page persistence required?

### 5. Optimistic Updates & Sync
- For list mutations, is UI updated immediately?
- Is revalidatePath or revalidateTag called after action?
- On error, is optimistic update rolled back?
- Does UI reflect server truth after revalidation?

### 6. Error & Loading States
- Are async states (loading, error, success) clearly visible?
- Is form data preserved on error?
- Are retry mechanisms provided for failed actions?
- Is fallback UI shown during Suspense?

### 7. Performance & Re-renders
- Are components memoized where needed?
- Is unnecessary re-fetching prevented (stale-while-revalidate pattern)?
- Are keys stable for list rendering?
- Is hydration mismatch avoided?

## Decision Principles

Apply these frameworks when implementing state:

### 1. State Hierarchy Rule
**Principle**: Push state to the server whenever possible

**Preferred Order**:
1. Server Component props (initial data)
2. URL search params (filters, pagination)
3. Server Actions (mutations + revalidation)
4. Local useState (form inputs, UI toggles)
5. Context (only for deeply nested auth/toast)

**Never** use global client stores for server-managed data.

### 2. Server Action Pattern
**Principle**: All mutations via Server Actions

```tsx
// app/tasks/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { api } from '@/lib/api'

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  // optimistic return or throw for error
  await api.createTask({ title })
  revalidatePath('/tasks')
}
```

```tsx
// Client component form
<form action={createTask}>
  <input name="title" />
  <button type="submit" disabled={isPending}>Create</button>
</form>
```

### 3. Optimistic Update Pattern
**Principle**: Update UI first, sync later

```tsx
'use client'

import { useOptimistic } from 'react'
import { createTask } from '@/app/tasks/actions'

export function TaskCreator({ tasks }: { tasks: Task[] }) {
  const [optimisticTasks, addOptimistic] = useOptimistic(tasks)

  const formAction = async (formData: FormData) => {
    const newTask = { id: Date.now(), title: formData.get('title'), completed: false }
    addOptimistic([...optimisticTasks, newTask])
    await createTask(formData)
  }

  return (
    <>
      <form action={formAction}>...</form>
      <TaskList tasks={optimisticTasks} />
    </>
  )
}
```

### 4. Loading & Error State Standards
**Principle**: Always communicate async status

- Suspense + skeleton for initial load
- Pending state for actions (disabled button + spinner)
- Error boundary with retry
- Toast for success/error messages

### 5. Filter & Pagination via URL
**Principle**: Shareable and bookmarkable state

```tsx
// Use searchParams for filters
const searchParams = useSearchParams()
const status = searchParams.get('status') || 'all'

// Update with <Link href="?status=completed">
```

## Usage Example

**Scenario**: Implementing task creation with optimistic update

**Invocation**:
```
Apply frontend-state-management skill to task creation form and list
```

**Expected Output**:
```
=== STATE MANAGEMENT REVIEW ===
Feature: Create Task

--- DATA FLOW ---
✓ Initial tasks from Server Component
✓ Form state local useState
✓ Mutation via Server Action
✓ Optimistic update with useOptimistic
✓ revalidatePath on success

--- STATES HANDLED ---
✓ Loading: skeleton list
✓ Pending: disabled button
✓ Success: toast + list update
✓ Error: rollback optimistic + toast

--- VERDICT ---
APPROVE – Fully server-first, instant feel, resilient
```

## Self-Check Validation

After implementation, verify:

- [ ] Server Components for initial data
- [ ] Server Actions for all mutations
- [ ] Minimal client state (no heavy libraries)
- [ ] Optimistic updates for list changes
- [ ] Loading/pending states visible
- [ ] Error recovery with preserved input
- [ ] URL params for filters/pagination
- [ ] No unnecessary re-renders
- [ ] revalidate after mutations
- [ ] Consistent with /lib/api.ts usage

## Integration with SDD Workflow

**In Implement Phase**:
- Apply with frontend-component-design
- Validate data flow before styling

**With Other Skills**:
- Builds on frontend-component-design
- Uses backend routes via Server Actions

**Pre-Deploy Gate**:
- All interactive features pass state review

## Common Mistakes This Skill Prevents

1. **Client Overfetching**: Fetching data in useEffect
2. **No Optimistic UI**: Delayed feedback on actions
3. **Heavy Client State**: Redux for server data
4. **Lost Form Data**: Reset on error
5. **Stale Data**: No revalidation after mutation
6. **Hydration Errors**: Server/client mismatch

## Skill Evolution Notes

**Future enhancements**:
- React Cache integration
- Partial revalidation strategies
- Offline support with IndexedDB sync
- Real-time with WebSockets (Phase 3)

---

**Skill Status**: Production Ready
**Last Updated**: 2025-12-26
**Maintenance**: Review with Next.js updates
```
