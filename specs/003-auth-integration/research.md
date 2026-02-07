# Research: Todo App Authentication Integration

## Overview
Research findings for implementing Better Auth with JWT integration in the Todo App, replacing mock authentication with a production-ready system.

## Decision: Better Auth Implementation Approach
**Rationale**: Better Auth v0.4+ provides a complete authentication solution with JWT plugin that integrates well with Next.js and FastAPI. It handles user registration, login, password reset, and session management out-of-the-box while allowing custom JWT token generation for backend verification.

## Decision: JWT Token Storage Strategy
**Rationale**: For this hackathon implementation, JWT tokens will be stored in localStorage for simplicity. While httpOnly cookies are more secure against XSS attacks, localStorage implementation is simpler and sufficient for the hackathon timeframe. The tokens will have a 7-day expiry as specified.

## Decision: Backend JWT Verification
**Rationale**: FastAPI will implement JWT verification middleware using the same shared secret as Better Auth. This ensures all API requests are validated for authentication before processing, maintaining security requirements from the constitution.

## Decision: User Isolation Strategy
**Rationale**: The existing pattern of using `{user_id}` in API paths will be maintained. The JWT verification will extract the user_id from the token and compare it with the path parameter to ensure users can only access their own data, meeting the security requirements.

## Decision: Database User Model
**Rationale**: Better Auth handles user storage internally, but we'll maintain the existing SQLModel User model for consistency with the current task model structure. This ensures proper foreign key relationships between tasks and users.

## Decision: API Client Integration
**Rationale**: The existing `/lib/api.ts` will be updated to automatically attach JWT tokens from localStorage to all API requests. This maintains the existing architecture while adding authentication.

## Alternatives Considered

### Authentication Solutions
- **Better Auth vs Auth.js/NextAuth.js**: Better Auth was chosen for its built-in JWT plugin and straightforward FastAPI integration
- **Better Auth vs Firebase Auth**: Better Auth was chosen to maintain consistency with the specified tech stack
- **Better Auth vs Custom JWT Implementation**: Better Auth provides more features out-of-the-box with less custom code

### Token Storage Options
- **localStorage vs httpOnly cookies**: localStorage chosen for simplicity in hackathon context
- **Session storage vs localStorage**: localStorage chosen for persistence across browser sessions

### Backend Authentication Methods
- **Middleware vs Per-Route Dependencies**: Middleware chosen for consistent application across all routes
- **Shared Secret vs Public/Private Key**: Shared secret chosen as specified in requirements and simpler to implement