"""
Mock database utilities for testing the Todo App backend API
"""
from typing import AsyncGenerator
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import QueuePool
from sqlalchemy import event
from sqlalchemy.engine import Engine


# Create async engine for SQLite in memory for testing purposes
async_engine = create_async_engine(
    "sqlite+aiosqlite:///:memory:",
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=True  # Enable SQL logging for debugging
)


async def create_db_and_tables():
    """
    Create database tables
    This is primarily for testing purposes in Phase 2
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get async database session
    """
    async with AsyncSession(async_engine) as session:
        yield session