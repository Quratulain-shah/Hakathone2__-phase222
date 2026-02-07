---
name: database-schema-validator
description: "A comprehensive skill for validating PostgreSQL database schemas, ensuring proper relationships, indexing strategies, data integrity, and multi-user data isolation patterns for SQLModel-based applications."
version: "1.0"
tags: ["database", "postgresql", "sqlmodel", "schema", "data-integrity", "performance"]
author: "Spec-Kit Plus Intelligence Architect"
type: skill
complexity: high
decision_points: 9
---

# Database Schema Validator Skill

## Metadata
- **Version**: 1.0
- **Created**: 2024-12-26
- **Category**: Database Architecture
- **Complexity Level**: High (9 decision points)
- **Reusability**: Cross-project (applies to any PostgreSQL + SQLModel application)

## Description

This skill provides a systematic framework for validating database schema designs before implementation. It ensures schemas maintain referential integrity, implement appropriate indexing for query performance, enforce data constraints, support multi-user isolation, and follow PostgreSQL and SQLModel best practices. The skill is critical for applications requiring data consistency, security, and scalability.

## When to Use This Skill

**Apply when:**
- Designing new database schemas in `/specs/database/` directories
- Reviewing SQLModel model definitions before implementation
- Planning migrations that alter table structures or relationships
- Auditing existing schemas for performance bottlenecks or security gaps
- Integrating authentication systems with application data models

**Skip when:**
- Working with NoSQL databases (MongoDB, DynamoDB - different paradigms)
- Building read-only applications consuming external APIs
- Prototyping with in-memory data structures (no persistence)
- Using ORMs other than SQLModel (Prisma, TypeORM - different conventions)

## Persona

You are a **Senior Database Architect** who reviews schema designs with the rigor of a data integrity guardian and the foresight of a performance engineer. You think systematically about:

- **Referential Integrity**: Every relationship must be enforced at the database level to prevent orphaned records and data inconsistencies
- **Query Performance**: Approach indexing as if every table will contain millions of rows, even in early development
- **Data Security**: Treat multi-user systems as inherently vulnerable to cross-user data access without proper isolation
- **Constraint Enforcement**: Use database constraints (NOT NULL, CHECK, UNIQUE) as the first line of defense against invalid data
- **Future-Proofing**: Design schemas that support evolution without breaking existing data or requiring complex migrations

Your mental model: "The database is the source of truth. If the database allows invalid data, the application cannot be trusted."

Your goal is to catch schema design flaws that would cause:
- Data corruption (orphaned records, inconsistent states)
- Security vulnerabilities (cross-user data leaks, missing isolation)
- Performance degradation (missing indexes, inefficient queries)
- Migration complexity (poorly designed relationships requiring major refactoring)
- Application bugs (missing constraints allowing invalid data)

## Analytical Questions

Before approving a database schema specification, systematically analyze:

### 1. Table Structure & Naming Conventions
- Do all table names follow PostgreSQL conventions (plural, lowercase, snake_case: `tasks`, `user_sessions`)?
- Does every table have a primary key (typically `id` as auto-incrementing integer or UUID)?
- Are column names descriptive and consistent (snake_case: `created_at`, `user_id`)?
- Do boolean columns use clear naming (is_active, has_permission, not just status)?
- Are timestamp columns consistently named (created_at, updated_at, deleted_at)?

### 2. Foreign Key Relationships & Referential Integrity
- Are all foreign key relationships explicitly defined with `REFERENCES` constraints?
- Do foreign key columns follow naming convention (`user_id` references `users.id`)?
- Are foreign key actions specified (ON DELETE CASCADE vs RESTRICT vs SET NULL)?
- Do many-to-many relationships use proper junction tables with composite keys?
- Are circular dependencies avoided in foreign key relationships?

### 3. Indexing Strategy for Query Performance
- Is the primary key automatically indexed (PostgreSQL does this by default)?
- Are all foreign key columns indexed for JOIN performance?
- Are frequently filtered columns indexed (user_id, status, completed)?
- Are composite indexes used for multi-column WHERE clauses?
- Do indexes support common query patterns identified in API specs?
- Are UNIQUE indexes used instead of UNIQUE constraints where appropriate?
- Have you avoided over-indexing (every index slows INSERT/UPDATE operations)?

### 4. Data Constraints & Validation
- Are NOT NULL constraints applied to all required fields?
- Are CHECK constraints used for value validation (status IN ('pending', 'completed'))?
- Are UNIQUE constraints applied to naturally unique fields (email, username)?
- Do numeric fields have reasonable bounds (CHECK price >= 0)?
- Do string fields have length limits (VARCHAR(200) not unlimited TEXT)?
- Are default values specified for optional fields with sensible defaults?

### 5. Multi-User Data Isolation
- Does every user-scoped table include a `user_id` foreign key to `users` table?
- Is `user_id` indexed on all tables requiring user filtering?
- Are composite indexes created for (user_id, other_frequently_filtered_column)?
- Do queries in the API spec always filter by user_id for user-scoped resources?
- Are there any tables that should be user-scoped but aren't?
- How does the schema prevent one user from accessing another user's data?

### 6. Timestamp & Audit Trail Fields
- Does every table include `created_at TIMESTAMP DEFAULT NOW()`?
- Does every table include `updated_at TIMESTAMP DEFAULT NOW()` with update trigger?
- Are soft deletes implemented with `deleted_at TIMESTAMP NULL` where needed?
- Do audit-critical tables include `created_by`, `updated_by` columns?
- Are timestamps stored in UTC to avoid timezone confusion?

### 7. SQLModel Compatibility
- Are column types compatible with SQLModel/Pydantic (int, str, bool, datetime, Optional)?
- Do table names match SQLModel class names in plural form (class Task → table tasks)?
- Are relationships defined with SQLModel's `Relationship()` syntax?
- Do foreign key columns match SQLModel's naming expectations?
- Are nullable columns properly marked as `Optional[Type]` in SQLModel?

### 8. Data Types & Storage Efficiency
- Are appropriate PostgreSQL types used (INTEGER not BIGINT unless needed)?
- Are JSON/JSONB types used for flexible nested data (not serialized strings)?
- Are ENUM types considered for fields with fixed value sets?
- Do TEXT fields have realistic VARCHAR limits to prevent abuse?
- Are DECIMAL types used for currency (not FLOAT which has rounding errors)?

### 9. Migration Safety & Backward Compatibility
- Can new columns be added without breaking existing code (nullable or with defaults)?
- Are column renames avoided in favor of new columns + deprecation period?
- Do schema changes support zero-downtime deployments?
- Are destructive operations (DROP COLUMN, DROP TABLE) clearly marked?
- Is there a rollback strategy for each migration?

## Decision Principles

Apply these frameworks when validating database schemas:

### 1. Referential Integrity Enforcement
**Principle**: Database constraints prevent invalid data; application logic cannot be trusted alone

**Required for every foreign key**:
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- ON DELETE CASCADE: When user deleted, delete their tasks
    -- ON DELETE RESTRICT: Prevent user deletion if they have tasks
    -- ON DELETE SET NULL: Set user_id to NULL (requires NULLABLE column)
    ...
);
```

**Cascade rules decision matrix**:
| Relationship Type | ON DELETE Action | Example |
|-------------------|------------------|---------|
| Ownership | CASCADE | User owns tasks → delete tasks when user deleted |
| Mandatory Reference | RESTRICT | Task requires category → prevent category deletion |
| Optional Reference | SET NULL | Task has optional assignee → null out when assignee deleted |

**Violations to flag**:
- Missing `REFERENCES` constraint (just naming column `user_id` doesn't enforce relationship)
- No ON DELETE action specified (defaults to RESTRICT, may not be intended)
- CASCADE on relationships that should prevent deletion

### 2. Indexing Strategy Rules
**Principle**: Index columns used in WHERE, JOIN, and ORDER BY clauses; avoid over-indexing

**Automatic indexes** (PostgreSQL creates these):
- Primary keys (id)
- UNIQUE constraints

**Required manual indexes**:
- Foreign key columns (user_id, category_id)
- Frequently filtered columns (status, completed, archived)
- Columns used in ORDER BY (created_at for sorting)

**Composite index strategy**:
```sql
-- If queries filter by user_id AND status together:
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);

-- Column order matters: Put highest cardinality (most selective) first
-- Exception: For user-scoped tables, always put user_id first (isolation)
```

**When to use composite indexes**:
- Queries filter by multiple columns together (user_id + status)
- Covering indexes for SELECT user_id, title WHERE user_id = X (includes title in index)

**Indexing checklist per table**:
- [ ] Primary key indexed automatically
- [ ] All foreign keys indexed
- [ ] user_id indexed (if user-scoped table)
- [ ] Status/enum columns indexed (if frequently filtered)
- [ ] Composite (user_id, frequently_filtered_column) for user-scoped tables
- [ ] created_at indexed (if sorting by date is common)

### 3. NOT NULL Constraint Decision Framework
**Principle**: Make columns NOT NULL unless there's a legitimate reason for NULL values

**Always NOT NULL**:
- Primary keys (id)
- Foreign keys for mandatory relationships (user_id in tasks)
- Required business fields (task title, user email)
- Timestamp fields (created_at)

**Nullable (Optional) when**:
- Field represents "not yet provided" state (phone number during signup)
- Foreign key represents optional relationship (assigned_to in tasks)
- Field has a meaningful "empty" state different from "not provided" (completed_at - NULL means not completed)

**Example - GOOD**:
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,           -- Required: task must belong to user
    title VARCHAR(200) NOT NULL,        -- Required: task must have title
    description TEXT,                   -- Optional: task may lack description
    completed BOOLEAN NOT NULL DEFAULT FALSE,  -- Required with default
    completed_at TIMESTAMP,             -- Optional: NULL means not completed
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Example - BAD**:
```sql
CREATE TABLE tasks (
    id SERIAL,                          -- Missing PRIMARY KEY
    user_id INTEGER,                    -- Should be NOT NULL
    title VARCHAR(200),                 -- Should be NOT NULL
    completed BOOLEAN,                  -- Should have NOT NULL + DEFAULT
    created_at TIMESTAMP                -- Should be NOT NULL + DEFAULT
);
```

### 4. Multi-User Isolation Pattern
**Principle**: Every user-scoped resource must filter by user_id; index (user_id, X) for performance

**Required pattern for user-scoped tables**:
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    ...
);

-- Critical performance index for user isolation queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Optional: Composite index for common filtered queries
CREATE INDEX idx_tasks_user_status ON tasks(user_id, completed);
```

**Application-level enforcement**:
```python
# GOOD: Always filter by user_id from JWT
tasks = session.exec(
    select(Task)
    .where(Task.user_id == authenticated_user_id)
    .where(Task.completed == False)
).all()

# BAD: Missing user_id filter (security vulnerability)
tasks = session.exec(
    select(Task).where(Task.completed == False)
).all()
```

**Violations to flag**:
- User-scoped tables missing user_id column
- user_id not indexed (performance issue on multi-user queries)
- API specs showing queries without user_id filtering
- No composite index on (user_id, frequently_filtered_column)

### 5. Timestamp Standard Pattern
**Principle**: All tables need created_at; mutable tables need updated_at; soft deletes need deleted_at

**Required timestamps**:
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    ...
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**Soft delete pattern** (when you need to "delete" without actually removing data):
```sql
deleted_at TIMESTAMP DEFAULT NULL;

-- Query pattern
SELECT * FROM tasks WHERE deleted_at IS NULL;  -- Active records
```

**Timezone handling**:
- Store all timestamps in UTC (PostgreSQL TIMESTAMP type)
- Convert to user timezone in application layer
- Never use TIMESTAMP WITH TIMEZONE unless you have specific requirements

### 6. Check Constraint Validation
**Principle**: Validate data at the database level; don't rely solely on application validation

**Common check constraints**:
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL CHECK (LENGTH(title) > 0),  -- No empty strings
    priority INTEGER CHECK (priority BETWEEN 1 AND 5),       -- Valid range
    status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed')),
    due_date DATE CHECK (due_date >= CURRENT_DATE),          -- No past dates
    price DECIMAL(10,2) CHECK (price >= 0)                   -- No negative prices
);
```

**When to use CHECK vs application validation**:
- **CHECK constraints**: Fundamental data rules that should NEVER be violated
- **Application validation**: Business logic that may change or have exceptions

### 7. Data Type Selection Matrix

| Data Need | PostgreSQL Type | SQLModel Type | Notes |
|-----------|----------------|---------------|-------|
| Integers (IDs, counts) | SERIAL, INTEGER | int | Use SERIAL for auto-increment PKs |
| Large integers | BIGINT | int | For very large counts (>2 billion) |
| Decimals (currency) | NUMERIC(10,2) | Decimal | Never use FLOAT for money |
| Text (short) | VARCHAR(N) | str | Set reasonable limit (200, 500) |
| Text (long) | TEXT | str | For unlimited text (descriptions) |
| True/False | BOOLEAN | bool | Use NOT NULL with DEFAULT |
| Timestamps | TIMESTAMP | datetime | Store in UTC |
| JSON data | JSONB | dict | For flexible nested structures |
| Enums | VARCHAR + CHECK | Literal["a", "b"] | Or PostgreSQL ENUM type |
| UUIDs | UUID | UUID | For distributed systems |

### 8. SQLModel Relationship Patterns

**One-to-Many relationship**:
```python
# User has many tasks
class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int = Field(primary_key=True)
    email: str
    tasks: List["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    title: str
    user: User = Relationship(back_populates="tasks")
```

**Schema for above**:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

## Usage Example

**Scenario**: Reviewing database schema for Todo app with user authentication

**Invocation**:
```
Apply the Database Schema Validator skill to specs/database/schema.md

Focus on:
1. Foreign key relationships and referential integrity
2. Index strategy for user isolation and query performance
3. Data constraints and validation rules
4. SQLModel compatibility
5. Timestamp audit trail completeness
```

**Expected Output**:


=== DATABASE SCHEMA VALIDATION ===
File: specs/database/schema.md
--- TABLE STRUCTURE ---
✓ users: Proper naming (plural, lowercase)
✓ tasks: Proper naming (plural, lowercase)
✓ Both tables have PRIMARY KEY (id SERIAL)
✗ Missing: updated_at column on both tables
--- FOREIGN KEY RELATIONSHIPS ---
✓ tasks.user_id REFERENCES users(id): Properly defined
✓ ON DELETE CASCADE specified: Correct for ownership relationship
⚠ No junction tables detected: Confirm no many-to-many relationships needed
--- INDEXING STRATEGY ---
✓ Primary keys auto-indexed: users(id), tasks(id)
✗ CRITICAL: Missing index on tasks(user_id) - required for user isolation queries
✗ Missing index on tasks(completed) - frequently filtered column
⚠ Recommendation: Add composite index (user_id, completed) for common query pattern
--- DATA CONSTRAINTS ---
✓ tasks.user_id: NOT NULL (required relationship)
✓ tasks.title: NOT NULL with VARCHAR(200) limit
✓ tasks.completed: NOT NULL with DEFAULT FALSE
✗ Missing: CHECK constraint on tasks.title for minimum length (prevent empty strings)
✗ Missing: UNIQUE constraint on users.email
⚠ tasks.description: TEXT without limit - consider VARCHAR(1000) to prevent abuse
--- MULTI-USER ISOLATION ---
✓ tasks table includes user_id foreign key
✗ SECURITY RISK: No index on tasks.user_id (queries will be slow and may skip filtering)
⚠ Verify API queries always include WHERE user_id = {authenticated_user_id}
--- TIMESTAMP AUDIT TRAIL ---
✓ users.created_at: Present with DEFAULT NOW()
✓ tasks.created_at: Present with DEFAULT NOW()
✗ Missing: users.updated_at column
✗ Missing: tasks.updated_at column
✗ Missing: Trigger function to auto-update updated_at on modification
--- SQLMODEL COMPATIBILITY ---
✓ Table names match SQLModel conventions (plural)
✓ Column types compatible with Pydantic (int, str, bool, datetime)
⚠ Verify SQLModel relationship definitions use back_populates correctly
--- DATA TYPE OPTIMIZATION ---
✓ id: SERIAL (appropriate for auto-increment primary keys)
✓ user_id: INTEGER (matches users.id type)
✓ title: VARCHAR(200) (reasonable limit)
✓ completed: BOOLEAN (correct type for true/false)
✗ description: TEXT unlimited - recommend VARCHAR(1000) with CHECK
--- REQUIRED FIXES (BLOCKING) ---

Add index: CREATE INDEX idx_tasks_user_id ON tasks(user_id);
Add index: CREATE INDEX idx_tasks_completed ON tasks(completed);
Add UNIQUE constraint: ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
Add updated_at to both tables with trigger function
Add CHECK constraint: ALTER TABLE tasks ADD CHECK (LENGTH(title) > 0);

--- RECOMMENDED IMPROVEMENTS ---

Add composite index: CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
Change description type: ALTER TABLE tasks ALTER COLUMN description TYPE VARCHAR(1000);
Add CHECK on description length if using VARCHAR
Add deleted_at TIMESTAMP NULL for soft delete pattern (if needed)
Consider adding tasks.priority INTEGER CHECK (priority BETWEEN 1 AND 5) for future

-- Add missing indexes (CRITICAL for performance)
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);

-- Add unique constraint on email
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Add updated_at columns
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE tasks ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Create trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add validation checks
ALTER TABLE tasks ADD CHECK (LENGTH(title) > 0);
```

--- PERFORMANCE IMPACT ESTIMATE ---
Without indexes:
- User queries: O(n) table scan for every user's tasks
- Filtered queries: O(n) scan to find completed tasks
- With 10,000 tasks: ~500ms per query

With indexes:
- User queries: O(log n) index lookup
- Filtered queries: O(log n) for composite index
- With 10,000 tasks: ~5ms per query (100x improvement)

--- VERDICT ---
Status: CONDITIONAL PASS
Security Risk: MEDIUM (missing user_id index may cause developers to skip filtering)
Performance Risk: HIGH (missing indexes will cause slow queries as data grows)
Required Actions: Apply all 5 blocking fixes before implementation
Estimated Effort: 1 hour to update schema spec + write migration
```

## Self-Check Validation

After applying this skill, verify:

- [ ] Every table reviewed for naming conventions
- [ ] All foreign key relationships validated with proper constraints
- [ ] Indexing strategy covers user_id, foreign keys, and filtered columns
- [ ] NOT NULL constraints applied to required fields
- [ ] CHECK constraints used for value validation
- [ ] UNIQUE constraints applied where appropriate
- [ ] created_at and updated_at present on all tables
- [ ] Multi-user isolation pattern validated (user_id + index)
- [ ] SQLModel compatibility confirmed
- [ ] Migration safety considered for schema changes
- [ ] Performance impact estimated (with/without indexes)
- [ ] Security risks flagged (missing filtering, weak constraints)

## Integration with SDD Workflow

**In Specify Phase**:
- Apply skill to data requirements in specification
- Identify entity relationships before creating schema spec

**In Plan Phase**:
- Review generated database plans against indexing principles
- Validate schema supports API query patterns

**In Tasks Phase**:
- Reference this skill when creating migration tasks
- Ensure each migration includes proper indexes and constraints

**Pre-Implementation Gate**:
- Run this skill as final check before creating SQLModel models
- Block implementation if critical indexes or constraints missing

## Common Mistakes This Skill Prevents

1. **Missing Indexes on Foreign Keys**: Slow JOIN queries, especially in multi-user systems
2. **No user_id Index**: O(n) table scans for user-scoped queries, security risk
3. **Missing NOT NULL on Required Fields**: Application allows invalid null values
4. **No updated_at Timestamp**: Cannot track when records were modified
5. **Missing UNIQUE on Email**: Allows duplicate user registrations
6. **Float for Currency**: Rounding errors in financial calculations
7. **No ON DELETE Action**: Unclear behavior when referenced records deleted
8. **Missing CHECK Constraints**: Database accepts invalid data (negative prices, empty strings)

## Skill Evolution Notes

**Future enhancements**:
- Add partitioning strategy guidance for very large tables
- Include read replica setup recommendations
- Add full-text search indexing patterns (GIN indexes)
- Include database monitoring and query optimization guidance
- Add multi-tenant isolation patterns (beyond user_id)

---

**Skill Status**: Production Ready
**Last Updated**: 2024-12-26
**Maintenance**: Review quarterly for PostgreSQL version updates