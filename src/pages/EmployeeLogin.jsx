import { useState, useEffect } from 'react'
import employeeService from '../services/employeeService'

export default function EmployeeLogin({ onLoginSuccess, onBackToHR }) {
  const [credentials, setCredentials] = useState({
    employeeId: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')

  // Test the service on component mount
  useEffect(() => {
    try {
      console.log('EmployeeLogin component mounted')
      console.log('employeeService available:', !!employeeService)
      console.log('employeeService methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(employeeService)))
      
      const employees = employeeService.getAllEmployees()
      console.log('Available employees:', employees)
      
      const credentials = JSON.parse(localStorage.getItem('hr_employee_credentials') || '{}')
      console.log('Available credentials:', credentials)
      
      setDebugInfo(`Service loaded: ${!!employeeService}, Employees: ${employees.length}, Credentials: ${Object.keys(credentials).length}`)
    } catch (error) {
      console.error('Error testing service:', error)
      setDebugInfo(`Service error: ${error.message}`)
    }
  }, [])

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // In a real app, this would make an API call to verify credentials
      // For now, we'll simulate authentication with sample data
      const isValid = await authenticateEmployee(credentials.employeeId, credentials.password)
      
      if (isValid) {
        // Store employee session
        localStorage.setItem('employeeSession', JSON.stringify({
          employeeId: credentials.employeeId,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        }))
        
        // Call success callback
        if (onLoginSuccess) {
          onLoginSuccess()
        }
      } else {
        setError('Invalid Employee ID or Password. Please check your credentials.')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Authenticate employee using service
  const authenticateEmployee = async (employeeId, password) => {
    try {
      return await employeeService.authenticateEmployee(employeeId, password)
    } catch (error) {
      console.error('Authentication error:', error)
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBackToHR}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to HR
            </button>
          </div>
          <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Portal</h2>
          <p className="text-gray-600">Sign in to access your employee dashboard</p>
          
          {/* Debug Info */}
          {debugInfo && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              <p className="font-semibold">Debug Info:</p>
              <p>{debugInfo}</p>
            </div>
          )}
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                required
                value={credentials.employeeId}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your Employee ID"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Need help logging in?
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <p>• Contact your HR department for login credentials</p>
                <p>• Employee ID format: EMP001, EMP002, etc.</p>
                <p>• Default password: password123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © 2024 Garment Manufacturing Company. Employee Portal.
          </p>
        </div>
      </div>
    </div>
  )
}
