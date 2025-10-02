import { useEffect, useState } from "react";
import organizationalDataService from "../../services/organizationalDataService";

const OrganizationalMetrics = () => {
  const [activeTab, setActiveTab] = useState("designations");

  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [salaryGrades, setSalaryGrades] = useState([]);

  const [staffSalaryGrades, setStaffSalaryGrades] = useState([]);

  const [skillMetrics, setSkillMetrics] = useState([]);

  const [operations, setOperations] = useState([]);
  const [machines, setMachines] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [salaryGradeType, setSalaryGradeType] = useState("worker"); // 'worker' or 'staff'
  const [addType, setAddType] = useState("operation"); // 'operation', 'machine'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to refresh data from service without triggering infinite loops
  const refreshData = async () => {
    // For Process Expertise tab, force refresh from API to get latest data
    if (activeTab === "processExpertise") {
      try {
        console.log("Force refreshing Operations and Machines from API");
        await organizationalDataService.refreshOperationsAndMachines();
        const operationsData = organizationalDataService.getOperations();
        const machinesData = organizationalDataService.getMachines();
        console.log("Refreshed from API - Operations:", operationsData);
        console.log("Refreshed from API - Machines:", machinesData);
        setOperations(operationsData);
        setMachines(machinesData);
      } catch (error) {
        console.error("Failed to refresh from API, using cached data:", error);
        // Fallback to cached data if API fails
        const operationsData = organizationalDataService.getOperations();
        const machinesData = organizationalDataService.getMachines();
        setOperations(operationsData);
        setMachines(machinesData);
      }
    } else {
      // For other tabs, use cached data
      const operationsData = organizationalDataService.getOperations();
      const machinesData = organizationalDataService.getMachines();
      setOperations(operationsData);
      setMachines(machinesData);
    }

    setDesignations(organizationalDataService.getDesignations());
    setDepartments(organizationalDataService.getDepartments());
    setSkillMetrics(organizationalDataService.getSkillMetrics());
    setSalaryGrades(organizationalDataService.getAllSalaryGrades());
    setStaffSalaryGrades(organizationalDataService.getStaffSalaryGrades());
  };

  // Helper function to show notifications
  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div");
    const bgColor =
      type === "success"
        ? "bg-green-500"
        : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";
    const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 transform transition-all duration-300 translate-x-full`;
    notification.innerHTML = `
      <span class="text-lg">${icon}</span>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
  };

  // Load data from service on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load fresh data from API
        await organizationalDataService.loadAllData();

        // Get fresh data from service
        const designationsData = organizationalDataService.getDesignations();
        const departmentsData = organizationalDataService.getDepartments();
        const skillMetricsData = organizationalDataService.getSkillMetrics();
        const salaryGradesData = organizationalDataService.getAllSalaryGrades();
        const staffSalaryGradesData =
          organizationalDataService.getStaffSalaryGrades();
        const operationsData = organizationalDataService.getOperations();
        const machinesData = organizationalDataService.getMachines();

        console.log("Loading data - Operations:", operationsData);
        console.log("Loading data - Machines:", machinesData);

        setDesignations(designationsData);
        setDepartments(departmentsData);
        setSkillMetrics(skillMetricsData);
        setSalaryGrades(salaryGradesData);
        setStaffSalaryGrades(staffSalaryGradesData);
        setOperations(operationsData);
        setMachines(machinesData);
      } catch (error) {
        console.error("Error loading organizational data:", error);
        setError("Failed to load organizational data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // No event listeners needed - data will be refreshed manually after operations
  }, []);

  const tabs = [
    { id: "designations", name: "Designations" },
    { id: "departments", name: "Departments" },
    { id: "salaryGrades", name: "Salary Grade Management" },
    { id: "skillMetrics", name: "Skill Metrics" },
    { id: "processExpertise", name: "Process Expertise" },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case "designations":
        return designations || [];
      case "departments":
        return departments || [];
      case "salaryGrades":
        return [...(salaryGrades || []), ...(staffSalaryGrades || [])];
      case "skillMetrics":
        return skillMetrics || [];
      case "processExpertise":
        // Return empty array since we use independent Operations and Machines
        return [];
      default:
        return [];
    }
  };

  const handleAdd = (type = "operation") => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      department: "",
      skills: "",
      skillsArray:
        type === "softSkill" || type === "technicalSkill" ? [""] : [],
      designation: "",
      grade_type: "WORKER",
      basicSalary: 0,
      houseRent: 0,
      medicalAllowance: 0,
      conveyance: 0,
      foodAllowance: 0,
      mobileBill: 0,
      grossSalary: 0,
      category: type === "softSkill" ? "soft_skills" : "technical",
      is_active: true,
    });
    setSalaryGradeType("worker");
    setAddType(type);
    setShowAddModal(true);
    setError(null);
  };

  const handleEdit = (item) => {
    console.log("=== HANDLE EDIT DEBUG ===");
    console.log("handleEdit called with item:", item);
    console.log("Item ID:", item.id);
    console.log("Item name:", item.name);
    console.log("Item type:", item.type);
    setEditingItem(item);

    // Ensure skillsArray is properly initialized
    const skillsArray = Array.isArray(item.skills)
      ? item.skills
      : item.skills
      ? [item.skills]
      : [];

    const formDataToSet = {
      name: item.name || "",
      description: item.description || "",
      skillsArray: skillsArray,
      skill: "",
      designation: item.designation || item.name || "", // For technical skills, use name as designation
      department: item.department || "",
      operation: item.operation || "",
      machine: item.machine || "",
      grade_type: item.grade_type || "WORKER",
      basic_salary: item.basic_salary || 0,
      house_rent: item.house_rent || 0,
      medical_allowance: item.medical_allowance || 0,
      conveyance: item.conveyance || 0,
      food_allowance: item.food_allowance || 0,
      mobile_bill: item.mobile_bill || 0,
      gross_salary: item.gross_salary || 0,
      category: item.category || "Technical",
      is_active: item.is_active !== false,
    };

    console.log("Form data set to:", formDataToSet);
    setFormData(formDataToSet);

    // Set the correct addType based on item type or category
    if (item.type === "operation") {
      setAddType("operation");
    } else if (item.type === "machine") {
      setAddType("machine");
    } else if (item.category === "soft_skills") {
      setAddType("softSkill");
    } else if (item.category === "technical") {
      setAddType("technicalSkill");
    }
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    // Show modern confirmation dialog
    const confirmed = await new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">Confirm Deletion</h3>
          </div>
          <p class="text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
          <div class="flex justify-end space-x-3">
            <button id="cancel-btn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button id="confirm-btn" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector("#cancel-btn").onclick = () => {
        document.body.removeChild(modal);
        resolve(false);
      };

      modal.querySelector("#confirm-btn").onclick = () => {
        document.body.removeChild(modal);
        resolve(true);
      };

      // Close on backdrop click
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          resolve(false);
        }
      };
    });

    if (!confirmed) return;

    try {
      setIsLoading(true);
      setError(null);

      if (activeTab === "designations") {
        await organizationalDataService.deleteDesignation(id);
      } else if (activeTab === "departments") {
        await organizationalDataService.deleteDepartment(id);
      } else if (activeTab === "salaryGrades") {
        await organizationalDataService.deleteSalaryGrade(id);
      } else if (activeTab === "skillMetrics") {
        await organizationalDataService.deleteSkillMetric(id);
      } else if (activeTab === "processExpertise") {
        // This should not be reached since we use independent Operations and Machines
      }

      // Refresh data from service after deletion
      await refreshData();

      // Force refresh Process Expertise data if on that tab
      if (activeTab === "processExpertise") {
        try {
          await organizationalDataService.refreshOperationsAndMachines();
          const operationsData = organizationalDataService.getOperations();
          const machinesData = organizationalDataService.getMachines();
          setOperations(operationsData);
          setMachines(machinesData);
        } catch (error) {
          console.error("Failed to refresh Process Expertise data:", error);
        }
      }

      // Show success notification
      showNotification("Item deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting item:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to delete item. Please try again.";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    console.log("=== HANDLE SAVE DEBUG ===");
    console.log("activeTab:", activeTab);
    console.log("addType:", addType);
    console.log("editingItem:", editingItem);
    console.log("formData:", formData);

    setIsLoading(true);
    setError(null);

    try {
      let dataToSave = { ...formData };

      // Map frontend field names to backend field names based on activeTab
      if (activeTab === "designations") {
        // Designation requires: name, department (ID), level
        dataToSave = {
          name: formData.name,
          department: formData.department, // This should be department ID
          level: formData.level || "worker", // Default to worker if not set
          description: formData.description || "",
          is_active: formData.is_active !== false,
        };
      } else if (activeTab === "departments") {
        // Department requires: name, description (optional)
        dataToSave = {
          name: formData.name,
          description: formData.description || "",
          is_active: formData.is_active !== false,
        };
      } else if (activeTab === "salaryGrades") {
        // SalaryGrade requires: name, grade_type, basic_salary, gross_salary, etc.
        const basicSalary = parseFloat(
          formData.basic_salary || formData.basicSalary || 0
        );
        const houseRent = parseFloat(
          formData.house_rent || formData.houseRent || 0
        );
        const medicalAllowance = parseFloat(
          formData.medical_allowance || formData.medicalAllowance || 0
        );
        const conveyance = parseFloat(formData.conveyance || 0);
        const foodAllowance = parseFloat(
          formData.food_allowance || formData.foodAllowance || 0
        );
        const mobileBill = parseFloat(
          formData.mobile_bill || formData.mobileBill || 0
        );

        dataToSave = {
          name: formData.name,
          grade_type: salaryGradeType, // 'worker' or 'staff'
          basic_salary: basicSalary,
          house_rent: houseRent,
          medical_allowance: medicalAllowance,
          conveyance: conveyance,
          food_allowance: foodAllowance,
          mobile_bill: mobileBill,
          gross_salary:
            basicSalary +
            houseRent +
            medicalAllowance +
            conveyance +
            foodAllowance +
            mobileBill,
          is_active: formData.is_active !== false,
        };
      } else if (activeTab === "skillMetrics") {
        // SkillMetric requires: name, category, skills (array)
        const skillsArray = formData.skillsArray
          ? formData.skillsArray.filter((skill) => skill.trim() !== "")
          : [];

        // Only apply skill metrics validation for skill metrics tab
        if (activeTab === "skillMetrics") {
          // Set category based on addType
          let category = "technical";
          if (addType === "softSkill") {
            category = "soft_skills";
          } else if (addType === "technicalSkill") {
            category = "technical";
          }

          // Validate required fields based on skill type
          if (category === "soft_skills") {
            // For soft skills, name is required
            if (!formData.name || formData.name.trim() === "") {
              setError("Skill Category Name is required");
              return;
            }

            // Check for duplicate soft skill category names
            const existingSoftSkills = skillMetrics.filter(
              (skill) =>
                skill.category === "soft_skills" &&
                skill.name.toLowerCase() ===
                  formData.name.trim().toLowerCase() &&
                skill.id !== editingItem?.id
            );

            if (existingSoftSkills.length > 0) {
              setError("A soft skill with this category name already exists");
              return;
            }
          } else if (category === "technical") {
            // For technical skills, designation and department are required
            if (!formData.designation || formData.designation.trim() === "") {
              setError("Designation is required");
              return;
            }
            if (!formData.department || formData.department.trim() === "") {
              setError("Department is required");
              return;
            }
          }
        }

        // Only validate skills for skill metrics
        if (activeTab === "skillMetrics" && skillsArray.length === 0) {
          setError("At least one skill is required");
          return;
        }

        // Validate Operations and Machines
        if (activeTab === "processExpertise") {
          if (!formData.name || formData.name.trim() === "") {
            setError(
              `${
                addType === "operation" ? "Operation" : "Machine"
              } name is required`
            );
            return;
          }
        }

        // Generate name for technical skills based on designation and department
        if (activeTab === "skillMetrics") {
          let category = "technical";
          if (addType === "softSkill") {
            category = "soft_skills";
          } else if (addType === "technicalSkill") {
            category = "technical";
          }

          let skillName = "";
          if (category === "technical") {
            skillName = `${formData.designation} - ${formData.department}`;
          } else {
            skillName = formData.name.trim();
          }

          dataToSave = {
            name: skillName,
            description: formData.description || "",
            category: category,
            designation:
              formData.designation && formData.designation.trim() !== ""
                ? formData.designation
                : null,
            department:
              formData.department && formData.department.trim() !== ""
                ? formData.department
                : null,
            skills: skillsArray,
            is_active: formData.is_active !== false,
          };
        }
      } else if (activeTab === "processExpertise") {
        // This should not be reached since we use independent Operations and Machines
        dataToSave = {};
      }

      // Remove empty fields
      Object.keys(dataToSave).forEach((key) => {
        if (
          dataToSave[key] === "" ||
          dataToSave[key] === null ||
          dataToSave[key] === undefined
        ) {
          delete dataToSave[key];
        }
      });

      if (editingItem) {
        // Update existing item
        switch (activeTab) {
          case "designations":
            await organizationalDataService.updateDesignation(
              editingItem.id,
              dataToSave
            );
            break;
          case "departments":
            await organizationalDataService.updateDepartment(
              editingItem.id,
              dataToSave
            );
            break;
          case "salaryGrades":
            await organizationalDataService.updateSalaryGrade(
              editingItem.id,
              dataToSave
            );
            break;
          case "skillMetrics":
            await organizationalDataService.updateSkillMetric(
              editingItem.id,
              dataToSave
            );
            break;
          case "processExpertise":
            // This should not be reached since we removed Process Expertise combinations
            break;
        }
      } else {
        // Create new item
        switch (activeTab) {
          case "designations":
            await organizationalDataService.addDesignation(dataToSave);
            break;
          case "departments":
            await organizationalDataService.addDepartment(dataToSave);
            break;
          case "salaryGrades":
            await organizationalDataService.addSalaryGrade(dataToSave);
            break;
          case "skillMetrics":
            await organizationalDataService.addSkillMetric(dataToSave);
            break;
          case "processExpertise":
            if (addType === "operation") {
              await organizationalDataService.addOperation({
                name: formData.name,
                description: formData.description || "",
                is_active: formData.is_active !== false,
              });
            } else if (addType === "machine") {
              await organizationalDataService.addMachine({
                name: formData.name,
                description: formData.description || "",
                is_active: formData.is_active !== false,
              });
            }
            break;
        }
      }

      // Refresh data from service after successful save
      await refreshData();

      // Force refresh the specific data for Process Expertise
      if (activeTab === "processExpertise") {
        try {
          await organizationalDataService.refreshOperationsAndMachines();
          const operationsData = organizationalDataService.getOperations();
          const machinesData = organizationalDataService.getMachines();
          setOperations(operationsData);
          setMachines(machinesData);
        } catch (error) {
          console.error("Failed to refresh Process Expertise data:", error);
        }
      }

      setShowAddModal(false);
      setEditingItem(null);
      setFormData({});

      // Show success notification
      showNotification("Item saved successfully", "success");
    } catch (error) {
      console.error("Failed to save:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to save. Please try again.";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-calculate gross salary for salary grades
  useEffect(() => {
    if (
      activeTab === "salaryGrades" &&
      formData.basicSalary &&
      formData.houseRent &&
      formData.medicalAllowance &&
      formData.conveyance
    ) {
      let grossSalary = 0;
      if (salaryGradeType === "staff" && formData.mobileBill) {
        grossSalary =
          (formData.basicSalary || 0) +
          (formData.houseRent || 0) +
          (formData.medicalAllowance || 0) +
          (formData.conveyance || 0) +
          (formData.mobileBill || 0);
      } else if (salaryGradeType === "worker" && formData.foodAllowance) {
        grossSalary =
          (formData.basicSalary || 0) +
          (formData.houseRent || 0) +
          (formData.medicalAllowance || 0) +
          (formData.conveyance || 0) +
          (formData.foodAllowance || 0);
      }
      if (grossSalary > 0) {
        setFormData((prev) => ({ ...prev, grossSalary }));
      }
    }
  }, [
    formData.basicSalary,
    formData.houseRent,
    formData.medicalAllowance,
    formData.conveyance,
    formData.foodAllowance,
    formData.mobileBill,
    activeTab,
    salaryGradeType,
  ]);

  const renderFormFields = () => {
    // Handle skill metrics add types
    if (activeTab === "skillMetrics") {
      switch (addType) {
        case "softSkill":
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Category Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Communication Skills"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <div className="space-y-2">
                  {formData.skillsArray &&
                    formData.skillsArray.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const newSkills = [...formData.skillsArray];
                            newSkills[index] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              skillsArray: newSkills,
                            }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder={`Skill ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = formData.skillsArray.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              skillsArray: newSkills,
                            }));
                          }}
                          className="px-3 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                          Remove
                        </button>
                      </div>
                    ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        skillsArray: [...(prev.skillsArray || []), ""],
                      }));
                    }}
                    className="w-full px-3 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                    + Add Skill
                  </button>
                </div>
              </div>
            </div>
          );
        case "technicalSkill":
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <select
                  value={formData.designation || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      designation: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select Designation</option>
                  {designations.map((designation) => (
                    <option key={designation.id} value={designation.name}>
                      {designation.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <div className="space-y-2">
                  {formData.skillsArray &&
                    formData.skillsArray.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const newSkills = [...formData.skillsArray];
                            newSkills[index] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              skillsArray: newSkills,
                            }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder={`Skill ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = formData.skillsArray.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              skillsArray: newSkills,
                            }));
                          }}
                          className="px-3 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                          Remove
                        </button>
                      </div>
                    ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        skillsArray: [...(prev.skillsArray || []), ""],
                      }));
                    }}
                    className="w-full px-3 py-2 text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors">
                    + Add Skill
                  </button>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    // Handle process expertise add types
    if (activeTab === "processExpertise") {
      switch (addType) {
        case "operation":
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operation Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Rob Joint"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter operation description"
                  rows={3}
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
          );
        case "machine":
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machine Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Overlock"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter machine description"
                  rows={3}
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
          );
        case "processExpertise":
          // This case should not be reached since we use independent Operations and Machines
          return null;
        default:
          return null;
      }
    }

    switch (activeTab) {
      case "designations":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Software Engineer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={formData.department || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required>
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={formData.level || "worker"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, level: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required>
                <option value="worker">Worker</option>
                <option value="staff">Staff</option>
                <option value="management">Management</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Job description..."
                rows={3}
              />
            </div>
          </div>
        );

      case "departments":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Cutting Department"
            />
          </div>
        );

      case "salaryGrades":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Type
              </label>
              <select
                value={salaryGradeType}
                onChange={(e) => {
                  setSalaryGradeType(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    foodAllowance: undefined,
                    mobileBill: undefined,
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="worker">Worker</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={
                  salaryGradeType === "worker"
                    ? "e.g., Worker Grade-1"
                    : "e.g., Staff Grade-1"
                }
              />
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                {salaryGradeType === "worker" ? "Worker" : "Staff"} Salary
                Components
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Basic Salary (Tk)
                  </label>
                  <input
                    type="number"
                    value={formData.basic_salary || formData.basicSalary || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        basic_salary: parseInt(e.target.value) || 0,
                        basicSalary: parseInt(e.target.value) || 0, // Keep both for compatibility
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={
                      salaryGradeType === "worker" ? "8390" : "25000"
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    House Rent (Tk)
                  </label>
                  <input
                    type="number"
                    value={formData.house_rent || formData.houseRent || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        house_rent: parseInt(e.target.value) || 0,
                        houseRent: parseInt(e.target.value) || 0, // Keep both for compatibility
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={
                      salaryGradeType === "worker" ? "4195" : "12500"
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Medical Allowance (Tk)
                  </label>
                  <input
                    type="number"
                    value={
                      formData.medical_allowance ||
                      formData.medicalAllowance ||
                      ""
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        medical_allowance: parseInt(e.target.value) || 0,
                        medicalAllowance: parseInt(e.target.value) || 0, // Keep both for compatibility
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={salaryGradeType === "worker" ? "750" : "2000"}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Conveyance (Tk)
                  </label>
                  <input
                    type="number"
                    value={formData.conveyance || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        conveyance: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={salaryGradeType === "worker" ? "450" : "1500"}
                  />
                </div>
                {salaryGradeType === "worker" ? (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Food Allowance (Tk)
                    </label>
                    <input
                      type="number"
                      value={
                        formData.food_allowance || formData.foodAllowance || ""
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          food_allowance: parseInt(e.target.value) || 0,
                          foodAllowance: parseInt(e.target.value) || 0, // Keep both for compatibility
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1250"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Mobile Bill (Tk)
                    </label>
                    <input
                      type="number"
                      value={formData.mobile_bill || formData.mobileBill || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mobile_bill: parseInt(e.target.value) || 0,
                          mobileBill: parseInt(e.target.value) || 0, // Keep both for compatibility
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1000"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Gross Salary (Tk)
                  </label>
                  <input
                    type="number"
                    value={formData.grossSalary || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        grossSalary: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                    placeholder={
                      salaryGradeType === "worker" ? "15035" : "42000"
                    }
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "skillMetrics":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Category Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Communication Skills"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category || "technical"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required>
                <option value="technical">Technical</option>
                <option value="soft_skills">Soft Skills</option>
                <option value="management">Management</option>
                <option value="cognitive">Cognitive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (one per line)
              </label>
              <textarea
                value={formData.skills || ""}
                onChange={(e) => {
                  const skillsText = e.target.value;
                  const skillsArray = skillsText
                    .split("\n")
                    .filter((skill) => skill.trim() !== "");
                  setFormData((prev) => ({
                    ...prev,
                    skills: skillsText,
                    skillsArray: skillsArray,
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={5}
                placeholder="Enter each skill on a new line&#10;e.g.,&#10;Verbal communication&#10;Written communication&#10;Active listening"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Description of the skill category..."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTable = () => {
    const data = getCurrentData();

    if (activeTab === "salaryGrades") {
      const workerGrades = salaryGrades;
      const staffGrades = staffSalaryGrades;

      return (
        <div className="space-y-8">
          {/* Worker Grades Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Worker Salary Grades
                  </h3>
                  <p className="text-sm text-gray-500">
                    {workerGrades.length} grades available
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSalaryGradeType("worker");
                  handleAdd();
                }}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ffb366, #ff8c42)")
                }>
                <span>+</span>
                Add Worker Grade
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Basic Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      House Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medical
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conveyance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Food Allowance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workerGrades.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.basic_salary?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.house_rent?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.medical_allowance?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.conveyance?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.food_allowance?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.gross_salary?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Staff Grades Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Staff Salary Grades
                  </h3>
                  <p className="text-sm text-gray-500">
                    {staffGrades.length} grades available
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSalaryGradeType("staff");
                  handleAdd();
                }}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ffb366, #ff8c42)")
                }>
                <span>+</span>
                Add Staff Grade
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Basic Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      House Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medical
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conveyance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile Bill
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffGrades.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.basic_salary?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.house_rent?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.medical_allowance?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.conveyance?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.mobile_bill?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.gross_salary?.toLocaleString()} Tk
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // Process Expertise layout (Operations and Machines as independent entities)
    if (activeTab === "processExpertise") {
      return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Process Expertise Management
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleAdd("operation")}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ffb366, #ff8c42)")
                }>
                <span>+</span>
                Add Operation
              </button>
              <button
                onClick={() => handleAdd("machine")}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ffb366, #ff8c42)")
                }>
                <span>+</span>
                Add Machine
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Operations Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgb(255,250,245)" }}>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: "rgb(200,100,50)" }}>
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "rgb(200,100,50)" }}>
                      Operations
                    </h2>
                    <p className="text-sm text-gray-600">
                      Available operations in the system
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "rgb(255,250,245)",
                      color: "rgb(200,100,50)",
                    }}>
                    {operations.length} operations
                  </span>
                </div>

                <div className="space-y-3">
                  {operations.map((operation) => {
                    return (
                      <div
                        key={operation.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {operation.name}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                const confirmed = await new Promise(
                                  (resolve) => {
                                    const modal = document.createElement("div");
                                    modal.className =
                                      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
                                    modal.innerHTML = `
                                  <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                    <div class="flex items-center mb-4">
                                      <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                        </svg>
                                      </div>
                                      <h3 class="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                                    </div>
                                    <p class="text-gray-600 mb-6">Are you sure you want to delete this operation? This action cannot be undone.</p>
                                    <div class="flex justify-end space-x-3">
                                      <button id="cancel-btn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Cancel</button>
                                      <button id="confirm-btn" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">Delete</button>
                                    </div>
                                  </div>`;
                                    document.body.appendChild(modal);
                                    modal.querySelector("#cancel-btn").onclick =
                                      () => {
                                        document.body.removeChild(modal);
                                        resolve(false);
                                      };
                                    modal.querySelector(
                                      "#confirm-btn"
                                    ).onclick = () => {
                                      document.body.removeChild(modal);
                                      resolve(true);
                                    };
                                    modal.onclick = (e) => {
                                      if (e.target === modal) {
                                        document.body.removeChild(modal);
                                        resolve(false);
                                      }
                                    };
                                  }
                                );
                                if (confirmed) {
                                  try {
                                    setIsLoading(true);
                                    setError(null);
                                    await organizationalDataService.deleteOperation(
                                      operation.name
                                    );
                                    await refreshData();
                                    // Force refresh Process Expertise data
                                    await organizationalDataService.refreshOperationsAndMachines();
                                    const operationsData =
                                      organizationalDataService.getOperations();
                                    const machinesData =
                                      organizationalDataService.getMachines();
                                    setOperations(operationsData);
                                    setMachines(machinesData);
                                    showNotification(
                                      "Operation deleted successfully",
                                      "success"
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error deleting operation:",
                                      error
                                    );
                                    const errorMessage =
                                      error.response?.data?.error ||
                                      error.message ||
                                      "Failed to delete operation. Please try again.";
                                    setError(errorMessage);
                                    showNotification(errorMessage, "error");
                                  } finally {
                                    setIsLoading(false);
                                  }
                                }
                              }}
                              className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-xl hover:from-pink-500 hover:to-rose-500 transition-all duration-300 text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Description:</span>{" "}
                            {operation.description || "No description"}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                operation.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                              {operation.is_active ? "Active" : "Inactive"}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {operations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <p>No operations found</p>
                      <p className="text-sm">
                        Click "Add Operation" to create one
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Machines Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgb(255,250,245)" }}>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: "rgb(200,100,50)" }}>
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "rgb(200,100,50)" }}>
                      Machines
                    </h2>
                    <p className="text-sm text-gray-600">
                      Available machines in the system
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "rgb(255,250,245)",
                      color: "rgb(200,100,50)",
                    }}>
                    {machines.length} machines
                  </span>
                </div>

                <div className="space-y-3">
                  {machines.map((machine) => {
                    return (
                      <div
                        key={machine.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {machine.name}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                const confirmed = await new Promise(
                                  (resolve) => {
                                    const modal = document.createElement("div");
                                    modal.className =
                                      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
                                    modal.innerHTML = `
                                  <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                    <div class="flex items-center mb-4">
                                      <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                        </svg>
                                      </div>
                                      <h3 class="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                                    </div>
                                    <p class="text-gray-600 mb-6">Are you sure you want to delete this machine? This action cannot be undone.</p>
                                    <div class="flex justify-end space-x-3">
                                      <button id="cancel-btn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Cancel</button>
                                      <button id="confirm-btn" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">Delete</button>
                                    </div>
                                  </div>`;
                                    document.body.appendChild(modal);
                                    modal.querySelector("#cancel-btn").onclick =
                                      () => {
                                        document.body.removeChild(modal);
                                        resolve(false);
                                      };
                                    modal.querySelector(
                                      "#confirm-btn"
                                    ).onclick = () => {
                                      document.body.removeChild(modal);
                                      resolve(true);
                                    };
                                    modal.onclick = (e) => {
                                      if (e.target === modal) {
                                        document.body.removeChild(modal);
                                        resolve(false);
                                      }
                                    };
                                  }
                                );
                                if (confirmed) {
                                  try {
                                    setIsLoading(true);
                                    setError(null);
                                    await organizationalDataService.deleteMachine(
                                      machine.name
                                    );
                                    await refreshData();
                                    // Force refresh Process Expertise data
                                    await organizationalDataService.refreshOperationsAndMachines();
                                    const operationsData =
                                      organizationalDataService.getOperations();
                                    const machinesData =
                                      organizationalDataService.getMachines();
                                    setOperations(operationsData);
                                    setMachines(machinesData);
                                    showNotification(
                                      "Machine deleted successfully",
                                      "success"
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error deleting machine:",
                                      error
                                    );
                                    const errorMessage =
                                      error.response?.data?.error ||
                                      error.message ||
                                      "Failed to delete machine. Please try again.";
                                    setError(errorMessage);
                                    showNotification(errorMessage, "error");
                                  } finally {
                                    setIsLoading(false);
                                  }
                                }
                              }}
                              className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 rounded-xl hover:from-pink-500 hover:to-rose-500 transition-all duration-300 text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Description:</span>{" "}
                            {machine.description || "No description"}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                machine.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                              {machine.is_active ? "Active" : "Inactive"}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {machines.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                          />
                        </svg>
                      </div>
                      <p>No machines found</p>
                      <p className="text-sm">
                        Click "Add Machine" to create one
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Departments layout
    if (activeTab === "departments") {
      return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium">Departments</h3>
            <button
              onClick={handleAdd}
              className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #ffb366, #ff8c42)",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background =
                  "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background =
                  "linear-gradient(135deg, #ffb366, #ff8c42)")
              }>
              <span>+</span>
              Add Department
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <div className="text-center mb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Skill Metrics layout
    if (activeTab === "skillMetrics") {
      const data = getCurrentData();

      return (
        <div className="space-y-8">
          {/* Soft Skills Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-100">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Soft Skills
                  </h3>
                  <p className="text-sm text-gray-500">
                    Interpersonal and behavioral competencies
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAdd("softSkill")}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ffb366, #ff8c42)")
                }>
                <span>+</span>
                Add Soft Skills
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Soft Skills */}
                {data
                  .filter((item) => item && item.category === "soft_skills")
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:scale-105">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-200 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          {skill.name}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {skill.skills &&
                          Array.isArray(skill.skills) &&
                          skill.skills.map((skillItem, index) => (
                            <div
                              key={index}
                              className="flex items-center text-xs text-gray-700">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2 flex-shrink-0"></div>
                              <span>{skillItem}</span>
                            </div>
                          ))}
                      </div>
                      <div className="flex gap-2 justify-center mt-4">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Technical Skills Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-100">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Technical Skills
                  </h3>
                  <p className="text-sm text-gray-500">
                    Job-specific technical competencies
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAddType("technicalSkill");
                  handleAdd("technicalSkill");
                }}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ffb366, #ff8c42)")
                }>
                <span>+</span>
                Add Technical Skill
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {/* Technical Skills */}
                {data
                  .filter((item) => item && item.category === "technical")
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:scale-105">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-200 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                          </svg>
                        </div>
                        {(skill.designation || skill.department) && (
                          <div className="space-y-1 mb-3">
                            {skill.designation && (
                              <div className="text-xs font-bold text-gray-900 bg-orange-100 px-2 py-1 rounded-full">
                                {skill.designation}
                              </div>
                            )}
                            {skill.department && (
                              <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                {skill.department}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {skill.skills &&
                          Array.isArray(skill.skills) &&
                          skill.skills.map((skillItem, index) => (
                            <div
                              key={index}
                              className="flex items-center text-xs text-gray-700">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2 flex-shrink-0"></div>
                              <span>{skillItem}</span>
                            </div>
                          ))}
                      </div>
                      <div className="flex gap-2 justify-center mt-4">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default layout for other tabs
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {tabs.find((tab) => tab.id === activeTab)?.name} Management
          </h3>
          <button
            onClick={handleAdd}
            className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #ffb366, #ff8c42)" }}
            onMouseEnter={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background =
                "linear-gradient(135deg, #ffb366, #ff8c42)")
            }>
            <span>+</span>
            Add {tabs.find((tab) => tab.id === activeTab)?.name.slice(0, -1)}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className="text-center mb-4">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.name}
                </h3>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organizational Metrics</h1>
          <p className="text-sm text-gray-500">
            Manage designations, departments, work levels, and skill metrics
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-700">
              Loading organizational data...
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="ml-4 text-red-600 hover:text-red-800 underline">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              style={
                activeTab === tab.id
                  ? {
                      borderBottomColor: "rgb(255,200,150)",
                      color: "rgb(200,100,50)",
                    }
                  : {}
              }>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderTable()}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? "Edit" : "Add"}{" "}
                {activeTab === "processExpertise"
                  ? addType === "operation"
                    ? "Operation"
                    : addType === "machine"
                    ? "Machine"
                    : "Operation"
                  : tabs.find((tab) => tab.id === activeTab)?.name.slice(0, -1)}
              </h3>
              <div className="space-y-4">{renderFormFields()}</div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white rounded transition-colors"
                  style={{
                    background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background =
                      "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background =
                      "linear-gradient(135deg, #ffb366, #ff8c42)")
                  }>
                  {editingItem ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationalMetrics;
