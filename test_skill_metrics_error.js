const API_BASE_URL = "http://localhost:8000/api";

async function testSkillMetricsError() {
  console.log("Testing Skill Metrics Error Scenarios...\n");

  try {
    // First, login as admin
    console.log("1. Logging in as admin...");
    const loginResponse = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@hrpayroll.com",
        password: "admin123"
      }),
    });

    if (!loginResponse.ok) {
      console.log("❌ Login failed:", await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    console.log("✅ Login successful");
    const token = loginData.access;

    // Test with invalid category
    console.log("\n2. Testing with invalid category...");
    const skillData1 = {
      name: "Test Skills Invalid Category",
      category: "invalid_category", // This should cause a 400 error
      skills: ["JavaScript", "React"],
      is_active: true
    };
    
    console.log("Sending skill data 1:", JSON.stringify(skillData1, null, 2));
    
    const skillResponse1 = await fetch(`${API_BASE_URL}/skill-metrics/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(skillData1),
    });

    console.log(`Skill Metrics Status 1: ${skillResponse1.status}`);
    if (!skillResponse1.ok) {
      const errorText = await skillResponse1.text();
      console.log("❌ Skill Metrics Error 1 (Expected):", errorText);
    } else {
      const skill = await skillResponse1.json();
      console.log("✅ Skill Metrics created 1 (Unexpected):", skill);
    }

    // Test with missing name
    console.log("\n3. Testing with missing name...");
    const skillData2 = {
      category: "technical",
      skills: ["JavaScript", "React"],
      is_active: true
    };
    
    console.log("Sending skill data 2:", JSON.stringify(skillData2, null, 2));
    
    const skillResponse2 = await fetch(`${API_BASE_URL}/skill-metrics/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(skillData2),
    });

    console.log(`Skill Metrics Status 2: ${skillResponse2.status}`);
    if (!skillResponse2.ok) {
      const errorText = await skillResponse2.text();
      console.log("❌ Skill Metrics Error 2 (Expected):", errorText);
    } else {
      const skill = await skillResponse2.json();
      console.log("✅ Skill Metrics created 2 (Unexpected):", skill);
    }

    // Test with invalid skills format
    console.log("\n4. Testing with invalid skills format...");
    const skillData3 = {
      name: "Test Skills Invalid Format",
      category: "technical",
      skills: "not an array", // This should cause a 400 error
      is_active: true
    };
    
    console.log("Sending skill data 3:", JSON.stringify(skillData3, null, 2));
    
    const skillResponse3 = await fetch(`${API_BASE_URL}/skill-metrics/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(skillData3),
    });

    console.log(`Skill Metrics Status 3: ${skillResponse3.status}`);
    if (!skillResponse3.ok) {
      const errorText = await skillResponse3.text();
      console.log("❌ Skill Metrics Error 3 (Expected):", errorText);
    } else {
      const skill = await skillResponse3.json();
      console.log("✅ Skill Metrics created 3 (Unexpected):", skill);
    }

    // Test with empty name
    console.log("\n5. Testing with empty name...");
    const skillData4 = {
      name: "",
      category: "technical",
      skills: ["JavaScript", "React"],
      is_active: true
    };
    
    console.log("Sending skill data 4:", JSON.stringify(skillData4, null, 2));
    
    const skillResponse4 = await fetch(`${API_BASE_URL}/skill-metrics/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(skillData4),
    });

    console.log(`Skill Metrics Status 4: ${skillResponse4.status}`);
    if (!skillResponse4.ok) {
      const errorText = await skillResponse4.text();
      console.log("❌ Skill Metrics Error 4 (Expected):", errorText);
    } else {
      const skill = await skillResponse4.json();
      console.log("✅ Skill Metrics created 4 (Unexpected):", skill);
    }

  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

testSkillMetricsError();
