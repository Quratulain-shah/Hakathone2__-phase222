# Todo App Backend API

This is the backend API for the Todo App Phase 2, providing secure user-isolated CRUD endpoints for task management.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variables:
   ```bash
   export DATABASE_URL=postgresql+asyncpg://user:password@localhost/todo_app
   export SECRET_KEY=your-secret-key-here
   ```

3. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

The API provides the following endpoints under `/api/v1/{user_id}/tasks`:
- `GET /` - List user tasks
- `POST /` - Create task
- `GET /{id}` - Get single task
- `PUT /{id}` - Full update task
- `PATCH /{id}` - Partial update task
- `DELETE /{id}` - Delete task

## Architecture

- FastAPI for the web framework
- SQLModel for database models and ORM
- Pydantic for request/response validation
- Async operations throughout
- User isolation pattern implemented