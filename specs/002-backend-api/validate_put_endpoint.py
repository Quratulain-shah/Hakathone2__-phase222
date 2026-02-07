"""
Validation script to verify the PUT endpoint implementation
"""
import ast
import inspect
from backend.routes.tasks import router

def validate_put_endpoint():
    """Validate that the PUT endpoint exists and follows the required patterns"""

    # Get all route handlers from the router
    routes = router.routes

    # Find the PUT route
    put_route = None
    for route in routes:
        if hasattr(route, 'methods') and 'PUT' in route.methods:
            if '/{user_id}/tasks/{id}' in route.path:
                put_route = route
                break

    if not put_route:
        print("[ERROR] PUT route for /{user_id}/tasks/{id} not found")
        return False

    print("[SUCCESS] PUT route found:", put_route.path)
    print("[INFO] Methods:", route.methods)

    # Get the function source code
    func = route.endpoint
    source = inspect.getsource(func)

    # Check for required patterns
    checks = {
        "user_id parameter": "user_id: int" in source,
        "task id parameter": "id: int" in source,
        "TaskUpdate schema": "task_update: TaskUpdate" in source,
        "db_session dependency": "db_session: AsyncSession" in source,
        "current_user dependency": "current_user: User = Depends(get_current_user_with_id)" in source,
        "user isolation check": "current_user.id != user_id" in source,
        "404 error handling": "HTTP_404_NOT_FOUND" in source or '"Task not found"' in source,
        "async/await": "async def" in source and "await" in source,
        "response model": "response_model=TaskRead" in str(route) or "TaskRead" in source,
        "database commit": "await db_session.commit()" in source,
        "database refresh": "await db_session.refresh(task)" in source
    }

    all_passed = True
    for check_name, passed in checks.items():
        status = "[SUCCESS]" if passed else "[ERROR]"
        print(f"{status} {check_name}: {passed}")
        if not passed:
            all_passed = False

    return all_passed

if __name__ == "__main__":
    print("Validating PUT endpoint implementation...")
    print("=" * 50)

    success = validate_put_endpoint()

    print("=" * 50)
    if success:
        print("[SUCCESS] All validations passed! PUT endpoint is properly implemented.")
    else:
        print("[ERROR] Some validations failed. Please review the implementation.")