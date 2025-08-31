import { useState } from 'react'

const AssignAsset = () => {
  const [selectedAsset, setSelectedAsset] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [assignmentDate, setAssignmentDate] = useState('')
  const [expectedReturnDate, setExpectedReturnDate] = useState('')
  const [assignmentReason, setAssignmentReason] = useState('')
  const [assignedBy, setAssignedBy] = useState('')
  const [notes, setNotes] = useState('')

  const [availableAssets] = useState([
    { id: 'AST-002', name: 'Canon Printer PIXMA', category: 'Office Equipment', department: 'HR', value: '৳25,000' },
    { id: 'AST-005', name: 'Security Camera System', category: 'Security', department: 'Security', value: '৳75,000' },
    { id: 'AST-007', name: 'Dell Desktop OptiPlex', category: 'Electronics', department: 'IT', value: '৳45,000' },
    { id: 'AST-008', name: 'Office Desk Executive', category: 'Furniture', department: 'Management', value: '৳18,000' },
    { id: 'AST-009', name: 'Projector Epson', category: 'Office Equipment', department: 'Training', value: '৳35,000' }
  ])

  const [employees] = useState([
    { id: 'EMP-001', name: 'Ahmed Khan', department: 'IT', position: 'Software Developer', email: 'ahmed.khan@rpcal.com' },
    { id: 'EMP-002', name: 'Fatima Rahman', department: 'Management', position: 'HR Manager', email: 'fatima.rahman@rpcal.com' },
    { id: 'EMP-003', name: 'Mohammed Ali', department: 'Production', position: 'Production Supervisor', email: 'mohammed.ali@rpcal.com' },
    { id: 'EMP-004', name: 'Aisha Begum', department: 'Finance', position: 'Accountant', email: 'aisha.begum@rpcal.com' },
    { id: 'EMP-005', name: 'Rashid Ahmed', department: 'Security', position: 'Security Officer', email: 'rashid.ahmed@rpcal.com' },
    { id: 'EMP-006', name: 'Nadia Khan', department: 'Marketing', position: 'Marketing Executive', email: 'nadia.khan@rpcal.com' }
  ])

  const [recentAssignments] = useState([
    {
      id: 'ASG-001',
      asset: 'HP Laptop EliteBook 840',
      employee: 'Ahmed Khan',
      assignedDate: '2024-08-01',
      expectedReturn: '2025-08-01',
      status: 'Active',
      assignedBy: 'HR Manager'
    },
    {
      id: 'ASG-002',
      asset: 'Office Chair Ergonomic',
      employee: 'Fatima Rahman',
      assignedDate: '2024-07-15',
      expectedReturn: '2025-07-15',
      status: 'Active',
      assignedBy: 'Admin'
    },
    {
      id: 'ASG-003',
      asset: 'Industrial Sewing Machine',
      employee: 'Production Team A',
      assignedDate: '2024-06-01',
      expectedReturn: '2025-06-01',
      status: 'Active',
      assignedBy: 'Production Manager'
    }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Asset Assignment:', {
      asset: selectedAsset,
      employee: selectedEmployee,
      assignmentDate,
      expectedReturnDate,
      assignmentReason,
      assignedBy,
      notes
    })
    // In a real app, this would make an API call
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Returned': return 'bg-blue-100 text-blue-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Assign Asset</h1>
        <p className="text-sm text-gray-500">Assign company assets to employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">New Asset Assignment</h2>
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
                {availableAssets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} - {asset.category} (৳{asset.value})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee *</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Choose an employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.position} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Date *</label>
                <input
                  type="date"
                  value={assignmentDate}
                  onChange={(e) => setAssignmentDate(e.target.value)}
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Return Date</label>
                <input
                  type="date"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Reason *</label>
              <select
                value={assignmentReason}
                onChange={(e) => setAssignmentReason(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select reason...</option>
                <option value="work_requirement">Work Requirement</option>
                <option value="project_assignment">Project Assignment</option>
                <option value="temporary_use">Temporary Use</option>
                <option value="replacement">Replacement</option>
                <option value="new_position">New Position</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned By *</label>
              <input
                type="text"
                value={assignedBy}
                onChange={(e) => setAssignedBy(e.target.value)}
                required
                placeholder="Enter your name/position"
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any additional information about the assignment..."
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
            >
              Assign Asset
            </button>
          </form>
        </div>

        {/* Available Assets Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Available Assets</h2>
            <div className="space-y-3">
              {availableAssets.map(asset => (
                <div key={asset.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div>
                    <div className="font-medium text-gray-900">{asset.name}</div>
                    <div className="text-sm text-gray-500">{asset.category} • {asset.department}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{asset.value}</div>
                    <div className="text-xs text-green-600">Available</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-semibold text-blue-600">{availableAssets.length}</div>
                <div className="text-sm text-blue-600">Available</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-semibold text-green-600">{recentAssignments.length}</div>
                <div className="text-sm text-green-600">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Asset Assignments</h3>
          <p className="text-sm text-gray-500">Track current asset assignments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Return</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{assignment.asset}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.employee}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.assignedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.expectedReturn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.assignedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Return</button>
                      <button className="text-orange-600 hover:text-orange-900">Extend</button>
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

export default AssignAsset
