// KPI Service - API-based KPI data management
import authService from "./authService";

const API_BASE_URL = "http://localhost:8000/api/kpi";

const kpiService = {
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
      console.error(`KPI API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  // Get all KPI records with filtering
  getAllKPIs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.employee_id)
        params.append("employee_id", filters.employee_id);
      if (filters.department) params.append("department", filters.department);
      if (filters.designation)
        params.append("designation", filters.designation);
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);

      const queryString = params.toString();
      const endpoint = queryString
        ? `/employees/?${queryString}`
        : "/employees/";

      return await kpiService.makeAuthenticatedRequest(endpoint);
    } catch (error) {
      console.error("Failed to fetch KPIs:", error);
      return [];
    }
  },

  // Get active staff employees for KPI management (with pagination)
  getActiveStaffEmployees: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page);
      if (filters.page_size) params.append("page_size", filters.page_size);
      if (filters.search) params.append("search", filters.search);
      if (filters.department) params.append("department", filters.department);
      if (filters.designation)
        params.append("designation", filters.designation);
      if (filters.year) params.append("year", filters.year);

      const queryString = params.toString();
      const endpoint = queryString
        ? `/active-staff/?${queryString}`
        : "/active-staff/";

      return await kpiService.makeAuthenticatedRequest(endpoint);
    } catch (error) {
      console.error("Failed to fetch active staff employees:", error);
      return {
        employees: [],
        pagination: {
          current_page: 1,
          page_size: 20,
          total_count: 0,
          total_pages: 0,
          has_next: false,
          has_previous: false,
        },
        filters_applied: {},
      };
    }
  },

  // Get active employees with their KPI data
  getActiveEmployees: async () => {
    try {
      return await kpiService.makeAuthenticatedRequest(
        "/employees/active_employees/"
      );
    } catch (error) {
      console.error("Failed to fetch active employees:", error);
      return [];
    }
  },

  // Get KPI by ID
  getKPIById: async (id) => {
    try {
      return await kpiService.makeAuthenticatedRequest(`/employees/${id}/`);
    } catch (error) {
      console.error(`Failed to fetch KPI ${id}:`, error);
      return null;
    }
  },

  // Create new KPI record
  createKPI: async (kpiData) => {
    try {
      return await kpiService.makeAuthenticatedRequest("/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kpiData),
      });
    } catch (error) {
      console.error("Failed to create KPI:", error);
      throw error;
    }
  },

  // Update KPI record
  updateKPI: async (id, kpiData) => {
    try {
      console.log("Updating KPI with ID:", id);
      console.log("KPI data:", kpiData);
      const response = await kpiService.makeAuthenticatedRequest(
        `/employees/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(kpiData),
        }
      );
      console.log("KPI update response:", response);
      return response;
    } catch (error) {
      console.error(`Failed to update KPI ${id}:`, error);
      throw error;
    }
  },

  // Delete KPI record
  deleteKPI: async (id) => {
    try {
      await kpiService.makeAuthenticatedRequest(`/employees/${id}/`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete KPI ${id}:`, error);
      throw error;
    }
  },

  // Get employee's KPI ratings
  getEmployeeKPIRatings: async (employeeId) => {
    try {
      return await kpiService.makeAuthenticatedRequest(
        `/employees/${employeeId}/ratings/`
      );
    } catch (error) {
      console.error(
        `Failed to fetch KPI ratings for employee ${employeeId}:`,
        error
      );
      return [];
    }
  },

  // Get employee's latest KPI
  getEmployeeLatestKPI: async (employeeId) => {
    try {
      return await kpiService.makeAuthenticatedRequest(
        `/employees/${employeeId}/ratings/latest/`
      );
    } catch (error) {
      console.error(
        `Failed to fetch latest KPI for employee ${employeeId}:`,
        error
      );
      return null;
    }
  },

  // Bulk update KPI ratings
  bulkUpdateKPIs: async (updates, assessmentYear, assessmentMonth) => {
    try {
      return await kpiService.makeAuthenticatedRequest("/bulk-update/", {
        method: "POST",
        body: JSON.stringify({
          updates,
          assessment_year: assessmentYear,
          assessment_month: assessmentMonth,
        }),
      });
    } catch (error) {
      console.error("Failed to bulk update KPIs:", error);
      throw error;
    }
  },

  // Bulk create KPI records
  bulkCreateKPIs: async (kpiData) => {
    try {
      return await kpiService.makeAuthenticatedRequest("/bulk-create/", {
        method: "POST",
        body: JSON.stringify({ kpi_data: kpiData }),
      });
    } catch (error) {
      console.error("Failed to bulk create KPIs:", error);
      throw error;
    }
  },

  // Get skill metrics
  getSkillMetrics: async () => {
    try {
      // Use the employees app endpoint for skill metrics
      const response = await authService.makeAuthenticatedRequest(
        "http://localhost:8000/api/skill-metrics/",
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch skill metrics:", error);
      return [];
    }
  },

  // Get soft skills
  getSoftSkills: async () => {
    try {
      const response = await authService.makeAuthenticatedRequest(
        "http://localhost:8000/api/skill-metrics/?category=soft",
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch soft skills:", error);
      return [];
    }
  },

  // Get technical skills
  getTechnicalSkills: async (designation = null, department = null) => {
    try {
      const params = new URLSearchParams();
      params.append("category", "technical");
      if (designation) params.append("designation", designation);
      if (department) params.append("department", department);

      const queryString = params.toString();
      const endpoint = `http://localhost:8000/api/skill-metrics/?${queryString}`;

      const response = await authService.makeAuthenticatedRequest(endpoint, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch technical skills:", error);
      return [];
    }
  },

  // Get KPI dashboard data
  getKPIDashboard: async () => {
    try {
      return await kpiService.makeAuthenticatedRequest("/dashboard/");
    } catch (error) {
      console.error("Failed to fetch KPI dashboard:", error);
      return {
        total_employees: 0,
        total_assessments: 0,
        average_score: 0,
        high_performers: 0,
        low_performers: 0,
        department_stats: {},
        designation_stats: {},
        monthly_trends: {},
      };
    }
  },

  // Get KPI statistics
  getKPIStatistics: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append("department", filters.department);
      if (filters.designation)
        params.append("designation", filters.designation);
      if (filters.year) params.append("year", filters.year);

      const queryString = params.toString();
      const endpoint = queryString
        ? `/statistics/?${queryString}`
        : "/statistics/";

      return await kpiService.makeAuthenticatedRequest(endpoint);
    } catch (error) {
      console.error("Failed to fetch KPI statistics:", error);
      return {
        statistics: {},
        score_distribution: {},
        filters: {},
      };
    }
  },

  // Export KPI data
  exportKPIs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append("department", filters.department);
      if (filters.designation)
        params.append("designation", filters.designation);
      if (filters.year) params.append("year", filters.year);

      const queryString = params.toString();
      const endpoint = queryString ? `/export/?${queryString}` : "/export/";

      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}${endpoint}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kpi_data_${filters.year || new Date().getFullYear()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return true;
    } catch (error) {
      console.error("Failed to export KPIs:", error);
      throw error;
    }
  },

  // Import KPI data
  importKPIs: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}/import/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to import KPIs:", error);
      throw error;
    }
  },

  // Get KPI templates
  getKPITemplates: async () => {
    try {
      return await kpiService.makeAuthenticatedRequest("/templates/");
    } catch (error) {
      console.error("Failed to fetch KPI templates:", error);
      return [];
    }
  },

  // Create KPI template
  createKPITemplate: async (templateData) => {
    try {
      return await kpiService.makeAuthenticatedRequest("/templates/", {
        method: "POST",
        body: JSON.stringify(templateData),
      });
    } catch (error) {
      console.error("Failed to create KPI template:", error);
      throw error;
    }
  },

  // Update KPI template
  updateKPITemplate: async (id, templateData) => {
    try {
      return await kpiService.makeAuthenticatedRequest(`/templates/${id}/`, {
        method: "PUT",
        body: JSON.stringify(templateData),
      });
    } catch (error) {
      console.error(`Failed to update KPI template ${id}:`, error);
      throw error;
    }
  },

  // Delete KPI template
  deleteKPITemplate: async (id) => {
    try {
      await kpiService.makeAuthenticatedRequest(`/templates/${id}/`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete KPI template ${id}:`, error);
      throw error;
    }
  },

  // Get KPI assessment history
  getKPIAssessmentHistory: async (kpiId = null) => {
    try {
      const endpoint = kpiId ? `/history/?kpi=${kpiId}` : "/history/";
      return await kpiService.makeAuthenticatedRequest(endpoint);
    } catch (error) {
      console.error("Failed to fetch KPI assessment history:", error);
      return [];
    }
  },

  // Get skills for a specific employee (soft skills + designation-based technical skills)
  getEmployeeSkills: async (employeeId) => {
    try {
      return await kpiService.makeAuthenticatedRequest(
        `/employees/${employeeId}/skills/`
      );
    } catch (error) {
      console.error(
        `Failed to fetch skills for employee ${employeeId}:`,
        error
      );
      return {
        employee_id: employeeId,
        employee_name: "Unknown",
        designation: null,
        department: null,
        skills: [],
        soft_skills_count: 0,
        technical_skills_count: 0,
        total_skills_count: 0,
      };
    }
  },
};

export default kpiService;
