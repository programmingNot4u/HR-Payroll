import { useState, useMemo } from 'react'

// Sample employee data for bonuses and penalties
const sampleEmployees = [
  {
    id: 'EMP001',
    name: 'Ahmed Khan',
    department: 'Sewing',
    designation: 'Senior Tailor',
    levelOfWork: 'Worker',
    monthlySalary: 25000,
    attendanceBonus: 775,
    totalPenalties: 0
  },
  {
    id: 'EMP002',
    name: 'Fatima Begum',
    department: 'Quality Control',
    designation: 'Quality Inspector',
    levelOfWork: 'Staff',
    monthlySalary: 35000,
    attendanceBonus: 0,
    totalPenalties: 0
  },
  {
    id: 'EMP003',
    name: 'Mohammad Hassan',
    department: 'Production',
    designation: 'Production Manager',
    levelOfWork: 'Staff',
    monthlySalary: 45000,
    attendanceBonus: 0,
    totalPenalties: 0
  },
  {
    id: 'EMP004',
    name: 'Salma Khatun',
    department: 'Cutting',
    designation: 'Cutting Master',
    levelOfWork: 'Worker',
    monthlySalary: 28000,
    attendanceBonus: 775,
    totalPenalties: 500
  },
  {
    id: 'EMP005',
    name: 'Karim Uddin',
    department: 'Maintenance',
    designation: 'Maintenance Engineer',
    levelOfWork: 'Staff',
    monthlySalary: 40000,
    attendanceBonus: 0,
    totalPenalties: 0
  }
]

// Sample penalties data
const samplePenalties = [
  {
    id: 'PEN001',
    employeeId: 'EMP004',
    employeeName: 'Salma Khatun',
    department: 'Cutting',
    levelOfWork: 'Worker',
    penaltyAmount: 500,
    reason: 'Damaged cutting machine blade due to improper usage',
    date: '2024-01-15',
    status: 'Active',
    deductedFromSalary: true
  },
  {
    id: 'PEN002',
    employeeId: 'EMP001',
    employeeName: 'Ahmed Khan',
    department: 'Sewing',
    levelOfWork: 'Worker',
    penaltyAmount: 300,
    reason: 'Damaged sewing machine needle',
    date: '2024-01-20',
    status: 'Active',
    deductedFromSalary: true
  }
]

const departments = ['All', 'Sewing', 'Quality Control', 'Production', 'Cutting', 'Maintenance']
const levelsOfWork = ['All', 'Worker', 'Staff']

export default function BonusesPenalties() {
  const [activeTab, setActiveTab] = useState('bonuses')
  const [filters, setFilters] = useState({
    department: 'All',
    levelOfWork: 'All',
    status: 'All'
  })
  
  const [showPenaltyModal, setShowPenaltyModal] = useState(false)
  const [editingPenalty, setEditingPenalty] = useState(null)
  const [penaltyFormData, setPenaltyFormData] = useState({
    employeeId: '',
    penaltyAmount: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    deductedFromSalary: true
  })

  // Filter employees based on selected filters
  const filteredEmployees = useMemo(() => {
    return sampleEmployees.filter(employee => {
      const matchesDepartment = filters.department === 'All' || employee.department === filters.department
      const matchesLevelOfWork = filters.levelOfWork === 'All' || employee.levelOfWork === filters.levelOfWork
      return matchesDepartment && matchesLevelOfWork
    })
  }, [filters])

  // Filter penalties based on selected filters
  const filteredPenalties = useMemo(() => {
    return samplePenalties.filter(penalty => {
      const employee = sampleEmployees.find(emp => emp.id === penalty.employeeId)
      const matchesDepartment = filters.department === 'All' || employee?.department === filters.department
      const matchesLevelOfWork = filters.levelOfWork === 'All' || employee?.levelOfWork === filters.levelOfWork
      const matchesStatus = filters.status === 'All' || penalty.status === filters.status
      return matchesDepartment && matchesLevelOfWork && matchesStatus
    })
  }, [filters])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleAddPenalty = () => {
    setEditingPenalty(null)
    setPenaltyFormData({
      employeeId: '',
      penaltyAmount: '',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      deductedFromSalary: true
    })
    setShowPenaltyModal(true)
  }

  const handleEditPenalty = (penalty) => {
    setEditingPenalty(penalty)
    setPenaltyFormData({
      employeeId: penalty.employeeId,
      penaltyAmount: penalty.penaltyAmount,
      reason: penalty.reason,
      date: penalty.date,
      deductedFromSalary: penalty.deductedFromSalary
    })
    setShowPenaltyModal(true)
  }

  const handlePenaltySubmit = () => {
    if (!penaltyFormData.employeeId || !penaltyFormData.penaltyAmount || !penaltyFormData.reason) {
      alert('Please fill in all required fields')
      return
    }

    if (editingPenalty) {
      console.log('Updating penalty:', editingPenalty.id, penaltyFormData)
      alert('Penalty updated successfully')
    } else {
      console.log('Adding new penalty:', penaltyFormData)
      alert('Penalty added successfully')
    }

    setShowPenaltyModal(false)
    setPenaltyFormData({
      employeeId: '',
      penaltyAmount: '',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      deductedFromSalary: true
    })
  }

  const handleTogglePenaltyStatus = (penaltyId, currentStatus) => {
    console.log('Toggling penalty status for:', penaltyId, 'from', currentStatus, 'to', currentStatus === 'Active' ? 'Inactive' : 'Active')
    alert(`Penalty status ${currentStatus === 'Active' ? 'deactivated' : 'activated'} successfully`)
  }

  const handleDeletePenalty = (penaltyId) => {
    if (confirm('Are you sure you want to delete this penalty?')) {
      console.log('Deleting penalty:', penaltyId)
      alert('Penalty deleted successfully')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Worker': return 'bg-blue-100 text-blue-800'
      case 'Staff': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate totals
  const totalAttendanceBonuses = filteredEmployees.reduce((sum, emp) => sum + emp.attendanceBonus, 0)
  const totalPenalties = filteredPenalties.reduce((sum, penalty) => sum + penalty.penaltyAmount, 0)
  const eligibleWorkers = filteredEmployees.filter(emp => emp.levelOfWork === 'Worker').length
  const activePenalties = filteredPenalties.filter(penalty => penalty.status === 'Active').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bonuses & Penalties</h1>
        <p className="text-sm text-gray-500">Manage employee attendance bonuses and penalties</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Total Attendance Bonuses</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">৳{totalAttendanceBonuses.toLocaleString()}</div>
          <div className="text-xs text-gray-500">{eligibleWorkers} eligible workers</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Total Penalties</div>
          <div className="mt-1 text-2xl font-semibold text-red-600">৳{totalPenalties.toLocaleString()}</div>
          <div className="text-xs text-gray-500">{activePenalties} active penalties</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Eligible Workers</div>
          <div className="mt-1 text-2xl font-semibold text-blue-600">{eligibleWorkers}</div>
          <div className="text-xs text-gray-500">For attendance bonus</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Net Impact</div>
          <div className={`mt-1 text-2xl font-semibold ${totalAttendanceBonuses - totalPenalties >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ৳{(totalAttendanceBonuses - totalPenalties).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Bonuses - Penalties</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('bonuses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bonuses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bonuses ({filteredEmployees.filter(emp => emp.levelOfWork === 'Worker').length})
          </button>
          <button
            onClick={() => setActiveTab('penalties')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'penalties'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Penalties ({filteredPenalties.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level of Work</label>
            <select
              value={filters.levelOfWork}
              onChange={(e) => handleFilterChange('levelOfWork', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {levelsOfWork.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          {activeTab === 'penalties' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          {activeTab === 'penalties' && (
            <button
              onClick={handleAddPenalty}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Add New Penalty
            </button>
          )}
        </div>
        <div className="flex space-x-3">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Export
          </button>
        </div>
      </div>

      {/* Bonuses Tab Content */}
      {activeTab === 'bonuses' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Attendance Bonuses</h2>
            <p className="text-sm text-gray-500">
              Workers who attend every day of a month on time receive ৳775 attendance bonus
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Bonus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Penalties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {employee.id.replace('EMP', '')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(employee.levelOfWork)}`}>
                        {employee.levelOfWork}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ৳{employee.monthlySalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.levelOfWork === 'Worker' ? (
                        <span className="text-sm font-medium text-green-600">
                          ৳{employee.attendanceBonus.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Not Eligible</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ৳{employee.totalPenalties.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ৳{(employee.monthlySalary + employee.attendanceBonus - employee.totalPenalties).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Penalties Tab Content */}
      {activeTab === 'penalties' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Employee Penalties</h2>
            <p className="text-sm text-gray-500">
              Penalties for damage to company property or products, deducted from monthly salary
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penalty Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPenalties.map((penalty) => {
                  const employee = sampleEmployees.find(emp => emp.id === penalty.employeeId)
                  return (
                    <tr key={penalty.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {penalty.employeeId.replace('EMP', '')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{penalty.employeeName}</div>
                            <div className="text-sm text-gray-500">{penalty.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee?.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(employee?.levelOfWork)}`}>
                          {employee?.levelOfWork}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        ৳{penalty.penaltyAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs">
                        {penalty.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(penalty.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(penalty.status)}`}>
                          {penalty.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPenalty(penalty)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleTogglePenaltyStatus(penalty.id, penalty.status)}
                            className={penalty.status === 'Active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                          >
                            {penalty.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeletePenalty(penalty.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Penalty Modal */}
      {showPenaltyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPenalty ? 'Edit' : 'Add New'} Penalty
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                  <select
                    value={penaltyFormData.employeeId}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Employee</option>
                    {filteredEmployees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.id}) - {employee.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Amount *</label>
                  <input
                    type="number"
                    value={penaltyFormData.penaltyAmount}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, penaltyAmount: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter penalty amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <textarea
                    value={penaltyFormData.reason}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe the reason for penalty..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={penaltyFormData.date}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="deductedFromSalary"
                    checked={penaltyFormData.deductedFromSalary}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, deductedFromSalary: e.target.checked }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="deductedFromSalary" className="ml-2 block text-sm text-gray-900">
                    Deduct from monthly salary
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPenaltyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePenaltySubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {editingPenalty ? 'Update' : 'Add'} Penalty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
