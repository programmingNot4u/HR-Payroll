// Test script to verify API integration
const API_BASE_URL = "http://localhost:8000/api";

async function testAPIEndpoints() {
  console.log("Testing API Integration...");

  try {
    // Test 1: Check if server is running
    console.log("\n1. Testing server connectivity...");
    const healthResponse = await fetch(
      `${API_BASE_URL}/employees/organizational-data/`
    );
    console.log("Server status:", healthResponse.status);

    if (healthResponse.status === 401) {
      console.log("✓ Server is running but requires authentication (expected)");
    } else if (healthResponse.status === 200) {
      console.log("✓ Server is running and accessible");
    } else {
      console.log("⚠ Server responded with status:", healthResponse.status);
    }

    // Test 2: Test authentication endpoint
    console.log("\n2. Testing authentication endpoint...");
    const authResponse = await fetch(`${API_BASE_URL}/auth/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "testpassword",
      }),
    });

    console.log("Auth endpoint status:", authResponse.status);
    if (authResponse.status === 400 || authResponse.status === 401) {
      console.log(
        "✓ Auth endpoint is working (returns expected error for invalid credentials)"
      );
    } else {
      console.log("⚠ Unexpected auth response:", authResponse.status);
    }

    // Test 3: Test employee login endpoint
    console.log("\n3. Testing employee login endpoint...");
    const empLoginResponse = await fetch(`${API_BASE_URL}/employees/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_id: "EMP001",
        password: "EMP001",
      }),
    });

    console.log("Employee login status:", empLoginResponse.status);
    if (empLoginResponse.status === 404 || empLoginResponse.status === 401) {
      console.log(
        "✓ Employee login endpoint is working (returns expected error for non-existent employee)"
      );
    } else {
      console.log(
        "⚠ Unexpected employee login response:",
        empLoginResponse.status
      );
    }

    console.log("\n✅ API Integration test completed!");
    console.log("\nNext steps:");
    console.log(
      "1. Start the Django backend server: cd back_end && python manage.py runserver"
    );
    console.log("2. Start the React frontend: cd front_end && npm run dev");
    console.log("3. Test the AddEmployee form with real data");
  } catch (error) {
    console.error("❌ API Integration test failed:", error.message);
    console.log("\nTroubleshooting:");
    console.log(
      "1. Make sure the Django backend server is running on port 8000"
    );
    console.log("2. Check if CORS is properly configured");
    console.log("3. Verify the API endpoints are correct");
  }
}

// Run the test
testAPIEndpoints();
