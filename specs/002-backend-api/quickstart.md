# Quickstart Guide: Todo App Backend API

## Overview
This guide provides quick setup instructions for the Todo App backend API.

## Prerequisites
- Python 3.11+
- PostgreSQL database (Neon Serverless recommended)
- Environment variables configured

## Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd todo_app
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install fastapi sqlmodel uvicorn python-multipart
```

### 4. Environment Variables
Create a `.env` file with:
```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Start the Server
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Task Management
- `GET /api/v1/{user_id}/tasks` - List user tasks
- `POST /api/v1/{user_id}/tasks` - Create task
- `GET /api/v1/{user_id}/tasks/{id}` - Get single task
- `PUT /api/v1/{user_id}/tasks/{id}` - Update task
- `PATCH /api/v1/{user_id}/tasks/{id}` - Partial update
- `DELETE /api/v1/{user_id}/tasks/{id}` - Delete task

### Example Usage
```bash
# Create a task
curl -X POST http://localhost:8000/api/v1/1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Sample task", "description": "Task description"}'

# List tasks
curl http://localhost:8000/api/v1/1/tasks

# Get specific task
curl http://localhost:8000/api/v1/1/tasks/1

# Update task
curl -X PUT http://localhost:8000/api/v1/1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated task", "completed": true}'

# Delete task
curl -X DELETE http://localhost:8000/api/v1/1/tasks/1
```

## Development
- All routes are async and use async/await patterns
- Database sessions are handled via FastAPI dependencies
- Input validation is performed using Pydantic models
- Error responses follow structured JSON format