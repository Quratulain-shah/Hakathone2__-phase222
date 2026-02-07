---
id: 1
title: "GET Task Endpoint Implementation"
stage: spec
date_iso: "2025-12-27"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "tasks"
branch: "002-backend-api"
user: "LENOVO X1 YOGA"
command: "implement-get-task-endpoint"
labels:
  - "backend"
  - "api"
  - "tasks"
  - "fastapi"
  - "endpoint"
files_yaml:
  - "C:\\Users\\LENOVO X1 YOGA\\Desktop\\todo_app\\todo_app\\backend\\routes\\tasks.py"
tests_yaml: []
links:
  spec: null
  ticket: null
  adr: null
  pr: null
---

# GET Task Endpoint Implementation

## User Prompt

Create a FastAPI GET endpoint for /api/v1/{user_id}/tasks/{id} that returns a specific task for the specified user. The endpoint should:

1. Accept user_id and task id as path parameters
2. Use database dependency for async session
3. Validate user isolation (user_id in path matches authenticated user and task belongs to user)
4. Return single task with proper Pydantic response model
5. Return 404 if task doesn't exist
6. Handle errors appropriately with structured responses
7. Use async/await patterns throughout
8. Follow the API contract specified in the task requirements

Use the models and schemas already created in the backend project.

## Implementation Details

I've implemented the GET endpoint for retrieving a specific task at `/api/v1/{user_id}/tasks/{id}`. The implementation includes:

1. **Path Parameters**: The endpoint accepts `user_id` and `id` as path parameters
2. **Database Dependency**: Uses `get_db_session` dependency for async database session
3. **User Isolation**: Validates that the user_id in path matches the authenticated user and ensures the task belongs to that user
4. **Response Model**: Returns the task using the existing `TaskRead` Pydantic model
5. **404 Handling**: Returns 404 status code if the task doesn't exist or doesn't belong to the user
6. **Error Handling**: Structured error responses with proper exception handling
7. **Async/Await**: Uses async/await patterns throughout
8. **Documentation**: Comprehensive docstring with args, returns, and raises sections

## Code Added

The implementation adds a new `get_task` function to the tasks routes file that:
- Validates user isolation by checking that the authenticated user matches the user_id in the path
- Queries for the specific task with both the task ID and user ID to ensure user isolation
- Returns 404 if the task doesn't exist or doesn't belong to the user
- Handles errors appropriately with structured responses
- Uses the existing TaskRead response model

## Validation

The implementation follows all the requirements:
- ✓ Accepts user_id and task id as path parameters
- ✓ Uses database dependency for async session
- ✓ Validates user isolation (user_id in path matches authenticated user and task belongs to user)
- ✓ Returns single task with proper Pydantic response model
- ✓ Returns 404 if task doesn't exist
- ✓ Handles errors appropriately with structured responses
- ✓ Uses async/await patterns throughout
- ✓ Follows the API contract using existing models and schemas