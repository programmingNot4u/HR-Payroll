import { useState, useEffect } from 'react'

export default function EmployeePortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [loginCredentials, setLoginCredentials] = useState({
    employeeId: '',
    password: ''
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [leaveRequest, setLeaveRequest] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: ''
  })

  // Mock employee data
  const mockEmployee = {
    id: 'EMP001',
    name: 'Ahmed Khan',
    position: 'Senior Software Developer',
    department: 'IT',
    email: 'ahmed.khan@company.com',
    phone: '+880-1234-567890',
    joinDate: '2023-01-15',
    salary: 85000,
    status: 'Active',
    manager: 'Fatima Rahman',
    location: 'Dhaka Office',
    employeeType: 'Full-time',
    workHours: '9:00 AM - 6:00 PM',
    address: '123 Main Street, Dhaka, Bangladesh',
    emergencyContact: '+880-1234-567891',
    bankAccount: '1234567890',
    taxId: 'TAX123456'
  }

  // Mock data for different sections
  const attendanceData = [
    { date: '2024-01-15', checkIn: '09:00', checkOut: '18:00', status: 'Present', hours: 9 },
    { date: '2024-01-14', checkIn: '09:15', checkOut: '18:30', status: 'Present', hours: 9.25 },
    { date: '2024-01-13', checkIn: '08:45', checkOut: '17:45', status: 'Present', hours: 9 },
    { date: '2024-01-12', checkIn: '09:30', checkOut: '18:15', status: 'Late', hours: 8.75 },
    { date: '2024-01-11', checkIn: '09:00', checkOut: '18:00', status: 'Present', hours: 9 }
  ]

  const payrollData = [
    { month: 'January 2024', basicSalary: 70000, allowances: 10000, overtime: 5000, deductions: 2000, netSalary: 83000 },
    { month: 'December 2023', basicSalary: 70000, allowances: 10000, overtime: 3000, deductions: 1500, netSalary: 81500 },
    { month: 'November 2023', basicSalary: 70000, allowances: 10000, overtime: 4000, deductions: 1800, netSalary: 82200 }
  ]

  const leaveHistory = [
    { id: 1, type: 'Annual Leave', startDate: '2024-01-10', endDate: '2024-01-12', days: 3, status: 'Approved', reason: 'Family vacation' },
    { id: 2, type: 'Sick Leave', startDate: '2023-12-15', endDate: '2023-12-15', days: 1, status: 'Approved', reason: 'Medical appointment' },
    { id: 3, type: 'Personal Leave', startDate: '2023-11-20', endDate: '2023-11-21', days: 2, status: 'Pending', reason: 'Personal matters' }
  ]

  const assignedAssets = [
    { id: 'AST-001', name: 'HP Laptop EliteBook 840', category: 'Electronics', assignedDate: '2023-01-15', status: 'Active', location: 'Office Desk' },
    { id: 'AST-002', name: 'Office Chair Ergonomic', category: 'Furniture', assignedDate: '2023-01-15', status: 'Active', location: 'Workstation' }
  ]

  const timesheetData = [
    { date: '2024-01-15', project: 'HR System Development', hours: 8, description: 'Frontend development and testing' },
    { date: '2024-01-14', project: 'HR System Development', hours: 7.5, description: 'Backend API integration' },
    { date: '2024-01-13', project: 'Bug Fixes', hours: 6, description: 'Resolving critical issues' },
    { date: '2024-01-12', project: 'HR System Development', hours: 8.5, description: 'Database optimization' }
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    // Simple mock authentication
    if (loginCredentials.employeeId === 'EMP001' && loginCredentials.password === 'password123') {
      setCurrentEmployee(mockEmployee)
      setIsLoggedIn(true)
    } else {
      alert('Invalid credentials. Use EMP001 / password123 for demo')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentEmployee(null)
    setLoginCredentials({ employeeId: '', password: '' })
  }

  const handleLeaveRequest = (e) => {
    e.preventDefault()
    // Mock leave request submission
    alert('Leave request submitted successfully!')
    setLeaveRequest({ type: '', startDate: '', endDate: '', reason: '', emergencyContact: '' })
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Employee Portal Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access your personal information and work history
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="employeeId" className="sr-only">Employee ID</label>
                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Employee ID"
                  value={loginCredentials.employeeId}
                  onChange={(e) => setLoginCredentials({...loginCredentials, employeeId: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Sign In
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Demo Credentials:</p>
              <p>Employee ID: EMP001</p>
              <p>Password: password123</p>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employee Portal</h1>
          <p className="text-gray-600 mt-1">Welcome back, {currentEmployee?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'attendance', name: 'Attendance' },
            { id: 'payroll', name: 'Payroll' },
            { id: 'leave', name: 'Leave Management' },
            { id: 'timesheet', name: 'Timesheet' },
            { id: 'assets', name: 'Assigned Assets' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="text-sm font-medium text-gray-900">{currentEmployee?.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">{currentEmployee?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="text-sm font-medium text-gray-900">{currentEmployee?.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-sm font-medium text-gray-900">{currentEmployee?.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{currentEmployee?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{currentEmployee?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="text-sm font-medium text-gray-900">{currentEmployee?.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Manager</p>
                  <p className="text-sm font-medium text-gray-900">{currentEmployee?.manager}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">95%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Current Salary</p>
                    <p className="text-2xl font-semibold text-gray-900">৳{currentEmployee?.salary?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Leave Balance</p>
                    <p className="text-2xl font-semibold text-gray-900">12 days</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Assigned Assets</p>
                    <p className="text-2xl font-semibold text-gray-900">{assignedAssets.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkIn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkOut}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.hours}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrollData.map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{record.basicSalary.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{record.allowances.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{record.overtime.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{record.deductions.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">৳{record.netSalary.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="space-y-6">
            {/* Leave Request Form */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Leave</h3>
              <form onSubmit={handleLeaveRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                    <select
                      value={leaveRequest.type}
                      onChange={(e) => setLeaveRequest({...leaveRequest, type: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Personal Leave">Personal Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                    <input
                      type="text"
                      value={leaveRequest.emergencyContact}
                      onChange={(e) => setLeaveRequest({...leaveRequest, emergencyContact: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={leaveRequest.startDate}
                      onChange={(e) => setLeaveRequest({...leaveRequest, startDate: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={leaveRequest.endDate}
                      onChange={(e) => setLeaveRequest({...leaveRequest, endDate: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <textarea
                    value={leaveRequest.reason}
                    onChange={(e) => setLeaveRequest({...leaveRequest, reason: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Submit Leave Request
                </button>
              </form>
            </div>

            {/* Leave History */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveHistory.map((leave) => (
                      <tr key={leave.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.startDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.endDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.days}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timesheet' && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timesheet</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timesheetData.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.hours}h</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedAssets.map((asset) => (
                <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{asset.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      asset.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600"><span className="font-medium">Asset ID:</span> {asset.id}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Category:</span> {asset.category}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Assigned Date:</span> {asset.assignedDate}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Location:</span> {asset.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
