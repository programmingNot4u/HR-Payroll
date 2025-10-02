import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/attendance";

// Create axios instance with default config
const attendanceAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
attendanceAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== DAILY ATTENDANCE API =====

export const dailyAttendanceAPI = {
  // Get daily attendance summary for a specific date
  getDailySummary: async (date) => {
    try {
      const response = await attendanceAPI.get(
        `/daily-attendance/summary/?date=${date}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching daily attendance summary:", error);
      throw error;
    }
  },

  // Get all daily attendance records with filters
  getAll: async (params = {}) => {
    try {
      const response = await attendanceAPI.get("/daily-attendance/", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching daily attendance records:", error);
      throw error;
    }
  },

  // Get single attendance record
  getById: async (id) => {
    try {
      const response = await attendanceAPI.get(`/daily-attendance/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance record:", error);
      throw error;
    }
  },

  // Create new attendance record
  create: async (data) => {
    try {
      const response = await attendanceAPI.post("/daily-attendance/", data);
      return response.data;
    } catch (error) {
      console.error("Error creating attendance record:", error);
      throw error;
    }
  },

  // Update attendance record
  update: async (id, data) => {
    try {
      const response = await attendanceAPI.put(
        `/daily-attendance/${id}/`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating attendance record:", error);
      throw error;
    }
  },

  // Delete attendance record
  delete: async (id) => {
    try {
      const response = await attendanceAPI.delete(`/daily-attendance/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      throw error;
    }
  },
};

// ===== TIMESHEET API =====

export const timesheetAPI = {
  // Get timesheet data for a specific month
  getTimesheetData: async (month, year) => {
    try {
      const response = await attendanceAPI.get(
        `/timesheet/?month=${month}&year=${year}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
      throw error;
    }
  },
};

// ===== LEAVE MANAGEMENT API =====

export const leaveAPI = {
  // Leave Policies
  getPolicies: async () => {
    try {
      const response = await attendanceAPI.get("/leave-policies/");
      return response.data;
    } catch (error) {
      console.error("Error fetching leave policies:", error);
      throw error;
    }
  },

  createPolicy: async (data) => {
    try {
      const response = await attendanceAPI.post("/leave-policies/", data);
      return response.data;
    } catch (error) {
      console.error("Error creating leave policy:", error);
      throw error;
    }
  },

  updatePolicy: async (id, data) => {
    try {
      const response = await attendanceAPI.put(`/leave-policies/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating leave policy:", error);
      throw error;
    }
  },

  deletePolicy: async (id) => {
    try {
      const response = await attendanceAPI.delete(`/leave-policies/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error deleting leave policy:", error);
      throw error;
    }
  },

  // Leave Balances
  getBalances: async (params = {}) => {
    try {
      const response = await attendanceAPI.get("/leave-balances/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching leave balances:", error);
      throw error;
    }
  },

  // Leave Requests
  getRequests: async (params = {}) => {
    try {
      const response = await attendanceAPI.get("/leave-requests/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      throw error;
    }
  },

  createRequest: async (data) => {
    try {
      const response = await attendanceAPI.post("/leave-requests/", data);
      return response.data;
    } catch (error) {
      console.error("Error creating leave request:", error);
      throw error;
    }
  },

  getRequestById: async (id) => {
    try {
      const response = await attendanceAPI.get(`/leave-requests/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leave request:", error);
      throw error;
    }
  },

  updateRequest: async (id, data) => {
    try {
      const response = await attendanceAPI.put(`/leave-requests/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating leave request:", error);
      throw error;
    }
  },

  approveRequest: async (id) => {
    try {
      const response = await attendanceAPI.post(
        `/leave-requests/${id}/approve/`
      );
      return response.data;
    } catch (error) {
      console.error("Error approving leave request:", error);
      throw error;
    }
  },

  rejectRequest: async (id, rejectionReason = "") => {
    try {
      const response = await attendanceAPI.post(
        `/leave-requests/${id}/reject/`,
        {
          rejection_reason: rejectionReason,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      throw error;
    }
  },
};

// ===== HOLIDAYS API =====

export const holidaysAPI = {
  // Get all holidays
  getAll: async (params = {}) => {
    try {
      const response = await attendanceAPI.get("/holidays/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching holidays:", error);
      throw error;
    }
  },

  // Get single holiday
  getById: async (id) => {
    try {
      const response = await attendanceAPI.get(`/holidays/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching holiday:", error);
      throw error;
    }
  },

  // Create new holiday
  create: async (data) => {
    try {
      const response = await attendanceAPI.post("/holidays/", data);
      return response.data;
    } catch (error) {
      console.error("Error creating holiday:", error);
      throw error;
    }
  },

  // Update holiday
  update: async (id, data) => {
    try {
      const response = await attendanceAPI.put(`/holidays/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating holiday:", error);
      throw error;
    }
  },

  // Delete holiday
  delete: async (id) => {
    try {
      const response = await attendanceAPI.delete(`/holidays/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error deleting holiday:", error);
      throw error;
    }
  },
};

// ===== ATTENDANCE MACHINES API =====

export const machinesAPI = {
  // Get all machines
  getAll: async (params = {}) => {
    try {
      const response = await attendanceAPI.get("/machines/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching machines:", error);
      throw error;
    }
  },

  // Get single machine
  getById: async (id) => {
    try {
      const response = await attendanceAPI.get(`/machines/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching machine:", error);
      throw error;
    }
  },

  // Create new machine
  create: async (data) => {
    try {
      const response = await attendanceAPI.post("/machines/", data);
      return response.data;
    } catch (error) {
      console.error("Error creating machine:", error);
      throw error;
    }
  },

  // Update machine
  update: async (id, data) => {
    try {
      const response = await attendanceAPI.put(`/machines/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating machine:", error);
      throw error;
    }
  },

  // Delete machine
  delete: async (id) => {
    try {
      const response = await attendanceAPI.delete(`/machines/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error deleting machine:", error);
      throw error;
    }
  },

  // Test machine connection
  testConnection: async (machineId) => {
    try {
      const response = await attendanceAPI.post(`/machines/${machineId}/test/`);
      return response.data;
    } catch (error) {
      console.error("Error testing machine connection:", error);
      throw error;
    }
  },
};

// ===== SYSTEM STATUS API =====

export const systemAPI = {
  // Get system status
  getStatus: async () => {
    try {
      const response = await attendanceAPI.get("/system-status/");
      return response.data;
    } catch (error) {
      console.error("Error fetching system status:", error);
      throw error;
    }
  },

  // Get attendance statistics
  getStatistics: async () => {
    try {
      const response = await attendanceAPI.get("/statistics/");
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  },

  // Get attendance settings
  getSettings: async () => {
    try {
      const response = await attendanceAPI.get("/settings/");
      return response.data;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  },

  // Update attendance settings
  updateSettings: async (data) => {
    try {
      const response = await attendanceAPI.put("/settings/", data);
      return response.data;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  },
};

// ===== WEBSOCKET CONNECTION =====

export class AttendanceWebSocket {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
  }

  connect() {
    try {
      this.ws = new WebSocket("ws://localhost:8765");

      this.ws.onopen = () => {
        console.log("Connected to attendance WebSocket");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket connection closed");
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }
  }

  handleMessage(data) {
    // Dispatch custom events for different message types
    switch (data.type) {
      case "scan_received":
        window.dispatchEvent(
          new CustomEvent("attendanceScanReceived", { detail: data })
        );
        break;
      case "attendance_updated":
        window.dispatchEvent(
          new CustomEvent("attendanceUpdated", { detail: data })
        );
        break;
      case "machine_connected":
        window.dispatchEvent(
          new CustomEvent("machineConnected", { detail: data })
        );
        break;
      case "machine_disconnected":
        window.dispatchEvent(
          new CustomEvent("machineDisconnected", { detail: data })
        );
        break;
      case "system_status":
        window.dispatchEvent(
          new CustomEvent("systemStatusUpdate", { detail: data })
        );
        break;
      default:
        console.log("Unknown WebSocket message type:", data.type);
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default {
  dailyAttendanceAPI,
  timesheetAPI,
  leaveAPI,
  holidaysAPI,
  machinesAPI,
  systemAPI,
  AttendanceWebSocket,
};

