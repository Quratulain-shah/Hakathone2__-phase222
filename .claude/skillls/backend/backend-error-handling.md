---
name: backend-error-handling
description: "Authoritative guide for implementing consistent, secure, and production-grade error handling in Todo App Phase 2 FastAPI backend using HTTPException, custom error models, and structured responses."
version: "1.0"
tags: ["backend", "fastapi", "error-handling", "security", "validation", "api"]
author: "Spec-Kit Plus Intelligence Architect"
type: skill
complexity: medium
decision_points: 6
---

# Backend Error Handling Skill

## Metadata
- **Version**: 1.0
- **Created**: 2025-12-26
- **Category**: Backend Reliability
- **Complexity Level**: Medium (6 decision points)
- **Reusability**: Cross-project (any FastAPI backend with user authentication)

## Description

This skill defines the mandatory standards for error handling across all FastAPI routes in Todo App Phase 2. It ensures consistent, secure, machine-readable error responses that prevent information leaks, provide clear feedback to clients, and maintain API contract integrity while supporting debugging and monitoring.

## When to Use This Skill

**Apply when:**
- Implementing or reviewing any route handler in `backend/routes/`
- Handling validation, authentication, authorization, or resource errors
- Defining custom exceptions or error response models
- Integrating with frontend for graceful error display
- Setting up global exception handlers

**Skip when:**
- Pure success path implementation (no error cases)
- Database schema definitions only
- Frontend-only error handling (toasts, UI states)
- Logging configuration (separate observability skill)

## Persona

You are a **Backend Reliability Engineer** who treats errors as first-class citizens with the vigilance of a security specialist. You think systematically about:

- **Security Through Opacity**: Never expose internal details (stack traces, DB queries) to clients
- **Consistency as Usability**: Every error response must follow the exact same structure
- **Client-Friendly Feedback**: Errors should help frontend display meaningful messages
- **Debuggability Internally**: Include correlation IDs for logging without leaking to clients
- **Prevention Over Reaction**: Validate early and raise appropriate exceptions

Your goal is to produce error handling that:
- Protects against information disclosure attacks
- Enables robust frontend error recovery
- Simplifies debugging in production logs
- Enforces API contract through proper status codes

## Analytical Questions

Before approving error handling implementation, systematically analyze:

### 1. Error Response Structure Consistency
- Does every error response follow the standardized JSON format?
- Are error codes machine-readable and documented?
- Is a unique request_id included for correlation?
- Are human-readable messages safe (no sensitive data)?

### 2. Appropriate Status Code Usage
- Are 4xx codes used for client errors (400, 401, 403, 404, 409, 422)?
- Are 5xx codes reserved for unexpected server issues?
- Is 422 used for Pydantic validation errors?
- Are success-path codes correct (200, 201, 204)?

### 3. User-Facing vs Internal Errors
- Are validation errors detailed but safe (field-level messages)?
- Are auth errors generic ("Invalid credentials" not "User not found")?
- Are resource not found errors 404 without confirming existence?
- Are internal errors masked as generic 500?

### 4. Custom Exception Hierarchy
- Are domain-specific exceptions defined (TaskNotFoundError, DuplicateTaskError)?
- Do custom exceptions map to correct status codes?
- Are exceptions raised early with proper context?

### 5. Global vs Local Handlers
- Is a global exception handler registered for uncaught exceptions?
- Are common errors (HTTPException, validation) handled locally for performance?
- Does the global handler log full details internally?

### 6. Frontend Integration Support
- Do error responses include codes the frontend can switch on?
- Are messages suitable for direct user display (or keyed for i18n)?
- Does the frontend receive enough info for retry logic?

## Decision Principles

Apply these frameworks when implementing error handling:

### 1. Standardized Error Response Model
**Principle**: All errors must return identical structure

```python
class ErrorDetail(BaseModel):
    field: str | None = None
    issue: str
    code: str

class ApiErrorResponse(BaseModel):
    error: str
    message: str
    code: str
    details: list[ErrorDetail] | None = None
    request_id: str
```

**Example Response**:
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "code": "VAL_001",
  "details": [
    {"field": "title", "issue": "Must be between 1-200 characters", "code": "VAL_002"}
  ],
  "request_id": "req_abc123"
}
```

### 2. Status Code Mapping Table
**Principle**: Semantic status codes for predictable client behavior

| Code | Use Case | Example Message | Details Required |
|------|----------|------------------|------------------|
| 400  | Generic client error | "Invalid request" | Yes |
| 401  | Missing/invalid token | "Authentication required" | No |
| 403  | User isolation violation | "Unauthorized access" | No |
| 404  | Resource not found | "Task not found" | No |
| 409  | Conflict | "Task title already exists" | Yes |
| 422  | Validation error (Pydantic) | Auto-generated | Yes |
| 429  | Rate limited | "Too many requests" | No |
| 500  | Internal error | "Unexpected error occurred" | No (logged internally) |

### 3. Security-Focused Error Messages
**Principle**: Prevent information disclosure and enumeration

**Safe Messages**:
- Auth failure: "Invalid credentials" (never "User not found" vs "Wrong password")
- Not found: "Resource not found" (never confirm existence)
- Internal: "An unexpected error occurred" (full details in logs only)

**Never expose**:
- Stack traces
- Database query details
- File paths or environment variables

### 4. Custom Exception Pattern
**Principle**: Domain-specific exceptions for clean code

```python
class TaskNotFoundError(HTTPException):
    def __init__(self, task_id: int):
        super().__init__(
            status_code=404,
            detail={
                "error": "RESOURCE_NOT_FOUND",
                "message": "Task not found",
                "code": "TASK_001",
                "details": [{"field": "id", "issue": f"Task {task_id} does not exist"}],
                "request_id": get_request_id()
            }
        )
```

### 5. Global Exception Handler
**Principle**: Catch-all for unexpected errors

```python
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_ERROR",
            "message": "An unexpected error occurred",
            "code": "SYS_001",
            "request_id": request.state.request_id
        }
    )
```

## Usage Example

**Scenario**: Handling validation and not-found errors in task update route

**Invocation**:
```
Apply backend-error-handling skill to the PUT /api/v1/{user_id}/tasks/{id} route implementation
```

**Expected Output**:
```
--- ERROR HANDLING REVIEW ---
✓ Pydantic TaskUpdate model triggers 422 with field details automatically
✓ TaskNotFoundError raised with 404 and safe message
✓ User isolation mismatch raises 403 with generic "Unauthorized access"
✓ Validation errors include field-level details and codes
✓ All responses use standardized ApiErrorResponse structure
✓ Request_id included for log correlation
✓ No stack traces or DB details leaked

Code compliant with error handling standards.
```

## Self-Check Validation

After implementing error handling, verify:

- [ ] All expected error paths raise appropriate HTTPException
- [ ] Error responses follow exact JSON structure
- [ ] Status codes semantically correct
- [ ] Messages safe (no enumeration or leaks)
- [ ] Validation errors include field details
- [ ] Custom exceptions used for domain errors
- [ ] Global handler catches unexpected exceptions
- [ ] Request_id logged and included in response
- [ ] Frontend can distinguish error types via code field

## Integration with SDD Workflow

**In Implement Phase**:
- Apply during route implementation tasks
- Validate before committing code

**With Other Skills**:
- Combine with fastapi-route-implementation for full route quality
- Use after spec-review to match documented error cases

**Pre-Deploy Gate**:
- Run skill check on all routes before production

## Common Mistakes This Skill Prevents

1. **Information Leakage**: Exposing stack traces or DB errors
2. **Inconsistent Responses**: Different error formats across endpoints
3. **Enumeration Attacks**: Distinguishing "not found" vs "unauthorized"
4. **Generic Messages**: Frontend can't handle specific cases
5. **Unhandled Exceptions**: Crashing the API on unexpected errors
6. **Wrong Status Codes**: Using 200 for errors or 500 for validation

## Skill Evolution Notes

**Future enhancements**:
- Add rate limiting exception handling
- Include i18n support for error messages
- Add error monitoring integration (Sentry)
- Support for async error logging

---

**Skill Status**: Production Ready
**Last Updated**: 2025-12-26
**Maintenance**: Review with FastAPI security updates
```

