import { useState } from 'react'

const AssetMaintenance = () => {
  const [selectedAsset, setSelectedAsset] = useState('')
  const [maintenanceType, setMaintenanceType] = useState('')
  const [maintenanceDate, setMaintenanceDate] = useState('')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [maintenanceProvider, setMaintenanceProvider] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('')

  const [assets] = useState([
    { id: 'AST-001', name: 'HP Laptop EliteBook 840', category: 'Electronics', department: 'IT', status: 'Assigned', lastMaintenance: '2024-07-15' },
    { id: 'AST-004', name: 'Air Conditioner Split Unit', category: 'HVAC', department: 'Production', status: 'Maintenance', lastMaintenance: '2024-08-01' },
    { id: 'AST-006', name: 'Industrial Sewing Machine', category: 'Machinery', department: 'Production', status: 'Assigned', lastMaintenance: '2024-07-20' },
    { id: 'AST-010', name: 'Generator Cummins', category: 'Machinery', department: 'Production', status: 'Available', lastMaintenance: '2024-06-15' },
    { id: 'AST-011', name: 'Forklift Toyota', category: 'Vehicles', department: 'Warehouse', status: 'Assigned', lastMaintenance: '2024-07-10' }
  ])

  const [maintenanceRequests] = useState([
    {
      id: 'MNT-001',
      asset: 'Air Conditioner Split Unit',
      assetId: 'AST-004',
      type: 'Preventive',
      status: 'In Progress',
      requestedDate: '2024-08-01',
      scheduledDate: '2024-08-15',
      estimatedCost: '৳15,000',
      provider: 'CoolTech Services',
      priority: 'High',
      description: 'Regular cleaning and filter replacement',
      requestedBy: 'Production Manager'
    },
    {
      id: 'MNT-002',
      asset: 'Industrial Sewing Machine',
      assetId: 'AST-006',
      type: 'Preventive',
      status: 'Scheduled',
      requestedDate: '2024-07-25',
      scheduledDate: '2024-08-20',
      estimatedCost: '৳8,000',
      provider: 'SewingTech Solutions',
      priority: 'Medium',
      description: 'Annual maintenance and calibration',
      requestedBy: 'Production Supervisor'
    },
    {
      id: 'MNT-003',
      asset: 'Generator Cummins',
      assetId: 'AST-010',
      type: 'Emergency',
      status: 'Completed',
      requestedDate: '2024-07-20',
      completedDate: '2024-07-25',
      actualCost: '৳25,000',
      provider: 'PowerTech Services',
      priority: 'High',
      description: 'Engine oil leak repair and filter replacement',
      requestedBy: 'Maintenance Engineer'
    }
  ])

  const [maintenanceHistory] = useState([
    {
      id: 'HIST-001',
      asset: 'HP Laptop EliteBook 840',
      type: 'Preventive',
      completedDate: '2024-07-15',
      cost: '৳2,500',
      provider: 'IT Support Team',
      description: 'Software updates, cleaning, and performance check',
      technician: 'Ahmed Khan'
    },
    {
      id: 'HIST-002',
      asset: 'Forklift Toyota',
      type: 'Preventive',
      completedDate: '2024-07-10',
      cost: '৳12,000',
      provider: 'Toyota Service Center',
      description: 'Oil change, brake inspection, and general maintenance',
      technician: 'Service Engineer'
    },
    {
      id: 'HIST-003',
      asset: 'Security Camera System',
      type: 'Preventive',
      completedDate: '2024-07-05',
      cost: '৳3,000',
      provider: 'SecurityTech Solutions',
      description: 'Lens cleaning, system check, and software update',
      technician: 'Security Technician'
    }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Maintenance Request:', {
      asset: selectedAsset,
      maintenanceType,
      maintenanceDate,
      estimatedCost,
      maintenanceProvider,
      description,
      priority
    })
    // In a real app, this would make an API call
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Preventive': return 'bg-blue-100 text-blue-800'
      case 'Corrective': return 'bg-orange-100 text-orange-800'
      case 'Emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Maintenance</h1>
        <p className="text-sm text-gray-500">Manage asset maintenance schedules and requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Request Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">New Maintenance Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset *</label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Choose an asset...</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} - {asset.category} ({asset.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Type *</label>
                <select
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select type...</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Corrective">Corrective</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Upgrade">Upgrade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select priority...</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date *</label>
              <input
                type="date"
                value={maintenanceDate}
                onChange={(e) => setMaintenanceDate(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost (৳)</label>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Provider</label>
                <input
                  type="text"
                  value={maintenanceProvider}
                  onChange={(e) => setMaintenanceProvider(e.target.value)}
                  placeholder="Enter provider name"
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Describe the maintenance work needed..."
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
            >
              Submit Maintenance Request
            </button>
          </form>
        </div>

        {/* Maintenance Statistics */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Maintenance Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-semibold text-blue-600">
                  {maintenanceRequests.filter(req => req.status === 'Scheduled' || req.status === 'In Progress').length}
                </div>
                <div className="text-sm text-blue-600">Active</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-semibold text-green-600">
                  {maintenanceHistory.length}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Assets Due for Maintenance</h2>
            <div className="space-y-3">
              {assets.filter(asset => {
                const lastMaintenance = new Date(asset.lastMaintenance)
                const today = new Date()
                const daysSince = Math.floor((today - lastMaintenance) / (1000 * 60 * 60 * 24))
                return daysSince > 30 // Assets due for maintenance after 30 days
              }).map(asset => (
                <div key={asset.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div>
                    <div className="font-medium text-gray-900">{asset.name}</div>
                    <div className="text-sm text-gray-500">{asset.category} • {asset.department}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-orange-600">Due</div>
                    <div className="text-xs text-gray-500">
                      {Math.floor((new Date() - new Date(asset.lastMaintenance)) / (1000 * 60 * 60 * 24))} days ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Maintenance Requests */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Maintenance Requests</h3>
          <p className="text-sm text-gray-500">Track ongoing and scheduled maintenance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.asset}</div>
                    <div className="text-sm text-gray-500">Requested by {request.requestedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}>
                      {request.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.scheduledDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.estimatedCost}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Update</button>
                      <button className="text-orange-600 hover:text-orange-900">Complete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Maintenance History</h3>
          <p className="text-sm text-gray-500">Completed maintenance records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceHistory.map((history) => (
                <tr key={history.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{history.asset}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(history.type)}`}>
                      {history.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{history.completedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{history.cost}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{history.provider}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{history.technician}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Schedule Next</button>
                      <button className="text-orange-600 hover:text-orange-900">Report Issue</button>
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

export default AssetMaintenance
