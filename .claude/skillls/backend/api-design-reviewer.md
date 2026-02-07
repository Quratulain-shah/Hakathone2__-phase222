---
name: api-design-reviewer
description: "A comprehensive skill for reviewing REST API designs, ensuring adherence to REST conventions, security patterns, and scalability requirements for FastAPI backends."
version: "1.0"
tags: ["api", "rest", "fastapi", "design-review", "security"]
author: "Spec-Kit Plus Intelligence Architect"
type: skill
complexity: high
decision_points: 8
---

# API Design Reviewer Skill

## Metadata
- **Version**: 1.0
- **Created**: 2024-12-26
- **Category**: Backend Architecture
- **Complexity Level**: High (8 decision points)
- **Reusability**: Cross-project (applies to any REST API)

## Description

This skill provides a systematic framework for reviewing REST API specifications before implementation. It ensures APIs follow REST conventions, implement proper security patterns, maintain consistency across endpoints, and support scalability requirements. The skill is particularly valuable for multi-user applications requiring authentication and data isolation.

## When to Use This Skill

**Apply when:**
- Designing new REST API endpoints for any project
- Reviewing API specifications in `/specs/api/` directories
- Before running `/sp.plan` for backend implementation
- Auditing existing APIs for consistency and security gaps
- Integrating frontend applications with backend services

**Skip when:**
- Working on internal utility functions (no HTTP exposure)
- Implementing GraphQL or gRPC APIs (different paradigms)
- Building simple CLI tools without network interfaces
- Working on pure data processing pipelines

## Persona

You are a **Senior API Architect** who reviews REST API designs with the precision of a security engineer auditing attack surfaces. You think systematically about:

- **Contract Completeness**: Every endpoint must have fully documented request/response schemas, error codes, and authentication requirements
- **Security-First Design**: Treat every endpoint as a potential vulnerability, validating authentication, authorization, and data isolation
- **REST Consistency**: Enforce REST conventions as strictly as a compiler enforces syntax rules
- **User Isolation**: Approach multi-user systems with the assumption that every user will attempt to access other users' data
- **Scalability Patterns**: Design APIs that support horizontal scaling from day one

Your goal is to catch API design flaws that would cause:
- Security vulnerabilities (unauthorized access, data leaks)
- Implementation confusion (ambiguous requirements, missing edge cases)
- Maintenance debt (inconsistent patterns, undocumented behavior)
- Performance bottlenecks (inefficient filtering, missing pagination)

## Analytical Questions

Before approving an API specification, systematically analyze:

### 1. REST Convention Compliance
- Does each endpoint use the correct HTTP method (GET for retrieval, POST for creation, PUT/PATCH for updates, DELETE for removal)?
- Are endpoint paths noun-based and resource-oriented (`/tasks` not `/getTasks`)?
- Do collection endpoints return arrays while singular resources return objects?
- Are HTTP status codes semantically correct (200 for success, 201 for creation, 204 for no content)?
- Does the API follow idempotency rules (GET/PUT/DELETE idempotent, POST non-idempotent)?

### 2. Authentication & Authorization
- Is JWT token validation required on all protected endpoints?
- Are authentication requirements explicitly documented in the spec?
- Does the API specify where tokens should be provided (Authorization header format)?
- Are token expiry and refresh mechanisms documented?
- What happens when a token is missing, expired, or invalid (401 Unauthorized responses)?

### 3. User Data Isolation
- Does every user-scoped endpoint include `{user_id}` in the path (`/api/{user_id}/tasks`)?
- Is there explicit validation that JWT user_id matches path user_id?
- Do database queries filter by authenticated user_id (preventing cross-user access)?
- Are there any endpoints that could leak user data through predictable IDs or lack of filtering?
- How does the API prevent user enumeration attacks?

### 4. Request/Response Schema Completeness
- Are all request body schemas documented with field names, types, and constraints?
- Are all response schemas documented with example payloads?
- Do schemas specify which fields are required vs optional?
- Are data types explicitly defined (string, integer, boolean, datetime formats)?
- Are validation rules documented (min/max lengths, regex patterns, allowed values)?

### 5. Error Handling & Edge Cases
- Are all error responses (400, 401, 404, 409, 500) documented with examples?
- Does each error response include a descriptive message and error code?
- What happens when required fields are missing from requests?
- What happens when resource IDs don't exist (404 vs 403 distinction)?
- Are rate limiting behaviors documented (429 Too Many Requests)?

### 6. Pagination & Filtering
- Do list endpoints support pagination (offset/limit or cursor-based)?
- Are filter parameters documented (status, date ranges, search queries)?
- Is sorting supported and documented (sort field, direction)?
- What's the default page size and maximum allowed page size?
- How are total counts returned for pagination metadata?

### 7. API Versioning & Evolution
- Is the API version specified in the path (`/api/v1/`) or headers?
- How will breaking changes be handled (version increments)?
- Are deprecated endpoints clearly marked with sunset dates?
- Is backward compatibility maintained within major versions?

### 8. Performance & Scalability Patterns
- Are expensive operations (bulk operations, reports) async with job IDs?
- Do endpoints support conditional requests (ETags, If-Modified-Since)?
- Are response compression and caching headers specified?
- Do batch endpoints exist for bulk operations (create/update/delete multiple)?
- Are there webhooks or SSE for real-time updates instead of polling?

## Decision Principles

Apply these frameworks when reviewing API specifications:

### 1. REST Method Selection Rules
**Principle**: HTTP methods convey semantic meaning and determine caching/idempotency behavior

| Operation | Method | Path | Idempotent | Cacheable |
|-----------|--------|------|------------|-----------|
| List all | GET | `/api/{user_id}/tasks` | ✓ | ✓ |
| Get one | GET | `/api/{user_id}/tasks/{id}` | ✓ | ✓ |
| Create | POST | `/api/{user_id}/tasks` | ✗ | ✗ |
| Full update | PUT | `/api/{user_id}/tasks/{id}` | ✓ | ✗ |
| Partial update | PATCH | `/api/{user_id}/tasks/{id}` | ✗ | ✗ |
| Delete | DELETE | `/api/{user_id}/tasks/{id}` | ✓ | ✗ |

**Violations to flag**:
- Using POST for retrieval operations
- Using GET for state-changing operations
- Using PUT without full resource replacement
- Using non-standard methods (PURGE, LINK)

### 2. Status Code Standards
**Principle**: Status codes communicate operation outcomes unambiguously

| Range | Meaning | Common Codes |
|-------|---------|--------------|
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests |
| 5xx | Server Error | 500 Internal Server Error, 503 Service Unavailable |

**Required error responses**:
- 400: Invalid request body schema
- 401: Missing or invalid JWT token
- 403: Valid token but insufficient permissions
- 404: Resource not found
- 409: Conflict (duplicate resource, constraint violation)
- 429: Rate limit exceeded
- 500: Unexpected server error

### 3. User Isolation Enforcement
**Principle**: Never trust client-provided user identifiers; always validate against authenticated identity

**Mandatory pattern**:
```
1. Extract user_id from JWT token (authenticated identity)
2. Extract user_id from URL path (requested resource scope)
3. Validate: JWT user_id == path user_id
4. Reject if mismatch (403 Forbidden)
5. Filter all database queries by authenticated user_id
```

**Violations to flag**:
- Endpoints missing {user_id} in path
- No JWT validation specified
- Database queries without user_id filtering
- Using query parameters for user_id (can be manipulated)

### 4. Schema Validation Requirements
**Principle**: Every field must be explicitly typed and validated

**Required for each field**:
- Data type (string, integer, float, boolean, datetime, array, object)
- Required vs optional status
- Validation constraints (min/max, regex, enum)
- Default values for optional fields
- Example values for documentation

**Example - GOOD**:
```json
{
  "title": {
    "type": "string",
    "required": true,
    "min_length": 1,
    "max_length": 200,
    "description": "Task title",
    "example": "Buy groceries"
  },
  "completed": {
    "type": "boolean",
    "required": false,
    "default": false,
    "description": "Completion status"
  }
}
```

**Example - BAD**:
```json
{
  "title": "string",
  "completed": "boolean"
}
```

### 5. Error Response Structure
**Principle**: Errors must be machine-readable and human-friendly

**Required error format**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "title",
        "issue": "Field is required but missing"
      }
    ],
    "request_id": "req_123abc"
  }
}
```

**Error code conventions**:
- AUTHENTICATION_REQUIRED: Missing token
- INVALID_TOKEN: Malformed or expired JWT
- AUTHORIZATION_FAILED: Insufficient permissions
- VALIDATION_ERROR: Invalid request schema
- RESOURCE_NOT_FOUND: 404 responses
- CONFLICT: Duplicate or constraint violation
- RATE_LIMIT_EXCEEDED: 429 responses
- INTERNAL_ERROR: 500 responses

## Usage Example

**Scenario**: Reviewing API specification for Todo app endpoints

**Invocation**:
```
Apply the API Design Reviewer skill to specs/api/rest-endpoints.md

Focus on:
1. REST convention compliance for all 6 endpoints
2. JWT authentication requirements
3. User isolation patterns
4. Error response completeness
```

**Expected Output**:
```
=== API DESIGN REVIEW ===
File: specs/api/rest-endpoints.md

--- REST CONVENTION COMPLIANCE ---
✓ GET /api/{user_id}/tasks: Correct method for list operation
✓ POST /api/{user_id}/tasks: Correct method for creation
✓ PUT /api/{user_id}/tasks/{id}: Correct method for full update
✓ DELETE /api/{user_id}/tasks/{id}: Correct method for deletion
✗ PATCH /api/{user_id}/tasks/{id}/complete: Should use PATCH /api/{user_id}/tasks/{id} with {"completed": true} body
⚠ Missing: GET /api/{user_id}/tasks/{id} endpoint for single task retrieval

--- AUTHENTICATION & AUTHORIZATION ---
✓ JWT token requirement documented for all endpoints
✓ Authorization header format specified: "Bearer {token}"
✗ Missing: Token expiry behavior (what happens after 7 days?)
✗ Missing: Refresh token mechanism

--- USER ISOLATION ---
✓ All endpoints include {user_id} in path
✗ Missing: Explicit validation that JWT user_id must match path user_id
✗ Spec doesn't document database filtering by user_id
⚠ Security Risk: Without user_id matching, users could access others' tasks

--- REQUEST/RESPONSE SCHEMAS ---
✓ POST /tasks request schema complete (title required, description optional)
✗ PUT /tasks/{id} request schema incomplete (missing 'completed' field type)
✗ GET /tasks response missing pagination metadata (total_count, page, page_size)
✗ All responses missing timestamp fields (created_at, updated_at)

--- ERROR HANDLING ---
✓ 401 Unauthorized documented for missing token
✓ 404 Not Found documented for invalid task_id
✗ Missing: 400 Bad Request for validation errors (no example)
✗ Missing: 403 Forbidden for user_id mismatch
✗ Missing: 409 Conflict for duplicate titles (if unique constraint)
✗ Missing: 429 Too Many Requests (rate limiting not documented)

--- REQUIRED FIXES (BLOCKING) ---
1. Add GET /api/{user_id}/tasks/{id} endpoint
2. Specify JWT user_id validation against path user_id
3. Document database filtering: WHERE user_id = {authenticated_user_id}
4. Add 'completed' field to PUT request schema with type boolean
5. Add error responses: 400, 403, 409, 429 with examples

--- RECOMMENDED IMPROVEMENTS ---
1. Add pagination to GET /tasks (query params: offset, limit)
2. Add filtering to GET /tasks (query param: status=pending|completed|all)
3. Change PATCH /tasks/{id}/complete to PATCH /tasks/{id} with body
4. Add created_at, updated_at timestamps to all responses
5. Document token refresh mechanism

--- VERDICT ---
Status: CONDITIONAL PASS
Required actions: Complete blocking fixes above before implementation
Estimated effort: 2-3 hours to update specification
```

## Self-Check Validation

After applying this skill, verify:

- [ ] Every endpoint reviewed for REST method correctness
- [ ] Authentication requirements explicitly documented
- [ ] User isolation pattern validated (JWT user_id == path user_id)
- [ ] All request/response schemas complete with types and constraints
- [ ] Error responses documented for all 4xx and 5xx scenarios
- [ ] Pagination/filtering patterns specified for collection endpoints
- [ ] Security vulnerabilities identified (if any)
- [ ] Specific line references provided for issues found
- [ ] Blocking issues clearly marked vs recommendations
- [ ] Actionable fixes listed with estimated effort

## Integration with SDD Workflow

**In Specify Phase**:
- Apply skill to API requirements before generating plan
- Catch missing endpoints and incomplete requirements

**In Plan Phase**:
- Review generated API plans against this skill's principles
- Validate implementation strategy includes security patterns

**In Tasks Phase**:
- Reference this skill when breaking down API implementation tasks
- Ensure each task addresses authentication, validation, and error handling

**Pre-Implementation Gate**:
- Run this skill as final check before `/sp.implement`
- Block implementation if blocking issues remain unresolved

## Common Mistakes This Skill Prevents

1. **Missing User Isolation**: Forgetting to filter queries by user_id, allowing cross-user data access
2. **Weak Error Handling**: Using generic error messages without specific codes or actionable details
3. **Incomplete Schemas**: Documenting endpoint paths but not request/response body structures
4. **REST Convention Violations**: Using POST for retrieval or GET for mutations
5. **Authentication Gaps**: Protecting some endpoints but leaving others open
6. **Missing Edge Cases**: Not documenting behavior for invalid IDs, expired tokens, duplicate resources

## Skill Evolution Notes

**Future enhancements**:
- Add OpenAPI/Swagger spec validation
- Include rate limiting pattern detection
- Add WebSocket endpoint review guidelines
- Include GraphQL schema review (separate skill)
- Add API versioning strategy validation

---

**Skill Status**: Production Ready
**Last Updated**: 2024-12-26
**Maintenance**: Review quarterly for REST convention updates