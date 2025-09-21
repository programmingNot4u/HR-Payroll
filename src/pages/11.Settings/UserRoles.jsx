import { useState } from 'react'

const mockRoles = [
  {
    id: 1,
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: ['all'],
    userCount: 2,
    status: 'Active',
    createdAt: '2024-01-01',
    createdBy: 'System',
    lastModified: '2024-01-15',
    modifiedBy: 'admin@company.com'
  },
  {
    id: 2,
    name: 'HR Manager',
    description: 'Human resources management with employee data access',
    permissions: ['employee_management', 'payroll_view', 'attendance_view', 'reports_view'],
    userCount: 5,
    status: 'Active',
    createdAt: '2024-01-02',
    createdBy: 'admin@company.com',
    lastModified: '2024-01-10',
    modifiedBy: 'hr.director@company.com'
  },
  {
    id: 3,
    name: 'Payroll Administrator',
    description: 'Payroll processing and salary management',
    permissions: ['payroll_management', 'salary_edit', 'deductions_edit', 'reports_view'],
    userCount: 3,
    status: 'Active',
    createdAt: '2024-01-03',
    createdBy: 'hr.manager@company.com',
    lastModified: '2024-01-12',
    modifiedBy: 'payroll.manager@company.com'
  },
  {
    id: 4,
    name: 'Department Manager',
    description: 'Team management with limited employee access',
    permissions: ['team_view', 'attendance_view', 'performance_view', 'reports_view'],
    userCount: 12,
    status: 'Active',
    createdAt: '2024-01-04',
    createdBy: 'hr.manager@company.com',
    lastModified: '2024-01-08',
    modifiedBy: 'hr.manager@company.com'
  },
  {
    id: 5,
    name: 'Employee',
    description: 'Basic employee access to personal information',
    permissions: ['profile_view', 'attendance_view', 'payroll_view'],
    userCount: 156,
    status: 'Active',
    createdAt: '2024-01-05',
    createdBy: 'hr.manager@company.com',
    lastModified: '2024-01-15',
    modifiedBy: 'hr.manager@company.com'
  },
  {
    id: 6,
    name: 'Recruiter',
    description: 'Recruitment and candidate management',
    permissions: ['recruitment_management', 'candidate_view', 'reports_view'],
    userCount: 4,
    status: 'Active',
    createdAt: '2024-01-06',
    createdBy: 'hr.manager@company.com',
    lastModified: '2024-01-11',
    modifiedBy: 'hr.manager@company.com'
  },
  {
    id: 7,
    name: 'Asset Manager',
    description: 'Company asset management and tracking',
    permissions: ['asset_management', 'asset_inventory', 'maintenance_view', 'reports_view'],
    userCount: 2,
    status: 'Active',
    createdAt: '2024-01-07',
    createdBy: 'admin@company.com',
    lastModified: '2024-01-13',
    modifiedBy: 'admin@company.com'
  },
  {
    id: 8,
    name: 'Auditor',
    description: 'System audit and compliance monitoring',
    permissions: ['audit_view', 'reports_view', 'compliance_view'],
    userCount: 1,
    status: 'Active',
    createdAt: '2024-01-08',
    createdBy: 'admin@company.com',
    lastModified: '2024-01-14',
    modifiedBy: 'admin@company.com'
  }
]

const permissionCategories = [
  {
    name: 'Employee Management',
    permissions: ['employee_view', 'employee_create', 'employee_edit', 'employee_delete']
  },
  {
    name: 'Payroll Management',
    permissions: ['payroll_view', 'payroll_edit', 'salary_edit', 'deductions_edit', 'benefits_edit']
  },
  {
    name: 'Attendance Management',
    permissions: ['attendance_view', 'attendance_edit', 'leave_approval', 'timesheet_view']
  },
  {
    name: 'Recruitment',
    permissions: ['recruitment_view', 'candidate_management']
  },
  {
    name: 'Performance Management',
    permissions: ['performance_view', 'appraisal_edit', 'goals_management', 'feedback_view']
  },
  {
    name: 'Asset Management',
    permissions: ['asset_view', 'asset_edit', 'asset_assign', 'maintenance_view']
  },
  {
    name: 'Reports & Analytics',
    permissions: ['reports_view', 'analytics_view', 'export_data', 'dashboard_view']
  },
  {
    name: 'System Administration',
    permissions: ['user_management', 'role_management', 'system_settings', 'audit_view']
  }
]

export default function UserRoles() {
  const [roles, setRoles] = useState(mockRoles)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Mock user role - in real app this would come from authentication context
  const currentUser = {
    id: 'user123',
    email: 'admin@company.com',
    role: 'admin',
    name: 'System Administrator'
  }
  
  const isAdmin = currentUser.role === 'admin'

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || role.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateRole = () => {
    setSelectedRole({
      id: null,
      name: '',
      description: '',
      permissions: [],
      status: 'Active'
    })
    setIsModalOpen(true)
  }

  const handleEditRole = (role) => {
    setSelectedRole({ ...role })
    setIsModalOpen(true)
  }

  const handleDeleteRole = (role) => {
    setSelectedRole(role)
    setIsDeleteModalOpen(true)
  }

  const handleSaveRole = (roleData) => {
    if (roleData.id) {
      // Update existing role
      setRoles(prev => prev.map(role => 
        role.id === roleData.id ? { ...roleData, lastModified: new Date().toISOString().split('T')[0], modifiedBy: currentUser.email } : role
      ))
    } else {
      // Create new role
      const newRole = {
        ...roleData,
        id: Math.max(...roles.map(r => r.id)) + 1,
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: currentUser.email,
        lastModified: new Date().toISOString().split('T')[0],
        modifiedBy: currentUser.email
      }
      setRoles(prev => [...prev, newRole])
    }
    setIsModalOpen(false)
    setSelectedRole(null)
  }

  const confirmDeleteRole = () => {
    setRoles(prev => prev.filter(role => role.id !== selectedRole.id))
    setIsDeleteModalOpen(false)
    setSelectedRole(null)
  }

  const getPermissionCount = (permissions) => {
    if (permissions.includes('all')) return 'All Permissions'
    return `${permissions.length} permissions`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">User Roles Management</h1>
                <p className="text-gray-400">Define and manage user roles and their associated permissions</p>
              </div>
            </div>
            
            {isAdmin && (
              <button
                onClick={handleCreateRole}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Role
              </button>
            )}
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Roles</p>
                  <p className="text-2xl font-bold text-white">{roles.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Roles</p>
                  <p className="text-2xl font-bold text-white">{roles.filter(r => r.status === 'Active').length}</p>
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
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{roles.reduce((sum, role) => sum + role.userCount, 0)}</p>
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Permission Sets</p>
                  <p className="text-2xl font-bold text-white">{permissionCategories.length}</p>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
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
        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
              {isAdmin && (
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Export Roles
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Modified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredRoles.map((role, index) => (
                  <tr key={role.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{role.name}</div>
                        <div className="text-sm text-gray-400">ID: {role.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                      {role.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getPermissionCount(role.permissions)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {role.userCount} users
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(role.status)}`}>
                        {role.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div>{role.lastModified}</div>
                        <div className="text-xs text-gray-400">by {role.modifiedBy}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {isAdmin && role.userCount === 0 && (
                          <button
                            onClick={() => handleDeleteRole(role)}
                            className="w-6 h-6 bg-red-600 hover:bg-red-700 rounded transition-colors flex items-center justify-center"
                          >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {selectedRole?.id ? 'Edit Role' : 'Create New Role'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role Name</label>
                <input
                  type="text"
                  value={selectedRole?.name || ''}
                  onChange={(e) => setSelectedRole(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter role name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={selectedRole?.description || ''}
                  onChange={(e) => setSelectedRole(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter role description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={selectedRole?.status || 'Active'}
                  onChange={(e) => setSelectedRole(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveRole(selectedRole)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {selectedRole?.id ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Delete Role</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRole}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
