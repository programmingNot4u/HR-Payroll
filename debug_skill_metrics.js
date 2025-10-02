const API_BASE_URL = "http://localhost:8000/api";

async function debugSkillMetrics() {
  console.log("Debugging Skill Metrics API...\n");

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

    // Test Skill Metrics with different data structures
    console.log("\n2. Testing Skill Metrics with minimal data...");
    const skillData1 = {
      name: "Test Skills",
      category: "technical",
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
      console.log("❌ Skill Metrics Error 1:", errorText);
    } else {
      const skill = await skillResponse1.json();
      console.log("✅ Skill Metrics created 1:", skill);
    }

    // Test with description
    console.log("\n3. Testing Skill Metrics with description...");
    const skillData2 = {
      name: "Communication Skills",
      description: "Basic communication skills",
      category: "soft_skills",
      skills: ["Verbal communication", "Written communication"],
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
      console.log("❌ Skill Metrics Error 2:", errorText);
    } else {
      const skill = await skillResponse2.json();
      console.log("✅ Skill Metrics created 2:", skill);
    }

    // Test with empty skills array
    console.log("\n4. Testing Skill Metrics with empty skills...");
    const skillData3 = {
      name: "Empty Skills Test",
      category: "technical",
      skills: [],
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
      console.log("❌ Skill Metrics Error 3:", errorText);
    } else {
      const skill = await skillResponse3.json();
      console.log("✅ Skill Metrics created 3:", skill);
    }

  } catch (error) {
    console.log("❌ Debug failed:", error.message);
  }
}

debugSkillMetrics();
