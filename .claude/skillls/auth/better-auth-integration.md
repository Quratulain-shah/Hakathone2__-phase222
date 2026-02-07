---
name: better-auth-integration
description: Implement Better Auth 0.4+ JWT authentication with Next.js frontend and FastAPI backend integration. Use when implementing authentication, JWT tokens, user signup/signin, or securing API endpoints in full-stack applications. (project)
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Better Auth 0.4+ Integration

## Architecture Overview

Better Auth is a JavaScript/TypeScript authentication library that runs on the **Next.js frontend** and issues **JWT tokens** for backend API authentication.

```
┌─────────────────────┐         ┌─────────────────────┐
│  Next.js Frontend   │         │  FastAPI Backend    │
│  (Better Auth)      │────────▶│  (JWT Verification) │
│                     │  JWT    │                     │
│  - Signup/Signin    │  Token  │  - Verify Token     │
│  - Issue JWT        │         │  - Extract User     │
│  - Store Session    │         │  - Filter by User   │
└─────────────────────┘         └─────────────────────┘
```

## Frontend Setup (Next.js)

### Installation

```bash
npm install better-auth
```

### Better Auth Configuration

Create `lib/auth.ts`:

```typescript
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  // Database connection (for user storage)
  database: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL
  },

  // Enable JWT plugin
  plugins: [
    {
      id: 'jwt',
      endpoints: {
        signIn: {
          jwt: true  // Enable JWT token issuance
        }
      }
    }
  ],

  // Shared secret (MUST match backend)
  secret: process.env.BETTER_AUTH_SECRET,

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // Update every 24 hours
  },

  // Email/password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false // Set to true in production
  }
})
```

### Environment Variables (.env.local)

```bash
# Better Auth
BETTER_AUTH_SECRET=your-very-long-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Database (shared with backend)
DATABASE_URL=postgresql://user:password@host/database

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Auth API Routes

Create `app/api/auth/[...auth]/route.ts`:

```typescript
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
```

This creates endpoints:
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

### Client-Side Auth Hook

Create `features/auth/hooks/useAuth.ts`:

```typescript
'use client'

import { useSession, signIn, signOut, signUp } from 'better-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      const response = await signUp.email({
        email,
        password,
        name
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      return response
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      const response = await signIn.email({
        email,
        password
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      // Extract JWT token from response
      const jwtToken = response.data?.token

      // Store JWT token for API calls
      if (jwtToken) {
        localStorage.setItem('jwt_token', jwtToken)
      }

      return response
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const handleSignOut = async () => {
    await signOut()
    localStorage.removeItem('jwt_token')
  }

  return {
    session,
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut
  }
}
```

### Auth Components

#### Login Form

Create `features/auth/components/LoginForm.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await signIn(email, password)
      router.push('/tasks')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
```

### Protected Routes

Create `features/auth/components/AuthGuard.tsx`:

```typescript
'use client'

import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

Usage:
```typescript
// app/tasks/page.tsx
import { TasksFeature } from '@/features/tasks/TasksFeature'
import { AuthGuard } from '@/features/auth/components/AuthGuard'

export default function TasksPage() {
  return (
    <AuthGuard>
      <TasksFeature />
    </AuthGuard>
  )
}
```

## Backend Setup (FastAPI)

### JWT Verification Middleware

Create `backend/middleware/auth.py`:

```python
from fastapi import HTTPException, Header
import jwt
from datetime import datetime

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")

def verify_jwt_token(authorization: str = Header(...)) -> dict:
    """
    Verify JWT token from Authorization header.
    Returns user data if valid, raises HTTPException if invalid.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace("Bearer ", "")

    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        # Check expiration
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.now():
            raise HTTPException(status_code=401, detail="Token expired")

        # Extract user ID
        user_id = payload.get("sub") or payload.get("userId")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "name": payload.get("name")
        }

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Protect API Endpoints

```python
# backend/routes/tasks.py
from fastapi import APIRouter, Depends
from middleware.auth import verify_jwt_token

router = APIRouter()

@router.get("/api/{user_id}/tasks")
async def get_tasks(
    user_id: str,
    current_user: dict = Depends(verify_jwt_token)
):
    """Get all tasks for authenticated user."""
    # Verify user_id matches authenticated user
    if current_user["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Query tasks for this user only
    tasks = await get_user_tasks(user_id)
    return tasks

@router.post("/api/{user_id}/tasks")
async def create_task(
    user_id: str,
    task: TaskCreate,
    current_user: dict = Depends(verify_jwt_token)
):
    """Create new task for authenticated user."""
    if current_user["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Create task with user_id
    new_task = await create_user_task(user_id, task)
    return new_task
```

## API Client with JWT

Create `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('jwt_token')

  if (!token) {
    throw new Error('Not authenticated')
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const api = {
  async getTasks(userId: string) {
    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('jwt_token')
        window.location.href = '/login'
      }
      throw new Error('Failed to fetch tasks')
    }

    return response.json()
  },

  async createTask(userId: string, task: { title: string; description?: string }) {
    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(task)
    })

    if (!response.ok) {
      throw new Error('Failed to create task')
    }

    return response.json()
  }
}
```

## Security Best Practices

### 1. Shared Secret

**CRITICAL**: Frontend and backend MUST use the same `BETTER_AUTH_SECRET`:

```bash
# Frontend .env.local
BETTER_AUTH_SECRET=your-very-long-secret-key-min-32-chars

# Backend .env
BETTER_AUTH_SECRET=your-very-long-secret-key-min-32-chars
```

### 2. Token Storage

- **DO**: Store JWT in `localStorage` or `httpOnly` cookie
- **DON'T**: Store in regular cookies (XSS vulnerable)
- **DON'T**: Expose secret key in frontend code

### 3. Token Expiry

```typescript
// Set appropriate expiry (7 days typical)
session: {
  expiresIn: 60 * 60 * 24 * 7
}
```

### 4. HTTPS in Production

```typescript
// Production config
session: {
  cookieOptions: {
    secure: true,      // HTTPS only
    httpOnly: true,    // Not accessible via JavaScript
    sameSite: 'strict' // CSRF protection
  }
}
```

## User Isolation Pattern

Every API endpoint MUST filter by authenticated user:

```python
# ✓ CORRECT: User-specific query
@router.get("/api/{user_id}/tasks")
async def get_tasks(user_id: str, current_user: dict = Depends(verify_jwt_token)):
    # Verify URL user_id matches token user_id
    if current_user["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Query with user filter
    tasks = await db.query(Task).filter(Task.user_id == user_id).all()
    return tasks

# ❌ WRONG: No user filter
@router.get("/api/tasks")
async def get_all_tasks():
    tasks = await db.query(Task).all()  # Returns ALL users' tasks!
    return tasks
```

## Testing Authentication

### Frontend Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/features/auth/components/LoginForm'

test('submits login form', async () => {
  render(<LoginForm />)

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'user@example.com' }
  })
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  })

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

  // Assert loading state, then redirect
})
```

### Backend Tests

```python
import pytest
from fastapi.testclient import TestClient

def test_protected_endpoint_requires_auth(client: TestClient):
    response = client.get("/api/user123/tasks")
    assert response.status_code == 401

def test_protected_endpoint_with_valid_token(client: TestClient):
    token = generate_test_jwt("user123")
    response = client.get(
        "/api/user123/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

def test_user_cannot_access_other_users_data(client: TestClient):
    token = generate_test_jwt("user123")
    response = client.get(
        "/api/user456/tasks",  # Different user ID
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
```

## Troubleshooting

### Token Not Working

1. Check secret key matches on both frontend and backend
2. Verify token format: `Bearer <token>`
3. Check token expiry with jwt.io debugger
4. Ensure CORS configured on backend

### Session Not Persisting

1. Check cookie settings (secure, httpOnly, sameSite)
2. Verify DATABASE_URL is set
3. Check browser dev tools > Application > Cookies

### 401 Unauthorized Errors

1. Token expired - implement refresh token logic
2. Token invalid - verify secret key
3. Token missing - check localStorage has 'jwt_token'
4. Wrong user ID in URL - must match token user_id

## Resources via context7 MCP

Query context7 for official documentation:
- "Better Auth JWT configuration"
- "FastAPI JWT authentication"
- "Next.js authentication patterns"
- "JWT token security best practices"
