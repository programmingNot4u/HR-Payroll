import { useState, useMemo } from 'react'

const reportTypes = [
  {
    id: 'attendance-leave',
    title: 'Employee Attendance & Leave',
    description: 'Comprehensive report on employee attendance patterns and leave statistics',
    icon: '📊',
    color: 'blue'
  },
  {
    id: 'monthly-payroll',
    title: 'Monthly Payroll',
    description: 'Detailed monthly payroll report with salary breakdowns and totals',
    icon: '💰',
    color: 'green'
  },
  {
    id: 'monthly-penalty',
    title: 'Monthly Penalty',
    description: 'Report on penalties issued to employees for policy violations',
    icon: '⚠️',
    color: 'red'
  },
  {
    id: 'monthly-bonus',
    title: 'Monthly Attendance Bonus',
    description: 'Report on attendance bonuses awarded to workers with perfect attendance',
    icon: '🎯',
    color: 'purple'
  },
  {
    id: 'monthly-recruitment',
    title: 'Monthly Recruitment',
    description: 'Report on new hires, interviews, and recruitment activities',
    icon: '👥',
    color: 'orange'
  }
]

// Sample data for reports
const sampleAttendanceData = [
  { id: 'EMP001', name: 'Ahmed Khan', department: 'Sewing', present: 26, absent: 0, late: 0, leave: 0, totalDays: 26, attendanceRate: '100%' },
  { id: 'EMP002', name: 'Fatima Begum', department: 'Cutting', present: 24, absent: 1, late: 1, leave: 1, totalDays: 26, attendanceRate: '92.3%' },
  { id: 'EMP003', name: 'Rahim Ali', department: 'Cutting', present: 25, absent: 0, late: 1, leave: 1, totalDays: 26, attendanceRate: '96.2%' },
  { id: 'EMP004', name: 'Ayesha Rahman', department: 'Finishing', present: 26, absent: 0, late: 0, leave: 0, totalDays: 26, attendanceRate: '100%' },
  { id: 'EMP005', name: 'Mohammad Hassan', department: 'Management', present: 25, absent: 0, late: 0, leave: 1, totalDays: 26, attendanceRate: '96.2%' }
]

const samplePayrollData = [
  { id: 'EMP001', name: 'Ahmed Khan', basic: 20000, allowances: 4000, overtime: 2400, extraOvertime: 2400, bonus: 775, penalties: 0, netSalary: 29575 },
  { id: 'EMP002', name: 'Fatima Begum', basic: 24000, allowances: 4800, overtime: 0, extraOvertime: 0, bonus: 0, penalties: 0, netSalary: 28800 },
  { id: 'EMP003', name: 'Rahim Ali', basic: 28000, allowances: 5600, overtime: 3600, extraOvertime: 2400, bonus: 775, penalties: 500, netSalary: 39875 },
  { id: 'EMP004', name: 'Ayesha Rahman', basic: 25600, allowances: 5120, overtime: 0, extraOvertime: 0, bonus: 0, penalties: 0, netSalary: 30720 },
  { id: 'EMP005', name: 'Mohammad Hassan', basic: 36000, allowances: 7200, overtime: 0, extraOvertime: 0, bonus: 0, penalties: 0, netSalary: 43200 }
]

const samplePenaltyData = [
  { id: 'EMP003', name: 'Rahim Ali', department: 'Cutting', penaltyAmount: 500, reason: 'Product damage', date: '2024-08-15', status: 'Active' },
  { id: 'EMP006', name: 'Nusrat Jahan', department: 'Sewing', penaltyAmount: 300, reason: 'Late arrival', date: '2024-08-10', status: 'Active' },
  { id: 'EMP008', name: 'Salma Khatun', department: 'Quality Control', penaltyAmount: 200, reason: 'Safety violation', date: '2024-08-05', status: 'Resolved' }
]

const sampleBonusData = [
  { id: 'EMP001', name: 'Ahmed Khan', department: 'Sewing', level: 'Worker', attendanceRate: '100%', bonusAmount: 775, status: 'Eligible' },
  { id: 'EMP003', name: 'Rahim Ali', department: 'Cutting', level: 'Worker', attendanceRate: '96.2%', bonusAmount: 775, status: 'Eligible' },
  { id: 'EMP006', name: 'Nusrat Jahan', department: 'Sewing', level: 'Worker', attendanceRate: '92.3%', bonusAmount: 0, status: 'Not Eligible' },
  { id: 'EMP007', name: 'Karim Uddin', department: 'Sewing', level: 'Worker', attendanceRate: '100%', bonusAmount: 775, status: 'Eligible' },
  { id: 'EMP008', name: 'Salma Khatun', department: 'Quality Control', level: 'Worker', attendanceRate: '96.2%', bonusAmount: 775, status: 'Eligible' }
]

const sampleRecruitmentData = [
  { id: 'INT001', position: 'Junior Tailor', department: 'Sewing', candidates: 8, interviews: 5, hired: 1, status: 'Completed', month: 'August 2024' },
  { id: 'INT002', position: 'Quality Inspector', department: 'Quality Control', candidates: 12, interviews: 8, hired: 1, status: 'In Progress', month: 'August 2024' },
  { id: 'INT003', position: 'Machine Operator', department: 'Sewing', candidates: 6, interviews: 4, hired: 0, status: 'Pending', month: 'August 2024' },
  { id: 'INT004', position: 'Production Assistant', department: 'Management', candidates: 15, interviews: 10, hired: 1, status: 'Completed', month: 'July 2024' }
]

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [filters, setFilters] = useState({
    month: 'August',
    year: '2024',
    department: '',
    levelOfWork: ''
  })
  const [generatedReport, setGeneratedReport] = useState(null)

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const years = ['2024', '2023', '2022']
  const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Quality Control', 'Management']
  const workLevels = ['All', 'Worker', 'Staff']

  const handleGenerateReport = () => {
    setGeneratedReport({
      type: selectedReport,
      filters,
      generatedAt: new Date().toLocaleString()
    })
  }

  const resetReport = () => {
    setSelectedReport(null)
    setFilters({
      month: 'August',
      year: '2024',
      department: '',
      levelOfWork: ''
    })
    setGeneratedReport(null)
  }

  const getFilteredData = (data, filters) => {
    return data.filter(item => {
      if (filters.department && filters.department !== 'All' && item.department !== filters.department) return false
      if (filters.levelOfWork && filters.levelOfWork !== 'All' && item.level !== filters.levelOfWork) return false
      return true
    })
  }

  const renderAttendanceLeaveReport = () => {
    const filteredData = getFilteredData(sampleAttendanceData, filters)
    const totalEmployees = filteredData.length
    const totalPresent = filteredData.reduce((sum, emp) => sum + emp.present, 0)
    const totalAbsent = filteredData.reduce((sum, emp) => sum + emp.absent, 0)
    const totalLate = filteredData.reduce((sum, emp) => sum + emp.late, 0)
    const totalLeave = filteredData.reduce((sum, emp) => sum + emp.leave, 0)
    const avgAttendanceRate = totalEmployees > 0 ? (totalPresent / (totalPresent + totalAbsent) * 100).toFixed(1) : 0

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{totalEmployees}</div>
            <div className="text-sm text-blue-700">Total Employees</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{totalPresent}</div>
            <div className="text-sm text-green-700">Present Days</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{totalAbsent}</div>
            <div className="text-sm text-red-700">Absent Days</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{totalLate}</div>
            <div className="text-sm text-yellow-700">Late Days</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{avgAttendanceRate}%</div>
            <div className="text-sm text-purple-700">Avg Attendance</div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Employee Attendance Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{employee.present}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{employee.absent}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">{employee.late}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{employee.leave}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.attendanceRate === '100%' ? 'bg-green-100 text-green-800' :
                        employee.attendanceRate >= '90%' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {employee.attendanceRate}
                      </span>
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

  const renderPayrollReport = () => {
    const filteredData = getFilteredData(samplePayrollData, filters)
    const totalBasic = filteredData.reduce((sum, emp) => sum + emp.basic, 0)
    const totalAllowances = filteredData.reduce((sum, emp) => sum + emp.allowances, 0)
    const totalOvertime = filteredData.reduce((sum, emp) => sum + emp.overtime, 0)
    const totalExtraOvertime = filteredData.reduce((sum, emp) => sum + emp.extraOvertime, 0)
    const totalBonus = filteredData.reduce((sum, emp) => sum + emp.bonus, 0)
    const totalPenalties = filteredData.reduce((sum, emp) => sum + emp.penalties, 0)
    const totalNetSalary = filteredData.reduce((sum, emp) => sum + emp.netSalary, 0)

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">৳{totalBasic.toLocaleString()}</div>
            <div className="text-sm text-green-700">Total Basic Salary</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">৳{totalAllowances.toLocaleString()}</div>
            <div className="text-sm text-blue-700">Total Allowances</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">৳{totalOvertime.toLocaleString()}</div>
            <div className="text-sm text-purple-700">Total Overtime</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">৳{totalNetSalary.toLocaleString()}</div>
            <div className="text-sm text-orange-700">Total Net Salary</div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Payroll Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overtime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Extra OT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penalties</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{employee.basic.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{employee.allowances.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">৳{employee.overtime.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">৳{employee.extraOvertime.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">৳{employee.bonus.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">৳{employee.penalties.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">৳{employee.netSalary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderPenaltyReport = () => {
    const filteredData = getFilteredData(samplePenaltyData, filters)
    const totalPenalties = filteredData.reduce((sum, emp) => sum + emp.penaltyAmount, 0)
    const activePenalties = filteredData.filter(emp => emp.status === 'Active').length
    const resolvedPenalties = filteredData.filter(emp => emp.status === 'Resolved').length

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">৳{totalPenalties.toLocaleString()}</div>
            <div className="text-sm text-red-700">Total Penalties</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{activePenalties}</div>
            <div className="text-sm text-orange-700">Active Penalties</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{resolvedPenalties}</div>
            <div className="text-sm text-green-700">Resolved Penalties</div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Penalty Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penalty Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">৳{employee.penaltyAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {employee.status}
                      </span>
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

  const renderBonusReport = () => {
    const filteredData = getFilteredData(sampleBonusData, filters)
    const totalBonus = filteredData.reduce((sum, emp) => sum + emp.bonusAmount, 0)
    const eligibleEmployees = filteredData.filter(emp => emp.status === 'Eligible').length
    const totalWorkers = filteredData.filter(emp => emp.level === 'Worker').length

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">৳{totalBonus.toLocaleString()}</div>
            <div className="text-sm text-purple-700">Total Bonuses</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{eligibleEmployees}</div>
            <div className="text-sm text-green-700">Eligible Workers</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{totalWorkers}</div>
            <div className="text-sm text-blue-700">Total Workers</div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Attendance Bonus Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.attendanceRate === '100%' ? 'bg-green-100 text-green-800' :
                        employee.attendanceRate >= '90%' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {employee.attendanceRate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">৳{employee.bonusAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.status === 'Eligible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
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

  const renderRecruitmentReport = () => {
    const filteredData = getFilteredData(sampleRecruitmentData, filters)
    const totalCandidates = filteredData.reduce((sum, item) => sum + item.candidates, 0)
    const totalInterviews = filteredData.reduce((sum, item) => sum + item.interviews, 0)
    const totalHired = filteredData.reduce((sum, item) => sum + item.hired, 0)
    const completedPositions = filteredData.filter(item => item.status === 'Completed').length

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{totalCandidates}</div>
            <div className="text-sm text-blue-700">Total Candidates</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{totalInterviews}</div>
            <div className="text-sm text-purple-700">Total Interviews</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{totalHired}</div>
            <div className="text-sm text-green-700">Total Hired</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{completedPositions}</div>
            <div className="text-sm text-orange-700">Completed Positions</div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Recruitment Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interviews</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hired</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.candidates}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.interviews}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{item.hired}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'attendance-leave':
        return renderAttendanceLeaveReport()
      case 'monthly-payroll':
        return renderPayrollReport()
      case 'monthly-penalty':
        return renderPenaltyReport()
      case 'monthly-bonus':
        return renderBonusReport()
      case 'monthly-recruitment':
        return renderRecruitmentReport()
      default:
        return null
    }
  }

  if (selectedReport && !generatedReport) {
    const report = reportTypes.find(r => r.id === selectedReport)
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={resetReport}
            className="text-orange-600 hover:text-orange-700"
          >
            ← Back to Reports
          </button>
          <div>
            <h1 className="text-2xl font-semibold">{report.title}</h1>
            <p className="text-sm text-gray-500">{report.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Report Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={filters.month}
                  onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
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
                  onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level of Work</label>
                <select
                  value={filters.levelOfWork}
                  onChange={(e) => setFilters(prev => ({ ...prev, levelOfWork: e.target.value }))}
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {workLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleGenerateReport}
              className="mt-6 w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
            >
              Generate Report
            </button>
          </div>

          <div className="rounded border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Report Preview</h2>
            <div className="text-sm text-gray-500">
              <p>Select filters and click "Generate Report" to create your detailed report.</p>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">Available Data:</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Employee attendance records and patterns</li>
                  <li>• Leave applications and approvals</li>
                  <li>• Payroll calculations and breakdowns</li>
                  <li>• Penalty records and status</li>
                  <li>• Attendance bonus eligibility</li>
                  <li>• Recruitment activities and outcomes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (generatedReport) {
    const report = reportTypes.find(r => r.id === generatedReport.type)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={resetReport}
              className="text-orange-600 hover:text-orange-700"
            >
              ← Back to Reports
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{report.title}</h1>
              <p className="text-sm text-gray-500">Generated on {generatedReport.generatedAt}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Export PDF
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Export Excel
            </button>
          </div>
        </div>

        {renderReportContent()}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-gray-500">Generate comprehensive HR reports and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map(report => (
          <div
            key={report.id}
            className={`rounded border border-gray-200 bg-white p-6 hover:border-${report.color}-300 transition-colors cursor-pointer`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="text-3xl mb-4">{report.icon}</div>
            <h2 className="text-lg font-medium mb-2">{report.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
            <div className="text-xs text-gray-500">
              <div className="font-medium mb-1">Report Features:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className={`w-1 h-1 bg-${report.color}-400 rounded-full`}></span>
                  Monthly data analysis
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-1 h-1 bg-${report.color}-400 rounded-full`}></span>
                  Department filtering
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-1 h-1 bg-${report.color}-400 rounded-full`}></span>
                  Export capabilities
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
