// Employee Log Service - Immutable audit trail
const LOG_STORAGE_KEY = 'hr_employee_logs'
const LOG_VERSION = '1.0.0'

// Get logs from localStorage
const getStoredLogs = () => {
  try {
    const stored = localStorage.getItem(LOG_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading logs from storage:', error)
    return []
  }
}

// Save logs to localStorage (immutable - only append)
const saveLogs = (logs) => {
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs))
  } catch (error) {
    console.error('Error saving logs to storage:', error)
  }
}

// Generate unique log ID
const generateLogId = () => {
  return `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get current user info (in a real app, this would come from authentication)
const getCurrentUser = () => {
  return {
    id: 'system',
    name: 'System Administrator',
    role: 'Admin'
  }
}

// Create a log entry
const createLogEntry = (employeeId, action, field, oldValue, newValue, details = {}) => {
  const user = getCurrentUser()
  const timestamp = new Date().toISOString()
  
  return {
    id: generateLogId(),
    employeeId,
    action,
    field,
    oldValue: oldValue !== undefined ? oldValue : null,
    newValue: newValue !== undefined ? newValue : null,
    details,
    user,
    timestamp,
    version: LOG_VERSION,
    immutable: true // This flag indicates the log cannot be modified
  }
}

// Employee Log Service
const employeeLogService = {
  // Add a new log entry
  addLog: (employeeId, action, field, oldValue, newValue, details = {}) => {
    const logs = getStoredLogs()
    const logEntry = createLogEntry(employeeId, action, field, oldValue, newValue, details)
    
    // Add to beginning of array (most recent first)
    logs.unshift(logEntry)
    
    // Keep only last 1000 logs per employee to prevent storage bloat
    const employeeLogs = logs.filter(log => log.employeeId === employeeId)
    if (employeeLogs.length > 1000) {
      const logsToKeep = employeeLogs.slice(0, 1000)
      const otherLogs = logs.filter(log => log.employeeId !== employeeId)
      const updatedLogs = [...logsToKeep, ...otherLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      saveLogs(updatedLogs)
    } else {
      saveLogs(logs)
    }
    
    return logEntry
  },

  // Get logs for a specific employee
  getEmployeeLogs: (employeeId) => {
    const logs = getStoredLogs()
    return logs
      .filter(log => log.employeeId === employeeId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  // Get all logs
  getAllLogs: () => {
    const logs = getStoredLogs()
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  // Get logs by action type
  getLogsByAction: (action) => {
    const logs = getStoredLogs()
    return logs
      .filter(log => log.action === action)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  // Get logs by date range
  getLogsByDateRange: (startDate, endDate) => {
    const logs = getStoredLogs()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return logs
      .filter(log => {
        const logDate = new Date(log.timestamp)
        return logDate >= start && logDate <= end
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  // Get logs by user
  getLogsByUser: (userId) => {
    const logs = getStoredLogs()
    return logs
      .filter(log => log.user.id === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  // Get log statistics
  getLogStatistics: () => {
    const logs = getStoredLogs()
    const stats = {
      totalLogs: logs.length,
      uniqueEmployees: new Set(logs.map(log => log.employeeId)).size,
      actionsCount: {},
      recentActivity: logs.slice(0, 10),
      lastUpdated: logs.length > 0 ? logs[0].timestamp : null
    }

    // Count actions
    logs.forEach(log => {
      stats.actionsCount[log.action] = (stats.actionsCount[log.action] || 0) + 1
    })

    return stats
  },

  // Clear all logs (admin function)
  clearAllLogs: () => {
    localStorage.removeItem(LOG_STORAGE_KEY)
  },

  // Export logs (for backup/audit purposes)
  exportLogs: (employeeId = null) => {
    const logs = employeeId ? 
      employeeLogService.getEmployeeLogs(employeeId) : 
      employeeLogService.getAllLogs()
    
    const exportData = {
      exportDate: new Date().toISOString(),
      version: LOG_VERSION,
      totalLogs: logs.length,
      logs: logs
    }
    
    return exportData
  },

  // Log specific actions
  logEmployeeCreated: (employeeId, employeeData) => {
    return employeeLogService.addLog(
      employeeId,
      'EMPLOYEE_CREATED',
      'all',
      null,
      employeeData,
      { message: 'New employee created' }
    )
  },

  logEmployeeUpdated: (employeeId, field, oldValue, newValue) => {
    return employeeLogService.addLog(
      employeeId,
      'EMPLOYEE_UPDATED',
      field,
      oldValue,
      newValue,
      { message: `Field '${field}' updated` }
    )
  },

  logEmployeePromoted: (employeeId, promotionData) => {
    return employeeLogService.addLog(
      employeeId,
      'EMPLOYEE_PROMOTED',
      'promotion',
      promotionData.previousDesignation,
      promotionData.newDesignation,
      {
        message: 'Employee promoted',
        previousDepartment: promotionData.previousDepartment,
        newDepartment: promotionData.newDepartment,
        previousSalary: promotionData.previousSalary,
        newSalary: promotionData.newSalary,
        effectiveDate: promotionData.effectiveDate
      }
    )
  },

  logEmployeeStatusChanged: (employeeId, statusData) => {
    return employeeLogService.addLog(
      employeeId,
      'STATUS_CHANGED',
      'status',
      statusData.previousStatus,
      statusData.newStatus,
      {
        message: `Employee status changed to ${statusData.newStatus}`,
        reason: statusData.reason,
        effectiveDate: statusData.effectiveDate
      }
    )
  },

  logEmployeeDeleted: (employeeId, employeeData) => {
    return employeeLogService.addLog(
      employeeId,
      'EMPLOYEE_DELETED',
      'all',
      employeeData,
      null,
      { message: 'Employee deleted from system' }
    )
  },

  logPhotoUpdated: (employeeId, oldPhoto, newPhoto) => {
    return employeeLogService.addLog(
      employeeId,
      'PHOTO_UPDATED',
      'picture',
      oldPhoto,
      newPhoto,
      { message: 'Employee photo updated' }
    )
  }
}

export default employeeLogService
