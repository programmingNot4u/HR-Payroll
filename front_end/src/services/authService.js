// front_end/src/services/authService.js

const API_BASE_URL = "http://localhost:8000/api";

class AuthService {
  // Admin/HR Manager Login
  async adminLogin(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens
        localStorage.setItem("adminToken", data.access);
        localStorage.setItem("adminRefreshToken", data.refresh);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("loginType", "admin");

        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Employee Login
  async employeeLogin(employeeId, phone) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/employee-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id: employeeId, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens and user data
        localStorage.setItem("employeeToken", data.access);
        localStorage.setItem("employeeRefreshToken", data.refresh);
        localStorage.setItem("employeeUser", JSON.stringify(data.user));
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("loginType", "employee");

        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Employee login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Unified Login (for both HR and employees)
  async unifiedLogin(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/unified-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens based on login type
        if (data.user.login_type === "employee_portal") {
          // Employee Portal login (both Employee and HR Manager)
          localStorage.setItem("employeeToken", data.access);
          localStorage.setItem("employeeRefreshToken", data.refresh);
          localStorage.setItem("employeeUser", JSON.stringify(data.user));
          localStorage.setItem("userRole", data.user.role);
          localStorage.setItem("loginType", "employee");
        } else if (data.user.login_type === "hr_admin_portal") {
          // HR Admin Portal login
          localStorage.setItem("adminToken", data.access);
          localStorage.setItem("adminRefreshToken", data.refresh);
          localStorage.setItem("adminUser", JSON.stringify(data.user));
          localStorage.setItem("userRole", data.user.role);
          localStorage.setItem("loginType", "admin");
        }

        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Unified login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Get current user
  getCurrentUser() {
    const loginType = localStorage.getItem("loginType");
    if (loginType === "admin") {
      return JSON.parse(localStorage.getItem("adminUser") || "null");
    } else if (loginType === "employee") {
      return JSON.parse(localStorage.getItem("employeeUser") || "null");
    }
    return null;
  }

  // Get current token
  getCurrentToken() {
    const loginType = localStorage.getItem("loginType");
    if (loginType === "admin") {
      return localStorage.getItem("adminToken");
    } else if (loginType === "employee") {
      return localStorage.getItem("employeeToken");
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getCurrentToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Check if user is admin/HR/Manager level
  isAdmin() {
    const role = this.getUserRole();
    return [
      "super_admin",
      "hr_manager",
      "hr_staff",
      "department_head",
    ].includes(role);
  }

  // Check if user is employee
  isEmployee() {
    const role = this.getUserRole();
    return role === "employee";
  }

  // Check if user is HR level (can manage employees)
  isHR() {
    const role = this.getUserRole();
    return ["super_admin", "hr_manager", "hr_staff"].includes(role);
  }

  // Check if user is manager level or above
  isManagerOrAbove() {
    const role = this.getUserRole();
    return [
      "super_admin",
      "hr_manager",
      "hr_staff",
      "department_head",
    ].includes(role);
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
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        if (loginType === "admin") {
          localStorage.setItem("adminToken", data.access);
        } else {
          localStorage.setItem("employeeToken", data.access);
        }
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout();
      return false;
    }
  }

  // Change password
  async changePassword(oldPassword, newPassword, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getCurrentToken()}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          error: data.error || "Password change failed",
        };
      }
    } catch (error) {
      console.error("Password change error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Make authenticated API requests
  async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getCurrentToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Handle contentType parameter
    const contentType = options.contentType;
    delete options.contentType; // Remove from options to avoid conflicts

    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    };

    // Only set Content-Type if not using FormData
    if (contentType !== null) {
      defaultOptions.headers["Content-Type"] =
        contentType || "application/json";
    }

    const response = await fetch(url, { ...defaultOptions, ...options });

    // If token is expired, try to refresh
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the request with new token
        const newToken = this.getCurrentToken();
        const retryOptions = {
          ...defaultOptions,
          ...options,
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

    // Handle other error status codes
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = response;
      throw error;
    }

    return response;
  }
}

export default new AuthService();
