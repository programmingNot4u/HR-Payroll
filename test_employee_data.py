#!/usr/bin/env python3
"""
Test script to check employee data structure from the API
"""
import requests
import json

# Test the employee API endpoint
def test_employee_api():
    try:
        # First, let's try to get a token (this is a simplified test)
        # In a real scenario, you'd need proper authentication
        response = requests.get('http://localhost:8000/api/employees/')
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Data type: {type(data)}")
            if isinstance(data, dict):
                print(f"Keys: {list(data.keys())}")
                if 'results' in data:
                    print(f"Results count: {len(data['results'])}")
                    if data['results']:
                        print(f"First employee: {json.dumps(data['results'][0], indent=2)}")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_employee_api()

