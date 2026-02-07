"""
Main FastAPI application for the Todo App backend API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Add the parent directory to the path so we can import modules correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.config import settings
from backend.database import create_db_and_tables
from backend.routes import tasks
from backend.routes import auth


# Create FastAPI application instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Todo App Backend API - Phase 3 Implementation with Authentication",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    """
    Initialize database tables on startup
    """
    await create_db_and_tables()


# Include the auth and tasks routers
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["auth"])
app.include_router(tasks.router, prefix=settings.API_V1_STR, tags=["tasks"])


@app.get("/")
async def root():
    """
    Root endpoint for health check
    """
    return {"message": "Todo App Backend API - Phase 3 with Authentication", "status": "running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)