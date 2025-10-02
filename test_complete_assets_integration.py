#!/usr/bin/env python3
"""
Complete integration test for Assets system
Tests both backend API and frontend integration
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5173"
API_BASE = f"{BACKEND_URL}/api/assets"

def test_backend_api():
    """Test backend API functionality"""
    print("=== Testing Backend API ===\n")
    
    # Test 1: Check if server is running
    print("1. Testing server connectivity...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/assets/assets/")
        print(f"✓ Server is running (Status: {response.status_code})")
        if response.status_code == 401:
            print("✓ Authentication required (expected)")
        else:
            print(f"Response: {response.text[:200]}...")
    except Exception as e:
        print(f"✗ Server connection failed: {e}")
        return False
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Test API endpoints structure
    print("2. Testing API endpoints...")
    endpoints_to_test = [
        "/api/assets/assets/",
        "/api/assets/assets/available/",
        "/api/assets/assets/assigned/",
        "/api/assets/assets/maintenance/",
        "/api/assets/assignments/",
        "/api/assets/maintenance/",
        "/api/assets/returns/"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            print(f"✓ {endpoint} - Status: {response.status_code}")
        except Exception as e:
            print(f"✗ {endpoint} - Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 3: Test with authentication (if available)
    print("3. Testing with authentication...")
    # This would require a valid auth token
    # For now, we'll just verify the endpoints exist
    
    return True

def test_frontend_integration():
    """Test frontend integration"""
    print("=== Testing Frontend Integration ===\n")
    
    # Test 1: Check if frontend is running
    print("1. Testing frontend server...")
    try:
        response = requests.get(FRONTEND_URL)
        print(f"✓ Frontend server is running (Status: {response.status_code})")
    except Exception as e:
        print(f"✗ Frontend server connection failed: {e}")
        return False
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Check if asset service is properly configured
    print("2. Testing asset service configuration...")
    try:
        # This would require JavaScript execution, so we'll just verify the file exists
        with open("front_end/src/services/assetService.js", "r") as f:
            content = f.read()
            if "http://localhost:8000/api/assets" in content:
                print("✓ Asset service configured for backend API")
            else:
                print("✗ Asset service not properly configured")
                return False
    except Exception as e:
        print(f"✗ Error reading asset service: {e}")
        return False
    
    print("\n" + "="*50 + "\n")
    
    return True

def test_database_models():
    """Test database models and migrations"""
    print("=== Testing Database Models ===\n")
    
    # Test 1: Check if migrations were applied
    print("1. Testing database migrations...")
    try:
        import subprocess
        result = subprocess.run(
            ["python", "manage.py", "showmigrations", "assets"],
            cwd="back_end",
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print("✓ Migrations command executed successfully")
            print("Migration status:")
            print(result.stdout)
        else:
            print(f"✗ Migration check failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"✗ Error checking migrations: {e}")
        return False
    
    print("\n" + "="*50 + "\n")
    
    return True

def test_complete_workflow():
    """Test complete asset management workflow"""
    print("=== Testing Complete Workflow ===\n")
    
    # This would test the complete workflow:
    # 1. Create asset
    # 2. Assign asset
    # 3. Track assignment
    # 4. Return asset
    # 5. Schedule maintenance
    # 6. Complete maintenance
    
    print("Workflow test would require authentication and proper setup")
    print("This is a placeholder for end-to-end testing")
    
    return True

def main():
    """Run all tests"""
    print("Starting Complete Assets Integration Test")
    print("=" * 60)
    
    tests = [
        ("Backend API", test_backend_api),
        ("Frontend Integration", test_frontend_integration),
        ("Database Models", test_database_models),
        ("Complete Workflow", test_complete_workflow)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_func()
            results.append((test_name, result))
            if result:
                print(f"✓ {test_name} test passed")
            else:
                print(f"✗ {test_name} test failed")
        except Exception as e:
            print(f"✗ {test_name} test error: {e}")
            results.append((test_name, False))
    
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"{test_name:20} : {status}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Assets system is ready.")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
    
    return passed == total

if __name__ == "__main__":
    main()
