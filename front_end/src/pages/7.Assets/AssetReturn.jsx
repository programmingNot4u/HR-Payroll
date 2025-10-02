import { useEffect, useRef, useState } from "react";
import assetService from "../../services/assetService";
import employeeService from "../../services/employeeService";
import {
  formatDateToDDMMYYYY,
  getCurrentDateYYYYMMDD,
} from "../../utils/dateUtils";

const AssetReturn = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnCondition, setReturnCondition] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [employeeAssignments, setEmployeeAssignments] = useState([]);
  const [recentReturns, setRecentReturns] = useState([]);
  const searchRef = useRef(null);

  // Load employees from employee service
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await employeeService.getAllEmployees();
        // Extract employees array from response object
        const employeesArray = response.employees || [];
        setEmployees(employeesArray);
      } catch (error) {
        console.error("Error loading employees:", error);
        setEmployees([]);
      }
    };

    loadEmployees();
  }, []);

  // Load all assignments
  useEffect(() => {
    const loadAllAssignments = async () => {
      try {
        const assignments = await assetService.getAssignmentHistory();
        setAllAssignments(assignments);
      } catch (error) {
        console.error("Error loading all assignments:", error);
        setAllAssignments([]);
      }
    };

    loadAllAssignments();
  }, []);

  // Set default return date to today
  useEffect(() => {
    setReturnDate(getCurrentDateYYYYMMDD());
  }, []);

  // Load return history from asset service
  useEffect(() => {
    const loadReturnHistory = async () => {
      try {
        const returns = await assetService.getReturnHistory();
        console.log("Loaded return history:", returns);
        setRecentReturns(returns);
      } catch (error) {
        console.error("Error loading return history:", error);
        setRecentReturns([]);
      }
    };

    loadReturnHistory();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load employee assignments when employee is selected
  useEffect(() => {
    const loadEmployeeAssignments = async () => {
      if (selectedEmployee) {
        try {
          const assignments = await assetService.getAssignmentHistory();
          const employeeAssignments = assignments.filter(
            (assignment) => assignment.employee_id === selectedEmployee
          );
          setEmployeeAssignments(employeeAssignments);
        } catch (error) {
          console.error("Error loading employee assignments:", error);
          setEmployeeAssignments([]);
        }
      } else {
        setEmployeeAssignments([]);
      }
    };

    loadEmployeeAssignments();
  }, [selectedEmployee]);

  // Filter employees based on search term
  const filteredEmployees = (employees || []).filter((emp) => {
    if (!emp || typeof emp !== "object") return false;

    const searchTerm = employeeSearchTerm.toLowerCase();

    // Try different possible ID field names
    const empId = emp.employee_id || emp.id || emp.emp_id || "";
    const empName =
      emp.full_name || emp.name || emp.first_name + " " + emp.last_name || "";
    const empDept = emp.department_name || emp.department || "";

    return (
      (empId && empId.toString().toLowerCase().includes(searchTerm)) ||
      (empName && empName.toString().toLowerCase().includes(searchTerm)) ||
      (empDept && empDept.toString().toLowerCase().includes(searchTerm))
    );
  });

  // Handle employee search input
  const handleEmployeeSearch = (value) => {
    setEmployeeSearchTerm(value);
    setShowSuggestions(value.length > 0);
    if (value === "") {
      setSelectedEmployee("");
      setSelectedAssignment("");
    }
  };

  // Handle employee selection from suggestions
  const handleEmployeeSelect = (employee) => {
    const empId = employee.employee_id || employee.id || employee.emp_id || "";
    const empName =
      employee.full_name ||
      employee.name ||
      employee.first_name + " " + employee.last_name ||
      "";
    const empDept = employee.department_name || employee.department || "";

    setSelectedEmployee(empId);
    setEmployeeSearchTerm(`${empId} - ${empName} (${empDept})`);
    setShowSuggestions(false);
    setSelectedAssignment(""); // Reset assignment selection
  };

  // Clear employee selection
  const clearEmployeeSelection = () => {
    setSelectedEmployee("");
    setEmployeeSearchTerm("");
    setShowSuggestions(false);
    setSelectedAssignment("");
    setEmployeeAssignments([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAssignment) {
      alert("Please select an assignment to return");
      return;
    }

    try {
      // Create return data
      const returnData = {
        returnDate: returnDate, // Send date in YYYY-MM-DD format (from HTML date input)
        returnCondition,
        receivedBy,
        returnReason: "", // Add empty return reason
        returnNotes: "", // Add empty return notes
      };

      // Process the return using the asset service
      await assetService.processReturn(selectedAssignment, returnData);

      // Show success message
      const assignment = employeeAssignments.find(
        (a) => a.id === selectedAssignment
      );
      alert(
        `Asset "${assignment?.asset}" has been successfully returned by ${assignment?.employee}`
      );

      // Reload all assignments and return history to reflect the return
      const assignments = await assetService.getAssignmentHistory();
      setAllAssignments(assignments);

      // Also update employee assignments if an employee is selected
      if (selectedEmployee) {
        const updatedEmployeeAssignments = assignments.filter(
          (assignment) => assignment.employee_id === selectedEmployee
        );
        setEmployeeAssignments(updatedEmployeeAssignments);
      }

      // Reload return history
      const returns = await assetService.getReturnHistory();
      setRecentReturns(returns);

      // Reset form
      setSelectedAssignment("");
      setReturnDate("");
      setReturnCondition("");
      setReceivedBy("");
    } catch (error) {
      console.error("Error processing return:", error);
      alert(`Error processing return: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Returned":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Good":
        return "text-green-600";
      case "Need Maintenance":
        return "text-orange-600";
      case "Lost":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const selectedAssignmentData = employeeAssignments.find(
    (assignment) => assignment.id === selectedAssignment
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Return</h1>
        <p className="text-sm text-gray-500">
          Process asset returns from employees
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Return Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Process Asset Return</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee *
              </label>
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search by ID, name, or department..."
                  value={employeeSearchTerm}
                  onChange={(e) => handleEmployeeSearch(e.target.value)}
                  onFocus={() =>
                    setShowSuggestions(employeeSearchTerm.length > 0)
                  }
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {selectedEmployee && (
                  <button
                    type="button"
                    onClick={clearEmployeeSelection}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-4 h-4"
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
                )}

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredEmployees.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredEmployees.map((emp) => {
                      const empId =
                        emp.employee_id || emp.id || emp.emp_id || "";
                      const empName =
                        emp.full_name ||
                        emp.name ||
                        emp.first_name + " " + emp.last_name ||
                        "";
                      const empDept =
                        emp.department_name || emp.department || "";

                      return (
                        <div
                          key={empId}
                          onClick={() => handleEmployeeSelect(emp)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                          <div className="font-medium text-gray-900">
                            {empId} - {empName}
                          </div>
                          <div className="text-sm text-gray-500">{empDept}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* No results message */}
                {showSuggestions &&
                  filteredEmployees.length === 0 &&
                  employeeSearchTerm.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No employees found matching "{employeeSearchTerm}"
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {selectedEmployee && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Assignment *
                </label>
                <select
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Choose an assignment...</option>
                  {employeeAssignments.map((assignment) => {
                    console.log("Assignment in dropdown:", assignment);
                    const formatDate = (dateStr) => {
                      if (!dateStr) return "N/A";
                      if (
                        dateStr.includes("/") &&
                        dateStr.split("/")[0].length <= 2
                      )
                        return dateStr;
                      if (dateStr.includes("-")) {
                        const [year, month, day] = dateStr.split("-");
                        return `${day}/${month}/${year}`;
                      }
                      if (
                        dateStr.includes("/") &&
                        dateStr.split("/")[0].length > 2
                      ) {
                        const [month, day, year] = dateStr.split("/");
                        return `${day}/${month}/${year}`;
                      }
                      return formatDateToDDMMYYYY(dateStr);
                    };
                    return (
                      <option key={assignment.id} value={assignment.id}>
                        {assignment.asset} -{" "}
                        {formatDate(assignment.assignedDate)}
                      </option>
                    );
                  })}
                </select>
                {employeeAssignments.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    No active assignments found for this employee.
                  </p>
                )}
              </div>
            )}

            {selectedAssignmentData && (
              <div className="p-4 bg-gray-50 rounded border">
                <h3 className="font-medium text-gray-900 mb-2">
                  Assignment Details
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Asset:</span>
                    <span className="ml-2 font-medium">
                      {selectedAssignmentData.asset}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Employee:</span>
                    <span className="ml-2 font-medium">
                      {selectedAssignmentData.employee}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Assigned Date:</span>
                    <span className="ml-2 font-medium">
                      {selectedAssignmentData.assignedDate
                        ? (() => {
                            const dateStr = selectedAssignmentData.assignedDate;
                            if (
                              dateStr.includes("/") &&
                              dateStr.split("/")[0].length <= 2
                            )
                              return dateStr;
                            if (dateStr.includes("-")) {
                              const [year, month, day] = dateStr.split("-");
                              return `${day}/${month}/${year}`;
                            }
                            if (
                              dateStr.includes("/") &&
                              dateStr.split("/")[0].length > 2
                            ) {
                              const [month, day, year] = dateStr.split("/");
                              return `${day}/${month}/${year}`;
                            }
                            return formatDateToDDMMYYYY(dateStr);
                          })()
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Assigned By:</span>
                    <span className="ml-2 font-medium">
                      {selectedAssignmentData.assignedBy || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedAssignmentData && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Date
                </label>
                <input
                  type="text"
                  value={
                    selectedAssignmentData.assignedDate
                      ? (() => {
                          // Handle different date formats and convert to DD/MM/YYYY
                          const dateStr = selectedAssignmentData.assignedDate;
                          if (!dateStr) return "N/A";

                          // If already in DD/MM/YYYY format, return as is
                          if (
                            dateStr.includes("/") &&
                            dateStr.split("/")[0].length <= 2
                          ) {
                            return dateStr;
                          }

                          // If in YYYY-MM-DD format, convert to DD/MM/YYYY
                          if (dateStr.includes("-")) {
                            const [year, month, day] = dateStr.split("-");
                            return `${day}/${month}/${year}`;
                          }

                          // If in MM/DD/YYYY format, convert to DD/MM/YYYY
                          if (
                            dateStr.includes("/") &&
                            dateStr.split("/")[0].length > 2
                          ) {
                            const [month, day, year] = dateStr.split("/");
                            return `${day}/${month}/${year}`;
                          }

                          // Fallback to formatDateToDDMMYYYY
                          return formatDateToDDMMYYYY(dateStr);
                        })()
                      : "N/A"
                  }
                  readOnly
                  className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-50 text-gray-600"
                  placeholder="Will be filled automatically"
                />
                {console.log(
                  "Selected Assignment Data:",
                  selectedAssignmentData
                )}
                {console.log(
                  "Assigned Date Raw:",
                  selectedAssignmentData.assignedDate
                )}
                {console.log(
                  "Formatted Date:",
                  selectedAssignmentData.assignedDate
                    ? (() => {
                        const dateStr = selectedAssignmentData.assignedDate;
                        if (
                          dateStr.includes("/") &&
                          dateStr.split("/")[0].length <= 2
                        )
                          return dateStr;
                        if (dateStr.includes("-")) {
                          const [year, month, day] = dateStr.split("-");
                          return `${day}/${month}/${year}`;
                        }
                        if (
                          dateStr.includes("/") &&
                          dateStr.split("/")[0].length > 2
                        ) {
                          const [month, day, year] = dateStr.split("/");
                          return `${day}/${month}/${year}`;
                        }
                        return formatDateToDDMMYYYY(dateStr);
                      })()
                    : "N/A"
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Date *
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Condition *
                </label>
                <select
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value)}
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select condition...</option>
                  <option value="Good">Good</option>
                  <option value="Need Maintenance">Need Maintenance</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Received By *
              </label>
              <select
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select employee...</option>
                {(employees || [])
                  .filter((emp) => emp.level_of_work === "staff")
                  .map((emp) => {
                    const empId = emp.employee_id || emp.id || emp.emp_id || "";
                    const empName =
                      emp.full_name ||
                      emp.name ||
                      emp.first_name + " " + emp.last_name ||
                      "";
                    const empDept = emp.department_name || emp.department || "";

                    return (
                      <option key={empId} value={`${empId} - ${empName}`}>
                        {empId} - {empName} ({empDept})
                      </option>
                    );
                  })}
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedAssignment}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
              Process Return
            </button>
          </form>
        </div>

        {/* Active Assignments Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Active Assignments</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allAssignments.length > 0 ? (
                allAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-3 border border-gray-200 rounded hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">
                        {assignment.asset}
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          assignment.status
                        )}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {assignment.employee} • {assignment.employee_id}
                    </div>
                    <div className="text-xs text-gray-400">
                      Assigned: {formatDateToDDMMYYYY(assignment.assignedDate)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Assigned By: {assignment.assignedBy || "N/A"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No active assignments found.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Return Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-semibold text-blue-600">
                  {allAssignments.length}
                </div>
                <div className="text-sm text-blue-600">Total Assignments</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-semibold text-green-600">
                  {recentReturns.length}
                </div>
                <div className="text-sm text-green-600">Recent Returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Returns */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Asset Returns
          </h3>
          <p className="text-sm text-gray-500">
            Track recently processed returns
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReturns.length > 0 ? (
                recentReturns.map((returnItem) => (
                  <tr key={returnItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {returnItem.id.replace("RET-", "")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {returnItem.asset}
                      </div>
                      <div className="text-sm text-gray-500">
                        {returnItem.assetValue}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {returnItem.employee}
                      </div>
                      <div className="text-xs text-gray-500">
                        {returnItem.employee_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {returnItem.assignedDate
                          ? formatDateToDDMMYYYY(returnItem.assignedDate)
                          : "N/A"}
                      </div>
                      {console.log(
                        "Assigned date for",
                        returnItem.asset,
                        ":",
                        returnItem.assignedDate
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateToDDMMYYYY(returnItem.returnDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(
                          returnItem.returnCondition
                        )}`}>
                        {returnItem.returnCondition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {returnItem.duration || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {returnItem.receivedBy}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500">
                    No asset returns found. Process a return to see it here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetReturn;
