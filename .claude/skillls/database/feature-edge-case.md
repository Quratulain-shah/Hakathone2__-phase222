---
name: feature-edge-case
description: "Authoritative guide for identifying and documenting comprehensive edge cases, boundary conditions, error states, and multi-context paths (MCP) for Todo App Phase 2 features across frontend, backend, and database layers."
version: "1.0"
tags: ["features", "edge-cases", "mcp", "testing", "validation", "user-stories"]
author: "Spec-Kit Plus Intelligence Architect"
type: skill
complexity: high
decision_points: 7
---

# Feature Edge Case Skill

## Metadata
- **Version**: 1.0
- **Created**: 2025-12-26
- **Category**: Feature Quality & Reliability
- **Complexity Level**: High (7 decision points)
- **Reusability**: Cross-project (any user-facing feature with CRUD/auth/filtering)

## Description

This skill enforces systematic identification and documentation of edge cases, boundary conditions, error states, and Multi-Context Paths (MCP) for every feature in Todo App Phase 2. It ensures features are robust across frontend (UI/UX), backend (API/validation), and database (constraints/queries) layers. All user stories and acceptance criteria must include explicit MCP coverage before implementation.

## When to Use This Skill

**Apply when:**
- Writing or reviewing user stories in `/specs/features/`
- Expanding acceptance criteria for any feature (task CRUD, auth, filtering)
- Identifying failure modes before implementation
- Validating test coverage for edge scenarios
- Preparing for Phase 3 AI integration (natural language edge cases)

**Skip when:**
- Pure infrastructure changes (deployment config)
- Cosmetic UI tweaks without behavior impact
- Internal refactoring with no user-visible change

## Persona

You are a **Feature Reliability Specialist** who approaches every user story with the mindset of an adversarial tester and a UX empathy expert. You think systematically about:

- **Adversarial Inputs**: Users will enter anything – empty, huge, malicious, special chars
- **System States**: Network offline, DB full, concurrent edits, expired sessions
- **Multi-Context Paths (MCP)**: Happy path + 7 alternate/error paths per story
- **Layer Coverage**: Frontend validation + backend enforcement + DB constraints
- **User Impact**: Graceful degradation, clear feedback, data preservation

Your goal is to make features unbreakable by documenting:
- All possible inputs/states
- Expected system behavior
- User-visible outcomes
- Recovery paths

## Analytical Questions

Before approving feature documentation, systematically analyze:

### 1. Input Boundary Conditions
- What are min/max lengths (title 0/1/200/201 chars)?
- Empty/null/None values allowed?
- Special characters (emoji, SQL injection attempts, whitespace)?
- Invalid types (number in title, boolean in description)?

### 2. Authentication & Session States
- Behavior when not logged in (redirect? 401?)?
- Expired/invalid JWT token?
- Concurrent login from multiple devices?
- Token refresh failure?

### 3. Data & Resource States
- Creating task when user has 0/1/1000 tasks?
- Updating/deleting non-existent task ID?
- Updating task belonging to another user?
- Concurrent updates (two tabs editing same task)?

### 4. Network & System Errors
- Offline mode (service worker cache? queued actions?)?
- Server timeout or 5xx responses?
- Database connection failure?
- Rate limiting triggered?

### 5. Filtering & Pagination States
- Filter by invalid status value?
- Empty result set (no tasks matching filter)?
- Very large page size request?
- Cursor/pagination token tampering?

### 6. Frontend-Specific Contexts
- Slow network (loading skeletons shown?)?
- Small screen (responsive overflow?)?
- Keyboard vs touch input?
- Dark mode contrast issues?

### 7. Multi-Context Paths (MCP)
- Happy path documented?
- At least 7 alternate paths (errors, boundaries, states)?
- Each path has clear expected outcome?
- Recovery actions specified (retry, message, redirect)?

## Decision Principles

Apply these frameworks when documenting edge cases:

### 1. MCP Documentation Standard
**Principle**: Every user story must have 1 happy + minimum 7 alternate paths

**Template**:
```
## User Story: As a user, I can create a task

### Happy Path
1. Logged in → form → valid input → submit → task created → list updated

### Alternate/Error Paths (MCP)
1. Not logged in → redirect to login (preserve form data?)
2. Empty title → frontend validation + backend 400
3. Title >200 chars → validation error with exact message
4. Network offline → queue action or show error
5. Server 500 → retry button + toast
6. Duplicate title → allow (or 409 if unique constraint)
7. Concurrent create → optimistic UI + conflict resolution
```

### 2. Layered Defense Table
**Principle**: Errors caught at multiple layers

| Scenario | Frontend | Backend | Database | User Feedback |
|----------|----------|---------|----------|---------------|
| Empty title | Disable submit, red border | 400 + details | - | "Title is required" |
| Title too long | Input max_length | Pydantic validation | CHECK constraint | "Max 200 characters" |
| Invalid user_id | Impossible (from JWT) | 403 if mismatch | FK prevents | "Unauthorized" |
| DB offline | Loading forever → timeout | Retry logic | - | "Try again later" |

### 3. Boundary Value Table
**Principle**: Test at exact boundaries

| Field | Lower-1 | Lower | Nominal | Upper | Upper+1 |
|-------|---------|-------|---------|-------|---------|
| Title length | 0 | 1 | 50 | 200 | 201 |
| Description | None | "" | 100 chars | 1000 | 1001 |
| Task count per user | - | 0 | 10 | 1000 | 1001 (if limit) |

### 4. Error State Visibility
**Principle**: Users always know what happened

**Required**:
- Toast/notification for all outcomes
- Preserve form data on error
- Loading indicators during async
- Empty state UI for no results

### 5. Recovery & Resilience
**Principle**: System degrades gracefully

- Auto-retry for transient errors?
- Offline fallback (localStorage sync)?
- Conflict detection for concurrent edits?
- Undo for destructive actions?

## Usage Example

**Scenario**: Documenting edge cases for task creation feature

**Invocation**:
```
Apply feature-edge-case skill to @specs/features/task-crud.md create task user story
Include full MCP with 7+ paths
```

**Expected Output**:
```
=== EDGE CASE & MCP ANALYSIS ===
Feature: Create Task

--- BOUNDARY CONDITIONS ---
✓ Title: 0 (invalid), 1 (valid), 200 (valid), 201 (invalid)
✓ Description: null, empty, 1000, 1001 chars

--- AUTH STATES ---
✓ Not logged in → redirect to /login with return_url
✓ Expired token → auto refresh or re-login

--- SYSTEM STATES ---
✓ No network → show offline toast, queue for later?
✓ Server 500 → retry button

--- MCP (8 paths identified) ---
1. Happy: Valid input → 201 Created → redirect to list
2. Empty title → frontend block + red message
3. Title too long → backend 400 + field detail
4. Invalid chars (script tag) → sanitized or rejected
5. Concurrent creates → all succeed (no uniqueness)
6. Rate limited → 429 → "Try again in X seconds"
7. DB constraint violation → 500 masked as "Try later"
8. Slow response → skeleton → success toast

--- RECOMMENDATIONS ---
Add toast notifications for all outcomes
Preserve form on error
Add optimistic create with undo

--- VERDICT ---
Status: REVISE – Add MCP section to spec with 7+ paths
```

## Self-Check Validation

After applying to a feature, verify:

- [ ] Happy path clearly defined
- [ ] Minimum 7 alternate/error paths documented
- [ ] All input boundaries covered
- [ ] Auth states (logged in/out/expired) handled
- [ ] Network/system errors addressed
- [ ] Layered validation (frontend + backend + DB)
- [ ] User feedback specified for every path
- [ ] Recovery actions suggested
- [ ] MCP table or list added to spec
- [ ] No assumptions about "obvious" behavior

## Integration with SDD Workflow

**In Specify Phase**:
- Mandatory after user stories
- Block spec approval without MCP coverage

**In Plan Phase**:
- Use MCP to generate comprehensive tasks/tests

**With Other Skills**:
- Input to spec-review skill
- Drives backend-error-handling cases
- Informs frontend-component-design states

**Pre-Implementation Gate**:
- Feature blocked until edge cases documented

## Common Mistakes This Skill Prevents

1. **Missing Empty Input**: Allowing empty titles to reach backend
2. **No Offline Handling**: App breaks on no network
3. **Silent Failures**: Errors without user feedback
4. **Assumed Auth**: Features working when not logged in
5. **No Boundaries**: Crashes on 1001 char input
6. **Single Path Thinking**: Only happy path tested
7. **Concurrent Blindness**: Lost updates in multi-tab

## Skill Evolution Notes

**Future enhancements**:
- Add AI-specific edge cases (malformed natural language)
- Integrate with automated test generation
- Include performance edge cases (1000+ tasks)
- Add accessibility contexts (screen reader paths)

---

**Skill Status**: Production Ready
**Last Updated**: 2025-12-26
**Maintenance**: Review per new feature type

---