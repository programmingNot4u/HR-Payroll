#!/usr/bin/env python3
"""
Test script to verify asset assignment functionality
"""

import requests
import json
from datetime import date

# Test data
BASE_URL = "http://localhost:8000/api"
ASSET_ID = "dfdsf"
EMPLOYEE_ID = "EMP1005"
EMPLOYEE_NAME = "Test Employee"
ASSIGNMENT_DATE = "2025-09-25"
ASSIGNED_BY = "Test Staff"

def test_assignment():
    """Test the asset assignment API endpoint"""
    
    # First, let's check if the asset exists
    print("1. Checking if asset exists...")
    try:
        response = requests.get(f"{BASE_URL}/assets/assets/")
        if response.status_code == 200:
            assets = response.json()
            asset_found = any(asset['id'] == ASSET_ID for asset in assets)
            print(f"Asset {ASSET_ID} found: {asset_found}")
            if asset_found:
                asset = next(asset for asset in assets if asset['id'] == ASSET_ID)
                print(f"Asset details: {asset['name']} - Status: {asset['status']}")
        else:
            print(f"Failed to get assets: {response.status_code}")
    except Exception as e:
        print(f"Error checking assets: {e}")
    
    # Test assignment data
    assignment_data = {
        'employee_id': EMPLOYEE_ID,
        'employee_name': EMPLOYEE_NAME,
        'assignment_date': ASSIGNMENT_DATE,
        'assigned_by': ASSIGNED_BY,
        'assigned_condition': 'Good'
    }
    
    print(f"\n2. Testing assignment with data: {assignment_data}")
    
    # Test the assignment endpoint
    try:
        response = requests.post(
            f"{BASE_URL}/assets/assets/{ASSET_ID}/assign/",
            json=assignment_data
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Assignment successful!")
        else:
            print("❌ Assignment failed")
            
    except Exception as e:
        print(f"Error testing assignment: {e}")

if __name__ == "__main__":
    test_assignment()

