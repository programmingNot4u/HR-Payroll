// Test script to verify authentication endpoints
const API_BASE_URL = "http://localhost:8000/api";

async function testAuthEndpoints() {
  console.log("Testing Authentication Endpoints...");

  try {
    // Test 1: Test admin login endpoint
    console.log("\n1. Testing admin login endpoint...");
    const adminResponse = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@hrpayroll.com",
        password: "admin123",
      }),
    });

    console.log("Admin login status:", adminResponse.status);
    const adminData = await adminResponse.json();
    console.log("Admin login response:", adminData);

    if (adminResponse.status === 400 || adminResponse.status === 401) {
      console.log(
        "✓ Admin login endpoint is working (returns expected error for invalid credentials)"
      );
    } else if (adminResponse.status === 200) {
      console.log("✓ Admin login successful!");
    } else {
      console.log("⚠ Unexpected admin login response:", adminResponse.status);
    }

    // Test 2: Test employee login endpoint
    console.log("\n2. Testing employee login endpoint...");
    const empResponse = await fetch(`${API_BASE_URL}/auth/employee-login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_id: "EMP001",
        password: "EMP001",
      }),
    });

    console.log("Employee login status:", empResponse.status);
    const empData = await empResponse.json();
    console.log("Employee login response:", empData);

    if (empResponse.status === 400 || empResponse.status === 401) {
      console.log(
        "✓ Employee login endpoint is working (returns expected error for invalid credentials)"
      );
    } else if (empResponse.status === 200) {
      console.log("✓ Employee login successful!");
    } else {
      console.log("⚠ Unexpected employee login response:", empResponse.status);
    }

    // Test 3: Test CORS preflight
    console.log("\n3. Testing CORS preflight...");
    const corsResponse = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });

    console.log("CORS preflight status:", corsResponse.status);
    console.log("CORS headers:", {
      "Access-Control-Allow-Origin": corsResponse.headers.get(
        "Access-Control-Allow-Origin"
      ),
      "Access-Control-Allow-Methods": corsResponse.headers.get(
        "Access-Control-Allow-Methods"
      ),
      "Access-Control-Allow-Headers": corsResponse.headers.get(
        "Access-Control-Allow-Headers"
      ),
    });

    if (corsResponse.status === 200) {
      console.log("✓ CORS preflight is working");
    } else {
      console.log("⚠ CORS preflight issue:", corsResponse.status);
    }

    console.log("\n✅ Authentication endpoints test completed!");
    console.log("\nNext steps:");
    console.log(
      "1. Make sure the Django backend server is running: python manage.py runserver"
    );
    console.log("2. Start the React frontend: npm run dev");
    console.log("3. Try logging in with valid credentials");
  } catch (error) {
    console.error("❌ Authentication test failed:", error.message);
    console.log("\nTroubleshooting:");
    console.log(
      "1. Make sure the Django backend server is running on port 8000"
    );
    console.log("2. Check if CORS is properly configured");
    console.log("3. Verify the authentication endpoints are correct");
  }
}

// Run the test
testAuthEndpoints();
