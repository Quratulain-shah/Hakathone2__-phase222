---
name: fastapi-route-implementation
description: "Authoritative guide for implementing production-grade FastAPI routes in Todo App Phase 2 using async patterns, Pydantic v2 models, SQLModel ORM, JWT authentication, and strict convention adherence."
version: "1.0"
tags: ["backend", "fastapi", "routes", "implementation", "crud", "security"]
author: "Spec-Kit Plus Intelligence Architect"
type: skill
complexity: high
decision_points: 7
---

# FastAPI Route Implementation Skill

## Metadata
- **Version**: 1.0
- **Created**: 2025-12-26
- **Category**: Backend Implementation
- **Complexity Level**: High (7 decision points)
- **Reusability**: Cross-project (any FastAPI backend with user-scoped data)

## Description

This skill provides the definitive standards for implementing REST API routes in Todo App Phase 2 using FastAPI, SQLModel, and async-first patterns. All route handlers must strictly follow these guidelines to ensure security (JWT + user isolation), performance (async operations), consistency (naming, structure, responses), and maintainability across CRUD operations.

## When to Use This Skill

**Apply when:**
- Implementing new API endpoints from `/specs/api/` specifications
- Writing route handlers in `backend/routes/` directory
- Building CRUD operations for user-owned resources (tasks, etc.)
- Integrating authentication and database operations
- Refactoring existing routes for consistency

**Skip when:**
- Implementing non-HTTP logic (utility functions, scripts)
- Working on database migrations only
- Building background tasks or websockets (separate skill)
- Prototyping throwaway endpoints

## Persona

You are a **Senior FastAPI Engineer** who implements routes with the rigor of a security auditor and the precision of a performance engineer. You think systematically about:

- **Security by Default**: Every route assumes malicious input and unauthorized access attempts
- **User Isolation as Sacred**: Never trust path/query parameters – always validate against JWT identity
- **Async Performance**: Treat blocking operations as critical bugs
- **Consistency as Contract**: Every route follows identical patterns for predictability
- **Explicit Over Implicit**: Document behavior through code structure and types

Your goal is to produce routes that are:
- Secure against data leaks and injection
- Performant under load (async DB, connection pooling)
- Testable and maintainable
- Fully aligned with API specifications

## Analytical Questions

Before writing or approving route implementation, systematically analyze:

### 1. Route Structure & Path Compliance
- Does the path follow `/api/v1/{user_id}/tasks` pattern with user scoping?
- Are HTTP methods correctly mapped to operations (GET list/single, POST create, etc.)?
- Is the route function name descriptive and consistent (`create_task`, `get_tasks`)?
- Are dependencies injected properly (db_session, current_user)?

### 2. Authentication & User Isolation
- Is JWT dependency applied to protected routes?
- Is path `{user_id}` validated against JWT `current_user.id`?
- Are all database queries filtered by `user_id = current_user.id`?
- What happens on user_id mismatch (raise 403 Forbidden)?

### 3. Pydantic/SQLModel Schema Usage
- Are request models defined with Pydantic (Create/Update schemas)?
- Are response models using SQLModel or Pydantic Response schemas?
- Do schemas exclude sensitive fields (passwords, internal IDs)?
- Are partial updates handled with optional fields in PATCH?

### 4. Database Operations & Async
- Is `AsyncSession` used with proper dependency injection?
- Are all DB operations `await`ed correctly (no blocking sync calls)?
- Are transactions handled appropriately for mutations?
- Is connection pooling configured via dependency?

### 5. Error Handling & Status Codes
- Are appropriate HTTPException raised for 4xx cases (400, 401, 403, 404, 409)?
- Is validation handled via Pydantic (automatic 422 responses)?
- Are custom error messages clear and non-leaky?
- Is rate limiting applied where needed?

### 6. Pagination & Filtering (for list endpoints)
- Does GET list support query parameters (status, sort, offset/limit)?
- Is pagination metadata returned (total_count, page info)?
- Are filters validated and applied securely?
- Is default sorting and limiting enforced?

### 7. Response Consistency
- Do successful responses use correct status codes (200, 201, 204)?
- Are response models applied with `response_model=`?
- Do responses include timestamps and proper field types?
- Are headers set appropriately (Location for 201 Created)?

## Decision Principles

Apply these frameworks when implementing FastAPI routes:

### 1. Standard Route Dependency Pattern
**Principle**: All routes must use standardized dependencies

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.async import AsyncSession

router = APIRouter(prefix="/{user_id}/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(
    task_input: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    user_id: int = Path(...)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    # implementation
```

### 2. User Isolation Enforcement
**Principle**: Validate and filter by authenticated user at every layer

**Mandatory checks**:
1. Path user_id == JWT current_user.id → else 403
2. All SELECT/WHERE clauses include `user_id = current_user.id`
3. INSERT sets `task.user_id = current_user.id`
4. No endpoints bypass this validation

### 3. CRUD Operation Standards
**Principle**: Consistent patterns across all resources

| Operation | Method/Path | Status | Key Rules |
|-----------|-------------|--------|-----------|
| List | GET /{user_id}/tasks | 200 | Pagination, filtering, user filter |
| Get One | GET /{user_id}/tasks/{id} | 200 | Ownership check |
| Create | POST /{user_id}/tasks | 201 | Set user_id from JWT |
| Update | PUT /{user_id}/tasks/{id} | 200 | Full replace, ownership |
| Partial Update | PATCH /{user_id}/tasks/{id} | 200 | Optional fields |
| Delete | DELETE /{user_id}/tasks/{id} | 204 | Ownership check |

### 4. Error Response Standards
**Principle**: Consistent, informative error structure

```python
raise HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail={"error": "VALIDATION_ERROR", "message": "Title is required"}
)
```

**Required for**:
- 400: Validation/schema issues
- 401: Missing/invalid token
- 403: User isolation violation
- 404: Task not found
- 409: Conflict (e.g., duplicate)

### 5. Async & Performance Rules
**Principle**: No blocking operations in route handlers

- Use `async def` for all routes
- All DB calls via `await`
- No sync SQLAlchemy (use SQLModel async)
- Proper session cleanup via dependency

## Usage Example

**Scenario**: Implementing Task CRUD routes from specs/api/rest-endpoints.md

**Invocation**:
```
Apply fastapi-route-implementation skill to create the POST /api/v1/{user_id}/tasks endpoint
Reference: specs/api/rest-endpoints.md and specs/features/task-crud.md
```

**Expected Output**:
```
Implementing POST /api/v1/{user_id}/tasks

--- ROUTE STRUCTURE ---
@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(
    task_input: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    user_id: int = Path(...)
):

--- USER ISOLATION ---
✓ Path user_id validated against current_user.id
✓ Task.user_id set to current_user.id
✓ 403 raised on mismatch

--- IMPLEMENTATION ---
task = Task(**task_input.dict(), user_id=current_user.id)
db.add(task)
await db.commit()
await db.refresh(task)
return task

--- COMPLIANCE CHECK ---
✓ Async operations
✓ Pydantic validation (TaskCreate)
✓ 201 Created on success
✓ Proper error handling for validation

Code ready for backend/routes/tasks.py
```

## Self-Check Validation

After implementing a route, verify:

- [ ] User isolation validated (path vs JWT)
- [ ] All DB queries filtered by current_user.id
- [ ] Async def and await used correctly
- [ ] Pydantic models for request/response
- [ ] Proper HTTP status codes
- [ ] Error handling for 4xx cases
- [ ] Pagination/filtering for list endpoints
- [ ] No sensitive data leaked in responses
- [ ] Route matches API specification exactly
- [ ] Code follows exact pattern structure

## Integration with SDD Workflow

**In Implement Phase**:
- Apply after `/sp.plan` generates backend tasks
- Use for every route implementation task

**Pre-Commit Gate**:
- Run skill validation before committing route code
- Block if user isolation or async violations

**With Other Skills**:
- Combine with spec-review skill for full consistency
- Use after database schema updates

## Common Mistakes This Skill Prevents

1. **User Data Leak**: Forgetting user_id filtering in queries
2. **Sync Blocking**: Using sync DB calls in async routes
3. **Inconsistent Paths**: Missing {user_id} scoping
4. **Weak Validation**: Relying on manual checks instead of Pydantic
5. **Leaky Errors**: Exposing stack traces or DB details
6. **Wrong Status Codes**: Returning 200 for creation

## Skill Evolution Notes

**Future enhancements**:
- Add background task integration (Celery/Redis)
- Include rate limiting middleware
- Add OpenAPI tag/description automation
- Support for file uploads in routes

---

**Skill Status**: Production Ready
**Last Updated**: 2025-12-26
**Maintenance**: Review with FastAPI version updates
```

