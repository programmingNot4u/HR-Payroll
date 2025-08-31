import { useState, useEffect } from 'react'
import employeeService from '../services/employeeService'

export default function EmployeePersonalDashboard({ onLogout }) {
  const [employeeData, setEmployeeData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    console.log('EmployeePersonalDashboard useEffect triggered')
    
    const checkSession = () => {
      try {
        // Check if employee is logged in
        const session = localStorage.getItem('employeeSession')
        console.log('Employee session from localStorage:', session)
        
        if (!session) {
          console.log('No session found, setting error state')
          setError('No active session. Please login again.')
          setHasSession(false)
          setIsLoading(false)
          return
        }

        const { employeeId } = JSON.parse(session)
        console.log('Parsed employee ID from session:', employeeId)
        setHasSession(true)
        loadEmployeeData(employeeId)
      } catch (error) {
        console.error('Error parsing session:', error)
        setError('Invalid session data. Please login again.')
        localStorage.removeItem('employeeSession')
        setHasSession(false)
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const loadEmployeeData = async (employeeId) => {
    try {
      console.log('Loading employee data for ID:', employeeId)
      const data = await employeeService.getEmployeeById(employeeId)
      console.log('Loaded employee data:', data)
      
      if (data) {
        setEmployeeData(data)
        setError(null)
      } else {
        setError('Employee data not found. Please contact HR.')
      }
    } catch (error) {
      console.error('Error loading employee data:', error)
      setError('Failed to load employee data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('employeeSession')
    if (onLogout) {
      onLogout()
    }
  }

  const handleGoToLogin = () => {
    window.location.href = '/employee-login'
  }

  // Show error state
  if (error && !hasSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Session Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={handleGoToLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading employee data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your information</p>
        </div>
      </div>
    )
  }

  // Show error state for other errors
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  // Show loading state if no employee data
  if (!employeeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading employee data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your information</p>
        </div>
      </div>
    )
  }

  // Debug: Log the actual data structure
  console.log('Rendering with employee data:', employeeData)
  console.log('Attendance data:', employeeData.attendance)
  console.log('Payroll data:', employeeData.payroll)
  console.log('Leave balance data:', employeeData.leaveBalance)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {employeeData.name}</h1>
              <p className="text-gray-600">{employeeData.designation} • {employeeData.department}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'payroll', label: 'Payroll' },
              { id: 'leave', label: 'Leave' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance</h3>
              <p className="text-3xl font-bold text-blue-600">{employeeData.attendance?.currentMonth?.present || 0} days</p>
              <p className="text-sm text-gray-500">Present this month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Salary</h3>
              <p className="text-3xl font-bold text-green-600">৳{(employeeData.payroll?.currentMonth?.netSalary || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Net salary this month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Balance</h3>
              <p className="text-3xl font-bold text-orange-600">{(employeeData.leaveBalance?.casual || 0) + (employeeData.leaveBalance?.annual || 0)}</p>
              <p className="text-sm text-gray-500">Available leave days</p>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{employeeData.attendance?.currentMonth?.present || 0}</p>
                <p className="text-sm text-gray-500">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{employeeData.attendance?.currentMonth?.absent || 0}</p>
                <p className="text-sm text-gray-500">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{employeeData.attendance?.currentMonth?.overtime || 0}</p>
                <p className="text-sm text-gray-500">Overtime Hours</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payroll Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Gross Salary:</span>
                <span className="font-medium">৳{(employeeData.grossSalary || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Net Salary:</span>
                <span className="font-medium text-green-600">৳{(employeeData.payroll?.currentMonth?.netSalary || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Balance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{employeeData.leaveBalance?.casual || 0}</p>
                <p className="text-sm text-gray-500">Casual Leave</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{employeeData.leaveBalance?.annual || 0}</p>
                <p className="text-sm text-gray-500">Annual Leave</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
