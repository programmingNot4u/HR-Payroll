// front_end/src/services/organizationalDataService.js

import authService from "./authService";

const API_BASE_URL = "http://localhost:8000/api";

class OrganizationalDataService {
  constructor() {
    // Initialize with empty data - will be loaded from API
    this.departments = [];
    this.designations = [];
    this.processExpertise = [];
    this.operations = [];
    this.machines = [];
    this.skillMetrics = [];
    this.salaryGrades = [];
    this.staffSalaryGrades = [];

    // Load data from API on initialization
    this.loadAllData();
  }

  // ===== API CALL METHODS =====

  async makeAuthenticatedRequest(endpoint, options = {}) {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}${endpoint}`,
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle different response types
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        // For DELETE operations and other non-JSON responses
        return { success: true };
      }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // ===== LOAD ALL DATA =====

  async loadAllData() {
    try {
      await Promise.all([
        this.loadDepartments(),
        this.loadDesignations(),
        this.loadSalaryGrades(),
        this.loadSkillMetrics(),
        this.loadProcessExpertise(),
        this.loadOperations(),
        this.loadMachines(),
      ]);

      console.log("All organizational data loaded successfully");
      // Dispatch event to notify components that data has been loaded
      // Event dispatch removed to prevent infinite loops
    } catch (error) {
      console.error("Failed to load organizational data:", error);
      throw error; // Re-throw the error so components can handle it
    }
  }

  // ===== DEPARTMENTS =====

  async loadDepartments() {
    try {
      const data = await this.makeAuthenticatedRequest("/departments/");
      this.departments = data.results || data;
      this.saveToLocalStorage("departments", this.departments);
    } catch (error) {
      console.error("Failed to load departments:", error);
      throw error; // Don't fallback to localStorage, let the error propagate
    }
  }

  async addDepartment(departmentData) {
    try {
      const newDepartment = await this.makeAuthenticatedRequest(
        "/departments/",
        {
          method: "POST",
          body: JSON.stringify(departmentData),
        }
      );

      this.departments.push(newDepartment);
      this.saveToLocalStorage("departments", this.departments);
      this.notifyDataChange();

      return newDepartment;
    } catch (error) {
      console.error("Failed to add department:", error);
      throw error;
    }
  }

  async updateDepartment(id, departmentData) {
    try {
      const updatedDepartment = await this.makeAuthenticatedRequest(
        `/departments/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify(departmentData),
        }
      );

      const index = this.departments.findIndex((dept) => dept.id === id);
      if (index !== -1) {
        this.departments[index] = updatedDepartment;
        this.saveToLocalStorage("departments", this.departments);
        this.notifyDataChange();
      }

      return updatedDepartment;
    } catch (error) {
      console.error("Failed to update department:", error);
      throw error;
    }
  }

  async deleteDepartment(id) {
    try {
      await this.makeAuthenticatedRequest(`/departments/${id}/`, {
        method: "DELETE",
      });

      this.departments = this.departments.filter((dept) => dept.id !== id);
      this.saveToLocalStorage("departments", this.departments);
      this.notifyDataChange();

      return true;
    } catch (error) {
      console.error("Failed to delete department:", error);
      throw error;
    }
  }

  // ===== DESIGNATIONS =====

  async loadDesignations() {
    try {
      const data = await this.makeAuthenticatedRequest("/designations/");
      this.designations = data.results || data;
      this.saveToLocalStorage("designations", this.designations);
    } catch (error) {
      console.error("Failed to load designations:", error);
      throw error;
    }
  }

  async addDesignation(designationData) {
    try {
      const newDesignation = await this.makeAuthenticatedRequest(
        "/designations/",
        {
          method: "POST",
          body: JSON.stringify(designationData),
        }
      );

      this.designations.push(newDesignation);
      this.saveToLocalStorage("designations", this.designations);
      this.notifyDataChange();

      return newDesignation;
    } catch (error) {
      console.error("Failed to add designation:", error);
      throw error;
    }
  }

  async updateDesignation(id, designationData) {
    try {
      const updatedDesignation = await this.makeAuthenticatedRequest(
        `/designations/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify(designationData),
        }
      );

      const index = this.designations.findIndex(
        (designation) => designation.id === id
      );
      if (index !== -1) {
        this.designations[index] = updatedDesignation;
        this.saveToLocalStorage("designations", this.designations);
        this.notifyDataChange();
      }

      return updatedDesignation;
    } catch (error) {
      console.error("Failed to update designation:", error);
      throw error;
    }
  }

  async deleteDesignation(id) {
    try {
      await this.makeAuthenticatedRequest(`/designations/${id}/`, {
        method: "DELETE",
      });

      this.designations = this.designations.filter(
        (designation) => designation.id !== id
      );
      this.saveToLocalStorage("designations", this.designations);
      this.notifyDataChange();

      return true;
    } catch (error) {
      console.error("Failed to delete designation:", error);
      throw error;
    }
  }

  // ===== SALARY GRADES =====

  async loadSalaryGrades() {
    try {
      const data = await this.makeAuthenticatedRequest("/salary-grades/");
      const allGrades = data.results || data;

      // Separate worker and staff grades
      this.salaryGrades = allGrades.filter(
        (grade) => grade.grade_type === "worker"
      );
      this.staffSalaryGrades = allGrades.filter(
        (grade) => grade.grade_type === "staff"
      );

      this.saveToLocalStorage("salaryGrades", this.salaryGrades);
      this.saveToLocalStorage("staffSalaryGrades", this.staffSalaryGrades);
    } catch (error) {
      console.error("Failed to load salary grades:", error);
      throw error;
    }
  }

  async addSalaryGrade(salaryGradeData) {
    try {
      const newSalaryGrade = await this.makeAuthenticatedRequest(
        "/salary-grades/",
        {
          method: "POST",
          body: JSON.stringify(salaryGradeData),
        }
      );

      if (salaryGradeData.grade_type === "worker") {
        this.salaryGrades.push(newSalaryGrade);
        this.saveToLocalStorage("salaryGrades", this.salaryGrades);
      } else {
        this.staffSalaryGrades.push(newSalaryGrade);
        this.saveToLocalStorage("staffSalaryGrades", this.staffSalaryGrades);
      }

      this.notifyDataChange();
      return newSalaryGrade;
    } catch (error) {
      console.error("Failed to add salary grade:", error);
      throw error;
    }
  }

  async updateSalaryGrade(id, salaryGradeData) {
    try {
      const updatedSalaryGrade = await this.makeAuthenticatedRequest(
        `/salary-grades/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify(salaryGradeData),
        }
      );

      // Update in appropriate array
      if (salaryGradeData.grade_type === "worker") {
        const index = this.salaryGrades.findIndex((grade) => grade.id === id);
        if (index !== -1) {
          this.salaryGrades[index] = updatedSalaryGrade;
          this.saveToLocalStorage("salaryGrades", this.salaryGrades);
        }
      } else {
        const index = this.staffSalaryGrades.findIndex(
          (grade) => grade.id === id
        );
        if (index !== -1) {
          this.staffSalaryGrades[index] = updatedSalaryGrade;
          this.saveToLocalStorage("staffSalaryGrades", this.staffSalaryGrades);
        }
      }

      this.notifyDataChange();
      return updatedSalaryGrade;
    } catch (error) {
      console.error("Failed to update salary grade:", error);
      throw error;
    }
  }

  async deleteSalaryGrade(id) {
    try {
      await this.makeAuthenticatedRequest(`/salary-grades/${id}/`, {
        method: "DELETE",
      });

      this.salaryGrades = this.salaryGrades.filter((grade) => grade.id !== id);
      this.staffSalaryGrades = this.staffSalaryGrades.filter(
        (grade) => grade.id !== id
      );

      this.saveToLocalStorage("salaryGrades", this.salaryGrades);
      this.saveToLocalStorage("staffSalaryGrades", this.staffSalaryGrades);
      this.notifyDataChange();

      return true;
    } catch (error) {
      console.error("Failed to delete salary grade:", error);
      throw error;
    }
  }

  // ===== SKILL METRICS =====

  async loadSkillMetrics() {
    try {
      const data = await this.makeAuthenticatedRequest("/skill-metrics/");
      this.skillMetrics = data.results || data;
      this.saveToLocalStorage("skillMetrics", this.skillMetrics);
    } catch (error) {
      console.error("Failed to load skill metrics:", error);
      throw error;
    }
  }

  async addSkillMetric(skillMetricData) {
    try {
      const newSkillMetric = await this.makeAuthenticatedRequest(
        "/skill-metrics/",
        {
          method: "POST",
          body: JSON.stringify(skillMetricData),
        }
      );

      this.skillMetrics.push(newSkillMetric);
      this.saveToLocalStorage("skillMetrics", this.skillMetrics);
      this.notifyDataChange();

      return newSkillMetric;
    } catch (error) {
      console.error("Failed to add skill metric:", error);
      throw error;
    }
  }

  async updateSkillMetric(id, skillMetricData) {
    try {
      const updatedSkillMetric = await this.makeAuthenticatedRequest(
        `/skill-metrics/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify(skillMetricData),
        }
      );

      const index = this.skillMetrics.findIndex((skill) => skill.id === id);
      if (index !== -1) {
        this.skillMetrics[index] = updatedSkillMetric;
        this.saveToLocalStorage("skillMetrics", this.skillMetrics);
        this.notifyDataChange();
      }

      return updatedSkillMetric;
    } catch (error) {
      console.error("Failed to update skill metric:", error);
      throw error;
    }
  }

  async deleteSkillMetric(id) {
    try {
      await this.makeAuthenticatedRequest(`/skill-metrics/${id}/`, {
        method: "DELETE",
      });

      this.skillMetrics = this.skillMetrics.filter((skill) => skill.id !== id);
      this.saveToLocalStorage("skillMetrics", this.skillMetrics);
      this.notifyDataChange();

      return true;
    } catch (error) {
      console.error("Failed to delete skill metric:", error);
      throw error;
    }
  }

  // ===== PROCESS EXPERTISE =====

  async loadProcessExpertise() {
    try {
      const data = await this.makeAuthenticatedRequest("/process-expertise/");
      this.processExpertise = data.results || data;
      this.saveToLocalStorage("processExpertise", this.processExpertise);

      // Load operations and machines separately
      await this.loadOperations();
      await this.loadMachines();
    } catch (error) {
      console.error("Failed to load process expertise:", error);
      throw error;
    }
  }

  // ===== OPERATIONS =====

  async loadOperations() {
    try {
      // Get operations directly from API
      const data = await this.makeAuthenticatedRequest("/operations/");
      console.log("Loaded operations from API:", data);
      this.operations = data;
      this.saveToLocalStorage("operations", this.operations);
      console.log("Operations saved to service:", this.operations);
    } catch (error) {
      console.error("Failed to load operations:", error);
      throw error;
    }
  }

  async addOperation(operationData) {
    try {
      const newOperation = await this.makeAuthenticatedRequest("/operations/", {
        method: "POST",
        body: JSON.stringify(operationData),
      });

      this.operations.push(newOperation);
      this.saveToLocalStorage("operations", this.operations);
      this.notifyDataChange();

      return newOperation;
    } catch (error) {
      console.error("Failed to add operation:", error);
      throw error;
    }
  }

  async updateOperation(id, operationData) {
    try {
      console.log("=== UPDATE OPERATION DEBUG ===");
      console.log("Updating operation with ID:", id);
      console.log("Operation data:", operationData);
      console.log("Making PUT request to:", `/operations/${id}/`);

      const updatedOperation = await this.makeAuthenticatedRequest(
        `/operations/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify(operationData),
        }
      );

      console.log("Updated operation response:", updatedOperation);
      const index = this.operations.findIndex((op) => op.id === id);
      if (index !== -1) {
        this.operations[index] = updatedOperation;
        this.saveToLocalStorage("operations", this.operations);
        this.notifyDataChange();
        console.log("Operation updated in local state");
      } else {
        console.log("Operation not found in local state, ID:", id);
        // If not found, add it to the list
        this.operations.push(updatedOperation);
        this.saveToLocalStorage("operations", this.operations);
        this.notifyDataChange();
        console.log("Operation added to local state");
      }

      return updatedOperation;
    } catch (error) {
      console.error("Failed to update operation:", error);
      console.error("Error details:", error.message);
      console.error("Error response:", error.response);
      throw error;
    }
  }

  async deleteOperation(operationName) {
    try {
      await this.makeAuthenticatedRequest(
        `/operations/${operationName}/delete/`,
        {
          method: "DELETE",
        }
      );

      this.operations = this.operations.filter(
        (op) => op.name !== operationName
      );
      this.saveToLocalStorage("operations", this.operations);
      this.notifyDataChange();

      return true;
    } catch (error) {
      console.error("Failed to delete operation:", error);
      throw error;
    }
  }

  // ===== MACHINES =====

  async loadMachines() {
    try {
      const data = await this.makeAuthenticatedRequest("/machines/");
      console.log("Loaded machines from API:", data);
      this.machines = data;
      this.saveToLocalStorage("machines", this.machines);
      console.log("Machines saved to service:", this.machines);
    } catch (error) {
      console.error("Failed to load machines:", error);
      throw error;
    }
  }

  async addMachine(machineData) {
    try {
      const newMachine = await this.makeAuthenticatedRequest("/machines/", {
        method: "POST",
        body: JSON.stringify(machineData),
      });

      this.machines.push(newMachine);
      this.saveToLocalStorage("machines", this.machines);
      this.notifyDataChange();

      return newMachine;
    } catch (error) {
      console.error("Failed to add machine:", error);
      throw error;
    }
  }

  async updateMachine(id, machineData) {
    try {
      console.log("=== UPDATE MACHINE DEBUG ===");
      console.log("Updating machine with ID:", id, "Data:", machineData);
      console.log("Making PUT request to:", `/machines/${id}/`);

      const updatedMachine = await this.makeAuthenticatedRequest(
        `/machines/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify(machineData),
        }
      );

      console.log("Updated machine response:", updatedMachine);
      const index = this.machines.findIndex((machine) => machine.id === id);
      if (index !== -1) {
        this.machines[index] = updatedMachine;
        this.saveToLocalStorage("machines", this.machines);
        this.notifyDataChange();
        console.log("Machine updated in local state");
      } else {
        console.log("Machine not found in local state, ID:", id);
        // If not found, add it to the list
        this.machines.push(updatedMachine);
        this.saveToLocalStorage("machines", this.machines);
        this.notifyDataChange();
        console.log("Machine added to local state");
      }

      return updatedMachine;
    } catch (error) {
      console.error("Failed to update machine:", error);
      console.error("Error details:", error.message);
      console.error("Error response:", error.response);
      throw error;
    }
  }

  async deleteMachine(machineName) {
    try {
      await this.makeAuthenticatedRequest(`/machines/${machineName}/delete/`, {
        method: "DELETE",
      });

      this.machines = this.machines.filter(
        (machine) => machine.name !== machineName
      );
      this.saveToLocalStorage("machines", this.machines);
      this.notifyDataChange();

      return true;
    } catch (error) {
      console.error("Failed to delete machine:", error);
      throw error;
    }
  }

  async addProcessExpertise(processExpertiseData) {
    try {
      const newProcessExpertise = await this.makeAuthenticatedRequest(
        "/process-expertise/",
        {
          method: "POST",
          body: JSON.stringify(processExpertiseData),
        }
      );

      this.processExpertise.push(newProcessExpertise);
      this.saveToLocalStorage("processExpertise", this.processExpertise);

      this.notifyDataChange();
      return newProcessExpertise;
    } catch (error) {
      console.error("Failed to add process expertise:", error);
      throw error;
    }
  }

  async updateProcessExpertise(id, processExpertiseData) {
    try {
      const updatedProcessExpertise = await this.makeAuthenticatedRequest(
        `/process-expertise/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify(processExpertiseData),
        }
      );

      const index = this.processExpertise.findIndex(
        (expertise) => expertise.id === id
      );
      if (index !== -1) {
        this.processExpertise[index] = updatedProcessExpertise;
        this.saveToLocalStorage("processExpertise", this.processExpertise);

        this.notifyDataChange();
      }

      return updatedProcessExpertise;
    } catch (error) {
      console.error("Failed to update process expertise:", error);
      throw error;
    }
  }

  async deleteProcessExpertise(id) {
    try {
      await this.makeAuthenticatedRequest(`/process-expertise/${id}/`, {
        method: "DELETE",
      });

      this.processExpertise = this.processExpertise.filter(
        (expertise) => expertise.id !== id
      );
      this.saveToLocalStorage("processExpertise", this.processExpertise);

      this.notifyDataChange();
      return true;
    } catch (error) {
      console.error("Failed to delete process expertise:", error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  extractUniqueOperations(processExpertise) {
    const operations = processExpertise
      .map((pe) => pe.operation)
      .filter(Boolean);
    return [...new Set(operations)].map((operation, index) => ({
      id: index + 1,
      name: operation,
      isActive: true,
    }));
  }

  extractUniqueMachines(processExpertise) {
    const machines = processExpertise.map((pe) => pe.machine).filter(Boolean);
    return [...new Set(machines)].map((machine, index) => ({
      id: index + 1,
      name: machine,
      isActive: true,
    }));
  }

  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(`organizational_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }

  loadFromLocalStorage(key) {
    try {
      const data = localStorage.getItem(`organizational_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      return null;
    }
  }

  notifyDataChange() {
    // Event dispatch removed to prevent infinite loops
  }

  // ===== GETTER METHODS (Keep existing methods for backward compatibility) =====

  getDepartments() {
    return this.departments.filter((dept) => dept.is_active !== false);
  }

  getDesignations() {
    return this.designations.filter(
      (designation) => designation.is_active !== false
    );
  }

  getDepartmentNames() {
    const names = this.getDepartments().map((dept) => dept.name);
    return [...new Set(names)];
  }

  getDesignationNames() {
    const names = this.getDesignations().map((designation) => designation.name);
    return [...new Set(names)];
  }

  getProcessExpertise() {
    return this.processExpertise.filter(
      (expertise) => expertise.is_active !== false
    );
  }

  getOperations() {
    console.log("Getting operations from service:", this.operations);
    const filtered = this.operations.filter(
      (operation) => operation.is_active !== false
    );
    console.log("Filtered operations:", filtered);
    return filtered;
  }

  getMachines() {
    console.log("Getting machines from service:", this.machines);
    const filtered = this.machines.filter(
      (machine) => machine.is_active !== false
    );
    console.log("Filtered machines:", filtered);
    return filtered;
  }

  // Force refresh Operations and Machines from API
  async refreshOperationsAndMachines() {
    try {
      console.log("Force refreshing Operations and Machines from API");
      // Clear localStorage to force fresh data
      localStorage.removeItem("organizational_operations");
      localStorage.removeItem("organizational_machines");
      await this.loadOperations();
      await this.loadMachines();
      console.log("Operations and Machines refreshed from API");
    } catch (error) {
      console.error("Failed to refresh Operations and Machines:", error);
      throw error;
    }
  }

  getUniqueProcessExpertiseOperations() {
    return this.operations.map((op) => op.name);
  }

  getUniqueProcessExpertiseMachines() {
    return this.machines.map((machine) => machine.name);
  }

  getSkillMetrics() {
    return this.skillMetrics.filter((skill) => skill.is_active !== false);
  }

  getAllSalaryGrades() {
    return this.salaryGrades.filter((grade) => grade.is_active !== false);
  }

  getStaffSalaryGrades() {
    return this.staffSalaryGrades.filter((grade) => grade.is_active !== false);
  }

  // ===== LEGACY METHODS (for backward compatibility) =====

  handleStorageChange(event) {
    if (event.key && event.key.startsWith("organizational_")) {
      this.loadAllData();
    }
  }
}

export default new OrganizationalDataService();
