// Asset Service - Centralized asset management with Django API integration
class AssetService {
  constructor() {
    this.baseURL = "http://localhost:8000/api/assets";
    this.employees = [];
  }

  // Set employees data (called from component)
  setEmployees(employeesData) {
    this.employees = employeesData;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    // Get token based on login type
    const loginType = localStorage.getItem("loginType");
    const token =
      loginType === "admin"
        ? localStorage.getItem("adminToken")
        : localStorage.getItem("employeeToken");

    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  // Helper method to make authenticated requests with automatic token refresh
  async makeAuthenticatedRequest(url, options = {}) {
    const defaultOptions = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, defaultOptions);

    // If token is expired, try to refresh
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the request with new token
        const newToken = this.getCurrentToken();
        const retryOptions = {
          ...defaultOptions,
          headers: {
            ...defaultOptions.headers,
            Authorization: `Bearer ${newToken}`,
          },
        };
        return fetch(url, retryOptions);
      } else {
        // Refresh failed, redirect to login
        this.logout();
        window.location.reload();
        throw new Error("Authentication failed");
      }
    }

    return response;
  }

  // Get current token
  getCurrentToken() {
    const loginType = localStorage.getItem("loginType");
    return loginType === "admin"
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("employeeToken");
  }

  // Refresh token
  async refreshToken() {
    const loginType = localStorage.getItem("loginType");
    const refreshToken =
      loginType === "admin"
        ? localStorage.getItem("adminRefreshToken")
        : localStorage.getItem("employeeRefreshToken");

    if (!refreshToken) {
      this.logout();
      return false;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/refresh-token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update stored token
        if (loginType === "admin") {
          localStorage.setItem("adminToken", data.access);
        } else {
          localStorage.setItem("employeeToken", data.access);
        }
        return true;
      } else {
        console.error("Token refresh failed:", data);
        this.logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout();
      return false;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("employeeRefreshToken");
    localStorage.removeItem("employeeUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loginType");
    localStorage.removeItem("selectedPage");
  }

  // Get asset choices (categories, statuses, etc.)
  async getAssetChoices() {
    try {
      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/choices/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching asset choices:", error);
      throw error;
    }
  }

  // Get complete asset history including assignments, returns, and maintenance
  async getAssetHistory(assetId) {
    try {
      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/${assetId}/history/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching asset history:", error);
      throw error;
    }
  }

  // Get all assets
  async getAllAssets() {
    try {
      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  }

  // Get available assets (not assigned)
  async getAvailableAssets() {
    try {
      const response = await fetch(`${this.baseURL}/assets/available/`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching available assets:", error);
      throw error;
    }
  }

  // Get asset by ID
  async getAssetById(id) {
    try {
      const response = await fetch(`${this.baseURL}/assets/${id}/`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching asset:", error);
      throw error;
    }
  }

  // Add new asset
  async addAsset(assetData) {
    try {
      const response = await fetch(`${this.baseURL}/assets/`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(assetData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating asset:", error);
      throw error;
    }
  }

  // Update asset
  async updateAsset(assetId, updates) {
    try {
      const response = await fetch(`${this.baseURL}/assets/${assetId}/`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating asset:", error);
      throw error;
    }
  }

  // Delete asset
  async deleteAsset(assetId) {
    try {
      const response = await fetch(`${this.baseURL}/assets/${assetId}/`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return true;
    } catch (error) {
      console.error("Error deleting asset:", error);
      throw error;
    }
  }

  // Get assignment history
  async getAssignmentHistory() {
    try {
      const response = await fetch(`${this.baseURL}/assignments/`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Handle different response formats
      let assignments = [];
      if (Array.isArray(data)) {
        assignments = data;
      } else if (data && Array.isArray(data.results)) {
        assignments = data.results;
      } else if (data && Array.isArray(data.assignments)) {
        assignments = data.assignments;
      } else {
        console.warn("Unexpected assignment history response format:", data);
        return [];
      }

      return assignments.map((assignment) => ({
        id: `ASG-${assignment.id}`,
        assetId: assignment.asset,
        asset: assignment.asset_name,
        employee: assignment.employee_name,
        employee_id: assignment.employee_id,
        assignedDate: assignment.assignment_date,
        assignedCondition: assignment.assigned_condition || "Good",
        expectedReturn: assignment.expected_return_date,
        status: assignment.is_active ? "Active" : "Returned",
        assignedBy: assignment.assigned_by,
        reason: assignment.assignment_reason,
        notes: assignment.assignment_notes,
      }));
    } catch (error) {
      console.error("Error fetching assignment history:", error);
      throw error;
    }
  }

  // Get all assignments (including historical)
  async getAllAssignments() {
    return this.getAssignmentHistory();
  }

  // Assign asset to employee
  async assignAsset(assetId, employeeId, employeeName, assignmentData) {
    try {
      console.log("Assigning asset:", {
        assetId,
        employeeId,
        employeeName,
        assignmentData,
      });

      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/${assetId}/assign/`,
        {
          method: "POST",
          body: JSON.stringify({
            employee_id: employeeId,
            employee_name: employeeName,
            assignment_date: assignmentData.assignmentDate,
            expected_return_date: assignmentData.expectedReturnDate,
            assignment_reason: assignmentData.assignmentReason,
            assigned_by: assignmentData.assignedBy,
            assigned_condition: assignmentData.assignedCondition || "Good",
            assignment_notes: assignmentData.notes,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Assignment error response:", errorData);
        throw new Error(
          errorData.detail ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error assigning asset:", error);
      throw error;
    }
  }

  // Update assignment
  async updateAssignment(assignmentId, updateData) {
    try {
      const response = await fetch(
        `${this.baseURL}/assignments/${assignmentId}/`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(updateData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  }

  // Unassign asset
  async unassignAsset(assetId) {
    try {
      const response = await fetch(
        `${this.baseURL}/assets/${assetId}/unassign/`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error unassigning asset:", error);
      throw error;
    }
  }

  // Process asset return
  async processReturn(assignmentId, returnData) {
    try {
      // Find the assignment to get the actual asset ID
      const assignments = await this.getAssignmentHistory();
      const assignment = assignments.find(
        (assignment) => assignment.id === assignmentId
      );

      if (!assignment) {
        throw new Error(`Assignment with ID ${assignmentId} not found`);
      }

      const assetId = assignment.assetId;

      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/${assetId}/return_asset/`,
        {
          method: "POST",
          body: JSON.stringify({
            return_date: returnData.returnDate,
            return_condition: returnData.returnCondition,
            return_reason: returnData.returnReason,
            received_by: returnData.receivedBy,
            return_notes: returnData.returnNotes,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error processing return:", error);
      throw error;
    }
  }

  // Update asset status for maintenance
  async updateAssetStatusForMaintenance(assetId, status) {
    try {
      const response = await fetch(`${this.baseURL}/assets/${assetId}/`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating asset status:", error);
      throw error;
    }
  }

  // Add maintenance record to asset
  async addMaintenanceRecord(assetId, maintenanceData) {
    try {
      const requestData = {
        scheduled_date: maintenanceData.scheduledDate,
        completed_date: maintenanceData.completedDate,
        maintenance_provider: maintenanceData.maintenanceProvider,
        status: maintenanceData.status || "Pending",
        description: maintenanceData.description,
        cost: maintenanceData.cost,
        notes: maintenanceData.notes,
      };

      console.log("Sending maintenance data:", requestData);

      const response = await fetch(
        `${this.baseURL}/assets/${assetId}/maintenance/`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding maintenance record:", error);
      throw error;
    }
  }

  // Update maintenance record
  async updateMaintenanceRecord(assetId, maintenanceId, updates) {
    try {
      console.log("Updating maintenance record:", maintenanceId, updates);

      const response = await fetch(
        `${this.baseURL}/maintenance/${maintenanceId}/`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(updates),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update maintenance error:", errorData);
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating maintenance record:", error);
      throw error;
    }
  }

  // Delete maintenance record
  async deleteMaintenanceRecord(assetId, maintenanceId) {
    try {
      const response = await fetch(
        `${this.baseURL}/maintenance/${maintenanceId}/`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }
      return true;
    } catch (error) {
      console.error("Error deleting maintenance record:", error);
      throw error;
    }
  }

  // Get maintenance history for asset
  async getMaintenanceHistory(assetId) {
    try {
      const response = await fetch(
        `${this.baseURL}/assets/${assetId}/history/`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.maintenance || [];
    } catch (error) {
      console.error("Error fetching maintenance history:", error);
      throw error;
    }
  }

  // Get all maintenance history
  async getAllMaintenanceHistory() {
    try {
      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/maintenance_history/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching all maintenance history:", error);
      throw error;
    }
  }

  // Get assets that need maintenance
  async getMaintenanceDueAssets() {
    try {
      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/maintenance_due/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching maintenance due assets:", error);
      throw error;
    }
  }

  // Search assets by ID or name
  async searchAssets(query) {
    try {
      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/search/?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error searching assets:", error);
      throw error;
    }
  }

  // Get asset statistics
  async getAssetStatistics() {
    try {
      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/statistics/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching asset statistics:", error);
      throw error;
    }
  }

  // Get paginated assets
  async getPaginatedAssets(page = 1, pageSize = 10, filters = {}) {
    try {
      // Filter out undefined values to avoid API errors
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      );

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...cleanFilters,
      });

      console.log("API Request URL:", `${this.baseURL}/assets/?${params}`);
      console.log("Clean filters:", cleanFilters);

      const response = await this.makeAuthenticatedRequest(
        `${this.baseURL}/assets/?${params}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching paginated assets:", error);
      throw error;
    }
  }

  // Get return history
  async getReturnHistory() {
    try {
      const response = await fetch(`${this.baseURL}/returns/`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Handle different response formats
      let returns = [];
      if (Array.isArray(data)) {
        returns = data;
      } else if (data && Array.isArray(data.results)) {
        returns = data.results;
      } else if (data && Array.isArray(data.returns)) {
        returns = data.returns;
      } else {
        console.warn("Unexpected return history response format:", data);
        return [];
      }

      return returns.map((returnItem) => ({
        id: `RET-${returnItem.id}`,
        asset: returnItem.asset_name,
        employee: returnItem.employee_name,
        employee_id: returnItem.employee_id,
        assignedDate: returnItem.assigned_date,
        assignedCondition: "Good", // Default value
        returnDate: returnItem.return_date,
        returnCondition: returnItem.return_condition,
        returnReason: returnItem.return_reason,
        receivedBy: returnItem.received_by,
        assetValue: returnItem.asset_value,
        returnProcessedDate: returnItem.created_at,
        returnNotes: returnItem.return_notes,
        duration: returnItem.duration,
      }));
    } catch (error) {
      console.error("Error fetching return history:", error);
      throw error;
    }
  }
}

// Export singleton instance
const assetService = new AssetService();
export default assetService;
