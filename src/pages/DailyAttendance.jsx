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
    scans: [
      { time: '08:45', type: 'Check In' },
      { time: '19:30', type: 'Check Out' }
    ]
  },
  {
    id: 'EMP005',
    name: 'Mohammad Hassan',
    designation: 'Production Manager',
    department: 'Management',
    levelOfWork: 'Management',
    checkIn: '08:00',
    lunchBreak: '13:00-14:00',
    checkOut: '18:30',
    workingHours: 9.5,
    overtime: 1.5,
    extraOvertime: 0.0,
    status: 'Present',
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
    scans: [
      { time: '08:10', type: 'Check In' },
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
    scans: [
      { time: '08:25', type: 'Check In' },
      { time: '17:15', type: 'Check Out' }
    ]
  }
]

const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Quality Control', 'Management']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Cutting Master', 'Finishing Supervisor', 'Production Manager', 'Junior Tailor', 'Machine Operator', 'Quality Assistant']
const workLevels = ['All', 'Worker', 'Staff', 'Management']

export default function DailyAttendance() {
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

  // Filter attendance based on selected filters
  const filteredAttendance = useMemo(() => {
    return sampleAttendance.filter(attendance => {
      const matchesDepartment = filters.department === 'All' || attendance.department === filters.department
      const matchesDesignation = filters.designation === 'All' || attendance.designation === filters.designation
      const matchesLevelOfWork = filters.levelOfWork === 'All' || attendance.levelOfWork === filters.levelOfWork
      return matchesDepartment && matchesDesignation && matchesLevelOfWork
    })
  }, [filters])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleTimeSettingChange = (field, value) => {
    setTimeSettings(prev => ({ ...prev, [field]: value }))
  }



  const totalEmployees = filteredAttendance.length
  const presentEmployees = filteredAttendance.filter(emp => emp.status === 'Present').length
  const absentEmployees = filteredAttendance.filter(emp => emp.status === 'Absent').length
  const informedEmployees = filteredAttendance.filter(emp => emp.status === 'Informed').length
  const uninformedEmployees = filteredAttendance.filter(emp => emp.status === 'Uninformed').length
  const lateLoginEmployees = filteredAttendance.filter(emp => emp.status === 'Late Login').length
  const totalWorkingHours = filteredAttendance.reduce((sum, emp) => sum + emp.workingHours, 0)
  const totalOvertime = filteredAttendance.reduce((sum, emp) => sum + emp.overtime, 0)
  const totalExtraOvertime = filteredAttendance.reduce((sum, emp) => sum + emp.extraOvertime, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Daily Attendance</h1>
        <p className="text-sm text-gray-500">Track employee attendance from fingerprint machine</p>
        <p className="text-xs text-gray-400 mt-1">Standard Hours: {timeSettings.safeEntryTime} - {timeSettings.safeExitTime} | Overtime: {timeSettings.safeExitTime} - 7:00 PM | Extra Overtime: After 7:00 PM</p>
        <p className="text-xs text-gray-400 mt-1">Working Hours = (Check Out - Check In - 1 Hour Lunch Break)</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Date</div>
          <div className="mt-1 text-lg font-semibold">{new Date(selectedDate).toLocaleDateString()}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="text-sm text-gray-500">Total Employees</div>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ department: 'All', designation: 'All', levelOfWork: 'All' })
                setSelectedDate(new Date().toISOString().split('T')[0])
              }}
              className="w-full h-10 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
            >
              Clear Filters
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lunch Break</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Overtime</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendance.lunchBreak}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.workingHours}h</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      attendance.overtime > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {attendance.overtime}h
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      attendance.extraOvertime > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {attendance.extraOvertime}h
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-medium mb-4">Summary for {new Date(selectedDate).toLocaleDateString()}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">{presentEmployees}</div>
            <div className="text-sm text-gray-500">Present Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold">{totalWorkingHours.toFixed(2)}h</div>
            <div className="text-sm text-gray-500">Total Working Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600">{totalOvertime.toFixed(2)}h</div>
            <div className="text-sm text-gray-500">Total Overtime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-600">{totalExtraOvertime.toFixed(2)}h</div>
            <div className="text-sm text-gray-500">Total Extra Overtime</div>
          </div>
        </div>
      </div>
    </div>
  )
}
