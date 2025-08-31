import { useState } from 'react'

const AssetReturn = () => {
  const [selectedAssignment, setSelectedAssignment] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [returnCondition, setReturnCondition] = useState('')
  const [returnReason, setReturnReason] = useState('')
  const [receivedBy, setReceivedBy] = useState('')
  const [returnNotes, setReturnNotes] = useState('')

  const [activeAssignments] = useState([
    {
      id: 'ASG-001',
      asset: 'HP Laptop EliteBook 840',
      assetId: 'AST-001',
      employee: 'Ahmed Khan',
      employeeId: 'EMP-001',
      assignedDate: '2024-08-01',
      expectedReturn: '2025-08-01',
      status: 'Active',
      assignedBy: 'HR Manager',
      assetCondition: 'Excellent',
      assetValue: '৳85,000',
      department: 'IT'
    },
    {
      id: 'ASG-002',
      asset: 'Office Chair Ergonomic',
      assetId: 'AST-003',
      employee: 'Fatima Rahman',
      employeeId: 'EMP-002',
      assignedDate: '2024-07-15',
      expectedReturn: '2025-07-15',
      status: 'Active',
      assignedBy: 'Admin',
      assetCondition: 'Excellent',
      assetValue: '৳15,000',
      department: 'Management'
    },
    {
      id: 'ASG-003',
      asset: 'Industrial Sewing Machine',
      assetId: 'AST-006',
      employee: 'Production Team A',
      employeeId: 'TEAM-001',
      assignedDate: '2024-06-01',
      expectedReturn: '2025-06-01',
      status: 'Active',
      assignedBy: 'Production Manager',
      assetCondition: 'Good',
      assetValue: '৳250,000',
      department: 'Production'
    },
    {
      id: 'ASG-004',
      asset: 'Canon Printer PIXMA',
      assetId: 'AST-002',
      employee: 'Aisha Begum',
      employeeId: 'EMP-004',
      assignedDate: '2024-05-20',
      expectedReturn: '2024-08-20',
      status: 'Overdue',
      assignedBy: 'HR Manager',
      assetCondition: 'Good',
      assetValue: '৳25,000',
      department: 'Finance'
    }
  ])

  const [recentReturns] = useState([
    {
      id: 'RET-001',
      asset: 'Dell Desktop OptiPlex',
      employee: 'Mohammed Ali',
      returnDate: '2024-08-10',
      returnCondition: 'Good',
      returnReason: 'Project Completed',
      receivedBy: 'IT Manager',
      assetValue: '৳45,000'
    },
    {
      id: 'RET-002',
      asset: 'Office Desk Executive',
      employee: 'Nadia Khan',
      returnDate: '2024-08-05',
      returnCondition: 'Excellent',
      returnReason: 'Position Change',
      receivedBy: 'Admin',
      assetValue: '৳18,000'
    },
    {
      id: 'RET-003',
      asset: 'Projector Epson',
      employee: 'Training Team',
      returnDate: '2024-07-30',
      returnCondition: 'Fair',
      returnReason: 'Training Session Ended',
      receivedBy: 'Training Manager',
      assetValue: '৳35,000'
    }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Asset Return:', {
      assignment: selectedAssignment,
      returnDate,
      returnCondition,
      returnReason,
      receivedBy,
      returnNotes
    })
    // In a real app, this would make an API call
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      case 'Returned': return 'bg-blue-100 text-blue-800'
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

  const selectedAssignmentData = activeAssignments.find(assignment => assignment.id === selectedAssignment)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Return</h1>
        <p className="text-sm text-gray-500">Process asset returns from employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Return Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Process Asset Return</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Assignment *</label>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Choose an assignment...</option>
                {activeAssignments.map(assignment => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.asset} - {assignment.employee} ({assignment.department})
                  </option>
                ))}
              </select>
            </div>

            {selectedAssignmentData && (
              <div className="p-4 bg-gray-50 rounded border">
                <h3 className="font-medium text-gray-900 mb-2">Assignment Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Asset:</span>
                    <span className="ml-2 font-medium">{selectedAssignmentData.asset}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Employee:</span>
                    <span className="ml-2 font-medium">{selectedAssignmentData.employee}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Assigned Date:</span>
                    <span className="ml-2 font-medium">{selectedAssignmentData.assignedDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Expected Return:</span>
                    <span className="ml-2 font-medium">{selectedAssignmentData.expectedReturn}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Condition:</span>
                    <span className={`ml-2 font-medium ${getConditionColor(selectedAssignmentData.assetCondition)}`}>
                      {selectedAssignmentData.assetCondition}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Asset Value:</span>
                    <span className="ml-2 font-medium">{selectedAssignmentData.assetValue}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Date *</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Condition *</label>
                <select
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value)}
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select condition...</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Reason *</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select reason...</option>
                <option value="project_completed">Project Completed</option>
                <option value="position_change">Position Change</option>
                <option value="temporary_use_ended">Temporary Use Ended</option>
                <option value="replacement_received">Replacement Received</option>
                <option value="employee_termination">Employee Termination</option>
                <option value="asset_upgrade">Asset Upgrade</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Received By *</label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                required
                placeholder="Enter your name/position"
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Notes</label>
              <textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                rows={3}
                placeholder="Any additional information about the return..."
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedAssignment}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Process Return
            </button>
          </form>
        </div>

        {/* Active Assignments Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Active Assignments</h2>
            <div className="space-y-3">
              {activeAssignments.map(assignment => (
                <div key={assignment.id} className="p-3 border border-gray-200 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{assignment.asset}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {assignment.employee} • {assignment.department}
                  </div>
                  <div className="text-xs text-gray-400">
                    Assigned: {assignment.assignedDate} • Expected: {assignment.expectedReturn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Return Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-semibold text-blue-600">{activeAssignments.length}</div>
                <div className="text-sm text-blue-600">Active</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-semibold text-green-600">{recentReturns.length}</div>
                <div className="text-sm text-green-600">Recent Returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Returns */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Asset Returns</h3>
          <p className="text-sm text-gray-500">Track recently processed returns</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReturns.map((returnItem) => (
                <tr key={returnItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{returnItem.asset}</div>
                    <div className="text-sm text-gray-500">{returnItem.assetValue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{returnItem.employee}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{returnItem.returnDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(returnItem.returnCondition)}`}>
                      {returnItem.returnCondition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{returnItem.returnReason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{returnItem.receivedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Reassign</button>
                      <button className="text-orange-600 hover:text-orange-900">Maintenance</button>
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

export default AssetReturn
