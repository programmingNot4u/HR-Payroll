import { useState } from 'react'

const AssetInventory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const [assets] = useState([
    {
      id: 'AST-001',
      name: 'HP Laptop EliteBook 840',
      category: 'Electronics',
      department: 'IT',
      assignedTo: 'Ahmed Khan',
      assignedToId: 'EMP-001',
      status: 'Assigned',
      purchaseDate: '2024-01-15',
      warrantyExpiry: '2027-01-15',
      value: '৳85,000',
      location: 'IT Department - Floor 2',
      serialNumber: 'HP-ELB-840-2024-001',
      condition: 'Excellent',
      lastMaintenance: '2024-07-15'
    },
    {
      id: 'AST-002',
      name: 'Canon Printer PIXMA',
      category: 'Office Equipment',
      department: 'Storage',
      assignedTo: 'Unassigned',
      assignedToId: null,
      status: 'Available',
      purchaseDate: '2024-02-20',
      warrantyExpiry: '2026-02-20',
      value: '৳25,000',
      location: 'Storage Room A',
      serialNumber: 'CAN-PIX-2024-002',
      condition: 'Good',
      lastMaintenance: '2024-06-20'
    },
    {
      id: 'AST-003',
      name: 'Office Chair Ergonomic',
      category: 'Furniture',
      department: 'Management',
      assignedTo: 'Fatima Rahman',
      assignedToId: 'EMP-002',
      status: 'Assigned',
      purchaseDate: '2024-03-10',
      warrantyExpiry: '2026-03-10',
      value: '৳15,000',
      location: 'Management Office - Floor 3',
      serialNumber: 'FUR-CHR-ERG-2024-003',
      condition: 'Excellent',
      lastMaintenance: '2024-07-10'
    },
    {
      id: 'AST-004',
      name: 'Air Conditioner Split Unit',
      category: 'HVAC',
      department: 'Maintenance',
      assignedTo: 'Unassigned',
      assignedToId: null,
      status: 'Maintenance',
      purchaseDate: '2023-06-15',
      warrantyExpiry: '2025-06-15',
      value: '৳120,000',
      location: 'Production Floor - Unit 1',
      serialNumber: 'HVAC-AC-SPLIT-2023-004',
      condition: 'Fair',
      lastMaintenance: '2024-08-01'
    },
    {
      id: 'AST-005',
      name: 'Security Camera System',
      category: 'Security',
      department: 'Security',
      assignedTo: 'Unassigned',
      assignedToId: null,
      status: 'Available',
      purchaseDate: '2024-04-05',
      warrantyExpiry: '2027-04-05',
      value: '৳75,000',
      location: 'Security Office',
      serialNumber: 'SEC-CAM-SYS-2024-005',
      condition: 'Excellent',
      lastMaintenance: '2024-07-05'
    },
    {
      id: 'AST-006',
      name: 'Industrial Sewing Machine',
      category: 'Machinery',
      department: 'Production',
      assignedTo: 'Production Team A',
      assignedToId: 'TEAM-001',
      status: 'Assigned',
      purchaseDate: '2023-12-01',
      warrantyExpiry: '2025-12-01',
      value: '৳250,000',
      location: 'Production Floor - Sewing Section',
      serialNumber: 'MAC-SEW-IND-2023-006',
      condition: 'Good',
      lastMaintenance: '2024-07-20'
    }
  ])

  const categories = ['all', 'Electronics', 'Office Equipment', 'Furniture', 'HVAC', 'Security', 'Machinery', 'Vehicles']
  const statuses = ['all', 'Available', 'Assigned', 'Maintenance', 'Retired', 'Lost']
  const departments = ['all', 'IT', 'Management', 'Production', 'Security', 'Storage', 'Maintenance']

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus
    const matchesDepartment = selectedDepartment === 'all' || asset.department === selectedDepartment

    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800'
      case 'Assigned': return 'bg-blue-100 text-blue-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'Retired': return 'bg-gray-100 text-gray-800'
      case 'Lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'text-green-600'
      case 'Good': return 'text-blue-600'
      case 'Fair': return 'text-yellow-600'
      case 'Poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Calculate total asset value
  const totalAssetValue = assets.reduce((total, asset) => {
    const value = parseInt(asset.value.replace(/[^\d]/g, ''))
    return total + value
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Inventory</h1>
        <p className="text-sm text-gray-500">Manage and track all company assets</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Assets</label>
            <input
              type="text"
              placeholder="Search by name, ID, or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors">
              Add New Asset
            </button>
          </div>
        </div>
      </div>

      {/* Asset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-semibold text-gray-900">{assets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-semibold text-gray-900">
                {assets.filter(asset => asset.status === 'Available').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-2xl font-semibold text-gray-900">
                {assets.filter(asset => asset.status === 'Assigned').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {assets.filter(asset => asset.status === 'Maintenance').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">৳{totalAssetValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Asset List</h3>
          <p className="text-sm text-gray-500">Showing {filteredAssets.length} of {assets.length} assets</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.id}</div>
                      <div className="text-xs text-gray-400">{asset.serialNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{asset.category}</span>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <span className="text-sm text-gray-900">
                       {asset.status === 'Available' ? 'Storage' : asset.department}
                     </span>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     {asset.assignedTo === 'Unassigned' ? (
                       <span className="text-sm text-gray-500">-</span>
                     ) : (
                       <div>
                         <div className="text-sm font-medium text-gray-900">{asset.assignedTo}</div>
                         <div className="text-xs text-gray-500">{asset.assignedToId}</div>
                       </div>
                     )}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{asset.value}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-orange-600 hover:text-orange-900">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-green-600 hover:text-green-900">Assign</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AssetInventory
