import { useState, useMemo } from 'react'

// Generate 30 days of sample attendance data for each employee
const generateEmployeeAttendanceData = () => {
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

  employees.forEach(employee => {
    const employeeAttendance = {
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      designation: employee.designation,
      levelOfWork: employee.levelOfWork,
      days: []
    }

    // Generate 30 days of attendance data
    for (let day = 1; day <= 30; day++) {
      const date = new Date()
      date.setDate(date.getDate() - (30 - day))
      
      // Random attendance status with realistic patterns
      const random = Math.random()
      let status, checkIn, checkOut, workingHours, overtime, extraOvertime
      
      if (random < 0.85) { // 85% present
        status = 'Present'
        // Check-in time between 7:45-8:15
        const checkInHour = 8
        const checkInMinute = Math.floor(Math.random() * 30) // 0-29 minutes
        checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}`
        
        // Check-out time between 17:00-18:30
        const checkOutHour = 17 + Math.floor(Math.random() * 2) // 17 or 18
        const checkOutMinute = Math.floor(Math.random() * 60) // 0-59 minutes
        checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}`
        
        // Calculate working hours (8-10 hours)
        workingHours = 8 + Math.random() * 2
        overtime = Math.max(0, workingHours - 8)
        extraOvertime = Math.max(0, workingHours - 9)
      } else if (random < 0.95) { // 10% late
        status = 'Late'
        // Check-in time between 8:16-9:00
        const checkInHour = 8
        const checkInMinute = 16 + Math.floor(Math.random() * 44) // 16-59 minutes
        checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}`
        
        const checkOutHour = 17 + Math.floor(Math.random() * 2)
        const checkOutMinute = Math.floor(Math.random() * 60)
        checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}`
        
        workingHours = 7.5 + Math.random() * 2
        overtime = Math.max(0, workingHours - 8)
        extraOvertime = Math.max(0, workingHours - 9)
      } else { // 5% absent
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

export default function Timesheet() {
  const [attendanceData] = useState(generateEmployeeAttendanceData())
  const [filters, setFilters] = useState({
    department: 'All',
    designation: 'All',
    levelOfWork: 'All'
  })

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
      levelOfWork: 'All'
    })
  }

  // Get status color for attendance
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800'
      case 'Late':
        return 'bg-yellow-100 text-yellow-800'
      case 'Absent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status abbreviation
  const getStatusAbbr = (status) => {
    switch (status) {
      case 'Present':
        return 'P'
      case 'Late':
        return 'L'
      case 'Absent':
        return 'A'
      default:
        return '-'
    }
  }

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    let totalEmployees = filteredAttendance.length
    let totalPresentDays = 0
    let totalLateDays = 0
    let totalAbsentDays = 0
    let totalWorkingHours = 0
    let totalOvertime = 0

    filteredAttendance.forEach(employee => {
      employee.days.forEach(day => {
        if (day.status === 'Present') totalPresentDays++
        else if (day.status === 'Late') totalLateDays++
        else if (day.status === 'Absent') totalAbsentDays++
        
        totalWorkingHours += day.workingHours
        totalOvertime += day.overtime
      })
    })

    return {
      totalEmployees,
      totalPresentDays,
      totalLateDays,
      totalAbsentDays,
      totalWorkingHours: Math.round(totalWorkingHours * 10) / 10,
      totalOvertime: Math.round(totalOvertime * 10) / 10
    }
  }, [filteredAttendance])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Employee Timesheet - 30 Days Report</h1>
        <p className="text-sm text-gray-500">Complete attendance report for all employees over the last 30 days</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Employees</div>
          <div className="text-2xl font-bold text-blue-600">{summaryStats.totalEmployees}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Present Days</div>
          <div className="text-2xl font-bold text-green-600">{summaryStats.totalPresentDays}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Late Days</div>
          <div className="text-2xl font-bold text-yellow-600">{summaryStats.totalLateDays}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Absent Days</div>
          <div className="text-2xl font-bold text-red-600">{summaryStats.totalAbsentDays}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Working Hours</div>
          <div className="text-2xl font-bold text-indigo-600">{summaryStats.totalWorkingHours}h</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Overtime</div>
          <div className="text-2xl font-bold text-orange-600">{summaryStats.totalOvertime}h</div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-green-100 text-green-800 rounded-full text-xs font-semibold text-center mr-2">P</span>
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold text-center mr-2">L</span>
            <span className="text-gray-600">Late</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-red-100 text-red-800 rounded-full text-xs font-semibold text-center mr-2">A</span>
            <span className="text-gray-600">Absent</span>
          </div>
        </div>
      </div>

      {/* 30-Day Attendance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">30-Day Attendance Report</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-16 bg-gray-50 z-10 min-w-[200px]">
                  Employee Name
                </th>
                {Array.from({ length: 30 }, (_, i) => (
                  <th key={i + 1} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px]">
                    Day {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((employee) => (
                <tr key={employee.employeeId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                    {employee.employeeId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sticky left-16 bg-white z-10 min-w-[200px]">
                    <div>
                      <div className="font-medium">{employee.employeeName}</div>
                      <div className="text-xs text-gray-500">{employee.department} • {employee.designation}</div>
                    </div>
                  </td>
                  {employee.days.map((day) => (
                    <td key={day.day} className="px-2 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full ${getStatusColor(day.status)}`}>
                        {getStatusAbbr(day.status)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
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