# Data Model: Todo App Frontend UI

**Feature**: 001-frontend-ui
**Date**: 2025-12-26
**Purpose**: Define UI entities, relationships, validation rules, and state transitions for frontend implementation

**Note**: This data model focuses on frontend UI state. Backend database schema will be defined in Phase 2b (backend integration spec).

---

## Core Entities

### 1. Task

Represents a single todo item in the application.

**Attributes**:
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | string (UUID) | Yes | Unique identifier | Generated client-side for mock data; will be server-generated in Phase 2b |
| `title` | string | Yes | 1-200 characters | Task title, truncated with ellipsis in list view if > 50 chars |
| `description` | string | No | 0-5000 characters | Optional task details, truncated to 100 chars in card view |
| `status` | enum | Yes | "pending" \| "completed" | Task completion state |
| `createdAt` | Date (ISO 8601) | Yes | Valid timestamp | Creation timestamp, used for default sort order (newest first) |
| `updatedAt` | Date (ISO 8601) | No | Valid timestamp | Last modification timestamp (optional, not displayed in Phase 2) |

**TypeScript Interface**:
```typescript
// /types/task.ts
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string; // ISO 8601 date string
  updatedAt?: string; // ISO 8601 date string
}
```

**Validation Rules**:
- `title`: Required, trimmed, 1-200 characters after trim
- `description`: Optional, 0-5000 characters
- `status`: Must be exactly "pending" or "completed" (enum enforced)
- `createdAt`: Immutable after creation, must be valid ISO 8601 string
- `id`: Immutable after creation, must be unique UUID v4

**State Transitions**:
```
[Create] → pending
pending → completed (toggle completion)
completed → pending (toggle completion)
[Any State] → [Deleted] (soft delete via removal from array)
```

**Business Rules**:
- New tasks always start with `status: "pending"`
- Tasks can be toggled between pending and completed any number of times
- Editing a task updates `updatedAt` but not `createdAt`
- Deleting a task removes it from the array (no soft delete in Phase 2)

---

### 2. User (Mock)

Represents the authenticated user for UI display and mock auth state.

**Attributes**:
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | string (UUID) | Yes | Unique identifier | Mock user ID (hardcoded in Phase 2) |
| `name` | string | Yes | 1-100 characters | Display name for header/avatar |
| `email` | string | Yes | Valid email format | Email address (validated on signup form) |
| `avatar` | string (URL) | No | Valid URL or null | Profile picture URL (optional, can use initials fallback) |

**TypeScript Interface**:
```typescript
// /types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

**Validation Rules** (Client-Side Only in Phase 2):
- `name`: Required, trimmed, 1-100 characters
- `email`: Required, must match email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `password` (signup form only, not stored): Minimum 8 characters, at least one letter and one number

**Mock Auth State**:
```typescript
// /types/auth.ts
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
```

**State Transitions**:
```
[Initial] → Not Authenticated (user: null)
Not Authenticated → Authenticated (login/signup) → user populated
Authenticated → Not Authenticated (logout) → user cleared
```

---

### 3. FilterState

Represents the current filter and sort selection for the task list.

**Attributes**:
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `status` | enum | Yes | "all" \| "pending" \| "completed" | Active filter (default: "all") |
| `sort` | enum | Yes | "date" \| "title" | Active sort order (default: "date") |

**TypeScript Interface**:
```typescript
// /types/filter.ts
export type FilterStatus = 'all' | 'pending' | 'completed';
export type SortOption = 'date' | 'title';

export interface FilterState {
  status: FilterStatus;
  sort: SortOption;
}
```

**URL Mapping**:
- `/tasks` → `{ status: "all", sort: "date" }` (defaults, not in URL)
- `/tasks?status=completed` → `{ status: "completed", sort: "date" }`
- `/tasks?status=pending&sort=title` → `{ status: "pending", sort: "title" }`

**Business Rules**:
- Defaults: `status="all"`, `sort="date"` (newest first)
- URL params override defaults
- Invalid URL params fall back to defaults
- Changing filter/sort updates URL (shallow routing, no page reload)

---

### 4. UIState

Represents ephemeral UI state (modals, toasts, loading indicators).

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `modals.taskForm.isOpen` | boolean | Yes | Task create/edit modal visibility |
| `modals.taskForm.mode` | enum | Yes | "create" \| "edit" |
| `modals.taskForm.task` | Task \| null | Conditional | Task being edited (null for create mode) |
| `modals.deleteConfirm.isOpen` | boolean | Yes | Delete confirmation modal visibility |
| `modals.deleteConfirm.taskId` | string \| null | Conditional | Task ID to delete (null when closed) |
| `toasts` | Toast[] | Yes | Queue of toast notifications (max 3 visible) |
| `loading.isSubmitting` | boolean | Yes | Form submission in progress (disable buttons) |

**TypeScript Interfaces**:
```typescript
// /types/ui.ts
export type ModalMode = 'create' | 'edit';

export interface TaskFormModal {
  isOpen: boolean;
  mode: ModalMode;
  task: Task | null;
}

export interface DeleteConfirmModal {
  isOpen: boolean;
  taskId: string | null;
}

export interface Toast {
  id: string; // UUID for key prop
  type: 'success' | 'error' | 'info';
  message: string;
  duration: number; // milliseconds until auto-dismiss (default 3000)
}

export interface UIState {
  modals: {
    taskForm: TaskFormModal;
    deleteConfirm: DeleteConfirmModal;
  };
  toasts: Toast[];
  loading: {
    isSubmitting: boolean;
  };
}
```

**State Transitions**:
- **TaskForm Modal**: Closed → Open (create mode, task=null) → Closed (submit/cancel)
- **TaskForm Modal**: Closed → Open (edit mode, task=<Task>) → Closed (submit/cancel)
- **DeleteConfirm Modal**: Closed → Open (taskId=<id>) → Closed (confirm/cancel)
- **Toasts**: Empty → Add toast (push to queue, max 3) → Auto-dismiss after 3s → Remove from queue
- **Loading**: false → true (form submit) → false (submit complete or error)

**Business Rules**:
- Only one modal open at a time (task form or delete confirm)
- Max 3 toasts visible (oldest auto-dismissed if 4th added)
- Toasts auto-dismiss after 3 seconds (user can manually dismiss early)
- Loading state disables submit buttons and shows spinner
- Modals close on Escape key or clicking outside modal area

---

## Relationships

```
User (1) ───── has many ───── Tasks (N)
             (mock, not enforced in Phase 2)

Task (N) ───── filtered by ───── FilterState (1)
             (client-side filtering)

UIState (1) ───── controls ───── Modal states (N)
                              └── Toast queue (N)
```

**Notes**:
- User-Task relationship is mock in Phase 2 (all tasks belong to single hardcoded user)
- Phase 2b will enforce user isolation (JWT user_id → tasks.user_id FK)
- FilterState is derived from URL params, not stored in database
- UIState is ephemeral, never persisted

---

## Data Flows

### 1. Task Creation Flow

```
User fills TaskForm (mode: create)
  ↓
Validates title (required, 1-200 chars)
  ↓
Submits form → Server Action (mock)
  ↓
useOptimistic: Immediately adds pending task to UI
  ↓
Mock API resolves after 50ms
  ↓
Confirm task added to TaskContext state
  ↓
Show success toast: "Task created"
  ↓
Close modal
```

### 2. Task Toggle Completion Flow

```
User clicks checkbox on TaskCard
  ↓
useOptimistic: Immediately toggles status in UI
  ↓
Server Action (mock) called
  ↓
Mock API resolves after 50ms
  ↓
Confirm status toggled in TaskContext state
  ↓
Badge color updates (yellow → green or vice versa)
```

### 3. Task Deletion Flow

```
User clicks delete icon on TaskCard
  ↓
Open DeleteConfirm modal with taskId
  ↓
User confirms deletion
  ↓
useOptimistic: Immediately removes task from UI
  ↓
Server Action (mock) called
  ↓
Mock API resolves after 50ms
  ↓
Confirm task removed from TaskContext state
  ↓
Show success toast: "Task deleted"
  ↓
Close modal
```

### 4. Filter/Sort Flow

```
User clicks filter button (e.g., "Completed")
  ↓
Update URL: /tasks?status=completed
  ↓
Server Component re-renders with new params
  ↓
Filter tasks client-side: tasks.filter(t => t.status === 'completed')
  ↓
Re-render TaskList with filtered subset
  ↓
Active button highlighted (blue bg)
```

---

## Mock Data Seed

Initial tasks loaded on TaskContext mount (for immediate visual feedback):

```typescript
const seedTasks: Task[] = [
  {
    id: '1',
    title: 'Build the frontend UI',
    description: 'Implement all pages, components, and interactions with mock data',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Setup Next.js project',
    description: 'Initialize Next.js 14 with TypeScript and Tailwind CSS',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: '3',
    title: 'Create component library',
    description: 'Build reusable Button, Input, Modal, Toast components',
    status: 'pending',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: '4',
    title: 'Design responsive layouts',
    description: 'Ensure mobile, tablet, and desktop views work correctly',
    status: 'pending',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
  {
    id: '5',
    title: 'Write feature specification',
    description: '',
    status: 'completed',
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
  },
];
```

---

## Validation Summary

### Client-Side Validation (Phase 2)

| Entity | Field | Validation |
|--------|-------|------------|
| Task | title | Required, 1-200 characters after trim |
| Task | description | Optional, max 5000 characters |
| Task | status | Enum: "pending" \| "completed" |
| User | name | Required, 1-100 characters |
| User | email | Required, valid email format |
| User | password (signup) | Min 8 chars, at least 1 letter + 1 number |

### Server-Side Validation (Phase 2b - Future)

Backend will enforce:
- User isolation (JWT user_id matches task.user_id)
- Input sanitization (prevent XSS, SQL injection)
- Rate limiting (prevent abuse)
- Database constraints (unique IDs, foreign keys)

---

## Index Strategy (Future - Phase 2b)

When backend is added, recommended indexes:

```sql
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC);
CREATE INDEX idx_tasks_user_status_created ON tasks(user_id, status, created_at DESC);
```

**Rationale**: Supports fast filtering (by user, by status) and sorting (by created date) per constitution's performance requirements (<200ms p95).

---

## Phase 2 vs Phase 2b Differences

| Aspect | Phase 2 (Frontend UI) | Phase 2b (Backend Integration) |
|--------|----------------------|-------------------------------|
| **Storage** | In-memory (React Context + useState) | PostgreSQL database |
| **User Isolation** | Mocked (single hardcoded user) | Enforced (JWT user_id validation) |
| **Validation** | Client-side only | Client + Server (Pydantic) |
| **Task IDs** | Client-generated UUIDs | Server-generated UUIDs |
| **API** | Mock (50ms delay) | Real FastAPI endpoints |
| **Persistence** | None (refresh clears data) | Persistent (database) |

---

## Status

✅ **Complete** - Data model defined for frontend UI state. Ready for contract generation.

**Next**: Generate API contracts in `contracts/mock-api.md`
