#!/usr/bin/env python3
"""
Test script for Assets API endpoints
"""

import requests
import json
from datetime import datetime, timedelta

# Base URL for the API
BASE_URL = "http://localhost:8000/api/assets"

def test_assets_api():
    """Test all Assets API endpoints"""
    
    print("=== Testing Assets API ===\n")
    
    # Test 1: Get all assets (should be empty initially)
    print("1. Testing GET /api/assets/assets/")
    try:
        response = requests.get(f"{BASE_URL}/assets/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Create a new asset
    print("2. Testing POST /api/assets/assets/")
    asset_data = {
        "id": "AST001",
        "name": "Dell Laptop",
        "model": "Inspiron 15 3000",
        "category": "Electronics",
        "department": "IT",
        "status": "Available",
        "quantity": 1,
        "value": 50000.00,
        "purchase_date": "2024-01-15",
        "depreciation_rate": 20.0,
        "vendor": "Dell Technologies",
        "acc_voucher": "VCH001",
        "warranty_period": 12
    }
    
    try:
        response = requests.post(f"{BASE_URL}/assets/", json=asset_data)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"Asset Created: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 3: Get available assets
    print("3. Testing GET /api/assets/assets/available/")
    try:
        response = requests.get(f"{BASE_URL}/assets/available/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Available Assets: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 4: Create another asset
    print("4. Testing POST /api/assets/assets/ - Create second asset")
    asset_data2 = {
        "id": "AST002",
        "name": "Office Chair",
        "model": "Ergonomic Pro",
        "category": "Furniture",
        "department": "HR",
        "status": "Available",
        "quantity": 1,
        "value": 15000.00,
        "purchase_date": "2024-01-20",
        "depreciation_rate": 10.0,
        "vendor": "Office Solutions",
        "acc_voucher": "VCH002",
        "warranty_period": 24
    }
    
    try:
        response = requests.post(f"{BASE_URL}/assets/", json=asset_data2)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"Asset Created: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 5: Test asset assignment
    print("5. Testing POST /api/assets/assets/AST001/assign/")
    assignment_data = {
        "employee_id": "EMP001",
        "employee_name": "John Doe",
        "assignment_date": "2024-01-25",
        "expected_return_date": "2024-12-25",
        "assignment_reason": "Work from home setup",
        "assigned_by": "HR Manager",
        "assigned_condition": "Good",
        "assignment_notes": "New laptop for remote work"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/assets/AST001/assign/", json=assignment_data)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"Assignment Created: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 6: Get assigned assets
    print("6. Testing GET /api/assets/assets/assigned/")
    try:
        response = requests.get(f"{BASE_URL}/assets/assigned/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Assigned Assets: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 7: Test asset return
    print("7. Testing POST /api/assets/assets/AST001/return_asset/")
    return_data = {
        "return_date": "2024-01-30",
        "return_condition": "Good",
        "return_reason": "Employee resignation",
        "received_by": "HR Manager",
        "return_notes": "Asset returned in good condition"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/assets/AST001/return_asset/", json=return_data)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"Return Processed: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 8: Test maintenance scheduling
    print("8. Testing POST /api/assets/assets/AST002/maintenance/")
    maintenance_data = {
        "scheduled_date": "2024-02-01",
        "maintenance_provider": "Office Solutions",
        "status": "Pending",
        "description": "Regular maintenance check",
        "cost": 2000.00,
        "notes": "Scheduled maintenance for office chair"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/assets/AST002/maintenance/", json=maintenance_data)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"Maintenance Scheduled: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 9: Get maintenance assets
    print("9. Testing GET /api/assets/assets/maintenance/")
    try:
        response = requests.get(f"{BASE_URL}/assets/maintenance/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Maintenance Assets: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 10: Get asset history
    print("10. Testing GET /api/assets/assets/AST001/history/")
    try:
        response = requests.get(f"{BASE_URL}/assets/AST001/history/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Asset History: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n=== API Testing Complete ===")

if __name__ == "__main__":
    test_assets_api()
