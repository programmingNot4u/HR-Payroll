import { useState } from 'react'

const mockAccessLogs = [
  {
    id: 1,
    timestamp: '2024-01-15 15:30:25',
    user: 'john.doe@company.com',
    action: 'LOGIN_SUCCESS',
    ip: '192.168.1.100',
    location: 'Office Network',
    userAgent: 'Chrome 120.0.0.0 / Windows 11',
    status: 'SUCCESS',
    sessionId: 'sess_abc123',
    duration: '45 minutes'
  },
  {
    id: 2,
    timestamp: '2024-01-15 15:25:18',
    user: 'jane.smith@company.com',
    action: 'LOGIN_FAILED',
    ip: '203.45.67.89',
    location: 'External Network',
    userAgent: 'Firefox 121.0 / macOS 14.0',
    status: 'FAILED',
    reason: 'Invalid credentials',
    attempts: 3
  },
  {
    id: 3,
    timestamp: '2024-01-15 15:20:42',
    user: 'admin@company.com',
    action: 'PASSWORD_CHANGE',
    ip: '172.16.0.10',
    location: 'Admin Network',
    userAgent: 'Chrome 120.0.0.0 / Windows 11',
    status: 'SUCCESS',
    securityLevel: 'High',
    twoFactorUsed: true
  },
  {
    id: 4,
    timestamp: '2024-01-15 15:15:33',
    user: 'hr.manager@company.com',
    action: 'SENSITIVE_ACCESS',
    ip: '192.168.1.150',
    location: 'Office Network',
    userAgent: 'Chrome 120.0.0.0 / Windows 11',
    status: 'SUCCESS',
    resource: '/confidential/salary_data.xlsx',
    permissionLevel: 'Manager'
  },
  {
    id: 5,
    timestamp: '2024-01-15 15:10:15',
    user: 'payroll.admin@company.com',
    action: 'BULK_OPERATION',
    ip: '10.0.0.75',
    location: 'Payroll Network',
    userAgent: 'Chrome 120.0.0.0 / Windows 11',
    status: 'SUCCESS',
    operation: 'Salary Update',
    recordsAffected: 45
  }
]

const mockSecurityPolicies = [
  {
    id: 1,
    name: 'Password Policy',
    description: 'Enforces strong password requirements and expiration',
    status: 'Active',
    priority: 'HIGH',
    rules: [
      'Minimum 8 characters',
      'Must contain uppercase, lowercase, number, and special character',
      'Cannot reuse last 5 passwords',
      'Expires every 90 days'
    ],
    lastUpdated: '2024-01-10',
    updatedBy: 'admin@company.com'
  },
  {
    id: 2,
    name: 'Session Management',
    description: 'Controls user session duration and security',
    status: 'Active',
    priority: 'MEDIUM',
    rules: [
      'Session timeout: 30 minutes of inactivity',
      'Maximum session duration: 8 hours',
      'Force logout on IP change',
      'Concurrent session limit: 2'
    ],
    lastUpdated: '2024-01-12',
    updatedBy: 'admin@company.com'
  },
  {
    id: 3,
    name: 'IP Restriction',
    description: 'Restricts access to specific IP ranges and locations',
    status: 'Active',
    priority: 'HIGH',
    rules: [
      'Office network: 192.168.1.0/24',
      'Admin network: 172.16.0.0/16',
      'Payroll network: 10.0.0.0/8',
      'VPN access required for external IPs'
    ],
    lastUpdated: '2024-01-08',
    updatedBy: 'admin@company.com'
  },
  {
    id: 4,
    name: 'Two-Factor Authentication',
    description: 'Requires 2FA for sensitive operations',
    status: 'Active',
    priority: 'HIGH',
    rules: [
      'Required for admin accounts',
      'Required for payroll operations',
      'Required for external network access',
      'SMS or authenticator app allowed'
    ],
    lastUpdated: '2024-01-05',
    updatedBy: 'admin@company.com'
  },
  {
    id: 5,
    name: 'Data Access Control',
    description: 'Controls access to sensitive data and operations',
    status: 'Active',
    priority: 'MEDIUM',
    rules: [
      'Role-based access control',
      'Audit logging for all data access',
      'Encryption for sensitive data',
      'Access approval for high-risk operations'
    ],
    lastUpdated: '2024-01-15',
    updatedBy: 'admin@company.com'
  }
]

const mockIPWhitelist = [
  {
    id: 1,
    ip: '192.168.1.0/24',
    description: 'Office Network',
    type: 'Internal',
    status: 'Active',
    addedBy: 'admin@company.com',
    addedDate: '2024-01-01',
    lastAccess: '2024-01-15 15:30:25'
  },
  {
    id: 2,
    ip: '172.16.0.0/16',
    description: 'Admin Network',
    type: 'Internal',
    status: 'Active',
    addedBy: 'admin@company.com',
    addedDate: '2024-01-01',
    lastAccess: '2024-01-15 15:20:42'
  },
  {
    id: 3,
    ip: '10.0.0.0/8',
    description: 'Payroll Network',
    type: 'Internal',
    status: 'Active',
    addedBy: 'admin@company.com',
    addedDate: '2024-01-01',
    lastAccess: '2024-01-15 15:10:15'
  },
  {
    id: 4,
    ip: '203.45.67.89',
    description: 'VPN Gateway',
    type: 'External',
    status: 'Active',
    addedBy: 'admin@company.com',
    addedDate: '2024-01-05',
    lastAccess: '2024-01-15 15:25:18'
  }
]

const mockIPBlacklist = [
  {
    id: 1,
    ip: '185.220.101.45',
    description: 'Known malicious IP',
    type: 'Blocked',
    status: 'Active',
    reason: 'Suspicious activity detected',
    addedBy: 'security@company.com',
    addedDate: '2024-01-10',
    threatLevel: 'HIGH'
  },
  {
    id: 2,
    ip: '103.21.244.12',
    description: 'Brute force attempt',
    type: 'Blocked',
    status: 'Active',
    reason: 'Multiple failed login attempts',
    addedBy: 'security@company.com',
    addedDate: '2024-01-12',
    threatLevel: 'MEDIUM'
  }
]

export default function AccessControl() {
  const [activeTab, setActiveTab] = useState('access-logs')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAction, setFilterAction] = useState('all')
  
  // Mock user role - in real app this would come from authentication context
  const currentUser = {
    id: 'user123',
    email: 'admin@company.com',
    role: 'admin',
    name: 'System Administrator'
  }
  
  const isAdmin = currentUser.role === 'admin'

  const filteredAccessLogs = mockAccessLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.ip.includes(searchQuery) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus
    const matchesAction = filterAction === 'all' || log.action === filterAction
    return matchesSearch && matchesStatus && matchesAction
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'BLOCKED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'LOGIN_FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'PASSWORD_CHANGE':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SENSITIVE_ACCESS':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'BULK_OPERATION':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Access Control</h1>
                <p className="text-gray-400">Monitor and manage system access, security policies, and IP restrictions</p>
              </div>
            </div>
            
            {isAdmin && (
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Security Alert
              </button>
            )}
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Sessions</p>
                  <p className="text-2xl font-bold text-white">23</p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Failed Attempts</p>
                  <p className="text-2xl font-bold text-white">7</p>
                </div>
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Blocked IPs</p>
                  <p className="text-2xl font-bold text-white">{mockIPBlacklist.length}</p>
                </div>
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Security Policies</p>
                  <p className="text-2xl font-bold text-white">{mockSecurityPolicies.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'access-logs', name: 'Access Logs', count: mockAccessLogs.length },
                { id: 'security-policies', name: 'Security Policies', count: mockSecurityPolicies.length },
                { id: 'ip-whitelist', name: 'IP Whitelist', count: mockIPWhitelist.length },
                { id: 'ip-blacklist', name: 'IP Blacklist', count: mockIPBlacklist.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id ? 'bg-red-100 text-red-800' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Access Logs Tab */}
        {activeTab === 'access-logs' && (
          <div>
            {/* Filters */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search access logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex gap-3">
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Status</option>
                    <option value="SUCCESS">Success</option>
                    <option value="FAILED">Failed</option>
                    <option value="PENDING">Pending</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                  <select 
                    value={filterAction} 
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Actions</option>
                    <option value="LOGIN_SUCCESS">Login Success</option>
                    <option value="LOGIN_FAILED">Login Failed</option>
                    <option value="PASSWORD_CHANGE">Password Change</option>
                    <option value="SENSITIVE_ACCESS">Sensitive Access</option>
                    <option value="BULK_OPERATION">Bulk Operation</option>
                  </select>
                  {isAdmin && (
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      Export Logs
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Access Logs Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredAccessLogs.map((log, index) => (
                      <tr key={log.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{log.user}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getActionColor(log.action)}`}>
                            {log.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div>
                            <div className="font-medium">{log.ip}</div>
                            <div className="text-xs text-gray-400">{log.userAgent}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {log.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          <div className="space-y-1">
                            {log.sessionId && <div>Session: {log.sessionId}</div>}
                            {log.duration && <div>Duration: {log.duration}</div>}
                            {log.reason && <div>Reason: {log.reason}</div>}
                            {log.attempts && <div>Attempts: {log.attempts}</div>}
                            {log.resource && <div>Resource: {log.resource}</div>}
                            {log.operation && <div>Operation: {log.operation}</div>}
                            {log.recordsAffected && <div>Records: {log.recordsAffected}</div>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Security Policies Tab */}
        {activeTab === 'security-policies' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockSecurityPolicies.map(policy => (
              <div key={policy.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{policy.name}</h3>
                    <p className="text-gray-400 text-sm">{policy.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(policy.priority)}`}>
                      {policy.priority}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {policy.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-300">{rule}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-gray-400">
                  Last updated: {policy.lastUpdated} by {policy.updatedBy}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* IP Whitelist Tab */}
        {activeTab === 'ip-whitelist' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Added By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Access</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {mockIPWhitelist.map((ip, index) => (
                    <tr key={ip.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{ip.ip}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ip.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ip.type === 'Internal' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ip.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(ip.status)}`}>
                          {ip.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ip.addedBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ip.lastAccess}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* IP Blacklist Tab */}
        {activeTab === 'ip-blacklist' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Threat Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Added By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Added Date</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {mockIPBlacklist.map((ip, index) => (
                    <tr key={ip.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{ip.ip}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ip.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getThreatLevelColor(ip.threatLevel)}`}>
                          {ip.threatLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ip.reason}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ip.addedBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ip.addedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
