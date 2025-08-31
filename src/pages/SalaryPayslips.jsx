import { useState, useMemo } from 'react'

// Sample employee data (in real app, this would come from Employee Dashboard)
const sampleEmployees = [
  {
    id: 'EMP001',
    name: 'Ahmed Khan',
    mobile: '+880 1712-345678',
    designation: 'Senior Tailor',
    department: 'Sewing',
    grossSalary: 25000,
    paidAmount: 20000,
    status: 'Not Paid'
  },
  {
    id: 'EMP002',
    name: 'Fatima Begum',
    mobile: '+880 1712-345679',
    designation: 'Quality Inspector',
    department: 'Quality Control',
    grossSalary: 30000,
    paidAmount: 30000,
    status: 'Full Paid'
  },
  {
    id: 'EMP003',
    name: 'Rahim Ali',
    mobile: '+880 1712-345680',
    designation: 'Cutting Master',
    department: 'Cutting',
    grossSalary: 35000,
    paidAmount: 28000,
    status: 'Custom Amount'
  },
  {
    id: 'EMP004',
    name: 'Ayesha Rahman',
    mobile: '+880 1712-345681',
    designation: 'Finishing Supervisor',
    department: 'Finishing',
    grossSalary: 32000,
    paidAmount: 0,
    status: 'Not Paid'
  },
  {
    id: 'EMP005',
    name: 'Mohammad Hassan',
    mobile: '+880 1712-345682',
    designation: 'Production Manager',
    department: 'Management',
    grossSalary: 45000,
    paidAmount: 45000,
    status: 'Full Paid'
  },
  {
    id: 'EMP006',
    name: 'Nusrat Jahan',
    mobile: '+880 1712-345683',
    designation: 'Junior Tailor',
    department: 'Sewing',
    grossSalary: 20000,
    paidAmount: 0,
    status: 'Not Paid'
  },
  {
    id: 'EMP007',
    name: 'Karim Uddin',
    mobile: '+880 1712-345684',
    designation: 'Machine Operator',
    department: 'Sewing',
    grossSalary: 22000,
    paidAmount: 18000,
    status: 'Custom Amount'
  },
  {
    id: 'EMP008',
    name: 'Salma Khatun',
    mobile: '+880 1712-345685',
    designation: 'Quality Assistant',
    department: 'Quality Control',
    grossSalary: 18000,
    paidAmount: 0,
    status: 'Not Paid'
  }
]

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const years = ['2024', '2023', '2022']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Cutting Master', 'Finishing Supervisor', 'Production Manager', 'Junior Tailor', 'Machine Operator', 'Quality Assistant']
const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Quality Control', 'Management']

export default function SalaryPayslips() {
  const [filters, setFilters] = useState({
    month: 'August',
    year: '2024',
    designation: 'All',
    department: 'All'
  })
  
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [bulkPaymentAmount, setBulkPaymentAmount] = useState('')
  const [showBulkPayment, setShowBulkPayment] = useState(false)
  const [showPayslip, setShowPayslip] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // Filter employees based on selected filters
  const filteredEmployees = useMemo(() => {
    return sampleEmployees.filter(employee => {
      const matchesDesignation = filters.designation === 'All' || employee.designation === filters.designation
      const matchesDepartment = filters.department === 'All' || employee.department === filters.department
      return matchesDesignation && matchesDepartment
    })
  }, [filters])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id))
    }
  }

  const handleBulkPayment = () => {
    if (selectedEmployees.length === 0) {
      alert('Please select employees for bulk payment')
      return
    }
    if (!bulkPaymentAmount || bulkPaymentAmount <= 0) {
      alert('Please enter a valid payment amount')
      return
    }
    
    console.log(`Bulk payment of ${bulkPaymentAmount} for employees:`, selectedEmployees)
    alert(`Bulk payment of ৳${bulkPaymentAmount} processed for ${selectedEmployees.length} employees`)
    setShowBulkPayment(false)
    setBulkPaymentAmount('')
    setSelectedEmployees([])
  }

  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format`)
    alert(`Data exported in ${format} format`)
  }

  const handlePaySlip = (employee) => {
    setSelectedEmployee(employee)
    setShowPayslip(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Full Paid': return 'bg-green-100 text-green-800'
      case 'Not Paid': return 'bg-red-100 text-red-800'
      case 'Custom Amount': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalSalary = filteredEmployees.reduce((sum, emp) => sum + emp.grossSalary, 0)
  const totalPaid = filteredEmployees.reduce((sum, emp) => sum + emp.paidAmount, 0)
  const paidEmployees = filteredEmployees.filter(emp => emp.status === 'Full Paid').length
  const unpaidEmployees = filteredEmployees.filter(emp => emp.status === 'Not Paid').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Salary & Payslips</h1>
        <p className="text-sm text-gray-500">Manage employee salaries and generate payslips</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Total Employees</div>
          <div className="mt-1 text-2xl font-semibold">{filteredEmployees.length}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Total Salary</div>
          <div className="mt-1 text-2xl font-semibold">৳{totalSalary.toLocaleString()}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Total Paid</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">৳{totalPaid.toLocaleString()}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Unpaid Employees</div>
          <div className="mt-1 text-2xl font-semibold text-red-600">{unpaidEmployees}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <select
              value={filters.designation}
              onChange={(e) => handleFilterChange('designation', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowBulkPayment(true)}
          disabled={selectedEmployees.length === 0}
          className={`px-4 py-2 rounded font-medium ${
            selectedEmployees.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Bulk Payment ({selectedEmployees.length})
        </button>
        <button
          onClick={() => handleExport('PDF')}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
        >
          Export PDF
        </button>
        <button
          onClick={() => handleExport('Excel')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
        >
          Export Excel
        </button>
      </div>

      {/* Bulk Payment Modal */}
      {showBulkPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Bulk Payment</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount (৳)</label>
              <input
                type="number"
                value={bulkPaymentAmount}
                onChange={(e) => setBulkPaymentAmount(e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter amount"
              />
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Selected employees: {selectedEmployees.length}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBulkPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Process Payment
              </button>
              <button
                onClick={() => setShowBulkPayment(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Table */}
      <div className="rounded border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Slip</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeSelect(employee.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{employee.grossSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{employee.paidAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handlePaySlip(employee)}
                      className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs"
                    >
                      Pay Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-medium mb-4">Summary for {filters.month} {filters.year}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">{paidEmployees}</div>
            <div className="text-sm text-gray-500">Paid Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-600">{unpaidEmployees}</div>
            <div className="text-sm text-gray-500">Unpaid Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold">৳{totalSalary.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Salary</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">৳{totalPaid.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Paid</div>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      {showPayslip && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RP Creations & Apparels Limited</h1>
                  <p className="text-gray-600 mt-2">Salary Payslip</p>
                  <p className="text-gray-600">For the month of {filters.month} {filters.year}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-orange-600">৳{selectedEmployee.grossSalary.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Gross Salary</div>
                </div>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                  <p className="font-semibold">{selectedEmployee.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="font-semibold">{selectedEmployee.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Designation</label>
                  <p className="font-semibold">{selectedEmployee.designation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Department</label>
                  <p className="font-semibold">{selectedEmployee.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Mobile</label>
                  <p className="font-semibold">{selectedEmployee.mobile}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Payment Date</label>
                  <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Salary Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-green-600 mb-3">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basic Salary</span>
                      <span className="font-semibold">৳{(selectedEmployee.grossSalary * 0.8).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">House Rent Allowance</span>
                      <span className="font-semibold">৳{(selectedEmployee.grossSalary * 0.12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medical Allowance</span>
                      <span className="font-semibold">৳{(selectedEmployee.grossSalary * 0.04).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transport Allowance</span>
                      <span className="font-semibold">৳{(selectedEmployee.grossSalary * 0.02).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Allowances</span>
                      <span className="font-semibold">৳{(selectedEmployee.grossSalary * 0.02).toLocaleString()}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Gross Salary</span>
                      <span>৳{selectedEmployee.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-red-600 mb-3">Deductions & Payments</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Absent Deduction</span>
                      <span className="font-semibold text-red-600">-৳{(selectedEmployee.grossSalary * 0.04).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Late Deduction</span>
                      <span className="font-semibold text-red-600">-৳{(selectedEmployee.grossSalary * 0.01).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Deductions</span>
                      <span className="font-semibold text-red-600">-৳{(selectedEmployee.grossSalary * 0.01).toLocaleString()}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-red-600">
                      <span>Total Deductions</span>
                      <span>-৳{(selectedEmployee.grossSalary * 0.06).toLocaleString()}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-green-600">
                      <span>Paid Amount</span>
                      <span>৳{selectedEmployee.paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-orange-600">
                      <span>Remaining Amount</span>
                      <span>৳{(selectedEmployee.grossSalary - selectedEmployee.paidAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance & Leave Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-blue-600 mb-3">Attendance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Working Days</span>
                      <span className="font-semibold">26</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Present Days</span>
                      <span className="font-semibold text-green-600">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Absent Days</span>
                      <span className="font-semibold text-red-600">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Late Days</span>
                      <span className="font-semibold text-yellow-600">1</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-purple-600 mb-3">Leave Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Casual Leave</span>
                      <span className="font-semibold">2 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sick Leave</span>
                      <span className="font-semibold">0 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Earned Leave</span>
                      <span className="font-semibold">0 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maternity Leave</span>
                      <span className="font-semibold">0 days</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total Leave Days</span>
                      <span>2 days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overtime Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Overtime Hours</label>
                  <p className="text-lg font-semibold">12 hours</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Rate per Hour</label>
                  <p className="text-lg font-semibold">৳200</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Total Overtime</label>
                  <p className="text-lg font-semibold text-green-600">৳2,400</p>
                </div>
              </div>

              {/* Bank Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Bank Name</label>
                  <p className="font-semibold">Sonali Bank</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Account Number</label>
                  <p className="font-semibold">1234567890</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Branch</label>
                  <p className="font-semibold">Dhaka Main Branch</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                >
                  Print Payslip
                </button>
                <button
                  onClick={() => setShowPayslip(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
