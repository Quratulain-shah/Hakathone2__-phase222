"""
Test cases for the PUT /api/v1/{user_id}/tasks/{id} endpoint
"""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from backend.main import app
from backend.models.task import Task
from backend.models.user import User

client = TestClient(app)


def test_update_task_success():
    """Test successfully updating a task"""
    # First create a task to update
    create_response = client.post(
        "/api/v1/1/tasks",
        json={
            "title": "Original Task",
            "description": "Original description",
            "completed": False
        }
    )
    assert create_response.status_code == 201
    created_task = create_response.json()
    task_id = created_task["id"]

    # Update the task
    update_data = {
        "title": "Updated Task",
        "description": "Updated description",
        "completed": True
    }
    response = client.put(
        f"/api/v1/1/tasks/{task_id}",
        json=update_data
    )

    assert response.status_code == 200
    updated_task = response.json()
    assert updated_task["id"] == task_id
    assert updated_task["title"] == "Updated Task"
    assert updated_task["description"] == "Updated description"
    assert updated_task["completed"] is True
    assert "created_at" in updated_task
    assert "updated_at" in updated_task


def test_update_task_not_found():
    """Test updating a non-existent task returns 404"""
    response = client.put(
        "/api/v1/1/tasks/99999",
        json={
            "title": "Updated Task",
            "description": "Updated description"
        }
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_update_task_user_isolation():
    """Test that users can't update tasks that don't belong to them"""
    # This test would require creating tasks for different users
    # For the mock implementation, this would depend on the authentication setup
    pass


def test_update_task_partial_fields():
    """Test updating only some fields of a task"""
    # First create a task to update
    create_response = client.post(
        "/api/v1/1/tasks",
        json={
            "title": "Original Task",
            "description": "Original description",
            "completed": False
        }
    )
    assert create_response.status_code == 201
    created_task = create_response.json()
    task_id = created_task["id"]

    # Update only the title
    update_data = {
        "title": "Updated Title Only"
    }
    response = client.put(
        f"/api/v1/1/tasks/{task_id}",
        json=update_data
    )

    assert response.status_code == 200
    updated_task = response.json()
    assert updated_task["id"] == task_id
    assert updated_task["title"] == "Updated Title Only"
    # Description should remain unchanged
    assert updated_task["description"] == "Original description"
    assert updated_task["completed"] is False
    assert "created_at" in updated_task
    assert "updated_at" in updated_task