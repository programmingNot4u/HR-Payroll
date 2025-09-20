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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-20 left-20 animate-bounce" style={{animationDelay: '1s'}}>
          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-40 right-32 animate-bounce" style={{animationDelay: '3s'}}>
          <div className="w-6 h-6 bg-orange-300 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce" style={{animationDelay: '5s'}}>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10 px-4">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg animate-pulse">
              <svg className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
              Employee Portal
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="group">
                  <label htmlFor="employeeId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="employeeId"
                      name="employeeId"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                      placeholder="Enter your employee ID"
                      value={loginCredentials.employeeId}
                      onChange={(e) => setLoginCredentials({...loginCredentials, employeeId: e.target.value})}
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                      placeholder="Enter your password"
                      value={loginCredentials.password}
                      onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-orange-200 group-hover:text-orange-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </span>
                Sign In
              </button>
            </form>

            {/* Demo Credentials Card */}
            <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-semibold text-orange-800">Demo Credentials</h3>
              </div>
              <div className="text-sm text-orange-700 space-y-1">
                <p><span className="font-medium">Employee ID:</span> EMP001</p>
                <p><span className="font-medium">Password:</span> password123</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 HR Payroll System. All rights reserved.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent truncate">
                  Employee Portal
                </h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg truncate">Welcome back, <span className="font-semibold text-orange-600">{currentEmployee?.name}</span></p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{currentEmployee?.position} • {currentEmployee?.department}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-2 sm:pl-3">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-200 group-hover:text-red-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-2 sm:p-4 border border-white/20">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', name: 'Overview', shortName: 'Overview', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
              { id: 'attendance', name: 'Attendance', shortName: 'Attendance', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'payroll', name: 'Payroll', shortName: 'Payroll', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
              { id: 'leave', name: 'Leave Management', shortName: 'Leave', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { id: 'timesheet', name: 'Timesheet', shortName: 'Timesheet', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { id: 'assets', name: 'Assigned Assets', shortName: 'Assets', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center px-2 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 transition-colors ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-orange-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.shortName}</span>
                {activeTab === tab.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Employee ID</p>
                  <p className="text-lg font-semibold text-gray-900">{currentEmployee?.id}</p>
                </div>
                <div className="group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{currentEmployee?.name}</p>
                </div>
                <div className="group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Position</p>
                  <p className="text-lg font-semibold text-gray-900">{currentEmployee?.position}</p>
                </div>
                <div className="group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Department</p>
                  <p className="text-lg font-semibold text-gray-900">{currentEmployee?.department}</p>
                </div>
                <div className="group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{currentEmployee?.email}</p>
                </div>
                <div className="group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{currentEmployee?.phone}</p>
                </div>
                <div className="group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Join Date</p>
                  <p className="text-lg font-semibold text-gray-900">{currentEmployee?.joinDate}</p>
                </div>
                <div className="group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Manager</p>
                  <p className="text-lg font-semibold text-gray-900">{currentEmployee?.manager}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Attendance Rate</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">95%</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1 sm:mt-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 sm:h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Current Salary</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">৳{currentEmployee?.salary?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Monthly</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Leave Balance</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">12 days</p>
                    <p className="text-xs text-gray-500 mt-1">Remaining</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Assigned Assets</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{assignedAssets.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Attendance History</h3>
            </div>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check In</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check Out</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hours</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkIn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkOut}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{record.hours}h</td>
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
    </div>
  )
}
