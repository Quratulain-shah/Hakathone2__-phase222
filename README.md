# Todo App - Full Stack Task Management Application

A modern, full-stack task management application built with Next.js 14 (frontend) and FastAPI (backend). Features include JWT authentication, user-specific task isolation, responsive design, and persistent storage.

## Features

### Core Functionality
- **Task Management**: Create, read, update, and delete tasks
- **Task Status Tracking**: Mark tasks as pending or completed
- **Task Filtering**: Filter tasks by status (pending/completed)
- **Task Sorting**: Sort tasks by creation date or alphabetical order
- **Dashboard Views**: Multiple dashboard views (Luxury, Premium, Calendar)

### User Features
- **User Registration**: Create a new account with email and password
- **User Login**: Secure login with JWT authentication
- **User Isolation**: Each user can only see and manage their own tasks
- **Session Persistence**: Stay logged in across browser sessions
- **Secure Logout**: Clear session data on logout

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Toast Notifications**: Feedback for all user actions
- **Loading States**: Skeleton loaders during data fetching
- **Error Handling**: Graceful error displays with recovery options
- **Modal Dialogs**: Confirmation dialogs for destructive actions

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.11+** | Programming language |
| **FastAPI** | Web framework for building APIs |
| **SQLModel** | ORM for database operations |
| **Pydantic v2** | Data validation and settings |
| **asyncpg** | Async PostgreSQL driver |
| **python-jose** | JWT token handling |
| **passlib** | Password hashing |
| **uvicorn** | ASGI server |
| **Alembic** | Database migrations |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **React 18.3** | UI library |
| **Tailwind CSS** | Utility-first CSS framework |
| **Better Auth** | Authentication client |
| **GSAP** | Animation library |
| **Lucide React** | Icon library |
| **clsx & tailwind-merge** | CSS class utilities |

### Database
- **SQLite** (development): Local file-based database
- **PostgreSQL/Neon** (production): Cloud PostgreSQL database

## Architecture

### Backend Architecture

```
backend/
├── main.py              # FastAPI application entry point
├── config.py            # Configuration settings
├── database.py          # Database connection and setup
├── dependencies.py      # Dependency injection functions
├── utils.py             # Utility functions (JWT, passwords)
├── models/              # SQLModel database models
│   ├── task.py         # Task model
│   └── user.py         # User model
├── schemas/             # Pydantic schemas
│   ├── task.py         # Task schemas
│   └── error.py        # Error schemas
└── routes/              # API route handlers
    ├── auth.py         # Authentication endpoints
    └── tasks.py        # Task CRUD endpoints
```

### Frontend Architecture

```
frontend/src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   └── tasks/           # Tasks dashboard
├── auth/                # Authentication
│   ├── lib/             # Auth utilities & API client
│   ├── contexts/        # Auth context provider
│   ├── hooks/           # Auth hooks
│   └── types/           # Auth TypeScript types
├── contexts/            # React contexts (TaskContext)
├── components/          # React components
│   ├── ui/              # Reusable UI components
│   ├── tasks/           # Task-related components
│   ├── auth/            # Auth-related components
│   └── layout/          # Layout components
└── types/               # Shared TypeScript types
```

## Authentication Flow

### JWT Token Authentication

1. **Registration**
   - User submits email and password
   - Backend hashes password using PBKDF2
   - User record created in database
   - JWT token returned for immediate login

2. **Login**
   - User submits credentials
   - Backend verifies password hash
   - JWT token created with user ID in payload
   - Token returned to client

3. **API Requests**
   - Client includes JWT in `Authorization: Bearer <token>` header
   - Backend validates token and extracts user ID
   - User ID validated against requested resource
   - Response returned or 401/403 error raised

### User Isolation

Each task is linked to a `user_id` in the database. API endpoints:
- Validate that the authenticated user matches the requested resource owner
- Return 403 Forbidden if user ID mismatch
- Use parameterized queries to prevent SQL injection

## Database Schema

### User Table
```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Task Table
```sql
CREATE TABLE task (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/register` | Register a new user |
| POST | `/api/v1/login` | Login and get JWT token |
| GET | `/api/v1/me` | Get current user info |

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/{user_id}/tasks` | Get all tasks for user |
| POST | `/api/v1/{user_id}/tasks` | Create a new task |
| GET | `/api/v1/{user_id}/tasks/{id}` | Get specific task |
| PUT | `/api/v1/{user_id}/tasks/{id}` | Update entire task |
| PATCH | `/api/v1/{user_id}/tasks/{id}` | Partial update task |
| DELETE | `/api/v1/{user_id}/tasks/{id}` | Delete task |

### Request/Response Examples

**Create Task**
```json
// Request
POST /api/v1/1/tasks
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs"
}

// Response
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false,
  "id": 1,
  "user_id": 1,
  "created_at": "2025-12-29T19:19:23",
  "updated_at": "2025-12-29T19:19:23"
}
```

**Login Response**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

## Project Structure

```
todo_app/
├── backend/              # FastAPI backend
│   ├── requirements.txt  # Python dependencies
│   ├── main.py          # Application entry point
│   └── ...
├── frontend/            # Next.js frontend
│   ├── package.json     # Node.js dependencies
│   ├── next.config.js   # Next.js configuration
│   ├── tailwind.config.js
│   └── src/             # Source code
├── specs/               # Specification documents
├── history/             # Prompt history records
└── README.md           # This file
```

## Setup and Running

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment (optional):
   ```bash
   cp .env.example .env  # Edit .env with your settings
   ```

5. Run the server:
   ```bash
   python main.py
   ```
   Or with uvicorn:
   ```bash
   uvicorn main:app --reload --port 8080
   ```

6. Backend runs at `http://localhost:8080`
   - API docs at `http://localhost:8080/api/v1/docs`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Frontend runs at `http://localhost:3000`

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=sqlite+aiosqlite:///./todo_app.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

### Linting
```bash
# Backend
cd backend
ruff check .

# Frontend
cd frontend
npm run lint
```

### Building for Production

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080
```

**Frontend**
```bash
cd frontend
npm run build
npm start
```

## Security Considerations

- **Password Hashing**: Uses PBKDF2 with salt for secure password storage
- **JWT Tokens**: Signed with HS256 algorithm, expires in 30 minutes
- **User Isolation**: All endpoints validate user ownership
- **CORS**: Configured for specific origins in production
- **SQL Injection Prevention**: Uses parameterized queries via SQLModel
- **Input Validation**: Pydantic schemas validate all inputs

## License

This project is open source and available for personal and commercial use.


uvicorn main:app --reload --port 8080