import { useEffect, useRef, useState } from "react";
import assetService from "../../services/assetService";
import employeeService from "../../services/employeeService";
import { formatDateToDDMMYYYY } from "../../utils/dateUtils";

const AssignAsset = () => {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [condition, setCondition] = useState("");
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [assetSearchTerm, setAssetSearchTerm] = useState("");
  const [showAssetSuggestions, setShowAssetSuggestions] = useState(false);

  const [availableAssets, setAvailableAssets] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const searchRef = useRef(null);
  const assetSearchRef = useRef(null);

  // Function to get condition color styling
  const getConditionColor = (condition) => {
    switch (condition) {
      case "Good":
        return "bg-green-100 text-green-800";
      case "Need Maintenance":
        return "bg-orange-100 text-orange-800";
      case "Lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to format assignment date for display
  const formatAssignmentDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      // If it's already in DD/MM/YYYY format, return as is
      if (dateString.includes("/") && dateString.split("/").length === 3) {
        return dateString;
      }

      // If it's in YYYY-MM-DD format, convert to DD/MM/YYYY
      if (dateString.includes("-") && dateString.split("-").length === 3) {
        const dateParts = dateString.split("-");
        if (dateParts.length === 3) {
          return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }
      }

      // Try to parse as a date and format
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

      return "Invalid Date";
    } catch (error) {
      console.error(
        "Error formatting assignment date:",
        error,
        "Input:",
        dateString
      );
      return "Invalid Date";
    }
  };

  // Function to get minimum assignment date based on selected asset
  const getMinAssignmentDate = () => {
    if (!selectedAsset) return "";

    const asset = allAssets.find((a) => a.id === selectedAsset);
    if (!asset || !asset.purchase_date) return "";

    // Convert purchase date to YYYY-MM-DD format for HTML date input
    let purchaseDate = asset.purchase_date;

    // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (purchaseDate.includes("/") && purchaseDate.split("/").length === 3) {
      const dateParts = purchaseDate.split("/");
      if (dateParts.length === 3) {
        purchaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    return purchaseDate;
  };

  // Handle delete assignment
  const handleDeleteAssignment = async (assignment) => {
    if (
      window.confirm(
        `Are you sure you want to delete the assignment for ${assignment.asset}?`
      )
    ) {
      try {
        // Unassign the asset
        await assetService.unassignAsset(assignment.assetId);

        // Reload assignment history
        const updatedAssignments = await assetService.getAssignmentHistory();
        setAssignmentHistory(updatedAssignments);

        // Reload available assets
        const availableAssets = await assetService.getAvailableAssets();
        setAvailableAssets(availableAssets);

        alert("Assignment deleted successfully!");
      } catch (error) {
        console.error("Error deleting assignment:", error);
        alert("Error deleting assignment. Please try again.");
      }
    }
  };

  // Load employees from employee service
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await employeeService.getAllEmployees();
        // Extract employees array from response object
        const employeesArray = response.employees || [];
        console.log("Loaded employees data:", employeesArray);
        console.log("First employee structure:", employeesArray[0]);
        setEmployees(employeesArray);
        // Set employees data in asset service for update operations
        assetService.setEmployees(employeesArray);
      } catch (error) {
        console.error("Error loading employees:", error);
        setEmployees([]);
      }
    };

    loadEmployees();
  }, []);

  // Load all assets from asset service
  useEffect(() => {
    const loadAllAssets = async () => {
      try {
        const assets = await assetService.getAllAssets();
        // Handle different response formats
        const assetsArray = Array.isArray(assets)
          ? assets
          : assets.results || [];
        setAllAssets(assetsArray);
      } catch (error) {
        console.error("Error loading all assets:", error);
        setAllAssets([]);
      }
    };

    loadAllAssets();
  }, []);

  // Load available assets from asset service
  useEffect(() => {
    const loadAvailableAssets = async () => {
      try {
        const assets = await assetService.getAvailableAssets();
        // Handle different response formats
        const assetsArray = Array.isArray(assets)
          ? assets
          : assets.results || [];
        setAvailableAssets(assetsArray);
      } catch (error) {
        console.error("Error loading available assets:", error);
        setAvailableAssets([]);
      }
    };

    loadAvailableAssets();
  }, []);

  // Load assignment history from asset service
  useEffect(() => {
    const loadAssignmentHistory = async () => {
      try {
        const assignments = await assetService.getAssignmentHistory();
        // Handle different response formats
        const assignmentsArray = Array.isArray(assignments)
          ? assignments
          : assignments.results || [];
        setAssignmentHistory(assignmentsArray);
      } catch (error) {
        console.error("Error loading assignment history:", error);
        setAssignmentHistory([]);
      }
    };

    loadAssignmentHistory();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (
        assetSearchRef.current &&
        !assetSearchRef.current.contains(event.target)
      ) {
        setShowAssetSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter employees based on search term - prioritize employee_id
  const filteredEmployees = (employees || []).filter((emp) => {
    if (!emp || typeof emp !== "object") return false;

    const searchTerm = employeeSearchTerm.toLowerCase();

    // Use employee_id as primary identifier
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

  // Filter assets based on search term
  const filteredAssets = (availableAssets || []).filter((asset) => {
    if (!asset || typeof asset !== "object") return false;

    const searchTerm = assetSearchTerm.toLowerCase();

    const assetId = asset.id || asset.asset_id || "";
    const assetName = asset.name || asset.asset_name || "";
    const assetCategory = asset.category || asset.asset_category || "";
    const assetDept = asset.department || asset.department_name || "";

    return (
      (assetId && assetId.toString().toLowerCase().includes(searchTerm)) ||
      (assetName && assetName.toString().toLowerCase().includes(searchTerm)) ||
      (assetCategory &&
        assetCategory.toString().toLowerCase().includes(searchTerm)) ||
      (assetDept && assetDept.toString().toLowerCase().includes(searchTerm))
    );
  });

  // Handle employee search input
  const handleEmployeeSearch = (value) => {
    setEmployeeSearchTerm(value);
    setShowSuggestions(value.length > 0);
    if (value === "") {
      setSelectedEmployee("");
    }
  };

  // Handle employee selection from suggestions
  const handleEmployeeSelect = (employee) => {
    const empId = employee.employee_id || employee.id || employee.emp_id || "";
    const empName =
      employee.name ||
      employee.full_name ||
      employee.first_name + " " + employee.last_name ||
      "";
    const empDept = employee.department || employee.department_name || "";

    setSelectedEmployee(empId);
    setEmployeeSearchTerm(`${empId} - ${empName} (${empDept})`);
    setShowSuggestions(false);
  };

  // Clear employee selection
  const clearEmployeeSelection = () => {
    setSelectedEmployee("");
    setEmployeeSearchTerm("");
    setShowSuggestions(false);
  };

  // Handle asset search input
  const handleAssetSearch = (value) => {
    setAssetSearchTerm(value);
    setShowAssetSuggestions(value.length > 0);
    if (value === "") {
      setSelectedAsset("");
    }
  };

  // Handle asset selection from suggestions
  const handleAssetSelect = (asset) => {
    const assetId = asset.id || asset.asset_id || "";
    const assetName = asset.name || asset.asset_name || "";
    const assetCategory = asset.category || asset.asset_category || "";
    const assetValue = asset.value || asset.asset_value || "";

    setSelectedAsset(assetId);
    setAssetSearchTerm(
      `${assetId} - ${assetName} (${assetCategory}) - ${assetValue}`
    );
    setShowAssetSuggestions(false);
    // Clear assignment date when asset changes to force user to select valid date
    setAssignmentDate("");
  };

  // Clear asset selection
  const clearAssetSelection = () => {
    setSelectedAsset("");
    setAssetSearchTerm("");
    setShowAssetSuggestions(false);
    // Clear assignment date when asset is cleared
    setAssignmentDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find the selected asset and employee details
    const asset = availableAssets.find((a) => {
      const assetId = a.id || a.asset_id || "";
      return assetId === selectedAsset;
    });
    const employee = employees.find((emp) => {
      const empId = emp.employee_id || emp.id || emp.emp_id || "";
      return empId === selectedEmployee;
    });

    if (!asset || !employee) {
      alert("Please select both an asset and an employee");
      return;
    }

    try {
      // Create assignment data
      const assignmentData = {
        assignmentDate: assignmentDate, // Keep in YYYY-MM-DD format for API
        assignedBy,
        assignedCondition: condition,
      };

      console.log("Assignment data being sent:", assignmentData);
      console.log("Selected asset:", selectedAsset);
      console.log("Selected employee:", selectedEmployee);

      // Get employee name for assignment
      const empName =
        employee.name ||
        employee.full_name ||
        employee.first_name + " " + employee.last_name ||
        "Unknown";
      const assetName = asset.name || asset.asset_name || "Unknown Asset";

      console.log("Employee name:", empName);
      console.log("Asset name:", assetName);

      // Assign the asset using the asset service
      await assetService.assignAsset(
        selectedAsset,
        selectedEmployee,
        empName,
        assignmentData
      );

      // Show success message
      alert(
        `Asset "${assetName}" has been successfully assigned to ${empName} (${selectedEmployee})`
      );

      // Reload available assets and assignment history to reflect the assignment
      const updatedAssets = await assetService.getAvailableAssets();
      const updatedAssignments = await assetService.getAssignmentHistory();
      setAvailableAssets(updatedAssets);
      setAssignmentHistory(updatedAssignments);

      // Reset form
      setSelectedAsset("");
      setSelectedEmployee("");
      setAssignmentDate("");
      setAssignedBy("");
      setCondition("");
      setEmployeeSearchTerm("");
      setShowSuggestions(false);
      setAssetSearchTerm("");
      setShowAssetSuggestions(false);
    } catch (error) {
      console.error("Error assigning asset:", error);
      alert(`Error assigning asset: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Assign Asset</h1>
        <p className="text-sm text-gray-500">
          Assign company assets to employees
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">New Asset Assignment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Asset *
              </label>
              <div className="relative" ref={assetSearchRef}>
                <input
                  type="text"
                  placeholder="Search by ID, name, category, or department..."
                  value={assetSearchTerm}
                  onChange={(e) => handleAssetSearch(e.target.value)}
                  onFocus={() =>
                    setShowAssetSuggestions(assetSearchTerm.length > 0)
                  }
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {selectedAsset && (
                  <button
                    type="button"
                    onClick={clearAssetSelection}
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

                {/* Asset Suggestions Dropdown */}
                {showAssetSuggestions && filteredAssets.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredAssets.map((asset) => {
                      const assetId = asset.id || asset.asset_id || "";
                      const assetName = asset.name || asset.asset_name || "";
                      const assetCategory =
                        asset.category || asset.asset_category || "";
                      const assetDept =
                        asset.department || asset.department_name || "";
                      const assetValue = asset.value || asset.asset_value || "";

                      return (
                        <div
                          key={assetId}
                          onClick={() => handleAssetSelect(asset)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                          <div className="font-medium text-gray-900">
                            {assetId} - {assetName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assetCategory} • {assetDept} • {assetValue}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* No results message */}
                {showAssetSuggestions &&
                  filteredAssets.length === 0 &&
                  assetSearchTerm.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No assets found matching "{assetSearchTerm}"
                      </div>
                    </div>
                  )}
              </div>
            </div>

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
                        emp.name ||
                        emp.full_name ||
                        emp.first_name + " " + emp.last_name ||
                        "";
                      const empDept =
                        emp.department || emp.department_name || "";

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Date *
              </label>
              <input
                type="date"
                value={assignmentDate}
                onChange={(e) => {
                  console.log("Date input changed:", e.target.value);
                  setAssignmentDate(e.target.value);
                }}
                min={getMinAssignmentDate()}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {selectedAsset && getMinAssignmentDate() && (
                <p className="text-xs text-gray-500 mt-1">
                  Must be on or after purchase date:{" "}
                  {formatDateToDDMMYYYY(getMinAssignmentDate())}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned By *
              </label>
              <select
                value={assignedBy}
                onChange={(e) => setAssignedBy(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select employee...</option>
                {(employees || [])
                  .filter((emp) => emp.level_of_work === "staff")
                  .map((emp) => {
                    const empId = emp.employee_id || emp.id || emp.emp_id || "";
                    const empName =
                      emp.name ||
                      emp.full_name ||
                      emp.first_name + " " + emp.last_name ||
                      "";
                    const empDept = emp.department || emp.department_name || "";

                    return (
                      <option key={empId} value={`${empId} - ${empName}`}>
                        {empId} - {empName} ({empDept})
                      </option>
                    );
                  })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select condition...</option>
                <option value="Good">Good</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-100 text-orange-700 py-2 px-4 rounded hover:bg-orange-200 transition-colors font-medium">
              Assign Asset
            </button>
          </form>
        </div>

        {/* Available Assets Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Available Assets</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(availableAssets || []).map((asset) => {
                const assetId = asset.id || asset.asset_id || "";
                const assetName = asset.name || asset.asset_name || "";
                const assetCategory =
                  asset.category || asset.asset_category || "";
                const assetDept =
                  asset.department || asset.department_name || "";
                const assetValue = asset.value || asset.asset_value || "";

                return (
                  <div
                    key={assetId}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <div className="font-medium text-gray-900">
                        {assetName}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">ID: {assetId}</span> •{" "}
                        {assetCategory} • {assetDept}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {assetValue}
                      </div>
                      <div className="text-xs text-green-600">Available</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Quick Stats</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-semibold text-gray-600">
                  {allAssets.length}
                </div>
                <div className="text-sm text-gray-600">Total Assets</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-semibold text-blue-600">
                  {availableAssets.length}
                </div>
                <div className="text-sm text-blue-600">Available</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-semibold text-green-600">
                  {assignmentHistory.length}
                </div>
                <div className="text-sm text-green-600">Assigned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Asset Assignments
          </h3>
          <p className="text-sm text-gray-500">
            Track current asset assignments
          </p>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
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
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(assignmentHistory || []).length > 0 ? (
                (assignmentHistory || []).map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.assetId || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.asset}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.employee}
                      </div>
                      <div className="text-xs text-gray-500">
                        {assignment.employeeId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatAssignmentDate(assignment.assignedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(
                          assignment.assignedCondition
                        )}`}>
                        {assignment.assignedCondition || "Good"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.assignedBy || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteAssignment(assignment)}
                        className="px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-md font-medium transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500">
                    No asset assignments found. Assign an asset to see it here.
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

export default AssignAsset;
