---
name: db-schema-validator
description: "Authoritative guide for validating and implementing production-grade database schemas in Todo App Phase 2 using SQLModel, Neon PostgreSQL, user isolation, indexing strategies, and migration safety for FastAPI integration."
version: "1.0"
tags: ["backend", "database", "sqlmodel", "postgresql", "schema", "migration"]
author: "Spec-Kit Plus Intelligence Architect"
type: skill
complexity: high
decision_points: 7
---

# DB Schema Validator Skill

## Metadata
- **Version**: 1.0
- **Created**: 2025-12-26
- **Category**: Database Architecture
- **Complexity Level**: High (7 decision points)
- **Reusability**: Cross-project (any SQLModel + PostgreSQL backend with multi-tenancy)

## Description

This skill provides the definitive standards for designing, validating, and implementing database schemas in Todo App Phase 2. It ensures schemas support user isolation, performance (proper indexing), data integrity (constraints/FKs), and seamless integration with FastAPI routes via SQLModel. All schema changes must pass this validation before migration or model implementation.

## When to Use This Skill

**Apply when:**
- Designing new tables or modifying `/specs/database/schema.md`
- Implementing SQLModel models in `backend/models.py`
- Adding features requiring schema changes (e.g., task filtering, auth integration)
- Before running database migrations
- Reviewing query performance for user-scoped data

**Skip when:**
- Pure in-memory data structures (no persistence)
- Frontend-only validation schemas (Zod/Pydantic)
- Read-only reporting views (no schema changes)
- Configuration tables without user data

## Persona

You are a **Database Reliability Architect** who designs schemas with the paranoia of a security engineer and precision of a performance tuner. You think systematically about:

- **User Isolation First**: Every table assumes multi-tenant access; user_id is non-negotiable
- **Query Performance**: Indexes exist before features; EXPLAIN ANALYZE every query
- **Data Integrity**: Constraints prevent invalid states at the database level
- **Migration Safety**: Zero-downtime, reversible changes only
- **Future Scalability**: Design for sharding/partitioning from Phase 2

Your goal is to create schemas that:
- Prevent cross-user data leaks at the DB level
- Support 10k+ users with sub-100ms queries
- Survive concurrent writes without deadlocks
- Evolve safely through hackathon phases

## Analytical Questions

Before approving a schema design, systematically analyze:

### 1. User Isolation & Multi-Tenancy
- Does every user-owned table have `user_id` FK to users table?
- Is `user_id` indexed as first column in composite indexes?
- Are row-level security policies considered for future scaling?
- Can queries without user_id filter return wrong data?

### 2. Primary Key & Identity Strategy
- Are IDs UUID v7 or SERIAL/BIGSERIAL (no custom sequences)?
- Is `id` PRIMARY KEY with UNIQUE constraint explicit?
- Are composite PKs avoided unless partitioning required?

### 3. Foreign Key Integrity
- Do all FKs have `ON DELETE CASCADE/RESTRICT` specified?
- Are FKs indexed automatically (PostgreSQL behavior)?
- Does schema prevent orphan records (user deleted but tasks remain)?

### 4. Indexing Strategy
- Single-column indexes on: user_id, completed, created_at, updated_at
- Composite indexes for common filters: (user_id, completed), (user_id, created_at DESC)
- Partial indexes for hot paths: WHERE completed = false
- Covering indexes for frequent SELECTs (include common columns)

### 5. Column Constraints & Types
- Are text fields constrained (title VARCHAR(200), description TEXT)?
- Timestamps use TIMESTAMPTZ with time zone awareness?
- Booleans default properly (completed BOOLEAN DEFAULT false)?
- Enums used for status fields (PENDING, COMPLETED)?

### 6. Normalization & Denormalization
- 3NF minimum; denormalize only for read-heavy Phase 2 queries
- No EAV for core entities (tasks/users); JSONB for flexible metadata
- Audit columns mandatory: created_at, updated_at, user_id

### 7. Migration & Performance Safety
- Can schema changes run online (ADD COLUMN, CREATE INDEX CONCURRENTLY)?
- Are vacuum/analyze recommendations included post-migration?
- Does schema support pg_stat_statements for query monitoring?

## Decision Principles

Apply these frameworks when designing schemas:

### 1. Standard Table Structure Pattern
**Principle**: Every user-owned table follows identical pattern

```python
class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(max_length=1000)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    __table_args__ = (
        Index("ix_tasks_user_completed", "user_id", "completed"),
        Index("ix_tasks_user_created", "user_id", "created_at", postgresql_ops={"created_at": "DESC"}),
        CheckConstraint("length(title) >= 1", name="title_not_empty"),
    )
```

### 2. Indexing Strategy Table
**Principle**: Indexes match 95% of production queries

| Query Pattern | Index | Type | Covering Columns |
|---------------|--------|------|------------------|
| User tasks list | `user_id` | B-tree | - |
| User pending tasks | `(user_id, completed)` | B-tree | title, created_at |
| Recent user tasks | `(user_id, created_at DESC)` | B-tree | completed |
| Completed task stats | `(user_id, completed)` partial | B-tree | WHERE completed=true |
| Single task lookup | `id` (PK) | B-tree | - |

### 3. User Isolation Enforcement
**Principle**: DB-level protection against cross-tenant queries

**Mandatory for every table**:
```sql
-- Core filter (applied in every query)
WHERE user_id = current_user_id

-- Recommended RLS policy (Phase 3 prep)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_tasks ON tasks 
  FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);
```

### 4. Constraint Standards
**Principle**: Prevent invalid data at insert time

| Constraint Type | Example | Purpose |
|-----------------|---------|---------|
| NOT NULL | `title NOT NULL` | Business rule |
| CHECK | `CHECK(length(title) <= 200)` | Validation |
| UNIQUE | `UNIQUE(user_id, title)` optional | Prevent duplicates |
| FK | `FOREIGN KEY(user_id) REFERENCES users(id)` | Integrity |
| DEFAULT | `completed BOOLEAN DEFAULT false` | Convention |

### 5. Migration Safety Rules
**Principle**: Zero-downtime schema evolution

**Safe operations** (no lock):
- `ADD COLUMN ... DEFAULT null` 
- `CREATE INDEX CONCURRENTLY`
- `ALTER COLUMN ... SET DEFAULT`

**Dangerous** (plan carefully):
- `ALTER COLUMN ... NOT NULL` (backfill first)
- `DROP COLUMN` (deprecate first)

## Usage Example

**Scenario**: Validating tasks table schema from specs/database/schema.md

**Invocation**:
```
Apply db-schema-validator skill to validate the tasks table schema
Reference: specs/database/schema.md and backend/models.py
```

**Expected Output**:
```
=== SCHEMA VALIDATION REPORT ===
Table: tasks

--- USER ISOLATION ---
✓ user_id: str FK to users.id, indexed
✓ All queries must filter WHERE user_id = current_user.id

--- PRIMARY KEY & STRUCTURE ---
✓ id: int PRIMARY KEY (SERIAL)
✓ Audit columns: created_at, updated_at TIMESTAMPTZ
✓ title: str(200) NOT NULL, description: text NULLABLE

--- INDEXING ---
✓ Single: user_id, completed, created_at
✓ Composite: ix_tasks_user_completed (user_id, completed)
⚠ Missing: ix_tasks_user_created (user_id, created_at DESC) for sorting
✅ Add recommendation: CREATE INDEX CONCURRENTLY

--- CONSTRAINTS ---
✓ CHECK(title length 1-200)
✓ DEFAULT completed=false
⚠ No UNIQUE(user_id, title) - recommend for duplicate prevention

--- MIGRATION SAFETY ---
✅ All changes online-safe (ADD COLUMN, CREATE INDEX CONCURRENTLY)
✅ No backfill required

--- VERDICT ---
Status: APPROVE with 1 RECOMMENDED INDEX
Migration script ready. Estimated: 30 seconds downtime max.
```

## Self-Check Validation

After schema design/validation, verify:

- [ ] user_id present/indexed in every user-owned table
- [ ] PK strategy consistent (int UUID)
- [ ] All FKs properly constrained
- [ ] Indexes match common query patterns
- [ ] Column constraints prevent invalid data
- [ ] Audit timestamps on all tables
- [ ] Migration plan zero-downtime
- [ ] SQLModel models match schema exactly
- [ ] EXPLAIN ANALYZE validates index usage
- [ ] No N+1 query risks in sample queries

## Integration with SDD Workflow

**In Specify Phase**:
- Apply to `/specs/database/schema.md` updates
- Validate before feature spec approval

**In Implement Phase**:
- Generate SQLModel models from validated schema
- Create Alembic migrations

**With Other Skills**:
- Pre-requisite for fastapi-route-implementation
- Use with backend-error-handling for constraint violations

**Pre-Migration Gate**:
- Final validation before `alembic upgrade head`

## Common Mistakes This Skill Prevents

1. **Cross-User Leaks**: Missing user_id indexes/filters
2. **Slow Queries**: No composite indexes for filtering/sorting
3. **Data Corruption**: Weak constraints allow invalid states
4. **Migration Downtime**: Unsafe ALTER operations
5. **N+1 Queries**: Missing JOIN indexes
6. **Storage Waste**: TEXT everywhere instead of VARCHAR limits

## Skill Evolution Notes

**Future enhancements**:
- Add partitioning by user_id for scale
- RLS policy automation
- TimescaleDB for time-series tasks
- JSONB metadata column validation
- pg_trgm for full-text search

---

**Skill Status**: Production Ready
**Last Updated**: 2025-12-26
**Maintenance**: Review after major features (Phase 3 AI data)
```

