import { useState, useMemo } from 'react'

// Generate sample attendance data for each employee for a specific month
const generateEmployeeAttendanceData = (month, year) => {
  const employees = [
    { id: 'EMP001', name: 'Ahmed Khan', department: 'Sewing', designation: 'Senior Tailor', levelOfWork: 'Worker' },
    { id: 'EMP002', name: 'Fatima Begum', department: 'Quality Control', designation: 'Quality Inspector', levelOfWork: 'Staff' },
    { id: 'EMP003', name: 'Mohammad Hassan', department: 'Production', designation: 'Production Manager', levelOfWork: 'Staff' },
    { id: 'EMP004', name: 'Salma Khatun', department: 'Cutting', designation: 'Cutting Master', levelOfWork: 'Worker' },
    { id: 'EMP005', name: 'Karim Uddin', department: 'Maintenance', designation: 'Maintenance Engineer', levelOfWork: 'Staff' },
    { id: 'EMP006', name: 'Rashida Begum', department: 'Sewing', designation: 'Junior Tailor', levelOfWork: 'Worker' },
    { id: 'EMP007', name: 'Abdul Rahman', department: 'Finishing', designation: 'Finishing Supervisor', levelOfWork: 'Worker' },
    { id: 'EMP008', name: 'Nazma Akter', department: 'Quality Control', designation: 'Quality Assistant', levelOfWork: 'Staff' },
    { id: 'EMP009', name: 'Mizanur Rahman', department: 'Cutting', designation: 'Pattern Maker', levelOfWork: 'Worker' },
    { id: 'EMP010', name: 'Shahida Parvin', department: 'Sewing', designation: 'Line Supervisor', levelOfWork: 'Worker' }
  ]

  const attendanceData = []
  const daysInMonth = new Date(year, month, 0).getDate()

  employees.forEach(employee => {
    const employeeAttendance = {
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      designation: employee.designation,
      levelOfWork: employee.levelOfWork,
      days: []
    }

    // Generate attendance data for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      
      // Random attendance status with realistic patterns
      const random = Math.random()
      let status, checkIn, checkOut, workingHours, overtime, extraOvertime
      
      if (random < 0.70) { // 70% present on time
        status = 'Present-OnTime'
        // Check-in time between 7:45-8:00
        const checkInHour = 8
        const checkInMinute = Math.floor(Math.random() * 16) // 0-15 minutes
        checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}`
        
        // Check-out time between 17:00-18:30
        const checkOutHour = 17 + Math.floor(Math.random() * 2) // 17 or 18
        const checkOutMinute = Math.floor(Math.random() * 60) // 0-59 minutes
        checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}`
        
        // Calculate working hours (8-10 hours)
        workingHours = 8 + Math.random() * 2
        overtime = Math.max(0, workingHours - 8)
        extraOvertime = Math.max(0, workingHours - 9)
      } else if (random < 0.80) { // 10% present considered
        status = 'Present-Considered'
        // Check-in time between 8:01-8:05
        const checkInHour = 8
        const checkInMinute = 1 + Math.floor(Math.random() * 5) // 1-5 minutes
        checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}`
        
        const checkOutHour = 17 + Math.floor(Math.random() * 2)
        const checkOutMinute = Math.floor(Math.random() * 60)
        checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}`
        
        workingHours = 7.5 + Math.random() * 2
        overtime = Math.max(0, workingHours - 8)
        extraOvertime = Math.max(0, workingHours - 9)
      } else if (random < 0.85) { // 5% present late
        status = 'Present-Late'
        // Check-in time between 8:06-9:00
        const checkInHour = 8
        const checkInMinute = 6 + Math.floor(Math.random() * 54) // 6-59 minutes
        checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}`
        
        const checkOutHour = 17 + Math.floor(Math.random() * 2)
        const checkOutMinute = Math.floor(Math.random() * 60)
        checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}`
        
        workingHours = 7 + Math.random() * 2
        overtime = Math.max(0, workingHours - 8)
        extraOvertime = Math.max(0, workingHours - 9)
      } else if (random < 0.90) { // 5% leave
        const leaveTypes = ['Leave-Earn', 'Leave-Casual', 'Leave-Sick', 'Leave-Maternity', 'Leave-WithOutPay']
        status = leaveTypes[Math.floor(Math.random() * leaveTypes.length)]
        checkIn = null
        checkOut = null
        workingHours = 0
        overtime = 0
        extraOvertime = 0
      } else { // 10% absent
        status = 'Absent'
        checkIn = null
        checkOut = null
        workingHours = 0
        overtime = 0
        extraOvertime = 0
      }

      employeeAttendance.days.push({
        day,
        date: date.toISOString().split('T')[0],
        status,
        checkIn,
        checkOut,
        workingHours: Math.round(workingHours * 10) / 10,
        overtime: Math.round(overtime * 10) / 10,
        extraOvertime: Math.round(extraOvertime * 10) / 10
      })
    }

    attendanceData.push(employeeAttendance)
  })

  return attendanceData
}

const departments = ['All', 'Sewing', 'Quality Control', 'Production', 'Cutting', 'Maintenance', 'Finishing']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Production Manager', 'Cutting Master', 'Maintenance Engineer', 'Junior Tailor', 'Line Supervisor', 'Pattern Maker', 'Finishing Supervisor', 'Quality Assistant']
const workLevels = ['All', 'Worker', 'Staff']

// Month options
const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
]

// Year options (current year ± 5 years)
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

export default function Timesheet() {
  const [filters, setFilters] = useState({
    department: 'All',
    designation: 'All',
    levelOfWork: 'All',
    month: months[new Date().getMonth()].value, // Current month
    year: currentYear.toString() // Current year
  })

  // Generate attendance data based on selected month and year
  const attendanceData = useMemo(() => {
    return generateEmployeeAttendanceData(parseInt(filters.month), parseInt(filters.year))
  }, [filters.month, filters.year])

  // Filter attendance data based on selected filters
  const filteredAttendance = useMemo(() => {
    return attendanceData.filter(employee => {
      const matchesDepartment = filters.department === 'All' || employee.department === filters.department
      const matchesDesignation = filters.designation === 'All' || employee.designation === filters.designation
      const matchesLevelOfWork = filters.levelOfWork === 'All' || employee.levelOfWork === filters.levelOfWork
      
      return matchesDepartment && matchesDesignation && matchesLevelOfWork
    })
  }, [attendanceData, filters])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({
      department: 'All',
      designation: 'All',
      levelOfWork: 'All',
      month: months[new Date().getMonth()].value, // Reset to current month
      year: currentYear.toString() // Reset to current year
    })
  }

  // Generate dates for the selected month and year
  const generateDatesForMonth = (month, year) => {
    const dates = []
    const daysInMonth = new Date(year, month, 0).getDate()
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const displayDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
      dates.push({
        day,
        date: date.toISOString().split('T')[0],
        displayDate: `${dayName} ${displayDate}`,
        dayName,
        dateOnly: displayDate
      })
    }
    
    return dates
  }

  // Get dates for current filter selection
  const monthDates = generateDatesForMonth(parseInt(filters.month), parseInt(filters.year))

  // Get status color for attendance
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present-OnTime':
        return 'bg-green-100 text-green-800'
      case 'Present-Considered':
        return 'bg-yellow-100 text-yellow-800'
      case 'Present-Late':
        return 'bg-orange-100 text-orange-800'
      case 'Leave-Earn':
        return 'bg-blue-100 text-blue-800'
      case 'Leave-Maternity':
        return 'bg-purple-100 text-purple-800'
      case 'Leave-Casual':
        return 'bg-indigo-100 text-indigo-800'
      case 'Leave-Sick':
        return 'bg-pink-100 text-pink-800'
      case 'Leave-WithOutPay':
        return 'bg-gray-100 text-gray-800'
      case 'Absent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status abbreviation
  const getStatusAbbr = (status) => {
    switch (status) {
      case 'Present-OnTime':
        return 'P'
      case 'Present-Considered':
        return 'C'
      case 'Present-Late':
        return 'L'
      case 'Leave-Earn':
        return 'E'
      case 'Leave-Maternity':
        return 'M'
      case 'Leave-Casual':
        return 'C'
      case 'Leave-Sick':
        return 'S'
      case 'Leave-WithOutPay':
        return 'W'
      case 'Absent':
        return 'A'
      default:
        return '-'
    }
  }

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    let totalEmployees = filteredAttendance.length
    let totalPresentOnTimeDays = 0
    let totalPresentConsideredDays = 0
    let totalPresentLateDays = 0
    let totalLeaveEarnDays = 0
    let totalLeaveMaternityDays = 0
    let totalLeaveCasualDays = 0
    let totalLeaveSickDays = 0
    let totalLeaveWithoutPayDays = 0
    let totalAbsentDays = 0
    let totalWorkingHours = 0
    let totalOvertime = 0

    filteredAttendance.forEach(employee => {
      employee.days.forEach(day => {
        if (day.status === 'Present-OnTime') totalPresentOnTimeDays++
        else if (day.status === 'Present-Considered') totalPresentConsideredDays++
        else if (day.status === 'Present-Late') totalPresentLateDays++
        else if (day.status === 'Leave-Earn') totalLeaveEarnDays++
        else if (day.status === 'Leave-Maternity') totalLeaveMaternityDays++
        else if (day.status === 'Leave-Casual') totalLeaveCasualDays++
        else if (day.status === 'Leave-Sick') totalLeaveSickDays++
        else if (day.status === 'Leave-WithOutPay') totalLeaveWithoutPayDays++
        else if (day.status === 'Absent') totalAbsentDays++
        
        totalWorkingHours += day.workingHours
        totalOvertime += day.overtime
      })
    })

    return {
      totalEmployees,
      totalPresentOnTimeDays,
      totalPresentConsideredDays,
      totalPresentLateDays,
      totalLeaveEarnDays,
      totalLeaveMaternityDays,
      totalLeaveCasualDays,
      totalLeaveSickDays,
      totalLeaveWithoutPayDays,
      totalAbsentDays,
      totalWorkingHours: Math.round(totalWorkingHours * 10) / 10,
      totalOvertime: Math.round(totalOvertime * 10) / 10
    }
  }, [filteredAttendance])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Employee Timesheet - {months.find(m => m.value === filters.month)?.label} {filters.year}
        </h1>
        <p className="text-sm text-gray-500">
          Complete attendance report for all employees for {months.find(m => m.value === filters.month)?.label} {filters.year}
        </p>
      </div>

      {/* Summary Statistics and Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Statistics - Top Row */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Total Employees</div>
              <div className="text-2xl font-bold text-blue-600">{summaryStats.totalEmployees}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Present-OnTime</div>
              <div className="text-2xl font-bold text-green-600">{summaryStats.totalPresentOnTimeDays}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Present-Considered</div>
              <div className="text-2xl font-bold text-yellow-600">{summaryStats.totalPresentConsideredDays}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Present-Late</div>
              <div className="text-2xl font-bold text-orange-600">{summaryStats.totalPresentLateDays}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Leave-Earn</div>
              <div className="text-2xl font-bold text-blue-600">{summaryStats.totalLeaveEarnDays}</div>
            </div>
          </div>

          {/* Summary Statistics - Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Leave-Maternity</div>
              <div className="text-2xl font-bold text-purple-600">{summaryStats.totalLeaveMaternityDays}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Leave-Casual</div>
              <div className="text-2xl font-bold text-indigo-600">{summaryStats.totalLeaveCasualDays}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Leave-Sick</div>
              <div className="text-2xl font-bold text-pink-600">{summaryStats.totalLeaveSickDays}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Leave-WithOutPay</div>
              <div className="text-2xl font-bold text-gray-600">{summaryStats.totalLeaveWithoutPayDays}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Absent Days</div>
              <div className="text-2xl font-bold text-red-600">{summaryStats.totalAbsentDays}</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-green-100 text-green-800 rounded-full text-xs font-semibold text-center mr-2">P</span>
              <span className="text-gray-600">Present-OnTime</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold text-center mr-2">C</span>
              <span className="text-gray-600">Present-Considered</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold text-center mr-2">L</span>
              <span className="text-gray-600">Present-Late</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold text-center mr-2">E</span>
              <span className="text-gray-600">Leave-Earn</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold text-center mr-2">M</span>
              <span className="text-gray-600">Leave-Maternity</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold text-center mr-2">C</span>
              <span className="text-gray-600">Leave-Casual</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-pink-100 text-pink-800 rounded-full text-xs font-semibold text-center mr-2">S</span>
              <span className="text-gray-600">Leave-Sick</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold text-center mr-2">W</span>
              <span className="text-gray-600">Leave-WithOutPay</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-red-100 text-red-800 rounded-full text-xs font-semibold text-center mr-2">A</span>
              <span className="text-gray-600">Absent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
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
                <option key={year} value={year.toString()}>{year}</option>
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
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
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
              {designations.map(desig => (
                <option key={desig} value={desig}>{desig}</option>
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
              {workLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full h-10 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded hover:from-orange-500 hover:to-orange-700 font-medium transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* 30-Day Attendance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {months.find(m => m.value === filters.month)?.label} {filters.year} Attendance Report
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[100px]">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  Employee Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Designation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Department
                </th>
                {monthDates.map((dateInfo) => (
                  <th key={dateInfo.day} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                    <div className="flex flex-col">
                      <div className="text-xs font-semibold">{dateInfo.dayName}</div>
                      <div className="text-xs">{dateInfo.dateOnly}</div>
                    </div>
                  </th>
                ))}
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] border-l-4 border-black whitespace-nowrap">
                  P-OnTime
                </th>
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] whitespace-nowrap">
                  P-Considered
                </th>
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] whitespace-nowrap">
                  P-Late
                </th>
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] whitespace-nowrap">
                  L-Earn
                </th>
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] whitespace-nowrap">
                  L-Maternity
                </th>
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] whitespace-nowrap">
                  L-Casual
                </th>
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] whitespace-nowrap">
                  L-Sick
                </th>
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] whitespace-nowrap">
                  L-WithoutPay
                </th>
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px] whitespace-nowrap">
                  Absent
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((employee) => {
                // Calculate legend counts for this employee
                const legendCounts = {
                  presentOnTime: employee.days.filter(day => day.status === 'Present-OnTime').length,
                  presentConsidered: employee.days.filter(day => day.status === 'Present-Considered').length,
                  presentLate: employee.days.filter(day => day.status === 'Present-Late').length,
                  leaveEarn: employee.days.filter(day => day.status === 'Leave-Earn').length,
                  leaveMaternity: employee.days.filter(day => day.status === 'Leave-Maternity').length,
                  leaveCasual: employee.days.filter(day => day.status === 'Leave-Casual').length,
                  leaveSick: employee.days.filter(day => day.status === 'Leave-Sick').length,
                  leaveWithoutPay: employee.days.filter(day => day.status === 'Leave-WithOutPay').length,
                  absent: employee.days.filter(day => day.status === 'Absent').length
                }

                return (
                  <tr key={employee.employeeId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 min-w-[100px]">
                      {employee.employeeId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[200px]">
                      <div className="font-medium">{employee.employeeName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[150px]">
                      {employee.designation}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">
                      {employee.department}
                    </td>
                    {monthDates.map((dateInfo) => {
                      // Find the attendance data for this specific date
                      const dayData = employee.days.find(day => day.date === dateInfo.date)
                      const status = dayData ? dayData.status : 'Absent'
                      
                      return (
                        <td key={dateInfo.day} className="px-2 py-4 text-center min-w-[60px]">
                          <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                            {getStatusAbbr(status)}
                          </span>
                        </td>
                      )
                    })}
                    <td className="px-1 py-4 text-center min-w-[50px] border-l-4 border-black">
                      <span className="text-green-600 font-semibold text-sm">
                        {legendCounts.presentOnTime}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center min-w-[50px]">
                      <span className="text-yellow-600 font-semibold text-sm">
                        {legendCounts.presentConsidered}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center min-w-[50px]">
                      <span className="text-orange-600 font-semibold text-sm">
                        {legendCounts.presentLate}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center min-w-[50px]">
                      <span className="text-blue-600 font-semibold text-sm">
                        {legendCounts.leaveEarn}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center min-w-[50px]">
                      <span className="text-purple-600 font-semibold text-sm">
                        {legendCounts.leaveMaternity}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center min-w-[50px]">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {legendCounts.leaveCasual}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center min-w-[50px]">
                      <span className="text-pink-600 font-semibold text-sm">
                        {legendCounts.leaveSick}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center min-w-[50px]">
                      <span className="text-gray-600 font-semibold text-sm">
                        {legendCounts.leaveWithoutPay}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center min-w-[50px]">
                      <span className="text-red-600 font-semibold text-sm">
                        {legendCounts.absent}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredAttendance.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see employee data.</p>
          </div>
        )}
      </div>
    </div>
  )
}