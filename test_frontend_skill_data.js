const API_BASE_URL = "http://localhost:8000/api";

async function testFrontendSkillData() {
  console.log("Testing Frontend Skill Data Simulation...\n");

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

    // Simulate what the frontend might be sending
    console.log("\n2. Testing with frontend-like data...");
    
    // Simulate the form data that might be sent from frontend
    const formData = {
      name: "Frontend Test Skills",
      description: "Test description",
      skills: "JavaScript\nReact\nNode.js\nPython", // This is what the textarea sends
      skillsArray: ["JavaScript", "React", "Node.js", "Python"], // This is what gets processed
      category: "technical",
      is_active: true
    };

    // Simulate the data mapping logic from frontend
    const dataToSave = {
      name: formData.name,
      description: formData.description || "",
      category: formData.category || "technical",
      skills: formData.skillsArray
        ? formData.skillsArray.filter((skill) => skill.trim() !== "")
        : [],
      is_active: formData.is_active !== false,
    };
    
    console.log("Frontend form data:", JSON.stringify(formData, null, 2));
    console.log("Processed data to save:", JSON.stringify(dataToSave, null, 2));
    
    const skillResponse = await fetch(`${API_BASE_URL}/skill-metrics/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSave),
    });

    console.log(`Skill Metrics Status: ${skillResponse.status}`);
    if (!skillResponse.ok) {
      const errorText = await skillResponse.text();
      console.log("❌ Skill Metrics Error:", errorText);
    } else {
      const skill = await skillResponse.json();
      console.log("✅ Skill Metrics created:", skill);
    }

    // Test with empty skills array
    console.log("\n3. Testing with empty skills array...");
    const formData2 = {
      name: "Empty Skills Test 2",
      description: "",
      skills: "",
      skillsArray: [],
      category: "technical",
      is_active: true
    };

    const dataToSave2 = {
      name: formData2.name,
      description: formData2.description || "",
      category: formData2.category || "technical",
      skills: formData2.skillsArray
        ? formData2.skillsArray.filter((skill) => skill.trim() !== "")
        : [],
      is_active: formData2.is_active !== false,
    };
    
    console.log("Frontend form data 2:", JSON.stringify(formData2, null, 2));
    console.log("Processed data to save 2:", JSON.stringify(dataToSave2, null, 2));
    
    const skillResponse2 = await fetch(`${API_BASE_URL}/skill-metrics/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSave2),
    });

    console.log(`Skill Metrics Status 2: ${skillResponse2.status}`);
    if (!skillResponse2.ok) {
      const errorText = await skillResponse2.text();
      console.log("❌ Skill Metrics Error 2:", errorText);
    } else {
      const skill = await skillResponse2.json();
      console.log("✅ Skill Metrics created 2:", skill);
    }

  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

testFrontendSkillData();
