import { useState, useEffect, useMemo } from 'react'

// Sample leave types and their configurations
const leaveTypes = [
  {
    id: 'casual',
    name: 'Casual Leave',
    maxDays: 15,
    color: 'bg-blue-100 text-blue-800',
    description: 'Short-term personal leave for urgent matters',
    requiresApproval: false
  },
  {
    id: 'sick',
    name: 'Sick Leave',
    maxDays: 30,
    color: 'bg-red-100 text-red-800',
    description: 'Medical leave with doctor certificate',
    requiresApproval: true
  },
  {
    id: 'annual',
    name: 'Annual Leave',
    maxDays: 21,
    color: 'bg-green-100 text-green-800',
    description: 'Planned vacation leave',
    requiresApproval: true
  },
  {
    id: 'maternity',
    name: 'Maternity Leave',
    maxDays: 120,
    color: 'bg-pink-100 text-pink-800',
    description: 'Leave for expecting mothers',
    requiresApproval: true
  },
  {
    id: 'earned',
    name: 'Earned Leave',
    maxDays: 30,
    color: 'bg-purple-100 text-purple-800',
    description: 'Leave earned through overtime work',
    requiresApproval: false
  },
  {
    id: 'compensatory',
    name: 'Compensatory Leave',
    maxDays: 15,
    color: 'bg-orange-100 text-orange-800',
    description: 'Leave in lieu of overtime',
    requiresApproval: false
  }
]

// Sample employee data (in real app, this would come from employeeService)
const sampleEmployees = [
  {
    id: 'EMP001',
    name: 'Ahmed Khan',
    department: 'Sewing',
    designation: 'Senior Tailor',
    levelOfWork: 'Worker',
    gender: 'Male',
    email: 'ahmed.khan@company.com',
    phone: '+880 1712-345678',
    leaveBalance: {
      casual: 12,
      sick: 8,
      annual: 18,
      maternity: 0,
      earned: 6
    }
  },
  {
    id: 'EMP002',
    name: 'Fatima Begum',
    department: 'Quality Control',
    designation: 'Quality Inspector',
    levelOfWork: 'Staff',
    gender: 'Female',
    email: 'fatima.begum@company.com',
    phone: '+880 1712-345679',
    leaveBalance: {
      casual: 15,
      sick: 10,
      annual: 21,
      maternity: 120,
      earned: 8
    }
  },
  {
    id: 'EMP003',
    name: 'Mohammad Hassan',
    department: 'Production',
    designation: 'Production Manager',
    levelOfWork: 'Staff',
    gender: 'Male',
    email: 'mohammad.hassan@company.com',
    phone: '+880 1712-345680',
    leaveBalance: {
      casual: 8,
      sick: 5,
      annual: 15,
      maternity: 0,
      earned: 12
    }
  },
  {
    id: 'EMP004',
    name: 'Salma Khatun',
    department: 'Cutting',
    designation: 'Cutting Master',
    levelOfWork: 'Worker',
    gender: 'Female',
    email: 'salma.khatun@company.com',
    phone: '+880 1712-345681',
    leaveBalance: {
      casual: 14,
      sick: 9,
      annual: 20,
      maternity: 120,
      earned: 7
    }
  },
  {
    id: 'EMP005',
    name: 'Karim Uddin',
    department: 'Maintenance',
    designation: 'Maintenance Engineer',
    levelOfWork: 'Staff',
    gender: 'Male',
    email: 'karim.uddin@company.com',
    phone: '+880 1712-345682',
    leaveBalance: {
      casual: 11,
      sick: 7,
      annual: 16,
      maternity: 0,
      earned: 9
    }
  }
]

const departments = ['All', 'Sewing', 'Quality Control', 'Production', 'Cutting', 'Maintenance']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Production Manager', 'Cutting Master', 'Maintenance Engineer']

export default function LeaveRequest() {
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [leaveType, setLeaveType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalDays, setTotalDays] = useState(0)
  const [reason, setReason] = useState('')
  const [filters, setFilters] = useState({
    employeeId: '',
    department: 'All',
    designation: 'All',
    levelOfWork: 'All'
  })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [leaveRequests, setLeaveRequests] = useState([])

  // Filter employees based on selected filters
  const filteredEmployees = useMemo(() => {
    return sampleEmployees.filter(employee => {
      const matchesId = !filters.employeeId || employee.id.toLowerCase().includes(filters.employeeId.toLowerCase()) || employee.name.toLowerCase().includes(filters.employeeId.toLowerCase())
      const matchesDepartment = filters.department === 'All' || employee.department === filters.department
      const matchesDesignation = filters.designation === 'All' || employee.designation === filters.designation
      const matchesLevelOfWork = filters.levelOfWork === 'All' || employee.levelOfWork === filters.levelOfWork
      
      return matchesId && matchesDepartment && matchesDesignation && matchesLevelOfWork
    })
  }, [filters])

  // Calculate total days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      setTotalDays(diffDays)
    } else {
      setTotalDays(0)
    }
  }, [startDate, endDate])

  // Get selected employee details
  const selectedEmployeeData = useMemo(() => {
    return sampleEmployees.find(emp => emp.id === selectedEmployee)
  }, [selectedEmployee])

  // Get selected leave type details
  const selectedLeaveTypeData = useMemo(() => {
    return leaveTypes.find(type => type.id === leaveType)
  }, [leaveType])

  // Check if leave request is valid
  const isLeaveValid = useMemo(() => {
    if (!selectedEmployee || !leaveType || !startDate || !endDate || !reason) {
      return false
    }
    
    if (selectedEmployeeData && selectedLeaveTypeData) {
      const availableBalance = selectedEmployeeData.leaveBalance[leaveType] || 0
      return totalDays <= availableBalance && totalDays > 0
    }
    
    return false
  }, [selectedEmployee, leaveType, startDate, endDate, reason, totalDays, selectedEmployeeData, selectedLeaveTypeData])

  // Get leave balance for selected employee and leave type
  const getLeaveBalance = (employeeId, leaveTypeId) => {
    const employee = sampleEmployees.find(emp => emp.id === employeeId)
    return employee ? employee.leaveBalance[leaveTypeId] || 0 : 0
  }

  // Get leave balance color based on availability
  const getLeaveBalanceColor = (balance, maxDays) => {
    if (balance >= maxDays * 0.8) return 'text-green-600'
    if (balance >= maxDays * 0.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!isLeaveValid) return

    const newLeaveRequest = {
      id: `LR${Date.now()}`,
      employeeId: selectedEmployee,
      employeeName: selectedEmployeeData.name,
      leaveType: leaveType,
      leaveTypeName: selectedLeaveTypeData.name,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'Pending',
      submittedDate: new Date().toISOString(),
      requiresApproval: selectedLeaveTypeData.requiresApproval
    }

    setLeaveRequests(prev => [newLeaveRequest, ...prev])
    
    // Reset form
    setSelectedEmployee('')
    setLeaveType('')
    setStartDate('')
    setEndDate('')
    setTotalDays(0)
    setReason('')
    setIsFormOpen(false)
  }

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      employeeId: '',
      department: 'All',
      designation: 'All',
      levelOfWork: 'All'
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Leave Request Management</h1>
        <p className="text-sm text-gray-500">HR can create and manage leave requests for employees</p>
      </div>

      {/* Filters */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID/Name</label>
            <input
              type="text"
              value={filters.employeeId}
              onChange={(e) => handleFilterChange('employeeId', e.target.value)}
              placeholder="Search by ID or name..."
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <select
              value={filters.designation}
              onChange={(e) => handleFilterChange('designation', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {designations.map(desig => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level of Work</label>
            <select
              value={filters.levelOfWork}
              onChange={(e) => handleFilterChange('levelOfWork', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Worker">Worker</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={clearFilters}
              className="h-10 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="h-10 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Create Leave Request
            </button>
          </div>
        </div>
      </div>

      {/* Employee List with Leave Balances */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Employee Leave Balances</h2>
          <p className="text-sm text-gray-500">Current leave balances for all employees</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Casual</th>
                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sick</th>
                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Annual</th>
                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Maternity</th>
                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Earned</th>
                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {employee.id.replace('EMP', '')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.designation}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.levelOfWork}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-center">
                     <span className={`text-sm font-medium ${employee.gender === 'Female' ? 'text-pink-600' : 'text-blue-600'}`}>
                       {employee.gender}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-center">
                     <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.casual, 15)}`}>
                       {employee.leaveBalance.casual}/15
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-center">
                     <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.sick, 30)}`}>
                       {employee.leaveBalance.sick}/30
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-center">
                     <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.annual, 21)}`}>
                       {employee.leaveBalance.annual}/21
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-center">
                     {employee.gender === 'Female' ? (
                       <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.maternity, 120)}`}>
                         {employee.leaveBalance.maternity}/120
                       </span>
                     ) : (
                       <span className="text-sm text-gray-400">N/A</span>
                     )}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-center">
                     <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.earned, 30)}`}>
                       {employee.leaveBalance.earned}/30
                     </span>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee.id)
                        setIsFormOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Create Leave
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Requests History */}
      {leaveRequests.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Leave Requests</h2>
            <p className="text-sm text-gray-500">Leave requests created by HR</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.employeeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        leaveTypes.find(t => t.id === request.leaveType)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.leaveTypeName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.startDate).toLocaleDateString('en-GB')} - {new Date(request.endDate).toLocaleDateString('en-GB')}
                      <br />
                      <span className="text-xs text-gray-400">{request.totalDays} days</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.submittedDate).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Request Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Leave Request</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Employee</option>
                    {filteredEmployees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.id}) - {employee.department}
                      </option>
                    ))}
                  </select>
                </div>

                                 {/* Leave Type Selection */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                   <select
                     value={leaveType}
                     onChange={(e) => setLeaveType(e.target.value)}
                     className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     required
                   >
                     <option value="">Select Leave Type</option>
                     {leaveTypes.map(type => {
                       // Hide maternity leave for male employees
                       if (type.id === 'maternity' && selectedEmployeeData?.gender === 'Male') {
                         return null
                       }
                       return (
                         <option key={type.id} value={type.id}>
                           {type.name} (Max: {type.maxDays} days)
                           {type.id === 'maternity' && selectedEmployeeData?.gender === 'Female' && ' - Female Only'}
                         </option>
                       )
                     })}
                   </select>
                   {selectedLeaveTypeData && (
                     <p className="mt-1 text-sm text-gray-500">
                       {selectedLeaveTypeData.description}
                       {selectedLeaveTypeData.id === 'maternity' && selectedEmployeeData?.gender === 'Female' && ' (Available for female employees only)'}
                     </p>
                   )}
                 </div>

                {/* Leave Balance Display */}
                {selectedEmployee && leaveType && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Available Balance:</strong> {getLeaveBalance(selectedEmployee, leaveType)} days
                      {selectedLeaveTypeData && ` out of ${selectedLeaveTypeData.maxDays} maximum`}
                    </p>
                  </div>
                )}

                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Total Days Display */}
                {totalDays > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Total Leave Days:</strong> {totalDays} days
                    </p>
                    {selectedEmployee && leaveType && (
                      <p className={`text-sm ${totalDays > getLeaveBalance(selectedEmployee, leaveType) ? 'text-red-600' : 'text-green-600'}`}>
                        {totalDays > getLeaveBalance(selectedEmployee, leaveType) 
                          ? `⚠️ Insufficient balance (${getLeaveBalance(selectedEmployee, leaveType)} days available)`
                          : `✅ Sufficient balance available`
                        }
                      </p>
                    )}
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide a reason for the leave request..."
                    required
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isLeaveValid}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                      isLeaveValid 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Create Leave Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
