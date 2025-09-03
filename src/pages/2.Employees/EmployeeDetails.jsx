import { useState, useEffect } from 'react'
import employeeService from '../../services/employeeService'

export default function EmployeeDetails() {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [filters, setFilters] = useState({
    employeeId: '',
    department: 'All',
    designation: 'All',
    searchTerm: ''
  })
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      const allEmployees = await employeeService.getAllEmployees()
      const employeeStats = await employeeService.getEmployeeStats()
      
      setEmployees(allEmployees)
      setFilteredEmployees(allEmployees)
      setStats(employeeStats)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading employees:', error)
      setIsLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const applyFilters = () => {
    let filtered = employees

    // Apply department filter
    if (filters.department && filters.department !== 'All') {
      filtered = filtered.filter(emp => emp.department === filters.department)
    }

    // Apply designation filter
    if (filters.designation && filters.designation !== 'All') {
      filtered = filtered.filter(emp => emp.designation === filters.designation)
    }

    // Apply employee ID filter
    if (filters.employeeId) {
      filtered = filtered.filter(emp => 
        emp.id.toLowerCase().includes(filters.employeeId.toLowerCase())
      )
    }

    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(term) ||
        emp.id.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term)
      )
    }

    setFilteredEmployees(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, employees])

  const getUniqueDepartments = () => {
    const departments = [...new Set(employees.map(emp => emp.department))]
    return ['All', ...departments]
  }

  const getUniqueDesignations = () => {
    const designations = [...new Set(employees.map(emp => emp.designation))]
    return ['All', ...designations]
  }

  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee)
  }

  const closeEmployeeDetails = () => {
    setSelectedEmployee(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
          <button
            onClick={() => {
              employeeService.refreshSampleData()
              loadEmployees()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            🔄 Refresh Data
          </button>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Total Employees</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Active Employees</p>
                <p className="text-2xl font-bold text-green-900">{stats.byStatus?.Active || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Departments</p>
                <p className="text-2xl font-bold text-purple-900">{Object.keys(stats.byDepartment || {}).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-600">Recent Joinings</p>
                <p className="text-2xl font-bold text-orange-900">{stats.recentJoinings || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter Employees</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={filters.employeeId}
                onChange={handleFilterChange}
                placeholder="Search by ID..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {getUniqueDepartments().map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <select
                name="designation"
                value={filters.designation}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {getUniqueDesignations().map(desig => (
                  <option key={desig} value={desig}>{desig}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search by name, ID, etc..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Employee List ({filteredEmployees.length} employees)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joining Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(employee.joiningDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => viewEmployeeDetails(employee)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Employee Details - {selectedEmployee.name}
              </h3>
              <button
                onClick={closeEmployeeDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Employee ID:</span> {selectedEmployee.id}</div>
                    <div><span className="font-medium">Name:</span> {selectedEmployee.name}</div>
                    <div><span className="font-medium">Designation:</span> {selectedEmployee.designation}</div>
                    <div><span className="font-medium">Department:</span> {selectedEmployee.department}</div>
                    <div><span className="font-medium">Level:</span> {selectedEmployee.levelOfWork}</div>
                    <div><span className="font-medium">Status:</span> {selectedEmployee.status}</div>
                    <div><span className="font-medium">Joining Date:</span> {new Date(selectedEmployee.joiningDate).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Phone:</span> {selectedEmployee.phone}</div>
                    <div><span className="font-medium">Email:</span> {selectedEmployee.email}</div>
                    <div><span className="font-medium">Unit:</span> {selectedEmployee.unit}</div>
                    <div><span className="font-medium">Line:</span> {selectedEmployee.line}</div>
                    <div><span className="font-medium">Supervisor:</span> {selectedEmployee.supervisor}</div>
                  </div>
                </div>

                {/* Salary Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Salary Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Gross Salary:</span> ৳{selectedEmployee.grossSalary?.toLocaleString()}</div>
                    <div><span className="font-medium">Basic Salary:</span> ৳{selectedEmployee.basicSalary?.toLocaleString()}</div>
                    <div><span className="font-medium">House Rent:</span> ৳{selectedEmployee.houseRent?.toLocaleString()}</div>
                    <div><span className="font-medium">Medical:</span> ৳{selectedEmployee.medical?.toLocaleString()}</div>
                    <div><span className="font-medium">Food:</span> ৳{selectedEmployee.food?.toLocaleString()}</div>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Current Month Attendance</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Present:</span> {selectedEmployee.attendance?.currentMonth?.present || 0} days</div>
                    <div><span className="font-medium">Absent:</span> {selectedEmployee.attendance?.currentMonth?.absent || 0} days</div>
                    <div><span className="font-medium">Late:</span> {selectedEmployee.attendance?.currentMonth?.late || 0} days</div>
                    <div><span className="font-medium">Overtime:</span> {selectedEmployee.attendance?.currentMonth?.overtime || 0} hours</div>
                    <div><span className="font-medium">Total Hours:</span> {selectedEmployee.attendance?.currentMonth?.totalWorkingHours || 0} hours</div>
                  </div>
                </div>

                {/* Personal Information */}
                {selectedEmployee.personalInfo && (
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div><span className="font-medium">Date of Birth:</span> {selectedEmployee.personalInfo.dateOfBirth}</div>
                        <div><span className="font-medium">NID:</span> {selectedEmployee.personalInfo.nidNumber}</div>
                        <div><span className="font-medium">Blood Group:</span> {selectedEmployee.personalInfo.bloodGroup}</div>
                        <div><span className="font-medium">Religion:</span> {selectedEmployee.personalInfo.religion}</div>
                        <div><span className="font-medium">Marital Status:</span> {selectedEmployee.personalInfo.maritalStatus}</div>
                      </div>
                      <div className="space-y-2">
                        <div><span className="font-medium">Education:</span> {selectedEmployee.personalInfo.education}</div>
                        <div><span className="font-medium">Gender:</span> {selectedEmployee.personalInfo.gender}</div>
                        <div><span className="font-medium">Present Address:</span> {selectedEmployee.personalInfo.address?.present?.village}, {selectedEmployee.personalInfo.address?.present?.district}</div>
                        <div><span className="font-medium">Permanent Address:</span> {selectedEmployee.personalInfo.address?.permanent?.village}, {selectedEmployee.personalInfo.address?.permanent?.district}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Leave Balance */}
                {selectedEmployee.leaveBalance && (
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Leave Balance</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{selectedEmployee.leaveBalance.casual}</div>
                        <div className="text-sm text-blue-800">Casual</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{selectedEmployee.leaveBalance.sick}</div>
                        <div className="text-sm text-green-800">Sick</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{selectedEmployee.leaveBalance.annual}</div>
                        <div className="text-sm text-purple-800">Annual</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{selectedEmployee.leaveBalance.maternity}</div>
                        <div className="text-sm text-orange-800">Maternity</div>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="text-lg font-bold text-indigo-600">{selectedEmployee.leaveBalance.earned}</div>
                        <div className="text-sm text-indigo-800">Earned</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeEmployeeDetails}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
