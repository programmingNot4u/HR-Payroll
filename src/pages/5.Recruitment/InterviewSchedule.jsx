import React, { useState } from 'react'

const InterviewSchedule = () => {
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      candidateName: 'Ahmed Rahman',
      position: 'Senior Production Manager',
      department: 'Production',
      interviewType: 'Panel Interview',
      date: '2024-02-05',
      time: '10:00 AM',
      duration: '60 minutes',
      location: 'Conference Room A, Dhaka Office',
      interviewers: ['HR Manager', 'Production Director', 'Operations Head'],
      status: 'Scheduled',
      priority: 'High',
      notes: 'Second round interview, focus on leadership and technical skills',
      candidateEmail: 'ahmed.rahman@email.com',
      candidatePhone: '+880 1712-345678',
      requirements: ['Resume', 'Portfolio', 'Reference Letters'],
      feedback: ''
    },
    {
      id: 2,
      candidateName: 'Fatima Begum',
      position: 'Quality Control Supervisor',
      department: 'Quality Assurance',
      interviewType: 'Technical Interview',
      date: '2024-02-06',
      time: '2:00 PM',
      duration: '45 minutes',
      location: 'Meeting Room 3, Chittagong Office',
      interviewers: ['QA Manager', 'Senior QC Supervisor'],
      status: 'Scheduled',
      priority: 'Medium',
      notes: 'First interview, assess technical knowledge and experience',
      candidateEmail: 'fatima.begum@email.com',
      candidatePhone: '+880 1812-345678',
      requirements: ['Resume', 'Certificates', 'Previous Work Samples'],
      feedback: ''
    },
    {
      id: 3,
      candidateName: 'Karim Hossain',
      position: 'Fashion Designer',
      department: 'Design',
      interviewType: 'Portfolio Review',
      date: '2024-02-07',
      time: '11:30 AM',
      duration: '90 minutes',
      location: 'Design Studio, Dhaka Office',
      interviewers: ['Creative Director', 'Senior Designer', 'HR Manager'],
      status: 'Scheduled',
      priority: 'High',
      notes: 'Portfolio presentation and design discussion, bring laptop',
      candidateEmail: 'karim.hossain@email.com',
      candidatePhone: '+880 1912-345678',
      requirements: ['Portfolio', 'Laptop', 'Design Samples', 'Sketchbook'],
      feedback: ''
    },
    {
      id: 4,
      candidateName: 'Nusrat Jahan',
      position: 'Machine Operator',
      department: 'Production',
      interviewType: 'Practical Test',
      date: '2024-02-08',
      time: '9:00 AM',
      duration: '120 minutes',
      location: 'Production Floor, Narayanganj Factory',
      interviewers: ['Production Supervisor', 'Senior Operator', 'HR Coordinator'],
      status: 'Scheduled',
      priority: 'Medium',
      notes: 'Practical machine operation test, safety briefing required',
      candidateEmail: 'nusrat.jahan@email.com',
      candidatePhone: '+880 1612-345678',
      requirements: ['Safety Gear', 'Work Clothes', 'ID Proof'],
      feedback: ''
    },
    {
      id: 5,
      candidateName: 'Rashid Ahmed',
      position: 'HR Coordinator',
      department: 'Human Resources',
      interviewType: 'Behavioral Interview',
      date: '2024-02-09',
      time: '3:30 PM',
      duration: '45 minutes',
      location: 'HR Office, Dhaka Office',
      interviewers: ['HR Manager', 'Senior HR Executive'],
      status: 'Cancelled',
      priority: 'Low',
      notes: 'Candidate withdrew application',
      candidateEmail: 'rashid.ahmed@email.com',
      candidatePhone: '+880 1512-345678',
      requirements: ['Resume', 'Cover Letter'],
      feedback: 'Application withdrawn by candidate'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterDate, setFilterDate] = useState('')

  const statuses = ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'No Show']
  const departments = ['Production', 'Quality Assurance', 'Design', 'Human Resources', 'Finance', 'Marketing']
  const interviewTypes = ['Panel Interview', 'Technical Interview', 'Portfolio Review', 'Practical Test', 'Behavioral Interview', 'Phone Screen']

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === '' || interview.status === filterStatus
    const matchesDepartment = filterDepartment === '' || interview.department === filterDepartment
    const matchesDate = filterDate === '' || interview.date === filterDate

    return matchesSearch && matchesStatus && matchesDepartment && matchesDate
  })

  const totalInterviews = interviews.length
  const scheduledInterviews = interviews.filter(i => i.status === 'Scheduled').length
  const completedInterviews = interviews.filter(i => i.status === 'Completed').length
  const todayInterviews = interviews.filter(i => i.date === new Date().toISOString().split('T')[0]).length

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'Rescheduled': return 'bg-yellow-100 text-yellow-800'
      case 'No Show': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Schedule</h1>
          <p className="text-gray-600">Manage interview appointments and recruitment process for RMG positions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{totalInterviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{scheduledInterviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedInterviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayInterviews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('')
                  setFilterDepartment('')
                  setFilterDate('')
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Interviews List */}
        <div className="space-y-4">
          {filteredInterviews.map(interview => (
            <div key={interview.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{interview.candidateName}</h3>
                      <p className="text-lg text-gray-600 mb-2">{interview.position}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{interview.department}</span>
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(interview.priority)}`}>
                          {interview.priority} Priority
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">{interview.interviewType}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 mb-1">{interview.date}</div>
                      <div className="text-lg text-blue-600 font-semibold">{interview.time}</div>
                      <div className="text-sm text-gray-500">{interview.duration}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900">{interview.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Candidate Email</p>
                      <p className="text-gray-900">{interview.candidateEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Candidate Phone</p>
                      <p className="text-gray-900">{interview.candidatePhone}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Interviewers:</p>
                    <div className="flex flex-wrap gap-2">
                      {interview.interviewers.map((interviewer, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {interviewer}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {interview.requirements.map((req, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Notes:</p>
                    <p className="text-gray-700">{interview.notes}</p>
                  </div>

                  {interview.feedback && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Feedback:</p>
                      <p className="text-gray-700">{interview.feedback}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Interview ID:</span> #{interview.id}
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                        Send Reminder
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInterviews.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewSchedule
