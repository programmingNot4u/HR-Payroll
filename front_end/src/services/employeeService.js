// Employee Service - API-based data management
import authService from "./authService";

const API_BASE_URL = "http://localhost:8000/api/employees";

// Employee Service - API-based data management
const employeeService = {
  // Make authenticated API request
  async makeAuthenticatedRequest(endpoint, options = {}) {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}${endpoint}`,
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  // Get all employees with pagination and filtering
  getAllEmployees: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      // Add filter parameters
      if (filters.search) params.append("search", filters.search);
      if (filters.department && filters.department !== "All")
        params.append("department", filters.department);
      if (filters.designation && filters.designation !== "All")
        params.append("designation", filters.designation);
      if (filters.status && filters.status !== "All")
        params.append("status", filters.status);
      if (filters.level && filters.level !== "All")
        params.append("level", filters.level);
      if (filters.processExpertise && filters.processExpertise !== "All")
        params.append("process_expertise", filters.processExpertise);
      if (filters.machine && filters.machine !== "All")
        params.append("machine", filters.machine);

      const data = await employeeService.makeAuthenticatedRequest(
        `/?${params.toString()}`
      );
      return {
        employees: data.results || data,
        pagination: data.pagination || {
          current_page: page,
          page_size: pageSize,
          total_pages: 1,
          has_next: false,
          has_previous: false,
          start_index: 1,
          end_index: (data.results || data).length,
          count: (data.results || data).length,
        },
        filters_applied: data.filters_applied || {},
      };
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      return {
        employees: [],
        pagination: {
          current_page: 1,
          page_size: pageSize,
          total_pages: 1,
          has_next: false,
          has_previous: false,
          start_index: 0,
          end_index: 0,
          count: 0,
        },
        filters_applied: {},
      };
    }
  },

  // Get all employees for statistics (no pagination)
  getAllEmployeesForStats: async () => {
    try {
      const data = await employeeService.makeAuthenticatedRequest(
        "/all-for-stats/"
      );
      return data;
    } catch (error) {
      console.error("Failed to fetch all employees for stats:", error);
      return [];
    }
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    try {
      return await employeeService.makeAuthenticatedRequest(`/${id}/`);
    } catch (error) {
      console.error(`Failed to fetch employee ${id}:`, error);
      return null;
    }
  },

  // Search employees
  searchEmployees: async (searchData) => {
    try {
      const response = await employeeService.makeAuthenticatedRequest(
        "/search/",
        {
          method: "POST",
          body: JSON.stringify(searchData),
        }
      );
      return response;
    } catch (error) {
      console.error("Failed to search employees:", error);
      return [];
    }
  },

  // Filter employees by department
  getEmployeesByDepartment: async (department) => {
    try {
      const params = department === "All" ? "" : `?department=${department}`;
      const data = await employeeService.makeAuthenticatedRequest(`/${params}`);
      return data.results || data;
    } catch (error) {
      console.error("Failed to fetch employees by department:", error);
      return [];
    }
  },

  // Get departments (this should use organizational data service)
  getDepartments: async () => {
    try {
      const data = await employeeService.makeAuthenticatedRequest(
        "/organizational-data/"
      );
      return data.departments || [];
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      return [];
    }
  },

  // Add new employee
  addEmployee: async (employeeData) => {
    try {
      console.log("Sending employee data:", employeeData);

      // Check if there's a picture file that needs FormData
      const hasFile =
        employeeData.picture && employeeData.picture instanceof File;

      let requestBody;
      let contentType;

      if (hasFile) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Add all fields to FormData
        Object.keys(employeeData).forEach((key) => {
          if (employeeData[key] !== null && employeeData[key] !== undefined) {
            if (key === "picture" && employeeData[key] instanceof File) {
              console.log("Adding picture to FormData:", employeeData[key]);
              console.log("Picture type:", typeof employeeData[key]);
              console.log("Is File:", employeeData[key] instanceof File);
              formData.append(key, employeeData[key]);
            } else if (
              key === "children" ||
              key === "work_experience" ||
              key === "process_expertise" ||
              key === "salary_components" ||
              key === "present_address" ||
              key === "permanent_address" ||
              key === "process_efficiency" ||
              key === "nominee" ||
              key === "emergency_contact"
            ) {
              // Handle JSON fields - ensure they are properly stringified
              const value = employeeData[key];
              console.log(
                `Processing JSON field ${key}:`,
                value,
                "type:",
                typeof value
              );

              if (typeof value === "object" && value !== null) {
                const jsonString = JSON.stringify(value);
                console.log(`Stringifying ${key} to:`, jsonString);
                formData.append(key, jsonString);
              } else if (typeof value === "string") {
                // If it's already a string, try to parse and re-stringify to ensure it's valid JSON
                try {
                  const parsed = JSON.parse(value);
                  const jsonString = JSON.stringify(parsed);
                  console.log(`Re-stringifying ${key} to:`, jsonString);
                  formData.append(key, jsonString);
                } catch (e) {
                  // If it's not valid JSON, append as is
                  console.log(`Appending ${key} as string:`, value);
                  formData.append(key, value);
                }
              } else {
                console.log(`Appending ${key} as other type:`, value);
                formData.append(key, value);
              }
            } else {
              formData.append(key, employeeData[key]);
            }
          }
        });

        requestBody = formData;
        contentType = null; // Let browser set Content-Type with boundary
      } else {
        // Use JSON for non-file data
        requestBody = JSON.stringify(employeeData);
        contentType = "application/json";
      }

      const newEmployee = await employeeService.makeAuthenticatedRequest("/", {
        method: "POST",
        body: requestBody,
        contentType: contentType,
      });
      return newEmployee;
    } catch (error) {
      console.error("Failed to add employee:", error);

      // Enhanced error handling
      if (error.response) {
        const response = await error.response.json();
        console.error("API Error Response:", response);

        // Parse validation errors
        if (response && typeof response === "object") {
          const validationErrors = [];
          for (const [field, errors] of Object.entries(response)) {
            if (Array.isArray(errors)) {
              validationErrors.push(`${field}: ${errors.join(", ")}`);
            } else {
              validationErrors.push(`${field}: ${errors}`);
            }
          }
          if (validationErrors.length > 0) {
            throw new Error(
              `Validation errors:\n${validationErrors.join("\n")}`
            );
          }
        }

        throw new Error(
          response.detail || response.message || "Failed to create employee"
        );
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const updatedEmployee = await employeeService.makeAuthenticatedRequest(
        `/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify(employeeData),
        }
      );
      return updatedEmployee;
    } catch (error) {
      console.error(`Failed to update employee ${id}:`, error);
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      await employeeService.makeAuthenticatedRequest(`/${id}/`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete employee ${id}:`, error);
      throw error;
    }
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    try {
      return await employeeService.makeAuthenticatedRequest("/stats/");
    } catch (error) {
      console.error("Failed to fetch employee stats:", error);
      return {
        total_employees: 0,
        active_employees: 0,
        inactive_employees: 0,
        on_leave_employees: 0,
        terminated_employees: 0,
        departments: 0,
        designations: 0,
        workers: 0,
        staff: 0,
        salary_grades: 0,
        skill_metrics: 0,
        process_expertise: 0,
        department_breakdown: [],
      };
    }
  },

  // Get employee credentials (for HR staff)
  getEmployeeCredentials: async (employeeId) => {
    try {
      return await employeeService.makeAuthenticatedRequest(
        `/${employeeId}/credentials/`
      );
    } catch (error) {
      console.error(
        `Failed to fetch credentials for employee ${employeeId}:`,
        error
      );
      throw error;
    }
  },

  // Get employee dashboard data
  getEmployeeDashboardData: async () => {
    try {
      return await employeeService.makeAuthenticatedRequest("/dashboard/");
    } catch (error) {
      console.error("Failed to fetch employee dashboard data:", error);
      throw error;
    }
  },

  // Get organizational data
  getOrganizationalData: async () => {
    try {
      return await employeeService.makeAuthenticatedRequest(
        "/organizational-data/"
      );
    } catch (error) {
      console.error("Failed to fetch organizational data:", error);
      return {
        departments: [],
        designations: [],
        salary_grades: [],
        skill_metrics: [],
        process_expertise: [],
      };
    }
  },

  // Get recent employees
  getRecentEmployees: async () => {
    try {
      return await employeeService.makeAuthenticatedRequest("/recent/");
    } catch (error) {
      console.error("Failed to fetch recent employees:", error);
      return [];
    }
  },

  // Get employee activity log
  getEmployeeActivityLog: async (employeeId) => {
    try {
      return await employeeService.makeAuthenticatedRequest(
        `/${employeeId}/activity/`
      );
    } catch (error) {
      console.error(
        `Failed to fetch activity log for employee ${employeeId}:`,
        error
      );
      return [];
    }
  },

  // Get department employee count
  getDepartmentEmployeeCount: async () => {
    try {
      return await employeeService.makeAuthenticatedRequest(
        "/department-count/"
      );
    } catch (error) {
      console.error("Failed to fetch department employee count:", error);
      return [];
    }
  },
};

export default employeeService;
