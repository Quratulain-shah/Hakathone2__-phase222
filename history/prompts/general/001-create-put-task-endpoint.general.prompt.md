---
id: 001
title: Create PUT Task Endpoint
stage: general
date: 2025-12-27
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: 002-backend-api
user: Claude
command: "Implement FastAPI PUT endpoint for task updates"
labels: [backend,api,tasks,update,fastapi]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - C:\Users\LENOVO X1 YOGA\Desktop\todo_app\todo_app\backend\routes\tasks.py
tests:
---

## Prompt

Create a FastAPI PUT endpoint for /api/v1/{user_id}/tasks/{id} that updates a specific task for the specified user. The endpoint should:

1. Accept user_id and task id as path parameters and task data in request body
2. Use database dependency for async session
3. Validate user isolation (user_id in path matches authenticated user and task belongs to user)
4. Validate input using Pydantic schema
5. Update task in database completely
6. Return updated task with proper Pydantic response model
7. Return 404 if task doesn't exist
8. Handle errors appropriately with structured responses
9. Use async/await patterns throughout
10. Follow the API contract specified in the task requirements

Use the models and schemas already created in the backend project.

## Response snapshot

I have successfully implemented the FastAPI PUT endpoint for updating a specific task for a user. The implementation includes:

1. Added the PUT endpoint at `/api/v1/{user_id}/tasks/{id}` in the tasks routes file
2. Properly imported the TaskUpdate schema from backend.schemas.task
3. Implemented user isolation validation by checking that the user_id in the path matches the authenticated user
4. Added database query to find the specific task belonging to the specified user
5. Implemented proper error handling returning 404 if the task doesn't exist
6. Used async/await patterns throughout the endpoint
7. Used Pydantic validation with the TaskUpdate schema
8. Updated task fields only for those provided in the request (using exclude_unset=True)
9. Added proper response model (TaskRead) that matches the existing schema
10. Included comprehensive error handling with structured responses

The endpoint follows the same patterns as the existing endpoints in the file, ensuring consistency with the codebase.

## Outcome

- ✅ Impact: New PUT endpoint added for updating tasks with proper user isolation
- 🧪 Tests: No automated tests created, manual verification needed
- 📁 Files: backend/routes/tasks.py updated with new endpoint
- 🔁 Next prompts: Test the endpoint functionality, add tests
- 🧠 Reflection: Implementation follows existing patterns and security practices

## Evaluation notes (flywheel)

- Failure modes observed: None identified during implementation
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Not applicable
- Next experiment (smallest change to try): Add unit tests for the new endpoint