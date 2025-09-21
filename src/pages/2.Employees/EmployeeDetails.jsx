import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
function ActivityLogModal({ show, onClose, logs, employeeName, onClearLogs, onClearAllLogs }) {
  if (!show) return null

  const formatDateTime = (date) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'Employee Created':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )
      case 'Field Updated':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'Array Updated':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        )
      case 'Object Updated':
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'Employee Created':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Field Updated':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Array Updated':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Object Updated':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Activity Log</h3>
              <p className="text-sm text-gray-600">Employee: <span className="font-semibold text-orange-600">{employeeName}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats Bar */}
        {logs && logs.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{logs.length}</div>
                  <div className="text-xs text-gray-500">Total Changes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {logs.filter(log => log.action === 'Field Updated').length}
                  </div>
                  <div className="text-xs text-gray-500">Field Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {logs.filter(log => log.action === 'Array Updated').length}
                  </div>
                  <div className="text-xs text-gray-500">Array Changes</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {logs.length > 0 ? formatDateTime(logs[0].timestamp) : 'Never'}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {logs && logs.length > 0 ? (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={log.id || index} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-white">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(log.action)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                          <span className="text-sm text-gray-500 font-mono">
                            {formatDateTime(log.timestamp)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          #{log.id ? log.id.toString().slice(-6) : index + 1}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {log.field}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {log.description}
                        </p>
                      </div>
                      
                      {(log.oldValue !== null && log.oldValue !== undefined && log.newValue !== null && log.newValue !== undefined) && (
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Previous Value</div>
                              <div className="text-sm text-gray-700 bg-red-50 p-2 rounded border-l-4 border-red-200">
                                {log.oldValue === '' ? <span className="italic text-gray-500">Empty</span> : log.oldValue}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">New Value</div>
                              <div className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-4 border-green-200">
                                {log.newValue === '' ? <span className="italic text-gray-500">Empty</span> : log.newValue}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Changed by: <span className="font-medium text-gray-700">{log.changedBy}</span></span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.floor((new Date() - new Date(log.timestamp)) / (1000 * 60))} minutes ago
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activity Logs</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No changes have been recorded for this employee yet. Activity logs will appear here when changes are made to the employee record.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing {logs ? logs.length : 0} activity log{logs && logs.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                // Refresh logs
                window.location.reload()
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            {logs && logs.length > 0 && (
              <>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all activity logs for this employee? This action cannot be undone.')) {
                      onClearLogs()
                    }
                  }}
                  className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear Logs</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear ALL activity logs for ALL employees? This action cannot be undone and will free up localStorage space.')) {
                      onClearAllLogs()
                    }
                  }}
                  className="px-4 py-2 text-red-700 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-2 font-semibold"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Clear All</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
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
          if (employeeData) {
            setEmployee(employeeData)
            // Set the search ID to match the loaded employee
            setSearchId(employeeData.employeeId || employeeData.id)
          }
        }
      } catch (error) {
        console.error('Error loading employee:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadEmployee()
  }, [])

  // Check if localStorage has space
  const hasLocalStorageSpace = () => {
    try {
      const testKey = 'test_storage_space'
      const testData = 'x'.repeat(1024) // 1KB test data
      localStorage.setItem(testKey, testData)
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  // Aggressive cleanup of localStorage
  const aggressiveCleanup = () => {
    try {
      // Get all localStorage keys
      const keys = Object.keys(localStorage)
      const logKeys = keys.filter(key => key.startsWith('employee_activity_logs_'))
      
      // For each employee, keep only the last 10 logs
      logKeys.forEach(key => {
        try {
          const logs = JSON.parse(localStorage.getItem(key) || '[]')
          const cleanedLogs = logs.slice(0, 10)
          localStorage.setItem(key, JSON.stringify(cleanedLogs))
        } catch {
          // If we can't parse or save, remove the key entirely
          localStorage.removeItem(key)
        }
      })
      
      // Also clean up any other large keys if needed
      keys.forEach(key => {
        if (!key.startsWith('employee_activity_logs_') && !key.startsWith('test_')) {
          try {
            const value = localStorage.getItem(key)
            if (value && value.length > 10000) { // Remove keys larger than 10KB
              localStorage.removeItem(key)
            }
          } catch {
            localStorage.removeItem(key)
          }
        }
      })
    } catch (error) {
      console.error('Error during aggressive cleanup:', error)
    }
  }

  // Log activity changes with aggressive quota management
  const logActivity = (field, oldValue, newValue, action = 'Field Updated') => {
    if (!employee || !employee.id) return

    // Check if we have space before attempting to log
    if (!hasLocalStorageSpace()) {
      console.warn('localStorage is full, performing aggressive cleanup')
      aggressiveCleanup()
      
      // If still no space, skip logging
      if (!hasLocalStorageSpace()) {
        console.warn('localStorage still full after cleanup, skipping log')
        return
      }
    }

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
    } else if (action === 'Array Updated') {
      description = `${formatFieldName(field)} was updated (${oldValue} → ${newValue})`
    } else if (action === 'Object Updated') {
      description = `${formatFieldName(field)} was modified (${oldValue} → ${newValue})`
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

    try {
      // Get existing logs
      const storedLogs = localStorage.getItem(`employee_activity_logs_${employee.id}`)
      const existingLogs = storedLogs ? JSON.parse(storedLogs) : []
      
      // Add new log
      const updatedLogs = [newLog, ...existingLogs]
      
      // Limit logs to prevent quota exceeded (keep only last 20 logs)
      const limitedLogs = updatedLogs.slice(0, 20)
      
      // Save to localStorage with error handling
      localStorage.setItem(`employee_activity_logs_${employee.id}`, JSON.stringify(limitedLogs))
      
      // Update state
      setActivityLogs(limitedLogs.map(log => ({
        ...log,
        timestamp: new Date(log.timestamp)
      })))
    } catch (error) {
      console.error('Error saving activity log:', error)
      
      // If quota exceeded, perform aggressive cleanup
      if (error.name === 'QuotaExceededError') {
        console.warn('Quota exceeded, performing aggressive cleanup')
        aggressiveCleanup()
        
        try {
          // Try again with even fewer logs (only 5)
          const storedLogs = localStorage.getItem(`employee_activity_logs_${employee.id}`)
          const existingLogs = storedLogs ? JSON.parse(storedLogs) : []
          const cleanedLogs = existingLogs.slice(0, 5)
          localStorage.setItem(`employee_activity_logs_${employee.id}`, JSON.stringify(cleanedLogs))
          
          // Try to add the new log again
          const updatedLogs = [newLog, ...cleanedLogs]
          localStorage.setItem(`employee_activity_logs_${employee.id}`, JSON.stringify(updatedLogs))
          
          setActivityLogs(updatedLogs.map(log => ({
            ...log,
            timestamp: new Date(log.timestamp)
          })))
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError)
          // If still failing, just update the state without persisting
          setActivityLogs(prev => [newLog, ...prev.slice(0, 9)])
        }
      }
    }
  }

  // Debounced logging to prevent too many logs
  const debouncedLogs = useRef({})
  
  // Real-time field change logging with debouncing
  const logFieldChange = (field, oldValue, newValue) => {
    if (oldValue !== newValue) {
      // Clear existing timeout for this field
      if (debouncedLogs.current[field]) {
        clearTimeout(debouncedLogs.current[field])
      }
      
      // Set a new timeout to log the change after 1 second of inactivity
      debouncedLogs.current[field] = setTimeout(() => {
        logActivity(field, oldValue, newValue, 'Field Updated')
        delete debouncedLogs.current[field]
      }, 1000)
    }
  }

  // Enhanced setEditedEmployee with real-time logging
  const handleEmployeeUpdate = (updater) => {
    if (typeof updater === 'function') {
      setEditedEmployee(prev => {
        const newEmployee = updater(prev)
        
        // Log individual field changes
        if (prev && newEmployee) {
          Object.keys(newEmployee).forEach(field => {
            if (prev[field] !== newEmployee[field]) {
              logFieldChange(field, prev[field], newEmployee[field])
            }
          })
        }
        
        return newEmployee
      })
    } else {
      setEditedEmployee(updater)
    }
  }

  // Clear all activity logs for current employee
  const clearActivityLogs = () => {
    if (employee && employee.id) {
      try {
        localStorage.removeItem(`employee_activity_logs_${employee.id}`)
        setActivityLogs([])
        console.log('Activity logs cleared for employee:', employee.id)
      } catch (error) {
        console.error('Error clearing activity logs:', error)
      }
    }
  }

  // Clear ALL activity logs from localStorage (nuclear option)
  const clearAllActivityLogs = () => {
    try {
      const keys = Object.keys(localStorage)
      const logKeys = keys.filter(key => key.startsWith('employee_activity_logs_'))
      
      logKeys.forEach(key => {
        localStorage.removeItem(key)
      })
      
      setActivityLogs([])
      console.log('All activity logs cleared from localStorage')
    } catch (error) {
      console.error('Error clearing all activity logs:', error)
    }
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
            logActivity(field, oldSummary, newSummary, 'Array Updated')
          } else if (field === 'processExpertise') {
            const oldSummary = oldValue?.length > 0 ? `${oldValue.length} expertise(s)` : 'No expertise'
            const newSummary = newValue?.length > 0 ? `${newValue.length} expertise(s)` : 'No expertise'
            logActivity(field, oldSummary, newSummary, 'Array Updated')
          } else if (field === 'processEfficiency') {
            const oldSummary = oldValue?.length > 0 ? `${oldValue.length} efficiency record(s)` : 'No efficiency records'
            const newSummary = newValue?.length > 0 ? `${newValue.length} efficiency record(s)` : 'No efficiency records'
            logActivity(field, oldSummary, newSummary, 'Array Updated')
          } else if (field === 'children') {
            const oldSummary = oldValue?.length > 0 ? `${oldValue.length} child(ren)` : 'No children'
            const newSummary = newValue?.length > 0 ? `${newValue.length} child(ren)` : 'No children'
            logActivity(field, oldSummary, newSummary, 'Array Updated')
          } else if (field === 'nominee') {
            const oldSummary = oldValue?.length > 0 ? `${oldValue.length} nominee(s)` : 'No nominees'
            const newSummary = newValue?.length > 0 ? `${newValue.length} nominee(s)` : 'No nominees'
            logActivity(field, oldSummary, newSummary, 'Array Updated')
          } else {
            // Generic array handling
            logActivity(field, `${oldValue?.length || 0} items`, `${newValue?.length || 0} items`, 'Array Updated')
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
              if (addr.houseOwnerName) parts.push(addr.houseOwnerName)
              if (addr.village) parts.push(addr.village)
              if (addr.upazilla) parts.push(addr.upazilla)
              if (addr.district) parts.push(addr.district)
              return parts.length > 0 ? parts.join(', ') : 'Not provided'
            }
            
            const oldAddr = formatAddress(oldValue)
            const newAddr = formatAddress(newValue)
            logActivity(field, oldAddr, newAddr, 'Object Updated')
          } else if (field === 'emergencyContact') {
            const oldContact = oldValue?.name ? `${oldValue.name} (${oldValue.mobile})` : 'Not provided'
            const newContact = newValue?.name ? `${newValue.name} (${newValue.mobile})` : 'Not provided'
            logActivity(field, oldContact, newContact, 'Object Updated')
          } else {
            // For other objects, show a summary of the change
            const oldSummary = Object.keys(oldValue).length > 0 ? `${Object.keys(oldValue).length} properties` : 'Empty object'
            const newSummary = Object.keys(newValue).length > 0 ? `${Object.keys(newValue).length} properties` : 'Empty object'
            logActivity(field, oldSummary, newSummary, 'Object Updated')
          }
          changesCount++
        }
      } else if (normalizedOldValue !== normalizedNewValue) {
        // For primitive values
        console.log(`Primitive change detected in ${field}:`, normalizedOldValue, '->', normalizedNewValue)
        logActivity(field, normalizedOldValue, normalizedNewValue, 'Field Updated')
        changesCount++
      }
    })
    
    console.log(`Total changes detected: ${changesCount}`)
  }

  // Load activity logs for the employee with aggressive cleanup
  const loadActivityLogs = async () => {
    try {
      // Check if employee exists and has activity logs
      if (!employee || !employee.id) {
        setActivityLogs([])
        return
      }

      // Perform aggressive cleanup first
      aggressiveCleanup()

      // Try to get activity logs from localStorage or employee data
      const storedLogs = localStorage.getItem(`employee_activity_logs_${employee.id}`)
      if (storedLogs) {
        const logs = JSON.parse(storedLogs)
        
        // Clean up old logs (keep only last 10)
        const cleanedLogs = logs.slice(0, 10)
        
        // If we cleaned up logs, save the cleaned version
        if (cleanedLogs.length < logs.length) {
          try {
            localStorage.setItem(`employee_activity_logs_${employee.id}`, JSON.stringify(cleanedLogs))
          } catch (error) {
            console.warn('Could not save cleaned logs:', error)
          }
        }
        
        // Convert timestamp strings back to Date objects
        const parsedLogs = cleanedLogs.map(log => ({
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
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }

    const formatCurrency = (amount) => {
      if (!amount) return 'Not provided'
      return `৳${amount.toLocaleString()}`
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Details - ${employee.name || employee.nameEnglish || 'Unknown'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 15px; color: #333; font-size: 12px; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 15px; }
          .header h1 { margin: 0; font-size: 20px; }
          .header p { margin: 3px 0; color: #666; font-size: 11px; }
          .print-date { text-align: right; font-size: 10px; color: #666; margin-bottom: 15px; }
          
          /* Two-column layout */
          .main-content { display: flex; gap: 20px; }
          .column { flex: 1; }
          .section { margin-bottom: 20px; break-inside: avoid; }
          .section h2 { background: #f5f5f5; padding: 8px; margin: 0 0 10px 0; border-left: 4px solid #ff6b35; font-size: 14px; }
          .section h3 { background: #f8f9fa; padding: 6px; margin: 8px 0 6px 0; border-left: 3px solid #ff6b35; font-size: 12px; }
          
          .field { margin-bottom: 6px; display: flex; }
          .field-label { font-weight: bold; min-width: 120px; font-size: 11px; }
          .field-value { flex: 1; font-size: 11px; }
          
          .photo-section { text-align: center; margin-bottom: 15px; }
          .photo-placeholder { width: 80px; height: 80px; border: 2px dashed #ccc; display: inline-block; line-height: 80px; color: #666; font-size: 10px; }
          
          .status-badge { padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: bold; }
          .status-active { background: #d4edda; color: #155724; }
          .status-inactive { background: #f8d7da; color: #721c24; }
          .status-terminated { background: #f8d7da; color: #721c24; }
          
          .table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10px; }
          .table th, .table td { border: 1px solid #ddd; padding: 4px; text-align: left; }
          .table th { background-color: #f5f5f5; font-weight: bold; font-size: 10px; }
          
          .list-item { margin-bottom: 6px; padding: 6px; background: #f9f9f9; border-left: 3px solid #ff6b35; font-size: 10px; }
          .list-item h3 { margin: 0 0 4px 0; font-size: 11px; }
          
          /* Full-width sections that should span both columns */
          .full-width { flex-basis: 100%; }
          
          @media print { 
            body { margin: 0; }
            .main-content { display: flex; }
            .column { flex: 1; }
          }
        </style>
      </head>
      <body>
        <div class="print-date">Printed on: ${new Date().toLocaleDateString('en-GB').split('/').reverse().join('/')} at ${new Date().toLocaleTimeString('en-GB')}</div>
        
        <div class="header">
          <h1>Employee Details</h1>
          <p>Employee ID: ${employee.employeeId || employee.id || 'N/A'}</p>
          <p>Status: <span class="status-badge status-${employee.status?.toLowerCase() || 'unknown'}">${employee.status || 'Unknown'}</span></p>
        </div>

        <div class="photo-section">
          ${employee.picture ? 
            `<img src="${employee.picture}" alt="Employee Photo" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">` :
            `<div class="photo-placeholder">No Photo</div>`
          }
        </div>

        <div class="main-content">
          <div class="column">
            <div class="section">
              <h2>Personal Information</h2>
              <div class="field"><span class="field-label">Name (English):</span> <span class="field-value">${employee.nameEnglish || employee.name || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Name (Bangla):</span> <span class="field-value">${employee.nameBangla || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Mobile Number:</span> <span class="field-value">${employee.phone || employee.mobileNumber || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Email:</span> <span class="field-value">${employee.email || employee.emailAddress || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Date of Birth:</span> <span class="field-value">${formatDate(employee.dateOfBirth)}</span></div>
              <div class="field"><span class="field-label">Gender:</span> <span class="field-value">${employee.gender || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">NID Number:</span> <span class="field-value">${employee.nidNumber || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Blood Group:</span> <span class="field-value">${employee.bloodGroup || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Religion:</span> <span class="field-value">${employee.religion || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Marital Status:</span> <span class="field-value">${employee.maritalStatus || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Last Educational Status:</span> <span class="field-value">${employee.educationLevel || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Subject:</span> <span class="field-value">${employee.subject || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Height:</span> <span class="field-value">${employee.height ? `${employee.height} cm` : 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Weight:</span> <span class="field-value">${employee.weight ? `${employee.weight} kg` : 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Birth Certificate Number:</span> <span class="field-value">${employee.birthCertificateNumber || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Father's Name:</span> <span class="field-value">${employee.fathersName || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Mother's Name:</span> <span class="field-value">${employee.mothersName || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Spouse Name:</span> <span class="field-value">${employee.spouseName || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Nationality:</span> <span class="field-value">${employee.nationality || 'Not provided'}</span></div>
            </div>

            <div class="section">
              <h2>Administrative Information</h2>
              <div class="field"><span class="field-label">Employee ID:</span> <span class="field-value">${employee.employeeId || employee.id || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Designation:</span> <span class="field-value">${employee.designation || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Department:</span> <span class="field-value">${employee.department || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Level of Work:</span> <span class="field-value">${employee.levelOfWork || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Work Salary Grade:</span> <span class="field-value">${employee.salaryGrade || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Gross Salary:</span> <span class="field-value">${formatCurrency(employee.grossSalary)}</span></div>
              <div class="field"><span class="field-label">Date of Joining:</span> <span class="field-value">${formatDate(employee.dateOfJoining || employee.joiningDate)}</span></div>
              <div class="field"><span class="field-label">Date of Issue:</span> <span class="field-value">${formatDate(employee.dateOfIssue)}</span></div>
              <div class="field"><span class="field-label">Off-Day:</span> <span class="field-value">${employee.offDay || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Unit:</span> <span class="field-value">${employee.unit || 'Not provided'}</span></div>
              ${employee.levelOfWork === 'Worker' ? `<div class="field"><span class="field-label">Line:</span> <span class="field-value">${employee.line || 'Not provided'}</span></div>` : ''}
              <div class="field"><span class="field-label">Supervisor:</span> <span class="field-value">${employee.supervisorName || 'Not provided'}</span></div>
            </div>
          </div>

          <div class="column">

            ${employee.salaryComponents && employee.salaryComponents.length > 0 ? `
            <div class="section">
              <h2>Salary Components</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Amount (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  ${employee.salaryComponents.map(component => `
                    <tr>
                      <td>${component.name || 'N/A'}</td>
                      <td>${component.amount ? component.amount.toLocaleString() : '0'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ` : ''}

            ${employee.children && employee.children.length > 0 && employee.children.some(child => child.name && child.name.trim() !== '') ? `
            <div class="section">
              <h2>Children Information</h2>
              ${employee.children.filter(child => child.name && child.name.trim() !== '').map((child, index) => `
                <div class="list-item">
                  <h3>Child ${index + 1}</h3>
                  <div class="field"><span class="field-label">Name:</span> <span class="field-value">${child.name || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Age:</span> <span class="field-value">${child.age || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Education:</span> <span class="field-value">${child.education || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Institute:</span> <span class="field-value">${child.institute || 'Not provided'}</span></div>
                </div>
              `).join('')}
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
          </div>
        </div>

        <div class="main-content full-width">
          <div class="column">

            ${employee.workExperience && employee.workExperience.length > 0 ? `
            <div class="section">
              <h2>Working Experience</h2>
              ${employee.workExperience.map((exp, index) => `
                <div class="list-item">
                  <h3>Experience ${index + 1}</h3>
                  <div class="field"><span class="field-label">Company Name:</span> <span class="field-value">${exp.companyName || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Department:</span> <span class="field-value">${exp.department || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Designation:</span> <span class="field-value">${exp.designation || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Salary:</span> <span class="field-value">${exp.salary ? `৳${exp.salary}` : 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Duration:</span> <span class="field-value">${exp.duration || 'Not provided'}</span></div>
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${employee.processExpertise && employee.processExpertise.length > 0 ? `
            <div class="section">
              <h2>Process Expertise</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Operation</th>
                    <th>Machine</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  ${employee.processExpertise.map(expertise => `
                    <tr>
                      <td>${expertise.operation || 'N/A'}</td>
                      <td>${expertise.machine || 'N/A'}</td>
                      <td>${expertise.duration || 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ` : ''}

            ${employee.processEfficiency && employee.processEfficiency.length > 0 ? `
            <div class="section">
              <h2>Process Efficiency</h2>
              ${employee.processEfficiency.map((efficiency, index) => `
                <div class="list-item">
                  <h3>Efficiency ${index + 1}</h3>
                  <div class="field"><span class="field-label">Item Description:</span> <span class="field-value">${efficiency.itemDescription || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Process/Delivery Per Hour:</span> <span class="field-value">${efficiency.processDeliveryPerHour || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Remarks:</span> <span class="field-value">${efficiency.remarks || 'Not provided'}</span></div>
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${employee.emergencyContact ? `
            <div class="section">
              <h2>Emergency Contact</h2>
              <div class="field"><span class="field-label">Name:</span> <span class="field-value">${employee.emergencyContact.name || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Mobile:</span> <span class="field-value">${employee.emergencyContact.mobile || 'Not provided'}</span></div>
              <div class="field"><span class="field-label">Relation:</span> <span class="field-value">${employee.emergencyContact.relation || 'Not provided'}</span></div>
            </div>
            ` : ''}

            ${employee.nominee && employee.nominee.length > 0 && employee.nominee.some(nominee => nominee.name && nominee.name.trim() !== '') ? `
            <div class="section">
              <h2>Nominee Information</h2>
              ${employee.nominee.filter(nominee => nominee.name && nominee.name.trim() !== '').map((nominee, index) => `
                <div class="list-item">
                  <h3>Nominee ${index + 1}</h3>
                  <div class="field"><span class="field-label">Name:</span> <span class="field-value">${nominee.name || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">Mobile:</span> <span class="field-value">${nominee.mobile || 'Not provided'}</span></div>
                  <div class="field"><span class="field-label">NID/Birth Certificate:</span> <span class="field-value">${nominee.nidBirthCertificate || 'Not provided'}</span></div>
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
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
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
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
        onClearLogs={clearActivityLogs}
        onClearAllLogs={clearAllActivityLogs}
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
                {employee.nameEnglish || employee.name || 'Name not provided'}
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
                    // Log entering edit mode
                    logActivity('Edit Mode', 'View Mode', 'Edit Mode', 'Edit Mode Entered')
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
            {activeTab === 'personal' && <PersonalInformationSection employee={isEditMode ? editedEmployee : employee} formatDate={formatDate} isEditMode={isEditMode} onUpdate={handleEmployeeUpdate} />}
            {activeTab === 'children' && <ChildrenInformationSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={handleEmployeeUpdate} />}
            {activeTab === 'address' && <AddressInformationSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={handleEmployeeUpdate} />}
            {activeTab === 'experience' && <WorkingExperienceSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={handleEmployeeUpdate} />}
            {activeTab === 'emergency' && <EmergencyContactSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={handleEmployeeUpdate} />}
            {activeTab === 'administrative' && <AdministrativeInfoSection employee={isEditMode ? editedEmployee : employee} formatDate={formatDate} isEditMode={isEditMode} onUpdate={handleEmployeeUpdate} />}
            {activeTab === 'nominee' && <NomineeInformationSection employee={isEditMode ? editedEmployee : employee} isEditMode={isEditMode} onUpdate={handleEmployeeUpdate} />}
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
              value={employee.nameEnglish || employee.name || ''}
              onChange={(e) => handleFieldChange('nameEnglish', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name in English"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.nameEnglish || employee.name || 'Not provided'}</p>
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

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          {isEditMode ? (
            <input
              type="text"
              value={employee.subject || ''}
              onChange={(e) => handleFieldChange('subject', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-900">{employee.subject || 'Not provided'}</p>
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
        children: [...(prev.children || []), { name: '', age: '', education: '', institute: '' }]
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
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])

  // Load operations, machines, departments, and designations from organizational data
  useEffect(() => {
    const loadOrganizationalData = () => {
      // Get operations and machines from service
      const opsData = organizationalDataService.getOperations()
      const machData = organizationalDataService.getMachines()
      const deptData = organizationalDataService.getDepartments()
      const desigData = organizationalDataService.getDesignations()
      
      setOperations(opsData.map(op => op.name))
      setMachines(machData.map(machine => machine.name))
      setDepartments(deptData.map(dept => dept.name))
      setDesignations(desigData.map(desig => desig.name))
    }
    
    loadOrganizationalData()

    // Listen for organizational data changes
    const handleStorageChange = (event) => {
      if (event.key === 'organizationalData') {
        loadOrganizationalData()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('organizationalDataChanged', loadOrganizationalData)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('organizationalDataChanged', loadOrganizationalData)
    }
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
                      <select
                        value={exp.department || ''}
                        onChange={(e) => {
                          const newWorkExperience = [...workExperience]
                          newWorkExperience[index] = { ...exp, department: e.target.value }
                          handleFieldChange('workExperience', newWorkExperience)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="text-gray-900">{exp.department || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    {isEditMode ? (
                      <select
                        value={exp.designation || ''}
                        onChange={(e) => {
                          const newWorkExperience = [...workExperience]
                          newWorkExperience[index] = { ...exp, designation: e.target.value }
                          handleFieldChange('workExperience', newWorkExperience)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Designation</option>
                        {designations.map(desig => (
                          <option key={desig} value={desig}>{desig}</option>
                        ))}
                      </select>
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
        </div>
      </div>
    </div>
  )
}

// Administrative Info Section Component
function AdministrativeInfoSection({ employee, formatDate, isEditMode, onUpdate }) {
  const [salaryGrades, setSalaryGrades] = useState({})
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])

  // Load organizational data and listen for changes
  useEffect(() => {
    const loadOrganizationalData = () => {
      // Load salary grades from service
      const allGrades = organizationalDataService.getAllSalaryGrades()
      const workerGrades = allGrades.filter(grade => grade.type === 'Worker')
      const staffGrades = allGrades.filter(grade => grade.type === 'Staff')
      
      // Convert to the format expected by the component
      const gradesObject = {}
      workerGrades.forEach(grade => {
        gradesObject[grade.name] = {
          basicSalary: grade.basicSalary,
          houseRent: grade.houseRent,
          medicalAllowance: grade.medicalAllowance,
          conveyance: grade.conveyance,
          foodAllowance: grade.foodAllowance,
          grossSalary: grade.grossSalary
        }
      })
      staffGrades.forEach(grade => {
        gradesObject[grade.name] = {
          basicSalary: grade.basicSalary,
          houseRent: grade.houseRent,
          medicalAllowance: grade.medicalAllowance,
          conveyance: grade.conveyance,
          mobileBill: grade.mobileBill,
          grossSalary: grade.grossSalary
        }
      })
      
      setSalaryGrades(gradesObject)
      
      // Load departments and designations
      setDepartments(organizationalDataService.getDepartments())
      setDesignations(organizationalDataService.getDesignations())
    }

    loadOrganizationalData()

    // Listen for organizational data changes
    const handleStorageChange = (event) => {
      if (event.key === 'organizationalData') {
        loadOrganizationalData()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('organizationalDataChanged', loadOrganizationalData)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('organizationalDataChanged', loadOrganizationalData)
    }
  }, [])

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

        {/* Line - Only for Workers */}
        {employee.levelOfWork === 'Worker' && (
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
        )}

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          {isEditMode ? (
            <select
              value={employee.designation || ''}
              onChange={(e) => handleFieldChange('designation', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Designation</option>
              {designations.map(designation => (
                <option key={designation.id} value={designation.name}>
                  {designation.name}
                </option>
              ))}
            </select>
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
            <select
              value={employee.department || ''}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department.id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">NID/Birth Certificate</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={nominee.nidBirthCertificate || ''}
                      onChange={(e) => {
                        const newNominees = [...nominees]
                        newNominees[index] = { ...nominee, nidBirthCertificate: e.target.value }
                        handleFieldChange('nominee', newNominees)
                      }}
                      className="w-full  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter NID/Birth Certificate number"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{nominee.nidBirthCertificate || 'Not provided'}</p>
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
