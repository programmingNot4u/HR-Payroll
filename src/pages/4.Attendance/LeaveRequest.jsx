import { useState, useEffect, useMemo } from 'react'

// Default leave policies (will be updated from localStorage)
const defaultLeavePolicies = {
  casualLeave: '10',
  sickLeave: '15',
  maternityLeave: '180',
  paternityLeave: '14',
  earnedLeave: '30',
  leaveWithoutPay: '0',
  maxCarryForward: '15'
}

// Sample leave types and their configurations (will be updated with policy values)
const getLeaveTypes = (policies) => [
  {
    id: 'casual',
    name: 'Casual Leave',
    maxDays: parseInt(policies.casualLeave) || 10,
    color: 'bg-blue-100 text-blue-800',
    description: 'Short-term personal leave for urgent matters',
    requiresApproval: false
  },
  {
    id: 'sick',
    name: 'Sick Leave',
    maxDays: parseInt(policies.sickLeave) || 15,
    color: 'bg-red-100 text-red-800',
    description: 'Medical leave with doctor certificate',
    requiresApproval: true
  },
  {
    id: 'annual',
    name: 'Annual Leave',
    maxDays: 21, // This seems to be a fixed value
    color: 'bg-green-100 text-green-800',
    description: 'Planned vacation leave',
    requiresApproval: true
  },
  {
    id: 'maternity',
    name: 'Maternity Leave',
    maxDays: parseInt(policies.maternityLeave) || 180,
    color: 'bg-pink-100 text-pink-800',
    description: 'Leave for expecting mothers',
    requiresApproval: true
  },
  {
    id: 'earned',
    name: 'Earned Leave',
    maxDays: parseInt(policies.earnedLeave) || 30,
    color: 'bg-purple-100 text-purple-800',
    description: 'Leave earned through overtime work',
    requiresApproval: false
  },
  {
    id: 'compensatory',
    name: 'Compensatory Leave',
    maxDays: 15, // This seems to be a fixed value
    color: 'bg-orange-100 text-orange-800',
    description: 'Leave in lieu of overtime',
    requiresApproval: false
  }
]

// Sample employee data
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
      casual: 8,
      sick: 12,
      annual: 18,
      maternity: 0,
      earned: 25
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
      casual: 7,
      sick: 13,
      annual: 21,
      maternity: 180,
      earned: 28
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
      casual: 6,
      sick: 9,
      annual: 15,
      maternity: 0,
      earned: 22
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
      casual: 9,
      sick: 11,
      annual: 20,
      maternity: 180,
      earned: 26
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
      casual: 5,
      sick: 8,
      annual: 16,
      maternity: 0,
      earned: 24
    }
  }
]

const departments = ['All', 'Sewing', 'Quality Control', 'Production', 'Cutting', 'Maintenance']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Production Manager', 'Cutting Master', 'Maintenance Engineer']

export default function LeaveRequest() {
  const [activeTab, setActiveTab] = useState('leaveRequest')
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
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 'LR001',
      employeeId: 'EMP001',
      employeeName: 'Ahmed Khan',
      leaveType: 'casual',
      leaveTypeName: 'Casual Leave',
      fromDate: '15/01/2024',
      toDate: '17/01/2024',
      duration: '3 days',
      reason: 'Family emergency',
      status: 'Pending',
      submittedDate: '14/01/2024'
    },
    {
      id: 'LR002',
      employeeId: 'EMP002',
      employeeName: 'Fatima Begum',
      leaveType: 'sick',
      leaveTypeName: 'Sick Leave',
      fromDate: '20/01/2024',
      toDate: '22/01/2024',
      duration: '3 days',
      reason: 'Medical treatment',
      status: 'Approved',
      submittedDate: '19/01/2024'
    },
    {
      id: 'LR003',
      employeeId: 'EMP003',
      employeeName: 'Mohammad Hassan',
      leaveType: 'annual',
      leaveTypeName: 'Annual Leave',
      fromDate: '25/01/2024',
      toDate: '30/01/2024',
      duration: '6 days',
      reason: 'Vacation with family',
      status: 'Pending',
      submittedDate: '23/01/2024'
    },
    {
      id: 'LR004',
      employeeId: 'EMP004',
      employeeName: 'Salma Khatun',
      leaveType: 'maternity',
      leaveTypeName: 'Maternity Leave',
      fromDate: '01/02/2024',
      toDate: '30/05/2024',
      duration: '120 days',
      reason: 'Maternity leave',
      status: 'Approved',
      submittedDate: '30/01/2024'
    },
    {
      id: 'LR005',
      employeeId: 'EMP005',
      employeeName: 'Karim Uddin',
      leaveType: 'earned',
      leaveTypeName: 'Earned Leave',
      fromDate: '10/02/2024',
      toDate: '12/02/2024',
      duration: '3 days',
      reason: 'Personal work',
      status: 'Approved',
      submittedDate: '08/02/2024'
    }
  ])
  const [employees, setEmployees] = useState(sampleEmployees)
  const [leavePolicies, setLeavePolicies] = useState(defaultLeavePolicies)
  const [trackingEmployeeId, setTrackingEmployeeId] = useState('')
  const [trackedEmployee, setTrackedEmployee] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Load leave policies from localStorage
  useEffect(() => {
    const savedPolicies = localStorage.getItem('leavePolicies')
    if (savedPolicies) {
      try {
        const parsedPolicies = JSON.parse(savedPolicies)
        setLeavePolicies(parsedPolicies)
      } catch (error) {
        console.error('Error loading leave policies:', error)
      }
    }
  }, [])

  // Listen for policy changes from other components
  useEffect(() => {
    const handlePolicyChange = () => {
      const savedPolicies = localStorage.getItem('leavePolicies')
      if (savedPolicies) {
        try {
          const parsedPolicies = JSON.parse(savedPolicies)
          setLeavePolicies(parsedPolicies)
        } catch (error) {
          console.error('Error loading leave policies:', error)
        }
      }
    }

    // Listen for storage changes
    window.addEventListener('storage', handlePolicyChange)
    
    // Also listen for custom policy change events
    window.addEventListener('leavePoliciesChanged', handlePolicyChange)

    return () => {
      window.removeEventListener('storage', handlePolicyChange)
      window.removeEventListener('leavePoliciesChanged', handlePolicyChange)
    }
  }, [])

  // Get leave types with current policy values
  const leaveTypes = useMemo(() => getLeaveTypes(leavePolicies), [leavePolicies])

  // Generate employees with policy-based leave balances
  const employeesWithPolicyBalances = useMemo(() => {
    const casualMax = parseInt(leavePolicies.casualLeave) || 10
    const sickMax = parseInt(leavePolicies.sickLeave) || 15
    const maternityMax = parseInt(leavePolicies.maternityLeave) || 180
    const earnedMax = parseInt(leavePolicies.earnedLeave) || 30

    return employees.map(employee => ({
      ...employee,
      leaveBalance: {
        casual: Math.max(0, casualMax - Math.floor(Math.random() * 5)), // Random used days
        sick: Math.max(0, sickMax - Math.floor(Math.random() * 3)),
        annual: Math.max(0, 21 - Math.floor(Math.random() * 5)), // Annual seems fixed at 21
        maternity: employee.gender === 'Female' ? Math.max(0, maternityMax - Math.floor(Math.random() * 20)) : 0,
        earned: Math.max(0, earnedMax - Math.floor(Math.random() * 8))
      }
    }))
  }, [leavePolicies, employees])

  // Filter employees based on selected filters
  const filteredEmployees = useMemo(() => {
    return employeesWithPolicyBalances.filter(employee => {
      const matchesId = !filters.employeeId || employee.id.toLowerCase().includes(filters.employeeId.toLowerCase()) || employee.name.toLowerCase().includes(filters.employeeId.toLowerCase())
      const matchesDepartment = filters.department === 'All' || employee.department === filters.department
      const matchesDesignation = filters.designation === 'All' || employee.designation === filters.designation
      const matchesLevelOfWork = filters.levelOfWork === 'All' || employee.levelOfWork === filters.levelOfWork
      
      return matchesId && matchesDepartment && matchesDesignation && matchesLevelOfWork
    })
  }, [filters, employeesWithPolicyBalances])

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
    return employees.find(emp => emp.id === selectedEmployee)
  }, [selectedEmployee, employees])

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
    const employee = employees.find(emp => emp.id === employeeId)
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

  // Handle status change
  const handleStatusChange = (requestId, newStatus) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus }
          : request
      )
    )
  }

  const handleEmployeeSearch = () => {
    if (!trackingEmployeeId.trim()) {
      setTrackedEmployee(null)
      return
    }
    
    const searchTerm = trackingEmployeeId.toLowerCase().trim()
    
    const employee = employeesWithPolicyBalances.find(emp => 
      emp.id.toLowerCase() === searchTerm ||
      emp.id.toLowerCase().includes(searchTerm) ||
      emp.name.toLowerCase().includes(searchTerm)
    )
    
    if (employee) {
      setTrackedEmployee(employee)
    } else {
      setTrackedEmployee(null)
    }
  }

  const getEmployeeLeaveRequests = (employeeId) => {
    return leaveRequests.filter(request => request.employeeId === employeeId)
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
        <h1 className="text-2xl font-semibold">Leave Management</h1>
        <p className="text-sm text-gray-500">Comprehensive leave management system for employees</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('leaveRequest')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leaveRequest'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leave Request
            </button>
            <button
              onClick={() => setActiveTab('leaveBalances')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leaveBalances'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employee Leave Balances
            </button>
            <button
              onClick={() => setActiveTab('leaveTracking')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leaveTracking'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employee Leave Tracking
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'leaveRequest' && (
            <div className="space-y-6">
              {/* Leave Request Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Leave Request</h2>
                  <p className="text-sm text-gray-500">All leave requests submitted from employee portal</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaveRequests.length > 0 ? leaveRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{request.employeeId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.fromDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.toDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.duration}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              request.leaveType === 'casual' ? 'bg-blue-100 text-blue-800' :
                              request.leaveType === 'sick' ? 'bg-red-100 text-red-800' :
                              request.leaveType === 'annual' ? 'bg-green-100 text-green-800' :
                              request.leaveType === 'maternity' ? 'bg-pink-100 text-pink-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.leaveTypeName}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.submittedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button className="text-orange-600 hover:text-orange-900">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <select
                                value={request.status}
                                onChange={(e) => handleStatusChange(request.id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approve</option>
                                <option value="Rejected">Reject</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                            No leave requests found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaveBalances' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="rounded border border-gray-200 bg-white p-6">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID/Name</label>
                    <input
                      type="text"
                      value={filters.employeeId}
                      onChange={(e) => handleFilterChange('employeeId', e.target.value)}
                      placeholder="Search by ID or name..."
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <select
                      value={filters.designation}
                      onChange={(e) => handleFilterChange('designation', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {designations.map(desig => (
                        <option key={desig} value={desig}>{desig}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level of Work</label>
                    <select
                      value={filters.levelOfWork}
                      onChange={(e) => handleFilterChange('levelOfWork', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="All">All</option>
                      <option value="Worker">Worker</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  <div>
                    <button
                      onClick={clearFilters}
                      className="h-10 px-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded hover:from-orange-500 hover:to-orange-700 font-medium transition-all duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Employee Leave Balances */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Employee Leave Balances</h2>
                  <p className="text-sm text-gray-500">Current leave balances for all employees</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Casual</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sick</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Annual</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Maternity</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Earned</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.length > 0 ? filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{employee.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
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
                            <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.casual, parseInt(leavePolicies.casualLeave) || 10)}`}>
                              {employee.leaveBalance.casual}/{parseInt(leavePolicies.casualLeave) || 10}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.sick, parseInt(leavePolicies.sickLeave) || 15)}`}>
                              {employee.leaveBalance.sick}/{parseInt(leavePolicies.sickLeave) || 15}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.annual, 21)}`}>
                              {employee.leaveBalance.annual}/21
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {employee.gender === 'Female' ? (
                              <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.maternity, parseInt(leavePolicies.maternityLeave) || 180)}`}>
                                {employee.leaveBalance.maternity}/{parseInt(leavePolicies.maternityLeave) || 180}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`text-sm font-medium ${getLeaveBalanceColor(employee.leaveBalance.earned, parseInt(leavePolicies.earnedLeave) || 30)}`}>
                              {employee.leaveBalance.earned}/{parseInt(leavePolicies.earnedLeave) || 30}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaveTracking' && (
            <div className="space-y-6">
              {/* Employee Search */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Employee Leave Tracking</h2>
                <p className="text-sm text-gray-500 mb-6">Search by employee ID to view their leave details and patterns</p>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID or Name</label>
                    <input
                      type="text"
                      value={trackingEmployeeId}
                      onChange={(e) => setTrackingEmployeeId(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEmployeeSearch()}
                      placeholder="Enter employee ID or name..."
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleEmployeeSearch}
                      className="h-10 px-6 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded hover:from-orange-500 hover:to-orange-700 font-medium transition-all duration-200"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {trackedEmployee && (
                  <div className="space-y-6">
                    {/* Employee Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Employee Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Employee ID</p>
                          <p className="font-medium text-gray-900">{trackedEmployee.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium text-gray-900">{trackedEmployee.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Department</p>
                          <p className="font-medium text-gray-900">{trackedEmployee.department}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Designation</p>
                          <p className="font-medium text-gray-900">{trackedEmployee.designation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Level of Work</p>
                          <p className="font-medium text-gray-900">{trackedEmployee.levelOfWork}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium text-gray-900">{trackedEmployee.gender}</p>
                        </div>
                      </div>
                    </div>

                    {/* Leave Balances */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Current Leave Balances</h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Casual Leave</p>
                            <p className={`text-2xl font-bold ${getLeaveBalanceColor(trackedEmployee.leaveBalance.casual, parseInt(leavePolicies.casualLeave) || 10)}`}>
                              {trackedEmployee.leaveBalance.casual}/{parseInt(leavePolicies.casualLeave) || 10}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Sick Leave</p>
                            <p className={`text-2xl font-bold ${getLeaveBalanceColor(trackedEmployee.leaveBalance.sick, parseInt(leavePolicies.sickLeave) || 15)}`}>
                              {trackedEmployee.leaveBalance.sick}/{parseInt(leavePolicies.sickLeave) || 15}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Annual Leave</p>
                            <p className={`text-2xl font-bold ${getLeaveBalanceColor(trackedEmployee.leaveBalance.annual, 21)}`}>
                              {trackedEmployee.leaveBalance.annual}/21
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Maternity Leave</p>
                            <p className={`text-2xl font-bold ${trackedEmployee.gender === 'Female' ? getLeaveBalanceColor(trackedEmployee.leaveBalance.maternity, parseInt(leavePolicies.maternityLeave) || 180) : 'text-gray-400'}`}>
                              {trackedEmployee.gender === 'Female' ? `${trackedEmployee.leaveBalance.maternity}/${parseInt(leavePolicies.maternityLeave) || 180}` : 'N/A'}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Earned Leave</p>
                            <p className={`text-2xl font-bold ${getLeaveBalanceColor(trackedEmployee.leaveBalance.earned, parseInt(leavePolicies.earnedLeave) || 30)}`}>
                              {trackedEmployee.leaveBalance.earned}/{parseInt(leavePolicies.earnedLeave) || 30}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Leave Requests History */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Leave Request History</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {getEmployeeLeaveRequests(trackedEmployee.id).length > 0 ? getEmployeeLeaveRequests(trackedEmployee.id).map((request) => (
                              <tr key={request.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    request.leaveType === 'casual' ? 'bg-blue-100 text-blue-800' :
                                    request.leaveType === 'sick' ? 'bg-red-100 text-red-800' :
                                    request.leaveType === 'annual' ? 'bg-green-100 text-green-800' :
                                    request.leaveType === 'maternity' ? 'bg-pink-100 text-pink-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {request.leaveTypeName}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.fromDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.toDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.duration}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {request.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.submittedDate}</td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                  No leave requests found for this employee
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {trackingEmployeeId && !trackedEmployee && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Employee not found</h3>
                        <p className="text-sm text-red-700 mt-1">No employee found with ID or name: "{trackingEmployeeId}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

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
