import { useState } from 'react'

const auditLogTypes = [
  {
    id: 'system',
    title: 'System Logs',
    description: 'Monitor system operations, errors, and performance metrics',
    icon: '🔧',
    color: 'from-blue-600 to-blue-800',
    count: 156
  },
  {
    id: 'user',
    title: 'User Activities',
    description: 'Track user actions, login sessions, and data modifications',
    icon: '👤',
    color: 'from-green-600 to-green-800',
    count: 89
  },
  {
    id: 'security',
    title: 'Security Events',
    description: 'Monitor security events, access attempts, and violations',
    icon: '🛡️',
    color: 'from-red-600 to-red-800',
    count: 23
  },
  {
    id: 'payroll',
    title: 'Payroll Changes',
    description: 'Track salary modifications, bonuses, and payroll processing',
    icon: '💰',
    color: 'from-purple-600 to-purple-800',
    count: 45
  }
]

const mockSystemLogs = [
  {
    id: 1,
    timestamp: '2024-01-15 14:30:25',
    level: 'INFO',
    component: 'Database',
    message: 'Database backup completed successfully',
    details: 'Backup size: 2.4GB, Duration: 15m 32s, Location: /backups/db_20240115_143025.sql'
  },
  {
    id: 2,
    timestamp: '2024-01-15 14:28:10',
    level: 'WARNING',
    component: 'Email Service',
    message: 'SMTP connection timeout',
    details: 'Retry attempt 2/3, Server: smtp.company.com, Port: 587, Timeout: 30s'
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:25:45',
    level: 'ERROR',
    component: 'File Upload',
    message: 'Failed to process large file upload',
    details: 'File size: 45MB, User: john.doe, Error: Memory limit exceeded, Max allowed: 25MB'
  },
  {
    id: 4,
    timestamp: '2024-01-15 14:22:18',
    level: 'INFO',
    component: 'Cache',
    message: 'Cache cleared successfully',
    details: 'Cleared 1,245 items, Memory freed: 128MB, Cache hit rate: 87.3%'
  },
  {
    id: 5,
    timestamp: '2024-01-15 14:20:15',
    level: 'INFO',
    component: 'Payroll Engine',
    message: 'Monthly payroll calculation started',
    details: 'Processing 156 employees, Estimated time: 45 minutes, Tax year: 2024-25'
  }
]

const mockUserLogs = [
  {
    id: 1,
    timestamp: '2024-01-15 14:35:22',
    user: 'john.doe@company.com',
    action: 'LOGIN_SUCCESS',
    ip: '192.168.1.100',
    status: 'SUCCESS',
    details: 'User logged in from Chrome browser, Session ID: sess_abc123'
  },
  {
    id: 2,
    timestamp: '2024-01-15 14:30:15',
    user: 'jane.smith@company.com',
    action: 'PASSWORD_CHANGE',
    ip: '10.0.0.50',
    status: 'SUCCESS',
    details: 'Password changed successfully, Security level: High'
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:25:08',
    user: 'admin@company.com',
    action: 'USER_CREATED',
    ip: '172.16.0.10',
    status: 'SUCCESS',
    details: 'New user account created: mike.wilson@company.com'
  },
  {
    id: 4,
    timestamp: '2024-01-15 14:20:33',
    user: 'hr.manager@company.com',
    action: 'EMPLOYEE_UPDATE',
    ip: '192.168.1.150',
    status: 'SUCCESS',
    details: 'Employee profile updated: EMP001 - John Doe, Department: IT'
  },
  {
    id: 5,
    timestamp: '2024-01-15 14:15:45',
    user: 'payroll.admin@company.com',
    action: 'SALARY_UPDATE',
    ip: '10.0.0.75',
    status: 'SUCCESS',
    details: 'Salary updated for 5 employees, Total processed: ৳2,450,000'
  }
]

const mockSecurityLogs = [
  {
    id: 1,
    timestamp: '2024-01-15 14:40:15',
    event: 'LOGIN_ATTEMPT',
    severity: 'HIGH',
    ip: '203.45.67.89',
    description: 'Multiple failed login attempts detected',
    details: '5 failed attempts in 2 minutes, Account: admin@company.com, IP blocked for 30 minutes'
  },
  {
    id: 2,
    timestamp: '2024-01-15 14:35:42',
    event: 'FILE_ACCESS',
    severity: 'MEDIUM',
    ip: '192.168.1.100',
    description: 'Sensitive file access detected',
    details: 'File: /confidential/salary_data.xlsx, User: john.doe, Action: READ'
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:30:18',
    event: 'PERMISSION_CHANGE',
    severity: 'HIGH',
    ip: '172.16.0.10',
    description: 'User permissions modified',
    details: 'User: mike.wilson, Old role: employee, New role: manager, Modified by: admin'
  },
  {
    id: 4,
    timestamp: '2024-01-15 14:25:55',
    event: 'SESSION_EXPIRED',
    severity: 'LOW',
    ip: '192.168.1.200',
    description: 'User session expired due to inactivity',
    details: 'User: sarah.johnson, Session duration: 45 minutes, Auto-logout: Yes'
  },
  {
    id: 5,
    timestamp: '2024-01-15 14:20:30',
    event: 'API_RATE_LIMIT',
    severity: 'MEDIUM',
    ip: '203.45.67.90',
    description: 'API rate limit exceeded',
    details: 'Endpoint: /api/employees, Requests: 150/min, Limit: 100/min, IP: 203.45.67.90'
  }
]

const mockPayrollLogs = [
  {
    id: 1,
    timestamp: '2024-01-15 14:45:30',
    user: 'hr.manager@company.com',
    action: 'SALARY_UPDATE',
    employee: 'EMP001 - John Doe',
    oldValue: '৳45,000',
    newValue: '৳48,000',
    reason: 'Annual performance review - Rating: A, Merit increase: 6.7%',
    status: 'APPROVED'
  },
  {
    id: 2,
    timestamp: '2024-01-15 14:40:15',
    user: 'payroll.admin@company.com',
    action: 'BONUS_ADDED',
    employee: 'EMP023 - Sarah Johnson',
    oldValue: '৳0',
    newValue: '৳5,000',
    reason: 'Q4 performance bonus - Outstanding contribution to project delivery',
    status: 'PROCESSING'
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:35:22',
    user: 'hr.director@company.com',
    action: 'ALLOWANCE_UPDATE',
    employee: 'EMP045 - Mike Wilson',
    oldValue: '৳2,000',
    newValue: '৳2,500',
    reason: 'Transportation allowance increase - New location assignment',
    status: 'ACTIVE'
  },
  {
    id: 4,
    timestamp: '2024-01-15 14:30:18',
    user: 'payroll.manager@company.com',
    action: 'DEDUCTION_ADDED',
    employee: 'EMP078 - David Wilson',
    oldValue: '৳0',
    newValue: '৳1,500',
    reason: 'Health insurance premium - Family coverage plan',
    status: 'ACTIVE'
  },
  {
    id: 5,
    timestamp: '2024-01-15 14:25:45',
    user: 'hr.admin@company.com',
    action: 'SALARY_RESTORATION',
    employee: 'EMP012 - Lisa Chen',
    oldValue: '৳38,000',
    newValue: '৳42,000',
    reason: 'Salary restored after performance improvement - Previous freeze: 6 months',
    status: 'APPROVED'
  }
]

export default function AuditLog() {
  const [selectedLogType, setSelectedLogType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock user role - in real app this would come from authentication context
  const currentUser = {
    id: 'user123',
    email: 'admin@company.com',
    role: 'admin',
    name: 'System Administrator'
  }
  
  const isAdmin = currentUser.role === 'admin'

  const getAllLogs = () => {
    return [
      ...mockSystemLogs.map(log => ({ ...log, category: 'system', type: 'System Log' })),
      ...mockUserLogs.map(log => ({ ...log, category: 'user', type: 'User Activity' })),
      ...mockSecurityLogs.map(log => ({ ...log, category: 'security', type: 'Security Event' })),
      ...mockPayrollLogs.map(log => ({ ...log, category: 'payroll', type: 'Payroll Change' }))
    ]
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'INFO':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'INFO':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ACTIVE':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredLogs = getAllLogs().filter(log => {
    // Filter by category first
    if (selectedLogType !== 'all' && log.category !== selectedLogType) {
      return false
    }
    
    // Then filter by search query
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
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
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
                <p className="text-gray-400">Comprehensive monitoring and tracking system for all system activities</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="text-right">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="text-white font-medium">{currentUser.name}</p>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {auditLogTypes.map(logType => (
              <div key={logType.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{logType.title}</p>
                    <p className="text-2xl font-bold text-white">{logType.count}</p>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-r ${logType.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-xl">{logType.icon}</span>
                  </div>
                </div>
              </div>
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
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={selectedLogType} 
                onChange={(e) => setSelectedLogType(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Categories</option>
                <option value="system">System Logs</option>
                <option value="user">User Activities</option>
                <option value="security">Security Events</option>
                <option value="payroll">Payroll Changes</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {isAdmin && (
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                  Export Logs
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status/Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredLogs.slice(0, 20).map((log, index) => (
                  <tr key={log.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.category === 'system' ? 'bg-blue-100 text-blue-800' :
                        log.category === 'user' ? 'bg-green-100 text-green-800' :
                        log.category === 'security' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.component || log.user || log.event || log.action}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                      {log.message || log.description || log.reason || log.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {isAdmin && (
                        <button className="w-6 h-6 bg-gray-600 hover:bg-red-600 rounded transition-colors flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing 20 of {filteredLogs.length} logs
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                  Previous
                </button>
                <button className="px-3 py-2 bg-orange-600 text-white rounded-lg">1</button>
                <button className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">2</button>
                <button className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">3</button>
                <button className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
