# Data Model: Todo App Phase 2 - Backend API

## Overview
This document defines the data models for the Todo App backend API, including entities, relationships, and validation rules.

## Entity: Task

### Fields
- **id**: Integer (Primary Key, Auto-increment)
  - Type: int
  - Constraints: Primary Key, Auto-increment
  - Validation: Auto-generated, read-only

- **user_id**: Integer (Foreign Key to User)
  - Type: int
  - Constraints: Not Null, Foreign Key reference
  - Validation: Must match authenticated user_id for access control

- **title**: String
  - Type: str
  - Constraints: Not Null
  - Validation: Max length 200 characters, minimum 1 character

- **description**: String (Optional)
  - Type: str | None
  - Constraints: Nullable
  - Validation: Max length 1000 characters

- **completed**: Boolean
  - Type: bool
  - Constraints: Not Null, Default False
  - Validation: Boolean value only

- **created_at**: DateTime
  - Type: datetime
  - Constraints: Not Null, Auto-generated
  - Validation: Auto-generated on creation

- **updated_at**: DateTime
  - Type: datetime
  - Constraints: Not Null, Auto-generated
  - Validation: Auto-generated on update

### Indexes
- Index on `user_id` for efficient user-based queries
- Index on `completed` for filtering by completion status
- Index on `created_at` for chronological sorting

### Relationships
- Belongs to one User (via user_id foreign key)

## Entity: User (Mock)

### Fields
- **id**: Integer (Primary Key, Auto-increment)
  - Type: int
  - Constraints: Primary Key, Auto-increment
  - Validation: Auto-generated, read-only

- **email**: String
  - Type: str
  - Constraints: Not Null, Unique
  - Validation: Valid email format

- **created_at**: DateTime
  - Type: datetime
  - Constraints: Not Null, Auto-generated
  - Validation: Auto-generated on creation

### Note
This is a mock User model for Phase 2. Real authentication will be implemented in the next phase.

## Validation Rules

### Task Creation
- Title must be between 1 and 200 characters
- Description (if provided) must be between 1 and 1000 characters
- User_id must match the authenticated user

### Task Update
- Title (if provided) must be between 1 and 200 characters
- Description (if provided) must be between 0 and 1000 characters
- User_id cannot be changed
- Completed status can be toggled

### Task Retrieval
- Users can only retrieve tasks with matching user_id
- Non-existent tasks return 404 error
- Invalid user_id formats return 422 error

## State Transitions

### Task States
- **Active**: completed = False
- **Completed**: completed = True

### Transitions
- Active → Completed: via PUT/PATCH with completed = True
- Completed → Active: via PUT/PATCH with completed = False