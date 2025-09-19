import { useState, useMemo } from 'react'

// Sample attendance data (in real app, this would come from fingerprint machine)
const sampleAttendance = [
  {
    id: 'EMP001',
    name: 'Ahmed Khan',
    designation: 'Senior Tailor',
    department: 'Sewing',
    levelOfWork: 'Worker',
    checkIn: '08:00',
    lunchBreak: '13:00-14:00',
    checkOut: '17:30',
    workingHours: 8.25,
    overtime: 0.5,
    extraOvertime: 0.0,
    status: 'Present',
    attendanceCount: 2,
    scans: [
      { time: '08:00', type: 'Check In' },
      { time: '17:30', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP002',
    name: 'Fatima Begum',
    designation: 'Quality Inspector',
    department: 'Quality Control',
    levelOfWork: 'Staff',
    checkIn: '08:00',
    lunchBreak: '13:00-14:00',
    checkOut: '18:00',
    workingHours: 9.0,
    overtime: 1.0,
    extraOvertime: 0.0,
    status: 'Present',
    attendanceCount: 2,
    scans: [
      { time: '08:00', type: 'Check In' },
      { time: '18:00', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP003',
    name: 'Rahim Ali',
    designation: 'Cutting Master',
    department: 'Cutting',
    levelOfWork: 'Worker',
    checkIn: '08:30',
    lunchBreak: '13:00-14:00',
    checkOut: '17:00',
    workingHours: 7.5,
    overtime: 0.0,
    extraOvertime: 0.0,
    status: 'Present',
    attendanceCount: 2,
    scans: [
      { time: '08:30', type: 'Check In' },
      { time: '17:00', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP004',
    name: 'Ayesha Rahman',
    designation: 'Finishing Supervisor',
    department: 'Finishing',
    levelOfWork: 'Staff',
    checkIn: '08:45',
    lunchBreak: '13:00-14:00',
    checkOut: '19:30',
    workingHours: 9.75,
    overtime: 2.0,
    extraOvertime: 0.5,
    status: 'Present',
    attendanceCount: 3,
    scans: [
      { time: '08:45', type: 'Check In' },
      { time: '12:45', type: 'Check Out' },
      { time: '19:30', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP005',
    name: 'Mohammad Hassan',
    designation: 'Production Manager',
    department: 'Management',
    levelOfWork: 'Staff',
    checkIn: '08:00',
    lunchBreak: '13:00-14:00',
    checkOut: '18:30',
    workingHours: 9.5,
    overtime: 1.5,
    extraOvertime: 0.0,
    status: 'Present',
    attendanceCount: 2,
    scans: [
      { time: '08:00', type: 'Check In' },
      { time: '18:30', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP006',
    name: 'Nusrat Jahan',
    designation: 'Junior Tailor',
    department: 'Sewing',
    levelOfWork: 'Worker',
    checkIn: '08:20',
    lunchBreak: '13:00-14:00',
    checkOut: '16:45',
    workingHours: 7.42,
    overtime: 0.0,
    extraOvertime: 0.0,
    status: 'Present',
    attendanceCount: 2,
    scans: [
      { time: '08:20', type: 'Check In' },
      { time: '16:45', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP007',
    name: 'Karim Uddin',
    designation: 'Machine Operator',
    department: 'Sewing',
    levelOfWork: 'Worker',
    checkIn: '08:10',
    lunchBreak: '13:00-14:00',
    checkOut: '20:00',
    workingHours: 10.83,
    overtime: 2.0,
    extraOvertime: 1.0,
    status: 'Present',
    attendanceCount: 4,
    scans: [
      { time: '08:10', type: 'Check In' },
      { time: '12:30', type: 'Check Out' },
      { time: '13:30', type: 'Check In' },
      { time: '20:00', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP008',
    name: 'Salma Khatun',
    designation: 'Quality Assistant',
    department: 'Quality Control',
    levelOfWork: 'Staff',
    checkIn: '08:25',
    lunchBreak: '13:00-14:00',
    checkOut: '17:15',
    workingHours: 7.83,
    overtime: 0.25,
    extraOvertime: 0.0,
    status: 'Present',
    attendanceCount: 2,
    scans: [
      { time: '08:25', type: 'Check In' },
      { time: '17:15', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP011',
    name: 'Karim Uddin',
    designation: 'Machine Operator',
    department: 'Sewing',
    levelOfWork: 'Worker',
    checkIn: '08:00',
    lunchBreak: '13:00-14:00',
    checkOut: '00:00',
    workingHours: 15.0,
    overtime: 2.0,
    extraOvertime: 5.0,
    status: 'Present',
    attendanceCount: 2,
    scans: [
      { time: '08:00', type: 'Check In' },
      { time: '00:00', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP012',
    name: 'Salma Khatun',
    designation: 'Quality Assistant',
    department: 'Quality Control',
    levelOfWork: 'Worker',
    checkIn: '08:00',
    lunchBreak: '13:00-14:00',
    checkOut: '02:00',
    workingHours: 17.0,
    overtime: 2.0,
    extraOvertime: 7.0,
    status: 'Present',
    attendanceCount: 2,
    scans: [
      { time: '08:00', type: 'Check In' },
      { time: '02:00', type: 'Check Out' }
    ]
  }
]

const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Quality Control', 'Management']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Cutting Master', 'Finishing Supervisor', 'Production Manager', 'Junior Tailor', 'Machine Operator', 'Quality Assistant']
const workLevels = ['All', 'Worker', 'Staff']

export default function DailyAttendance() {
  // Format date to dd/mm/yyyy for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filters, setFilters] = useState({
    department: 'All',
    designation: 'All',
    levelOfWork: 'All'
  })
  const [timeSettings, setTimeSettings] = useState({
    safeEntryTime: '08:00',
    lunchStartTime: '13:00',
    lunchEndTime: '14:00',
    safeExitTime: '17:00'
  })
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showScanModal, setShowScanModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editForm, setEditForm] = useState({
    checkIn: '',
    checkOut: '',
    workingHours: 0,
    overtime: 0,
    extraOvertime: 0
  })
  const [attendanceData, setAttendanceData] = useState(sampleAttendance)

  // Filter attendance based on selected filters
  const filteredAttendance = useMemo(() => {
    return attendanceData.filter(attendance => {
      const matchesDepartment = filters.department === 'All' || attendance.department === filters.department
      const matchesDesignation = filters.designation === 'All' || attendance.designation === filters.designation
      const matchesLevelOfWork = filters.levelOfWork === 'All' || attendance.levelOfWork === filters.levelOfWork
      return matchesDepartment && matchesDesignation && matchesLevelOfWork
    })
  }, [filters, attendanceData])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleTimeSettingChange = (field, value) => {
    setTimeSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleAttendanceCountClick = (attendance) => {
    setSelectedEmployee(attendance)
    setShowScanModal(true)
  }

  // Edit functions
  const handleEditClick = (employee) => {
    setEditingEmployee(employee)
    const workingHours = calculateWorkingHours(employee.checkIn, employee.checkOut)
    setEditForm({
      checkIn: employee.checkIn || '',
      checkOut: employee.checkOut || '',
      workingHours: workingHours,
      overtime: calculateOvertime(employee.checkOut),
      extraOvertime: calculateExtraOvertime(employee.checkOut)
    })
  }

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => {
      const updatedForm = {
        ...prev,
        [field]: value
      }
      
      // Auto-calculate overtime and extra overtime when check-in or check-out changes
      if (field === 'checkIn' || field === 'checkOut') {
        const workingHours = calculateWorkingHours(updatedForm.checkIn, updatedForm.checkOut)
        const overtime = calculateOvertime(updatedForm.checkOut)
        const extraOvertime = calculateExtraOvertime(updatedForm.checkOut)
        
        updatedForm.workingHours = workingHours
        updatedForm.overtime = overtime
        updatedForm.extraOvertime = extraOvertime
      }
      
      return updatedForm
    })
  }

  const handleSaveEdit = () => {
    if (editingEmployee) {
      // Update the employee data in the attendance data
      const updatedAttendance = attendanceData.map(emp => 
        emp.id === editingEmployee.id 
          ? { 
              ...emp, 
              checkIn: editForm.checkIn,
              checkOut: editForm.checkOut,
              workingHours: editForm.workingHours,
              overtime: editForm.overtime,
              extraOvertime: editForm.extraOvertime
            }
          : emp
      )
      
      // Update the attendance data state
      setAttendanceData(updatedAttendance)
      
      // Close the edit modal
      setEditingEmployee(null)
      setEditForm({
        checkIn: '',
        checkOut: '',
        overtime: 0,
        extraOvertime: 0
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingEmployee(null)
    setEditForm({
      checkIn: '',
      checkOut: '',
      workingHours: 0,
      overtime: 0,
      extraOvertime: 0
    })
  }

  // Convert decimal hours to "X Hours Y Minutes" format
  const formatWorkingHours = (decimalHours) => {
    const hours = Math.floor(decimalHours)
    const minutes = Math.round((decimalHours - hours) * 60)
    return `${hours} Hours ${minutes} Minutes`
  }

  // Format overtime as whole hours only
  const formatOvertime = (decimalHours) => {
    const hours = Math.round(decimalHours)
    return hours === 1 ? '1 Hour' : `${hours} Hours`
  }

  // Calculate status based on check-in time
  const getCheckInStatus = (checkInTime) => {
    if (!checkInTime) return 'Absent'
    
    const [hours, minutes] = checkInTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes
    const onTimeMinutes = 8 * 60 // 8:00 AM
    const acceptedMinutes = 8 * 60 + 5 // 8:05 AM
    
    if (totalMinutes <= onTimeMinutes) {
      return 'On-time'
    } else if (totalMinutes <= acceptedMinutes) {
      return 'Accepted'
    } else {
      return 'Late Login'
    }
  }

  // Calculate working hours based on check-in and check-out times
  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    
    const [inHour, inMinute] = checkIn.split(':').map(Number)
    const [outHour, outMinute] = checkOut.split(':').map(Number)
    
    const checkInMinutes = inHour * 60 + inMinute
    let checkOutMinutes = outHour * 60 + outMinute
    
    // Handle midnight rollover (if check-out is before check-in, it's next day)
    if (checkOutMinutes < checkInMinutes) {
      checkOutMinutes += 24 * 60 // Add 24 hours (1440 minutes) for next day
    }
    
    // Calculate total minutes worked
    let totalMinutes = checkOutMinutes - checkInMinutes
    
    // Subtract lunch break (1 hour = 60 minutes)
    totalMinutes -= 60
    
    // Convert to hours (decimal)
    const workingHours = totalMinutes / 60
    
    return Math.max(0, Math.round(workingHours * 10) / 10) // Round to 1 decimal place
  }

  // Calculate overtime based on check-out time (5:00 PM to 7:00 PM)
  const calculateOvertime = (checkOut) => {
    if (!checkOut) return 0
    
    const [outHour, outMinute] = checkOut.split(':').map(Number)
    let checkOutMinutes = outHour * 60 + outMinute
    const overtimeStartMinutes = 17 * 60 // 5:00 PM = 17:00
    const overtimeEndMinutes = 19 * 60   // 7:00 PM = 19:00
    
    // Handle midnight rollover - if check-out is between 00:00 and 17:00, it's next day
    let isNextDay = false
    if (checkOutMinutes >= 0 && checkOutMinutes < overtimeStartMinutes) {
      checkOutMinutes += 24 * 60 // Add 24 hours for next day
      isNextDay = true
    }
    
    // If check-out is before 5:00 PM (same day), no overtime
    if (!isNextDay && checkOutMinutes < overtimeStartMinutes) return 0
    
    // If check-out is between 5:00 PM and 7:00 PM (same day), calculate overtime
    if (!isNextDay && checkOutMinutes >= overtimeStartMinutes && checkOutMinutes <= overtimeEndMinutes) {
      const overtimeMinutes = checkOutMinutes - overtimeStartMinutes
      return Math.round((overtimeMinutes / 60) * 10) / 10
    }
    
    // If check-out is after 7:00 PM (same day), maximum overtime is 2 hours (5:00 PM to 7:00 PM)
    if (!isNextDay && checkOutMinutes > overtimeEndMinutes) {
      return 2.0
    }
    
    // If it's next day, check if check-out is in the overtime period (5:00 PM to 7:00 PM next day)
    if (isNextDay) {
      // For next day, overtime period is 5:00 PM to 7:00 PM (17:00 to 19:00)
      const nextDayOvertimeStart = 17 * 60 // 5:00 PM next day
      const nextDayOvertimeEnd = 19 * 60   // 7:00 PM next day
      
      if (checkOutMinutes >= nextDayOvertimeStart && checkOutMinutes <= nextDayOvertimeEnd) {
        const overtimeMinutes = checkOutMinutes - nextDayOvertimeStart
        return Math.round((overtimeMinutes / 60) * 10) / 10
      } else if (checkOutMinutes > nextDayOvertimeEnd) {
        return 2.0 // Full overtime
      }
    }
    
    return 0
  }

  // Calculate extra overtime for workers (after 7:00 PM)
  const calculateExtraOvertime = (checkOut) => {
    if (!checkOut) return 0
    
    const [outHour, outMinute] = checkOut.split(':').map(Number)
    let checkOutMinutes = outHour * 60 + outMinute
    const extraOvertimeStartMinutes = 19 * 60 // 7:00 PM = 19:00
    
    // Handle midnight rollover - if check-out is between 00:00 and 19:00, it's next day
    let isNextDay = false
    if (checkOutMinutes >= 0 && checkOutMinutes < extraOvertimeStartMinutes) {
      checkOutMinutes += 24 * 60 // Add 24 hours for next day
      isNextDay = true
    }
    
    // If check-out is before 7:00 PM (same day), no extra overtime
    if (!isNextDay && checkOutMinutes < extraOvertimeStartMinutes) return 0
    
    // If check-out is after 7:00 PM (same day), calculate extra overtime
    if (!isNextDay && checkOutMinutes > extraOvertimeStartMinutes) {
      const extraOvertimeMinutes = checkOutMinutes - extraOvertimeStartMinutes
      return Math.round((extraOvertimeMinutes / 60) * 10) / 10
    }
    
    // If it's next day, check if check-out is after 7:00 PM next day
    if (isNextDay) {
      // For next day, extra overtime starts at 7:00 PM (19:00)
      const nextDayExtraOvertimeStart = 19 * 60 // 7:00 PM next day
      
      if (checkOutMinutes > nextDayExtraOvertimeStart) {
        const extraOvertimeMinutes = checkOutMinutes - nextDayExtraOvertimeStart
        return Math.round((extraOvertimeMinutes / 60) * 10) / 10
      }
    }
    
    return 0
  }

  // Calculate snacks eligibility for workers
  const getSnacksEligibility = (levelOfWork, extraOvertime) => {
    if (levelOfWork !== 'Worker') return 'N/A'
    return extraOvertime >= 1 ? 'Eligible' : 'Not Eligible'
  }

  // Calculate night bill eligibility for workers
  const getNightBillEligibility = (levelOfWork, extraOvertime) => {
    if (levelOfWork !== 'Worker') return 'N/A'
    return extraOvertime >= 5 ? 'Eligible' : 'Not Eligible'
  }

  // Calculate rounded checkout time
  const getRoundedCheckOut = (checkOut) => {
    if (!checkOut) return ''
    
    const [outHour, outMinute] = checkOut.split(':').map(Number)
    
    // Round to nearest hour: if minutes >= 55, round up to next hour
    if (outMinute >= 55) {
      const roundedHour = outHour + 1
      // Handle midnight rollover
      if (roundedHour >= 24) {
        return `${(roundedHour - 24).toString().padStart(2, '0')}:00`
      }
      return `${roundedHour.toString().padStart(2, '0')}:00`
    } else {
      return `${outHour.toString().padStart(2, '0')}:00`
    }
  }



  const totalEmployees = filteredAttendance.length
  const presentEmployees = filteredAttendance.filter(emp => emp.status === 'Present').length
  const absentEmployees = filteredAttendance.filter(emp => emp.status === 'Absent').length
  const informedEmployees = filteredAttendance.filter(emp => emp.status === 'Informed').length
  const uninformedEmployees = filteredAttendance.filter(emp => emp.status === 'Uninformed').length
  const lateLoginEmployees = filteredAttendance.filter(emp => 
    emp.checkIn && getCheckInStatus(emp.checkIn) === 'Late Login'
  ).length
  const totalWorkingHours = filteredAttendance.reduce((sum, emp) => 
    sum + calculateWorkingHours(emp.checkIn, emp.checkOut), 0)
  // Only calculate overtime for Workers
  const totalOvertime = filteredAttendance.reduce((sum, emp) => 
    emp.levelOfWork === 'Worker' ? sum + calculateOvertime(emp.checkOut) : sum, 0)
  const totalExtraOvertime = filteredAttendance.reduce((sum, emp) => 
    emp.levelOfWork === 'Worker' ? sum + calculateExtraOvertime(emp.checkOut) : sum, 0)
  
  // Calculate snacks and night bill eligibility counts
  const snacksEligibleCount = filteredAttendance.filter(emp => 
    getSnacksEligibility(emp.levelOfWork, calculateExtraOvertime(emp.checkOut)) === 'Eligible'
  ).length
  
  const nightBillEligibleCount = filteredAttendance.filter(emp => 
    getNightBillEligibility(emp.levelOfWork, calculateExtraOvertime(emp.checkOut)) === 'Eligible'
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Daily Attendance</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Active Employees</div>
          <div className="mt-1 text-2xl font-semibold">{totalEmployees}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Total Present</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">{presentEmployees}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Total Absent</div>
          <div className="mt-1 text-2xl font-semibold text-red-600">{absentEmployees}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Informed</div>
          <div className="mt-1 text-2xl font-semibold text-blue-600">{informedEmployees}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Uninformed</div>
          <div className="mt-1 text-2xl font-semibold text-orange-600">{uninformedEmployees}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Late Login</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">{lateLoginEmployees}</div>
        </div>
      </div>

      {/* Time Settings */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Today's Time Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Safe Entry Time</label>
            <input
              type="time"
              value={timeSettings.safeEntryTime}
              onChange={(e) => handleTimeSettingChange('safeEntryTime', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lunch Start Time</label>
            <input
              type="time"
              value={timeSettings.lunchStartTime}
              onChange={(e) => handleTimeSettingChange('lunchStartTime', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lunch End Time</label>
            <input
              type="time"
              value={timeSettings.lunchEndTime}
              onChange={(e) => handleTimeSettingChange('lunchEndTime', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Safe Exit Time</label>
            <input
              type="time"
              value={timeSettings.safeExitTime}
              onChange={(e) => handleTimeSettingChange('safeExitTime', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Date and Filters */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              style={{ colorScheme: 'light' }}
            />
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
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
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
          <div className="flex items-end space-x-2">
            <button
              onClick={() => {
                setFilters({ department: 'All', designation: 'All', levelOfWork: 'All' })
              }}
              className="flex-1 h-10 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded hover:from-orange-500 hover:to-orange-700 font-medium transition-all duration-200"
            >
              Clear Filters
            </button>
            <button
              onClick={() => {
                setSelectedDate(new Date().toISOString().split('T')[0])
              }}
              className="flex-1 h-10 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded hover:from-orange-500 hover:to-orange-700 font-medium transition-all duration-200"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level of Work</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lunch Break</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">R. CheckOut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overtime <span className="text-blue-600">(Workers Only)</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Extra Overtime <span className="text-blue-600">(Workers Only)</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Snacks <span className="text-blue-600">(Workers Only)</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Night Bill <span className="text-blue-600">(Workers Only)</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attendance.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendance.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendance.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendance.levelOfWork}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleAttendanceCountClick(attendance)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                        attendance.attendanceCount >= 4 ? 'bg-green-100 text-green-800' :
                        attendance.attendanceCount >= 2 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                      title="Click to view scan times"
                    >
                      {attendance.attendanceCount}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getCheckInStatus(attendance.checkIn) === 'On-time' ? 'bg-green-100 text-green-800' :
                      getCheckInStatus(attendance.checkIn) === 'Accepted' ? 'bg-yellow-100 text-yellow-800' :
                      getCheckInStatus(attendance.checkIn) === 'Late Login' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getCheckInStatus(attendance.checkIn)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendance.lunchBreak}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-blue-600">{getRoundedCheckOut(attendance.checkOut)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatWorkingHours(calculateWorkingHours(attendance.checkIn, attendance.checkOut))}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendance.levelOfWork === 'Worker' ? (
                      formatOvertime(calculateOvertime(attendance.checkOut))
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendance.levelOfWork === 'Worker' ? (
                      formatOvertime(calculateExtraOvertime(attendance.checkOut))
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                     {attendance.levelOfWork === 'Worker' ? (
                       getSnacksEligibility(attendance.levelOfWork, calculateExtraOvertime(attendance.checkOut))
                     ) : (
                       <span className="text-gray-400">N/A</span>
                     )}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                     {attendance.levelOfWork === 'Worker' ? (
                       getNightBillEligibility(attendance.levelOfWork, calculateExtraOvertime(attendance.checkOut))
                     ) : (
                       <span className="text-gray-400">N/A</span>
                     )}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                     <button
                       onClick={() => handleEditClick(attendance)}
                       className="text-blue-600 hover:text-blue-900 font-medium"
                     >
                       Edit
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
         <h3 className="text-lg font-medium mb-4">Summary for {(() => {
           const date = new Date(selectedDate)
           const day = String(date.getDate()).padStart(2, '0')
           const month = String(date.getMonth() + 1).padStart(2, '0')
           const year = date.getFullYear()
           return `${day}/${month}/${year}`
         })()}</h3>
         <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
           <div className="text-center">
             <div className="text-2xl font-semibold text-green-600">{presentEmployees}</div>
             <div className="text-sm text-gray-500">Present Employees</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-semibold">{formatWorkingHours(totalWorkingHours)}</div>
             <div className="text-sm text-gray-500">Total Working Hours</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-semibold text-orange-600">{formatOvertime(totalOvertime)}</div>
             <div className="text-sm text-gray-500">Worker Overtime Only</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-semibold text-red-600">{formatOvertime(totalExtraOvertime)}</div>
             <div className="text-sm text-gray-500">Worker Extra Overtime Only</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-semibold text-green-600">{snacksEligibleCount}</div>
             <div className="text-sm text-gray-500">Snacks Eligible</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-semibold text-purple-600">{nightBillEligibleCount}</div>
             <div className="text-sm text-gray-500">Night Bill Eligible</div>
           </div>
         </div>
         <div className="mt-4 text-xs text-gray-500 text-center">
           * Overtime and Extra Overtime calculations are only applicable for Workers
         </div>
       </div>

      {/* Scan Times Modal */}
      {showScanModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Fingerprint Scan Times - {selectedEmployee.name}
                </h3>
                <button
                  onClick={() => setShowScanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Employee ID</p>
                      <p className="font-medium text-gray-900">{selectedEmployee.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium text-gray-900">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Designation</p>
                      <p className="font-medium text-gray-900">{selectedEmployee.designation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Scans</p>
                      <p className="font-medium text-gray-900">{selectedEmployee.attendanceCount}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Scan History</h4>
                  <div className="space-y-2">
                    {selectedEmployee.scans.map((scan, index) => (
                      <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            scan.type === 'Check In' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-900">{scan.type}</span>
                        </div>
                        <span className="text-sm text-gray-500 font-mono">{scan.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowScanModal(false)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded hover:from-orange-500 hover:to-orange-700 font-medium transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Attendance - {editingEmployee.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In Time</label>
                <input
                  type="time"
                  value={editForm.checkIn}
                  onChange={(e) => handleEditFormChange('checkIn', e.target.value)}
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out Time</label>
                <input
                  type="time"
                  value={editForm.checkOut}
                  onChange={(e) => handleEditFormChange('checkOut', e.target.value)}
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                <input
                  type="text"
                  value={formatWorkingHours(editForm.workingHours)}
                  readOnly
                  className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overtime (Hours)</label>
                <input
                  type="text"
                  value={formatOvertime(editForm.overtime)}
                  readOnly
                  className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extra Overtime (Hours)</label>
                <input
                  type="text"
                  value={formatOvertime(editForm.extraOvertime)}
                  readOnly
                  className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded hover:from-orange-500 hover:to-orange-700 font-medium transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
