import React, { useEffect, useState } from "react";
import authService from "../../services/authService";
import kpiService from "../../services/kpiService";

export default function GoalsKPIs() {
  const [filters, setFilters] = useState({
    employeeId: "",
    designation: "",
    department: "",
    year: "",
  });

  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  // Removed skillMetrics state - now using employee-specific skills
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState(null);

  // Debouncing for Employee ID filter
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  const loadInitialData = async () => {
    // Prevent multiple simultaneous loads
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load designations and departments directly from API
      await loadDesignations();
      await loadDepartments();

      // Load active employees with KPI data and their specific skills
      await loadActiveEmployees();
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load designations directly from API
  const loadDesignations = async () => {
    try {
      const response = await authService.makeAuthenticatedRequest(
        "http://localhost:8000/api/designations/"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const processedData = data.results || data;
      setDesignations(processedData);
      console.log("KPI - Loaded designations from API:", processedData);
    } catch (error) {
      console.error("Failed to load designations from API:", error);
      setError("Failed to load designations. Please try again.");
    }
  };

  // Load departments directly from API
  const loadDepartments = async () => {
    try {
      const response = await authService.makeAuthenticatedRequest(
        "http://localhost:8000/api/departments/"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const processedData = data.results || data;
      setDepartments(processedData);
      console.log("KPI - Loaded departments from API:", processedData);
    } catch (error) {
      console.error("Failed to load departments from API:", error);
      setError("Failed to load departments. Please try again.");
    }
  };

  // Removed loadSkillMetrics function - now using employee-specific skills

  // Load active employees with KPI data
  const loadActiveEmployees = async (
    page = currentPage,
    pageSizeParam = pageSize
  ) => {
    try {
      // Get active staff employees from the KPI API (backend filtering)
      const response = await kpiService.getActiveStaffEmployees({
        page: page,
        page_size: pageSizeParam,
        search: filters.employeeId,
        department: filters.department,
        designation: filters.designation,
        year: filters.year,
      });

      console.log("KPI - Loaded employees response:", response);

      // Extract employees array from response
      const allEmployees = response.employees || [];

      if (!Array.isArray(allEmployees)) {
        throw new Error("Invalid employees data structure");
      }

      // Update pagination info
      if (response.pagination) {
        setPaginationInfo(response.pagination);
        setTotalPages(response.pagination.total_pages);
        setTotalCount(response.pagination.total_count);
        setCurrentPage(response.pagination.current_page);
      }

      if (allEmployees.length === 0) {
        setEmployees([]);
        return;
      }

      // Load KPI data and skills for each employee
      const employeesWithKPI = await Promise.all(
        allEmployees.map(async (emp) => {
          try {
            // Get latest KPI data for this employee
            const kpiData = await kpiService.getEmployeeLatestKPI(emp.id);
            console.log(`KPI data for employee ${emp.id}:`, kpiData);

            // Get skills for this specific employee
            const skillsData = await kpiService.getEmployeeSkills(emp.id);
            console.log(`Skills data for employee ${emp.id}:`, skillsData);

            // Normalize field names for consistency
            const normalizedEmp = {
              ...emp,
              full_name: emp.full_name || emp.name_english || emp.name,
              levelOfWork:
                emp.level_of_work || emp.levelOfWork || emp.LevelOfWork,
              status: emp.status || emp.Status,
              designation:
                emp.designation || emp.designation_name || emp.designationName,
              department:
                emp.department || emp.department_name || emp.departmentName,
              employee_id: emp.employee_id || emp.id,
              skillRatings: kpiData?.skill_ratings || {},
              overallScore: kpiData?.overall_score || 0,
              kpiData: kpiData,
              employeeSkills: skillsData.skills || [],
              softSkillsCount: skillsData.soft_skills_count || 0,
              technicalSkillsCount: skillsData.technical_skills_count || 0,
            };

            console.log(
              `Normalized employee ${emp.id} with skills:`,
              normalizedEmp.employeeSkills
            );
            return normalizedEmp;
          } catch (kpiError) {
            console.warn(
              `Error fetching data for employee ${emp.id}:`,
              kpiError
            );

            return {
              ...emp,
              full_name: emp.full_name || emp.name_english || emp.name,
              levelOfWork:
                emp.level_of_work || emp.levelOfWork || emp.LevelOfWork,
              status: emp.status || emp.Status,
              designation:
                emp.designation || emp.designation_name || emp.designationName,
              department:
                emp.department || emp.department_name || emp.departmentName,
              employee_id: emp.employee_id || emp.id,
              skillRatings: {},
              overallScore: 0,
              kpiData: null,
              employeeSkills: [],
              softSkillsCount: 0,
              technicalSkillsCount: 0,
            };
          }
        })
      );

      setEmployees(employeesWithKPI);
    } catch (error) {
      console.error("Error loading employees:", error);
      setError(
        "Failed to load employees. Please check your connection and try again."
      );
      setEmployees([]);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
    // Reload data with new filters
    loadActiveEmployees(1, pageSize);
  };

  // Debounced Employee ID filter handler
  const handleEmployeeIdChange = (value) => {
    setEmployeeIdInput(value);

    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout for 500ms delay
    const newTimeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        employeeId: value,
      }));
      setCurrentPage(1);
      loadActiveEmployees(1, pageSize);
    }, 500);

    setDebounceTimeout(newTimeout);
  };

  const clearFilters = () => {
    setFilters({
      employeeId: "",
      designation: "",
      department: "",
      year: new Date().getFullYear().toString(),
    });
    // Clear Employee ID input
    setEmployeeIdInput("");
    // Clear any pending debounce timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }
    // Reset to first page when clearing filters
    setCurrentPage(1);
    // Reload data with cleared filters
    loadActiveEmployees(1, pageSize);
  };

  const refreshData = async () => {
    await loadActiveEmployees(currentPage, pageSize);
  };

  // Get skills for an employee based on their specific skills data
  const getSkillsForEmployee = (employee) => {
    const skills = {
      softSkills: [],
      technicalSkills: [],
    };

    // Use employee-specific skills data if available
    if (
      employee &&
      employee.employeeSkills &&
      Array.isArray(employee.employeeSkills)
    ) {
      console.log(
        "KPI - Using employee-specific skills data:",
        employee.employeeSkills
      );

      employee.employeeSkills.forEach((skill) => {
        if (skill.category === "soft_skills" || skill.category === "soft") {
          // Add individual skills from the skills array
          if (skill.skills && Array.isArray(skill.skills)) {
            skill.skills.forEach((skillName) => {
              // Filter out empty, null, undefined, or "none" values
              if (
                skillName &&
                skillName.trim() !== "" &&
                skillName.toLowerCase() !== "none" &&
                !skills.softSkills.includes(skillName)
              ) {
                skills.softSkills.push(skillName);
              }
            });
          } else if (skill.name) {
            // If no skills array, use the skill name itself (also filter out "none")
            if (
              skill.name &&
              skill.name.trim() !== "" &&
              skill.name.toLowerCase() !== "none" &&
              !skills.softSkills.includes(skill.name)
            ) {
              skills.softSkills.push(skill.name);
            }
          }
        } else if (skill.category === "technical") {
          // Add individual skills from the skills array
          if (skill.skills && Array.isArray(skill.skills)) {
            skill.skills.forEach((skillName) => {
              // Filter out empty, null, undefined, or "none" values
              if (
                skillName &&
                skillName.trim() !== "" &&
                skillName.toLowerCase() !== "none" &&
                !skills.technicalSkills.includes(skillName)
              ) {
                skills.technicalSkills.push(skillName);
              }
            });
          } else if (skill.name) {
            // If no skills array, use the skill name itself (also filter out "none")
            if (
              skill.name &&
              skill.name.trim() !== "" &&
              skill.name.toLowerCase() !== "none" &&
              !skills.technicalSkills.includes(skill.name)
            ) {
              skills.technicalSkills.push(skill.name);
            }
          }
        }
      });
    } else {
      console.log("KPI - No employee-specific skills data available");
    }

    console.log("KPI - Final skills for employee:", skills);
    return skills;
  };

  // Filter employees based on selected filters - only active staff employees
  // Note: Most filtering is now done on the backend, but we keep this for any additional frontend filtering
  const filteredEmployees = employees.filter((employee) => {
    // Debug logging for each employee
    console.log("KPI - Filtering employee:", {
      id: employee.id,
      employee_id: employee.employee_id,
      designation: employee.designation,
      department: employee.department,
    });

    // Only apply frontend filtering for employee ID search (for partial matches)
    const matchesEmployeeId =
      !filters.employeeId ||
      employee.id.toString().includes(filters.employeeId) ||
      (employee.employee_id &&
        employee.employee_id.toString().includes(filters.employeeId));

    return matchesEmployeeId;
  });

  // Calculate average rating for an employee
  const calculateAverageRating = (skillRatings) => {
    if (!skillRatings || Object.keys(skillRatings).length === 0) return 0;
    const ratings = Object.values(skillRatings).filter((rating) => rating > 0);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  // Handle print functionality
  const handlePrint = () => {
    console.log("Print button clicked - starting print process");
    console.log("Filtered employees count:", filteredEmployees.length);

    const currentDate = new Date().toLocaleDateString("en-GB");
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      // Fallback: try to print the current page content
      console.log("Popup blocked, trying fallback print method");
      const printContent = document.querySelector(".space-y-6").innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = `
        <div style="font-family: Arial, sans-serif; margin: 20px;">
          <h1 style="color: #ea580c; text-align: center;">Employee KPI List</h1>
          <p style="text-align: center; color: #666;">Generated on: ${currentDate}</p>
          ${printContent}
        </div>
      `;
      window.print();
      document.body.innerHTML = originalContent;
      return;
    }

    let printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee KPI List - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #ea580c; margin-bottom: 10px; }
            .header p { color: #666; margin: 5px 0; }
            .filters { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .filters h3 { margin: 0 0 10px 0; color: #374151; }
            .filter-item { display: inline-block; margin-right: 20px; margin-bottom: 5px; }
            .filter-label { font-weight: bold; color: #6b7280; }
            .filter-value { color: #ea580c; }
            .employee-card { 
              border: 1px solid #e5e7eb; 
              border-radius: 8px; 
              padding: 20px; 
              margin-bottom: 20px; 
              background: white;
            }
            .employee-header { 
              border-bottom: 2px solid #ea580c; 
              padding-bottom: 10px; 
              margin-bottom: 15px; 
            }
            .employee-name { font-size: 18px; font-weight: bold; color: #111827; margin: 0; }
            .employee-details { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 10px; 
              margin-bottom: 15px; 
            }
            .detail-item { margin-bottom: 5px; }
            .detail-label { font-weight: bold; color: #6b7280; }
            .detail-value { color: #374151; }
            .skills-section { margin-top: 15px; }
            .skills-title { 
              font-weight: bold; 
              color: #ea580c; 
              margin-bottom: 10px; 
              padding: 8px; 
              background: #fed7aa; 
              border-radius: 4px; 
            }
            .skills-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
            }
            .skill-category { margin-bottom: 15px; }
            .skill-list { margin-left: 15px; }
            .skill-item { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 5px; 
              padding: 3px 0; 
            }
            .skill-name { color: #374151; }
            .skill-rating { color: #ea580c; font-weight: bold; }
            .average-rating { 
              text-align: center; 
              font-size: 16px; 
              font-weight: bold; 
              color: #ea580c; 
              margin: 15px 0; 
              padding: 10px; 
              background: #fef3c7; 
              border-radius: 6px; 
            }
            .no-data { text-align: center; color: #6b7280; font-style: italic; padding: 40px; }
            @media print {
              body { margin: 0; }
              .employee-card { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee KPI List</h1>
            <p>Generated on: ${currentDate}</p>
            <p>Active Staff: ${filteredEmployees.length}</p>
          </div>
    `;

    // Add active filters if any
    const activeFilters = [];
    if (filters.employeeId)
      activeFilters.push(`Employee ID: ${filters.employeeId}`);
    if (filters.designation)
      activeFilters.push(`Designation: ${filters.designation}`);
    if (filters.department)
      activeFilters.push(`Department: ${filters.department}`);
    if (filters.year) activeFilters.push(`Year: ${filters.year}`);

    if (activeFilters.length > 0) {
      printContent += `
        <div class="filters">
          <h3>Applied Filters:</h3>
          ${activeFilters
            .map(
              (filter) =>
                `<span class="filter-item"><span class="filter-label">${
                  filter.split(":")[0]
                }:</span> <span class="filter-value">${filter
                  .split(":")[1]
                  .trim()}</span></span>`
            )
            .join("")}
        </div>
      `;
    }

    // Add employee data
    if (filteredEmployees.length > 0) {
      filteredEmployees.forEach((employee) => {
        const employeeSkills = getSkillsForEmployee(employee);
        const averageRating = calculateAverageRating(
          employee.skillRatings || {}
        );

        printContent += `
          <div class="employee-card">
            <div class="employee-header">
              <h2 class="employee-name">${employee.full_name} || ${employee.designation} || ${employee.department}</h2>
            </div>
            
            <div class="employee-details">
              <div class="detail-item">
                <span class="detail-label">Employee ID:</span> <span class="detail-value">${employee.employee_id}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Designation:</span> <span class="detail-value">${employee.designation}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Department:</span> <span class="detail-value">${employee.department}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Level of Work:</span> <span class="detail-value">${employee.levelOfWork}</span>
              </div>
            </div>

            <div class="average-rating">
              Average Rating: ${averageRating}/5
            </div>

            <div class="skills-section">
              <div class="skills-grid">
                <div class="skill-category">
                  <div class="skills-title">Soft Skills</div>
                  <div class="skill-list">
        `;

        // Add soft skills
        employeeSkills.softSkills.forEach((skill) => {
          const rating = employee.skillRatings?.[skill] || 0;
          printContent += `
            <div class="skill-item">
              <span class="skill-name">${skill}</span>
              <span class="skill-rating">${rating}/5</span>
            </div>
          `;
        });

        printContent += `
                  </div>
                </div>
                
                <div class="skill-category">
                  <div class="skills-title">Technical Skills</div>
                  <div class="skill-list">
        `;

        // Add technical skills
        employeeSkills.technicalSkills.forEach((skill) => {
          const rating = employee.skillRatings?.[skill] || 0;
          printContent += `
            <div class="skill-item">
              <span class="skill-name">${skill}</span>
              <span class="skill-rating">${rating}/5</span>
            </div>
          `;
        });

        printContent += `
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      printContent += `
        <div class="no-data">
          No employees found matching the current filters.
        </div>
      `;
    }

    printContent += `
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for the content to load before printing
    printWindow.onload = () => {
      console.log("Print window loaded, triggering print dialog");
      setTimeout(() => {
        try {
          printWindow.print();
          console.log("Print dialog triggered successfully");
        } catch (error) {
          console.error("Error triggering print:", error);
          alert("Error opening print dialog. Please try again.");
        }
      }, 500);
    };

    // Close the window after a longer delay to allow user to interact with print dialog
    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.close();
      }
    }, 5000);
  };

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      name: employee.full_name,
      designation: employee.designation,
      department: employee.department,
      levelOfWork: employee.levelOfWork,
      skillRatings: { ...employee.skillRatings },
    });
    setShowEditModal(true);
  };

  // Handle designation or department change in edit form
  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // If designation or department changes, reset skill ratings for technical skills
      if (field === "designation" || field === "department") {
        const newSkills = getSkillsForEmployee(editingEmployee);

        // Keep existing ratings for soft skills, reset technical skills
        const updatedSkillRatings = { ...prev.skillRatings };

        // Remove ratings for technical skills that are no longer relevant
        Object.keys(updatedSkillRatings).forEach((skill) => {
          if (
            !newSkills.softSkills.includes(skill) &&
            !newSkills.technicalSkills.includes(skill)
          ) {
            delete updatedSkillRatings[skill];
          }
        });

        newData.skillRatings = updatedSkillRatings;
      }

      return newData;
    });
  };

  // Handle skill rating change in edit form
  const handleSkillRatingChange = (skillName, rating) => {
    setEditFormData((prev) => ({
      ...prev,
      skillRatings: {
        ...prev.skillRatings,
        [skillName]: parseInt(rating),
      },
    }));
  };

  // Handle save employee changes
  const handleSaveEmployee = async () => {
    console.log("Save button clicked!");
    console.log("Editing employee:", editingEmployee);
    console.log("Edit form data:", editFormData);

    if (!editingEmployee) {
      console.error("No employee being edited");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Prepare KPI data for the API
      // Clean and validate skill ratings
      const cleanedSkillRatings = {};
      if (editFormData.skillRatings) {
        Object.entries(editFormData.skillRatings).forEach(([skill, rating]) => {
          // Convert to number and ensure it's between 0 and 5
          const numericRating = parseInt(rating);
          if (
            !isNaN(numericRating) &&
            numericRating >= 0 &&
            numericRating <= 5
          ) {
            cleanedSkillRatings[skill] = numericRating;
          }
        });
      }

      const kpiData = {
        employee: editingEmployee.id,
        skill_ratings: cleanedSkillRatings,
        assessment_year: new Date().getFullYear(),
        assessment_month: new Date().getMonth() + 1,
        notes: "",
      };

      console.log("Prepared KPI data:", kpiData);
      console.log("Skill ratings details:", editFormData.skillRatings);
      console.log("Skill ratings type:", typeof editFormData.skillRatings);
      console.log(
        "Skill ratings keys:",
        Object.keys(editFormData.skillRatings || {})
      );

      // Check if this employee already has a KPI record for this period
      const existingKPIs = await kpiService.getAllKPIs({
        employee_id: editingEmployee.id,
        year: kpiData.assessment_year,
        month: kpiData.assessment_month,
      });

      console.log("Existing KPIs found:", existingKPIs);

      // Handle different response formats for existing KPIs
      let existingKPIsList = [];
      if (Array.isArray(existingKPIs)) {
        existingKPIsList = existingKPIs;
      } else if (existingKPIs && Array.isArray(existingKPIs.results)) {
        existingKPIsList = existingKPIs.results;
      }

      console.log("Processed existing KPIs list:", existingKPIsList);

      let savedKPI;
      if (existingKPIsList.length > 0) {
        // Update existing KPI
        console.log("Updating existing KPI with ID:", existingKPIsList[0].id);
        try {
          savedKPI = await kpiService.updateKPI(
            existingKPIsList[0].id,
            kpiData
          );
          console.log("KPI updated successfully:", savedKPI);
        } catch (updateError) {
          console.error("Error updating KPI:", updateError);
          // If update fails, try to create a new one
          console.log("Update failed, trying to create new KPI");
          savedKPI = await kpiService.createKPI(kpiData);
        }
      } else {
        // Create new KPI
        console.log("Creating new KPI");
        savedKPI = await kpiService.createKPI(kpiData);
      }

      console.log("KPI saved successfully:", savedKPI);

      // Update local state
      const updatedEmployees = employees.map((emp) =>
        emp.id === editingEmployee.id
          ? {
              ...emp,
              ...editFormData,
              skillRatings: editFormData.skillRatings || {},
              overallScore: savedKPI.overall_score || 0,
            }
          : emp
      );

      setEmployees(updatedEmployees);

      // Reload the employee data to ensure we have the latest KPI data
      await loadActiveEmployees();

      // Close modal
      setShowEditModal(false);
      setEditingEmployee(null);
      setEditFormData({});

      console.log("Employee KPI updated successfully");
    } catch (error) {
      console.error("Error saving employee KPI:", error);
      console.error("Error details:", error.message);
      if (error.response) {
        try {
          const errorText = await error.response.text();
          console.error("Error response:", errorText);
          setError(`Failed to save KPI data: ${errorText}. Please try again.`);
        } catch (e) {
          console.error("Error parsing response:", e);
          setError(
            `Failed to save KPI data: ${error.message}. Please try again.`
          );
        }
      } else {
        setError(
          `Failed to save KPI data: ${error.message}. Please try again.`
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingEmployee(null);
    setEditFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">KPI</h1>
          <p className="text-gray-600 mt-1">
            Track and manage key performance indicators
          </p>
        </div>
        <button
          onClick={loadInitialData}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="text-gray-600">Loading KPI data...</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-semibold text-gray-900">
                {employees.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Filtered Results
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredEmployees.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(employees.map((emp) => emp.department)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Designations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(employees.map((emp) => emp.designation)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Filter KPI Data
          </h3>
          <div className="flex gap-2">
            <button
              onClick={refreshData}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <button
              onClick={clearFilters}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Clear All Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Employee ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              placeholder="Enter Employee ID"
              value={employeeIdInput}
              onChange={(e) => handleEmployeeIdChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Designation Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation
            </label>
            <select
              value={filters.designation}
              onChange={(e) =>
                handleFilterChange("designation", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="">All Designations</option>
              {designations.map((designation) => (
                <option key={designation.id} value={designation.name}>
                  {designation.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="">All Years</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.employeeId ||
          filters.designation ||
          filters.department ||
          filters.year) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">
                Active Filters:
              </span>
              {filters.employeeId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Employee ID: {filters.employeeId}
                  <button
                    onClick={() => handleFilterChange("employeeId", "")}
                    className="ml-2 text-orange-600 hover:text-orange-800">
                    ×
                  </button>
                </span>
              )}
              {filters.designation && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Designation: {filters.designation}
                  <button
                    onClick={() => handleFilterChange("designation", "")}
                    className="ml-2 text-orange-600 hover:text-orange-800">
                    ×
                  </button>
                </span>
              )}
              {filters.department && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Department: {filters.department}
                  <button
                    onClick={() => handleFilterChange("department", "")}
                    className="ml-2 text-orange-600 hover:text-orange-800">
                    ×
                  </button>
                </span>
              )}
              {filters.year && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Year: {filters.year}
                  <button
                    onClick={() => handleFilterChange("year", "")}
                    className="ml-2 text-orange-600 hover:text-orange-800">
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Employee List Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Employee List
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {paginationInfo ? (
                  <>
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalCount)} of{" "}
                    {totalCount} employees
                  </>
                ) : (
                  <>
                    Showing {filteredEmployees.length} of {employees.length}{" "}
                    employees
                  </>
                )}
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print List
            </button>
          </div>
        </div>

        <div className="p-6">
          {filteredEmployees.length > 0 ? (
            <div className="space-y-4">
              {filteredEmployees.map((employee) => {
                const employeeSkills = getSkillsForEmployee(employee);
                return (
                  <div
                    key={employee.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:scale-[1.02] bg-white hover:bg-orange-50/30">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Section - Employee Information */}
                      <div className="space-y-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Employee Details
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">
                              ID:
                            </span>
                            <span
                              className="text-sm font-semibold text-gray-900 group-hover/info:text-orange-800 transition-colors duration-200 cursor-pointer hover:text-orange-600"
                              onClick={() =>
                                console.log(
                                  "Employee ID clicked:",
                                  employee.employee_id
                                )
                              }>
                              {employee.employee_id}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">
                              Name:
                            </span>
                            <span className="text-sm font-semibold text-gray-900 group-hover/info:text-orange-800 transition-colors duration-200">
                              {employee.full_name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">
                              Designation:
                            </span>
                            <span className="text-sm text-gray-700 group-hover/info:text-orange-800 transition-colors duration-200">
                              {employee.designation}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">
                              Department:
                            </span>
                            <span className="text-sm text-gray-700 group-hover/info:text-orange-800 transition-colors duration-200">
                              {employee.department}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">
                              Level:
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 group-hover/info:bg-blue-200 group-hover/info:text-blue-900 transition-all duration-200 shadow-sm group-hover/info:shadow-md">
                              {employee.levelOfWork}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Section - Soft Skills Ratings */}
                      <div className="group">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center group-hover:text-blue-600 transition-colors duration-200">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors duration-200"></div>
                          </div>
                          Soft Skills
                        </h4>
                        <div className="space-y-2">
                          {employeeSkills.softSkills.length > 0 ? (
                            employeeSkills.softSkills.map((skill, index) => {
                              const rating = employee.skillRatings[skill] || 0;
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group/skill">
                                  <span className="text-sm text-gray-700 group-hover/skill:text-blue-800 transition-colors duration-200">
                                    {skill}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-blue-600 group-hover/skill:text-blue-700 transition-colors duration-200">
                                      {rating}/5
                                    </span>
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                          key={star}
                                          className={`w-3 h-3 transition-all duration-200 ${
                                            star <= rating
                                              ? "text-blue-400 group-hover/skill:text-blue-500"
                                              : "text-gray-300 group-hover/skill:text-gray-400"
                                          }`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-xs text-gray-400">
                              No soft skills defined for this role
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Technical Skills Ratings */}
                      <div className="group">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center group-hover:text-green-600 transition-colors duration-200">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors duration-200">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full group-hover:bg-green-600 transition-colors duration-200"></div>
                          </div>
                          Technical Skills
                        </h4>
                        <div className="space-y-2">
                          {employeeSkills.technicalSkills.length > 0 ? (
                            employeeSkills.technicalSkills.map(
                              (skill, index) => {
                                const rating =
                                  employee.skillRatings[skill] || 0;
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 group/skill">
                                    <span className="text-sm text-gray-700 group-hover/skill:text-green-800 transition-colors duration-200">
                                      {skill}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-green-600 group-hover/skill:text-green-700 transition-colors duration-200">
                                        {rating}/5
                                      </span>
                                      <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <svg
                                            key={star}
                                            className={`w-3 h-3 transition-all duration-200 ${
                                              star <= rating
                                                ? "text-green-400 group-hover/skill:text-green-500"
                                                : "text-gray-300 group-hover/skill:text-gray-400"
                                            }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <span className="text-xs text-gray-400">
                              No technical skills defined for this role
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Average Rating */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">
                            Average Rating:
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-orange-600">
                              {calculateAverageRating(employee.skillRatings)}/5
                            </span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <=
                                    calculateAverageRating(
                                      employee.skillRatings
                                    )
                                      ? "text-orange-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No employees found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {paginationInfo && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
                  employees
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newPageSize = parseInt(e.target.value);
                    setPageSize(newPageSize);
                    setCurrentPage(1);
                    loadActiveEmployees(1, newPageSize);
                  }}
                  className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      const newPage = currentPage - 1;
                      setCurrentPage(newPage);
                      loadActiveEmployees(newPage, pageSize);
                    }
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          loadActiveEmployees(pageNum, pageSize);
                        }}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? "bg-orange-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}>
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    if (currentPage < totalPages) {
                      const newPage = currentPage + 1;
                      setCurrentPage(newPage);
                      loadActiveEmployees(newPage, pageSize);
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Employee Skills
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Employee Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <select
                      value={editFormData.designation || ""}
                      onChange={(e) =>
                        handleEditFormChange("designation", e.target.value)
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={editFormData.department || ""}
                      onChange={(e) =>
                        handleEditFormChange("department", e.target.value)
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level of Work
                    </label>
                    <select
                      value={editFormData.levelOfWork || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          levelOfWork: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="staff">Staff</option>
                      <option value="worker">Worker</option>
                    </select>
                  </div>
                </div>

                {/* Skills Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Soft Skills Ratings */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      Soft Skills Ratings
                    </h4>
                    <div className="space-y-3">
                      {editingEmployee &&
                        getSkillsForEmployee(editingEmployee).softSkills.map(
                          (skill, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-700">
                                {skill}
                              </span>
                              <select
                                value={editFormData.skillRatings?.[skill] || 0}
                                onChange={(e) =>
                                  handleSkillRatingChange(skill, e.target.value)
                                }
                                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value={0}>No Rating</option>
                                <option value={1}>1 - Poor</option>
                                <option value={2}>2 - Fair</option>
                                <option value={3}>3 - Good</option>
                                <option value={4}>4 - Very Good</option>
                                <option value={5}>5 - Excellent</option>
                              </select>
                            </div>
                          )
                        )}
                    </div>
                  </div>

                  {/* Technical Skills Ratings */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      Technical Skills Ratings
                    </h4>
                    <div className="space-y-3">
                      {editFormData.designation && editFormData.department ? (
                        getSkillsForEmployee(
                          editingEmployee
                        ).technicalSkills.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">
                              {skill}
                            </span>
                            <select
                              value={editFormData.skillRatings?.[skill] || 0}
                              onChange={(e) =>
                                handleSkillRatingChange(skill, e.target.value)
                              }
                              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                              <option value={0}>No Rating</option>
                              <option value={1}>1 - Poor</option>
                              <option value={2}>2 - Fair</option>
                              <option value={3}>3 - Good</option>
                              <option value={4}>4 - Very Good</option>
                              <option value={5}>5 - Excellent</option>
                            </select>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-sm">
                            Please select Designation and Department to view
                            technical skills
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEmployee}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                    }}
                    onMouseEnter={(e) =>
                      !saving &&
                      (e.target.style.background =
                        "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                    }
                    onMouseLeave={(e) =>
                      !saving &&
                      (e.target.style.background =
                        "linear-gradient(135deg, #ffb366, #ff8c42)")
                    }>
                    {saving ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
