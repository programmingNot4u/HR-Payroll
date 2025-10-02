import { useCallback, useEffect, useMemo, useState } from "react";
import employeeService from "../../services/employeeService";
import organizationalDataService from "../../services/organizationalDataService";

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [designationFilter, setDesignationFilter] = useState("All");
  const [levelOfWorkFilter, setLevelOfWorkFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [processExpertiseFilter, setProcessExpertiseFilter] = useState("All");
  const [machineExpertiseFilter, setMachineExpertiseFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [backendPagination, setBackendPagination] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);

  // Organizational data from service
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [operations, setOperations] = useState([]);
  const [machines, setMachines] = useState([]);

  // Load employees function with backend pagination and filtering
  const loadEmployees = useCallback(
    async (page = currentPage, pageSize = itemsPerPage, filters = {}) => {
      try {
        setLoading(true);

        // Build filters object
        const filterParams = {
          search: searchTerm,
          department: departmentFilter,
          designation: designationFilter,
          status: statusFilter,
          level: levelOfWorkFilter,
          processExpertise: processExpertiseFilter,
          machine: machineExpertiseFilter,
          ...filters,
        };

        const response = await employeeService.getAllEmployees(
          page,
          pageSize,
          filterParams
        );
        console.log(
          "EmployeeDashboard - Loaded employees:",
          response.employees
        );
        console.log(
          "EmployeeDashboard - Pagination info:",
          response.pagination
        );
        console.log(
          "EmployeeDashboard - Filters applied:",
          response.filters_applied
        );

        setEmployees(response.employees);
        setBackendPagination(response.pagination);
        setTotalPages(response.pagination.total_pages);
      } catch (error) {
        console.error("Error loading employees:", error);
        // Set empty array if service fails
        setEmployees([]);
        setBackendPagination(null);
        setTotalPages(1);

        // Check if it's an authentication error
        if (error.message && error.message.includes("authentication")) {
          console.error("Authentication error - user may need to login again");
          // You could redirect to login here if needed
        }
      } finally {
        setLoading(false);
      }
    },
    [
      currentPage,
      itemsPerPage,
      searchTerm,
      departmentFilter,
      designationFilter,
      statusFilter,
      levelOfWorkFilter,
      processExpertiseFilter,
      machineExpertiseFilter,
    ]
  );

  // Load all employees for statistics (separate from pagination)
  const loadAllEmployeesForStats = async () => {
    try {
      const allEmployeesData = await employeeService.getAllEmployeesForStats();
      console.log(
        "EmployeeDashboard - Loaded all employees for stats:",
        allEmployeesData.length
      );
      setAllEmployees(allEmployeesData);
    } catch (error) {
      console.error("Error loading all employees for stats:", error);
      setAllEmployees([]);
    }
  };

  // Load organizational data function
  const loadOrganizationalData = () => {
    try {
      const deptData = organizationalDataService.getDepartments();
      const desigData = organizationalDataService.getDesignations();
      const opsData = organizationalDataService.getOperations();
      const machData = organizationalDataService.getMachines();

      setDepartments(deptData);
      setDesignations(desigData);
      setOperations(opsData.map((op) => op.name));
      setMachines(machData.map((machine) => machine.name));

      console.log("EmployeeDashboard - Loaded organizational data:", {
        departments: deptData.length,
        designations: desigData.length,
        operations: opsData.length,
        machines: machData.length,
      });
    } catch (error) {
      console.error("Error loading organizational data:", error);
    }
  };

  // Load employees and organizational data on component mount
  useEffect(() => {
    loadEmployees();
    loadAllEmployeesForStats();
    loadOrganizationalData();
  }, [loadEmployees]);

  // Event handlers
  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      loadEmployees();
      loadOrganizationalData(); // Also reload organizational data
    }
  }, [loadEmployees]);

  const handleEmployeeAdded = useCallback(() => {
    console.log("Employee added event received, refreshing dashboard");
    loadEmployees();
  }, [loadEmployees]);

  // Listen for organizational data changes and employee events
  useEffect(() => {
    const handleOrganizationalDataChange = () => {
      console.log("Organizational data changed, refreshing dashboard data");
      loadOrganizationalData();
    };

    // Listen for storage changes (organizational data updates)
    const handleStorageChange = (event) => {
      if (event.key === "organizationalData") {
        loadOrganizationalData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("employeeAdded", handleEmployeeAdded);
    window.addEventListener(
      "organizationalDataChanged",
      handleOrganizationalDataChange
    );
    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("employeeAdded", handleEmployeeAdded);
      window.removeEventListener(
        "organizationalDataChanged",
        handleOrganizationalDataChange
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [handleVisibilityChange, handleEmployeeAdded]);

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    if (!Array.isArray(allEmployees)) return {};

    // Debug: Log all unique status values
    const uniqueStatuses = [...new Set(allEmployees.map((emp) => emp.status))];
    console.log("Employee Dashboard - Unique status values:", uniqueStatuses);
    console.log(
      "Employee Dashboard - Sample employee data:",
      allEmployees.slice(0, 2)
    );

    const total = allEmployees.length; // Total enlisted employees

    // More flexible status matching - check for various possible status values
    const active = allEmployees.filter((emp) => {
      const status = (emp.status || "").toLowerCase();
      return (
        status === "active" ||
        status === "1" ||
        status === "true" ||
        status === "enabled"
      );
    }).length;

    const inactive = allEmployees.filter((emp) => {
      const status = (emp.status || "").toLowerCase();
      return (
        status === "inactive" ||
        status === "0" ||
        status === "false" ||
        status === "disabled"
      );
    }).length;

    const newJoined = allEmployees.filter((emp) => {
      const status = (emp.status || "").toLowerCase();
      return (
        status === "new joined" || status === "newjoined" || status === "new"
      );
    }).length;

    const resigned = allEmployees.filter((emp) => {
      const status = (emp.status || "").toLowerCase();
      return status === "resigned" || status === "resign";
    }).length;

    const terminated = allEmployees.filter((emp) => {
      const status = (emp.status || "").toLowerCase();
      return status === "terminated" || status === "terminate";
    }).length;

    // Get only active employees for Worker/Staff calculations
    const activeEmployees = allEmployees.filter((emp) => {
      const status = (emp.status || "").toLowerCase();
      return (
        status === "active" ||
        status === "1" ||
        status === "true" ||
        status === "enabled"
      );
    });

    // Department breakdown with Worker/Staff breakdown (based on active employees only)
    const departmentBreakdown = activeEmployees.reduce((acc, emp) => {
      const deptName =
        emp.department_name || emp.department || "Unknown Department";
      if (!acc[deptName]) {
        acc[deptName] = { total: 0, workers: 0, staff: 0 };
      }
      acc[deptName].total += 1;
      const levelOfWork = (
        emp.level_of_work ||
        emp.levelOfWork ||
        ""
      ).toLowerCase();
      if (levelOfWork === "worker") {
        acc[deptName].workers += 1;
      } else if (levelOfWork === "staff") {
        acc[deptName].staff += 1;
      }
      return acc;
    }, {});

    // Level of work breakdown (based on active employees only)
    const workers = activeEmployees.filter((emp) => {
      const levelOfWork = (
        emp.level_of_work ||
        emp.levelOfWork ||
        ""
      ).toLowerCase();
      return levelOfWork === "worker";
    }).length;
    const staff = activeEmployees.filter((emp) => {
      const levelOfWork = (
        emp.level_of_work ||
        emp.levelOfWork ||
        ""
      ).toLowerCase();
      return levelOfWork === "staff";
    }).length;

    // Salary statistics (based on all employees)
    const validSalaries = allEmployees
      .map((emp) => {
        // Try to get salary from grossSalary first, then salary, then 0
        const salaryValue =
          emp.gross_salary || emp.grossSalary || emp.salary || 0;
        const salary = parseFloat(salaryValue);

        // Log suspicious salary values for debugging
        if (salary > 100000) {
          console.warn(
            `High salary detected for ${emp.name}: ${salary} (original: ${salaryValue})`
          );
        }

        return salary;
      })
      .filter((salary) => !isNaN(salary) && salary > 0 && salary <= 200000); // Filter out invalid salaries (max 200K - reasonable upper limit)

    const totalSalary = validSalaries.reduce((sum, salary) => sum + salary, 0);
    const avgSalary =
      validSalaries.length > 0
        ? Math.round(totalSalary / validSalaries.length)
        : 0;

    // Log summary for debugging
    if (validSalaries.length > 0) {
      console.log(
        `Salary calculation: ${
          validSalaries.length
        } valid salaries, total=${totalSalary.toLocaleString()}, avg=${avgSalary.toLocaleString()}`
      );
    }

    // Recent joiners (last 1 month and active)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const recentJoiners = activeEmployees.filter((emp) => {
      const joiningDate =
        emp.dateOfJoining || emp.joiningDate || emp.date_of_joining;
      if (!joiningDate) return false;
      try {
        return new Date(joiningDate) >= oneMonthAgo;
      } catch {
        console.warn("Invalid joining date for employee:", emp.id, joiningDate);
        return false;
      }
    }).length;

    return {
      total,
      active,
      inactive,
      newJoined,
      resigned,
      terminated,
      departmentBreakdown,
      workers,
      staff,
      totalSalary,
      avgSalary,
      recentJoiners,
    };
  }, [allEmployees]);

  // Use employees directly since backend handles filtering
  const filteredEmployees = employees;

  // Use employees directly since backend handles pagination
  const paginatedEmployees = employees;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    departmentFilter,
    designationFilter,
    levelOfWorkFilter,
    statusFilter,
    processExpertiseFilter,
    machineExpertiseFilter,
    searchTerm,
  ]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadEmployees(page, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    loadEmployees(1, newItemsPerPage);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
    loadEmployees(1, itemsPerPage);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("All");
    setDesignationFilter("All");
    setLevelOfWorkFilter("All");
    setStatusFilter("All");
    setProcessExpertiseFilter("All");
    setMachineExpertiseFilter("All");
    setCurrentPage(1);
    loadEmployees(1, itemsPerPage);
  };

  // Handle view details - redirect to employee details page
  const handleViewDetails = (employeeId) => {
    // Store the selected employee ID in localStorage for the details page to use
    localStorage.setItem("selectedEmployeeId", employeeId);
    // Dispatch custom event to navigate to Employee Details
    const event = new CustomEvent("navigateTo", { detail: "Employee Details" });
    window.dispatchEvent(event);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
      case "active":
        return "bg-green-100 text-green-800";
      case "InActive":
      case "inactive":
        return "bg-red-100 text-red-800";
      case "New Joined":
        return "bg-blue-100 text-blue-800";
      case "Resigned":
        return "bg-yellow-100 text-yellow-800";
      case "Terminated":
        return "bg-red-100 text-red-800";
      case "On Probation":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
          <div className="flex items-center space-x-2 mt-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  const isAuthenticated =
    localStorage.getItem("adminToken") || localStorage.getItem("employeeToken");

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Authentication Required!</strong> Please log in to view
                employee data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Remove the early return for empty employees - show full dashboard instead

  return (
    <div className="space-y-6">
      <style jsx>{`
        .soft-red-bg {
          background-color: oklch(80.8% 0.114 19.571);
        }
      `}</style>
      <div>
        <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
        <p className="text-sm text-gray-500">
          Comprehensive employee management and analytics
        </p>
      </div>

      {/* Empty State Message */}
      {employees.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Welcome to your Employee Dashboard!</strong> This
                dashboard will show comprehensive statistics and employee
                management tools once you add employees to the system.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards and Department Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistics Cards */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-medium mb-4">Employee Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Enlisted</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.workers}
              </div>
              <div className="text-sm text-gray-600">Workers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.staff}
              </div>
              <div className="text-sm text-gray-600">Staff</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.recentJoiners}
              </div>
              <div className="text-sm text-gray-600">New Joiners (1M)</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {stats.inactive}
              </div>
              <div className="text-sm text-gray-600">Inactive</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {stats.avgSalary > 0
                  ? `৳${stats.avgSalary.toLocaleString()}`
                  : "No salary data"}
              </div>
              <div className="text-sm text-gray-600">Average Salary</div>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-medium mb-4">
            Department Distribution (Active Employees)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">
                    Worker
                  </th>
                  <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">
                    Staff
                  </th>
                  <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.departmentBreakdown).map(
                  ([dept, counts]) => (
                    <tr
                      key={dept}
                      className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-sm font-medium text-gray-900">
                        {dept}
                      </td>
                      <td className="py-3 px-3 text-center text-sm text-gray-600">
                        {counts.workers}
                      </td>
                      <td className="py-3 px-3 text-center text-sm text-gray-600">
                        {counts.staff}
                      </td>
                      <td className="py-3 px-3 text-center text-sm font-semibold text-gray-900">
                        {counts.total}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="py-3 px-3 text-sm font-bold text-gray-900">
                    Total (Active)
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-bold text-gray-900">
                    {stats.workers}
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-bold text-gray-900">
                    {stats.staff}
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-bold text-gray-900">
                    {stats.active}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* Dashboard Actions */}
      <section className="rounded border border-gray-200 bg-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Search & Filter Employees</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleFilterChange}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2 disabled:opacity-50">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                />
              </svg>
              <span>Apply Filters</span>
            </button>
            <button
              onClick={() => {
                clearFilters();
                loadAllEmployeesForStats();
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
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
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by ID, Name, Email
            </label>
            <input
              type="text"
              placeholder="EMP001, Ahmed Khan, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="All">All</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation
            </label>
            <select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="All">All</option>
              {designations.map((designation) => (
                <option key={designation.id} value={designation.name}>
                  {designation.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level of Work
            </label>
            <select
              value={levelOfWorkFilter}
              onChange={(e) => setLevelOfWorkFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="All">All</option>
              <option value="worker">Worker</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="All">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operations
            </label>
            <select
              value={processExpertiseFilter}
              onChange={(e) => setProcessExpertiseFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="All">All</option>
              {operations.map((operation) => (
                <option key={operation} value={operation}>
                  {operation}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Machine Expertise
            </label>
            <select
              value={machineExpertiseFilter}
              onChange={(e) => setMachineExpertiseFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="All">All</option>
              {machines.map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setDepartmentFilter("All");
                setDesignationFilter("All");
                setLevelOfWorkFilter("All");
                setStatusFilter("All");
                setProcessExpertiseFilter("All");
                setMachineExpertiseFilter("All");
                setSearchTerm("");
              }}
              className="flex-1 h-10 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              Clear All
            </button>
            <button
              onClick={() => setStatusFilter("Active")}
              className="flex-1 h-10 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
              Active Only
            </button>
          </div>
        </div>
      </section>

      {/* Employee Table */}
      <section className="rounded border border-gray-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Employee List</h2>
              <p className="text-sm text-gray-500">
                {backendPagination
                  ? `Showing ${backendPagination.start_index} to ${backendPagination.end_index} of ${backendPagination.count} employees`
                  : `Showing ${employees.length} employees`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Process Expertise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Machine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.employee_id || employee.id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.full_name || employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.designation_name || employee.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.department_name || employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.level_of_work || employee.levelOfWork}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.isArray(
                      employee.process_expertise || employee.processExpertise
                    ) &&
                    (employee.process_expertise || employee.processExpertise)
                      .length > 0
                      ? (
                          employee.process_expertise ||
                          employee.processExpertise
                        )
                          .map(
                            (exp) =>
                              exp.operation?.name || exp.operation || "N/A"
                          )
                          .join(", ")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.isArray(
                      employee.process_expertise || employee.processExpertise
                    ) &&
                    (employee.process_expertise || employee.processExpertise)
                      .length > 0
                      ? (
                          employee.process_expertise ||
                          employee.processExpertise
                        )
                          .map(
                            (exp) => exp.machine?.name || exp.machine || "N/A"
                          )
                          .join(", ")
                      : employee.machine?.name || employee.machine || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        employee.status
                      )}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(employee.id)}
                        className="text-blue-600 hover:text-blue-700">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && employees.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Employees Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first employee to the system.
            </p>
            <button
              onClick={() => {
                const event = new CustomEvent("navigateTo", {
                  detail: "Add Employee",
                });
                window.dispatchEvent(event);
              }}
              className="px-4 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-2 mx-auto">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Add First Employee</span>
            </button>
          </div>
        )}

        {filteredEmployees.length === 0 && employees.length > 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-500">
              No employees found matching your filters.
            </div>
            <button
              onClick={() => {
                setDepartmentFilter("All");
                setDesignationFilter("All");
                setLevelOfWorkFilter("All");
                setStatusFilter("All");
                setSearchTerm("");
              }}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {employees.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  First
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>

                {/* Page Numbers */}
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
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium border-t border-b border-gray-300 ${
                        currentPage === pageNum
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}>
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
