import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Search, 
  Filter, 
  Printer, 
  RefreshCw, 
  Eye, 
  Trash2, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  User,
  DollarSign,
  Settings
} from 'lucide-react'

// Constants
const LOG_TYPES = {
  SYSTEM: 'system',
  USER: 'user', 
  SECURITY: 'security',
  PAYROLL: 'payroll',
  ALL: 'all'
}

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARNING: 'WARNING', 
  INFO: 'INFO',
  DEBUG: 'DEBUG'
}

const SEVERITY_LEVELS = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
}

const STATUS_TYPES = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PROCESSING: 'PROCESSING',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED'
}

// Mock data service
const auditLogService = {
  async getLogs(filters = {}) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const allLogs = [
      // System Logs
      {
        id: 1,
        timestamp: '2024-01-15 14:30:25',
        level: LOG_LEVELS.INFO,
        component: 'Database',
        message: 'Database backup completed successfully',
        details: 'Backup size: 2.4GB, Duration: 15m 32s, Location: /backups/db_20240115_143025.sql',
        category: LOG_TYPES.SYSTEM,
        type: 'System Log'
      },
      {
        id: 2,
        timestamp: '2024-01-15 14:28:10',
        level: LOG_LEVELS.WARNING,
        component: 'Email Service',
        message: 'SMTP connection timeout',
        details: 'Retry attempt 2/3, Server: smtp.company.com, Port: 587, Timeout: 30s',
        category: LOG_TYPES.SYSTEM,
        type: 'System Log'
      },
      {
        id: 3,
        timestamp: '2024-01-15 14:25:45',
        level: LOG_LEVELS.ERROR,
        component: 'File Upload',
        message: 'Failed to process large file upload',
        details: 'File size: 45MB, User: john.doe, Error: Memory limit exceeded, Max allowed: 25MB',
        category: LOG_TYPES.SYSTEM,
        type: 'System Log'
      },
      // User Activities
      {
        id: 4,
        timestamp: '2024-01-15 14:35:22',
        user: 'john.doe@company.com',
        action: 'LOGIN_SUCCESS',
        ip: '192.168.1.100',
        status: STATUS_TYPES.SUCCESS,
        details: 'User logged in from Chrome browser, Session ID: sess_abc123',
        category: LOG_TYPES.USER,
        type: 'User Activity'
      },
      {
        id: 5,
        timestamp: '2024-01-15 14:30:15',
        user: 'jane.smith@company.com',
        action: 'PASSWORD_CHANGE',
        ip: '10.0.0.50',
        status: STATUS_TYPES.SUCCESS,
        details: 'Password changed successfully, Security level: High',
        category: LOG_TYPES.USER,
        type: 'User Activity'
      },
      // Security Events
      {
        id: 6,
        timestamp: '2024-01-15 14:40:15',
        event: 'LOGIN_ATTEMPT',
        severity: SEVERITY_LEVELS.HIGH,
        ip: '203.45.67.89',
        description: 'Multiple failed login attempts detected',
        details: '5 failed attempts in 2 minutes, Account: admin@company.com, IP blocked for 30 minutes',
        category: LOG_TYPES.SECURITY,
        type: 'Security Event'
      },
      {
        id: 7,
        timestamp: '2024-01-15 14:35:42',
        event: 'FILE_ACCESS',
        severity: SEVERITY_LEVELS.MEDIUM,
        ip: '192.168.1.100',
        description: 'Sensitive file access detected',
        details: 'File: /confidential/salary_data.xlsx, User: john.doe, Action: READ',
        category: LOG_TYPES.SECURITY,
        type: 'Security Event'
      },
      // Payroll Changes
      {
        id: 8,
        timestamp: '2024-01-15 14:45:30',
        user: 'hr.manager@company.com',
        action: 'SALARY_UPDATE',
        employee: 'EMP001 - John Doe',
        oldValue: '৳45,000',
        newValue: '৳48,000',
        reason: 'Annual performance review - Rating: A, Merit increase: 6.7%',
        status: STATUS_TYPES.APPROVED,
        category: LOG_TYPES.PAYROLL,
        type: 'Payroll Change'
      },
      {
        id: 9,
        timestamp: '2024-01-15 14:40:15',
        user: 'payroll.admin@company.com',
        action: 'BONUS_ADDED',
        employee: 'EMP023 - Sarah Johnson',
        oldValue: '৳0',
        newValue: '৳5,000',
        reason: 'Q4 performance bonus - Outstanding contribution to project delivery',
        status: STATUS_TYPES.PROCESSING,
        category: LOG_TYPES.PAYROLL,
        type: 'Payroll Change'
      }
    ]

    // Apply filters
    let filteredLogs = allLogs

    if (filters.category && filters.category !== LOG_TYPES.ALL) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category)
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filteredLogs = filteredLogs.filter(log => 
        log.message?.toLowerCase().includes(query) ||
        log.description?.toLowerCase().includes(query) ||
        log.user?.toLowerCase().includes(query) ||
        log.action?.toLowerCase().includes(query) ||
        log.event?.toLowerCase().includes(query) ||
        log.component?.toLowerCase().includes(query) ||
        log.ip?.includes(query) ||
        log.employee?.toLowerCase().includes(query) ||
        log.reason?.toLowerCase().includes(query) ||
        log.type?.toLowerCase().includes(query)
      )
    }

    if (filters.dateFrom) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.dateFrom)
    }

    if (filters.dateTo) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.dateTo)
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    return {
      logs: filteredLogs,
      total: filteredLogs.length,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20
    }
  },

  async exportLogs(format = 'csv', filters = {}) {
    const { logs } = await this.getLogs(filters)
    
    if (format === 'csv') {
      const headers = ['Timestamp', 'Type', 'Category', 'Level/Severity', 'Status', 'Details', 'User/IP']
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          log.timestamp,
          log.type,
          log.category,
          log.level || log.severity || '-',
          log.status || '-',
          `"${(log.message || log.description || log.details || '').replace(/"/g, '""')}"`,
          log.user || log.ip || '-'
        ].join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}

// Utility functions
const getLogTypeConfig = (category) => {
  const configs = {
    [LOG_TYPES.SYSTEM]: {
      icon: Settings,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    [LOG_TYPES.USER]: {
      icon: User,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    [LOG_TYPES.SECURITY]: {
      icon: Shield,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    [LOG_TYPES.PAYROLL]: {
      icon: DollarSign,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    }
  }
  return configs[category] || configs[LOG_TYPES.SYSTEM]
}

const getLevelColor = (level) => {
  const colors = {
    [LOG_LEVELS.ERROR]: 'bg-orange-100 text-orange-800 border-orange-200',
    [LOG_LEVELS.WARNING]: 'bg-orange-100 text-orange-800 border-orange-200',
    [LOG_LEVELS.INFO]: 'bg-orange-100 text-orange-800 border-orange-200',
    [LOG_LEVELS.DEBUG]: 'bg-orange-100 text-orange-800 border-orange-200'
  }
  return colors[level] || colors[LOG_LEVELS.INFO]
}

const getSeverityColor = (severity) => {
  const colors = {
    [SEVERITY_LEVELS.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
    [SEVERITY_LEVELS.MEDIUM]: 'bg-orange-100 text-orange-800 border-orange-200',
    [SEVERITY_LEVELS.LOW]: 'bg-orange-100 text-orange-800 border-orange-200'
  }
  return colors[severity] || 'bg-orange-100 text-orange-800 border-orange-200'
}

const getStatusColor = (status) => {
  const colors = {
    [STATUS_TYPES.SUCCESS]: 'bg-orange-100 text-orange-800 border-orange-200',
    [STATUS_TYPES.FAILED]: 'bg-orange-100 text-orange-800 border-orange-200',
    [STATUS_TYPES.PENDING]: 'bg-orange-100 text-orange-800 border-orange-200',
    [STATUS_TYPES.APPROVED]: 'bg-orange-100 text-orange-800 border-orange-200',
    [STATUS_TYPES.PROCESSING]: 'bg-orange-100 text-orange-800 border-orange-200',
    [STATUS_TYPES.ACTIVE]: 'bg-orange-100 text-orange-800 border-orange-200',
    [STATUS_TYPES.COMPLETED]: 'bg-orange-100 text-orange-800 border-orange-200'
  }
  return colors[status] || 'bg-orange-100 text-orange-800 border-orange-200'
}

// Components
const LogTypeCard = ({ type, count, isSelected, onClick }) => {
  const config = getLogTypeConfig(type.id)
  const Icon = config.icon

  return (
    <div 
      className={`bg-white rounded-lg p-4 border cursor-pointer transition-all duration-200 shadow-sm ${
        isSelected ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{type.title}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
        <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  )
}

const LogRow = ({ log, onView }) => {
  const config = getLogTypeConfig(log.category)

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bgColor} ${config.textColor}`}>
          {log.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {new Date(log.timestamp).toLocaleDateString('en-GB')} {new Date(log.timestamp).toLocaleTimeString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {log.component || log.user || log.event || log.action || '-'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
        <div className="truncate" title={log.message || log.description || log.reason || log.details}>
          {log.message || log.description || log.reason || log.details}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          {log.level && (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getLevelColor(log.level)}`}>
              {log.level}
            </span>
          )}
          {log.severity && (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(log.severity)}`}>
              {log.severity}
            </span>
          )}
          {log.status && (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(log.status)}`}>
              {log.status}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(log)}
            className="p-1 text-gray-500 hover:text-orange-500 transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400 italic">Read-only</span>
        </div>
      </td>
    </tr>
  )
}

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, pageSize }) => {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} logs
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 border border-gray-300 rounded-lg transition-colors"
        >
          Previous
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg transition-colors border ${
                currentPage === page
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
              }`}
            >
              {page}
            </button>
          )
        })}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 border border-gray-300 rounded-lg transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// Custom Date Input Component for DD/MM/YYYY format
const CustomDateInput = ({ value, onChange, placeholder }) => {
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleChange = (e) => {
    const inputValue = e.target.value
    // Allow only numbers and forward slashes
    const cleanValue = inputValue.replace(/[^0-9/]/g, '')
    
    // Auto-format as user types
    let formatted = cleanValue
    if (cleanValue.length >= 2 && !cleanValue.includes('/')) {
      formatted = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2)
    }
    if (cleanValue.length >= 5 && cleanValue.split('/').length === 2) {
      const parts = cleanValue.split('/')
      if (parts[1].length >= 2) {
        formatted = parts[0] + '/' + parts[1].substring(0, 2) + '/' + parts[1].substring(2)
      }
    }
    
    // Convert to ISO format for the parent component
    if (formatted.length === 10 && formatted.includes('/')) {
      const [day, month, year] = formatted.split('/')
      if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
        const isoDate = `${year}-${month}-${day}`
        onChange(isoDate)
      } else {
        onChange('')
      }
    } else {
      onChange('')
    }
  }

  return (
    <input
      type="text"
      value={formatDateToDDMMYYYY(value)}
      onChange={handleChange}
      placeholder={placeholder || "DD/MM/YYYY"}
      maxLength={10}
      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
    />
  )
}

// Main component
export default function AuditLog() {
  // State
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedLogType, setSelectedLogType] = useState(LOG_TYPES.ALL)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedLog, setSelectedLog] = useState(null)
  const [showLogModal, setShowLogModal] = useState(false)

  // Mock user data
  const currentUser = {
    id: 'user123',
    email: 'admin@company.com',
    role: 'admin',
    name: 'System Administrator'
  }

  const isAdmin = currentUser.role === 'admin'

  // Log type configurations
  const logTypes = [
    { id: LOG_TYPES.SYSTEM, title: 'System Logs', description: 'Monitor system operations, errors, and performance metrics', count: 156 },
    { id: LOG_TYPES.USER, title: 'User Activities', description: 'Track user actions, login sessions, and data modifications', count: 89 },
    { id: LOG_TYPES.SECURITY, title: 'Security Events', description: 'Monitor security events, access attempts, and violations', count: 23 },
    { id: LOG_TYPES.PAYROLL, title: 'Payroll Changes', description: 'Track salary modifications, bonuses, and payroll processing', count: 45 }
  ]

  // Load logs
  const loadLogs = useCallback(async () => {
    setLoading(true)
    try {
      const filters = {
        category: selectedLogType,
        searchQuery,
        dateFrom,
        dateTo,
        page: currentPage,
        pageSize
      }
      
      const result = await auditLogService.getLogs(filters)
      setLogs(result.logs)
      setTotalItems(result.total)
    } catch (error) {
      console.error('Error loading logs:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedLogType, searchQuery, dateFrom, dateTo, currentPage, pageSize])

  // Load logs on mount and when filters change
  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  // Handlers
  const handleLogTypeChange = (logType) => {
    setSelectedLogType(logType)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value)
    setCurrentPage(1)
  }

  const handleDateToChange = (e) => {
    setDateTo(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleViewLog = (log) => {
    setSelectedLog(log)
    setShowLogModal(true)
  }

  const handleDeleteLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      // In a real app, this would call an API
      console.log('Deleting log:', logId)
      await loadLogs()
    }
  }

  const handlePrintLogs = () => {
    const printWindow = window.open('', '_blank')
    const printContent = `
      <html>
        <head>
          <title>Audit Logs - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .filters { margin-bottom: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Audit Logs Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Filtered by: ${selectedLogType === 'all' ? 'All Categories' : selectedLogType}</p>
          </div>
          <div class="filters">
            <p><strong>Search Query:</strong> ${searchQuery || 'None'}</p>
            <p><strong>Date Range:</strong> ${dateFrom ? new Date(dateFrom).toLocaleDateString('en-GB') : 'No start date'} - ${dateTo ? new Date(dateTo).toLocaleDateString('en-GB') : 'No end date'}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Timestamp</th>
                <th>Category</th>
                <th>Details</th>
                <th>Status/Level</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map(log => `
                <tr>
                  <td>${log.type}</td>
                  <td>${new Date(log.timestamp).toLocaleString()}</td>
                  <td>${log.component || log.user || log.event || log.action || '-'}</td>
                  <td>${log.message || log.description || log.reason || log.details}</td>
                  <td>${log.level || log.severity || log.status || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const handleRefresh = () => {
    loadLogs()
  }

  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
                <p className="text-gray-600">Comprehensive monitoring and tracking system for all system activities</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="text-right">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="text-gray-900 font-medium">{currentUser.name}</p>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {logTypes.map(logType => (
              <LogTypeCard
                key={logType.id}
                type={logType}
                count={logType.count}
                isSelected={selectedLogType === logType.id}
                onClick={() => handleLogTypeChange(logType.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select 
                value={selectedLogType} 
                onChange={(e) => handleLogTypeChange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value={LOG_TYPES.ALL}>All Categories</option>
                {logTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.title}</option>
                ))}
              </select>
              
              <CustomDateInput
                value={dateFrom}
                onChange={setDateFrom}
                placeholder="From Date (DD/MM/YYYY)"
              />
              
              <CustomDateInput
                value={dateTo}
                onChange={setDateTo}
                placeholder="To Date (DD/MM/YYYY)"
              />
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center gap-2 border border-gray-300"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              {isAdmin && (
                <button
                  onClick={handlePrintLogs}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status/Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading logs...
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No logs found matching your criteria
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <LogRow
                      key={log.id}
                      log={log}
                      onView={handleViewLog}
                      onDelete={handleDeleteLog}
                      isAdmin={isAdmin}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              pageSize={pageSize}
            />
          )}
        </div>
      </div>

      {/* Log Details Modal */}
      {showLogModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Log Details</h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Timestamp</label>
                  <p className="text-gray-900">{new Date(selectedLog.timestamp).toLocaleDateString('en-GB')} {new Date(selectedLog.timestamp).toLocaleTimeString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Type</label>
                  <p className="text-gray-900">{selectedLog.type}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Details</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">
                  {selectedLog.message || selectedLog.description || selectedLog.reason || selectedLog.details}
                </p>
              </div>
              
              {selectedLog.user && (
                <div>
                  <label className="text-sm text-gray-600">User</label>
                  <p className="text-gray-900">{selectedLog.user}</p>
                </div>
              )}
              
              {selectedLog.ip && (
                <div>
                  <label className="text-sm text-gray-600">IP Address</label>
                  <p className="text-gray-900">{selectedLog.ip}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
