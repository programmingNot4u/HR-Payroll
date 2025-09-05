import { useState, useMemo, useEffect } from 'react'
import employeeService from '../../services/employeeService'

// Sample employee data with more details
const sampleEmployees = [
  {
    id: 'EMP001',
    name: 'Ahmed Khan',
    designation: 'Senior Tailor',
    department: 'Sewing',
    levelOfWork: 'Worker',
    phone: '+880 1712-345678',
    joiningDate: '2022-03-15',
    status: 'Active',
    salary: 25000,
    unit: 'Unit 1',
    line: 'Line 2',
    supervisor: 'Mohammad Ali',
    email: 'ahmed.khan@company.com',
    address: 'Dhaka, Bangladesh',
    emergencyContact: '+880 1712-345679'
  },
  {
    id: 'EMP002',
    name: 'Fatima Begum',
    designation: 'Quality Inspector',
    department: 'Quality Control',
    levelOfWork: 'Staff',
    phone: '+880 1812-345679',
    joiningDate: '2023-01-20',
    status: 'Active',
    salary: 35000,
    unit: 'Unit 2',
    line: 'N/A',
    supervisor: 'Rashid Ahmed',
    email: 'fatima.begum@company.com',
    address: 'Chittagong, Bangladesh',
    emergencyContact: '+880 1812-345680'
  },
  {
    id: 'EMP003',
    name: 'Rahim Ali',
    designation: 'Cutting Master',
    department: 'Cutting',
    levelOfWork: 'Worker',
    phone: '+880 1912-345680',
    joiningDate: '2021-08-10',
    status: 'Active',
    salary: 28000,
    unit: 'Unit 1',
    line: 'Line 1',
    supervisor: 'Karim Uddin',
    email: 'rahim.ali@company.com',
    address: 'Sylhet, Bangladesh',
    emergencyContact: '+880 1912-345681'
  },
  {
    id: 'EMP004',
    name: 'Ayesha Rahman',
    designation: 'Finishing Supervisor',
    department: 'Finishing',
    levelOfWork: 'Staff',
    phone: '+880 1612-345681',
    joiningDate: '2023-06-05',
    status: 'On Probation',
    salary: 32000,
    unit: 'Unit 3',
    line: 'N/A',
    supervisor: 'Nasir Khan',
    email: 'ayesha.rahman@company.com',
    address: 'Rajshahi, Bangladesh',
    emergencyContact: '+880 1612-345682'
  },
  {
    id: 'EMP005',
    name: 'Mohammad Hassan',
    designation: 'Production Manager',
    department: 'Management',
    levelOfWork: 'Staff',
    phone: '+880 1512-345682',
    joiningDate: '2020-12-01',
    status: 'Active',
    salary: 65000,
    unit: 'N/A',
    line: 'N/A',
    supervisor: 'CEO',
    email: 'mohammad.hassan@company.com',
    address: 'Dhaka, Bangladesh',
    emergencyContact: '+880 1512-345683'
  },
  {
    id: 'EMP006',
    name: 'Nusrat Jahan',
    designation: 'Junior Tailor',
    department: 'Sewing',
    levelOfWork: 'Worker',
    phone: '+880 1412-345683',
    joiningDate: '2024-01-15',
    status: 'New Joined',
    salary: 20000,
    unit: 'Unit 1',
    line: 'Line 3',
    supervisor: 'Ahmed Khan',
    email: 'nusrat.jahan@company.com',
    address: 'Comilla, Bangladesh',
    emergencyContact: '+880 1412-345684'
  },
  {
    id: 'EMP007',
    name: 'Karim Uddin',
    designation: 'Machine Operator',
    department: 'Cutting',
    levelOfWork: 'Worker',
    phone: '+880 1312-345684',
    joiningDate: '2022-11-20',
    status: 'InActive',
    salary: 22000,
    unit: 'Unit 1',
    line: 'Line 1',
    supervisor: 'Rahim Ali',
    email: 'karim.uddin@company.com',
    address: 'Barisal, Bangladesh',
    emergencyContact: '+880 1312-345685'
  },
  {
    id: 'EMP008',
    name: 'Salma Khatun',
    designation: 'Quality Assistant',
    department: 'Quality Control',
    levelOfWork: 'Staff',
    phone: '+880 1212-345685',
    joiningDate: '2023-09-12',
    status: 'Resigned',
    salary: 25000,
    unit: 'Unit 2',
    line: 'N/A',
    supervisor: 'Fatima Begum',
    email: 'salma.khatun@company.com',
    address: 'Rangpur, Bangladesh',
    emergencyContact: '+880 1212-345686'
  }
]

const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Quality Control', 'Management']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Cutting Master', 'Finishing Supervisor', 'Production Manager', 'Junior Tailor', 'Machine Operator', 'Quality Assistant']

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([])
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [designationFilter, setDesignationFilter] = useState('All')
  const [levelOfWorkFilter, setLevelOfWorkFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false)

  // Load employees on component mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const allEmployees = await employeeService.getAllEmployees()
        setEmployees(allEmployees)
      } catch (error) {
        console.error('Error loading employees:', error)
        // Fallback to sample data if service fails
        setEmployees(sampleEmployees)
      }
    }
    
    loadEmployees()
  }, [])

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    if (!Array.isArray(employees)) return {}
    
    const total = employees.length
    const active = employees.filter(emp => emp.status === 'Active').length
    const inactive = employees.filter(emp => emp.status === 'InActive').length
    const newJoined = employees.filter(emp => emp.status === 'New Joined').length
    const resigned = employees.filter(emp => emp.status === 'Resigned').length
    const terminated = employees.filter(emp => emp.status === 'Terminated').length
    const onProbation = employees.filter(emp => emp.status === 'On Probation').length
    
    // Department breakdown
    const departmentBreakdown = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1
      return acc
    }, {})
    
    // Level of work breakdown
    const workers = employees.filter(emp => emp.levelOfWork === 'Worker').length
    const staff = employees.filter(emp => emp.levelOfWork === 'Staff').length
    
    // Salary statistics
    const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0)
    const avgSalary = total > 0 ? Math.round(totalSalary / total) : 0
    
    // Recent joiners (last 3 months)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const recentJoiners = employees.filter(emp => new Date(emp.joiningDate) >= threeMonthsAgo).length

    return { 
      total, active, inactive, newJoined, resigned, terminated, onProbation,
      departmentBreakdown, workers, staff, totalSalary, avgSalary, recentJoiners
    }
  }, [employees])

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesDepartment = departmentFilter === 'All' || employee.department === departmentFilter
      const matchesDesignation = designationFilter === 'All' || employee.designation === designationFilter
      const matchesLevelOfWork = levelOfWorkFilter === 'All' || employee.levelOfWork === levelOfWorkFilter
      const matchesStatus = statusFilter === 'All' || employee.status === statusFilter
      const matchesSearch = searchTerm === '' || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.phone && employee.phone.includes(searchTerm)) ||
        (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesDepartment && matchesDesignation && matchesLevelOfWork && matchesStatus && matchesSearch
    })
  }, [employees, departmentFilter, designationFilter, levelOfWorkFilter, statusFilter, searchTerm])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'InActive': return 'bg-red-100 text-red-800'
      case 'New Joined': return 'bg-blue-100 text-blue-800'
      case 'Resigned': return 'bg-yellow-100 text-yellow-800'
      case 'Terminated': return 'bg-red-100 text-red-800'
      case 'On Probation': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeDetails(true)
  }

  const closeEmployeeDetails = () => {
    setShowEmployeeDetails(false)
    setSelectedEmployee(null)
  }

  if (employees.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
          <p className="text-sm text-gray-500">Loading employees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
        <p className="text-sm text-gray-500">Comprehensive employee management and analytics</p>
      </div>

      {/* Enhanced Statistics Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Total Employees</div>
          <div className="mt-2 text-2xl font-semibold text-blue-600">{stats.total}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Active</div>
          <div className="mt-2 text-2xl font-semibold text-green-600">{stats.active}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Workers</div>
          <div className="mt-2 text-2xl font-semibold text-orange-600">{stats.workers}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Staff</div>
          <div className="mt-2 text-2xl font-semibold text-purple-600">{stats.staff}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">New Joiners</div>
          <div className="mt-2 text-2xl font-semibold text-blue-600">{stats.recentJoiners}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">On Probation</div>
          <div className="mt-2 text-2xl font-semibold text-orange-600">{stats.onProbation}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Inactive</div>
          <div className="mt-2 text-2xl font-semibold text-red-600">{stats.inactive}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Avg Salary</div>
          <div className="mt-2 text-2xl font-semibold text-green-600">৳{stats.avgSalary.toLocaleString()}</div>
        </div>
      </section>

      {/* Department Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-medium mb-4">Department Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.departmentBreakdown).map(([dept, count]) => (
              <div key={dept} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{dept}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-medium mb-4">Employee Status Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Active Employees</span>
              <span className="text-sm font-semibold text-green-600">{stats.active} ({Math.round((stats.active / stats.total) * 100)}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">On Probation</span>
              <span className="text-sm font-semibold text-orange-600">{stats.onProbation} ({Math.round((stats.onProbation / stats.total) * 100)}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">New Joiners</span>
              <span className="text-sm font-semibold text-blue-600">{stats.newJoined} ({Math.round((stats.newJoined / stats.total) * 100)}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Inactive/Resigned</span>
              <span className="text-sm font-semibold text-red-600">{stats.inactive + stats.resigned} ({Math.round(((stats.inactive + stats.resigned) / stats.total) * 100)}%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters */}
      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Search & Filter Employees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by ID, Name, Email</label>
            <input
              type="text"
              placeholder="EMP001, Ahmed Khan, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setDepartmentFilter('All')
                setDesignationFilter('All')
                setLevelOfWorkFilter('All')
                setStatusFilter('All')
                setSearchTerm('')
              }}
              className="flex-1 h-10 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setStatusFilter('Active')}
              className="flex-1 h-10 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              Active Only
            </button>
          </div>
        </div>
      </section>

      {/* Employee Table */}
      <section className="rounded border border-gray-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Employee List</h2>
          <p className="text-sm text-gray-500">Showing {filteredEmployees.length} of {employees.length} employees</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joining Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.levelOfWork}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(employee.joiningDate).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewEmployee(employee)}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        View Details
                      </button>
                      <button className="text-blue-600 hover:text-blue-700">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEmployees.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-500">No employees found matching your filters.</div>
          </div>
        )}
      </section>

      {/* Employee Details Modal */}
      {showEmployeeDetails && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                Employee Details - {selectedEmployee.name}
              </h2>
              <button
                onClick={closeEmployeeDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Employee ID:</span>
                      <span className="text-gray-900">{selectedEmployee.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="text-gray-900">{selectedEmployee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-900">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="text-gray-900">{selectedEmployee.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">Employment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Designation:</span>
                      <span className="text-gray-900">{selectedEmployee.designation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Department:</span>
                      <span className="text-gray-900">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Level of Work:</span>
                      <span className="text-gray-900">{selectedEmployee.levelOfWork}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-800 border-b border-purple-200 pb-2">Work Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Joining Date:</span>
                      <span className="text-gray-900">{new Date(selectedEmployee.joiningDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Unit:</span>
                      <span className="text-gray-900">{selectedEmployee.unit || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Line:</span>
                      <span className="text-gray-900">{selectedEmployee.line || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Supervisor:</span>
                      <span className="text-gray-900">{selectedEmployee.supervisor || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800 border-b border-orange-200 pb-2">Compensation</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Salary:</span>
                      <span className="text-gray-900 font-semibold">৳{selectedEmployee.salary?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Emergency Contact:</span>
                      <span className="text-gray-900">{selectedEmployee.emergencyContact || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Address:</span>
                      <span className="text-gray-900">{selectedEmployee.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeEmployeeDetails}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Edit Employee
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
