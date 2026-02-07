"""
Test the tasks endpoint implementation
"""
import sys
import os
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def test_import_routes():
    """Test that the routes can be imported without errors"""
    try:
        import sys
        import os
        # Add the project root to Python path
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

        from backend.routes.tasks import router
        print("[PASS] Tasks router imported successfully")

        # Check that the router has the expected route
        route_found = False
        for route in router.routes:
            if hasattr(route, 'path') and route.path == '/{user_id}/tasks' and route.methods == {'GET'}:
                route_found = True
                print(f"[PASS] GET /{{user_id}}/tasks route found: {route.name if hasattr(route, 'name') else 'unnamed'}")
                break

        if not route_found:
            print("[FAIL] GET /{user_id}/tasks route not found")
            return False

        return True
    except Exception as e:
        print(f"[FAIL] Error importing routes: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_endpoint_signature():
    """Test that the endpoint has the correct signature"""
    try:
        import sys
        import os
        # Add the project root to Python path
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

        from backend.routes.tasks import list_tasks
        import inspect

        sig = inspect.signature(list_tasks)
        params = list(sig.parameters.keys())

        print(f"[PASS] Endpoint function found: list_tasks")
        print(f"  Parameters: {params}")

        # Check that required parameters are present
        expected_params = ['user_id', 'current_user', 'db_session']
        missing_params = [p for p in expected_params if p not in params]

        if missing_params:
            print(f"[FAIL] Missing parameters: {missing_params}")
            return False
        else:
            print("[PASS] All expected parameters present")

        # Check response model annotation
        if hasattr(sig.return_annotation, '__name__') and sig.return_annotation.__name__ == 'TaskListResponse':
            print("[PASS] Correct return type annotation")
        else:
            print(f"[FAIL] Unexpected return type: {sig.return_annotation}")
            return False

        return True
    except Exception as e:
        print(f"[FAIL] Error testing endpoint signature: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_models_and_schemas():
    """Test that required models and schemas are available"""
    try:
        import sys
        import os
        # Add the project root to Python path
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

        from backend.models.task import Task, TaskRead
        from backend.schemas.task import TaskListResponse
        from backend.models.user import User
        from backend.dependencies import get_db_session, get_current_user_with_id

        print("[PASS] All required models and schemas imported successfully")
        return True
    except Exception as e:
        print(f"[FAIL] Error importing models/schemas: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("Testing Tasks Endpoint Implementation")
    print("=" * 40)

    tests = [
        ("Route Import Test", test_import_routes),
        ("Endpoint Signature Test", test_endpoint_signature),
        ("Models and Schemas Test", test_models_and_schemas),
    ]

    results = []
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        result = test_func()
        results.append((test_name, result))

    print("\n" + "=" * 40)
    print("Test Summary:")
    all_passed = True
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"  {test_name}: {status}")
        if not result:
            all_passed = False

    print(f"\nOverall: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
    sys.exit(0 if all_passed else 1)