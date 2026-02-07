# Data Model: Todo App Authentication Integration

## Entities

### User
**Description**: Represents an authenticated user in the system
- **id**: Unique identifier (string/UUID) - from Better Auth
- **email**: User's email address (string) - unique, required
- **name**: User's display name (string) - required
- **created_at**: Timestamp when user account was created (datetime)
- **updated_at**: Timestamp when user account was last updated (datetime)

**Validation Rules**:
- Email must be a valid email format
- Email must be unique across all users
- Name must be 1-100 characters

**Relationships**:
- One-to-many with Task entity (user has many tasks)

### JWT Token
**Description**: JSON Web Token containing user authentication information
- **header**: Token header containing algorithm and token type
- **payload**: Contains user_id, email, name, and expiry information
- **signature**: Token signature for verification

**Validation Rules**:
- Must be properly formatted JWT
- Must not be expired
- Must have valid signature with shared secret
- Must contain valid user_id in payload

### Session
**Description**: Represents the authenticated state of a user's interaction
- **token**: JWT token string stored in browser
- **expires_at**: Expiration timestamp for the token
- **user_id**: Reference to the authenticated user

## State Transitions

### User Authentication Flow
1. **Unauthenticated** → **Registration**: User provides email/password to create account
2. **Unauthenticated** → **Login**: User provides credentials to authenticate
3. **Login** → **Authenticated**: JWT token is issued and stored
4. **Authenticated** → **Logout**: JWT token is cleared from storage
5. **Authenticated** → **Token Expiry**: Session becomes invalid after expiry

### API Request Flow
1. **Request Received** → **Token Validation**: JWT token extracted and validated
2. **Token Valid** → **User Identified**: User ID extracted from token
3. **User Identified** → **Authorization Check**: Path user_id compared with token user_id
4. **Authorized** → **Process Request**: Request is processed normally
5. **Unauthorized** → **Reject Request**: Return 401 or 403 error