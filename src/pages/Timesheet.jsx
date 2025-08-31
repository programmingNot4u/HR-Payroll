import { useState, useMemo } from 'react'

// Sample monthly timesheet data (in real app, this would come from database)
const sampleEmployees = [
  { id: 'EMP001', name: 'Ahmed Khan', department: 'Sewing', designation: 'Senior Tailor', levelOfWork: 'Worker' },
  { id: 'EMP002', name: 'Fatima Begum', department: 'Quality Control', designation: 'Quality Inspector', levelOfWork: 'Staff' },
  { id: 'EMP003', name: 'Mohammad Hassan', department: 'Production', designation: 'Production Manager', levelOfWork: 'Staff' },
  { id: 'EMP004', name: 'Salma Khatun', department: 'Cutting', designation: 'Cutting Master', levelOfWork: 'Worker' },
  { id: 'EMP005', name: 'Karim Uddin', department: 'Maintenance', designation: 'Maintenance Engineer', levelOfWork: 'Staff' },
  { id: 'EMP006', name: 'Nusrat Jahan', department: 'Sewing', designation: 'Junior Tailor', levelOfWork: 'Worker' },
  { id: 'EMP007', name: 'Rashid Ahmed', department: 'Sewing', designation: 'Line Supervisor', levelOfWork: 'Staff' },
  { id: 'EMP008', name: 'Sabina Yasmin', department: 'Cutting', designation: 'Pattern Maker', levelOfWork: 'Worker' }
]

// Sample attendance data for each employee for each day of the month
const generateMonthlyAttendance = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const attendance = {}
  
  sampleEmployees.forEach(employee => {
    attendance[employee.id] = {}
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
      
      // Generate realistic attendance data
      let status = 'Present'
      let entryTime = '08:00'
      let isLate = false
      
             // Friday is usually off
       if (dayOfWeek === 5) {
         status = 'Off Day'
         entryTime = ''
       } else {
        // Random late entries (20% chance)
        if (Math.random() < 0.2) {
          isLate = true
          entryTime = '08:30'
        }
        
        // Random absences (5% chance on weekdays)
        if (Math.random() < 0.05) {
          status = 'Absent'
          entryTime = ''
        }
      }
      
      attendance[employee.id][day] = {
        status,
        entryTime,
        isLate,
        workingHours: status === 'Present' ? 8 : 0
      }
    }
  })
  
  return attendance
}

const departments = ['All', 'Sewing', 'Quality Control', 'Production', 'Cutting', 'Maintenance']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Production Manager', 'Cutting Master', 'Maintenance Engineer', 'Junior Tailor', 'Line Supervisor', 'Pattern Maker']
const workLevels = ['All', 'Worker', 'Staff']

export default function Timesheet() {
  const [selectedMonth, setSelectedMonth] = useState('2024-01')
  const [filters, setFilters] = useState({
    department: 'All',
    designation: 'All',
    levelOfWork: 'All'
  })

  // Parse selected month
  const [year, month] = selectedMonth.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  
  // Generate attendance data for the selected month
  const monthlyAttendance = useMemo(() => generateMonthlyAttendance(year, month), [year, month])

  // Filter employees based on selected filters
  const filteredEmployees = useMemo(() => {
    return sampleEmployees.filter(employee => {
      const matchesDepartment = filters.department === 'All' || employee.department === filters.department
      const matchesDesignation = filters.designation === 'All' || employee.designation === filters.designation
      const matchesLevelOfWork = filters.levelOfWork === 'All' || employee.levelOfWork === filters.levelOfWork
      
      return matchesDepartment && matchesDesignation && matchesLevelOfWork
    })
  }, [filters])

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

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    let totalPresent = 0
    let totalAbsent = 0
    let totalLeave = 0
    let totalLate = 0

    filteredEmployees.forEach(employee => {
      for (let day = 1; day <= daysInMonth; day++) {
        const dayData = monthlyAttendance[employee.id][day]
        if (dayData.status === 'Present') {
          totalPresent++
          if (dayData.isLate) totalLate++
        } else if (dayData.status === 'Absent') {
          totalAbsent++
                 } else if (dayData.status === 'Off Day') {
           totalLeave++
         }
      }
    })

    return { totalPresent, totalAbsent, totalLeave, totalLate }
  }, [filteredEmployees, monthlyAttendance, daysInMonth])

  const getStatusColor = (status, isLate) => {
    if (status === 'Present') {
      return isLate ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
    } else if (status === 'Absent') {
      return 'bg-red-100 text-red-800'
    } else if (status === 'Off Day') {
      return 'bg-blue-100 text-blue-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status, isLate) => {
    if (status === 'Present') {
      return isLate ? 'Late' : 'Present'
    }
    return status
  }

  const getDayName = (day) => {
    const date = new Date(year, month - 1, day)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return dayNames[date.getDay()]
  }

  const isWeekend = (day) => {
    const date = new Date(year, month - 1, day)
    return date.getDay() === 5 // Friday is off day
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Employee Timesheet</h1>
        <p className="text-sm text-gray-500">Monthly attendance calendar view for all employees</p>
      </div>

      {/* Month Selection and Filters */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {workLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full h-10 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Present</div>
          <div className="text-2xl font-bold text-green-600">{summaryStats.totalPresent}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Absent</div>
          <div className="text-2xl font-bold text-red-600">{summaryStats.totalAbsent}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Leave</div>
          <div className="text-2xl font-bold text-blue-600">{summaryStats.totalLeave}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Late Entries</div>
          <div className="text-2xl font-bold text-yellow-600">{summaryStats.totalLate}</div>
        </div>
      </div>

      {/* Timesheet Calendar Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
               <tr>
                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                   Employee
                 </th>
                 {Array.from({ length: daysInMonth }, (_, index) => {
                   const day = index + 1
                   const dayName = getDayName(day)
                   const weekend = isWeekend(day)
                   
                   return (
                     <th key={day} className={`px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] ${weekend ? 'bg-blue-50' : ''}`}>
                       <div className="text-center">
                         <div className="font-medium text-gray-900">{day}</div>
                         <div className="text-xs text-gray-500">{dayName}</div>
                       </div>
                     </th>
                   )
                 })}
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {filteredEmployees.map((employee) => (
                 <tr key={employee.id} className="hover:bg-gray-50">
                   <td className="px-3 py-2 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                     <div className="flex items-center">
                       <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                         <span className="text-xs font-medium text-white">
                           {employee.id.replace('EMP', '')}
                         </span>
                       </div>
                       <div className="ml-3">
                         <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                         <div className="text-xs text-gray-500">{employee.department} • {employee.levelOfWork}</div>
                       </div>
                     </div>
                   </td>
                   {Array.from({ length: daysInMonth }, (_, index) => {
                     const day = index + 1
                     const dayData = monthlyAttendance[employee.id][day]
                     const statusColor = getStatusColor(dayData.status, dayData.isLate)
                     const statusText = getStatusText(dayData.status, dayData.isLate)
                     const weekend = isWeekend(day)
                     
                     return (
                                                <td key={`${employee.id}-${day}`} className={`px-3 py-2 text-center ${weekend ? 'bg-blue-50' : ''}`}>
                           <div className="flex flex-col items-center space-y-1">
                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                               {statusText}
                             </span>
                             {dayData.entryTime && (
                               <span className="text-xs text-gray-500">
                                 {dayData.entryTime}
                               </span>
                             )}
                           </div>
                         </td>
                       )
                     })}
                   </tr>
                 ))}
               </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see employee data.</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-100 rounded-full mr-2"></span>
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></span>
            <span className="text-gray-600">Late</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-100 rounded-full mr-2"></span>
            <span className="text-gray-600">Absent</span>
          </div>
                     <div className="flex items-center">
             <span className="w-3 h-3 bg-blue-100 rounded-full mr-2"></span>
             <span className="text-gray-600">Off Day</span>
           </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          * Blue background indicates Friday (off day). Entry times are shown below status for present employees.
        </div>
      </div>
    </div>
  )
}
