"""
Simple test to verify the route implementation by checking the file content
"""
import ast
import inspect
from pathlib import Path


def test_route_file_syntax():
    """Test that the route file has correct Python syntax"""
    route_file = Path("backend/routes/tasks.py")

    if not route_file.exists():
        print("[FAIL] Route file does not exist")
        return False

    try:
        with open(route_file, 'r') as f:
            content = f.read()

        # Parse the AST to check for syntax errors
        ast.parse(content)
        print("[PASS] Route file has valid Python syntax")
        return True
    except SyntaxError as e:
        print(f"[FAIL] Syntax error in route file: {e}")
        return False


def test_route_contains_expected_elements():
    """Test that the route file contains expected elements"""
    route_file = Path("backend/routes/tasks.py")

    with open(route_file, 'r') as f:
        content = f.read()

    expected_elements = [
        "APIRouter",
        "router = APIRouter()",
        "list_tasks",
        "@router.get",
        "/{user_id}/tasks",
        "response_model=TaskListResponse",
        "get_current_user_with_id",
        "get_db_session",
        "user_id: int",
        "select(Task).where(Task.user_id == user_id)"
    ]

    missing_elements = []
    for element in expected_elements:
        if element not in content:
            missing_elements.append(element)

    if missing_elements:
        print(f"[FAIL] Missing expected elements: {missing_elements}")
        return False
    else:
        print("[PASS] All expected elements found in route file")
        return True


def test_route_contains_user_isolation():
    """Test that the route includes user isolation logic"""
    route_file = Path("backend/routes/tasks.py")

    with open(route_file, 'r') as f:
        content = f.read()

    # Look for user isolation patterns
    has_user_isolation = (
        "Task.user_id == user_id" in content and
        "get_current_user_with_id" in content
    )

    if has_user_isolation:
        print("[PASS] User isolation logic found in route")
        return True
    else:
        print("[FAIL] User isolation logic not found in route")
        return False


def test_route_contains_error_handling():
    """Test that the route includes error handling"""
    route_file = Path("backend/routes/tasks.py")

    with open(route_file, 'r') as f:
        content = f.read()

    has_error_handling = (
        "try:" in content and
        "except Exception" in content and
        "HTTPException" in content
    )

    if has_error_handling:
        print("[PASS] Error handling found in route")
        return True
    else:
        print("[FAIL] Error handling not found in route")
        return False


if __name__ == "__main__":
    print("Testing Tasks Route Implementation")
    print("=" * 40)

    tests = [
        ("Syntax Test", test_route_file_syntax),
        ("Expected Elements Test", test_route_contains_expected_elements),
        ("User Isolation Test", test_route_contains_user_isolation),
        ("Error Handling Test", test_route_contains_error_handling),
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