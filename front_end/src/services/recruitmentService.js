import authService from "./authService";

const recruitmentService = {
  // Base URL for recruitment API
  baseURL: "/api/recruitment",

  // Make authenticated request
  makeAuthenticatedRequest: async (endpoint, options = {}) => {
    try {
      // Get token based on login type
      const loginType = localStorage.getItem("loginType");
      let token;

      if (loginType === "admin") {
        token = localStorage.getItem("adminToken");
      } else if (loginType === "employee") {
        token = localStorage.getItem("employeeToken");
      } else {
        // Fallback to access_token for backward compatibility
        token = localStorage.getItem("access_token");
      }

      console.log("Authentication debug:", {
        loginType,
        hasAdminToken: !!localStorage.getItem("adminToken"),
        hasEmployeeToken: !!localStorage.getItem("employeeToken"),
        hasAccessToken: !!localStorage.getItem("access_token"),
        selectedToken: token ? "Found" : "Not found",
      });

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${recruitmentService.baseURL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          const refreshed = await authService.refreshToken();
          if (refreshed) {
            // Retry the request with new token
            const loginType = localStorage.getItem("loginType");
            let newToken;

            if (loginType === "admin") {
              newToken = localStorage.getItem("adminToken");
            } else if (loginType === "employee") {
              newToken = localStorage.getItem("employeeToken");
            } else {
              newToken = localStorage.getItem("access_token");
            }

            const retryResponse = await fetch(
              `${recruitmentService.baseURL}${endpoint}`,
              {
                ...options,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${newToken}`,
                  ...options.headers,
                },
              }
            );
            return retryResponse.json();
          } else {
            throw new Error("Authentication failed");
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  // Job Opening APIs
  jobOpenings: {
    // Get all job openings with pagination and filtering
    getAll: async (page = 1, pageSize = 10, filters = {}) => {
      try {
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

        const data = await recruitmentService.makeAuthenticatedRequest(
          `/job-openings/?${params.toString()}`
        );
        return {
          jobOpenings: data.results || data,
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
        console.error("Failed to fetch job openings:", error);
        return {
          jobOpenings: [],
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

    // Get job opening by ID
    getById: async (id) => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          `/job-openings/${id}/`
        );
        return data;
      } catch (error) {
        console.error("Failed to fetch job opening:", error);
        throw error;
      }
    },

    // Create new job opening
    create: async (jobOpeningData) => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          "/job-openings/",
          {
            method: "POST",
            body: JSON.stringify(jobOpeningData),
          }
        );
        return data;
      } catch (error) {
        console.error("Failed to create job opening:", error);
        throw error;
      }
    },

    // Update job opening
    update: async (id, jobOpeningData) => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          `/job-openings/${id}/`,
          {
            method: "PUT",
            body: JSON.stringify(jobOpeningData),
          }
        );
        return data;
      } catch (error) {
        console.error("Failed to update job opening:", error);
        throw error;
      }
    },

    // Delete job opening
    delete: async (id) => {
      try {
        await recruitmentService.makeAuthenticatedRequest(
          `/job-openings/${id}/`,
          {
            method: "DELETE",
          }
        );
        return true;
      } catch (error) {
        console.error("Failed to delete job opening:", error);
        throw error;
      }
    },

    // Update job opening status
    updateStatus: async (id, status) => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          `/job-openings/${id}/update-status/`,
          {
            method: "POST",
            body: JSON.stringify({ status }),
          }
        );
        return data;
      } catch (error) {
        console.error("Failed to update job opening status:", error);
        throw error;
      }
    },

    // Get job opening statistics
    getStatistics: async () => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          "/job-openings/statistics/"
        );
        return data;
      } catch (error) {
        console.error("Failed to fetch job opening statistics:", error);
        throw error;
      }
    },
  },

  // Candidate APIs
  candidates: {
    // Get all candidates with pagination and filtering
    getAll: async (page = 1, pageSize = 10, filters = {}) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          page_size: pageSize.toString(),
        });

        // Add filter parameters
        if (filters.search) params.append("search", filters.search);
        if (filters.jobId) params.append("job_id", filters.jobId);
        if (filters.candidateId)
          params.append("candidate_id", filters.candidateId);
        if (filters.department && filters.department !== "All")
          params.append("department", filters.department);
        if (filters.designation && filters.designation !== "All")
          params.append("designation", filters.designation);
        if (filters.status && filters.status !== "All")
          params.append("status", filters.status);

        const data = await recruitmentService.makeAuthenticatedRequest(
          `/candidates/?${params.toString()}`
        );
        return {
          candidates: data.results || data,
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
        console.error("Failed to fetch candidates:", error);
        return {
          candidates: [],
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

    // Get candidate by ID
    getById: async (id) => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          `/candidates/${id}/`
        );
        return data;
      } catch (error) {
        console.error("Failed to fetch candidate:", error);
        throw error;
      }
    },

    // Create new candidate
    create: async (candidateData) => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          "/candidates/",
          {
            method: "POST",
            body: JSON.stringify(candidateData),
          }
        );
        return data;
      } catch (error) {
        console.error("Failed to create candidate:", error);
        throw error;
      }
    },

    // Update candidate
    update: async (id, candidateData) => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          `/candidates/${id}/`,
          {
            method: "PUT",
            body: JSON.stringify(candidateData),
          }
        );
        return data;
      } catch (error) {
        console.error("Failed to update candidate:", error);
        throw error;
      }
    },

    // Delete candidate
    delete: async (id) => {
      try {
        await recruitmentService.makeAuthenticatedRequest(
          `/candidates/${id}/`,
          {
            method: "DELETE",
          }
        );
        return true;
      } catch (error) {
        console.error("Failed to delete candidate:", error);
        throw error;
      }
    },

    // Update candidate status
    updateStatus: async (id, status) => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          `/candidates/${id}/update-status/`,
          {
            method: "POST",
            body: JSON.stringify({ status }),
          }
        );
        return data;
      } catch (error) {
        console.error("Failed to update candidate status:", error);
        throw error;
      }
    },

    // Get candidate statistics
    getStatistics: async () => {
      try {
        const data = await recruitmentService.makeAuthenticatedRequest(
          "/candidates/statistics/"
        );
        return data;
      } catch (error) {
        console.error("Failed to fetch candidate statistics:", error);
        throw error;
      }
    },
  },
};

export default recruitmentService;
