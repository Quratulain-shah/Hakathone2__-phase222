# Feature Specification: Todo App Phase 2 - Backend API Implementation (FastAPI + SQLModel)

**Feature Branch**: `002-backend-api`
**Created**: 2025-12-27
**Status**: Draft
**Input**: User description: "Todo App Phase 2 - Backend API Implementation (FastAPI + SQLModel)

# Feature: Todo App Full-Stack Backend (Phase 2 - Backend Only)

## Overview
Implement the complete FastAPI backend API for the Todo App Phase 2. This specification focuses exclusively on the backend – API routes, models, database schema, error handling, and user isolation patterns. The backend will serve the existing frontend via the defined REST endpoints.

**Important**: Real JWT validation and Better Auth integration will be mocked/placeholder for now. Full auth security in next sub-phase.

## Purpose
Provide secure, performant REST API endpoints that the frontend can consume for task CRUD operations with proper user scoping, validation, and error responses.

## In-Scope (Backend Phase 2a)
- FastAPI app structure with APIRouter
- Task CRUD endpoints under /api/v1/{user_id}/tasks
- SQLModel models for Task and User (mock)
- Database connection via AsyncSession (Neon URL placeholder)
- Pydantic schemas for request/response
- Structured error handling (HTTPException with JSON details)
- User isolation pattern (path user_id validation ready for JWT)
- Mock current_user dependency
- Async routes and operations

## Out-of-Scope (Deferred)
- Real JWT verification middleware
- Better Auth direct integration
- Database migrations (Alembic)
- Rate limiting, logging, monitoring
- Advanced querying (search, pagination beyond basic)

## API Endpoints (Exact from Frontend Spec)

| Method | Endpoint                        | Description                  | Auth Required |
|--------|---------------------------------|------------------------------|---------------|
| GET    | /api/v1/{user_id}/tasks         | List user tasks              | Yes (mock)    |
| POST   | /api/v1/{user_id}/tasks         | Create task                  | Yes (mock)    |
| GET    | /api/v1/{user_id}/tasks/{id}    | Get single task              | Yes (mock)    |
| PUT    | /api/v1/{user_id}/tasks/{id}    | Full update task             | Yes (mock)    |
| PATCH  | /api/v1/{user_id}/tasks/{id}    | Partial update (e.g., complete) | Yes (mock) |
| DELETE | /api/v1/{user_id}/tasks/{id}    | Delete task                  | Yes (mock)    |

## User Stories (Backend Perspective)

- As the frontend, I can call task endpoints and receive JSON responses with proper status codes
- As the backend, I validate all inputs via Pydantic and return structured errors
- As the backend, I enforce user ownership (mock check on user_id)
- As the backend, I handle database operations asynchronously

## Acceptance Criteria

### Task CRUD Endpoints
- All endpoints return correct status codes (200, 201, 204, 400, 404, etc.)
- POST creates task with title/description, returns created object
- GET list returns array of user's tasks only
- GET single returns 404 if not found or wrong user
- PUT/PATCH updates fields, returns updated object
- DELETE returns 204, removes task

### Validation & Errors
- Invalid input → 400/422 with structured JSON error
- Non-existent task → 404
- Wrong user_id (mock) → 403
- Structured error format with code, message, details

### Database & Models
- SQLModel Task model with user_id FK
- AsyncSession dependency
- Proper indexes on user_id, completed

### Performance & Async
- All routes async def
- DB operations awaited properly

## Edge Cases
- Empty task list → return []
- Invalid JSON body → 400
- Very long title (>200) → validation error
- Concurrent requests → no race conditions (DB handles)

## Constraints & Standards
- Must follow fastapi-route-implementation skill
- Must follow backend-error-handling skill
- Must follow db-schema-validator skill
- User isolation pattern ready (path user_id check)
- Async everywhere
- Pydantic v2 models
- No sync DB calls

## Success Metrics
- All endpoints match frontend expectations
- 100% compliance with backend skills
- Ready for real JWT in next phase
- Works with existing frontend /lib/api.ts

This is backend-only. Frontend already consumes these endpoints."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Backend API Provides Task CRUD Operations (Priority: P1)

As a frontend application, I need to be able to create, read, update, and delete tasks through a REST API so that users can manage their todo lists effectively. The backend must provide secure endpoints that properly isolate user data and return consistent JSON responses with appropriate HTTP status codes.

**Why this priority**: This is the core functionality that enables the entire todo app to function. Without these basic CRUD operations, the frontend cannot provide any value to users.

**Independent Test**: The frontend can perform all basic task operations (create, read, update, delete) by making HTTP requests to the backend API and receiving properly formatted JSON responses with correct status codes. Each operation can be tested independently and provides immediate value to users.

**Acceptance Scenarios**:

1. **Given** a user wants to create a new task, **When** they submit a POST request to /api/v1/{user_id}/tasks with valid task data, **Then** the API returns a 201 Created status with the created task object
2. **Given** a user wants to view their tasks, **When** they submit a GET request to /api/v1/{user_id}/tasks, **Then** the API returns a 200 OK status with an array of their tasks
3. **Given** a user wants to update a specific task, **When** they submit a PUT request to /api/v1/{user_id}/tasks/{id} with updated data, **Then** the API returns a 200 OK status with the updated task object
4. **Given** a user wants to delete a specific task, **When** they submit a DELETE request to /api/v1/{user_id}/tasks/{id}, **Then** the API returns a 204 No Content status

---

### User Story 2 - Backend API Provides User Isolation and Security (Priority: P1)

As a backend service, I need to ensure that users can only access and modify their own tasks, preventing unauthorized access to other users' data. The API must validate that the user_id in the path matches the authenticated user (with mock authentication for now).

**Why this priority**: Security and data isolation are critical for user trust and privacy. Without proper user isolation, users could access each other's tasks, which would be a major security vulnerability.

**Independent Test**: When a user makes requests with a user_id that doesn't match their authentication context, the API returns a 403 Forbidden status, preventing unauthorized access. This can be tested by attempting to access tasks with mismatched user_ids.

**Acceptance Scenarios**:

1. **Given** a user attempts to access tasks with a different user_id than their own, **When** they make a request to /api/v1/{different_user_id}/tasks, **Then** the API returns a 403 Forbidden status
2. **Given** a user attempts to access a specific task that belongs to a different user, **When** they make a request to /api/v1/{different_user_id}/tasks/{id}, **Then** the API returns a 403 Forbidden status
3. **Given** a user makes a request with their correct user_id, **When** they access their own tasks, **Then** the API allows the operation and returns appropriate data

---

### User Story 3 - Backend API Provides Input Validation and Error Handling (Priority: P2)

As a frontend application, I need the backend API to validate input data and provide structured error responses so that I can display meaningful error messages to users and handle different error scenarios appropriately.

**Why this priority**: Proper validation and error handling improve user experience by providing clear feedback when something goes wrong and prevent invalid data from being stored in the database.

**Independent Test**: When invalid data is submitted to the API, it returns appropriate error responses with clear messages that the frontend can use to inform users about what went wrong and how to fix it.

**Acceptance Scenarios**:

1. **Given** a user submits invalid task data (e.g., empty title), **When** they make a POST request to /api/v1/{user_id}/tasks, **Then** the API returns a 400 Bad Request status with a structured error object
2. **Given** a user requests a non-existent task, **When** they make a GET request to /api/v1/{user_id}/tasks/{invalid_id}, **Then** the API returns a 404 Not Found status with an appropriate error message
3. **Given** a user submits malformed JSON, **When** they make a request to any endpoint, **Then** the API returns a 400 Bad Request status with a clear error message

---

### User Story 4 - Backend API Provides Asynchronous Performance (Priority: P2)

As a backend service, I need to handle all database operations asynchronously to ensure optimal performance and prevent blocking operations that could impact user experience during high-traffic periods.

**Why this priority**: Asynchronous operations improve scalability and responsiveness, allowing the backend to handle multiple requests efficiently without blocking other operations.

**Independent Test**: API endpoints handle requests asynchronously without blocking, allowing concurrent operations to proceed without interference. Performance can be measured by testing concurrent request handling.

**Acceptance Scenarios**:

1. **Given** multiple concurrent requests to the API, **When** they are processed simultaneously, **Then** all requests complete successfully without blocking each other
2. **Given** a database operation is in progress, **When** additional requests arrive, **Then** they are handled without blocking and return appropriate responses

---

### Edge Cases

- When a user requests tasks and has no tasks created, the API returns an empty array instead of an error
- When a user submits a request with an extremely long title (>200 characters), the API validates and returns a 400 error with a validation message
- When a user makes a request with invalid JSON format, the API returns a 400 error with a clear parsing error message
- When multiple users make concurrent requests to create tasks simultaneously, the system handles them without race conditions
- When a user attempts to access a task with an invalid ID format (non-numeric), the API returns a 422 Unprocessable Entity error

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide REST API endpoints for task CRUD operations at /api/v1/{user_id}/tasks
- **FR-002**: System MUST implement GET, POST, PUT, PATCH, and DELETE methods for task management
- **FR-003**: System MUST validate all input data using Pydantic schemas and return structured error responses
- **FR-004**: System MUST enforce user isolation by ensuring users can only access tasks associated with their user_id
- **FR-005**: System MUST return appropriate HTTP status codes (200, 201, 204, 400, 403, 404, 422) for different scenarios
- **FR-006**: System MUST use SQLModel for database models with proper relationships and constraints
- **FR-007**: System MUST implement all API routes as async functions using async/await patterns
- **FR-008**: System MUST use AsyncSession for database operations to ensure proper asynchronous behavior
- **FR-009**: System MUST return JSON responses with consistent structure for all endpoints
- **FR-010**: System MUST handle validation errors and return structured JSON error objects with code, message, and details
- **FR-011**: System MUST mock the current_user dependency for authentication (real JWT validation deferred to next phase)
- **FR-012**: System MUST ensure proper database indexing on user_id and completed fields for performance
- **FR-013**: System MUST handle concurrent requests without race conditions

### Key Entities

- **Task**: Represents a user's todo item with attributes like id, title, description, completed status, and user_id reference
- **User**: Represents a user account with user_id as the primary identifier (mocked for now, real implementation deferred)
- **API Response**: Structured JSON objects containing either data or error information with appropriate HTTP status codes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six required API endpoints (GET, POST, GET by ID, PUT, PATCH, DELETE) return correct HTTP status codes and JSON responses
- **SC-002**: Users can create, read, update, and delete tasks with 99% success rate under normal load conditions
- **SC-003**: API enforces user isolation with 100% accuracy - users cannot access tasks belonging to other users
- **SC-004**: Input validation prevents invalid data from being stored and returns appropriate error messages with 100% accuracy
- **SC-005**: All API endpoints operate asynchronously without blocking, supporting concurrent requests
- **SC-006**: Frontend application can successfully consume all API endpoints and display appropriate responses to users
- **SC-007**: Error handling provides clear, structured responses that enable meaningful error messages in the frontend