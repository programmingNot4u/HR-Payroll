import { useState, useMemo, useEffect } from 'react'
import employeeService from '../../services/employeeService'


const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Quality Control', 'Management']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Cutting Master', 'Finishing Supervisor', 'Production Manager', 'Junior Tailor', 'Machine Operator', 'Quality Assistant']

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [designationFilter, setDesignationFilter] = useState('All')
  const [levelOfWorkFilter, setLevelOfWorkFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Load employees on component mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true)
        const allEmployees = await employeeService.getAllEmployees()
        setEmployees(allEmployees)
      } catch (error) {
        console.error('Error loading employees:', error)
        // Set empty array if service fails
        setEmployees([])
      } finally {
        setLoading(false)
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
    
    // Department breakdown with Worker/Staff breakdown
    const departmentBreakdown = employees.reduce((acc, emp) => {
      if (!acc[emp.department]) {
        acc[emp.department] = { total: 0, workers: 0, staff: 0 }
      }
      acc[emp.department].total += 1
      if (emp.levelOfWork === 'Worker') {
        acc[emp.department].workers += 1
      } else if (emp.levelOfWork === 'Staff') {
        acc[emp.department].staff += 1
      }
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

  // Handle view details - redirect to employee portal
  const handleViewDetails = (employeeId) => {
    // Store the selected employee ID in localStorage for the portal to use
    localStorage.setItem('selectedEmployeeId', employeeId)
    // Navigate to Employee Portal
    window.location.href = '#Employee Portal'
    // Trigger a page refresh to navigate to the portal
    window.location.reload()
  }

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
    )
  }

  if (employees.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
          <p className="text-sm text-gray-500">No employees found.</p>
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
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Department</th>
                  <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">Worker</th>
                  <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">Staff</th>
                  <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.departmentBreakdown).map(([dept, counts]) => (
                  <tr key={dept} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 text-sm font-medium text-gray-900">{dept}</td>
                    <td className="py-3 px-3 text-center text-sm text-gray-600">{counts.workers}</td>
                    <td className="py-3 px-3 text-center text-sm text-gray-600">{counts.staff}</td>
                    <td className="py-3 px-3 text-center text-sm font-semibold text-gray-900">{counts.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="py-3 px-3 text-sm font-bold text-gray-900">Total</td>
                  <td className="py-3 px-3 text-center text-sm font-bold text-gray-900">{stats.workers}</td>
                  <td className="py-3 px-3 text-center text-sm font-bold text-gray-900">{stats.staff}</td>
                  <td className="py-3 px-3 text-center text-sm font-bold text-gray-900">{stats.total}</td>
                </tr>
              </tfoot>
            </table>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process Expertise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id.replace('EMP', '')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.levelOfWork}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.processExpertise || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.machine || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewDetails(employee.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View Details
                      </button>
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

    </div>
  )
}
