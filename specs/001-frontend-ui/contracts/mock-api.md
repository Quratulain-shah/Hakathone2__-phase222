# Mock API Contracts: Todo App Frontend UI

**Feature**: 001-frontend-ui
**Date**: 2025-12-26
**Purpose**: Define mock API interface for frontend implementation (to be replaced with real FastAPI in Phase 2b)

**Note**: This is a mock API specification. All operations simulate network delays (50ms) and return promises. Real API calls will be implemented in Phase 2b.

---

## Base Configuration

**Mock API Client**: `/lib/api.ts`
**Response Format**: JSON
**Simulated Latency**: 50ms (realistic network delay for testing loading states)
**Error Handling**: Mock errors for form validation, network simulation

---

## Authentication Operations

### POST /api/auth/login (Mock)

**Purpose**: Simulate user login (sets mock auth state)

**Request**:
```typescript
{
  email: string;    // Email address
  password: string; // Password (not validated in mock)
}
```

**Success Response** (200 OK):
```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  token: string; // Mock JWT (not used in Phase 2)
}
```

**Error Responses**:
- **400 Bad Request**: Invalid email format or empty fields
  ```typescript
  {
    error: {
      code: "VALIDATION_ERROR",
      message: "Email and password are required",
      fields: {
        email?: string; // Field-specific error
        password?: string;
      }
    }
  }
  ```

- **401 Unauthorized**: Invalid credentials (mock check: any email with password length >= 8 succeeds)
  ```typescript
  {
    error: {
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password"
    }
  }
  ```

**Mock Implementation Notes**:
- Any email + password >= 8 chars → success
- Returns hardcoded user: `{ id: "user-1", name: "Demo User", email: <input_email> }`
- Stores user in AuthContext + sessionStorage
- 50ms delay to simulate network

---

### POST /api/auth/signup (Mock)

**Purpose**: Simulate user registration (sets mock auth state)

**Request**:
```typescript
{
  name: string;     // Full name
  email: string;    // Email address
  password: string; // Password (min 8 chars, 1 letter + 1 number)
}
```

**Success Response** (201 Created):
```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  token: string; // Mock JWT (not used in Phase 2)
}
```

**Error Responses**:
- **400 Bad Request**: Validation errors
  ```typescript
  {
    error: {
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      fields: {
        name?: "Name is required";
        email?: "Invalid email format";
        password?: "Password must be at least 8 characters with 1 letter and 1 number";
      }
    }
  }
  ```

- **409 Conflict**: Email already exists (mock check: always returns success in Phase 2)
  ```typescript
  {
    error: {
      code: "EMAIL_EXISTS",
      message: "Email already registered"
    }
  }
  ```

**Mock Implementation Notes**:
- Validates email format, password strength client-side
- Always succeeds (no actual DB check for duplicate emails in Phase 2)
- Returns user with input data: `{ id: uuid(), name, email }`
- Stores user in AuthContext + sessionStorage
- 50ms delay

---

### POST /api/auth/logout (Mock)

**Purpose**: Clear auth state (client-side only in Phase 2)

**Request**: None (no body)

**Success Response** (200 OK):
```typescript
{
  success: true
}
```

**Mock Implementation Notes**:
- Clears AuthContext state (`user: null, isAuthenticated: false`)
- Clears sessionStorage
- Redirects to /login
- 50ms delay

---

## Task Operations

### GET /api/tasks (Mock)

**Purpose**: Fetch all tasks for authenticated user

**Request**: None (user_id implicit from auth context in Phase 2b)

**Query Params** (Optional):
- `status`: "all" | "pending" | "completed" (default: "all")
- `sort`: "date" | "title" (default: "date")

**Success Response** (200 OK):
```typescript
{
  tasks: Task[]; // Array of Task objects
  total: number; // Total count (for pagination in future)
}

// Task type:
{
  id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  createdAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}
```

**Mock Implementation Notes**:
- Returns tasks from TaskContext state
- Filters by status param if provided
- Sorts by createdAt (desc) or title (asc) based on sort param
- 50ms delay

---

### POST /api/tasks (Mock)

**Purpose**: Create a new task

**Request**:
```typescript
{
  title: string;       // Required, 1-200 chars
  description?: string; // Optional, max 5000 chars
}
```

**Success Response** (201 Created):
```typescript
{
  task: {
    id: string;
    title: string;
    description?: string;
    status: "pending";
    createdAt: string; // ISO 8601
  }
}
```

**Error Responses**:
- **400 Bad Request**: Validation errors
  ```typescript
  {
    error: {
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      fields: {
        title?: "Title is required and must be 1-200 characters";
        description?: "Description must be less than 5000 characters";
      }
    }
  }
  ```

**Mock Implementation Notes**:
- Generates UUID for task ID
- Sets `status: "pending"`, `createdAt: new Date().toISOString()`
- Adds to TaskContext state
- useOptimistic provides instant UI feedback
- 50ms delay

---

### PATCH /api/tasks/:id (Mock)

**Purpose**: Update an existing task

**Request**:
```typescript
{
  title?: string;       // Optional, 1-200 chars
  description?: string; // Optional, max 5000 chars
  status?: "pending" | "completed"; // Optional
}
```

**Success Response** (200 OK):
```typescript
{
  task: {
    id: string;
    title: string;
    description?: string;
    status: "pending" | "completed";
    createdAt: string;
    updatedAt: string; // Updated timestamp
  }
}
```

**Error Responses**:
- **400 Bad Request**: Validation errors (same as POST)
- **404 Not Found**: Task ID doesn't exist
  ```typescript
  {
    error: {
      code: "NOT_FOUND",
      message: "Task not found"
    }
  }
  ```

**Mock Implementation Notes**:
- Finds task by ID in TaskContext state
- Updates only provided fields
- Sets `updatedAt: new Date().toISOString()`
- useOptimistic provides instant UI feedback
- 50ms delay

---

### DELETE /api/tasks/:id (Mock)

**Purpose**: Delete a task

**Request**: None (ID in URL path)

**Success Response** (200 OK):
```typescript
{
  success: true;
  deletedId: string; // ID of deleted task
}
```

**Error Responses**:
- **404 Not Found**: Task ID doesn't exist
  ```typescript
  {
    error: {
      code: "NOT_FOUND",
      message: "Task not found"
    }
  }
  ```

**Mock Implementation Notes**:
- Removes task from TaskContext state by ID
- useOptimistic provides instant UI feedback (task disappears from list)
- 50ms delay

---

## Mock API Client Implementation

**File**: `/lib/api.ts`

```typescript
// Mock API client with simulated delays
const MOCK_DELAY = 50; // ms

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth operations
  async login(email: string, password: string) {
    await delay(MOCK_DELAY);

    // Mock validation
    if (!email || !password) {
      throw {
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
          fields: { email: !email ? "Required" : undefined, password: !password ? "Required" : undefined }
        }
      };
    }

    if (password.length < 8) {
      throw {
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        }
      };
    }

    // Mock success
    return {
      user: {
        id: "user-1",
        name: "Demo User",
        email,
        avatar: undefined
      },
      token: "mock-jwt-token"
    };
  },

  async signup(name: string, email: string, password: string) {
    await delay(MOCK_DELAY);

    // Mock validation
    const errors: any = {};
    if (!name) errors.name = "Name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format";
    if (!password || password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      errors.password = "Password must be at least 8 characters with 1 letter and 1 number";
    }

    if (Object.keys(errors).length > 0) {
      throw {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          fields: errors
        }
      };
    }

    // Mock success
    return {
      user: {
        id: crypto.randomUUID(),
        name,
        email,
        avatar: undefined
      },
      token: "mock-jwt-token"
    };
  },

  async logout() {
    await delay(MOCK_DELAY);
    return { success: true };
  },

  // Task operations (actual implementations in TaskContext)
  // These are called by Server Actions which update context state
};
```

---

## Server Actions

**File**: `/lib/actions.ts`

Server Actions wrap mock API calls and integrate with useOptimistic.

```typescript
'use server';

import { revalidatePath } from 'next/cache';

export async function createTask(title: string, description?: string) {
  // Mock API call (50ms delay)
  await new Promise(resolve => setTimeout(resolve, 50));

  const task = {
    id: crypto.randomUUID(),
    title,
    description,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  };

  // In Phase 2: Updates TaskContext state (called from client)
  // In Phase 2b: Real API call to FastAPI backend

  revalidatePath('/tasks');
  return { task };
}

export async function updateTask(id: string, updates: Partial<Task>) {
  await new Promise(resolve => setTimeout(resolve, 50));

  // Mock update logic (find and update in TaskContext)
  const task = { ...updates, updatedAt: new Date().toISOString() };

  revalidatePath('/tasks');
  return { task };
}

export async function deleteTask(id: string) {
  await new Promise(resolve => setTimeout(resolve, 50));

  // Mock delete logic (remove from TaskContext)

  revalidatePath('/tasks');
  return { success: true, deletedId: id };
}
```

---

## Error Response Format (Standard)

All errors follow this structure:

```typescript
{
  error: {
    code: string;          // Error code (VALIDATION_ERROR, NOT_FOUND, etc.)
    message: string;       // Human-readable error message
    fields?: {             // Optional field-specific errors (validation)
      [field: string]: string;
    };
  }
}
```

**Error Codes**:
- `VALIDATION_ERROR`: Client-side validation failed (400)
- `INVALID_CREDENTIALS`: Login failed (401)
- `EMAIL_EXISTS`: Signup email conflict (409)
- `NOT_FOUND`: Resource not found (404)
- `INTERNAL_ERROR`: Unexpected error (500)

---

## Phase 2b Migration Path

When transitioning to real FastAPI backend:

1. **Replace mock delays** with actual fetch() calls to `http://localhost:8000/api/*`
2. **Add JWT token** to Authorization header: `Bearer ${token}`
3. **Update error handling** to match FastAPI error response format
4. **Add user_id context** from JWT for user isolation
5. **Replace TaskContext** with real API state (React Query, SWR, or simple fetch + state)

**Example Phase 2b API call**:
```typescript
// Phase 2b: Real API call
async function createTask(title: string, description?: string) {
  const token = getAuthToken(); // From AuthContext

  const response = await fetch('http://localhost:8000/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}
```

---

## Status

✅ **Complete** - Mock API contracts defined. Ready for quickstart guide generation.

**Next**: Generate `quickstart.md` with setup instructions.
