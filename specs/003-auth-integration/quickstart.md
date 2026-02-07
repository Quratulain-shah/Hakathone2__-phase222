# Quickstart: Todo App Authentication Integration

## Overview
This guide provides the essential information to get the authentication system up and running quickly.

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL database (Neon Serverless recommended)

## Environment Setup

### Backend (.env)
```bash
DATABASE_URL=postgresql+asyncpg://user:password@localhost/todo_app
BETTER_AUTH_SECRET=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
BETTER_AUTH_SECRET=your-secret-key-here
```

## Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
# Add better-auth to dependencies
npm install better-auth
```

## Running the Application

### Backend
```bash
cd backend
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

## Key Integration Points

### 1. Better Auth Configuration
- Configure Better Auth with JWT plugin on frontend
- Share BETTER_AUTH_SECRET with backend for JWT verification

### 2. JWT Token Flow
- User logs in via Better Auth → JWT token issued
- Token stored in localStorage
- Token automatically attached to API requests in /lib/api.ts
- Backend verifies token and extracts user_id

### 3. User Isolation
- All API endpoints validate `path user_id == JWT user_id`
- Return 403 Forbidden if validation fails
- Database queries filtered by authenticated user_id

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Protected Task Endpoints
- `GET /api/v1/{user_id}/tasks` - Get user's tasks
- `POST /api/v1/{user_id}/tasks` - Create task for user
- `GET /api/v1/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/v1/{user_id}/tasks/{id}` - Update task
- `DELETE /api/v1/{user_id}/tasks/{id}` - Delete task

## Testing Authentication

1. Register a new user via `/api/auth/signup`
2. Login to get JWT token
3. Access protected endpoints with Authorization header
4. Verify user isolation works by trying to access other users' data