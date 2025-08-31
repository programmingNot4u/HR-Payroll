import React, { useState } from 'react'

const Onboarding = () => {
  const [onboardingTasks, setOnboardingTasks] = useState([
    {
      id: 1,
      employeeName: 'Ahmed Rahman',
      position: 'Senior Production Manager',
      department: 'Production',
      startDate: '2024-02-15',
      status: 'In Progress',
      progress: 65,
      assignedHR: 'Fatima Begum',
      location: 'Dhaka Office',
      tasks: [
        { name: 'Complete HR Forms', status: 'Completed', dueDate: '2024-02-10' },
        { name: 'IT Setup & Access', status: 'Completed', dueDate: '2024-02-12' },
        { name: 'Department Orientation', status: 'In Progress', dueDate: '2024-02-14' },
        { name: 'Safety Training', status: 'Pending', dueDate: '2024-02-16' },
        { name: 'Team Introduction', status: 'Pending', dueDate: '2024-02-18' }
      ],
      documents: ['ID Card', 'Employee Handbook', 'Safety Manual', 'Department SOPs'],
      notes: 'Experienced manager, needs minimal training, focus on company-specific processes'
    },
    {
      id: 2,
      employeeName: 'Fatima Begum',
      position: 'Quality Control Supervisor',
      department: 'Quality Assurance',
      startDate: '2024-02-20',
      status: 'Not Started',
      progress: 0,
      assignedHR: 'Rashid Ahmed',
      location: 'Chittagong Office',
      tasks: [
        { name: 'Complete HR Forms', status: 'Pending', dueDate: '2024-02-15' },
        { name: 'IT Setup & Access', status: 'Pending', dueDate: '2024-02-17' },
        { name: 'Department Orientation', status: 'Pending', dueDate: '2024-02-19' },
        { name: 'Quality Standards Training', status: 'Pending', dueDate: '2024-02-21' },
        { name: 'Equipment Training', status: 'Pending', dueDate: '2024-02-23' }
      ],
      documents: ['ID Card', 'Employee Handbook', 'Quality Manual', 'Safety Guidelines'],
      notes: 'New to company, needs comprehensive training on quality systems and procedures'
    },
    {
      id: 3,
      employeeName: 'Karim Hossain',
      position: 'Fashion Designer',
      department: 'Design',
      startDate: '2024-02-25',
      status: 'Completed',
      progress: 100,
      assignedHR: 'Fatima Begum',
      location: 'Dhaka Office',
      tasks: [
        { name: 'Complete HR Forms', status: 'Completed', dueDate: '2024-02-20' },
        { name: 'IT Setup & Access', status: 'Completed', dueDate: '2024-02-22' },
        { name: 'Department Orientation', status: 'Completed', dueDate: '2024-02-24' },
        { name: 'Design Software Training', status: 'Completed', dueDate: '2024-02-26' },
        { name: 'Brand Guidelines', status: 'Completed', dueDate: '2024-02-28' }
      ],
      documents: ['ID Card', 'Employee Handbook', 'Design Manual', 'Brand Guidelines'],
      notes: 'Onboarding completed successfully, employee is productive and integrated'
    },
    {
      id: 4,
      employeeName: 'Nusrat Jahan',
      position: 'Machine Operator',
      department: 'Production',
      startDate: '2024-03-01',
      status: 'In Progress',
      progress: 40,
      assignedHR: 'Rashid Ahmed',
      location: 'Narayanganj Factory',
      tasks: [
        { name: 'Complete HR Forms', status: 'Completed', dueDate: '2024-02-25' },
        { name: 'Safety Training', status: 'Completed', dueDate: '2024-02-27' },
        { name: 'Machine Operation Training', status: 'In Progress', dueDate: '2024-03-02' },
        { name: 'Quality Standards', status: 'Pending', dueDate: '2024-03-04' },
        { name: 'Team Integration', status: 'Pending', dueDate: '2024-03-06' }
      ],
      documents: ['ID Card', 'Employee Handbook', 'Safety Manual', 'Machine Manuals'],
      notes: 'Good progress on safety training, needs more hands-on machine practice'
    },
    {
      id: 5,
      employeeName: 'Rashid Ahmed',
      position: 'HR Coordinator',
      department: 'Human Resources',
      startDate: '2024-03-05',
      status: 'Not Started',
      progress: 0,
      assignedHR: 'Fatima Begum',
      location: 'Dhaka Office',
      tasks: [
        { name: 'Complete HR Forms', status: 'Pending', dueDate: '2024-03-01' },
        { name: 'IT Setup & Access', status: 'Pending', dueDate: '2024-03-03' },
        { name: 'HR Systems Training', status: 'Pending', dueDate: '2024-03-05' },
        { name: 'Company Policies', status: 'Pending', dueDate: '2024-03-07' },
        { name: 'Recruitment Process', status: 'Pending', dueDate: '2024-03-09' }
      ],
      documents: ['ID Card', 'Employee Handbook', 'HR Manual', 'Policy Documents'],
      notes: 'Scheduled to start, will need comprehensive HR system training'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterLocation, setFilterLocation] = useState('')

  const statuses = ['Not Started', 'In Progress', 'Completed', 'On Hold']
  const departments = ['Production', 'Quality Assurance', 'Design', 'Human Resources', 'Finance', 'Marketing']
  const locations = ['Dhaka Office', 'Chittagong Office', 'Narayanganj Factory', 'Other']

  const filteredOnboarding = onboardingTasks.filter(task => {
    const matchesSearch = task.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === '' || task.status === filterStatus
    const matchesDepartment = filterDepartment === '' || task.department === filterDepartment
    const matchesLocation = filterLocation === '' || task.location === filterLocation

    return matchesSearch && matchesStatus && matchesDepartment && matchesLocation
  })

  const totalOnboarding = onboardingTasks.length
  const inProgress = onboardingTasks.filter(t => t.status === 'In Progress').length
  const completed = onboardingTasks.filter(t => t.status === 'Completed').length
  const avgProgress = Math.round(onboardingTasks.reduce((sum, t) => sum + t.progress, 0) / totalOnboarding)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Not Started': return 'bg-gray-100 text-gray-800'
      case 'On Hold': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Onboarding</h1>
          <p className="text-gray-600">Manage new employee onboarding process for RMG industry positions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Onboarding</p>
                <p className="text-2xl font-bold text-gray-900">{totalOnboarding}</p>
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
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
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
                placeholder="Search onboarding..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('')
                  setFilterDepartment('')
                  setFilterLocation('')
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Onboarding List */}
        <div className="space-y-4">
          {filteredOnboarding.map(onboarding => (
            <div key={onboarding.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{onboarding.employeeName}</h3>
                      <p className="text-lg text-gray-600 mb-2">{onboarding.position}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{onboarding.department}</span>
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(onboarding.status)}`}>
                          {onboarding.status}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">{onboarding.location}</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{onboarding.assignedHR}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 mb-1">{onboarding.startDate}</div>
                      <div className="text-lg text-blue-600 font-semibold">{onboarding.progress}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm font-medium text-gray-700">{onboarding.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${onboarding.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Start Date</p>
                      <p className="text-gray-900">{onboarding.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Assigned HR</p>
                      <p className="text-gray-900">{onboarding.assignedHR}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900">{onboarding.location}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Onboarding Tasks:</p>
                    <div className="space-y-2">
                      {onboarding.tasks.map((task, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${getTaskStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className="ml-3 text-gray-900">{task.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">Due: {task.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Required Documents:</p>
                    <div className="flex flex-wrap gap-2">
                      {onboarding.documents.map((doc, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Notes:</p>
                    <p className="text-gray-700">{onboarding.notes}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Onboarding ID:</span> #{onboarding.id}
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Update Progress
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                        Send Reminder
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOnboarding.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No onboarding tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Onboarding
