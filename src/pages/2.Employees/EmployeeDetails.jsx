import { useState, useEffect, useCallback, useMemo } from 'react'
import employeeService from '../../services/employeeService'
import organizationalDataService from '../../services/organizationalDataService'

// Success Animation Component
function SuccessAnimation({ show, onClose }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
        {/* Success Checkmark Animation */}
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-green-600 animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>
        
        {/* Success Message */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Changes Saved!
        </h3>
        <p className="text-gray-600 mb-4">
          Employee information has been updated successfully.
        </p>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded-lg hover:from-orange-400 hover:to-orange-500 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}

// Activity Log Modal Component
function ActivityLogModal({ show, onClose, logs, employeeName }) {
  if (!show) return null

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Activity Log</h3>
            <p className="text-sm text-gray-500">Employee: {employeeName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {logs.length > 0 ? (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          log.action === 'Employee Created' ? 'bg-green-100 text-green-800' :
                          log.action === 'Field Updated' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.action}
                        </span>
                        <span className="text-sm text-gray-500">{log.field}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{log.description}</p>
                      {log.oldValue && log.newValue && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Changed from:</span> {log.oldValue} 
                          <span className="mx-2">→</span>
                          <span className="font-medium">to:</span> {log.newValue}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-500 ml-4">
                      <div>{formatDateTime(log.timestamp)}</div>
                      <div className="font-medium">{log.changedBy}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No activity logs</h3>
              <p className="mt-1 text-sm text-gray-500">No changes have been recorded for this employee yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeDetails() {
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')
  const [searchId, setSearchId] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState(null)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [activityLogs, setActivityLogs] = useState([])

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true)
        const employeeId = localStorage.getItem('selectedEmployeeId')
        if (employeeId) {
          const employeeData = await employeeService.getEmployeeById(employeeId)
          setEmployee(employeeData)
        }
      } catch (error) {
        console.error('Error loading employee:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadEmployee()
  }, [])

  // Log activity changes
  const logActivity = (field, oldValue, newValue, action = 'Field Updated') => {
    if (!employee || !employee.id) return

    // Format field name for display
    const formatFieldName = (fieldName) => {
      return fieldName
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/_/g, ' ') // Replace underscores with spaces
    }

    // Create better descriptions
    let description = ''
    if (action === 'Field Updated') {
      if (oldValue === '' && newValue !== '') {
        description = `${formatFieldName(field)} was set to "${newValue}"`
      } else if (oldValue !== '' && newValue === '') {
        description = `${formatFieldName(field)} was cleared`
      } else {
        description = `${formatFieldName(field)} was changed from "${oldValue || 'empty'}" to "${newValue || 'empty'}"`
      }
    } else {
      description = `${formatFieldName(field)}: ${action}`
    }

    const newLog = {
      id: Date.now() + Math.random(), // More unique ID generation
      timestamp: new Date(),
      action: action,
      field: formatFieldName(field),
      oldValue: oldValue,
      newValue: newValue,
      changedBy: 'Current User', // In a real app, this would be the logged-in user
      description: description
    }

    console.log('Creating activity log:', newLog)

    // Get existing logs
    const storedLogs = localStorage.getItem(`employee_activity_logs_${employee.id}`)
    const existingLogs = storedLogs ? JSON.parse(storedLogs) : []
    
    // Add new log
    const updatedLogs = [newLog, ...existingLogs]
    
    // Save to localStorage
    localStorage.setItem(`employee_activity_logs_${employee.id}`, JSON.stringify(updatedLogs))
    
    // Update state
    setActivityLogs(updatedLogs.map(log => ({
      ...log,
      timestamp: new Date(log.timestamp)
    })))
  }

  // Compare and log changes between original and edited employee data
  const logChanges = (originalEmployee, editedEmployee) => {
    if (!originalEmployee || !editedEmployee) return

    console.log('Logging changes between:', originalEmployee, editedEmployee)

    // Get all fields from both objects
    const allFields = new Set([...Object.keys(originalEmployee), ...Object.keys(editedEmployee)])
    
    let changesCount = 0
    
    allFields.forEach(field => {
      const oldValue = originalEmployee[field]
      const newValue = editedEmployee[field]

      // Skip internal fields that shouldn't be logged
      const skipFields = ['id', 'createdAt', 'updatedAt', 'picture']
      if (skipFields.includes(field)) return

      // Handle null/undefined values
      const normalizedOldValue = oldValue === null || oldValue === undefined ? '' : oldValue
      const normalizedNewValue = newValue === null || newValue === undefined ? '' : newValue

      // Handle different data types
      if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        // For arrays, compare JSON strings
        const oldJson = JSON.stringify(oldValue || [])
        const newJson = JSON.stringify(newValue || [])
        if (oldJson !== newJson) {
          console.log(`Array change detected in ${field}:`, oldValue, '->', newValue)
          
          // Special handling for specific array types
          if (field === 'workExperience') {
            const oldSummary = oldValue?.length > 0 ? `${oldValue.length} experience(s)` : 'No experience'
            const newSummary = newValue?.length > 0 ? `${newValue.length} experience(s)` : 'No experience'
            logActivity(field, oldSummary, newSummary)
          } else if (field === 'processExpertise') {
            const oldSummary = oldValue?.length > 0 ? `${oldValue.length} expertise(s)` : 'No expertise'
            const newSummary = newValue?.length > 0 ? `${newValue.length} expertise(s)` : 'No expertise'
            logActivity(field, oldSummary, newSummary)
          } else if (field === 'processEfficiency') {
            const oldSummary = oldValue?.length > 0 ? `${oldValue.length} efficiency record(s)` : 'No efficiency records'
            const newSummary = newValue?.length > 0 ? `${newValue.length} efficiency record(s)` : 'No efficiency records'
            logActivity(field, oldSummary, newSummary)
          } else {
            // Generic array handling
            logActivity(field, `${oldValue?.length || 0} items`, `${newValue?.length || 0} items`)
          }
          changesCount++
        }
      } else if (typeof oldValue === 'object' && typeof newValue === 'object' && oldValue !== null && newValue !== null) {
        // For objects, compare JSON strings
        const oldJson = JSON.stringify(oldValue)
        const newJson = JSON.stringify(newValue)
        if (oldJson !== newJson) {
          console.log(`Object change detected in ${field}:`, oldValue, '->', newValue)
          
          // Special handling for address objects
          if (field.includes('Address') || field.includes('address')) {
            const formatAddress = (addr) => {
              if (!addr || typeof addr !== 'object') return 'Not provided'
              const parts = []
              if (addr.houseNumber) parts.push(addr.houseNumber)
              if (addr.village) parts.push(addr.village)
              if (addr.upazilla) parts.push(addr.upazilla)
              if (addr.district) parts.push(addr.district)
              return parts.length > 0 ? parts.join(', ') : 'Not provided'
            }
            
            const oldAddr = formatAddress(oldValue)
            const newAddr = formatAddress(newValue)
            logActivity(field, oldAddr, newAddr)
          } else {
            // For other objects, show a summary of the change
            const oldSummary = Object.keys(oldValue).length > 0 ? `${Object.keys(oldValue).length} properties` : 'Empty object'
            const newSummary = Object.keys(newValue).length > 0 ? `${Object.keys(newValue).length} properties` : 'Empty object'
            logActivity(field, oldSummary, newSummary)
          }
          changesCount++
        }
      } else if (normalizedOldValue !== normalizedNewValue) {
        // For primitive values
        console.log(`Primitive change detected in ${field}:`, normalizedOldValue, '->', normalizedNewValue)
        logActivity(field, normalizedOldValue, normalizedNewValue)
        changesCount++
      }
    })
    
    console.log(`Total changes detected: ${changesCount}`)
  }

  // Load activity logs for the employee
  const loadActivityLogs = async () => {
    try {
      // Check if employee exists and has activity logs
      if (!employee || !employee.id) {
        setActivityLogs([])
        return
      }

      // Try to get activity logs from localStorage or employee data
      const storedLogs = localStorage.getItem(`employee_activity_logs_${employee.id}`)
      if (storedLogs) {
        const logs = JSON.parse(storedLogs)
        // Convert timestamp strings back to Date objects
        const parsedLogs = logs.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }))
        setActivityLogs(parsedLogs)
      } else {
        // If no stored logs, create a basic creation log if employee exists
        if (employee.createdAt || employee.dateOfJoining) {
          const creationLog = {
            id: 1,
            timestamp: new Date(employee.createdAt || employee.dateOfJoining || new Date()),
            action: 'Employee Created',
            field: 'All Fields',
            oldValue: null,
            newValue: 'Initial employee record created',
            changedBy: 'System',
            description: 'Employee record was created in the system'
          }
          setActivityLogs([creationLog])
        } else {
          setActivityLogs([])
        }
      }
    } catch (error) {
      console.error('Error loading activity logs:', error)
      setActivityLogs([])
    }
  }

  // Generate print content
  const generatePrintContent = (employee) => {
    const formatDate = (dateString) => {
      if (!dateString) return 'Not provided'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Details - ${employee.name || employee.nameEnglish || 'Unknown'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 5px 0; color: #666; }
          .section { margin-bottom: 25px; }
          .section h2 { background: #f5f5f5; padding: 10px; margin: 0 0 15px 0; border-left: 4px solid #ff6b35; }
          .field { margin-bottom: 10px; }
          .field-label { font-weight: bold; display: inline-block; width: 200px; }
          .field-value { display: inline-block; }
          .photo-section { text-align: center; margin-bottom: 20px; }
          .photo-placeholder { width: 120px; height: 120px; border: 2px dashed #ccc; display: inline-block; line-height: 120px; color: #666; }
          .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .status-active { background: #d4edda; color: #155724; }
          .status-inactive { background: #f8d7da; color: #721c24; }
          .print-date { text-align: right; font-size: 12px; color: #666; margin-bottom: 20px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="print-date">Printed on: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}</div>
        
        <div class="header">
          <h1>Employee Details</h1>
          <p>Employee ID: ${employee.employeeId || employee.id || 'N/A'}</p>
          <p>Status: <span class="status-badge status-${employee.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}">${employee.status || 'Unknown'}</span></p>
        </div>

        <div class="photo-section">
          ${employee.picture ? 
            `<img src="${employee.picture}" alt="Employee Photo" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;">` :
            `<div class="photo-placeholder">No Photo</div>`
          }
        </div>

        <div class="section">
          <h2>Personal Information</h2>
          <div class="field"><span class="field-label">Name (English):</span> <span class="field-value">${employee.name || employee.nameEnglish || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Name (Bangla):</span> <span class="field-value">${employee.nameBangla || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Mobile Number:</span> <span class="field-value">${employee.phone || employee.mobileNumber || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Email:</span> <span class="field-value">${employee.email || employee.emailAddress || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Date of Birth:</span> <span class="field-value">${formatDate(employee.dateOfBirth)}</span></div>
          <div class="field"><span class="field-label">Gender:</span> <span class="field-value">${employee.gender || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">NID Number:</span> <span class="field-value">${employee.nidNumber || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Blood Group:</span> <span class="field-value">${employee.bloodGroup || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Religion:</span> <span class="field-value">${employee.religion || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Marital Status:</span> <span class="field-value">${employee.maritalStatus || 'Not provided'}</span></div>
        </div>

        <div class="section">
          <h2>Administrative Information</h2>
          <div class="field"><span class="field-label">Designation:</span> <span class="field-value">${employee.designation || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Department:</span> <span class="field-value">${employee.department || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Level of Work:</span> <span class="field-value">${employee.levelOfWork || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Salary Grade:</span> <span class="field-value">${employee.salaryGrade || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Gross Salary:</span> <span class="field-value">${employee.grossSalary ? `৳${employee.grossSalary.toLocaleString()}` : 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Date of Joining:</span> <span class="field-value">${formatDate(employee.dateOfJoining || employee.joiningDate)}</span></div>
          <div class="field"><span class="field-label">Supervisor:</span> <span class="field-value">${employee.supervisorName || 'Not provided'}</span></div>
        </div>

        ${employee.emergencyContact ? `
        <div class="section">
          <h2>Emergency Contact</h2>
          <div class="field"><span class="field-label">Name:</span> <span class="field-value">${employee.emergencyContact.name || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Mobile:</span> <span class="field-value">${employee.emergencyContact.mobile || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Relation:</span> <span class="field-value">${employee.emergencyContact.relation || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Address:</span> <span class="field-value">${employee.emergencyContact.address || 'Not provided'}</span></div>
        </div>
        ` : ''}

        <div class="section">
          <h2>Address Information</h2>
          <h3>Present Address</h3>
          <div class="field"><span class="field-label">House Number/Name:</span> <span class="field-value">${employee.presentAddress?.houseOwnerName || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Village/Area:</span> <span class="field-value">${employee.presentAddress?.village || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Post Office:</span> <span class="field-value">${employee.presentAddress?.postOffice || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Upazilla/City Corporation:</span> <span class="field-value">${employee.presentAddress?.upazilla || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">District:</span> <span class="field-value">${employee.presentAddress?.district || 'Not provided'}</span></div>
          
          <h3>Permanent Address</h3>
          <div class="field"><span class="field-label">House Number/Name:</span> <span class="field-value">${employee.permanentAddress?.houseOwnerName || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Village/Area:</span> <span class="field-value">${employee.permanentAddress?.village || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Post Office:</span> <span class="field-value">${employee.permanentAddress?.postOffice || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">Upazilla/City Corporation:</span> <span class="field-value">${employee.permanentAddress?.upazilla || 'Not provided'}</span></div>
          <div class="field"><span class="field-label">District:</span> <span class="field-value">${employee.permanentAddress?.district || 'Not provided'}</span></div>
        </div>
      </body>
      </html>
    `
  }

  // Search employee by ID - memoized to prevent re-creation
  const handleSearch = useCallback(async () => {
    if (!searchId.trim()) {
      setSearchError('Please enter an employee ID')
      return
    }

    try {
      setSearchLoading(true)
      setSearchError('')
      
      // Get all employees to search through both id and employeeId fields
      const allEmployees = await employeeService.getAllEmployees()
      
      // Search for employee by both auto-generated id and user-entered employeeId
      let foundEmployee = null
      
      // First try exact match with auto-generated ID
      const formattedId = searchId.startsWith('EMP') ? searchId : `EMP${searchId.padStart(3, '0')}`
      foundEmployee = allEmployees.find(emp => emp.id === formattedId)
      
      // If not found, try searching by employeeId field
      if (!foundEmployee) {
        foundEmployee = allEmployees.find(emp => 
          emp.employeeId === searchId || 
          emp.employeeId === formattedId ||
          emp.id === searchId
        )
      }
      
      if (foundEmployee) {
        setEmployee(foundEmployee)
        // Update localStorage with the found employee's ID
        localStorage.setItem('selectedEmployeeId', foundEmployee.id)
      } else {
        setSearchError('Employee not found with ID: ' + searchId)
        setEmployee(null)
      }
    } catch (error) {
      console.error('Error searching employee:', error)
      setSearchError('Error searching for employee')
    } finally {
      setSearchLoading(false)
    }
  }, [searchId])

  // Handle Enter key press in search input - memoized to prevent re-creation
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])


  // Search Bar Component (always visible) - memoized to prevent re-creation
  const SearchBar = useMemo(() => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee by ID</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value)
                // Clear employee data when search becomes empty
                if (!e.target.value.trim()) {
                  setEmployee(null)
                  setSearchError('')
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter employee ID (e.g., 001, EMP001, or custom ID)"
              className="flex-1 h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-4 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {searchLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
          {searchError && (
            <p className="mt-2 text-sm text-red-600">{searchError}</p>
          )}
        </div>
      </div>
    </div>
  ), [searchId, searchLoading, searchError, handleSearch, handleKeyPress])

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Success Animation */}
        <SuccessAnimation 
          show={showSuccessAnimation} 
          onClose={() => setShowSuccessAnimation(false)} 
        />
        
        {SearchBar}
        <div>
          <h1 className="text-2xl font-semibold">Employee Details</h1>
          <div className="flex items-center space-x-2 mt-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Loading employee details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!employee || !searchId.trim()) {
    return (
      <div className="space-y-6">
        {/* Success Animation */}
        <SuccessAnimation 
          show={showSuccessAnimation} 
          onClose={() => setShowSuccessAnimation(false)} 
        />
        
        {SearchBar}
        <div>
          <h1 className="text-2xl font-semibold">Employee Details</h1>
          <p className="text-sm text-gray-500">
            {!searchId.trim() ? 'Enter an employee ID to search for details.' : 'No employee found with the given ID.'}
          </p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const tabs = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'children', name: 'Children Information' },
    { id: 'address', name: 'Address Information' },
    { id: 'experience', name: 'Working Experience' },
    { id: 'emergency', name: 'Emergency Contact' },
    { id: 'administrative', name: 'Administrative Info' },
    { id: 'nominee', name: 'Nominee Information' }
  ]

  return (
    <div className="space-y-6">
      {/* Success Animation */}
      <SuccessAnimation 
        show={showSuccessAnimation} 
        onClose={() => setShowSuccessAnimation(false)} 
      />
      
      {/* Activity Log Modal */}
      <ActivityLogModal 
        show={showActivityLog} 
        onClose={() => setShowActivityLog(false)}
        logs={activityLogs}
        employeeName={employee?.name || employee?.nameEnglish || 'Unknown Employee'}
      />
      
      {SearchBar}

      {/* Header - only show if employee exists and search was performed */}
      {employee && searchId.trim() && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Employee Details</h1>
            <p className="text-sm text-gray-500">Complete employee information and records</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-semibold">{searchId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              {isEditMode ? (
                <select
                  value={(isEditMode ? editedEmployee : employee)?.status || ''}
                  onChange={(e) => {
                    if (editedEmployee) {
                      setEditedEmployee(prev => ({ ...prev, status: e.target.value }))
                    }
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Terminated">Terminated</option>
                </select>
              ) : (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                  employee.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                  employee.status === 'Terminated' ? 'bg-red-100 text-red-800' :
                  employee.status === 'New Joined' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {employee.status || 'Unknown'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Employee Photo and Basic Info */}
      {employee && searchId.trim() && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center relative">
                {isEditMode ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            if (editedEmployee) {
                              setEditedEmployee(prev => ({ ...prev, picture: e.target.result }))
                            }
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                      id="picture-upload"
                    />
                    <label
                      htmlFor="picture-upload"
                      className="cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {(isEditMode ? editedEmployee : employee)?.picture ? (
                        <img 
                          src={(isEditMode ? editedEmployee : employee).picture} 
                          alt="Employee" 
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="text-center">
                          <svg className="mx-auto h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                        </div>
                      )}
                    </label>
                    {(isEditMode ? editedEmployee : employee)?.picture && (
                      <button
                        onClick={() => {
                          if (editedEmployee) {
                            setEditedEmployee(prev => ({ ...prev, picture: null }))
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        title="Remove picture"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {(isEditMode ? editedEmployee : employee)?.picture ? (
                      <img 
                        src={(isEditMode ? editedEmployee : employee).picture} 
                        alt="Employee" 
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-gray-500 mt-1">No Photo</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {employee.name || employee.nameEnglish || 'Name not provided'}
              </h2>
              <p className="text-gray-600">{employee.nameBangla || 'Name in Bangla not provided'}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>{employee.designation || 'Designation not provided'}</span>
                <span>•</span>
                <span>{employee.department || 'Department not provided'}</span>
                <span>•</span>
                <span>{employee.levelOfWork || 'Level not provided'}</span>
              </div>
            </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  // Create a print-friendly version
                  const printWindow = window.open('', '_blank')
                  const printContent = generatePrintContent(employee)
                  printWindow.document.write(printContent)
                  printWindow.document.close()
                  printWindow.focus()
                  printWindow.print()
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print</span>
              </button>
              <button
                onClick={async () => {
                  await loadActivityLogs()
                  setShowActivityLog(true)
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Activity Log</span>
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    setIsEditMode(false)
                    setEditedEmployee(null)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </button>
              )}
              <button
                onClick={async () => {
                  if (!isEditMode) {
                    // Enter edit mode
                    setEditedEmployee({ ...employee })
                    setIsEditMode(true)
                  } else {
                    // Save changes and exit edit mode
                    try {
                      if (editedEmployee) {
                        console.log('Original employee data:', employee)
                        console.log('Edited employee data:', editedEmployee)
                        
                        // Log changes before saving
                        logChanges(employee, editedEmployee)
                        
                        // Save to database
                        const updatedEmployee = await employeeService.updateEmployee(employee.id, editedEmployee)
                        
                        if (updatedEmployee) {
                          // Update the main employee state
                          setEmployee(updatedEmployee)
                          console.log('Changes saved successfully:', updatedEmployee)
                          
                          // Show success animation
                          setShowSuccessAnimation(true)
                          
                          // Auto-hide animation after 3 seconds
                          setTimeout(() => {
                            setShowSuccessAnimation(false)
                          }, 3000)
                        } else {
                          throw new Error('Failed to update employee')
                        }
                      }
                    } catch (error) {
                      console.error('Error saving changes:', error)
                      alert('Error saving changes. Please try again.')
                    } finally {
                      setIsEditMode(false)
                      setEditedEmployee(null)
                    }
                  }
                }}
                className={`px-4 py-2 rounded flex items-center space-x-2 ${
                  isEditMode 
                    ? 'bg-gradient-to-r from-orange-300 to-orange-400 text-white hover:from-orange-400 hover:to-orange-500' 
                    : 'bg-gradient-to-r from-orange-300 to-orange-400 text-white hover:from-orange-400 hover:to-orange-500'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>{isEditMode ? 'Save Changes' : 'Edit Information'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      {employee && searchId.trim() && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'personal' && <PersonalInformationSection employee={isEditMode ? editedEmployee : employee} formatDate={formatDate} isEditMode={isEditMode} onUpdate={setEditedEmployee} />}
            {activeTab === 'children' && <ChildrenInformationSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={setEditedEmployee} />}
            {activeTab === 'address' && <AddressInformationSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={setEditedEmployee} />}
            {activeTab === 'experience' && <WorkingExperienceSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={setEditedEmployee} />}
            {activeTab === 'emergency' && <EmergencyContactSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={setEditedEmployee} />}
            {activeTab === 'administrative' && <AdministrativeInfoSection employee={isEditMode ? editedEmployee : employee} formatDate={formatDate} isEditMode={isEditMode} onUpdate={setEditedEmployee} />}
            {activeTab === 'nominee' && <NomineeInformationSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={setEditedEmployee} />}
          </div>
        </div>
      )}

    </div>
  )
}

// Personal Information Section Component
function PersonalInformationSection({ employee, formatDate, isEditMode, onUpdate }) {
  const handleFieldChange = (field, value) => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => ({ ...prev, [field]: value }))
    }
  }
  
  // This function will be used when implementing full edit mode for all fields
  console.log('Edit mode available:', isEditMode, 'Field change handler:', handleFieldChange)
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name (In Bangla) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (In Bangla) *</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.nameBangla || ''}
              onChange={(e) => handleFieldChange('nameBangla', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name in Bangla"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.nameBangla || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Name (In English) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (In English) *</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.name || employee.nameEnglish || ''}
              onChange={(e) => handleFieldChange('nameEnglish', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name in English"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.name || employee.nameEnglish || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
          {isEditMode ? (
            <input
              type="tel"
              value={employee.phone || employee.mobileNumber || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter mobile number"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.phone || employee.mobileNumber || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          {isEditMode ? (
            <input
              type="email"
              value={employee.email || employee.emailAddress || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.email || employee.emailAddress || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.nationality || ''}
              onChange={(e) => handleFieldChange('nationality', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter nationality"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.nationality || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Father's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.fathersName || ''}
              onChange={(e) => handleFieldChange('fathersName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter father's name"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.fathersName || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Mother's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name *</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.mothersName || ''}
              onChange={(e) => handleFieldChange('mothersName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter mother's name"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.mothersName || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Husband/Wife's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Husband/Wife's Name</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.spouseName || ''}
              onChange={(e) => handleFieldChange('spouseName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter spouse name"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.spouseName || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
          {isEditMode ? (
            <input
              type="date"
              value={employee.dateOfBirth || ''}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{formatDate(employee.dateOfBirth)}</p>
            </div>
          )}
        </div>

        {/* NID Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NID Number *</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.nidNumber || ''}
              onChange={(e) => handleFieldChange('nidNumber', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter NID number"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.nidNumber || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Birth Certificate Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birth Certificate Number</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.birthCertificateNumber || ''}
              onChange={(e) => handleFieldChange('birthCertificateNumber', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter birth certificate number"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.birthCertificateNumber || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
          {isEditMode ? (
            <select
              value={employee.bloodGroup || ''}
              onChange={(e) => handleFieldChange('bloodGroup', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.bloodGroup || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Religion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
          {isEditMode ? (
            <select
              value={employee.religion || ''}
              onChange={(e) => handleFieldChange('religion', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Religion</option>
              <option value="Islam">Islam</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Christianity">Christianity</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.religion || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
          {isEditMode ? (
            <select
              value={employee.maritalStatus || ''}
              onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.maritalStatus || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          {isEditMode ? (
            <input
              type="number"
              value={employee.height || ''}
              onChange={(e) => handleFieldChange('height', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter height in cm"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.height ? `${employee.height} cm` : 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Last Educational Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Educational Status</label>
          {isEditMode ? (
            <select
              value={employee.educationLevel || ''}
              onChange={(e) => handleFieldChange('educationLevel', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Education Level</option>
              <option value="Alphabetic Knowledge">Alphabetic Knowledge</option>
              <option value="JSC or Equivalent">JSC or Equivalent</option>
              <option value="SSC or Equivalent">SSC or Equivalent</option>
              <option value="HSC or Equivalent">HSC or Equivalent</option>
              <option value="Hon's">Hon's</option>
              <option value="Master's">Master's</option>
              <option value="BSc">BSc</option>
              <option value="MSc">MSc</option>
              <option value="PhD">PhD</option>
            </select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.educationLevel || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          {isEditMode ? (
            <select
              value={employee.gender || ''}
              onChange={(e) => handleFieldChange('gender', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.gender || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          {isEditMode ? (
            <input
              type="number"
              value={employee.weight || ''}
              onChange={(e) => handleFieldChange('weight', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter weight in kg"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.weight ? `${employee.weight} kg` : 'Not provided'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Children Information Section Component
function ChildrenInformationSection({ employee, isEditMode, onUpdate }) {
  const handleFieldChange = (field, value) => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => ({ ...prev, [field]: value }))
    }
  }
  
  // This function will be used when implementing full edit mode for all fields
  console.log('Edit mode available:', isEditMode, 'Field change handler:', handleFieldChange)

  const handleChildrenChange = (index, field, value) => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => {
        const newChildren = [...(prev.children || [])]
        newChildren[index] = { ...newChildren[index], [field]: value }
        return { ...prev, children: newChildren }
      })
    }
  }

  const addChild = () => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => ({
        ...prev,
        children: [...(prev.children || []), { name: '', age: '', relation: '' }]
      }))
    }
  }

  const removeChild = (index) => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => {
        const newChildren = [...(prev.children || [])]
        newChildren.splice(index, 1)
        return { ...prev, children: newChildren }
      })
    }
  }
  const children = Array.isArray(employee.children) ? employee.children : []
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Children Information</h3>
        {isEditMode && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Edit Mode
          </span>
        )}
      </div>
      
      {children.length > 0 ? (
        <div className="space-y-4">
          {children.map((child, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Child {index + 1}</h4>
                {isEditMode && (
                  <button
                    onClick={() => removeChild(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={child.name || ''}
                      onChange={(e) => handleChildrenChange(index, 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter child's name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{child.name || 'Not provided'}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={child.age || ''}
                      onChange={(e) => handleChildrenChange(index, 'age', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter age"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{child.age || 'Not provided'}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  {isEditMode ? (
                    <select
                      value={child.gender || ''}
                      onChange={(e) => handleChildrenChange(index, 'gender', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{child.gender || 'Not provided'}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={child.education || ''}
                      onChange={(e) => handleChildrenChange(index, 'education', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter education level"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{child.education || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isEditMode && (
            <button
              onClick={addChild}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add Child
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          {isEditMode ? (
            <button
              onClick={addChild}
              className="py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add Child Information
            </button>
          ) : (
            <p className="text-gray-500">No children information provided</p>
          )}
        </div>
      )}
    </div>
  )
}

// Address Information Section Component
function AddressInformationSection({ employee, isEditMode, onUpdate }) {
  const handleFieldChange = (field, value) => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => ({ ...prev, [field]: value }))
    }
  }
  
  // This function will be used when implementing full edit mode for all fields
  console.log('Edit mode available:', isEditMode, 'Field change handler:', handleFieldChange)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
        {isEditMode && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Edit Mode
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Present Address */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Present Address</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House Number/ House Name</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.presentAddress?.houseOwnerName || ''}
                  onChange={(e) => handleFieldChange('presentAddress', { ...employee.presentAddress, houseOwnerName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter house owner name"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.presentAddress?.houseOwnerName || 'Not provided'}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village/Area</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.presentAddress?.village || ''}
                  onChange={(e) => handleFieldChange('presentAddress', { ...employee.presentAddress, village: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter village"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.presentAddress?.village || 'Not provided'}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post Office</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.presentAddress?.postOffice || ''}
                  onChange={(e) => handleFieldChange('presentAddress', { ...employee.presentAddress, postOffice: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post office"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.presentAddress?.postOffice || 'Not provided'}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upazilla/City Corporation</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.presentAddress?.upazilla || ''}
                  onChange={(e) => handleFieldChange('presentAddress', { ...employee.presentAddress, upazilla: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter upazilla"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.presentAddress?.upazilla || 'Not provided'}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.presentAddress?.district || ''}
                  onChange={(e) => handleFieldChange('presentAddress', { ...employee.presentAddress, district: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter district"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.presentAddress?.district || 'Not provided'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Permanent Address */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Permanent Address</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House Number/ House Name</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.permanentAddress?.houseOwnerName || ''}
                  onChange={(e) => handleFieldChange('permanentAddress', { ...employee.permanentAddress, houseOwnerName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter house owner name"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.permanentAddress?.houseOwnerName || 'Not provided'}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village/Area</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.permanentAddress?.village || ''}
                  onChange={(e) => handleFieldChange('permanentAddress', { ...employee.permanentAddress, village: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter village"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.permanentAddress?.village || 'Not provided'}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post Office</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.permanentAddress?.postOffice || ''}
                  onChange={(e) => handleFieldChange('permanentAddress', { ...employee.permanentAddress, postOffice: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post office"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.permanentAddress?.postOffice || 'Not provided'}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upazilla/City Corporation</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.permanentAddress?.upazilla || ''}
                  onChange={(e) => handleFieldChange('permanentAddress', { ...employee.permanentAddress, upazilla: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter upazilla"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.permanentAddress?.upazilla || 'Not provided'}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={employee.permanentAddress?.district || ''}
                  onChange={(e) => handleFieldChange('permanentAddress', { ...employee.permanentAddress, district: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter district"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900">{employee.permanentAddress?.district || 'Not provided'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Working Experience Section Component
function WorkingExperienceSection({ employee, isEditMode, onUpdate }) {
  const [operations, setOperations] = useState([])
  const [machines, setMachines] = useState([])

  // Load operations and machines from organizational data
  useEffect(() => {
    const loadOrganizationalData = () => {
      const processExpertiseData = organizationalDataService.getProcessExpertise()
      const uniqueOperations = [...new Set(processExpertiseData.map(item => item.operation))]
      const uniqueMachines = [...new Set(processExpertiseData.map(item => item.machine))]
      
      setOperations(uniqueOperations)
      setMachines(uniqueMachines)
    }
    
    loadOrganizationalData()
  }, [])

  const handleFieldChange = (field, value) => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => ({ ...prev, [field]: value }))
    }
  }
  
  // This function will be used when implementing full edit mode for all fields
  console.log('Edit mode available:', isEditMode, 'Field change handler:', handleFieldChange)
  const workExperience = Array.isArray(employee.workExperience) ? employee.workExperience : []
  const processExpertise = Array.isArray(employee.processExpertise) ? employee.processExpertise : []
  const processEfficiency = Array.isArray(employee.processEfficiency) ? employee.processEfficiency : []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Working Experience</h3>
        {isEditMode && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Edit Mode
          </span>
        )}
      </div>
      
      {/* Working Experience */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900">Previous Work Experience</h4>
          {isEditMode && (
            <button
              onClick={() => {
                const newWorkExperience = [...workExperience, { companyName: '', department: '', designation: '', salary: '', duration: '' }]
                handleFieldChange('workExperience', newWorkExperience)
              }}
              className="px-3 py-1 bg-gradient-to-r from-orange-300 to-orange-400 text-white text-sm rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Experience</span>
            </button>
          )}
        </div>
        {workExperience.length > 0 ? (
          <div className="space-y-4">
            {workExperience.map((exp, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-900">Experience {index + 1}</h5>
                  {isEditMode && (
                    <button
                      onClick={() => {
                        const newWorkExperience = workExperience.filter((_, i) => i !== index)
                        handleFieldChange('workExperience', newWorkExperience)
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={exp.companyName || ''}
                        onChange={(e) => {
                          const newWorkExperience = [...workExperience]
                          newWorkExperience[index] = { ...exp, companyName: e.target.value }
                          handleFieldChange('workExperience', newWorkExperience)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter company name"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{exp.companyName || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={exp.department || ''}
                        onChange={(e) => {
                          const newWorkExperience = [...workExperience]
                          newWorkExperience[index] = { ...exp, department: e.target.value }
                          handleFieldChange('workExperience', newWorkExperience)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter department"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{exp.department || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={exp.designation || ''}
                        onChange={(e) => {
                          const newWorkExperience = [...workExperience]
                          newWorkExperience[index] = { ...exp, designation: e.target.value }
                          handleFieldChange('workExperience', newWorkExperience)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter designation"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{exp.designation || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                    {isEditMode ? (
                      <input
                        type="number"
                        value={exp.salary || ''}
                        onChange={(e) => {
                          const newWorkExperience = [...workExperience]
                          newWorkExperience[index] = { ...exp, salary: e.target.value }
                          handleFieldChange('workExperience', newWorkExperience)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter salary"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{exp.salary ? `৳${exp.salary}` : 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={exp.duration || ''}
                        onChange={(e) => {
                          const newWorkExperience = [...workExperience]
                          newWorkExperience[index] = { ...exp, duration: e.target.value }
                          handleFieldChange('workExperience', newWorkExperience)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter duration"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{exp.duration || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No previous work experience provided.</p>
            {isEditMode && (
              <button
                onClick={() => {
                  const newWorkExperience = [{ companyName: '', department: '', designation: '', salary: '', duration: '' }]
                  handleFieldChange('workExperience', newWorkExperience)
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add First Experience</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Process Expertise */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900">Process Expertise</h4>
          {isEditMode && (
            <button
              onClick={() => {
                const newProcessExpertise = [...processExpertise, { operation: '', machine: '', duration: '' }]
                handleFieldChange('processExpertise', newProcessExpertise)
              }}
              className="px-3 py-1 bg-gradient-to-r from-orange-300 to-orange-400 text-white text-sm rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Expertise</span>
            </button>
          )}
        </div>
        {processExpertise.length > 0 ? (
          <div className="space-y-4">
            {processExpertise.map((expertise, index) => {
              // Safety check to ensure expertise is an object
              if (!expertise || typeof expertise !== 'object') {
                return null
              }
              return (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-900">Expertise {index + 1}</h5>
                  {isEditMode && (
                    <button
                      onClick={() => {
                        const newProcessExpertise = processExpertise.filter((_, i) => i !== index)
                        handleFieldChange('processExpertise', newProcessExpertise)
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                    {isEditMode ? (
                      <select
                        value={expertise.operation || ''}
                        onChange={(e) => {
                          const newProcessExpertise = [...processExpertise]
                          newProcessExpertise[index] = { ...expertise, operation: e.target.value }
                          handleFieldChange('processExpertise', newProcessExpertise)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Operation</option>
                        {operations.map((operation) => (
                          <option key={operation} value={operation}>
                            {operation}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{expertise.operation || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Machine</label>
                    {isEditMode ? (
                      <select
                        value={expertise.machine || ''}
                        onChange={(e) => {
                          const newProcessExpertise = [...processExpertise]
                          newProcessExpertise[index] = { ...expertise, machine: e.target.value }
                          handleFieldChange('processExpertise', newProcessExpertise)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Machine</option>
                        {machines.map((machine) => (
                          <option key={machine} value={machine}>
                            {machine}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{expertise.machine || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={expertise.duration || ''}
                        onChange={(e) => {
                          const newProcessExpertise = [...processExpertise]
                          newProcessExpertise[index] = { ...expertise, duration: e.target.value }
                          handleFieldChange('processExpertise', newProcessExpertise)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter duration"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{expertise.duration || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No process expertise provided.</p>
            {isEditMode && (
              <button
                onClick={() => {
                  const newProcessExpertise = [{ operation: '', machine: '', duration: '' }]
                  handleFieldChange('processExpertise', newProcessExpertise)
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add First Expertise</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Process Efficiency */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900">Process Efficiency</h4>
          {isEditMode && (
            <button
              onClick={() => {
                const newProcessEfficiency = [...processEfficiency, { itemDescription: '', processDeliveryPerHour: '', remarks: '' }]
                handleFieldChange('processEfficiency', newProcessEfficiency)
              }}
              className="px-3 py-1 bg-gradient-to-r from-orange-300 to-orange-400 text-white text-sm rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Efficiency</span>
            </button>
          )}
        </div>
        {processEfficiency.length > 0 ? (
          <div className="space-y-4">
            {processEfficiency.map((efficiency, index) => {
              // Safety check to ensure efficiency is an object
              if (!efficiency || typeof efficiency !== 'object') {
                return null
              }
              return (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-900">Efficiency {index + 1}</h5>
                  {isEditMode && (
                    <button
                      onClick={() => {
                        const newProcessEfficiency = processEfficiency.filter((_, i) => i !== index)
                        handleFieldChange('processEfficiency', newProcessEfficiency)
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={efficiency.itemDescription || ''}
                        onChange={(e) => {
                          const newProcessEfficiency = [...processEfficiency]
                          newProcessEfficiency[index] = { ...efficiency, itemDescription: e.target.value }
                          handleFieldChange('processEfficiency', newProcessEfficiency)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter item description"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{efficiency.itemDescription || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Process/Delivery Per Hour</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={efficiency.processDeliveryPerHour || ''}
                        onChange={(e) => {
                          const newProcessEfficiency = [...processEfficiency]
                          newProcessEfficiency[index] = { ...efficiency, processDeliveryPerHour: e.target.value }
                          handleFieldChange('processEfficiency', newProcessEfficiency)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter process/delivery per hour"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{efficiency.processDeliveryPerHour || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={efficiency.remarks || ''}
                        onChange={(e) => {
                          const newProcessEfficiency = [...processEfficiency]
                          newProcessEfficiency[index] = { ...efficiency, remarks: e.target.value }
                          handleFieldChange('processEfficiency', newProcessEfficiency)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter remarks"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{efficiency.remarks || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No process efficiency provided.</p>
            {isEditMode && (
              <button
                onClick={() => {
                  const newProcessEfficiency = [{ itemDescription: '', processDeliveryPerHour: '', remarks: '' }]
                  handleFieldChange('processEfficiency', newProcessEfficiency)
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add First Efficiency</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Emergency Contact Section Component
function EmergencyContactSection({ employee, isEditMode, onUpdate }) {
  const handleFieldChange = (field, value) => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => ({ ...prev, [field]: value }))
    }
  }
  
  // This function will be used when implementing full edit mode for all fields
  console.log('Edit mode available:', isEditMode, 'Field change handler:', handleFieldChange)
  const emergencyContact = employee.emergencyContact || {}
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Emergency Contact Person</h3>
        {isEditMode && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Edit Mode
          </span>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            {isEditMode ? (
              <input
                type="text"
                value={emergencyContact.name || ''}
                onChange={(e) => handleFieldChange('emergencyContact', { ...emergencyContact, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter emergency contact name"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-gray-900">{emergencyContact.name || 'Not provided'}</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
            {isEditMode ? (
              <input
                type="tel"
                value={emergencyContact.mobile || ''}
                onChange={(e) => handleFieldChange('emergencyContact', { ...emergencyContact, mobile: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mobile number"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-gray-900">{emergencyContact.mobile || 'Not provided'}</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relation *</label>
            {isEditMode ? (
              <select
                value={emergencyContact.relation || ''}
                onChange={(e) => handleFieldChange('emergencyContact', { ...emergencyContact, relation: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Relation</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-gray-900">{emergencyContact.relation || 'Not provided'}</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            {isEditMode ? (
              <textarea
                value={emergencyContact.address || ''}
                onChange={(e) => handleFieldChange('emergencyContact', { ...emergencyContact, address: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter emergency contact address"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-gray-900">{emergencyContact.address || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Administrative Info Section Component
function AdministrativeInfoSection({ employee, formatDate, isEditMode, onUpdate }) {
  // Salary grade data from Organizational Metrics
  const salaryGrades = {
    'Worker Grade-1': { basicSalary: 8390, houseRent: 4195, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 15035 },
    'Worker Grade-2': { basicSalary: 7882, houseRent: 3941, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 14273 },
    'Worker Grade-3': { basicSalary: 7400, houseRent: 3700, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 13550 },
    'Worker Grade-4': { basicSalary: 6700, houseRent: 3350, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 12500 },
    'Staff Grade-1': { basicSalary: 25000, houseRent: 12500, medicalAllowance: 2000, conveyance: 1500, mobileBill: 1000, grossSalary: 42000 },
    'Staff Grade-2': { basicSalary: 35000, houseRent: 17500, medicalAllowance: 2500, conveyance: 2000, mobileBill: 1500, grossSalary: 58500 },
    'Staff Grade-3': { basicSalary: 45000, houseRent: 22500, medicalAllowance: 3000, conveyance: 2500, mobileBill: 2000, grossSalary: 75000 }
  }

  const handleFieldChange = (field, value) => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => ({ ...prev, [field]: value }))
      
      // If salary grade is changed, update gross salary and salary components
      if (field === 'salaryGrade' && value && salaryGrades[value]) {
        const gradeData = salaryGrades[value]
        const salaryComponents = {}
        
        // Create salary components object
        Object.keys(gradeData).forEach(key => {
          if (key !== 'grossSalary') {
            salaryComponents[key] = {
              enabled: true,
              amount: gradeData[key]
            }
          }
        })
        
        onUpdate(prev => ({
          ...prev,
          grossSalary: gradeData.grossSalary,
          salaryComponents: salaryComponents
        }))
      }
    }
  }
  
  // This function will be used when implementing full edit mode for all fields
  console.log('Edit mode available:', isEditMode, 'Field change handler:', handleFieldChange)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Administrative Information</h3>
        {isEditMode && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Edit Mode
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.employeeId || employee.id || ''}
              onChange={(e) => handleFieldChange('employeeId', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter employee ID"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900 font-mono">{employee.employeeId || employee.id || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Level of Work */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level of Work *</label>
          {isEditMode ? (
            <select
              value={employee.levelOfWork || ''}
              onChange={(e) => handleFieldChange('levelOfWork', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Level of Work</option>
              <option value="Worker">Worker</option>
              <option value="Staff">Staff</option>
            </select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.levelOfWork || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Off-Day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Off-Day</label>
          {isEditMode ? (
            <select
              value={employee.offDay || ''}
              onChange={(e) => handleFieldChange('offDay', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Off-Day</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
            </select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.offDay || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.unit || ''}
              onChange={(e) => handleFieldChange('unit', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter unit"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.unit || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Line</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.line || ''}
              onChange={(e) => handleFieldChange('line', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter line"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.line || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.designation || ''}
              onChange={(e) => handleFieldChange('designation', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter designation"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.designation || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.department || ''}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter department"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.department || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Supervisor's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor's Name</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.supervisorName || ''}
              onChange={(e) => handleFieldChange('supervisorName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter supervisor's name"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.supervisorName || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Work Salary Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Salary Grade</label>
          {isEditMode ? (
            <select
              value={employee.salaryGrade || ''}
              onChange={(e) => handleFieldChange('salaryGrade', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Salary Grade</option>
              {employee.levelOfWork === 'Worker' ? (
                <>
                  <option value="Worker Grade-1">Worker Grade-1</option>
                  <option value="Worker Grade-2">Worker Grade-2</option>
                  <option value="Worker Grade-3">Worker Grade-3</option>
                  <option value="Worker Grade-4">Worker Grade-4</option>
                </>
              ) : employee.levelOfWork === 'Staff' ? (
                <>
                  <option value="Staff Grade-1">Staff Grade-1</option>
                  <option value="Staff Grade-2">Staff Grade-2</option>
                  <option value="Staff Grade-3">Staff Grade-3</option>
                </>
              ) : (
                <option value="" disabled>Please select Level of Work first</option>
              )}
            </select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.salaryGrade || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Gross Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary</label>
          {isEditMode ? (
            <div className="relative">
              <input
                type="number"
                value={employee.grossSalary || ''}
                onChange={(e) => handleFieldChange('grossSalary', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter gross salary"
              />
              {employee.salaryGrade && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Auto-calculated
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.grossSalary ? `৳${employee.grossSalary.toLocaleString()}` : 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Date of Joining */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
          {isEditMode ? (
            <input
              type="date"
              value={employee.dateOfJoining || employee.joiningDate || ''}
              onChange={(e) => handleFieldChange('dateOfJoining', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{formatDate(employee.dateOfJoining || employee.joiningDate)}</p>
            </div>
          )}
        </div>

        {/* Date of Issue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Issue</label>
          {isEditMode ? (
            <input
              type="date"
              value={employee.dateOfIssue || ''}
              onChange={(e) => handleFieldChange('dateOfIssue', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{formatDate(employee.dateOfIssue)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Salary Components */}
      {employee.salaryComponents && typeof employee.salaryComponents === 'object' && Object.keys(employee.salaryComponents).length > 0 && (
        <div className="mt-8">
          <h4 className="font-medium text-gray-900 mb-4">Salary Components</h4>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(employee.salaryComponents).map(([key, component]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm text-gray-900 font-mono">
                    {component && typeof component === 'object' && component.enabled && typeof component.amount === 'number' ? `৳${component.amount.toLocaleString()}` : 'Disabled'}
                  </span>
                </div>
              ))}
            </div>
            {employee.grossSalary && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Gross Salary</span>
                  <span className="text-lg font-bold text-green-600 font-mono">৳{employee.grossSalary.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Nominee Information Section Component
function NomineeInformationSection({ employee, isEditMode, onUpdate }) {
  const handleFieldChange = (field, value) => {
    if (isEditMode && onUpdate) {
      onUpdate(prev => ({ ...prev, [field]: value }))
    }
  }
  
  // This function will be used when implementing full edit mode for all fields
  console.log('Edit mode available:', isEditMode, 'Field change handler:', handleFieldChange)
  const nominees = Array.isArray(employee.nominee) ? employee.nominee : []
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Nominee Information</h3>
        {isEditMode && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Edit Mode
          </span>
        )}
      </div>
      
      {nominees.length > 0 ? (
        <div className="space-y-4">
          {nominees.map((nominee, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Nominee {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={nominee.name || ''}
                      onChange={(e) => {
                        const newNominees = [...nominees]
                        newNominees[index] = { ...nominee, name: e.target.value }
                        handleFieldChange('nominee', newNominees)
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter nominee name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{nominee.name || 'Not provided'}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                  {isEditMode ? (
                    <select
                      value={nominee.relation || ''}
                      onChange={(e) => {
                        const newNominees = [...nominees]
                        newNominees[index] = { ...nominee, relation: e.target.value }
                        handleFieldChange('nominee', newNominees)
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Relation</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{nominee.relation || 'Not provided'}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  {isEditMode ? (
                    <input
                      type="tel"
                      value={nominee.mobile || ''}
                      onChange={(e) => {
                        const newNominees = [...nominees]
                        newNominees[index] = { ...nominee, mobile: e.target.value }
                        handleFieldChange('nominee', newNominees)
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter mobile number"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{nominee.mobile || 'Not provided'}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NID</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={nominee.nid || ''}
                      onChange={(e) => {
                        const newNominees = [...nominees]
                        newNominees[index] = { ...nominee, nid: e.target.value }
                        handleFieldChange('nominee', newNominees)
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter NID number"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{nominee.nid || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No nominee information provided.</p>
      )}
    </div>
  )
}
