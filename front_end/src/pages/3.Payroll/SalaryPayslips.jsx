import { useState, useMemo } from 'react'

// Sample employee data with salary breakdown and attendance
const sampleEmployees = [
  {
    id: 'EMP001',
    name: 'Ahmed Khan',
    mobile: '+880 1712-345678',
    designation: 'Senior Tailor',
    department: 'Sewing',
    levelOfWork: 'Worker',
    basicSalary: 20000,
    houseRentAllowance: 2400,
    medicalAllowance: 800,
    transportAllowance: 400,
    otherAllowances: 400,
    attendanceBonus: 775,
    totalPenalties: 0,
    advance: 5000,
    overtime: 12,
    extraOvertime: 8,
    attendance: {
      totalDays: 26,
      presentDays: 26,
      absentDays: 0,
      leaveDays: 0,
      lateDays: 0
    }
  },
  {
    id: 'EMP002',
    name: 'Fatima Begum',
    mobile: '+880 1712-345679',
    designation: 'Quality Inspector',
    department: 'Quality Control',
    levelOfWork: 'Staff',
    basicSalary: 24000,
    houseRentAllowance: 2880,
    medicalAllowance: 960,
    transportAllowance: 480,
    otherAllowances: 480,
    attendanceBonus: 0,
    totalPenalties: 0,
    advance: 0,
    overtime: 0,
    extraOvertime: 0,
    attendance: {
      totalDays: 26,
      presentDays: 24,
      absentDays: 1,
      leaveDays: 1,
      lateDays: 0
    }
  },
  {
    id: 'EMP003',
    name: 'Rahim Ali',
    mobile: '+880 1712-345680',
    designation: 'Cutting Master',
    department: 'Cutting',
    levelOfWork: 'Worker',
    basicSalary: 28000,
    houseRentAllowance: 3360,
    medicalAllowance: 1120,
    transportAllowance: 560,
    otherAllowances: 560,
    attendanceBonus: 775,
    totalPenalties: 500,
    advance: 3000,
    overtime: 18,
    extraOvertime: 12,
    attendance: {
      totalDays: 26,
      presentDays: 25,
      absentDays: 0,
      leaveDays: 1,
      lateDays: 1
    }
  },
  {
    id: 'EMP004',
    name: 'Ayesha Rahman',
    mobile: '+880 1712-345681',
    designation: 'Finishing Supervisor',
    department: 'Finishing',
    levelOfWork: 'Staff',
    basicSalary: 25600,
    houseRentAllowance: 3072,
    medicalAllowance: 1024,
    transportAllowance: 512,
    otherAllowances: 512,
    attendanceBonus: 0,
    totalPenalties: 0,
    advance: 0,
    overtime: 0,
    extraOvertime: 0,
    attendance: {
      totalDays: 26,
      presentDays: 26,
      absentDays: 0,
      leaveDays: 0,
      lateDays: 0
    }
  },
  {
    id: 'EMP005',
    name: 'Mohammad Hassan',
    mobile: '+880 1712-345682',
    designation: 'Production Manager',
    department: 'Management',
    levelOfWork: 'Staff',
    basicSalary: 36000,
    houseRentAllowance: 4320,
    medicalAllowance: 1440,
    transportAllowance: 720,
    otherAllowances: 720,
    attendanceBonus: 0,
    totalPenalties: 0,
    advance: 0,
    overtime: 0,
    extraOvertime: 0,
    attendance: {
      totalDays: 26,
      presentDays: 25,
      absentDays: 0,
      leaveDays: 1,
      lateDays: 0
    }
  },
  {
    id: 'EMP006',
    name: 'Nusrat Jahan',
    mobile: '+880 1712-345683',
    designation: 'Junior Tailor',
    department: 'Sewing',
    levelOfWork: 'Worker',
    basicSalary: 16000,
    houseRentAllowance: 1920,
    medicalAllowance: 640,
    transportAllowance: 320,
    otherAllowances: 320,
    attendanceBonus: 775,
    totalPenalties: 300,
    advance: 2000,
    overtime: 15,
    extraOvertime: 6,
    attendance: {
      totalDays: 26,
      presentDays: 24,
      absentDays: 1,
      leaveDays: 1,
      lateDays: 2
    }
  },
  {
    id: 'EMP007',
    name: 'Karim Uddin',
    mobile: '+880 1712-345684',
    designation: 'Machine Operator',
    department: 'Sewing',
    levelOfWork: 'Worker',
    basicSalary: 17600,
    houseRentAllowance: 2112,
    medicalAllowance: 704,
    transportAllowance: 352,
    otherAllowances: 352,
    attendanceBonus: 775,
    totalPenalties: 0,
    advance: 0,
    overtime: 20,
    extraOvertime: 10,
    attendance: {
      totalDays: 26,
      presentDays: 26,
      absentDays: 0,
      leaveDays: 0,
      lateDays: 0
    }
  },
  {
    id: 'EMP008',
    name: 'Salma Khatun',
    mobile: '+880 1712-345685',
    designation: 'Quality Assistant',
    department: 'Quality Control',
    levelOfWork: 'Worker',
    basicSalary: 14400,
    houseRentAllowance: 1728,
    medicalAllowance: 576,
    transportAllowance: 288,
    otherAllowances: 288,
    attendanceBonus: 775,
    totalPenalties: 0,
    advance: 1500,
    overtime: 10,
    extraOvertime: 5,
    attendance: {
      totalDays: 26,
      presentDays: 25,
      absentDays: 0,
      leaveDays: 1,
      lateDays: 0
    }
  }
]

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const years = ['2024', '2023', '2022']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Cutting Master', 'Finishing Supervisor', 'Production Manager', 'Junior Tailor', 'Machine Operator', 'Quality Assistant']
const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Quality Control', 'Management']
const levelsOfWork = ['All', 'Worker', 'Staff']

export default function SalaryPayslips() {
  const [filters, setFilters] = useState({
    month: 'August',
    year: '2024',
    designation: 'All',
    department: 'All',
    levelOfWork: 'All'
  })
  
  const [showPayslip, setShowPayslip] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // Filter employees based on selected filters
  const filteredEmployees = useMemo(() => {
    return sampleEmployees.filter(employee => {
      const matchesDesignation = filters.designation === 'All' || employee.designation === filters.designation
      const matchesDepartment = filters.department === 'All' || employee.department === filters.department
      const matchesLevelOfWork = filters.levelOfWork === 'All' || employee.levelOfWork === filters.levelOfWork
      return matchesDesignation && matchesDepartment && matchesLevelOfWork
    })
  }, [filters])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format`)
    alert(`Data exported in ${format} format`)
  }

  const handlePaySlip = (employee) => {
    setSelectedEmployee(employee)
    setShowPayslip(true)
  }

  // Calculate salary components
  const calculateSalary = (employee) => {
    const grossSalary = employee.basicSalary + employee.houseRentAllowance + employee.medicalAllowance + 
                       employee.transportAllowance + employee.otherAllowances
    
    // Calculate overtime payments (only for Workers)
    const overtimeRate = 200 // ৳200 per hour
    const extraOvertimeRate = 300 // ৳300 per hour
    const overtimePayment = employee.levelOfWork === 'Worker' ? employee.overtime * overtimeRate : 0
    const extraOvertimePayment = employee.levelOfWork === 'Worker' ? employee.extraOvertime * extraOvertimeRate : 0
    
    // Calculate deductions based on attendance
    const absentDeduction = (employee.attendance.absentDays / employee.attendance.totalDays) * employee.basicSalary
    const lateDeduction = (employee.attendance.lateDays / employee.attendance.totalDays) * (employee.basicSalary * 0.5)
    
    const totalDeductions = absentDeduction + lateDeduction + employee.totalPenalties + employee.advance
    const payableSalary = grossSalary + employee.attendanceBonus + overtimePayment + extraOvertimePayment - employee.totalPenalties - employee.advance - absentDeduction
    
    return {
      grossSalary,
      overtimePayment,
      extraOvertimePayment,
      absentDeduction,
      lateDeduction,
      totalDeductions,
      advance: employee.advance,
      payableSalary
    }
  }

  const totalGrossSalary = filteredEmployees.reduce((sum, emp) => sum + calculateSalary(emp).grossSalary, 0)
  const totalPayableSalary = filteredEmployees.reduce((sum, emp) => sum + calculateSalary(emp).payableSalary, 0)
  const totalAttendanceBonuses = filteredEmployees.reduce((sum, emp) => sum + emp.attendanceBonus, 0)
  const totalOvertime = filteredEmployees.reduce((sum, emp) => sum + calculateSalary(emp).overtimePayment, 0)
  const totalExtraOvertime = filteredEmployees.reduce((sum, emp) => sum + calculateSalary(emp).extraOvertimePayment, 0)
  const totalPenalties = filteredEmployees.reduce((sum, emp) => sum + emp.totalPenalties, 0)
  const totalAdvance = filteredEmployees.reduce((sum, emp) => sum + emp.advance, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Salary & Payslips</h1>
        <p className="text-sm text-gray-500">Generate employee payslips with salary breakdown and attendance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Total Employees</div>
          <div className="mt-1 text-xl font-semibold">{filteredEmployees.length}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Gross Salary</div>
          <div className="mt-1 text-xl font-semibold">৳{totalGrossSalary.toLocaleString()}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Overtime</div>
          <div className="mt-1 text-xl font-semibold text-blue-600">৳{totalOvertime.toLocaleString()}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Extra Overtime</div>
          <div className="mt-1 text-xl font-semibold text-purple-600">৳{totalExtraOvertime.toLocaleString()}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Bonuses</div>
          <div className="mt-1 text-xl font-semibold text-green-600">৳{totalAttendanceBonuses.toLocaleString()}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Advance</div>
          <div className="mt-1 text-xl font-semibold text-orange-600">৳{totalAdvance.toLocaleString()}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Payable Salary</div>
          <div className="mt-1 text-xl font-semibold text-green-600">৳{totalPayableSalary.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level of Work</label>
            <select
              value={filters.levelOfWork}
              onChange={(e) => handleFilterChange('levelOfWork', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {levelsOfWork.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
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

      {/* Employee Table */}
      <div className="rounded border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Overtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Bonus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalties</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payable Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Slip</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => {
                const salary = calculateSalary(employee)
                return (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.levelOfWork === 'Worker' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {employee.levelOfWork}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{salary.grossSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {salary.absentDeduction > 0 ? `-৳${salary.absentDeduction.toFixed(0)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {salary.overtimePayment > 0 ? `৳${salary.overtimePayment.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                      {salary.extraOvertimePayment > 0 ? `৳${salary.extraOvertimePayment.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {employee.attendanceBonus > 0 ? `৳${employee.attendanceBonus.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {employee.totalPenalties > 0 ? `৳${employee.totalPenalties.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                      {employee.advance > 0 ? `৳${employee.advance.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">৳{salary.payableSalary.toFixed(0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handlePaySlip(employee)}
                        className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs"
                      >
                        Pay Slip
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-medium mb-4">Summary for {filters.month} {filters.year}</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-xl font-semibold">{filteredEmployees.length}</div>
            <div className="text-sm text-gray-500">Total Employees</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">৳{totalGrossSalary.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Gross Salary</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-blue-600">৳{totalOvertime.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Overtime</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-purple-600">৳{totalExtraOvertime.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Extra Overtime</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-green-600">৳{totalAttendanceBonuses.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Bonuses</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-green-600">৳{totalPayableSalary.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Payable Salary</div>
          </div>
        </div>
      </div>

      {/* Payslip Modal - A4 Format */}
      {showPayslip && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* A4 Page Header */}
              <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
                <h1 className="text-3xl font-bold text-gray-900">RP Creations & Apparels Limited</h1>
                <p className="text-lg text-gray-600 mt-2">Salary Payslip</p>
                <p className="text-gray-600">For the month of {filters.month} {filters.year}</p>
                <p className="text-sm text-gray-500 mt-1">Generated on: {(() => {
                  const date = new Date()
                  const day = String(date.getDate()).padStart(2, '0')
                  const month = String(date.getMonth() + 1).padStart(2, '0')
                  const year = date.getFullYear()
                  return `${day}/${month}/${year}`
                })()}</p>
              </div>

              {/* Employee Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b border-blue-200 pb-2">Personal Information</h3>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Employee ID:</span>
                    <span className="font-semibold">{selectedEmployee.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Full Name:</span>
                    <span className="font-semibold">{selectedEmployee.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Mobile Number:</span>
                    <span className="font-semibold">{selectedEmployee.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Designation:</span>
                    <span className="font-semibold">{selectedEmployee.designation}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-green-600 mb-3 border-b border-green-200 pb-2">Work Information</h3>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Department:</span>
                    <span className="font-semibold">{selectedEmployee.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Level of Work:</span>
                    <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                      selectedEmployee.levelOfWork === 'Worker' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedEmployee.levelOfWork}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Pay Period:</span>
                    <span className="font-semibold">{filters.month} {filters.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Payslip Date:</span>
                    <span className="font-semibold">{(() => {
                      const date = new Date()
                      const day = String(date.getDate()).padStart(2, '0')
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const year = date.getFullYear()
                      return `${day}/${month}/${year}`
                    })()}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-600 mb-3 border-b border-purple-200 pb-2">Attendance Summary</h3>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Total Working Days:</span>
                    <span className="font-semibold">{selectedEmployee.attendance.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Present Days:</span>
                    <span className="font-semibold text-green-600">{selectedEmployee.attendance.presentDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Absent Days:</span>
                    <span className="font-semibold text-red-600">{selectedEmployee.attendance.absentDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Leave Days:</span>
                    <span className="font-semibold text-yellow-600">{selectedEmployee.attendance.leaveDays}</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Salary Breakdown Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Basic Earnings */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-600 mb-3 border-b border-green-200 pb-2">Basic Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basic Salary</span>
                      <span className="font-semibold">৳{selectedEmployee.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">House Rent Allowance</span>
                      <span className="font-semibold">৳{selectedEmployee.houseRentAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medical Allowance</span>
                      <span className="font-semibold">৳{selectedEmployee.medicalAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transport Allowance</span>
                      <span className="font-semibold">৳{selectedEmployee.transportAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Allowances</span>
                      <span className="font-semibold">৳{selectedEmployee.otherAllowances.toLocaleString()}</span>
                    </div>
                    <hr className="my-2 border-gray-300" />
                    <div className="flex justify-between text-lg font-bold text-green-600">
                      <span>Basic Gross</span>
                      <span>৳{(selectedEmployee.basicSalary + selectedEmployee.houseRentAllowance + selectedEmployee.medicalAllowance + selectedEmployee.transportAllowance + selectedEmployee.otherAllowances).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Earnings */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b border-blue-200 pb-2">Additional Earnings</h3>
                  <div className="space-y-2">
                    {selectedEmployee.attendanceBonus > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-medium">Attendance Bonus</span>
                        <span className="font-semibold">+৳{selectedEmployee.attendanceBonus.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedEmployee.levelOfWork === 'Worker' && selectedEmployee.overtime > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span className="font-medium">Overtime Payment</span>
                        <span className="font-semibold">+৳{calculateSalary(selectedEmployee).overtimePayment.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedEmployee.levelOfWork === 'Worker' && selectedEmployee.extraOvertime > 0 && (
                      <div className="flex justify-between text-purple-600">
                        <span className="font-medium">Extra Overtime</span>
                        <span className="font-semibold">+৳{calculateSalary(selectedEmployee).extraOvertimePayment.toLocaleString()}</span>
                      </div>
                    )}
                    <hr className="my-2 border-gray-300" />
                    <div className="flex justify-between text-lg font-bold text-blue-600">
                      <span>Total Additional</span>
                      <span>+৳{(selectedEmployee.attendanceBonus + calculateSalary(selectedEmployee).overtimePayment + calculateSalary(selectedEmployee).extraOvertimePayment).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-600 mb-3 border-b border-red-200 pb-2">Deductions</h3>
                  <div className="space-y-2">
                    {selectedEmployee.attendance.absentDays > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Absent Days ({selectedEmployee.attendance.absentDays})</span>
                        <span className="font-semibold text-red-600">-৳{calculateSalary(selectedEmployee).absentDeduction.toFixed(0)}</span>
                      </div>
                    )}
                    {selectedEmployee.attendance.lateDays > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Late Days ({selectedEmployee.attendance.lateDays})</span>
                        <span className="font-semibold text-red-600">-৳{calculateSalary(selectedEmployee).lateDeduction.toFixed(0)}</span>
                      </div>
                    )}
                    {selectedEmployee.totalPenalties > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Penalties</span>
                        <span className="font-semibold text-red-600">-৳{selectedEmployee.totalPenalties.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedEmployee.advance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance</span>
                        <span className="font-semibold text-orange-600">-৳{selectedEmployee.advance.toLocaleString()}</span>
                      </div>
                    )}
                    <hr className="my-2 border-gray-300" />
                    <div className="flex justify-between text-lg font-bold text-red-600">
                      <span>Total Deductions</span>
                      <span>-৳{calculateSalary(selectedEmployee).totalDeductions.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Footer */}
              <div className="mt-8 border-t-2 border-gray-300 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-700 mb-2">Employee Signature</h4>
                    <div className="border-b border-gray-400 h-12"></div>
                    <p className="text-sm text-gray-500 mt-1">Date: _______________</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-700 mb-2">Authorized Signature</h4>
                    <div className="border-b border-gray-400 h-12"></div>
                    <p className="text-sm text-gray-500 mt-1">Date: _______________</p>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>This is a computer generated payslip and does not require signature.</p>
                  <p className="mt-1">For any queries, please contact HR Department.</p>
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
